import type { UtilityType, HouseholdSize } from "./config";

export interface FaturaDataPayload {
  utilityType: UtilityType;
  consumption: number;
  householdSize: HouseholdSize;
  billingMonth: string;
  citySlug: string;
  districtName?: string | null;
  cityName?: string;
}

export interface FaturaSubmissionView {
  publicId: string;
  /** total bill amount in TRY */
  amount: number;
  currency: "TRY";
  data: FaturaDataPayload;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: Date;
  cityName: string | null;
  districtName: string | null;
}
