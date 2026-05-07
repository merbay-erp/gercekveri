/**
 * Median-value deltas — "Bu hafta vs geçen hafta" karşılaştırması.
 *
 * recent-activity.ts paylaşım SAYISI deltası verir; bu modül paylaşımların
 * MEDYAN DEĞERLERİ deltasını verir (Kadıköy kirası bu hafta +%4 gibi).
 *
 * Demo seed exclude edilir, gerçek kullanıcı imzası olan paylaşımlar baz
 * alınır. Veri seyrek olduğunda fallback: tüm-zamanlar median (gri).
 */
import { db } from "@/lib/db";

const REAL_FILTER = {
  status: "APPROVED" as const,
  NOT: { ipHash: { startsWith: "demo-" } },
};

const FALLBACK_FILTER = {
  status: "APPROVED" as const,
};

const ALL_TYPES = ["SALARY", "RENT", "AIDAT", "INTERNET", "UTILITY", "TEXTILE"] as const;
type CategoryType = (typeof ALL_TYPES)[number];

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const MIN_PER_BUCKET = 3;

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = (sorted.length - 1) / 2;
  if (Number.isInteger(mid)) return sorted[mid];
  const lo = Math.floor(mid);
  const hi = Math.ceil(mid);
  return Math.round((sorted[lo] + sorted[hi]) / 2);
}

export interface CategoryMedianDelta {
  type: CategoryType;
  thisWeekMedian: number | null;
  prevWeekMedian: number | null;
  deltaPct: number | null;
  thisWeekCount: number;
  prevWeekCount: number;
}

export async function getCategoryMedianDeltas(): Promise<CategoryMedianDelta[]> {
  const now = Date.now();
  const oneWeekAgo = new Date(now - ONE_WEEK_MS);
  const twoWeeksAgo = new Date(now - 2 * ONE_WEEK_MS);

  // Pull all relevant rows in one shot, bucket in memory. Demo exclusion
  // first, falls back to including demo if real bucket is too small.
  const realRows = await db.submission.findMany({
    where: {
      ...REAL_FILTER,
      createdAt: { gte: twoWeeksAgo },
      amount: { not: null },
    },
    select: { type: true, amount: true, createdAt: true },
  });

  const useRows =
    realRows.length >= ALL_TYPES.length * MIN_PER_BUCKET
      ? realRows
      : await db.submission.findMany({
          where: {
            ...FALLBACK_FILTER,
            createdAt: { gte: twoWeeksAgo },
            amount: { not: null },
          },
          select: { type: true, amount: true, createdAt: true },
        });

  const byType = new Map<CategoryType, { thisWeek: number[]; prevWeek: number[] }>();
  for (const t of ALL_TYPES) byType.set(t, { thisWeek: [], prevWeek: [] });

  for (const r of useRows) {
    if (!ALL_TYPES.includes(r.type as CategoryType)) continue;
    const v = r.amount ? Number(r.amount.toString()) : 0;
    if (v <= 0) continue;
    const bucket = byType.get(r.type as CategoryType)!;
    if (r.createdAt.getTime() >= oneWeekAgo.getTime()) {
      bucket.thisWeek.push(v);
    } else {
      bucket.prevWeek.push(v);
    }
  }

  return ALL_TYPES.map((type) => {
    const b = byType.get(type)!;
    const thisMedian =
      b.thisWeek.length >= MIN_PER_BUCKET ? median(b.thisWeek) : null;
    const prevMedian =
      b.prevWeek.length >= MIN_PER_BUCKET ? median(b.prevWeek) : null;
    const deltaPct =
      thisMedian !== null && prevMedian !== null && prevMedian > 0
        ? Math.round(((thisMedian - prevMedian) / prevMedian) * 100)
        : null;
    return {
      type,
      thisWeekMedian: thisMedian,
      prevWeekMedian: prevMedian,
      deltaPct,
      thisWeekCount: b.thisWeek.length,
      prevWeekCount: b.prevWeek.length,
    };
  });
}

export interface CityMedianDelta {
  citySlug: string;
  cityName: string;
  type: CategoryType;
  thisMedian: number;
  prevMedian: number;
  deltaPct: number;
  thisCount: number;
}

