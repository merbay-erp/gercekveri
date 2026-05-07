"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { after } from "next/server";

import { db } from "@/lib/db";
import { findCityBySlug } from "@/lib/cities";
import { hashIp, hashFingerprint, safeUserAgent } from "@/lib/fingerprint";
import { slugify } from "@/lib/slug";
import { postprocessSubmission } from "@/services/submission-postprocess";
import { tekstilInputSchema, type TekstilInput } from "../schema";
import { subTypeSlugs } from "../config";

type ActionResult =
  | { ok: true; publicId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createTekstilSubmission(
  input: TekstilInput,
): Promise<ActionResult> {
  const parsed = tekstilInputSchema.safeParse(input);
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
        type: "TEXTILE",
        ipHash,
        amount: data.unitPrice,
        cityId: cityFromDb?.id ?? null,
        districtId: districtFromDb?.id ?? null,
        // Same subType + same unit → likely dup
        AND: [
          { data: { path: ["subType"], equals: data.subType } },
          { data: { path: ["unit"], equals: data.unit } },
        ],
        createdAt: { gte: dupSince },
      },
      select: { id: true },
    });
    if (dup) {
      return {
        ok: false,
        error: "Bu fiyat paylaşımı yakın zamanda eklenmiş gibi görünüyor.",
      };
    }
  }

  // Outlier scoring scoped per subType+unit pair — kesim/parça ile
  // boyahane/kg birim fiyatları birbirinden çok farklı.
  let qualityScore = 50;
  if (cityFromDb) {
    const aggregate = await db.submission.aggregate({
      where: {
        type: "TEXTILE",
        status: "APPROVED",
        amount: { not: null },
        AND: [
          { data: { path: ["subType"], equals: data.subType } },
          { data: { path: ["unit"], equals: data.unit } },
        ],
      },
      _avg: { amount: true },
      _count: { _all: true },
    });
    const mean = aggregate._avg.amount ? Number(aggregate._avg.amount) : null;
    if (mean && aggregate._count._all >= 10) {
      const ratio = data.unitPrice / mean;
      if (ratio > 5 || ratio < 0.2) qualityScore -= 25;
      else if (ratio > 3 || ratio < 0.33) qualityScore -= 10;
    }
  }

  const submission = await db.submission.create({
    data: {
      type: "TEXTILE",
      cityId: cityFromDb?.id ?? null,
      districtId: districtFromDb?.id ?? null,
      amount: data.unitPrice,
      currency: "TRY",
      data: {
        subType: data.subType,
        unit: data.unit,
        minOrderQuantity: data.minOrderQuantity ?? null,
        fabricType: data.fabricType || null,
        colorCount: data.colorCount ?? null,
        customerType: data.customerType || null,
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
    select: { id: true, publicId: true },
  });

  const subSlug = subTypeSlugs[data.subType];
  revalidatePath("/tekstil");
  revalidatePath(`/tekstil/${subSlug}`);
  if (cityRecord) revalidatePath(`/tekstil/sehir/${cityRecord.slug}`);
  revalidatePath("/");

  after(() =>
    postprocessSubmission({
      submissionId: submission.id,
      publicId: submission.publicId,
      type: "TEXTILE",
      ipHash,
      qualityScore,
      amount: data.unitPrice,
      currency: "TRY",
      cityName: cityRecord.name,
    }),
  );

  return { ok: true, publicId: submission.publicId };
}
