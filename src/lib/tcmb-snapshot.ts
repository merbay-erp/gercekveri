/**
 * Server-side TcmbSnapshot reader. Cron tablosu doldurur, public sayfalar
 * buradan okur. Cron başarısız olduğu nadir durumda eski değer + lastError
 * döner — UI bunu "stale" göstergesi olarak kullanabilir.
 */
import { db } from "@/lib/db";

export interface TcmbPulseItem {
  code: string;
  label: string;
  lastDate: string;
  lastValue: number | null;
  yoyChangePct: number | null;
  fetchedAt: Date;
  isStale: boolean;
}

const PULSE_CODES: string[] = [
  "TP.DK.USD.S",
  "TP.DK.EUR.S",
  "TP.FE.OKTG01",
  "TP.APIFON4",
];

const STALE_AFTER_MS = 1000 * 60 * 60 * 36; // 36h — günlük cron + güvenlik

export async function getTcmbPulseItems(): Promise<TcmbPulseItem[]> {
  const rows = await db.tcmbSnapshot.findMany({
    where: { seriesCode: { in: PULSE_CODES } },
  });

  const now = Date.now();
  const byCode = new Map(rows.map((r) => [r.seriesCode, r]));

  const items: TcmbPulseItem[] = [];
  for (const code of PULSE_CODES) {
    const r = byCode.get(code);
    if (!r || r.lastValue === null) continue;
    items.push({
      code,
      label: r.label,
      lastDate: r.lastDate,
      lastValue: r.lastValue,
      yoyChangePct: r.yoyChangePct,
      fetchedAt: r.fetchedAt,
      isStale: now - r.fetchedAt.getTime() > STALE_AFTER_MS,
    });
  }
  return items;
}

/** TÜFE'nin son yıllık değişimini döner — null ise data yok ya da hata */
export async function getInflationYoyPct(): Promise<number | null> {
  const row = await db.tcmbSnapshot.findUnique({
    where: { seriesCode: "TP.FE.OKTG01" },
  });
  return row?.yoyChangePct ?? null;
}

export interface HousingIndexSnapshot {
  scope: "national" | "city";
  cityName?: string;
  seriesCode: string;
  label: string;
  lastDate: string;
  lastValue: number;
  yoyChangePct: number | null;
  fetchedAt: Date;
}

// Şehir bazlı KFE serileri henüz keşfedilmedi (TCMB EVDS UI'dan veya
// chart portlet'lerden öğrenmek gerek). Şu an tüm şehirler Türkiye geneli
// (TP.KFE.TR) görüyor. Doğrulandığında bu map güncellenecek.
const CITY_KFE_MAP: Record<string, { code: string; cityName: string }> = {};

/**
 * Şehir bazlı konut fiyat endeksi. Şu an Türkiye geneli (TP.KFE.TR) fallback —
 * şehir kırılımı kodları keşfedilince map güncellenir.
 */
export async function getHousingIndex(
  citySlug?: string,
): Promise<HousingIndexSnapshot | null> {
  const cityEntry = citySlug ? CITY_KFE_MAP[citySlug] : undefined;
  const code = cityEntry?.code ?? "TP.KFE.TR";

  const row = await db.tcmbSnapshot.findUnique({
    where: { seriesCode: code },
  });
  if (!row || row.lastValue === null) return null;

  return {
    scope: cityEntry ? "city" : "national",
    cityName: cityEntry?.cityName,
    seriesCode: code,
    label: row.label,
    lastDate: row.lastDate,
    lastValue: row.lastValue,
    yoyChangePct: row.yoyChangePct,
    fetchedAt: row.fetchedAt,
  };
}
