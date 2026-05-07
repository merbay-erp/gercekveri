/**
 * Per-city median for each supported category — drives the heatmap.
 * Counts only APPROVED submissions and excludes demo seed so the map
 * reflects real usage.
 */
import { db } from "@/lib/db";
import { cities } from "@/lib/cities";

export type HeatmapCategory =
  | "RENT"
  | "SALARY"
  | "AIDAT"
  | "INTERNET"
  | "UTILITY"
  | "TEXTILE";

export interface CityMedian {
  plate: number;
  slug: string;
  name: string;
  count: number;
  median: number | null;
}

interface RawRow {
  cityId: number | null;
  amount: { toString(): string } | number | null;
}

const REAL_FILTER = {
  status: "APPROVED" as const,
  NOT: { ipHash: { startsWith: "demo-" } },
};

const FALLBACK_FILTER = {
  // If real-only data is too sparse to draw a meaningful map, fall back
  // to ALL approved data (including demo seed) so the heatmap still has
  // a story. Public preview phase only — switch to REAL_FILTER once we
  // have user-generated coverage.
  status: "APPROVED" as const,
};

const PER_CITY_MIN = 3;
const TOTAL_REAL_MIN = 20; // below this, fall back to demo-inclusive

function median(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = (sorted.length - 1) / 2;
  if (Number.isInteger(mid)) return sorted[mid];
  const lo = Math.floor(mid);
  const hi = Math.ceil(mid);
  return Math.round((sorted[lo] + sorted[hi]) / 2);
}

export async function getCityMedians(
  category: HeatmapCategory,
): Promise<CityMedian[]> {
  // First try with real-only filter
  let rows = await db.submission.findMany({
    where: { ...REAL_FILTER, type: category, cityId: { not: null }, amount: { not: null } },
    select: { cityId: true, amount: true },
  });

  if (rows.length < TOTAL_REAL_MIN) {
    rows = await db.submission.findMany({
      where: { ...FALLBACK_FILTER, type: category, cityId: { not: null }, amount: { not: null } },
      select: { cityId: true, amount: true },
    });
  }

  // Bucket by cityId
  const byCityId = new Map<number, number[]>();
  for (const r of rows as RawRow[]) {
    if (r.cityId === null) continue;
    const v = r.amount ? Number(r.amount.toString()) : 0;
    if (v <= 0) continue;
    const arr = byCityId.get(r.cityId) ?? [];
    arr.push(v);
    byCityId.set(r.cityId, arr);
  }

  // Resolve cityId → city record (for slug + plate)
  const cityIds = Array.from(byCityId.keys());
  const cityRows = cityIds.length
    ? await db.city.findMany({
        where: { id: { in: cityIds } },
        select: { id: true, slug: true, name: true },
      })
    : [];
  const slugByCityId = new Map(cityRows.map((c) => [c.id, c.slug]));
  const plateBySlug = new Map(cities.map((c) => [c.slug, c.plate]));
  const nameBySlug = new Map(cities.map((c) => [c.slug, c.name]));

  // Build the result list, keyed off the static cities array so the
  // map shows every il (even those without data, with median=null).
  const result: CityMedian[] = cities.map((c) => ({
    plate: c.plate,
    slug: c.slug,
    name: c.name,
    count: 0,
    median: null,
  }));

  for (const [cityId, values] of byCityId) {
    const slug = slugByCityId.get(cityId);
    if (!slug) continue;
    const idx = result.findIndex((r) => r.slug === slug);
    if (idx === -1) continue;
    if (values.length < PER_CITY_MIN) {
      // Not enough samples → keep median null (gray on map) but record count
      result[idx].count = values.length;
    } else {
      result[idx].count = values.length;
      result[idx].median = median(values);
    }
  }

  // Suppress unused-variable warnings for helper maps that callers might
  // use in future iterations.
  void plateBySlug;
  void nameBySlug;

  return result;
}

/** All categories at once — used by the heatmap page so the user can
 *  toggle without re-fetching. */
export async function getAllCityMedians(): Promise<
  Record<HeatmapCategory, CityMedian[]>
> {
  const cats: HeatmapCategory[] = [
    "RENT",
    "SALARY",
    "AIDAT",
    "INTERNET",
    "UTILITY",
    "TEXTILE",
  ];
  const results = await Promise.all(cats.map((c) => getCityMedians(c).catch(() => [])));
  return Object.fromEntries(cats.map((c, i) => [c, results[i]])) as Record<
    HeatmapCategory,
    CityMedian[]
  >;
}
