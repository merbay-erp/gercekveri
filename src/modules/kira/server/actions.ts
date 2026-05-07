"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { after } from "next/server";

import { db } from "@/lib/db";
import { findCityBySlug } from "@/lib/cities";
import { hashIp, hashFingerprint, safeUserAgent } from "@/lib/fingerprint";
import { slugify } from "@/lib/slug";
import { postprocessSubmission } from "@/services/submission-postprocess";
import { rentInputSchema, type RentInput } from "../schema";

type ActionResult =
  | { ok: true; publicId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Anonymous rent submission. Mirrors the salary action's anti-abuse
 * pipeline (rate limit + duplicate guard + outlier scoring) so quality
 * signals stay consistent across modules.
 *
 * Districts are created on-demand: if the user types a district name we
 * upsert into the District table — no need to pre-seed every neighborhood.
 */
export async function createRentSubmission(input: RentInput): Promise<ActionResult> {
  const parsed = rentInputSchema.safeParse(input);
  if (!parsed.success) {
    const tree = parsed.error.flatten();
    return {
      ok: false,
      error: "Form geçersiz, lütfen alanları kontrol et.",
      fieldErrors: tree.fieldErrors as Record<string, string[]>,
    };
  }

  const data = parsed.data;

  if (data.website && data.website.length > 0) {
    return { ok: false, error: "İsteğin işlenemedi." };
  }

  const cityRecord = findCityBySlug(data.citySlug);
  if (!cityRecord) {
    return { ok: false, error: "Geçersiz şehir." };
  }

  const headerList = await headers();
  const ipRaw = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const ua = headerList.get("user-agent");
  const acceptLang = headerList.get("accept-language");

  const ipHash = hashIp(ipRaw);
  const fingerprint = hashFingerprint({ ua, lang: acceptLang });

  if (ipHash) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentCount = await db.submission.count({
      where: { ipHash, createdAt: { gte: since } },
    });
    if (recentCount >= 10) {
      return { ok: false, error: "Bugünlük gönderim limitine ulaştın." };
    }
  }

  const cityFromDb = await db.city.findUnique({ where: { slug: cityRecord.slug } });
  let districtFromDb = null;
  const districtNameTrimmed = data.districtName?.trim() || "";
  if (districtNameTrimmed && cityFromDb) {
    const districtSlug = slugify(districtNameTrimmed);
    if (districtSlug) {
      districtFromDb = await db.district.upsert({
        where: { cityId_slug: { cityId: cityFromDb.id, slug: districtSlug } },
        update: { name: districtNameTrimmed },
        create: { cityId: cityFromDb.id, slug: districtSlug, name: districtNameTrimmed },
      });
    }
  }

  if (ipHash) {
    const dupSince = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dup = await db.submission.findFirst({
      where: {
        type: "RENT",
        ipHash,
        amount: data.rentPrice,
        cityId: cityFromDb?.id ?? null,
        districtId: districtFromDb?.id ?? null,
        createdAt: { gte: dupSince },
      },
      select: { id: true },
    });
    if (dup) {
      return {
        ok: false,
        error: "Bu kira ilanını zaten yakın zamanda paylaşmışsın gibi görünüyor.",
      };
    }
  }

  // Outlier signal: drop quality for rent prices way outside the city/district
  // distribution. Same approach as salary — don't reject, just flag.
  let qualityScore = 50;
  if (cityFromDb) {
    const cityAggregate = await db.submission.aggregate({
      where: {
        type: "RENT",
        cityId: cityFromDb.id,
        status: "APPROVED",
        amount: { not: null },
      },
      _avg: { amount: true },
      _count: { _all: true },
    });
    const cityMean = cityAggregate._avg.amount ? Number(cityAggregate._avg.amount) : null;
    const cityCount = cityAggregate._count._all;
    if (cityMean && cityCount >= 10) {
      const ratio = data.rentPrice / cityMean;
      if (ratio > 5 || ratio < 0.2) qualityScore -= 25;
      else if (ratio > 3 || ratio < 0.33) qualityScore -= 10;
    }
  }

  const submission = await db.submission.create({
    data: {
      type: "RENT",
      cityId: cityFromDb?.id ?? null,
      districtId: districtFromDb?.id ?? null,
      amount: data.rentPrice,
      currency: "TRY",
      data: {
        roomCount: data.roomCount,
        m2: data.m2,
        buildingAge: data.buildingAge,
        furnished: data.furnished,
        heating: data.heating || null,
        citySlug: data.citySlug,
        districtName: districtNameTrimmed || null,
        cityName: cityRecord.name,
        listedPrice:
          data.listedPrice && data.listedPrice > 0 ? data.listedPrice : null,
      },
      ipHash,
      fingerprint,
      userAgent: safeUserAgent(ua),
      status: "APPROVED",
      approvedAt: new Date(),
      trustScore: 50,
      qualityScore,
    },
    select: { id: true, publicId: true },
  });

  revalidatePath("/kira");
  if (cityRecord) revalidatePath(`/kira/sehir/${cityRecord.slug}`);
  revalidatePath("/");

  after(() =>
    postprocessSubmission({
      submissionId: submission.id,
      publicId: submission.publicId,
      type: "RENT",
      ipHash,
      qualityScore,
      amount: data.rentPrice,
      currency: "TRY",
      cityName: cityRecord.name,
    }),
  );

  return { ok: true, publicId: submission.publicId };
}
