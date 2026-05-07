import { z } from "zod";

export const utilityTypeEnum = z.enum(["ELEKTRIK", "DOGALGAZ", "SU"]);
export const householdSizeEnum = z.enum(["1", "2", "3", "4", "5+"]);

export const faturaInputSchema = z.object({
  citySlug: z.string().min(2, "Şehir seç").max(40),
  districtName: z.string().max(80).optional().or(z.literal("")),
  utilityType: utilityTypeEnum,
  // bill total in TRY (KDV dahil son ödenen tutar)
  amountTRY: z.coerce
    .number({ message: "Tutar gerekli" })
    .int("Kuruşsuz tam tutar gir")
    .min(50, "En az 50 TL")
    .max(100_000, "Çok yüksek"),
  // consumption — kWh for elektrik, m³ for gaz/su
  consumption: z.coerce
    .number({ message: "Tüketim gerekli" })
    .positive("Pozitif olmalı")
    .max(50_000, "Çok yüksek"),
  householdSize: householdSizeEnum,
  // YYYY-MM for the billing period
  billingMonth: z
    .string()
    .regex(/^\d{4}-(0[1-9]|1[0-2])$/, "Ay biçimi: YYYY-MM"),
  // Honeypot
  website: z.string().max(0).optional().or(z.literal("")),
});

export type FaturaInput = z.infer<typeof faturaInputSchema>;

const currentMonth = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
})();

export const faturaDefaults: FaturaInput = {
  citySlug: "",
  districtName: "",
  utilityType: "ELEKTRIK",
  amountTRY: 0,
  consumption: 0,
  householdSize: "2",
  billingMonth: currentMonth,
  website: "",
};
