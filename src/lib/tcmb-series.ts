/**
 * TCMB serisi okuyucu — kategori sayfalari icin.
 *
 * Bu kütüphane mevcut TcmbSnapshot tablosundan zaten cekilen verileri
 * tip-guvenli sekilde sunar. Cron tarafindan kullanilan tum series code'lar:
 *  - TP.DK.USD.S  → USD/TL satıs
 *  - TP.DK.EUR.S  → EUR/TL satıs
 *  - TP.FE.OKTG01 → TÜFE genel endeks
 *  - TP.APIFON4   → APİ fonlama faizi (politika faizi)
 */

import { db } from "@/lib/db";

export interface TcmbSeriesData {
  code: string;
  label: string;
  lastDate: string;
  lastValue: number;
  yoyChangePct: number | null;
  history: Array<{ date: string; value: number }> | null;
  fetchedAt: Date;
  isStale: boolean;
}

const STALE_AFTER_MS = 1000 * 60 * 60 * 36; // 36h

export async function getTcmbSeries(code: string): Promise<TcmbSeriesData | null> {
  const row = await db.tcmbSnapshot.findUnique({
    where: { seriesCode: code },
  });
  if (!row || row.lastValue === null) return null;

  const now = Date.now();
  return {
    code,
    label: row.label,
    lastDate: row.lastDate,
    lastValue: row.lastValue,
    yoyChangePct: row.yoyChangePct,
    history: (row.history as Array<{ date: string; value: number }> | null) ?? null,
    fetchedAt: row.fetchedAt,
    isStale: now - row.fetchedAt.getTime() > STALE_AFTER_MS,
  };
}

/** Birden fazla seri tek query'de — döviz hub gibi sayfalar için */
export async function getTcmbSeriesBatch(
  codes: string[],
): Promise<Record<string, TcmbSeriesData | null>> {
  const rows = await db.tcmbSnapshot.findMany({
    where: { seriesCode: { in: codes } },
  });
  const now = Date.now();
  const map: Record<string, TcmbSeriesData | null> = {};
  for (const code of codes) {
    const row = rows.find((r) => r.seriesCode === code);
    if (!row || row.lastValue === null) {
      map[code] = null;
      continue;
    }
    map[code] = {
      code,
      label: row.label,
      lastDate: row.lastDate,
      lastValue: row.lastValue,
      yoyChangePct: row.yoyChangePct,
      history:
        (row.history as Array<{ date: string; value: number }> | null) ?? null,
      fetchedAt: row.fetchedAt,
      isStale: now - row.fetchedAt.getTime() > STALE_AFTER_MS,
    };
  }
  return map;
}

// Insan-okur metin yardimcilari
export function formatTRY(value: number, decimals = 4): string {
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPct(value: number | null, decimals = 1): string {
  if (value === null) return "-";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

export function formatTcmbDate(date: string): string {
  // EVDS format: "2026-04-15" veya "2026-3"
  const parts = date.split("-");
  if (parts.length === 3) {
    const [y, m, d] = parts;
    return `${d}.${m}.${y}`;
  }
  if (parts.length === 2) {
    const monthNames = [
      "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
      "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
    ];
    return `${monthNames[parseInt(parts[1], 10) - 1] ?? parts[1]} ${parts[0]}`;
  }
  return date;
}
