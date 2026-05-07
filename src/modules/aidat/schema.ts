import { z } from "zod";

export const siteTypeEnum = z.enum(["BLOCK", "VILLA", "INDEPENDENT", "RESIDENCE"]);
export const buildingAgeEnum = z.enum(["0-5", "5-10", "10-20", "20+"]);

export const aidatInputSchema = z.object({
  citySlug: z.string().min(2, "Şehir seç").max(40),
  districtName: z.string().max(80).optional().or(z.literal("")),
  siteType: siteTypeEnum,
  m2: z.coerce
    .number({ message: "m² gerekli" })
    .int("Tam sayı olmalı")
    .min(20, "En az 20 m²")
    .max(2000, "Çok yüksek"),
  buildingAge: buildingAgeEnum,
  aidatAmount: z.coerce
    .number({ message: "Aidat tutarı gerekli" })
    .int("Kuruşsuz tam tutar gir")
    .min(100, "En az 100 TL")
    .max(100_000, "Çok yüksek"),
  hasElevator: z.coerce.boolean().default(false),
  hasParking: z.coerce.boolean().default(false),
  hasSecurity: z.coerce.boolean().default(false),
  hasPool: z.coerce.boolean().default(false),
  hasGym: z.coerce.boolean().default(false),
  heatingIncluded: z.coerce.boolean().default(false),
  // Honeypot
  website: z.string().max(0).optional().or(z.literal("")),
});

export type AidatInput = z.infer<typeof aidatInputSchema>;

export const aidatDefaults: AidatInput = {
  citySlug: "",
  districtName: "",
  siteType: "BLOCK",
  m2: 100,
  buildingAge: "5-10",
  aidatAmount: 0,
  hasElevator: false,
  hasParking: false,
  hasSecurity: false,
  hasPool: false,
  hasGym: false,
  heatingIncluded: false,
  website: "",
};
