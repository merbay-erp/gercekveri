import { db } from "@/lib/db";
import { findCityBySlug } from "@/lib/cities";
import { PUBLIC_SUBMISSION_FILTER } from "@/lib/submission-filters";
import type {
  InternetDataPayload,
  InternetMultiStats,
  InternetSubmissionView,
  IspSlug,
  OutageFrequency,
} from "../types";
import { outageStabilityScore } from "../config";

interface ListFilters {
  citySlug?: string;
  isp?: IspSlug;
  limit?: number;
}

interface DbRow {
  publicId: string;
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

  const overFetch = filters.isp ? Math.max(take ?? 50, 500) : take;

  const rows = await db.submission.findMany({
    where: {
      ...PUBLIC_SUBMISSION_FILTER,
      type: "INTERNET",
      ...(cityId ? { cityId } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: overFetch,
    include: {
      city: { select: { name: true, slug: true } },
      district: { select: { name: true } },
    },
  });

  if (!filters.isp) return rows as unknown as DbRow[];

  // ISP filter happens in JS — same trade-off as salary's positionSlug
  // filter. With current volume it's fine; Phase 4 promotes ISP to a
  // dedicated indexed column.
  const wanted = filters.isp;
  const filtered = rows.filter((row) => {
    const data = (row.data ?? {}) as Partial<InternetDataPayload>;
    return data.isp === wanted;
  });
  return (take ? filtered.slice(0, take) : filtered) as unknown as DbRow[];
}

function rowToView(row: DbRow): InternetSubmissionView {
  const data = (row.data ?? {}) as Partial<InternetDataPayload>;
  return {
    publicId: row.publicId,
    data: {
      isp: data.isp ?? "diger",
      packageSpeedMbps: data.packageSpeedMbps ?? 0,
      realSpeedMbps: data.realSpeedMbps ?? 0,
      pingMs: data.pingMs ?? 0,
      satisfaction: data.satisfaction ?? 0,
      outageFrequency: data.outageFrequency ?? "MONTHLY",
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

function median(sorted: number[]): number | null {
  if (sorted.length === 0) return null;
  const idx = Math.floor((sorted.length - 1) / 2);
  if (sorted.length % 2 === 1) return sorted[idx];
  return (sorted[idx] + sorted[idx + 1]) / 2;
}

function mean(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

export async function listInternetSubmissions(
  filters: ListFilters = {},
): Promise<InternetSubmissionView[]> {
  const limit = Math.min(filters.limit ?? 50, 200);
  const rows = await fetchRows(filters, limit);
  return rows.map(rowToView);
}

export async function getInternetStats(
  filters: ListFilters = {},
): Promise<InternetMultiStats> {
  const rows = await fetchRows(filters, undefined);
  if (rows.length === 0) {
    return {
      count: 0,
      medianRealSpeed: null,
      avgRealSpeed: null,
      medianPackageSpeed: null,
      speedEfficiency: null,
      medianPing: null,
      avgSatisfaction: null,
      stabilityScore: null,
    };
  }

  const realSpeeds = rows
    .map((r) => (r.data as Partial<InternetDataPayload>).realSpeedMbps ?? 0)
    .filter((n) => n > 0);
  const packageSpeeds = rows
    .map((r) => (r.data as Partial<InternetDataPayload>).packageSpeedMbps ?? 0)
    .filter((n) => n > 0);
  const pings = rows
    .map((r) => (r.data as Partial<InternetDataPayload>).pingMs ?? 0)
    .filter((n) => n > 0);
  const satisfactions = rows
    .map((r) => (r.data as Partial<InternetDataPayload>).satisfaction ?? 0)
    .filter((n) => n > 0);
  const stabilityScores = rows
    .map((r) => {
      const o = (r.data as Partial<InternetDataPayload>).outageFrequency as
        | OutageFrequency
        | undefined;
      return o ? outageStabilityScore[o] : null;
    })
    .filter((n): n is number => n !== null);

  const sortedReal = [...realSpeeds].sort((a, b) => a - b);
  const sortedPackage = [...packageSpeeds].sort((a, b) => a - b);
  const sortedPing = [...pings].sort((a, b) => a - b);

  const medianRealSpeed = median(sortedReal);
  const medianPackageSpeed = median(sortedPackage);
  const efficiency =
    medianRealSpeed !== null && medianPackageSpeed !== null && medianPackageSpeed > 0
      ? medianRealSpeed / medianPackageSpeed
      : null;

  return {
    count: rows.length,
    medianRealSpeed: medianRealSpeed ? Math.round(medianRealSpeed) : null,
    avgRealSpeed: mean(realSpeeds) ? Math.round(mean(realSpeeds)!) : null,
    medianPackageSpeed: medianPackageSpeed ? Math.round(medianPackageSpeed) : null,
    speedEfficiency: efficiency,
    medianPing: median(sortedPing) ? Math.round(median(sortedPing)!) : null,
    avgSatisfaction: mean(satisfactions) ? Math.round(mean(satisfactions)! * 10) / 10 : null,
    stabilityScore: mean(stabilityScores),
  };
}

/**
 * Per-ISP rollup — used for the index page to show all providers as a
 * comparable table. Returned in descending count order.
 */
export interface IspRollup extends InternetMultiStats {
  isp: IspSlug;
}

export async function getIspRollups(citySlug?: string): Promise<IspRollup[]> {
  const allIsps: IspSlug[] = [
    "turk-telekom",
    "superonline",
    "vodafone",
    "turknet",
    "millenicom",
    "d-smart",
    "diger",
  ];
  const rollups = await Promise.all(
    allIsps.map(async (isp) => {
      const stats = await getInternetStats({ isp, citySlug });
      return { isp, ...stats };
    }),
  );
  return rollups.filter((r) => r.count > 0).sort((a, b) => b.count - a.count);
}

export async function topInternetCitySlugs(limit = 20): Promise<string[]> {
  const grouped = await db.submission.groupBy({
    by: ["cityId"],
    where: { ...PUBLIC_SUBMISSION_FILTER, type: "INTERNET", cityId: { not: null } },
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
