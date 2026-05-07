"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { after } from "next/server";

import { db } from "@/lib/db";
import { findCityBySlug } from "@/lib/cities";
import { hashIp, hashFingerprint, safeUserAgent } from "@/lib/fingerprint";
import { postprocessSubmission } from "@/services/submission-postprocess";
import { positionSlugFor } from "../position-resolver";
import { salaryInputSchema, type SalaryInput } from "../schema";

type ActionResult =
  | { ok: true; publicId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

/**
 * Anonymous salary submission.
 *
 * Faz 0: auto-approves submissions so the data flywheel can start.
 * Faz 2: switch default to PENDING and run through the moderation pipeline.
 */
export async function createSalarySubmission(input: SalaryInput): Promise<ActionResult> {
  const parsed = salaryInputSchema.safeParse(input);
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
  if (data.districtSlug && cityFromDb) {
    districtFromDb = await db.district.findUnique({
      where: { cityId_slug: { cityId: cityFromDb.id, slug: data.districtSlug } },
    });
  }

  // Content-hash duplicate guard: same IP + same amount + same city within
  // the last 7 days is almost certainly a re-submission of the same record.
  if (ipHash) {
    const dupSince = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const dup = await db.submission.findFirst({
      where: {
        type: "SALARY",
        ipHash,
        amount: data.netSalary,
        cityId: cityFromDb?.id ?? null,
        createdAt: { gte: dupSince },
      },
      select: { id: true },
    });
    if (dup) {
      return {
        ok: false,
        error: "Bu girdiyi zaten yakın zamanda paylaşmışsın gibi görünüyor.",
      };
    }
  }

  // Outlier signal: drop quality score for amounts that fall far outside the
  // current city distribution. We don't reject — quality just falls below
  // 50 so future moderation can prioritise review.
  let qualityScore = 50;
  if (cityFromDb) {
    const cityAggregate = await db.submission.aggregate({
      where: {
        type: "SALARY",
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
      const ratio = data.netSalary / cityMean;
      if (ratio > 5 || ratio < 0.2) qualityScore -= 25;
      else if (ratio > 3 || ratio < 0.33) qualityScore -= 10;
    }
  }

  const submission = await db.submission.create({
    data: {
      type: "SALARY",
      cityId: cityFromDb?.id ?? null,
      districtId: districtFromDb?.id ?? null,
      amount: data.netSalary,
      currency: "TRY",
      data: {
        position: data.position.trim(),
        positionSlug: positionSlugFor(data.position.trim()),
        experienceYears: data.experienceYears,
        workMode: data.workMode,
        companySize: data.companySize || null,
        sector: data.sector?.trim() || null,
        citySlug: data.citySlug,
        districtSlug: data.districtSlug || null,
        cityName: cityRecord.name,
        districtName: districtFromDb?.name ?? null,
      },
      ipHash,
      fingerprint,
      userAgent: safeUserAgent(ua),
      // Faz 2: still auto-approve, but qualityScore is computed from
      // outlier signals so admins can prioritize moderation. PENDING +
      // human review comes once volume justifies it.
      status: "APPROVED",
      approvedAt: new Date(),
      trustScore: 50,
      qualityScore,
    },
    select: { id: true, publicId: true },
  });

  const positionSlug = positionSlugFor(data.position.trim());
  revalidatePath("/maaslar");
  revalidatePath(`/maaslar/${positionSlug}`);
  if (cityRecord) {
    revalidatePath(`/maaslar/sehir/${cityRecord.slug}`);
    revalidatePath(`/maaslar/${positionSlug}/${cityRecord.slug}`);
  }
  revalidatePath("/");

  after(() =>
    postprocessSubmission({
      submissionId: submission.id,
      publicId: submission.publicId,
      type: "SALARY",
      ipHash,
      qualityScore,
      amount: data.netSalary,
      currency: "TRY",
      cityName: cityRecord?.name ?? null,
    }),
  );

  return { ok: true, publicId: submission.publicId };
}
