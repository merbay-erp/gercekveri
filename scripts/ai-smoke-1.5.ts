import { config } from "dotenv";
config({ path: ".env.local" });

import { GoogleGenAI } from "@google/genai";

async function main() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY!;
  const ai = new GoogleGenAI({ apiKey });
  for (const m of [
    "gemini-2.5-flash-lite",
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-2.5-flash",
  ]) {
    try {
      const r = await ai.models.generateContent({
        model: m,
        contents: "Tek cümlelik 'merhaba' Türkçe.",
      });
      console.log(`✔ ${m}:`, r.text);
    } catch (e: unknown) {
      const err = e as { status?: number; message?: string };
      const msg = (err.message ?? "").slice(0, 180);
      console.log(`✗ ${m}: ${err.status} ${msg}`);
    }
  }
}

main().catch(console.error);
