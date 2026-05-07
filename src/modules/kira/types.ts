export interface RentDataPayload {
  roomCount: "studio" | "1+0" | "1+1" | "2+1" | "3+1" | "4+1" | "5+";
  m2: number;
  buildingAge: "0-5" | "5-10" | "10-20" | "20+";
  furnished: "FURNISHED" | "UNFURNISHED" | "PARTIAL";
  heating?: "KOMBI" | "MERKEZI" | "DOGALGAZ_SOBASI" | "KLIMA" | "SOBALI" | "YOK" | null;
  citySlug: string;
  districtName?: string | null;
  cityName?: string;
}

export interface RentSubmissionView {
  publicId: string;
  amount: number;
  currency: "TRY";
  data: RentDataPayload;
  helpfulCount: number;
  unhelpfulCount: number;
  createdAt: Date;
  cityName: string | null;
  districtName: string | null;
}
