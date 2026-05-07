import type { AmenityKey } from "./config";

export interface AidatDataPayload {
  siteType: "BLOCK" | "VILLA" | "INDEPENDENT" | "RESIDENCE";
  m2: number;
  buildingAge: "0-5" | "5-10" | "10-20" | "20+";
  amenities: AmenityKey[];
  citySlug: string;
  districtName?: string | null;
  cityName?: string;
}

export interface AidatSubmissionView {
  publicId: string;
  amount: number;
  currency: "TRY";
  data: AidatDataPayload;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: Date;
  cityName: string | null;
  districtName: string | null;
}
