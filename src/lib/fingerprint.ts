import { createHash } from "node:crypto";

/**
 * Privacy-respecting hashes for anonymous abuse-prevention.
 * We never store raw IPs or full UAs — only one-way hashes salted with HASH_SECRET.
 */

function hash(input: string): string {
  const secret = process.env.HASH_SECRET ?? "dev-only-fallback-please-set";
  return createHash("sha256").update(`${secret}:${input}`).digest("hex").slice(0, 32);
}

export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  return hash(`ip:${ip}`);
}

export function hashFingerprint(parts: { ua?: string | null; lang?: string | null; tz?: string | null }): string | null {
  const ua = parts.ua ?? "";
  const lang = parts.lang ?? "";
  const tz = parts.tz ?? "";
  if (!ua && !lang && !tz) return null;
  return hash(`fp:${ua}|${lang}|${tz}`);
}

/**
 * Truncate a user agent to its first 200 chars — long UAs are abuse vectors,
 * and we only need a coarse signal for moderation.
 */
export function safeUserAgent(ua: string | null | undefined): string | null {
  if (!ua) return null;
  return ua.slice(0, 200);
}
