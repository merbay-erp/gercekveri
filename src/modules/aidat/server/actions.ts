"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/lib/db";
import { findCityBySlug } from "@/lib/cities";
import { hashIp, hashFingerprint, safeUserAgent } from "@/lib/fingerprint";
import { slugify } from "@/lib/slug";
import { aidatInputSchema, type AidatInput } from "../schema";
import { amenityOrder, type AmenityKey } from "../config";

type ActionResult =
  | { ok: true; publicId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createAidatSubmission(input: AidatInput): Promise<ActionResult> {
  const parsed = aidatInputSchema.safeParse(input);
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
  if (!cityRecord) return { ok: false, error: "Geçersiz şehir." };

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
        type: "AIDAT",
        ipHash,
        amount: data.aidatAmount,
        cityId: cityFromDb?.id ?? null,
        districtId: districtFromDb?.id ?? null,
        createdAt: { gte: dupSince },
      },
      select: { id: true },
    });
    if (dup) {
      return {
        ok: false,
        error: "Bu aidat ilanını yakın zamanda paylaşmışsın gibi görünüyor.",
      };
    }
  }

  let qualityScore = 50;
  if (cityFromDb) {
    const cityAggregate = await db.submission.aggregate({
      where: {
        type: "AIDAT",
        cityId: cityFromDb.id,
        status: "APPROVED",
        amount: { not: null },
      },
      _avg: { amount: true },
      _count: { _all: true },
    });
    const cityMean = cityAggregate._avg.amount ? Number(cityAggregate._avg.amount) : null;
    if (cityMean && cityAggregate._count._all >= 10) {
      const ratio = data.aidatAmount / cityMean;
      if (ratio > 5 || ratio < 0.2) qualityScore -= 25;
      else if (ratio > 3 || ratio < 0.33) qualityScore -= 10;
    }
  }

  // Reduce the booleans down to a tagged array — easier to serialize and
  // works identically to a multi-select on the read side.
  const amenities: AmenityKey[] = amenityOrder.filter((key) => Boolean(data[key]));

  const submission = await db.submission.create({
    data: {
      type: "AIDAT",
      cityId: cityFromDb?.id ?? null,
      districtId: districtFromDb?.id ?? null,
      amount: data.aidatAmount,
      currency: "TRY",
      data: {
        siteType: data.siteType,
        m2: data.m2,
        buildingAge: data.buildingAge,
        amenities,
        citySlug: data.citySlug,
        districtName: districtNameTrimmed || null,
        cityName: cityRecord.name,
      },
      ipHash,
      fingerprint,
      userAgent: safeUserAgent(ua),
      status: "APPROVED",
      approvedAt: new Date(),
      trustScore: 50,
      qualityScore,
    },
    select: { publicId: true },
  });

  revalidatePath("/aidat");
  if (cityRecord) revalidatePath(`/aidat/sehir/${cityRecord.slug}`);
  revalidatePath("/");

  return { ok: true, publicId: submission.publicId };
}
