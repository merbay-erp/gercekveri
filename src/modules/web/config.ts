// Web (alan adı) dolandırıcılık dikeyi — kimlik sabitleri.
export const webModule = {
  kind: "WEB",
  slug: "web",
  label: "Web sitesi",
  basePath: "/sorgu/web",
  placeholder: "ör. hizliodeme-kargo.com",
} as const;

// İhbar kategorileri (FraudReport.category değerleri).
export const reportCategories = [
  { key: "sahte-magaza", label: "Sahte mağaza / e-ticaret" },
  { key: "kargo-taklidi", label: "Kargo / firma taklidi" },
  { key: "phishing", label: "Phishing / kimlik avı" },
  { key: "kapora", label: "Kapora dolandırıcılığı" },
  { key: "sahte-banka", label: "Sahte banka / ödeme" },
  { key: "diger", label: "Diğer" },
] as const;

export type ReportCategoryKey = (typeof reportCategories)[number]["key"];

export function reportCategoryLabel(key: string): string {
  return reportCategories.find((c) => c.key === key)?.label ?? "İhbar";
}
