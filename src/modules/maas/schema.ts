import { z } from "zod";

export const workModeEnum = z.enum(["ONSITE", "HYBRID", "REMOTE"]);
export const companySizeEnum = z.enum([
  "SOLO",
  "MICRO",
  "SMALL",
  "MEDIUM",
  "LARGE",
  "ENTERPRISE",
]);

export const salaryInputSchema = z.object({
  citySlug: z.string().min(2, "Şehir seç").max(40),
  districtSlug: z.string().max(80).optional().or(z.literal("")),
  position: z
    .string()
    .min(2, "Pozisyon en az 2 karakter olmalı")
    .max(80, "Çok uzun"),
  sector: z.string().max(80).optional().or(z.literal("")),
  experienceYears: z.coerce
    .number({ message: "Deneyim yılı gerekli" })
    .int("Tam sayı olmalı")
    .min(0, "0'dan küçük olamaz")
    .max(60, "Çok yüksek"),
  netSalary: z.coerce
    .number({ message: "Maaş tutarı gerekli" })
    .int("Kuruşsuz tam tutar gir")
    .min(1000, "En az 1.000 TL gir")
    .max(100_000_000, "Çok yüksek bir değer"),
  workMode: workModeEnum,
  companySize: companySizeEnum.optional().or(z.literal("")),
  // Honeypot — bots fill this; humans can't see it.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type SalaryInput = z.infer<typeof salaryInputSchema>;

export const salaryDefaults: SalaryInput = {
  citySlug: "",
  districtSlug: "",
  position: "",
  sector: "",
  experienceYears: 0,
  netSalary: 0,
  workMode: "ONSITE",
  companySize: "",
  website: "",
};
