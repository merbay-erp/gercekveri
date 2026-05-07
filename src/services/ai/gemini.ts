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
  /** Singular form of what's being measured: "maaş" / "kira" / "fatura" */
  nounSingular: string;
  /** Plural / context noun: "maaşlar" / "kira ilanları" / "faturalar" */
  nounPlural: string;
  /** Cadence — defaults to "/ay" for monthly amounts */
  unitSuffix?: string;
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

function buildPrompt(input: GenerateAmountInsightInput): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(n);

  const unitSuffix = input.unitSuffix ?? "/ay";

  return `Sen Türkiye'deki ${input.nounPlural} verisini analiz eden, dürüst ve sade konuşan bir veri analistisisin. Aşağıdaki istatistikler için kısa bir Türkçe özet yaz.

Kapsam: ${input.scopeLabel}
Veri sayısı: ${input.count}
Medyan: ${fmt(input.median)} ${unitSuffix}
Ortalama: ${fmt(input.avg)} ${unitSuffix}
Alt çeyrek (P25): ${fmt(input.p25)} ${unitSuffix}
Üst çeyrek (P75): ${fmt(input.p75)} ${unitSuffix}
Minimum: ${fmt(input.min)} ${unitSuffix}
Maksimum: ${fmt(input.max)} ${unitSuffix}

Kurallar:
- Sadece veriden çıkanı söyle, varsayım yapma.
- Sayıları aynen kullan; uydurma rakam ekleme.
- "${input.nounSingular}" kelimesini doğal yerlerde kullan.
- Özet kısa, doğal, doğrudan olsun (3-4 cümle).
- "Yaklaşık", "ortalama olarak" gibi muğlak ifadelerden kaçın; rakamı söyle.
- Bullet'lar kısa, net olsun (en fazla 12 kelime).
- Türkçe karakterleri doğru kullan.
- Veri sayısı azsa (10'un altı) bunu uyarı olarak ilk cümlede belirt.

JSON çıktı ver: { title, body, bullets[] }`;
}

// Backward-compat alias — older callers can keep using the salary-specific name.
export const generateSalaryInsight = (input: Omit<GenerateAmountInsightInput, "nounSingular" | "nounPlural">) =>
  generateAmountInsight({ ...input, nounSingular: "maaş", nounPlural: "maaşlar" });

export type SalaryInsightOutput = InsightOutput;
