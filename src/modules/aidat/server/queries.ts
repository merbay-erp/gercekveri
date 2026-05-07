import { db } from "@/lib/db";
import { findCityBySlug } from "@/lib/cities";
import { PUBLIC_SUBMISSION_FILTER } from "@/lib/submission-filters";
import type { AmountStats } from "@/components/data-display/amount-stats";
import type { AidatSubmissionView, AidatDataPayload } from "../types";
import type { AmenityKey } from "../config";

interface ListFilters {
  citySlug?: string;
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

  const rows = await db.submission.findMany({
    where: {
      ...PUBLIC_SUBMISSION_FILTER,
      type: "AIDAT",
      ...(cityId ? { cityId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take,
    include: {
      city: { select: { name: true, slug: true } },
      district: { select: { name: true } },
    },
  });

  return rows as unknown as DbRow[];
}

function rowToView(row: DbRow): AidatSubmissionView {
  const data = (row.data ?? {}) as Partial<AidatDataPayload>;
  return {
    publicId: row.publicId,
    amount: row.amount ? Number(row.amount.toString()) : 0,
    currency: "TRY" as const,
    data: {
      siteType: data.siteType ?? "BLOCK",
      m2: data.m2 ?? 0,
      buildingAge: data.buildingAge ?? "0-5",
      amenities: Array.isArray(data.amenities) ? (data.amenities as AmenityKey[]) : [],
      citySlug: data.citySlug ?? row.city?.slug ?? "",
      districtName: data.districtName ?? row.district?.name,
      cityName: row.city?.name ?? data.cityName,
    },
    helpfulCount: row.helpfulCount,
    unhelpfulCount: row.unhelpfulCount,
    createdAt: row.createdAt,
    cityName: row.city?.name ?? null,
    districtName: row.district?.name ?? null,
  };
}

export async function listAidatSubmissions(
  filters: ListFilters = {},
): Promise<AidatSubmissionView[]> {
  const limit = Math.min(filters.limit ?? 50, 200);
  const rows = await fetchRows(filters, limit);
  return rows.map(rowToView);
}

export async function getAidatStats(filters: ListFilters = {}): Promise<AmountStats> {
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

export async function topAidatCitySlugs(limit = 20): Promise<string[]> {
  const grouped = await db.submission.groupBy({
    by: ["cityId"],
    where: { ...PUBLIC_SUBMISSION_FILTER, type: "AIDAT", cityId: { not: null } },
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

function percentile(sortedValues: number[], p: number): number {
  if (sortedValues.length === 0) return 0;
  const idx = (sortedValues.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sortedValues[lo];
  return sortedValues[lo] + (sortedValues[hi] - sortedValues[lo]) * (idx - lo);
}
