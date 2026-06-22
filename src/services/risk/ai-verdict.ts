import { GoogleGenAI } from "@google/genai";
import type { RiskBand, Signal } from "./types";
import { BAND_LABEL } from "./types";

// Risk kartı için sade-dil özeti + tavsiye. Gemini anahtarı yoksa sinyallerden
// kural-tabanlı bir özet üretir — kart asla boş kalmaz (graceful degrade).

let cached: GoogleGenAI | null = null;
function client(): GoogleGenAI | null {
  const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
  if (!key) return null;
  cached ??= new GoogleGenAI({ apiKey: key });
  return cached;
}

const ADVICE: Record<RiskBand, string> = {
  DANGER: "Bu adrese kart, IBAN veya şifre bilgisi girme; ödeme yapma.",
  SUSPICIOUS: "Acele etme; ödemeden önce satıcıyı bağımsız bir kanaldan doğrula.",
  SAFE: "Belirgin bir tehlike işareti yok; yine de ödeme adresini teyit et.",
  UNKNOWN: "Yeterli sinyal toplanamadı; temkinli ol ve bağımsız doğrula.",
};

function fallbackSummary(display: string, band: RiskBand, signals: Signal[]): string {
  const bad = signals.filter((s) => s.status === "bad").map((s) => s.label.toLowerCase());
  const reason = bad.length ? ` Öne çıkan işaretler: ${bad.join(", ")}.` : "";
  return `${display} için risk değerlendirmesi: ${BAND_LABEL[band].toLowerCase()}.${reason} ${ADVICE[band]}`;
}

export async function generateVerdict(input: {
  display: string;
  band: RiskBand;
  score: number;
  signals: Signal[];
  /** "web sitesi" | "IBAN" | "telefon numarası" — prompt bağlamı */
  subject?: string;
}): Promise<string> {
  const { display, band, score, signals, subject = "adres" } = input;
  const ai = client();
  if (!ai) return fallbackSummary(display, band, signals);

  const sigText = signals.map((s) => `- ${s.label}: ${s.value} (${s.status})`).join("\n");
  const prompt = `Sen bir dolandırıcılık-koruma asistanısın. Aşağıdaki ${subject} için 2-3 cümlelik, sade, panik yapmayan ama net bir Türkçe değerlendirme yaz. Teknik jargon kullanma. Son cümle somut bir tavsiye olsun.

Sorgu: ${display}
Risk skoru: ${score}/100 (${BAND_LABEL[band]})
Sinyaller:
${sigText}

Sadece değerlendirme metnini yaz, başlık veya madde işareti ekleme.`;

  try {
    const res = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: { temperature: 0.4, maxOutputTokens: 220 },
    });
    const text = res.text?.trim();
    return text && text.length > 20 ? text : fallbackSummary(display, band, signals);
  } catch {
    return fallbackSummary(display, band, signals);
  }
}
