/**
 * Konut Enflasyon Karnesi — TCMB KFE serilerini TÜFE ile karşılaştırıp
 * "her bölge enflasyonun ne kadar üstü/altı" karne tablosunu üretir.
 *
 * Ana sayfa ribbon ve /konut-enflasyon sayfaları buradan beslenir.
 */
import { db } from "@/lib/db";
import { CITY_KFE_LOOKUP } from "@/lib/tcmb-snapshot";

export interface KarneRow {
  /** TCMB series kodu — örn TP.KFE.TR10 */
  code: string;
  /** "İstanbul", "Ankara", "Tekirdağ-Edirne-Kırklareli" gibi okunabilir etiket */
  regionLabel: string;
  /** Endeksin son değeri (örn 205.4) */
  lastValue: number;
  /** Yıllık değişim (%) — TÜFE ile karşılaştırılan ana metrik */
  yoyPct: number;
  /** TÜFE - KFE: pozitif = enflasyonun altında (reel kayıp), negatif = üstünde */
  deltaToTufe: number;
  /** UI rengi — kırmızı: enflasyona yakın/üstü, sarı: orta, yeşil: çok altı */
  tone: "rose" | "amber" | "emerald";
  /** Sıralama: en yüksekten en düşüğe yoy (1 en yüksek) */
  rank: number;
  /** EVDS son veri tarihi — "2026-3" */
  lastDate: string;
}

export interface KonutKarne {
  /** TÜFE yıllık değişim — karşılaştırma anchor'ı */
  tufeYoy: number;
  /** TÜFE'nin son tarihi */
  tufeDate: string;
  /** Türkiye geneli KFE satırı (özel) */
  national: KarneRow | null;
  /** 19 bölge — yoy'a göre azalan sıralı */
  regions: KarneRow[];
  /** Ribbon için kısa özet — "X bölgenin Y'i enflasyonun altında" */
  summary: {
    totalRegions: number;
    underInflation: number;
    overInflation: number;
    bestPerformerLabel: string;
    worstPerformerLabel: string;
  };
}

const TUFE_CODE = "TP.FE.OKTG01";
const NATIONAL_KFE = "TP.KFE.TR";
const REGION_PREFIX = "TP.KFE.TR"; // tüm region serileri bununla başlar

function toneFor(deltaToTufe: number): "rose" | "amber" | "emerald" {
  if (deltaToTufe <= 1) return "rose"; // enflasyona yakın ya da üstü
  if (deltaToTufe <= 5) return "amber";
  return "emerald";
}

function regionLabelFromFullLabel(label: string): string {
  // "Konut Fiyat Endeksi (Tekirdağ-Edirne-Kırklareli)" → "Tekirdağ-Edirne-Kırklareli"
  const m = /\(([^)]+)\)/.exec(label);
  return m ? m[1] : label;
}

export async function getKonutKarne(): Promise<KonutKarne | null> {
  const tufe = await db.tcmbSnapshot.findUnique({
    where: { seriesCode: TUFE_CODE },
  });
  if (!tufe || tufe.yoyChangePct === null) return null;

  const tufeYoy = tufe.yoyChangePct;

  const allKfe = await db.tcmbSnapshot.findMany({
    where: { seriesCode: { startsWith: REGION_PREFIX } },
  });

  const nationalRow = allKfe.find((r) => r.seriesCode === NATIONAL_KFE);
  const regionsRaw = allKfe
    .filter((r) => r.seriesCode !== NATIONAL_KFE)
    .filter((r) => r.yoyChangePct !== null && r.lastValue !== null);

  const regionsSorted = [...regionsRaw].sort(
    (a, b) => (b.yoyChangePct ?? 0) - (a.yoyChangePct ?? 0),
  );

  const regions: KarneRow[] = regionsSorted.map((r, idx) => {
    const yoy = r.yoyChangePct!;
    const delta = tufeYoy - yoy;
    return {
      code: r.seriesCode,
      regionLabel: regionLabelFromFullLabel(r.label),
      lastValue: r.lastValue!,
      yoyPct: yoy,
      deltaToTufe: delta,
      tone: toneFor(delta),
      rank: idx + 1,
      lastDate: r.lastDate,
    };
  });

  const national: KarneRow | null = nationalRow && nationalRow.yoyChangePct !== null
    ? {
        code: nationalRow.seriesCode,
        regionLabel: "Türkiye Geneli",
        lastValue: nationalRow.lastValue!,
        yoyPct: nationalRow.yoyChangePct,
        deltaToTufe: tufeYoy - nationalRow.yoyChangePct,
        tone: toneFor(tufeYoy - nationalRow.yoyChangePct),
        rank: 0,
        lastDate: nationalRow.lastDate,
      }
    : null;

  const underInflation = regions.filter((r) => r.deltaToTufe > 0).length;
  const overInflation = regions.filter((r) => r.deltaToTufe <= 0).length;
  const best = regions[0];
  const worst = regions[regions.length - 1];

  return {
    tufeYoy,
    tufeDate: tufe.lastDate,
    national,
    regions,
    summary: {
      totalRegions: regions.length,
      underInflation,
      overInflation,
      bestPerformerLabel: best?.regionLabel ?? "—",
      worstPerformerLabel: worst?.regionLabel ?? "—",
    },
  };
}

/**
 * Şehir slug'ı için karne row'unu döner — 81 il için tcmb-snapshot'taki
 * CITY_KFE_MAP'i kullanarak hangi region'a dahil olduğunu çözer.
 */
export interface CityKarneDetail {
  cityName: string;
  citySlug: string;
  region: KarneRow;
  national: KarneRow | null;
  tufeYoy: number;
  tufeDate: string;
}

export async function getCityKonutKarne(
  citySlug: string,
  cityName: string,
): Promise<CityKarneDetail | null> {
  const karne = await getKonutKarne();
  if (!karne) return null;

  const lookup = CITY_KFE_LOOKUP[citySlug];
  // Lookup yoksa fallback: Türkiye geneli
  const targetCode = lookup?.code ?? NATIONAL_KFE;
  const region = [karne.national, ...karne.regions].find(
    (r): r is KarneRow => r !== null && r.code === targetCode,
  );

  if (!region) return null;

  return {
    cityName,
    citySlug,
    region,
    national: karne.national,
    tufeYoy: karne.tufeYoy,
    tufeDate: karne.tufeDate,
  };
}
