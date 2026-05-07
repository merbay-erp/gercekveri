import { createHash } from "node:crypto";

import { db } from "@/lib/db";
import { generateAmountInsight, GEMINI_MODEL } from "./gemini";

/**
 * AI summaries are stored in `AiSummary` table keyed by (scope, language).
 * The `promptHash` field invalidates cache when prompt structure changes.
 */

const PROMPT_VERSION = "v3-2026-05-temporal";
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
// 30-minute negative cache: when generation fails (rate limit, API down)
// we still write to AiSummary with empty body so the next request can
// short-circuit instead of hammering the API.
const FAILURE_CACHE_MS = 30 * 60 * 1000;
const MIN_DATA_FOR_INSIGHT = 3;

interface ScopeStats {
  count: number;
  avg: number | null;
  median: number | null;
  p25: number | null;
  p75: number | null;
  min: number | null;
  max: number | null;
}

interface GetOrGenerateArgs {
  scope: string;
  scopeLabel: string;
  stats: ScopeStats;
  /** Single-word noun e.g. "maaş", "kira" — used in the AI prompt copy. */
  nounSingular?: string;
  /** Plural / context noun e.g. "maaşlar", "kira ilanları". */
  nounPlural?: string;
  /**
   * Override how stats values are stringified in the prompt. Defaults to TRY
   * — pass a Mbps / ms formatter for non-money scopes.
   */
  formatValue?: (n: number) => string;
}

export interface CachedInsight {
  title: string | null;
  body: string;
  bullets: string[];
  inputCount: number;
  modelName: string;
  generatedAt: Date;
}

function statsHash(stats: ScopeStats): string {
  const payload = JSON.stringify([
    stats.count,
    stats.avg,
    stats.median,
    stats.p25,
    stats.p75,
    stats.min,
    stats.max,
  ]);
  return createHash("sha256").update(`${PROMPT_VERSION}:${payload}`).digest("hex").slice(0, 24);
}

/**
 * Read a cached insight; trigger generation only when missing/stale, the
 * scope has enough data, and we have an API key.
 *
 * Behaviour intentionally degrades silently — pages must render fine even
 * when AI is unavailable.
 */
export async function getOrGenerateInsight({
  scope,
  scopeLabel,
  stats,
  nounSingular = "maaş",
  nounPlural = "maaşlar",
  formatValue,
}: GetOrGenerateArgs): Promise<CachedInsight | null> {
  if (
    stats.count < MIN_DATA_FOR_INSIGHT ||
    stats.median === null ||
    stats.avg === null ||
    stats.p25 === null ||
    stats.p75 === null ||
    stats.min === null ||
    stats.max === null
  ) {
    return null;
  }

  const promptHash = statsHash(stats);

  let cached: { title: string | null; body: string; bullets: unknown; inputCount: number; modelName: string; updatedAt: Date; promptHash: string; validUntil: Date | null } | null = null;
  try {
    cached = await db.aiSummary.findUnique({
      where: { scope_language: { scope, language: "tr" } },
    });
  } catch (err) {
    console.warn("[insights] cache read failed:", err);
  }

  if (
    cached &&
    cached.promptHash === promptHash &&
    (!cached.validUntil || cached.validUntil.getTime() > Date.now())
  ) {
    // Empty body = negative cache (previous generation failed). Hold off
    // re-attempting until validUntil expires.
    if (!cached.body) return null;
    return {
      title: cached.title,
      body: cached.body,
      bullets: Array.isArray(cached.bullets) ? (cached.bullets as string[]) : [],
      inputCount: cached.inputCount,
      modelName: cached.modelName,
      generatedAt: cached.updatedAt,
    };
  }

  const generated = await generateAmountInsight({
    scopeLabel,
    count: stats.count,
    median: stats.median,
    avg: stats.avg,
    p25: stats.p25,
    p75: stats.p75,
    min: stats.min,
    max: stats.max,
    nounSingular,
    nounPlural,
    formatValue,
  });

  if (!generated) {
    // Negative-cache the failure so we don't keep retrying within the
    // rate-limit window.
    try {
      await db.aiSummary.upsert({
        where: { scope_language: { scope, language: "tr" } },
        update: {
          title: null,
          body: "",
          bullets: [],
          inputCount: stats.count,
          modelName: GEMINI_MODEL,
          promptHash,
          validUntil: new Date(Date.now() + FAILURE_CACHE_MS),
        },
        create: {
          scope,
          language: "tr",
          title: null,
          body: "",
          bullets: [],
          inputCount: stats.count,
          modelName: GEMINI_MODEL,
          promptHash,
          validUntil: new Date(Date.now() + FAILURE_CACHE_MS),
        },
      });
    } catch (err) {
      console.warn("[insights] negative cache write failed:", err);
    }
    return null;
  }

  const validUntil = new Date(Date.now() + CACHE_TTL_MS);

  try {
    const saved = await db.aiSummary.upsert({
      where: { scope_language: { scope, language: "tr" } },
      update: {
        title: generated.title,
        body: generated.body,
        bullets: generated.bullets,
        inputCount: stats.count,
        modelName: GEMINI_MODEL,
        promptHash,
        validUntil,
      },
      create: {
        scope,
        language: "tr",
        title: generated.title,
        body: generated.body,
        bullets: generated.bullets,
        inputCount: stats.count,
        modelName: GEMINI_MODEL,
        promptHash,
        validUntil,
      },
    });

    return {
      title: saved.title,
      body: saved.body,
      bullets: Array.isArray(saved.bullets) ? (saved.bullets as string[]) : [],
      inputCount: saved.inputCount,
      modelName: saved.modelName,
      generatedAt: saved.updatedAt,
    };
  } catch (err) {
    console.warn("[insights] cache write failed:", err);
    return {
      title: generated.title,
      body: generated.body,
      bullets: generated.bullets,
      inputCount: stats.count,
      modelName: GEMINI_MODEL,
      generatedAt: new Date(),
    };
  }
}

export function buildSalaryScope(positionSlug?: string, citySlug?: string): string {
  const parts = ["salary"];
  if (citySlug) parts.push(`c/${citySlug}`);
  if (positionSlug) parts.push(`p/${positionSlug}`);
  return parts.length === 1 ? "salary:all" : parts.join(":");
}

export function buildRentScope(citySlug?: string): string {
  if (!citySlug) return "rent:all";
  return `rent:c/${citySlug}`;
}

export function buildAidatScope(citySlug?: string): string {
  if (!citySlug) return "aidat:all";
  return `aidat:c/${citySlug}`;
}

export function buildFaturaScope(utilitySlug?: string, citySlug?: string): string {
  const parts = ["fatura"];
  if (utilitySlug) parts.push(`u/${utilitySlug}`);
  if (citySlug) parts.push(`c/${citySlug}`);
  return parts.length === 1 ? "fatura:all" : parts.join(":");
}

export function buildInternetScope(ispSlug?: string, citySlug?: string): string {
  const parts = ["internet"];
  if (citySlug) parts.push(`c/${citySlug}`);
  if (ispSlug) parts.push(`i/${ispSlug}`);
  return parts.length === 1 ? "internet:all" : parts.join(":");
}

// Backward-compat alias — older callers using the salary-specific name.
export const getOrGenerateSalaryInsight = getOrGenerateInsight;
