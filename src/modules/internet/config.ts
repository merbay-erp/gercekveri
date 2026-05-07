/**
 * Internet (ISP) module config — list of providers + display labels.
 */

export const internetModule = {
  type: "INTERNET",
  slug: "internet",
  itemSlug: "internet",
  name: "İnternet",
  pluralName: "İnternet sağlayıcıları",
  basePath: "/internet",
  newPath: "/internet/yeni",
  description:
    "Türkiye'deki internet sağlayıcılarının gerçek hızı, ping ve memnuniyet verisi — anonim kullanıcılardan.",
} as const;

export interface IspDef {
  slug: string;
  name: string;
  /** Tailwind accent for badges/cards */
  accent: string;
}

export const isps: IspDef[] = [
  { slug: "turk-telekom", name: "Türk Telekom", accent: "from-rose-500/15" },
  { slug: "superonline", name: "Superonline", accent: "from-yellow-500/15" },
  { slug: "vodafone", name: "Vodafone", accent: "from-red-500/15" },
  { slug: "turknet", name: "TurkNet", accent: "from-emerald-500/15" },
  { slug: "millenicom", name: "Millenicom", accent: "from-violet-500/15" },
  { slug: "d-smart", name: "D-Smart", accent: "from-orange-500/15" },
  { slug: "diger", name: "Diğer", accent: "from-slate-500/15" },
];

export const ispsBySlug = new Map(isps.map((i) => [i.slug, i]));

export const outageFrequencyLabels: Record<
  "NEVER" | "MONTHLY" | "WEEKLY" | "DAILY",
  string
> = {
  NEVER: "Hiç kesilmiyor",
  MONTHLY: "Ayda 1-2 kez",
  WEEKLY: "Haftada 1+ kez",
  DAILY: "Neredeyse her gün",
};

export const outageStabilityScore: Record<
  "NEVER" | "MONTHLY" | "WEEKLY" | "DAILY",
  number
> = {
  NEVER: 1.0,
  MONTHLY: 0.7,
  WEEKLY: 0.3,
  DAILY: 0.0,
};

export function formatMbps(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "–";
  return `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(
    value,
  )} Mbps`;
}

export function formatMs(value: number | null | undefined): string {
  if (value === null || value === undefined || !Number.isFinite(value)) return "–";
  return `${new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(
    value,
  )} ms`;
}
