/**
 * TCMB EVDS batch fetcher + snapshot writer.
 *
 * Cron job günde 1 kere bunu çalıştırır → 6 önemli seriyi çekip
 * TcmbSnapshot tablosuna yazar. Public sayfalar (reality score, official
 * panel) buradan okur, EVDS'e doğrudan dokunmaz.
 *
 * Bir seri başarısız olursa diğerleri etkilenmez — `lastError` alanına
 * yazıp önceki başarılı veriyi korur.
 */
import { fetchEvds, lastValue, type Frequency } from "@/lib/tcmb-evds";
import { db } from "@/lib/db";

interface SeriesSpec {
  code: string;
  label: string;
  /** Aylık (5) seriler için 13 ay çek → yıllık % değişim hesaplanır */
  frequency: Frequency;
  /** Yıllık değişim hesaplansın mı? (TÜFE için evet, USD için anlamlı değil) */
  computeYoY: boolean;
}

const SERIES: SeriesSpec[] = [
  // Döviz + faiz (günlük) — EVDS3'te 200 + 305-427 datapoint canlı
  { code: "TP.DK.USD.S", label: "USD/TL (satış)", frequency: "1", computeYoY: false },
  { code: "TP.DK.EUR.S", label: "EUR/TL (satış)", frequency: "1", computeYoY: false },
  { code: "TP.APIFON4", label: "TCMB politika faizi (AOFM)", frequency: "1", computeYoY: false },
  // Enflasyon (aylık) — reality score için kritik
  { code: "TP.FE.OKTG01", label: "TÜFE genel endeks", frequency: "5", computeYoY: true },
  // Konut endeksleri — public chart portlet API'sinden doğrulandı
  // (TP.KFE_TR ve TP.YOKFEND_TR JSON içinde geliyor; nokta versiyonu API'ye)
  { code: "TP.KFE.TR", label: "Konut Fiyat Endeksi (TR)", frequency: "5", computeYoY: true },
  { code: "TP.YOKFEND.TR", label: "Yeni Olmayan Konutlar Fiyat Endeksi (TR)", frequency: "5", computeYoY: true },
];

function formatTcmbDate(d: Date): string {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

export interface SeriesResult {
  code: string;
  label: string;
  ok: boolean;
  status?: number;
  lastDate?: string;
  lastValue?: number | null;
  yoyChangePct?: number | null;
  pointsCount?: number;
  error?: string;
}

/**
 * Tek seri çekip snapshot'a yazar. Hata varsa snapshot'taki lastError
 * alanını günceller, eski değeri ezmez.
 */
async function refreshOne(spec: SeriesSpec): Promise<SeriesResult> {
  // 24 ay tampon. EVDS3 tarih aralığını sıkı yorumluyor (13 ay isteğe 9 nokta
  // dönmüştü) — yıllık değişim hesabı için en az 13 nokta lazım, geniş
  // pencere açmak güvenli.
  const today = new Date();
  const startMonths = 24;
  const startDate = new Date(today);
  startDate.setMonth(startDate.getMonth() - startMonths);

  const result = await fetchEvds({
    series: spec.code,
    startDate: formatTcmbDate(startDate),
    endDate: formatTcmbDate(today),
    frequency: spec.frequency,
  });

  if (!result.ok) {
    // Snapshot'ı update et (eski değeri tutarak hata logla)
    await db.tcmbSnapshot.upsert({
      where: { seriesCode: spec.code },
      create: {
        seriesCode: spec.code,
        label: spec.label,
        lastDate: "—",
        lastValue: null,
        lastError: result.error ?? `HTTP ${result.status}`,
        lastErrorAt: new Date(),
      },
      update: {
        lastError: result.error ?? `HTTP ${result.status}`,
        lastErrorAt: new Date(),
      },
    });
    return {
      code: spec.code,
      label: spec.label,
      ok: false,
      status: result.status,
      error: result.error,
    };
  }

  const points = result.series[spec.code] ?? [];
  const last = lastValue(points);

  if (!last) {
    await db.tcmbSnapshot.upsert({
      where: { seriesCode: spec.code },
      create: {
        seriesCode: spec.code,
        label: spec.label,
        lastDate: "—",
        lastValue: null,
        lastError: "EVDS empty response",
        lastErrorAt: new Date(),
      },
      update: {
        lastError: "EVDS empty response",
        lastErrorAt: new Date(),
      },
    });
    return {
      code: spec.code,
      label: spec.label,
      ok: true,
      pointsCount: 0,
      error: "EVDS empty response",
    };
  }

  // Yıllık değişim: aylıklar için son ile 12 ay öncesi arasında %
  let yoy: number | null = null;
  if (spec.computeYoY && spec.frequency === "5" && points.length >= 13) {
    const lastIdx = points.length - 1;
    const yearAgo = points[lastIdx - 12];
    if (last.value !== null && yearAgo?.value && yearAgo.value !== 0) {
      yoy = ((last.value - yearAgo.value) / yearAgo.value) * 100;
    }
  }

  // History: son 12 nokta (chart için yeterli)
  const history = points
    .filter((p) => p.value !== null)
    .slice(-12)
    .map((p) => ({ date: p.date, value: p.value }));

  await db.tcmbSnapshot.upsert({
    where: { seriesCode: spec.code },
    create: {
      seriesCode: spec.code,
      label: spec.label,
      lastDate: last.date,
      lastValue: last.value,
      yoyChangePct: yoy,
      history,
      lastError: null,
      lastErrorAt: null,
    },
    update: {
      label: spec.label,
      lastDate: last.date,
      lastValue: last.value,
      yoyChangePct: yoy,
      history,
      fetchedAt: new Date(),
      lastError: null,
      lastErrorAt: null,
    },
  });

  return {
    code: spec.code,
    label: spec.label,
    ok: true,
    status: result.status,
    lastDate: last.date,
    lastValue: last.value,
    yoyChangePct: yoy,
    pointsCount: points.length,
  };
}

/**
 * Tüm series'leri sırayla çeker (paralel değil — TCMB rate limit nazik
 * davranmak için). Her birinin sonucunu döner.
 */
export async function refreshAllTcmbSnapshots(): Promise<{
  results: SeriesResult[];
  okCount: number;
  errorCount: number;
}> {
  const results: SeriesResult[] = [];
  for (const spec of SERIES) {
    try {
      const res = await refreshOne(spec);
      results.push(res);
    } catch (err) {
      results.push({
        code: spec.code,
        label: spec.label,
        ok: false,
        error: err instanceof Error ? err.message : "unknown error",
      });
    }
  }

  const okCount = results.filter((r) => r.ok && r.lastValue !== undefined).length;
  const errorCount = results.length - okCount;

  return { results, okCount, errorCount };
}

export const TCMB_SERIES_LIST = SERIES;
