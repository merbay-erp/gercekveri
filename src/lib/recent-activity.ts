/**
 * Recent activity helpers — drives the homepage "Şu an ne oluyor?" panel.
 *
 * Excludes demo seed (`ipHash` starting with `demo-`) so the feed reflects
 * real users only. Not strictly real-time — anasayfa ISR's at 60s.
 */
import { db } from "@/lib/db";

const REAL_FILTER = {
  status: "APPROVED" as const,
  NOT: { ipHash: { startsWith: "demo-" } },
};

export interface CategoryDelta {
  type: string;
  thisPeriod: number;
  prevPeriod: number;
  /** Percent change vs prev period; null when no prior data */
  deltaPct: number | null;
}

const ALL_TYPES = ["SALARY", "RENT", "AIDAT", "INTERNET", "UTILITY", "TEXTILE"] as const;

/**
 * Per-category 7-day count vs previous 7-day count. Used to surface
 * "X kategorisi son 7 günde +%Y" style chips.
 */
export async function getCategoryDeltas(): Promise<CategoryDelta[]> {
  const now = Date.now();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

  const [thisPeriod, prevPeriod] = await Promise.all([
    db.submission.groupBy({
      by: ["type"],
      where: { ...REAL_FILTER, createdAt: { gte: sevenDaysAgo } },
      _count: { _all: true },
    }),
    db.submission.groupBy({
      by: ["type"],
      where: {
        ...REAL_FILTER,
        createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
      },
      _count: { _all: true },
    }),
  ]);

  const thisMap = new Map(thisPeriod.map((r) => [r.type, r._count._all]));
  const prevMap = new Map(prevPeriod.map((r) => [r.type, r._count._all]));

  return ALL_TYPES.map((type) => {
    const t = thisMap.get(type) ?? 0;
    const p = prevMap.get(type) ?? 0;
    const deltaPct = p === 0 ? (t === 0 ? null : null) : Math.round(((t - p) / p) * 100);
    return { type, thisPeriod: t, prevPeriod: p, deltaPct };
  });
}

export interface RecentSubmissionItem {
  publicId: string;
  type: string;
  createdAt: Date;
  cityName: string | null;
  districtName: string | null;
  amount: number | null;
  /** Headline summary from data payload — varies per type */
  summary: string;
}

const TYPE_LABELS: Record<string, string> = {
  SALARY: "Maaş",
  RENT: "Kira",
  AIDAT: "Aidat",
  INTERNET: "İnternet",
  UTILITY: "Fatura",
  TEXTILE: "Tekstil",
};

/**
 * Most recent N real submissions, distilled into a single human-readable
 * line per row.
 */
export async function getRecentSubmissions(limit = 8): Promise<RecentSubmissionItem[]> {
  const rows = await db.submission.findMany({
    where: REAL_FILTER,
    orderBy: { createdAt: "desc" },
    take: limit,
    select: {
      publicId: true,
      type: true,
      amount: true,
      data: true,
      createdAt: true,
      city: { select: { name: true } },
      district: { select: { name: true } },
    },
  });

  return rows.map((r) => {
    const data = (r.data ?? {}) as Record<string, unknown>;
    let summary = TYPE_LABELS[r.type] ?? r.type;
    if (r.type === "SALARY" && typeof data.positionName === "string") {
      summary = `${data.positionName} maaşı`;
    } else if (r.type === "RENT" && typeof data.roomCount === "string") {
      summary = `${data.roomCount} kira`;
    } else if (r.type === "AIDAT") {
      summary = "Site aidatı";
    } else if (r.type === "INTERNET" && typeof data.isp === "string") {
      summary = `${data.isp} internet`;
    } else if (r.type === "UTILITY" && typeof data.utilityType === "string") {
      const utilLabel: Record<string, string> = {
        ELEKTRIK: "Elektrik",
        DOGALGAZ: "Doğalgaz",
        SU: "Su",
      };
      summary = `${utilLabel[data.utilityType as string] ?? data.utilityType} faturası`;
    } else if (r.type === "TEXTILE" && typeof data.subType === "string") {
      const subLabel: Record<string, string> = {
        KESIM: "Kesim",
        DIKIM: "Dikim",
        BOYAHANE: "Boyahane",
        BASKI: "Baskı",
        NAKIS: "Nakış",
        UTU_PAKETLEME: "Ütü-paketleme",
        KUMAS_URETIM: "Kumaş üretim",
      };
      summary = `${subLabel[data.subType as string] ?? data.subType} fiyatı`;
    }

    return {
      publicId: r.publicId,
      type: r.type,
      createdAt: r.createdAt,
      cityName: r.city?.name ?? null,
      districtName: r.district?.name ?? null,
      amount: r.amount ? Number(r.amount.toString()) : null,
      summary,
    };
  });
}

