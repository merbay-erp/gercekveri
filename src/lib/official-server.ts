/**
 * Server-side: bir scope için resmi referans satırını DB'den çeker.
 * Snapshot dosyası seed ile DB'ye yazılır; runtime tek source-of-truth DB.
 */
import { db } from "@/lib/db";
import { findCityBySlug } from "@/lib/cities";

export interface OfficialReferenceRow {
  amount: number;
  sourceLabel: string;
  sourceUrl: string;
  referenceDate: string;
  methodology: string;
  data: Record<string, unknown>;
  source: string;
}

interface ScopeFilter {
  type: "RENT" | "SALARY" | "UTILITY";
  citySlug?: string;
  positionSlug?: string;
  utilityType?: "ELEKTRIK" | "DOGALGAZ" | "SU";
}

/**
 * Resmi referansı DB'den getirir. Sadece source != USER && != DEMO satırlar
 * hedeflenir (TUIK / TCMB / EPDK / BOTAS / MEB).
 */
export async function findOfficialReferenceFromDb(
  filter: ScopeFilter,
): Promise<OfficialReferenceRow | null> {
  let cityId: number | undefined;
  if (filter.citySlug) {
    const cityRecord = findCityBySlug(filter.citySlug);
    if (!cityRecord) return null;
    const c = await db.city.findUnique({
      where: { slug: cityRecord.slug },
      select: { id: true },
    });
    cityId = c?.id;
  }

  const dataConditions: Array<{ path: string[]; equals: string }> = [];
  if (filter.positionSlug) {
    dataConditions.push({
      path: ["positionSlug"],
      equals: filter.positionSlug,
    });
  }
  if (filter.utilityType) {
    dataConditions.push({ path: ["utilityType"], equals: filter.utilityType });
  }

  const row = await db.submission.findFirst({
    where: {
      type: filter.type,
      status: "APPROVED",
      source: { notIn: ["USER", "DEMO"] },
      ...(cityId !== undefined ? { cityId } : {}),
      ...(dataConditions.length > 0
        ? { AND: dataConditions.map((c) => ({ data: c })) }
        : {}),
    },
    orderBy: { updatedAt: "desc" },
    select: { amount: true, data: true, source: true },
  });

  if (!row || row.amount === null) return null;
  const data = (row.data ?? {}) as Record<string, unknown>;
  const meta = (data.sourceMeta ?? {}) as Record<string, string>;

  return {
    amount: Number(row.amount.toString()),
    sourceLabel: meta.sourceLabel ?? row.source,
    sourceUrl: meta.sourceUrl ?? "",
    referenceDate: meta.referenceDate ?? "—",
    methodology: meta.methodology ?? "direct",
    data,
    source: row.source,
  };
}
