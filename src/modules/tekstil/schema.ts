import { z } from "zod";

export const subTypeEnum = z.enum([
  "KESIM",
  "DIKIM",
  "BOYAHANE",
  "BASKI",
  "NAKIS",
  "UTU_PAKETLEME",
  "KUMAS_URETIM",
]);

export const unitEnum = z.enum(["PIECE", "METER", "M2", "KG", "BATIS_1000"]);

export const fabricTypeEnum = z.enum([
  "ORME",
  "DOKUMA",
  "DENIM",
  "TRIKO",
  "POLAR",
  "KOT",
  "TEKNIK",
  "DIGER",
]);

export const customerTypeEnum = z.enum([
  "MARKA",
  "KONFEKSIYONCU",
  "PERAKENDE",
  "BUTIK",
  "EXPORT",
  "DIGER",
]);

export const tekstilInputSchema = z.object({
  citySlug: z.string().min(2, "Şehir seç").max(40),
  districtName: z.string().max(80).optional().or(z.literal("")),
  subType: subTypeEnum,
  unit: unitEnum,
  unitPrice: z.coerce
    .number({ message: "Birim fiyatı gerekli" })
    .positive("Pozitif olmalı")
    .min(0.01, "Çok düşük")
    .max(100_000, "Çok yüksek"),
  minOrderQuantity: z.coerce.number().int().nonnegative().max(1_000_000).optional(),
  fabricType: fabricTypeEnum.optional().or(z.literal("")),
  // 1 = single color print, otherwise count of colors used
  colorCount: z.coerce.number().int().min(1).max(50).optional(),
  customerType: customerTypeEnum.optional().or(z.literal("")),
  // Honeypot
  website: z.string().max(0).optional().or(z.literal("")),
});

export type TekstilInput = z.infer<typeof tekstilInputSchema>;

export const tekstilDefaults: TekstilInput = {
  citySlug: "",
  districtName: "",
  subType: "DIKIM",
  unit: "PIECE",
  unitPrice: 0,
  minOrderQuantity: undefined,
  fabricType: "",
  colorCount: undefined,
  customerType: "",
  website: "",
};
