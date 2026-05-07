"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/lib/db";
import { findCityBySlug } from "@/lib/cities";
import { hashIp, hashFingerprint, safeUserAgent } from "@/lib/fingerprint";
import { slugify } from "@/lib/slug";
import { internetInputSchema, type InternetInput } from "../schema";

type ActionResult =
  | { ok: true; publicId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createInternetSubmission(
  input: InternetInput,
): Promise<ActionResult> {
  const parsed = internetInputSchema.safeParse(input);
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

  // Sanity: real speed shouldn't claim more than 1.5x the package speed —
  // most ISPs cap at the package speed, allow some headroom for measurement
  // noise but reject obvious nonsense.
  if (data.realSpeedMbps > data.packageSpeedMbps * 1.5) {
    return {
      ok: false,
      error: "Gerçek hız, paket hızının çok üstünde. Değerleri kontrol eder misin?",
    };
  }

  // Outlier guard for real speed — drop quality if measurement is far
  // outside the city distribution.
  let qualityScore = 50;
  if (cityFromDb) {
    const recentSamples = await db.submission.findMany({
      where: {
        type: "INTERNET",
        cityId: cityFromDb.id,
        status: "APPROVED",
      },
      select: { data: true },
      take: 200,
    });
    const realSpeeds = recentSamples
      .map((r) => {
        const d = r.data as { realSpeedMbps?: number };
        return d.realSpeedMbps ?? 0;
      })
      .filter((n) => n > 0);
    if (realSpeeds.length >= 10) {
      const mean = realSpeeds.reduce((s, v) => s + v, 0) / realSpeeds.length;
      const ratio = data.realSpeedMbps / mean;
      if (ratio > 5 || ratio < 0.1) qualityScore -= 25;
      else if (ratio > 3 || ratio < 0.2) qualityScore -= 10;
    }
  }

  const submission = await db.submission.create({
    data: {
      type: "INTERNET",
      cityId: cityFromDb?.id ?? null,
      districtId: districtFromDb?.id ?? null,
      // Use real speed as the primary "amount" so generic stat queries can
      // work without special casing — TRY symbol won't appear since we
      // never call formatTRY for internet rows.
      amount: data.realSpeedMbps,
      currency: "TRY",
      data: {
        isp: data.isp,
        packageSpeedMbps: data.packageSpeedMbps,
        realSpeedMbps: data.realSpeedMbps,
        pingMs: data.pingMs,
        satisfaction: data.satisfaction,
        outageFrequency: data.outageFrequency,
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

  revalidatePath("/internet");
  revalidatePath(`/internet/${data.isp}`);
  if (cityRecord) {
    revalidatePath(`/internet/sehir/${cityRecord.slug}`);
  }
  revalidatePath("/");

  return { ok: true, publicId: submission.publicId };
}
