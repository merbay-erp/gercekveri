import type { ScanResult } from "./types";
import { normalizeDomain, scanWeb } from "./web";
import { formatIban, normalizeIban, scanIban } from "./iban";
import { formatPhone, normalizePhone, scanPhone } from "./phone";

// Tek sorgu türü kaydı: normalize + tara + görüntüle + ihbar kategorileri.
// Yeni dikey eklemek = buraya bir satır + bir scanner.

export type LookupKind = "web" | "iban" | "phone";

export interface ReportCategory {
  key: string;
  label: string;
}

export interface KindDef {
  kind: LookupKind;
  /** Prisma EntityKind değeri */
  entityKind: "WEB" | "IBAN" | "PHONE";
  label: string;
  /** hero giriş placeholder'ı */
  placeholder: string;
  /** lucide ikon adı */
  icon: string;
  /** ham girişi kanonik anahtara çevirir (geçersizse null) */
  normalize: (raw: string) => string | null;
  /** anahtardan kullanıcıya gösterilecek biçim */
  display: (key: string) => string;
  /** anahtarı tarar */
  scan: (key: string) => Promise<ScanResult>;
  /** itibar yalnız ihbardan: ihbar yoksa bant UNKNOWN (biçim doğru ≠ güvenli) */
  reputationOnly: boolean;
  categories: ReportCategory[];
  metaTitle: (display: string) => string;
  metaDescription: (display: string) => string;
}

const WEB_CATS: ReportCategory[] = [
  { key: "sahte-magaza", label: "Sahte mağaza / e-ticaret" },
  { key: "kargo-taklidi", label: "Kargo / firma taklidi" },
  { key: "phishing", label: "Phishing / kimlik avı" },
  { key: "kapora", label: "Kapora dolandırıcılığı" },
  { key: "sahte-banka", label: "Sahte banka / ödeme" },
  { key: "diger", label: "Diğer" },
];

const IBAN_CATS: ReportCategory[] = [
  { key: "kapora", label: "Kapora dolandırıcılığı" },
  { key: "sahte-magaza", label: "Sahte mağaza / e-ticaret" },
  { key: "sahte-banka", label: "Sahte banka / ödeme" },
  { key: "yatirim", label: "Sahte yatırım" },
  { key: "diger", label: "Diğer" },
];

const PHONE_CATS: ReportCategory[] = [
  { key: "sahte-banka", label: "Sahte banka araması" },
  { key: "smishing", label: "Dolandırıcı SMS (smishing)" },
  { key: "sahte-kampanya", label: "Sahte kampanya / ödül" },
  { key: "taciz", label: "Taciz / istenmeyen arama" },
  { key: "diger", label: "Diğer" },
];

export const REGISTRY: Record<LookupKind, KindDef> = {
  web: {
    kind: "web",
    entityKind: "WEB",
    label: "Web sitesi",
    placeholder: "ör. hizliodeme-kargo.com",
    icon: "globe",
    normalize: normalizeDomain,
    display: (k) => k,
    scan: scanWeb,
    reputationOnly: false,
    categories: WEB_CATS,
    metaTitle: (d) => `${d} güvenli mi? Dolandırıcılık sorgusu`,
    metaDescription: (d) =>
      `${d} gerçek mi, sahte mi? Domain yaşı, kara liste, halk ihbarı ve daha fazlasıyla anlık risk değerlendirmesi — GerçekVeri.`,
  },
  iban: {
    kind: "iban",
    entityKind: "IBAN",
    label: "IBAN",
    placeholder: "ör. TR47 0001 0009 9912 3456 78",
    icon: "building-bank",
    normalize: normalizeIban,
    display: formatIban,
    scan: (k) => Promise.resolve(scanIban(k)),
    reputationOnly: true,
    categories: IBAN_CATS,
    metaTitle: (d) => `${d} dolandırıcı mı? IBAN sorgusu`,
    metaDescription: (d) =>
      `${d} IBAN'ı güvenli mi? Biçim doğrulama, banka tespiti ve halk ihbarıyla risk değerlendirmesi — GerçekVeri.`,
  },
  phone: {
    kind: "phone",
    entityKind: "PHONE",
    label: "Telefon",
    placeholder: "ör. 0850 840 12 34",
    icon: "phone",
    normalize: normalizePhone,
    display: formatPhone,
    scan: (k) => Promise.resolve(scanPhone(k)),
    reputationOnly: true,
    categories: PHONE_CATS,
    metaTitle: (d) => `${d} dolandırıcı mı? Telefon sorgusu`,
    metaDescription: (d) =>
      `${d} numarası dolandırıcı mı? Hat türü ve halk ihbarıyla risk değerlendirmesi — GerçekVeri.`,
  },
};

export const KINDS = Object.values(REGISTRY);

export function kindFromSlug(slug: string): KindDef | null {
  return (REGISTRY as Record<string, KindDef>)[slug] ?? null;
}

export function kindFromEntity(entityKind: string): KindDef {
  return KINDS.find((k) => k.entityKind === entityKind) ?? REGISTRY.web;
}

export function reportCategoryLabel(kind: LookupKind, key: string): string {
  return REGISTRY[kind].categories.find((c) => c.key === key)?.label ?? "İhbar";
}
