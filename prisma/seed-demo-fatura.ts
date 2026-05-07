/**
 * Demo seed for fatura (utility bills) module — diverse samples across
 * cities, utility types, and household sizes. ipHash prefix `demo-fatura-*`
 * for later purge.
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { slugify } from "../src/lib/slug";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

interface FaturaSample {
  citySlug: string;
  district?: string;
  utilityType: "ELEKTRIK" | "DOGALGAZ" | "SU";
  amountTRY: number;
  consumption: number;
  householdSize: "1" | "2" | "3" | "4" | "5+";
  billingMonth: string; // YYYY-MM
}

const samples: FaturaSample[] = [
  // İstanbul — elektrik
  { citySlug: "istanbul", district: "Kadıköy", utilityType: "ELEKTRIK", amountTRY: 1850, consumption: 280, householdSize: "2", billingMonth: "2026-03" },
  { citySlug: "istanbul", district: "Ümraniye", utilityType: "ELEKTRIK", amountTRY: 2400, consumption: 360, householdSize: "4", billingMonth: "2026-03" },
  { citySlug: "istanbul", district: "Bakırköy", utilityType: "ELEKTRIK", amountTRY: 3200, consumption: 480, householdSize: "5+", billingMonth: "2026-02" },
  { citySlug: "istanbul", district: "Şişli", utilityType: "ELEKTRIK", amountTRY: 1450, consumption: 220, householdSize: "1", billingMonth: "2026-03" },
  // İstanbul — doğalgaz (winter)
  { citySlug: "istanbul", district: "Kadıköy", utilityType: "DOGALGAZ", amountTRY: 2800, consumption: 220, householdSize: "2", billingMonth: "2026-01" },
  { citySlug: "istanbul", district: "Üsküdar", utilityType: "DOGALGAZ", amountTRY: 3900, consumption: 310, householdSize: "4", billingMonth: "2026-01" },
  { citySlug: "istanbul", district: "Beşiktaş", utilityType: "DOGALGAZ", amountTRY: 2100, consumption: 165, householdSize: "1", billingMonth: "2026-02" },
  // İstanbul — su
  { citySlug: "istanbul", district: "Kadıköy", utilityType: "SU", amountTRY: 420, consumption: 14, householdSize: "2", billingMonth: "2026-03" },
  { citySlug: "istanbul", district: "Esenyurt", utilityType: "SU", amountTRY: 680, consumption: 22, householdSize: "5+", billingMonth: "2026-03" },

  // Ankara
  { citySlug: "ankara", district: "Çankaya", utilityType: "ELEKTRIK", amountTRY: 1650, consumption: 260, householdSize: "2", billingMonth: "2026-03" },
  { citySlug: "ankara", district: "Yenimahalle", utilityType: "ELEKTRIK", amountTRY: 2100, consumption: 330, householdSize: "4", billingMonth: "2026-03" },
  { citySlug: "ankara", district: "Çankaya", utilityType: "DOGALGAZ", amountTRY: 3200, consumption: 260, householdSize: "3", billingMonth: "2026-01" },
  { citySlug: "ankara", district: "Keçiören", utilityType: "DOGALGAZ", amountTRY: 2400, consumption: 195, householdSize: "2", billingMonth: "2026-02" },
  { citySlug: "ankara", district: "Çankaya", utilityType: "SU", amountTRY: 380, consumption: 12, householdSize: "2", billingMonth: "2026-03" },

  // İzmir
  { citySlug: "izmir", district: "Karşıyaka", utilityType: "ELEKTRIK", amountTRY: 1750, consumption: 270, householdSize: "3", billingMonth: "2026-03" },
  { citySlug: "izmir", district: "Bornova", utilityType: "ELEKTRIK", amountTRY: 1950, consumption: 295, householdSize: "4", billingMonth: "2026-03" },
  { citySlug: "izmir", district: "Konak", utilityType: "DOGALGAZ", amountTRY: 1800, consumption: 145, householdSize: "2", billingMonth: "2026-02" },
  { citySlug: "izmir", district: "Karşıyaka", utilityType: "SU", amountTRY: 350, consumption: 13, householdSize: "3", billingMonth: "2026-03" },

  // Bursa
  { citySlug: "bursa", district: "Nilüfer", utilityType: "ELEKTRIK", amountTRY: 1550, consumption: 240, householdSize: "2", billingMonth: "2026-03" },
  { citySlug: "bursa", district: "Osmangazi", utilityType: "ELEKTRIK", amountTRY: 2200, consumption: 350, householdSize: "5+", billingMonth: "2026-03" },
  { citySlug: "bursa", district: "Nilüfer", utilityType: "DOGALGAZ", amountTRY: 2950, consumption: 235, householdSize: "4", billingMonth: "2026-01" },

  // Antalya — sıcak iklim, doğalgaz az kullanılır
  { citySlug: "antalya", district: "Konyaaltı", utilityType: "ELEKTRIK", amountTRY: 2100, consumption: 320, householdSize: "3", billingMonth: "2026-03" },
  { citySlug: "antalya", district: "Muratpaşa", utilityType: "ELEKTRIK", amountTRY: 1800, consumption: 280, householdSize: "2", billingMonth: "2026-03" },
  { citySlug: "antalya", district: "Konyaaltı", utilityType: "SU", amountTRY: 450, consumption: 15, householdSize: "3", billingMonth: "2026-03" },
];

async function main() {
  let inserted = 0;
  for (const s of samples) {
    const city = await db.city.findUnique({ where: { slug: s.citySlug } });
    if (!city) continue;

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
        type: "UTILITY",
        cityId: city.id,
        districtId,
        amount: s.amountTRY,
        currency: "TRY",
        data: {
          utilityType: s.utilityType,
          consumption: s.consumption,
          householdSize: s.householdSize,
          billingMonth: s.billingMonth,
          citySlug: s.citySlug,
          districtName: s.district ?? null,
          cityName: city.name,
        },
        status: "APPROVED",
        approvedAt: new Date(),
        trustScore: 50,
        qualityScore: 50,
        ipHash: `demo-fatura-${s.citySlug}-${s.utilityType}-${s.amountTRY}-${s.billingMonth}`,
      },
    });
    inserted++;
  }
  console.log(`✔ ${inserted} demo fatura submission inserted.`);
}

main().catch(console.error).finally(() => db.$disconnect());
