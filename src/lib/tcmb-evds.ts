/**
 * TCMB EVDS (Elektronik Veri Dağıtım Sistemi) client.
 *
 * 5 Nisan 2024 itibarıyla anahtar URL query yerine `key` HTTP header'ında
 * gönderiliyor — bu fonksiyon header pattern'ini kullanır.
 *
 * Base: https://evds2.tcmb.gov.tr/service/evds
 * Docs: https://evds2.tcmb.gov.tr/help/videos/EVDS_Web_Servis_Kullanim_Kilavuzu.pdf
 *
 * Sorgu başına limit: max 100 seri, max 10.000 gözlem.
 */

const BASE_URL = "https://evds2.tcmb.gov.tr/service/evds";

export type Frequency =
  | "1" // günlük
  | "2" // iş günü
  | "3" // haftalık
  | "4" // aylık (15 gün)
  | "5" // aylık
  | "6" // 3 aylık
  | "7" // 6 aylık
  | "8"; // yıllık

export type AggregationType =
  | "avg" // ortalama
  | "min"
  | "max"
  | "first"
  | "last"
  | "sum";

export interface EvdsFetchOptions {
  /** "TP.DK.USD.S" gibi virgülle ayrılmış seri kodları */
  series: string | string[];
  /** "DD-MM-YYYY" formatında */
  startDate: string;
  /** "DD-MM-YYYY" formatında */
  endDate: string;
  frequency?: Frequency;
  aggregationTypes?: AggregationType;
  formulas?: number; // 0=düzey, 1=yüzde değişim
}

interface EvdsRawResponse {
  totalCount?: number;
  items?: Array<Record<string, string | number | null>>;
  // Hata durumunda farklı bir yapı dönebilir
  message?: string;
}

export interface EvdsSeriesPoint {
  date: string;
  value: number | null;
}

export interface EvdsResult {
  ok: boolean;
  status: number;
  /** Seri kodu → datapoints */
  series: Record<string, EvdsSeriesPoint[]>;
  /** Hata mesajı (ok=false ise) */
  error?: string;
  /** Raw response (debug için) */
  raw?: EvdsRawResponse;
}

function getApiKey(): string | null {
  return process.env.TCMB_EVDS_API_KEY ?? null;
}

function normalizeSeries(input: string | string[]): string[] {
  if (Array.isArray(input)) return input;
  return input.split("-").map((s) => s.trim()).filter(Boolean);
}

/**
 * EVDS'ten zaman serisi çeker. Hatayı throw etmez — sonucu `ok` field'ı
 * üzerinden ifade eder, böylece çağıran kodu try/catch'siz işleyebilir.
 */
export async function fetchEvds(opts: EvdsFetchOptions): Promise<EvdsResult> {
  const key = getApiKey();
  if (!key) {
    return {
      ok: false,
      status: 0,
      series: {},
      error: "TCMB_EVDS_API_KEY env tanımlı değil.",
    };
  }

  const seriesArr = normalizeSeries(opts.series);
  const seriesParam = seriesArr.join("-"); // EVDS dash-separated istiyor

  // EVDS path-style query pattern. Hem header hem URL'de key — bazı edge
  // case'lerde header gitmeyebiliyor (CDN/redirect), URL fallback güvenli.
  const url = `${BASE_URL}/series=${seriesParam}&startDate=${opts.startDate}&endDate=${opts.endDate}&type=json&frequency=${opts.frequency ?? "5"}&aggregationTypes=${opts.aggregationTypes ?? "avg"}&formulas=${opts.formulas ?? 0}&key=${encodeURIComponent(key)}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        key,
        accept: "application/json",
        "user-agent": "gercekveri-bot/1.0",
      },
      cache: "no-store",
      redirect: "manual", // redirect yapıyorsa hata olarak gör
    });
  } catch (err) {
    return {
      ok: false,
      status: 0,
      series: {},
      error: err instanceof Error ? err.message : "fetch failed",
    };
  }

  if (!response.ok) {
    let body = "";
    try {
      body = (await response.text()).slice(0, 300);
    } catch {
      // ignore
    }
    return {
      ok: false,
      status: response.status,
      series: {},
      error: `HTTP ${response.status}: ${body || response.statusText}`,
    };
  }

  let raw: EvdsRawResponse;
  try {
    raw = (await response.json()) as EvdsRawResponse;
  } catch (err) {
    return {
      ok: false,
      status: response.status,
      series: {},
      error: err instanceof Error ? `JSON parse: ${err.message}` : "JSON parse failed",
    };
  }

  if (!raw.items || raw.items.length === 0) {
    return {
      ok: true,
      status: response.status,
      series: Object.fromEntries(seriesArr.map((s) => [s, []])),
      raw,
    };
  }

  // EVDS items: [{Tarih: "2024-1", "TP_DK_USD_S": 28.50}, ...]
  // Her item bir tarih, kalan key'ler series_code'lar (nokta yerine alt çizgi).
  const seriesMap: Record<string, EvdsSeriesPoint[]> = {};
  for (const s of seriesArr) seriesMap[s] = [];

  for (const item of raw.items) {
    const date =
      typeof item.Tarih === "string"
        ? item.Tarih
        : typeof item.tarih === "string"
          ? item.tarih
          : "";
    for (const seriesCode of seriesArr) {
      // EVDS yanıtta nokta yerine alt çizgi kullanır: TP.DK.USD.S → TP_DK_USD_S
      const key = seriesCode.replace(/\./g, "_");
      const rawValue = item[key];
      let parsed: number | null = null;
      if (typeof rawValue === "number") parsed = rawValue;
      else if (typeof rawValue === "string" && rawValue.trim() !== "") {
        const n = Number(rawValue.replace(",", "."));
        parsed = Number.isFinite(n) ? n : null;
      }
      seriesMap[seriesCode].push({ date, value: parsed });
    }
  }

  return {
    ok: true,
    status: response.status,
    series: seriesMap,
    raw,
  };
}

/**
 * Bir tek serinin son değerini döner — KFE gibi noktasal güncelleme için
 * kullanışlı.
 */
export function lastValue(points: EvdsSeriesPoint[]): EvdsSeriesPoint | null {
  for (let i = points.length - 1; i >= 0; i--) {
    if (points[i].value !== null) return points[i];
  }
  return null;
}
