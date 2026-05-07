import type { SubType, Unit, FabricType, CustomerType } from "./config";

export interface TekstilDataPayload {
  subType: SubType;
  unit: Unit;
  minOrderQuantity?: number | null;
  fabricType?: FabricType | null;
  colorCount?: number | null;
  customerType?: CustomerType | null;
  citySlug: string;
  districtName?: string | null;
  cityName?: string;
}

export interface TekstilSubmissionView {
  publicId: string;
  /** unit price in TRY */
  amount: number;
  currency: "TRY";
  data: TekstilDataPayload;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: Date;
  cityName: string | null;
  districtName: string | null;
}
