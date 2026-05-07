import { db } from "@/lib/db";
import { findCityBySlug } from "@/lib/cities";
import type { AmountStats } from "@/components/data-display/amount-stats";
import type { FaturaSubmissionView, FaturaDataPayload } from "../types";
import type { UtilityType, HouseholdSize } from "../config";

interface ListFilters {
  citySlug?: string;
  utilityType?: UtilityType;
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
      type: "UTILITY",
      status: "APPROVED",
      ...(cityId ? { cityId } : {}),
      ...(filters.utilityType
        ? { data: { path: ["utilityType"], equals: filters.utilityType } }
        : {}),
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

function rowToView(row: DbRow): FaturaSubmissionView {
  const data = (row.data ?? {}) as Partial<FaturaDataPayload>;
  return {
    publicId: row.publicId,
    amount: row.amount ? Number(row.amount.toString()) : 0,
    currency: "TRY" as const,
    data: {
      utilityType: (data.utilityType as UtilityType) ?? "ELEKTRIK",
      consumption: typeof data.consumption === "number" ? data.consumption : 0,
      householdSize: (data.householdSize as HouseholdSize) ?? "2",
      billingMonth: data.billingMonth ?? "",
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

export async function listFaturaSubmissions(
  filters: ListFilters = {},
): Promise<FaturaSubmissionView[]> {
  const limit = Math.min(filters.limit ?? 50, 200);
  const rows = await fetchRows(filters, limit);
  return rows.map(rowToView);
}

export async function getFaturaStats(filters: ListFilters = {}): Promise<AmountStats> {
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
 * Per-utility unit cost: bill amount / consumption. Useful for showing
 * "₺/kWh" or "₺/m³" in the UI — much more comparable than raw bill totals
 * across households of different sizes.
 */
export interface FaturaUnitCostStats {
  count: number;
  median: number | null;
  p25: number | null;
  p75: number | null;
}

export async function getFaturaUnitCostStats(
  filters: ListFilters = {},
): Promise<FaturaUnitCostStats> {
  const rows = await fetchRows(filters, undefined);

  const unitCosts = rows
    .map((r) => {
      const amount = r.amount ? Number(r.amount.toString()) : 0;
      const data = (r.data ?? {}) as Partial<FaturaDataPayload>;
      const consumption = typeof data.consumption === "number" ? data.consumption : 0;
      if (amount <= 0 || consumption <= 0) return 0;
      return amount / consumption;
    })
    .filter((n) => n > 0)
    .sort((a, b) => a - b);

  if (unitCosts.length === 0) {
    return { count: 0, median: null, p25: null, p75: null };
  }

  return {
    count: unitCosts.length,
    median: round2(percentile(unitCosts, 0.5)),
    p25: round2(percentile(unitCosts, 0.25)),
    p75: round2(percentile(unitCosts, 0.75)),
  };
}

export async function topFaturaCitySlugs(limit = 20): Promise<string[]> {
  const grouped = await db.submission.groupBy({
    by: ["cityId"],
    where: { type: "UTILITY", status: "APPROVED", cityId: { not: null } },
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

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
