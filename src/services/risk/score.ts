import type { RiskBand, Signal } from "./types";

// Risk skoru: taban + sinyal ağırlıkları, 0-100 aralığına kıstırılır.
// Tek doğruluk kaynağı — hem teknik tarama hem halk ihbarı sinyalleri buradan geçer.
const BASE_RISK = 8;

export function scoreFromSignals(signals: Signal[]): number {
  const raw = signals.reduce((sum, s) => sum + s.weight, BASE_RISK);
  return Math.max(0, Math.min(100, Math.round(raw)));
}

export function bandForScore(score: number, hasSignals: boolean): RiskBand {
  if (!hasSignals) return "UNKNOWN";
  if (score >= 70) return "DANGER";
  if (score >= 35) return "SUSPICIOUS";
  return "SAFE";
}

// Halk ihbarını teknik sinyallerin yanına bir sinyal olarak ekler.
export function reportSignal(reportCount: number): Signal | null {
  if (reportCount <= 0) return null;
  const weight = Math.min(45, reportCount * 9);
  return {
    icon: "users",
    label: "Halk ihbarı",
    value: `${reportCount} kişi bildirdi`,
    status: reportCount >= 3 ? "bad" : "warn",
    pill: reportCount >= 3 ? "Yoğun" : "Var",
    weight,
  };
}