export interface TrendingCity {
  citySlug: string;
  cityName: string;
  type: string;
  thisPeriod: number;
  prevPeriod: number;
  deltaPct: number;
}

/**
 * Cities with the largest 7-day-vs-prev-7-day growth, per category. Caps at
 * 5 entries total (1 per type maximum) so the UI surface is curated.
 */
export async function getTrendingCities(): Promise<TrendingCity[]> {
  const now = Date.now();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

  const [thisRows, prevRows] = await Promise.all([
    db.submission.groupBy({
      by: ["type", "cityId"],
      where: {
        ...REAL_FILTER,
        cityId: { not: null },
        createdAt: { gte: sevenDaysAgo },
      },
      _count: { _all: true },
    }),
    db.submission.groupBy({
      by: ["type", "cityId"],
      where: {
        ...REAL_FILTER,
        cityId: { not: null },
        createdAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo },
      },
      _count: { _all: true },
    }),
  ]);

  const prevMap = new Map<string, number>();
  for (const r of prevRows) {
    prevMap.set(`${r.type}:${r.cityId}`, r._count._all);
  }

  interface Candidate {
    cityId: number;
    type: string;
    thisPeriod: number;
    prevPeriod: number;
    deltaPct: number;
  }
  const candidates: Candidate[] = [];
  for (const r of thisRows) {
    const key = `${r.type}:${r.cityId}`;
    const prev = prevMap.get(key) ?? 0;
    const cur = r._count._all;
    // Need real growth signal — at least 3 in current period and prior data
    if (cur < 3 || prev === 0) continue;
    const deltaPct = Math.round(((cur - prev) / prev) * 100);
    if (deltaPct < 25) continue;
    candidates.push({
      cityId: r.cityId!,
      type: r.type,
      thisPeriod: cur,
      prevPeriod: prev,
      deltaPct,
    });
  }
  candidates.sort((a, b) => b.deltaPct - a.deltaPct);

  // Dedupe to one per type so the panel feels balanced.
  const seenTypes = new Set<string>();
  const picked: Candidate[] = [];
  for (const c of candidates) {
    if (seenTypes.has(c.type)) continue;
    seenTypes.add(c.type);
    picked.push(c);
  }

  if (picked.length === 0) return [];

  const cityIds = picked.map((p) => p.cityId);
  const cities = await db.city.findMany({
    where: { id: { in: cityIds } },
    select: { id: true, slug: true, name: true },
  });
  const cityById = new Map(cities.map((c) => [c.id, c]));

  const result: TrendingCity[] = [];
  for (const p of picked) {
    const city = cityById.get(p.cityId);
    if (!city) continue;
    result.push({
      citySlug: city.slug,
      cityName: city.name,
      type: p.type,
      thisPeriod: p.thisPeriod,
      prevPeriod: p.prevPeriod,
      deltaPct: p.deltaPct,
    });
    if (result.length >= 5) break;
  }
  return result;
}

/** Distinct city + district counts for the hero — counts everything including demo seed (city/district existence isn't user-driven). */
export async function getCoverageCounts(): Promise<{
  cities: number;
  districts: number;
}> {
  const [cities, districts] = await Promise.all([
    db.city.count({ where: { submissions: { some: {} } } }),
    db.district.count({ where: { submissions: { some: {} } } }),
  ]);
  return { cities, districts };
}
