import type { RiskBand, Signal } from "@/services/risk/types";
import type { LookupKind } from "@/services/risk/registry";

export interface EntityView {
  kind: LookupKind;
  key: string;
  display: string;
  score: number;
  band: RiskBand;
  signals: Signal[];
  aiSummary: string;
  reportCount: number;
  lastScanAt: string | null;
}

export interface FraudFeedItem {
  kind: LookupKind;
  key: string;
  display: string;
  band: RiskBand;
  reportCount: number;
  topCategory: string | null;
  updatedAt: string;
}
