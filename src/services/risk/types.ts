// Risk motoru ortak tipleri. Sinyaller JSON olarak FraudEntity.signals'e yazılır,
// bu yüzden saf veri (serileştirilebilir) tutulur — React tarafı doğrudan render eder.

export type RiskBand = "SAFE" | "SUSPICIOUS" | "DANGER" | "UNKNOWN";

// good = güven artırır, warn = şüphe, bad = ciddi risk, info = nötr bilgi
export type SignalStatus = "good" | "warn" | "bad" | "info";

export interface Signal {
  /** lucide-react ikon adı (ör. "calendar", "shield", "ban") */
  icon: string;
  /** "Domain yaşı" */
  label: string;
  /** "9 gün" */
  value: string;
  status: SignalStatus;
  /** kısa rozet metni: "Çok yeni" */
  pill: string;
  /** risk katkısı (pozitif = riski artırır); skorlama bunu toplar */
  weight: number;
}

export interface ScanResult {
  signals: Signal[];
  /** 0-100 risk */
  score: number;
  band: RiskBand;
  scannedAt: string;
}

export const BAND_LABEL: Record<RiskBand, string> = {
  SAFE: "Güvenli görünüyor",
  SUSPICIOUS: "Şüpheli",
  DANGER: "Yüksek risk",
  UNKNOWN: "Doğrulanmadı",
};
