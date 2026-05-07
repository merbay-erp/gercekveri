/**
 * Aidat (apartment dues / HOA fees) module config.
 *
 * Türkiye'de "site aidatı" / "apartman aidatı" kavramı her ay ödenen
 * yönetim aidatıdır. Komşu fark araştırması en sık yapılan sorgulardan
 * biri — bu modül onu çözüyor.
 */

export const aidatModule = {
  type: "AIDAT",
  slug: "aidat",
  itemSlug: "aidat",
  name: "Aidat",
  pluralName: "Site aidatları",
  basePath: "/aidat",
  newPath: "/aidat/yeni",
  description:
    "Türkiye'de apartman ve site aidatları — anonim sakin verilerinden derlenmiş gerçek tutarlar.",
} as const;

export const siteTypeLabels: Record<
  "BLOCK" | "VILLA" | "INDEPENDENT" | "RESIDENCE",
  string
> = {
  BLOCK: "Bloklu site",
  VILLA: "Villa sitesi",
  INDEPENDENT: "Müstakil apartman",
  RESIDENCE: "Rezidans",
};

export const buildingAgeLabels: Record<"0-5" | "5-10" | "10-20" | "20+", string> = {
  "0-5": "0-5 yaş",
  "5-10": "5-10 yaş",
  "10-20": "10-20 yaş",
  "20+": "20+ yaş",
};

export type AmenityKey =
  | "hasElevator"
  | "hasParking"
  | "hasSecurity"
  | "hasPool"
  | "hasGym"
  | "heatingIncluded";

export const amenityLabels: Record<AmenityKey, string> = {
  hasElevator: "Asansör",
  hasParking: "Otopark",
  hasSecurity: "Güvenlik",
  hasPool: "Havuz",
  hasGym: "Spor salonu",
  heatingIncluded: "Isıtma dahil",
};

export const amenityOrder: AmenityKey[] = [
  "hasElevator",
  "hasParking",
  "hasSecurity",
  "hasPool",
  "hasGym",
  "heatingIncluded",
];
