import { z } from "zod";

export const roomCountEnum = z.enum([
  "studio",
  "1+0",
  "1+1",
  "2+1",
  "3+1",
  "4+1",
  "5+",
]);

export const buildingAgeEnum = z.enum(["0-5", "5-10", "10-20", "20+"]);

export const furnishedEnum = z.enum(["FURNISHED", "UNFURNISHED", "PARTIAL"]);

export const heatingEnum = z.enum([
  "KOMBI",
  "MERKEZI",
  "DOGALGAZ_SOBASI",
  "KLIMA",
  "SOBALI",
  "YOK",
]);

export const rentInputSchema = z.object({
  citySlug: z.string().min(2, "Şehir seç").max(40),
  districtName: z.string().max(80).optional().or(z.literal("")),
  roomCount: roomCountEnum,
  m2: z.coerce
    .number({ message: "m² gerekli" })
    .int("Tam sayı olmalı")
    .min(15, "En az 15 m²")
    .max(2000, "Çok yüksek"),
  buildingAge: buildingAgeEnum,
  rentPrice: z.coerce
    .number({ message: "Kira tutarı gerekli" })
    .int("Kuruşsuz tam tutar gir")
    .min(500, "En az 500 TL")
    .max(1_000_000_000, "Çok yüksek bir değer"),
  // İlan kaynaklı fiyat (opsiyonel) — emlakçı / sahibinden duyurulan
  // sayı. "Gerçek vs ilan şişkinlik" panelini besler. Boş bırakılırsa
  // sadece gerçek tutar kullanılır.
  listedPrice: z.coerce
    .number()
    .int()
    .min(500)
    .max(1_000_000_000)
    .optional(),
  furnished: furnishedEnum,
  heating: heatingEnum.optional().or(z.literal("")),
  // Honeypot — hidden field bots fill, humans skip.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type RentInput = z.infer<typeof rentInputSchema>;

export const rentDefaults: RentInput = {
  citySlug: "",
  districtName: "",
  roomCount: "1+1",
  m2: 0,
  buildingAge: "0-5",
  rentPrice: 0,
  listedPrice: undefined,
  furnished: "UNFURNISHED",
  heating: "",
  website: "",
};
