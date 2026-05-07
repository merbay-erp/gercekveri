/**
 * Static search index — generated server-side once, sent to the client as
 * a single JSON blob. ~200 entries (positions + cities + categories +
 * comparisons + utility types + ISPs), small enough to filter in-memory
 * with no network round-trips per keystroke.
 */
import { cities } from "@/lib/cities";
import { commonPositions } from "@/modules/maas/positions";
import { positionSlugFor } from "@/modules/maas/position-resolver";
import { isps } from "@/modules/internet/config";
import { utilityTypes, utilityLabels, utilitySlugs } from "@/modules/fatura/config";
import {
  subTypes as tekstilSubTypes,
  subTypeLabels as tekstilSubTypeLabels,
  subTypeSlugs as tekstilSubTypeSlugs,
} from "@/modules/tekstil/config";

export type SearchEntryGroup =
  | "Pozisyon"
  | "Şehir — Maaş"
  | "Şehir — Kira"
  | "Şehir — Aidat"
  | "Şehir — Fatura"
  | "Şehir — Tekstil"
  | "Şehir — İnternet"
  | "Sayfa"
  | "Karşılaştır"
  | "Fatura türü"
  | "Tekstil iş tipi"
  | "İnternet sağlayıcı";

export interface SearchEntry {
  /** Stable id within the group */
  id: string;
  group: SearchEntryGroup;
  label: string;
  /** Lowercase + Turkish-ASCII fold of label, used for matching */
  haystack: string;
  href: string;
  /** Optional secondary description shown next to the label */
  hint?: string;
}

function fold(s: string): string {
  return s
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u");
}

const STATIC_PAGES: Array<{ label: string; href: string; hint?: string }> = [
  { label: "Maaşlar", href: "/maaslar", hint: "Pozisyon ve şehir bazında" },
  { label: "Kira", href: "/kira", hint: "Bölgesel kira fiyatları" },
  { label: "Kira şişkinliği — Gerçek vs İlan", href: "/kira/sisme", hint: "Şehir bazlı şişkinlik" },
  { label: "Aidat", href: "/aidat", hint: "Site ve apartman aidatları" },
  { label: "Fatura", href: "/fatura", hint: "Elektrik, doğalgaz, su" },
  { label: "Tekstil", href: "/tekstil", hint: "Üretim fiyatları" },
  { label: "İnternet", href: "/internet", hint: "Sağlayıcı bazında gerçek hız" },
  { label: "İstatistikler", href: "/istatistikler", hint: "Canlı sayaçlar" },
  { label: "Hakkında", href: "/hakkinda" },
];

const COMPARE_PAGES: Array<{ label: string; href: string; hint: string }> = [
  { label: "Maaşımı karşılaştır", href: "/karsilastir/maas", hint: "Türkiye medyanı" },
  { label: "Kiramı karşılaştır", href: "/karsilastir/kira", hint: "Bölge medyanı" },
  { label: "Aidatımı karşılaştır", href: "/karsilastir/aidat", hint: "Yapı tipi + bölge" },
  { label: "Faturamı karşılaştır", href: "/karsilastir/fatura", hint: "Tüketim + hane" },
  { label: "Tekstil fiyatımı karşılaştır", href: "/karsilastir/tekstil", hint: "İş tipi + birim" },
];

let cached: SearchEntry[] | null = null;

export function buildSearchIndex(): SearchEntry[] {
  if (cached) return cached;

  const entries: SearchEntry[] = [];

  for (const page of STATIC_PAGES) {
    entries.push({
      id: `page:${page.href}`,
      group: "Sayfa",
      label: page.label,
      haystack: fold(page.label),
      href: page.href,
      hint: page.hint,
    });
  }

  for (const c of COMPARE_PAGES) {
    entries.push({
      id: `cmp:${c.href}`,
      group: "Karşılaştır",
      label: c.label,
      haystack: fold(c.label),
      href: c.href,
      hint: c.hint,
    });
  }

  for (const p of commonPositions) {
    const slug = positionSlugFor(p);
    entries.push({
      id: `pos:${slug}`,
      group: "Pozisyon",
      label: p,
      haystack: fold(p),
      href: `/maaslar/${slug}`,
    });
  }

  // City entries — duplicated across categories (5 per city, ~400 entries).
  // Filtering by group on the client makes this acceptable.
  for (const c of cities) {
    entries.push({
      id: `city-salary:${c.slug}`,
      group: "Şehir — Maaş",
      label: `${c.name} maaşları`,
      haystack: fold(`${c.name} ${c.region} maas`),
      href: `/maaslar/sehir/${c.slug}`,
      hint: c.region,
    });
    entries.push({
      id: `city-rent:${c.slug}`,
      group: "Şehir — Kira",
      label: `${c.name} kiraları`,
      haystack: fold(`${c.name} ${c.region} kira`),
      href: `/kira/sehir/${c.slug}`,
      hint: c.region,
    });
    entries.push({
      id: `city-aidat:${c.slug}`,
      group: "Şehir — Aidat",
      label: `${c.name} aidatları`,
      haystack: fold(`${c.name} ${c.region} aidat`),
      href: `/aidat/sehir/${c.slug}`,
      hint: c.region,
    });
    entries.push({
      id: `city-fatura:${c.slug}`,
      group: "Şehir — Fatura",
      label: `${c.name} faturaları`,
      haystack: fold(`${c.name} ${c.region} fatura`),
      href: `/fatura/sehir/${c.slug}`,
      hint: c.region,
    });
    entries.push({
      id: `city-tekstil:${c.slug}`,
      group: "Şehir — Tekstil",
      label: `${c.name} tekstil`,
      haystack: fold(`${c.name} ${c.region} tekstil`),
      href: `/tekstil/sehir/${c.slug}`,
      hint: c.region,
    });
    entries.push({
      id: `city-internet:${c.slug}`,
      group: "Şehir — İnternet",
      label: `${c.name} internet`,
      haystack: fold(`${c.name} ${c.region} internet`),
      href: `/internet/sehir/${c.slug}`,
      hint: c.region,
    });
  }

  for (const u of utilityTypes) {
    entries.push({
      id: `util:${u}`,
      group: "Fatura türü",
      label: utilityLabels[u],
      haystack: fold(utilityLabels[u]),
      href: `/fatura/${utilitySlugs[u]}`,
    });
  }

  for (const s of tekstilSubTypes) {
    entries.push({
      id: `tekstil-sub:${s}`,
      group: "Tekstil iş tipi",
      label: tekstilSubTypeLabels[s],
      haystack: fold(tekstilSubTypeLabels[s]),
      href: `/tekstil/${tekstilSubTypeSlugs[s]}`,
    });
  }

  for (const isp of isps) {
    entries.push({
      id: `isp:${isp.slug}`,
      group: "İnternet sağlayıcı",
      label: isp.name,
      haystack: fold(isp.name),
      href: `/internet/${isp.slug}`,
    });
  }

  cached = entries;
  return entries;
}
