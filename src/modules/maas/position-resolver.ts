import { slugify, titleCaseFromSlug } from "@/lib/slug";
import { commonPositions } from "./positions";

/**
 * Map of slug → display name for the curated positions list.
 * Built once at module load; constant-time lookups thereafter.
 */
const curatedSlugToName: Record<string, string> = Object.fromEntries(
  commonPositions.map((p) => [slugify(p), p]),
);

const curatedNameToSlug: Record<string, string> = Object.fromEntries(
  commonPositions.map((p) => [p, slugify(p)]),
);

export function positionSlugFor(name: string): string {
  if (!name) return "";
  // Use curated slug if name matches an existing position exactly,
  // otherwise compute a slug from scratch.
  return curatedNameToSlug[name] ?? slugify(name);
}

/**
 * Resolve a slug back to a human-readable display name.
 * Falls back to title-cased slug if the position isn't in the curated list.
 */
export function positionNameFromSlug(slug: string): string {
  return curatedSlugToName[slug] ?? titleCaseFromSlug(slug);
}

/**
 * Curated slug list — used by sitemap + static params generation.
 * Order mirrors `commonPositions`.
 */
export const curatedPositionSlugs: string[] = commonPositions.map((p) => slugify(p));
