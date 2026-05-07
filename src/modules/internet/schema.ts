import { z } from "zod";

export const ispEnum = z.enum([
  "turk-telekom",
  "superonline",
  "vodafone",
  "turknet",
  "millenicom",
  "d-smart",
  "diger",
]);

export const outageFrequencyEnum = z.enum(["NEVER", "MONTHLY", "WEEKLY", "DAILY"]);

export const internetInputSchema = z.object({
  citySlug: z.string().min(2, "Şehir seç").max(40),
  districtName: z.string().max(80).optional().or(z.literal("")),
  isp: ispEnum,
  packageSpeedMbps: z.coerce
    .number({ message: "Paket hızı gerekli" })
    .int("Tam sayı olmalı")
    .min(1, "En az 1 Mbps")
    .max(10000, "Çok yüksek"),
  realSpeedMbps: z.coerce
    .number({ message: "Ölçülen hız gerekli" })
    .int("Tam sayı olmalı")
    .min(0, "0'dan küçük olamaz")
    .max(10000, "Çok yüksek"),
  pingMs: z.coerce
    .number({ message: "Ping gerekli" })
    .int("Tam sayı olmalı")
    .min(1, "En az 1 ms")
    .max(2000, "Çok yüksek"),
  satisfaction: z.coerce
    .number({ message: "Memnuniyet puanı gerekli" })
    .int()
    .min(1, "En az 1")
    .max(5, "En fazla 5"),
  outageFrequency: outageFrequencyEnum,
  // Honeypot
  website: z.string().max(0).optional().or(z.literal("")),
});

export type InternetInput = z.infer<typeof internetInputSchema>;

export const internetDefaults: InternetInput = {
  citySlug: "",
  districtName: "",
  isp: "turk-telekom",
  packageSpeedMbps: 100,
  realSpeedMbps: 0,
  pingMs: 0,
  satisfaction: 3,
  outageFrequency: "MONTHLY",
  website: "",
};
