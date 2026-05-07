import { GoogleGenAI, Type } from "@google/genai";

/**
 * Gemini 2.5 Flash Lite — best free-tier ceiling on this AI Studio project
 * (15 RPM / 1500 RPD). 1.5-flash is 404 here, 2.5-flash is 250 RPD which
 * we burn through on first crawl, 2.0-flash is free-tier-locked (limit:0).
 * Lite handles short Turkish summaries fine.
 */
export const GEMINI_MODEL = "gemini-2.5-flash-lite";

let cachedClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI | null {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) return null;
  if (cachedClient) return cachedClient;
  cachedClient = new GoogleGenAI({ apiKey });
  return cachedClient;
}

export interface InsightOutput {
  title: string;
  body: string;
  bullets: string[];
}

const insightSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Bir cümlelik öne çıkan istatistik" },
    body: {
      type: Type.STRING,
      description: "3-4 cümlelik dürüst, doğal Türkçe özet",
    },
    bullets: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2-4 madde — kısa cümleler",
    },
  },
  required: ["title", "body", "bullets"],
};

export interface GenerateAmountInsightInput {
  scopeLabel: string;
  count: number;
  median: number;
  avg: number;
  p25: number;
  p75: number;
  min: number;
  max: number;
  /** Singular form of what's being measured: "maaş" / "kira" / "internet hızı" */
  nounSingular: string;
  /** Plural / context noun: "maaşlar" / "kira ilanları" / "internet ölçümleri" */
  nounPlural: string;
  /**
   * Format function for the number values shown to the model. Defaults to
   * Turkish-locale TRY (₺75.000). Pass a Mbps/ms/etc. formatter for non-money
   * scopes — without this the model assumes prices and the summary is wrong.
   */
  formatValue?: (n: number) => string;
}

/**
 * Generate a short Turkish summary for any monetary stats scope. Module-
 * specific copy is injected via `nounSingular`/`nounPlural` so the same
 * function powers salary, rent, utility, and future modules without forks.
 *
 * Returns null if the API key isn't configured or the call fails — the
 * caller is expected to render gracefully without a summary.
 */
export async function generateAmountInsight(
  input: GenerateAmountInsightInput,
): Promise<InsightOutput | null> {
  const client = getClient();
  if (!client) return null;

  const prompt = buildPrompt(input);

  try {
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: insightSchema,
        temperature: 0.4,
        maxOutputTokens: 600,
      },
    });

    const text = response.text;
    if (!text) return null;
    const parsed = JSON.parse(text) as InsightOutput;
    if (!parsed.title || !parsed.body) return null;
    return {
      title: String(parsed.title).slice(0, 160),
      body: String(parsed.body).slice(0, 800),
      bullets: Array.isArray(parsed.bullets)
        ? parsed.bullets.slice(0, 5).map((b) => String(b).slice(0, 200))
        : [],
    };
  } catch (err) {
    console.error("[gemini] insight generation failed:", err);
    return null;
  }
}

function defaultTryFormat(n: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(n);
}

function buildPrompt(input: GenerateAmountInsightInput): string {
  const fmt = input.formatValue ?? defaultTryFormat;
  const spread = input.p75 - input.p25;
  const spreadPct = input.median > 0 ? Math.round((spread / input.median) * 100) : 0;
  const meanVsMedian =
    input.median > 0
      ? Math.round(((input.avg - input.median) / input.median) * 100)
      : 0;

  return `Sen Türkiye'deki ${input.nounPlural} verisini analiz eden bir veri analistisin. Bir piyasa analisti gibi yaz — hikaye anlat, sayılara ses ver. Hedef: insanı durdurup okutsun, şıma değil yorum versin.

KAPSAM: ${input.scopeLabel}
SAYI: ${input.count} paylaşım
MEDYAN: ${fmt(input.median)}
ORTALAMA: ${fmt(input.avg)} (medyandan %${meanVsMedian} ${meanVsMedian >= 0 ? "yüksek" : "düşük"})
ÇEYREKLİK ARALIK: ${fmt(input.p25)} – ${fmt(input.p75)} (medyanın %${spreadPct}'i kadar)
MIN: ${fmt(input.min)}
MAX: ${fmt(input.max)}

YAZIM KURALI:
- Title (35-65 karakter): bir gözlem, bir cümle, somut ("Kadıköy 1+1 medyanı 38.000 TL'ye oturdu" gibi). Soru işareti yok, sıfat enflasyonu yok.
- Body (3-4 cümle): pasif/sıkıcı tablo dili yok. Aktif fiil, somut karşılaştırma, dağılım yorumu. "Veriden ne çıkıyor", "neyi gözden kaçırma" tarzı.
  Örnek ton: "Bursa Nilüfer'de 2+1 segmenti 3+1'i sıkıştırıyor — ikisi de 25.000 bandında. Üst çeyrek 32.000'e çıkmış, lüks ilanların etkisi belli."
- Bullets (3-5 madde, her biri 8-15 kelime):
  • dağılımdan bir gözlem (örn. "P75 ile medyan arasında %X aralık — homojen değil")
  • aykırı değer sinyali (max ile median oranı)
  • veri kalite uyarısı (eğer count<10 ise mutlaka)
- "${input.nounSingular}" kelimesini doğru bağlamda kullan; başka birime çevirme (mbps'i TRY göstermek vb.).
- "Yaklaşık", "ortalama olarak", "genel olarak" gibi muğlak kelime YASAK.
- Sayıları AYNEN kullan, yorum ekle ama uydurma.
- Veri çok azsa (count<10) ilk bullet'ta açıkça uyar; ama yine yorum yap.

JSON: { title, body, bullets[] }`;
}

// Backward-compat alias — older callers can keep using the salary-specific name.
export const generateSalaryInsight = (input: Omit<GenerateAmountInsightInput, "nounSingular" | "nounPlural">) =>
  generateAmountInsight({ ...input, nounSingular: "maaş", nounPlural: "maaşlar" });

export type SalaryInsightOutput = InsightOutput;
