/**
 * Turkish-aware slugify. Used both for canonical SEO URLs and for matching
 * free-text submissions against curated position lists.
 *
 * Important: this is *write-only* — slugifying twice MUST produce the same
 * string, since the slug is used as a content-addressed identity.
 */
export function slugify(input: string): string {
  return input
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Best-effort reverse: given a slug, produce a human-readable display name.
 * Used as a fallback when a slug doesn't match a curated list entry.
 */
export function titleCaseFromSlug(slug: string): string {
  if (!slug) return "";
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toLocaleUpperCase("tr-TR") + word.slice(1))
    .join(" ");
}
