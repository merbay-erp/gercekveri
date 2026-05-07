import { db } from "@/lib/db";
import { findCityBySlug } from "@/lib/cities";
import { positionSlugFor } from "../position-resolver";
import type { SalarySubmissionView, SalaryStats, SalaryDataPayload } from "../types";

interface ListFilters {
  citySlug?: string;
  positionSlug?: string;
  limit?: number;
}

interface DbRow {
  publicId: string;
  amount: { toString(): string } | number | null;
  data: unknown;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: Date;
  city: { name: string; slug: string } | null;
  district: { name: string } | null;
}

async function fetchRows(filters: ListFilters, take?: number): Promise<DbRow[]> {
  const cityRecord = filters.citySlug ? findCityBySlug(filters.citySlug) : undefined;
  const cityId = cityRecord
    ? (await db.city.findUnique({ where: { slug: cityRecord.slug } }))?.id
    : undefined;

  // Position filtering happens in JS — Postgres can't easily slug-match the
  // free-text `position` field stored inside the JSON `data` blob. With our
  // current data volume (sub-10k rows) this is fine; Phase 2 adds a
  // normalized `position_slug` column with an index.
  const overFetch = filters.positionSlug ? Math.max(take ?? 50, 500) : take;

  const rows = await db.submission.findMany({
    where: {
      type: "SALARY",
      status: "APPROVED",
      ...(cityId ? { cityId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: overFetch,
    include: {
      city: { select: { name: true, slug: true } },
      district: { select: { name: true } },
    },
  });

  if (!filters.positionSlug) return rows as unknown as DbRow[];

  const wanted = filters.positionSlug;
  const filtered = rows.filter((row) => {
    const data = (row.data ?? {}) as Partial<SalaryDataPayload>;
    return data.position && positionSlugFor(data.position) === wanted;
  });
  return (take ? filtered.slice(0, take) : filtered) as unknown as DbRow[];
}

function rowToView(row: DbRow): SalarySubmissionView {
  const data = (row.data ?? {}) as Partial<SalaryDataPayload>;
  return {
    publicId: row.publicId,
    amount: row.amount ? Number(row.amount.toString()) : 0,
    currency: "TRY" as const,
    data: {
      position: data.position ?? "—",
      experienceYears: data.experienceYears ?? 0,
      workMode: data.workMode ?? "ONSITE",
      companySize: data.companySize,
      sector: data.sector,
      citySlug: data.citySlug ?? row.city?.slug ?? "",
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
}

export async function listSalarySubmissions(
  filters: ListFilters = {},
): Promise<SalarySubmissionView[]> {
  const limit = Math.min(filters.limit ?? 50, 200);
  const rows = await fetchRows(filters, limit);
  return rows.map(rowToView);
}

export async function getSalaryStats(filters: ListFilters = {}): Promise<SalaryStats> {
  const rows = await fetchRows(filters, undefined);

  const values = rows
    .map((r) => (r.amount ? Number(r.amount.toString()) : 0))
    .filter((n) => n > 0)
    .sort((a, b) => a - b);

  if (values.length === 0) {
    return { count: 0, avg: null, median: null, p25: null, p75: null, min: null, max: null };
  }

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

/**
 * Distinct value buckets used to drive sitemap + static params.
 * Returns slugs ordered by recent activity.
 */
export async function topPositionSlugs(limit = 50): Promise<string[]> {
  const rows = await db.submission.findMany({
    where: { type: "SALARY", status: "APPROVED" },
    select: { data: true },
    orderBy: { createdAt: "desc" },
    take: 1000,
  });
  const counts = new Map<string, number>();
  for (const row of rows) {
    const data = (row.data ?? {}) as Partial<SalaryDataPayload>;
    if (!data.position) continue;
    const slug = positionSlugFor(data.position);
    if (!slug) continue;
    counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([slug]) => slug);
}

export async function topCitySlugs(limit = 20): Promise<string[]> {
  const grouped = await db.submission.groupBy({
    by: ["cityId"],
    where: { type: "SALARY", status: "APPROVED", cityId: { not: null } },
    _count: { _all: true },
    orderBy: { _count: { id: "desc" } },
    take: limit,
  });
  const cityIds = grouped.map((g) => g.cityId!).filter(Boolean);
  const cities = await db.city.findMany({
    where: { id: { in: cityIds } },
    select: { id: true, slug: true },
  });
  const slugById = new Map(cities.map((c) => [c.id, c.slug]));
  return cityIds.map((id) => slugById.get(id)!).filter(Boolean);
}

export async function getRelatedPositions(
  citySlug: string,
  excludeSlug: string,
  limit = 6,
): Promise<{ slug: string; name: string; count: number }[]> {
  const cityRecord = findCityBySlug(citySlug);
  if (!cityRecord) return [];
  const city = await db.city.findUnique({ where: { slug: cityRecord.slug } });
  if (!city) return [];

  const rows = await db.submission.findMany({
    where: { type: "SALARY", status: "APPROVED", cityId: city.id },
    select: { data: true },
    take: 500,
  });
  const counts = new Map<string, { name: string; count: number }>();
  for (const row of rows) {
    const data = (row.data ?? {}) as Partial<SalaryDataPayload>;
    if (!data.position) continue;
    const slug = positionSlugFor(data.position);
    if (!slug || slug === excludeSlug) continue;
    const entry = counts.get(slug);
    if (entry) entry.count += 1;
    else counts.set(slug, { name: data.position, count: 1 });
  }
  return Array.from(counts.entries())
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function percentile(sortedValues: number[], p: number): number {
  if (sortedValues.length === 0) return 0;
  const idx = (sortedValues.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sortedValues[lo];
  return sortedValues[lo] + (sortedValues[hi] - sortedValues[lo]) * (idx - lo);
}
