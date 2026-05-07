/**
 * Fatura (utility bills) module — elektrik, doğalgaz, su faturaları.
 *
 * Türkiye'de elektrik/gaz/su zamları doğrudan toplumu etkiliyor; "şu kadar
 * tüketim için bu fatura normal mi?" sorusunun cevabı yok. Bu modül onu
 * çözüyor: utility tipi + şehir + tüketim üzerinden gerçek dağılımlar.
 */

export const faturaModule = {
  type: "UTILITY",
  slug: "fatura",
  itemSlug: "fatura",
  name: "Fatura",
  pluralName: "Faturalar",
  basePath: "/fatura",
  newPath: "/fatura/yeni",
  description:
    "Türkiye'de elektrik, doğalgaz ve su faturaları — anonim hane verisinden derlenmiş gerçek tutarlar ve birim maliyetler.",
} as const;

export type UtilityType = "ELEKTRIK" | "DOGALGAZ" | "SU";

export const utilityTypes: UtilityType[] = ["ELEKTRIK", "DOGALGAZ", "SU"];

export const utilityLabels: Record<UtilityType, string> = {
  ELEKTRIK: "Elektrik",
  DOGALGAZ: "Doğalgaz",
  SU: "Su",
};

export const utilityPluralLabels: Record<UtilityType, string> = {
  ELEKTRIK: "elektrik faturaları",
  DOGALGAZ: "doğalgaz faturaları",
  SU: "su faturaları",
};

/** Slug used in URLs — Turkish-ASCII fold. */
export const utilitySlugs: Record<UtilityType, string> = {
  ELEKTRIK: "elektrik",
  DOGALGAZ: "dogalgaz",
  SU: "su",
};

export const utilityFromSlug: Record<string, UtilityType> = {
  elektrik: "ELEKTRIK",
  dogalgaz: "DOGALGAZ",
  su: "SU",
};

export const utilityUnits: Record<UtilityType, string> = {
  ELEKTRIK: "kWh",
  DOGALGAZ: "m³",
  SU: "m³",
};

export type HouseholdSize = "1" | "2" | "3" | "4" | "5+";

export const householdSizes: HouseholdSize[] = ["1", "2", "3", "4", "5+"];

export const householdSizeLabels: Record<HouseholdSize, string> = {
  "1": "1 kişi",
  "2": "2 kişi",
  "3": "3 kişi",
  "4": "4 kişi",
  "5+": "5+ kişi",
};