/**
 * Per-city per-category median delta — "Kadıköy kirası bu hafta +%4". Used
 * for the panel's "Yükselişte / Düşüşte" lists. Returns top movers (largest
 * absolute deltaPct) split into rising and falling.
 */
export async function getTopCityMovers(opts: {
  minPerBucket?: number;
  limit?: number;
} = {}): Promise<{ rising: CityMedianDelta[]; falling: CityMedianDelta[] }> {
  const minBucket = opts.minPerBucket ?? 3;
  const limit = opts.limit ?? 5;
  const now = Date.now();
  const oneWeekAgo = new Date(now - ONE_WEEK_MS);
  const twoWeeksAgo = new Date(now - 2 * ONE_WEEK_MS);

  // Same fallback strategy as the category delta function
  let rows = await db.submission.findMany({
    where: {
      ...REAL_FILTER,
      createdAt: { gte: twoWeeksAgo },
      cityId: { not: null },
      amount: { not: null },
    },
    select: {
      type: true,
      amount: true,
      createdAt: true,
      cityId: true,
    },
  });

  if (rows.length < 30) {
    rows = await db.submission.findMany({
      where: {
        ...FALLBACK_FILTER,
        createdAt: { gte: twoWeeksAgo },
        cityId: { not: null },
        amount: { not: null },
      },
      select: { type: true, amount: true, createdAt: true, cityId: true },
    });
  }

  // Bucket: key = `${type}:${cityId}` → { thisWeek: [], prevWeek: [] }
  const byKey = new Map<string, { thisWeek: number[]; prevWeek: number[] }>();
  for (const r of rows) {
    if (!ALL_TYPES.includes(r.type as CategoryType)) continue;
    const v = r.amount ? Number(r.amount.toString()) : 0;
    if (v <= 0 || r.cityId === null) continue;
    const key = `${r.type}:${r.cityId}`;
    const b = byKey.get(key) ?? { thisWeek: [], prevWeek: [] };
    if (r.createdAt.getTime() >= oneWeekAgo.getTime()) b.thisWeek.push(v);
    else b.prevWeek.push(v);
    byKey.set(key, b);
  }

  interface Mover {
    cityId: number;
    type: CategoryType;
    thisMedian: number;
    prevMedian: number;
    deltaPct: number;
    thisCount: number;
  }
  const movers: Mover[] = [];
  for (const [key, b] of byKey) {
    if (b.thisWeek.length < minBucket || b.prevWeek.length < minBucket) continue;
    const thisMed = median(b.thisWeek)!;
    const prevMed = median(b.prevWeek)!;
    if (prevMed <= 0) continue;
    const deltaPct = Math.round(((thisMed - prevMed) / prevMed) * 100);
    if (Math.abs(deltaPct) < 2) continue; // ignore noise
    const [type, cityIdStr] = key.split(":");
    movers.push({
      cityId: Number(cityIdStr),
      type: type as CategoryType,
      thisMedian: thisMed,
      prevMedian: prevMed,
      deltaPct,
      thisCount: b.thisWeek.length,
    });
  }

  // Resolve city names
  const cityIds = Array.from(new Set(movers.map((m) => m.cityId)));
  const cities = cityIds.length
    ? await db.city.findMany({
        where: { id: { in: cityIds } },
        select: { id: true, slug: true, name: true },
      })
    : [];
  const cityById = new Map(cities.map((c) => [c.id, c]));

  const enriched: CityMedianDelta[] = movers
    .map((m) => {
      const c = cityById.get(m.cityId);
      if (!c) return null;
      return {
        citySlug: c.slug,
        cityName: c.name,
        type: m.type,
        thisMedian: m.thisMedian,
        prevMedian: m.prevMedian,
        deltaPct: m.deltaPct,
        thisCount: m.thisCount,
      };
    })
    .filter((x): x is CityMedianDelta => x !== null);

  const rising = enriched
    .filter((x) => x.deltaPct > 0)
    .sort((a, b) => b.deltaPct - a.deltaPct)
    .slice(0, limit);
  const falling = enriched
    .filter((x) => x.deltaPct < 0)
    .sort((a, b) => a.deltaPct - b.deltaPct)
    .slice(0, limit);

  return { rising, falling };
}
