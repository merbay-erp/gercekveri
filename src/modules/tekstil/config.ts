/**
 * Tekstil B2B (textile production pricing) module — kesim/dikim/boyahane
 * vs. fiyatları. Türkiye'nin tekstil ihracatçı olduğu sektör; üreticiler
 * arasında piyasa şeffaflığı yok, fiyatlar telefon üzerinden geziyor.
 * Bu modül onu çözüyor: alt-tip + birim bazında gerçek üretici fiyatları.
 */

export const tekstilModule = {
  type: "TEXTILE",
  slug: "tekstil",
  itemSlug: "tekstil",
  name: "Tekstil",
  pluralName: "Tekstil fiyatları",
  basePath: "/tekstil",
  newPath: "/tekstil/yeni",
  description:
    "Türkiye'de tekstil üretim fiyatları — kesim, dikim, boyahane, baskı, nakış, ütü-paketleme ve kumaş üretimi için anonim üretici verisinden derlenmiş gerçek birim fiyatları.",
} as const;

export type SubType =
  | "KESIM"
  | "DIKIM"
  | "BOYAHANE"
  | "BASKI"
  | "NAKIS"
  | "UTU_PAKETLEME"
  | "KUMAS_URETIM";

export const subTypes: SubType[] = [
  "KESIM",
  "DIKIM",
  "BOYAHANE",
  "BASKI",
  "NAKIS",
  "UTU_PAKETLEME",
  "KUMAS_URETIM",
];

export const subTypeLabels: Record<SubType, string> = {
  KESIM: "Kesim",
  DIKIM: "Dikim",
  BOYAHANE: "Boyahane",
  BASKI: "Baskı",
  NAKIS: "Nakış",
  UTU_PAKETLEME: "Ütü & Paketleme",
  KUMAS_URETIM: "Kumaş Üretimi",
};

export const subTypeSlugs: Record<SubType, string> = {
  KESIM: "kesim",
  DIKIM: "dikim",
  BOYAHANE: "boyahane",
  BASKI: "baski",
  NAKIS: "nakis",
  UTU_PAKETLEME: "utu-paketleme",
  KUMAS_URETIM: "kumas-uretim",
};

export const subTypeFromSlug: Record<string, SubType> = {
  kesim: "KESIM",
  dikim: "DIKIM",
  boyahane: "BOYAHANE",
  baski: "BASKI",
  nakis: "NAKIS",
  "utu-paketleme": "UTU_PAKETLEME",
  "kumas-uretim": "KUMAS_URETIM",
};

export type Unit = "PIECE" | "METER" | "M2" | "KG" | "BATIS_1000";

export const units: Unit[] = ["PIECE", "METER", "M2", "KG", "BATIS_1000"];

export const unitLabels: Record<Unit, string> = {
  PIECE: "parça",
  METER: "metre",
  M2: "m²",
  KG: "kg",
  BATIS_1000: "1000 batış",
};

/**
 * Default unit per sub-type — pre-selects the most common pricing
 * basis when the user picks a category, but the user can still
 * override it.
 */
export const defaultUnitFor: Record<SubType, Unit> = {
  KESIM: "PIECE",
  DIKIM: "PIECE",
  BOYAHANE: "KG",
  BASKI: "PIECE",
  NAKIS: "BATIS_1000",
  UTU_PAKETLEME: "PIECE",
  KUMAS_URETIM: "METER",
};

export type FabricType =
  | "ORME"
  | "DOKUMA"
  | "DENIM"
  | "TRIKO"
  | "POLAR"
  | "KOT"
  | "TEKNIK"
  | "DIGER";

export const fabricTypes: FabricType[] = [
  "ORME",
  "DOKUMA",
  "DENIM",
  "TRIKO",
  "POLAR",
  "KOT",
  "TEKNIK",
  "DIGER",
];

export const fabricTypeLabels: Record<FabricType, string> = {
  ORME: "Örme / Jersey",
  DOKUMA: "Dokuma",
  DENIM: "Denim",
  TRIKO: "Triko",
  POLAR: "Polar",
  KOT: "Kot",
  TEKNIK: "Teknik kumaş",
  DIGER: "Diğer",
};

export type CustomerType =
  | "MARKA"
  | "KONFEKSIYONCU"
  | "PERAKENDE"
  | "BUTIK"
  | "EXPORT"
  | "DIGER";

export const customerTypes: CustomerType[] = [
  "MARKA",
  "KONFEKSIYONCU",
  "PERAKENDE",
  "BUTIK",
  "EXPORT",
  "DIGER",
];

export const customerTypeLabels: Record<CustomerType, string> = {
  MARKA: "Büyük marka (LCW, Koton vb.)",
  KONFEKSIYONCU: "Konfeksiyoncu / Fason",
  PERAKENDE: "Perakende zinciri",
  BUTIK: "Butik / Küçük marka",
  EXPORT: "Yurt dışı / İhracat",
  DIGER: "Diğer",
};
