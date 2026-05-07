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

// EVDS3 chart portlet API'sinden çıkarıldı — TP.KFE.TR{NUTS-2 code} pattern.
// 18 region var, 5 ana şehir doğrudan eşleştirildi. Çevreleyen bölgesi
// olmayan şehirler Türkiye geneli (TP.KFE.TR) görüyor.
const CITY_KFE_MAP: Record<string, { code: string; cityName: string }> = {
  istanbul: { code: "TP.KFE.TR10", cityName: "İstanbul" },
  ankara: { code: "TP.KFE.TR51", cityName: "Ankara" },
  izmir: { code: "TP.KFE.TR31", cityName: "İzmir" },
  // TR41 — Bursa, Eskişehir, Bilecik
  bursa: { code: "TP.KFE.TR41", cityName: "Bursa-Eskişehir-Bilecik (TR41)" },
  eskisehir: { code: "TP.KFE.TR41", cityName: "Bursa-Eskişehir-Bilecik (TR41)" },
  bilecik: { code: "TP.KFE.TR41", cityName: "Bursa-Eskişehir-Bilecik (TR41)" },
  // TR62 — Adana, Mersin
  adana: { code: "TP.KFE.TR62", cityName: "Adana-Mersin (TR62)" },
  mersin: { code: "TP.KFE.TR62", cityName: "Adana-Mersin (TR62)" },
};

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
