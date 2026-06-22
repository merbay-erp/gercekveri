import type { RiskBand, SignalStatus } from "@/services/risk/types";

// Bant ve sinyal durumu → Tailwind sınıfları (tek yerden, tutarlı).
export const bandText: Record<RiskBand, string> = {
  DANGER: "text-danger",
  SUSPICIOUS: "text-warning",
  SAFE: "text-success",
  UNKNOWN: "text-muted-foreground",
};

export const bandSoft: Record<RiskBand, string> = {
  DANGER: "bg-danger/10 text-danger",
  SUSPICIOUS: "bg-warning/10 text-warning",
  SAFE: "bg-success/10 text-success",
  UNKNOWN: "bg-muted text-muted-foreground",
};

export const statusSoft: Record<SignalStatus, string> = {
  bad: "bg-danger/10 text-danger",
  warn: "bg-warning/10 text-warning",
  good: "bg-success/10 text-success",
  info: "bg-muted text-muted-foreground",
};

export const statusIcon: Record<SignalStatus, string> = {
  bad: "text-danger",
  warn: "text-warning",
  good: "text-success",
  info: "text-muted-foreground",
};
