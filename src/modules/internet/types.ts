export type IspSlug =
  | "turk-telekom"
  | "superonline"
  | "vodafone"
  | "turknet"
  | "millenicom"
  | "d-smart"
  | "diger";

export type OutageFrequency = "NEVER" | "MONTHLY" | "WEEKLY" | "DAILY";

export interface InternetDataPayload {
  isp: IspSlug;
  packageSpeedMbps: number;
  realSpeedMbps: number;
  pingMs: number;
  satisfaction: number; // 1-5
  outageFrequency: OutageFrequency;
  citySlug: string;
  districtName?: string | null;
  cityName?: string;
}

export interface InternetSubmissionView {
  publicId: string;
  data: InternetDataPayload;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: Date;
  cityName: string | null;
  districtName: string | null;
}

export interface InternetMultiStats {
  count: number;
  /** Median real speed in Mbps */
  medianRealSpeed: number | null;
  avgRealSpeed: number | null;
  medianPackageSpeed: number | null;
  /** Speed efficiency: real/package ratio, 0-1 */
  speedEfficiency: number | null;
  medianPing: number | null;
  avgSatisfaction: number | null;
  /** Stability score 0-1 — share of submissions reporting "never" or "monthly" */
  stabilityScore: number | null;
}
