"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

import { db } from "@/lib/db";
import { findCityBySlug } from "@/lib/cities";
import { hashIp, hashFingerprint, safeUserAgent } from "@/lib/fingerprint";
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
    const recentCount = await db.submission.count({
      where: {
        ipHash,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
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
      // Faz 0: auto-approve. Faz 2: PENDING + moderation queue.
      status: "APPROVED",
      approvedAt: new Date(),
      trustScore: 50,
      qualityScore: 50,
    },
    select: { publicId: true },
  });

  const positionSlug = positionSlugFor(data.position.trim());
  revalidatePath("/maaslar");
  revalidatePath(`/maaslar/${positionSlug}`);
  if (cityRecord) {
    revalidatePath(`/maaslar/sehir/${cityRecord.slug}`);
    revalidatePath(`/maaslar/${positionSlug}/${cityRecord.slug}`);
  }
  revalidatePath("/");

  return { ok: true, publicId: submission.publicId };
}
