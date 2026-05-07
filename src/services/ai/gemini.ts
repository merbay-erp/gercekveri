import { GoogleGenAI, Type } from "@google/genai";

/**
 * Gemini 2.5 Flash — Gemini 2.0 Flash is free-tier locked (limit:0) on this
 * project, while 2.5 Flash works with 10 RPM / 250 RPD. The DB cache (7-day
 * TTL) absorbs traffic so 250 RPD is plenty for our scope volume.
 */
export const GEMINI_MODEL = "gemini-2.5-flash";

let cachedClient: GoogleGenAI | null = null;

function getClient(): GoogleGenAI | null {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!apiKey) return null;
  if (cachedClient) return cachedClient;
  cachedClient = new GoogleGenAI({ apiKey });
  return cachedClient;
}

export interface SalaryInsightOutput {
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

interface GenerateInput {
  scopeLabel: string;
  count: number;
  median: number;
  avg: number;
  p25: number;
  p75: number;
  min: number;
  max: number;
}

/**
 * Generate a short Turkish summary for a salary stats scope.
 * Returns null if the API key isn't configured or the call fails — the
 * caller is expected to render gracefully without a summary.
 */
export async function generateSalaryInsight(
  input: GenerateInput,
): Promise<SalaryInsightOutput | null> {
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
    const parsed = JSON.parse(text) as SalaryInsightOutput;
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

function buildPrompt(input: GenerateInput): string {
  const fmt = (n: number) =>
    new Intl.NumberFormat("tr-TR", { style: "currency", currency: "TRY", maximumFractionDigits: 0 }).format(n);

  return `Sen Türkiye'deki maaş verisini analiz eden, dürüst ve sade konuşan bir veri analistisisin. Aşağıdaki istatistikler için kısa bir Türkçe özet yaz.

Kapsam: ${input.scopeLabel}
Veri sayısı: ${input.count}
Medyan: ${fmt(input.median)}
Ortalama: ${fmt(input.avg)}
Alt çeyrek (P25): ${fmt(input.p25)}
Üst çeyrek (P75): ${fmt(input.p75)}
Minimum: ${fmt(input.min)}
Maksimum: ${fmt(input.max)}

Kurallar:
- Sadece veriden çıkanı söyle, varsayım yapma.
- Sayıları aynen kullan; uydurma rakam ekleme.
- Özet kısa, doğal, doğrudan olsun (3-4 cümle).
- "Yaklaşık", "ortalama olarak" gibi muğlak ifadelerden kaçın; rakamı söyle.
- Bullet'lar kısa, net olsun (en fazla 12 kelime).
- Türkçe karakterleri doğru kullan.
- Veri sayısı azsa (10'un altı) bunu uyarı olarak ilk cümlede belirt.

JSON çıktı ver: { title, body, bullets[] }`;
}
