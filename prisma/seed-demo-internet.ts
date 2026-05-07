/**
 * Demo seed for internet (ISP) module — diverse samples across providers
 * and cities so the AI insight + ISP comparison table have signal. Marked
 * via ipHash prefix `demo-internet-*` for later purge.
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { slugify } from "../src/lib/slug";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

interface InternetSample {
  citySlug: string;
  district?: string;
  isp:
    | "turk-telekom"
    | "superonline"
    | "vodafone"
    | "turknet"
    | "millenicom"
    | "d-smart"
    | "diger";
  packageSpeedMbps: number;
  realSpeedMbps: number;
  pingMs: number;
  satisfaction: number; // 1-5
  outageFrequency: "NEVER" | "MONTHLY" | "WEEKLY" | "DAILY";
}

const samples: InternetSample[] = [
  // Türk Telekom
  { citySlug: "istanbul", district: "Kadıköy", isp: "turk-telekom", packageSpeedMbps: 100, realSpeedMbps: 78, pingMs: 22, satisfaction: 3, outageFrequency: "MONTHLY" },
  { citySlug: "istanbul", district: "Beşiktaş", isp: "turk-telekom", packageSpeedMbps: 50, realSpeedMbps: 42, pingMs: 28, satisfaction: 3, outageFrequency: "MONTHLY" },
  { citySlug: "ankara", district: "Çankaya", isp: "turk-telekom", packageSpeedMbps: 100, realSpeedMbps: 85, pingMs: 18, satisfaction: 4, outageFrequency: "NEVER" },
  { citySlug: "izmir", district: "Karşıyaka", isp: "turk-telekom", packageSpeedMbps: 100, realSpeedMbps: 70, pingMs: 25, satisfaction: 3, outageFrequency: "MONTHLY" },
  { citySlug: "bursa", district: "Nilüfer", isp: "turk-telekom", packageSpeedMbps: 50, realSpeedMbps: 45, pingMs: 22, satisfaction: 3, outageFrequency: "MONTHLY" },

  // Superonline
  { citySlug: "istanbul", district: "Şişli", isp: "superonline", packageSpeedMbps: 200, realSpeedMbps: 175, pingMs: 12, satisfaction: 5, outageFrequency: "NEVER" },
  { citySlug: "istanbul", district: "Üsküdar", isp: "superonline", packageSpeedMbps: 100, realSpeedMbps: 95, pingMs: 14, satisfaction: 4, outageFrequency: "NEVER" },
  { citySlug: "ankara", district: "Keçiören", isp: "superonline", packageSpeedMbps: 100, realSpeedMbps: 92, pingMs: 16, satisfaction: 4, outageFrequency: "NEVER" },
  { citySlug: "izmir", district: "Konak", isp: "superonline", packageSpeedMbps: 200, realSpeedMbps: 180, pingMs: 13, satisfaction: 5, outageFrequency: "NEVER" },
  { citySlug: "antalya", district: "Muratpaşa", isp: "superonline", packageSpeedMbps: 100, realSpeedMbps: 88, pingMs: 18, satisfaction: 4, outageFrequency: "MONTHLY" },

  // Vodafone
  { citySlug: "istanbul", district: "Kadıköy", isp: "vodafone", packageSpeedMbps: 100, realSpeedMbps: 80, pingMs: 24, satisfaction: 3, outageFrequency: "MONTHLY" },
  { citySlug: "ankara", district: "Yenimahalle", isp: "vodafone", packageSpeedMbps: 50, realSpeedMbps: 40, pingMs: 30, satisfaction: 3, outageFrequency: "WEEKLY" },
  { citySlug: "izmir", district: "Bornova", isp: "vodafone", packageSpeedMbps: 100, realSpeedMbps: 65, pingMs: 28, satisfaction: 2, outageFrequency: "WEEKLY" },

  // TurkNet
  { citySlug: "istanbul", district: "Beşiktaş", isp: "turknet", packageSpeedMbps: 100, realSpeedMbps: 96, pingMs: 11, satisfaction: 5, outageFrequency: "NEVER" },
  { citySlug: "istanbul", district: "Ataşehir", isp: "turknet", packageSpeedMbps: 200, realSpeedMbps: 195, pingMs: 9, satisfaction: 5, outageFrequency: "NEVER" },
  { citySlug: "ankara", district: "Çankaya", isp: "turknet", packageSpeedMbps: 100, realSpeedMbps: 95, pingMs: 12, satisfaction: 5, outageFrequency: "NEVER" },
  { citySlug: "bursa", district: "Osmangazi", isp: "turknet", packageSpeedMbps: 100, realSpeedMbps: 92, pingMs: 13, satisfaction: 4, outageFrequency: "NEVER" },

  // Millenicom
  { citySlug: "istanbul", district: "Esenyurt", isp: "millenicom", packageSpeedMbps: 50, realSpeedMbps: 38, pingMs: 30, satisfaction: 3, outageFrequency: "MONTHLY" },
  { citySlug: "ankara", district: "Etimesgut", isp: "millenicom", packageSpeedMbps: 100, realSpeedMbps: 75, pingMs: 22, satisfaction: 4, outageFrequency: "MONTHLY" },
];

async function main() {
  let inserted = 0;
  for (const s of samples) {
    const city = await db.city.findUnique({ where: { slug: s.citySlug } });
    if (!city) {
      console.warn("city not found", s.citySlug);
      continue;
    }

    let districtId: number | null = null;
    if (s.district) {
      const districtSlug = slugify(s.district);
      const district = await db.district.upsert({
        where: { cityId_slug: { cityId: city.id, slug: districtSlug } },
        update: { name: s.district },
        create: { cityId: city.id, slug: districtSlug, name: s.district },
      });
      districtId = district.id;
    }

    await db.submission.create({
      data: {
        type: "INTERNET",
        cityId: city.id,
        districtId,
        amount: s.realSpeedMbps,
        currency: "TRY",
        data: {
          isp: s.isp,
          packageSpeedMbps: s.packageSpeedMbps,
          realSpeedMbps: s.realSpeedMbps,
          pingMs: s.pingMs,
          satisfaction: s.satisfaction,
          outageFrequency: s.outageFrequency,
          citySlug: s.citySlug,
          districtName: s.district ?? null,
          cityName: city.name,
        },
        status: "APPROVED",
        approvedAt: new Date(),
        trustScore: 50,
        qualityScore: 50,
        ipHash: `demo-internet-${s.isp}-${s.citySlug}-${s.realSpeedMbps}`,
      },
    });
    inserted++;
  }
  console.log(`✔ ${inserted} demo internet submission inserted.`);
}

main().catch(console.error).finally(() => db.$disconnect());
