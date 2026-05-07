import { db } from "@/lib/db";
import { findCityBySlug } from "@/lib/cities";
import type { SalarySubmissionView, SalaryStats, SalaryDataPayload } from "../types";

interface ListFilters {
  citySlug?: string;
  position?: string;
  limit?: number;
}

export async function listSalarySubmissions(
  filters: ListFilters = {},
): Promise<SalarySubmissionView[]> {
  const limit = Math.min(filters.limit ?? 50, 100);

  const cityRecord = filters.citySlug ? findCityBySlug(filters.citySlug) : undefined;
  const cityId = cityRecord
    ? (await db.city.findUnique({ where: { slug: cityRecord.slug } }))?.id
    : undefined;

  const rows = await db.submission.findMany({
    where: {
      type: "SALARY",
      status: "APPROVED",
      ...(cityId ? { cityId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      city: { select: { name: true } },
      district: { select: { name: true } },
    },
  });

  return rows.map((row) => {
    const data = (row.data ?? {}) as Partial<SalaryDataPayload>;
    return {
      publicId: row.publicId,
      amount: row.amount ? Number(row.amount) : 0,
      currency: "TRY" as const,
      data: {
        position: data.position ?? "—",
        experienceYears: data.experienceYears ?? 0,
        workMode: data.workMode ?? "ONSITE",
        companySize: data.companySize,
        sector: data.sector,
        citySlug: data.citySlug ?? "",
        districtSlug: data.districtSlug,
        cityName: row.city?.name ?? data.cityName,
        districtName: row.district?.name ?? data.districtName,
      },
      helpfulCount: row.helpfulCount,
      unhelpfulCount: row.unhelpfulCount,
      createdAt: row.createdAt,
      cityName: row.city?.name ?? null,
      districtName: row.district?.name ?? null,
    };
  });
}

export async function getSalaryStats(filters: ListFilters = {}): Promise<SalaryStats> {
  const cityRecord = filters.citySlug ? findCityBySlug(filters.citySlug) : undefined;
  const cityId = cityRecord
    ? (await db.city.findUnique({ where: { slug: cityRecord.slug } }))?.id
    : undefined;

  const rows = await db.submission.findMany({
    where: {
      type: "SALARY",
      status: "APPROVED",
      amount: { not: null },
      ...(cityId ? { cityId } : {}),
    },
    select: { amount: true },
  });

  if (rows.length === 0) {
    return { count: 0, avg: null, median: null, p25: null, p75: null, min: null, max: null };
  }

  const values = rows
    .map((r) => (r.amount ? Number(r.amount) : 0))
    .filter((n) => n > 0)
    .sort((a, b) => a - b);

  const count = values.length;
  const sum = values.reduce((s, v) => s + v, 0);
  const avg = sum / count;
  const median = percentile(values, 0.5);
  const p25 = percentile(values, 0.25);
  const p75 = percentile(values, 0.75);

  return {
    count,
    avg: Math.round(avg),
    median: Math.round(median),
    p25: Math.round(p25),
    p75: Math.round(p75),
    min: values[0],
    max: values[values.length - 1],
  };
}

function percentile(sortedValues: number[], p: number): number {
  if (sortedValues.length === 0) return 0;
  const idx = (sortedValues.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sortedValues[lo];
  return sortedValues[lo] + (sortedValues[hi] - sortedValues[lo]) * (idx - lo);
}
