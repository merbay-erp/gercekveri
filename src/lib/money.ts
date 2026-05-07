/**
 * Currency formatting helpers — Turkish locale by default.
 * Always use `formatTRY` for amounts displayed to users so the entire site
 * formats consistently (₺ symbol, thousands separator, no fractional digits).
 */

const tryFormatter = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 0,
});

const tryFormatterWithDecimals = new Intl.NumberFormat("tr-TR", {
  style: "currency",
  currency: "TRY",
  maximumFractionDigits: 2,
});

const numberFormatter = new Intl.NumberFormat("tr-TR", {
  maximumFractionDigits: 0,
});

const compactFormatter = new Intl.NumberFormat("tr-TR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

type Numeric = number | string | { toString(): string } | null | undefined;

function toNumber(value: Numeric): number | null {
  if (value === null || value === undefined) return null;
  const n = typeof value === "number" ? value : Number(value.toString());
  return Number.isFinite(n) ? n : null;
}

export function formatTRY(value: Numeric, opts?: { decimals?: boolean }): string {
  const n = toNumber(value);
  if (n === null) return "–";
  return opts?.decimals ? tryFormatterWithDecimals.format(n) : tryFormatter.format(n);
}

export function formatNumber(value: Numeric): string {
  const n = toNumber(value);
  if (n === null) return "–";
  return numberFormatter.format(n);
}

export function formatCompact(value: Numeric): string {
  const n = toNumber(value);
  if (n === null) return "–";
  return compactFormatter.format(n);
}

export function formatPercentChange(value: Numeric): string {
  const n = toNumber(value);
  if (n === null) return "–";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}
