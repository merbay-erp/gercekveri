/**
 * Kira (rent) module — single source of truth for the rent module's identity.
 */

export const kiraModule = {
  type: "RENT",
  slug: "kira",
  itemSlug: "kira",
  name: "Kira",
  pluralName: "Kiralar",
  basePath: "/kira",
  newPath: "/kira/yeni",
  description:
    "Türkiye'de şehir ve ilçe bazında anonim olarak paylaşılan gerçek kira fiyatları.",
} as const;

export const roomCountLabels: Record<
  "studio" | "1+0" | "1+1" | "2+1" | "3+1" | "4+1" | "5+",
  string
> = {
  studio: "Stüdyo",
  "1+0": "1+0",
  "1+1": "1+1",
  "2+1": "2+1",
  "3+1": "3+1",
  "4+1": "4+1",
  "5+": "5+",
};

export const buildingAgeLabels: Record<"0-5" | "5-10" | "10-20" | "20+", string> = {
  "0-5": "0-5 yaş",
  "5-10": "5-10 yaş",
  "10-20": "10-20 yaş",
  "20+": "20+ yaş",
};

export const furnishedLabels: Record<"FURNISHED" | "UNFURNISHED" | "PARTIAL", string> = {
  FURNISHED: "Eşyalı",
  UNFURNISHED: "Eşyasız",
  PARTIAL: "Yarı eşyalı",
};

export const heatingLabels: Record<
  "KOMBI" | "MERKEZI" | "DOGALGAZ_SOBASI" | "KLIMA" | "SOBALI" | "YOK",
  string
> = {
  KOMBI: "Kombi",
  MERKEZI: "Merkezi",
  DOGALGAZ_SOBASI: "Doğalgaz sobası",
  KLIMA: "Klima",
  SOBALI: "Sobalı",
  YOK: "Yok",
};
