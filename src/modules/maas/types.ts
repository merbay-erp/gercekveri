/**
 * Domain types for the salary module — independent of Prisma so we can swap
 * data sources without rewiring the UI.
 */

export interface SalaryDataPayload {
  position: string;
  positionSlug?: string;
  experienceYears: number;
  workMode: "ONSITE" | "HYBRID" | "REMOTE";
  companySize?: string | null;
  sector?: string | null;
  citySlug: string;
  districtSlug?: string | null;
  cityName?: string;
  districtName?: string | null;
}

export interface SalarySubmissionView {
  publicId: string;
  amount: number;
  currency: "TRY";
  data: SalaryDataPayload;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: Date;
  cityName: string | null;
  districtName: string | null;
}

export interface SalaryStats {
  count: number;
  avg: number | null;
  median: number | null;
  p25: number | null;
  p75: number | null;
  min: number | null;
  max: number | null;
}
