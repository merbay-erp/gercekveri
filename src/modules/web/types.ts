import type { RiskBand, Signal } from "@/services/risk/types";

export interface WebEntityView {
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
  key: string;
  display: string;
  band: RiskBand;
  reportCount: number;
  topCategory: string | null;
  updatedAt: string;
}
