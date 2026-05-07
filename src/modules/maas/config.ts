/**
 * Module config — single source of truth for the salary module's identity.
 */

export const maasModule = {
  type: "SALARY",
  slug: "maaslar",
  itemSlug: "maas",
  name: "Maaş",
  pluralName: "Maaşlar",
  basePath: "/maaslar",
  newPath: "/maaslar/yeni",
  description:
    "Türkiye'de pozisyon, sektör ve şehir bazında anonim olarak paylaşılan net maaş verileri.",
} as const;

export const workModeLabels: Record<"ONSITE" | "HYBRID" | "REMOTE", string> = {
  ONSITE: "Ofis",
  HYBRID: "Hibrit",
  REMOTE: "Uzaktan",
};

export const companySizeLabels: Record<
  "SOLO" | "MICRO" | "SMALL" | "MEDIUM" | "LARGE" | "ENTERPRISE",
  string
> = {
  SOLO: "Tek kişi",
  MICRO: "2–9 kişi",
  SMALL: "10–49 kişi",
  MEDIUM: "50–249 kişi",
  LARGE: "250–999 kişi",
  ENTERPRISE: "1000+ kişi",
};
