/**
 * Public-facing aggregate stats — drives the /istatistikler page and any
 * homepage "social proof" surfaces. Counts only APPROVED submissions and
 * excludes demo seed rows so the numbers reflect real usage.
 */
import { db } from "@/lib/db";
import { PUBLIC_SUBMISSION_FILTER } from "@/lib/submission-filters";

// Public istatistikler hem kullanıcı hem resmi referans veriyi sayar,
// sadece DEMO'yu hariç tutar.
const REAL_FILTER = PUBLIC_SUBMISSION_FILTER;

const ALL_STATUS_REAL = {
  NOT: { source: "DEMO" },
};

export interface PublicStatsOverview {
  totalApproved: number;
  totalLast24h: number;
  totalLast7d: number;
  totalLast30d: number;
  byType: Array<{ type: string; count: number }>;
  topCities: Array<{ slug: string; name: string; count: number }>;
  topPositions: Array<{ slug: string; name: string; count: number }>;
  growthRatePct: number | null;
  /** When was the most recent real submission? */
  lastSubmissionAt: Date | null;
}

export async function getPublicStatsOverview(): Promise<PublicStatsOverview> {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  const [
    totalApproved,
    totalLast24h,
    totalLast7d,
    totalLast30d,
    totalPrev30d,
    byType,
    topCityRows,
    topPositionGroups,
    lastReal,
  ] = await Promise.all([
    db.submission.count({ where: REAL_FILTER }),
    db.submission.count({ where: { ...REAL_FILTER, createdAt: { gte: oneDayAgo } } }),
    db.submission.count({
      where: { ...REAL_FILTER, createdAt: { gte: sevenDaysAgo } },
    }),
    db.submission.count({
      where: { ...REAL_FILTER, createdAt: { gte: thirtyDaysAgo } },
    }),
    db.submission.count({
      where: {
        ...REAL_FILTER,
        createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo },
      },
    }),
    db.submission.groupBy({
      by: ["type"],
      where: REAL_FILTER,
      _count: { _all: true },
      orderBy: { _count: { id: "desc" } },
    }),
    db.submission.groupBy({
      by: ["cityId"],
      where: { ...REAL_FILTER, cityId: { not: null } },
      _count: { _all: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    // Position is encoded as data->>'positionSlug' for SALARY rows; we
    // groupBy raw type and aggregate in memory so we don't need raw SQL.
    db.submission.findMany({
      where: { ...REAL_FILTER, type: "SALARY" },
      select: { data: true },
      take: 2000,
    }),
    db.submission.findFirst({
      where: ALL_STATUS_REAL,
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);

  const cityIds = topCityRows.map((r) => r.cityId!).filter(Boolean);
  const cityRecords = cityIds.length
    ? await db.city.findMany({
        where: { id: { in: cityIds } },
        select: { id: true, slug: true, name: true },
      })
    : [];
  const cityById = new Map(cityRecords.map((c) => [c.id, c]));
  const topCities = topCityRows
    .map((r) => {
      const c = cityById.get(r.cityId!);
      if (!c) return null;
      return { slug: c.slug, name: c.name, count: r._count._all };
    })
    .filter((x): x is { slug: string; name: string; count: number } => x !== null);

  // Aggregate top positions in memory from the SALARY data payloads.
  const positionTally = new Map<string, { name: string; count: number }>();
  for (const row of topPositionGroups) {
    const data = (row.data ?? {}) as { positionSlug?: string; positionName?: string };
    const slug = data.positionSlug;
    const name = data.positionName;
    if (!slug || !name) continue;
    const existing = positionTally.get(slug);
    if (existing) existing.count++;
    else positionTally.set(slug, { name, count: 1 });
  }
  const topPositions = Array.from(positionTally.entries())
    .map(([slug, v]) => ({ slug, name: v.name, count: v.count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  // 30-day growth: (last30 - prev30) / prev30. null if no prior data.
  const growthRatePct =
    totalPrev30d > 0
      ? Math.round(((totalLast30d - totalPrev30d) / totalPrev30d) * 100)
      : null;

  return {
    totalApproved,
    totalLast24h,
    totalLast7d,
    totalLast30d,
    byType: byType.map((b) => ({ type: b.type, count: b._count._all })),
    topCities,
    topPositions,
    growthRatePct,
    lastSubmissionAt: lastReal?.createdAt ?? null,
  };
}

/**
 * Daily submission counts for the last N days — for the time-series chart.
 * Returned oldest→newest so the chart axis is naturally left-to-right.
 */
export async function getDailySubmissionSeries(
  days = 30,
): Promise<Array<{ date: string; count: number }>> {
  const since = new Date();
  since.setDate(since.getDate() - days);
  since.setHours(0, 0, 0, 0);

  const rows = await db.submission.findMany({
    where: {
      ...REAL_FILTER,
      createdAt: { gte: since },
    },
    select: { createdAt: true },
  });

  const buckets = new Map<string, number>();
  // Pre-fill with zero for every day so the chart doesn't have gaps.
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }
  for (const r of rows) {
    const key = r.createdAt.toISOString().slice(0, 10);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }
  return Array.from(buckets.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
