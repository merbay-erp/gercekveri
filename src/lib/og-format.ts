/**
 * OG-image-friendly money formatter. next/og's default font set doesn't
 * include the ₺ glyph — it renders as a tofu box. Until we ship a custom
 * TTF/OTF font with full Turkish + currency-symbol coverage, OG endpoints
 * use this "12.345 TL" format instead.
 */
export function ogFormatTRY(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return "—";
  return (
    new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(n) + " TL"
  );
}
