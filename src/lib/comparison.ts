/**
 * Comparison helpers — given a user's value and a sorted list of peer
 * values, compute percentile rank + a Turkish "above/below median" message.
 * The same primitives drive the comparison page UI, the OG share card,
 * and the social-share text.
 */

export interface ComparisonResult {
  /** 0..100 — what fraction of values are below the user's value */
  percentile: number;
  /** Difference vs median, e.g. +0.22 means 22% above median */
  vsMedianRatio: number;
  median: number;
  count: number;
  /** Single-sentence headline — the share-card title */
  headline: string;
  /** Plain language paragraph — used as comparison body + share text */
  body: string;
  /** Color hint for UI: green = high, amber = mid, red = low */
  tone: "high" | "mid" | "low";
}

interface ComputeArgs {
  /** User's value (salary, rent, internet speed) */
  value: number;
  /** Sorted ascending peer values for the scope */
  sortedPeers: number[];
  /** Singular descriptor — "Maaşın", "Kiran", "İnternet hızın" */
  subjectLabel: string;
  /** Scope label — "İstanbul Frontend Developer", "Bursa kira", "Türkiye geneli" */
  scopeLabel: string;
  /** True for "higher is better" metrics (salary, internet speed). False for rent. */
  higherIsBetter: boolean;
  /** Format the value for display ("₺85.000", "92 Mbps") */
  formatValue: (n: number) => string;
}

export function computeComparison({
  value,
  sortedPeers,
  subjectLabel,
  scopeLabel,
  higherIsBetter,
  formatValue,
}: ComputeArgs): ComparisonResult | null {
  if (sortedPeers.length < 3) return null;

  const count = sortedPeers.length;
  const median = percentile(sortedPeers, 0.5);
  if (median === 0) return null;

  // Percentile rank: how many peers strictly below value, divided by total
  const below = sortedPeers.filter((v) => v < value).length;
  const equal = sortedPeers.filter((v) => v === value).length;
  // Average rank (handle ties symmetrically)
  const rawRank = (below + equal / 2) / count;
  const pct = Math.round(rawRank * 100);

  const ratioVsMedian = (value - median) / median;
  const ratioAbsPct = Math.round(Math.abs(ratioVsMedian) * 100);
  const isAbove = value > median;
  const isBelow = value < median;

  // For "lower is better" metrics (rent), flip the framing — high percentile
  // means "you pay more than most peers" which is *bad*, not "high".
  const goodSide = higherIsBetter ? "high" : "low";
  const tone: ComparisonResult["tone"] =
    pct >= 75 ? goodSide : pct >= 25 ? "mid" : goodSide === "high" ? "low" : "high";

  let headline: string;
  if (isAbove) {
    headline = higherIsBetter
      ? `${subjectLabel} ${scopeLabel} medyanının %${ratioAbsPct} üstünde.`
      : `${subjectLabel} ${scopeLabel} medyanından %${ratioAbsPct} fazla — pahalı tarafta.`;
  } else if (isBelow) {
    headline = higherIsBetter
      ? `${subjectLabel} ${scopeLabel} medyanının %${ratioAbsPct} altında.`
      : `${subjectLabel} ${scopeLabel} medyanından %${ratioAbsPct} ucuz — iyi anlaşma.`;
  } else {
    headline = `${subjectLabel} tam ${scopeLabel} medyanında.`;
  }

  const positionPhrase =
    pct >= 90
      ? `top %${100 - pct}`
      : pct >= 75
        ? `üst çeyrekte (%${pct})`
        : pct >= 50
          ? `üst yarıda (%${pct})`
          : pct >= 25
            ? `alt yarıda (%${pct})`
            : `alt çeyrekte (%${pct})`;

  const body = `${count} anonim paylaşımdan oluşan veride ${subjectLabel.toLowerCase()} ${positionPhrase}. Medyan ${formatValue(median)}, sen ${formatValue(value)}.`;

  return {
    percentile: pct,
    vsMedianRatio: ratioVsMedian,
    median,
    count,
    headline,
    body,
    tone,
  };
}

function percentile(sortedValues: number[], p: number): number {
  if (sortedValues.length === 0) return 0;
  const idx = (sortedValues.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sortedValues[lo];
  return sortedValues[lo] + (sortedValues[hi] - sortedValues[lo]) * (idx - lo);
}

/**
 * Build an absolute share URL with all comparison params encoded — this is
 * what we render in social previews.
 */
export function buildComparisonUrl(
  origin: string,
  kind: "maas" | "kira" | "aidat" | "fatura",
  params: Record<string, string | number | undefined>,
): string {
  const url = new URL(`/karsilastir/${kind}`, origin);
  for (const [key, val] of Object.entries(params)) {
    if (val === undefined || val === "") continue;
    url.searchParams.set(key, String(val));
  }
  return url.toString();
}
