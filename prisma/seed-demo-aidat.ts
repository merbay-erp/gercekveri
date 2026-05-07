/**
 * Demo seed for aidat (HOA / apartment dues) module — diverse samples
 * across cities, site types and amenity bundles. ipHash prefix
 * `demo-aidat-*` for later purge.
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { slugify } from "../src/lib/slug";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

interface AidatSample {
  citySlug: string;
  district?: string;
  siteType: "BLOCK" | "VILLA" | "INDEPENDENT" | "RESIDENCE";
  m2: number;
  buildingAge: "0-5" | "5-10" | "10-20" | "20+";
  aidatAmount: number;
  amenities: (
    | "hasElevator"
    | "hasParking"
    | "hasSecurity"
    | "hasPool"
    | "hasGym"
    | "heatingIncluded"
  )[];
}

const samples: AidatSample[] = [
  // Premium İstanbul rezidanslar
  { citySlug: "istanbul", district: "Şişli", siteType: "RESIDENCE", m2: 110, buildingAge: "0-5", aidatAmount: 8500, amenities: ["hasElevator", "hasParking", "hasSecurity", "hasPool", "hasGym", "heatingIncluded"] },
  { citySlug: "istanbul", district: "Ataşehir", siteType: "RESIDENCE", m2: 130, buildingAge: "0-5", aidatAmount: 9500, amenities: ["hasElevator", "hasParking", "hasSecurity", "hasPool", "hasGym"] },
  { citySlug: "istanbul", district: "Sarıyer", siteType: "VILLA", m2: 220, buildingAge: "5-10", aidatAmount: 12000, amenities: ["hasParking", "hasSecurity", "hasPool", "heatingIncluded"] },

  // İstanbul orta segment site
  { citySlug: "istanbul", district: "Kadıköy", siteType: "BLOCK", m2: 95, buildingAge: "5-10", aidatAmount: 4200, amenities: ["hasElevator", "hasParking", "hasSecurity"] },
  { citySlug: "istanbul", district: "Üsküdar", siteType: "BLOCK", m2: 100, buildingAge: "10-20", aidatAmount: 3800, amenities: ["hasElevator", "hasSecurity"] },
  { citySlug: "istanbul", district: "Beşiktaş", siteType: "INDEPENDENT", m2: 80, buildingAge: "20+", aidatAmount: 1500, amenities: ["hasElevator"] },
  { citySlug: "istanbul", district: "Esenyurt", siteType: "BLOCK", m2: 100, buildingAge: "0-5", aidatAmount: 2800, amenities: ["hasElevator", "hasParking", "hasSecurity", "hasPool"] },

  // Ankara
  { citySlug: "ankara", district: "Çankaya", siteType: "BLOCK", m2: 110, buildingAge: "5-10", aidatAmount: 2500, amenities: ["hasElevator", "hasParking", "hasSecurity"] },
  { citySlug: "ankara", district: "Çankaya", siteType: "RESIDENCE", m2: 130, buildingAge: "0-5", aidatAmount: 5500, amenities: ["hasElevator", "hasParking", "hasSecurity", "hasPool", "hasGym", "heatingIncluded"] },
  { citySlug: "ankara", district: "Keçiören", siteType: "BLOCK", m2: 95, buildingAge: "10-20", aidatAmount: 1500, amenities: ["hasElevator", "hasParking"] },
  { citySlug: "ankara", district: "Yenimahalle", siteType: "INDEPENDENT", m2: 85, buildingAge: "20+", aidatAmount: 800, amenities: ["hasElevator"] },

  // İzmir
  { citySlug: "izmir", district: "Karşıyaka", siteType: "BLOCK", m2: 100, buildingAge: "5-10", aidatAmount: 2200, amenities: ["hasElevator", "hasParking", "hasSecurity"] },
  { citySlug: "izmir", district: "Konak", siteType: "INDEPENDENT", m2: 90, buildingAge: "20+", aidatAmount: 900, amenities: ["hasElevator"] },
  { citySlug: "izmir", district: "Bornova", siteType: "BLOCK", m2: 110, buildingAge: "0-5", aidatAmount: 2800, amenities: ["hasElevator", "hasParking", "hasSecurity", "hasPool"] },

  // Bursa
  { citySlug: "bursa", district: "Nilüfer", siteType: "BLOCK", m2: 110, buildingAge: "0-5", aidatAmount: 2200, amenities: ["hasElevator", "hasParking", "hasSecurity"] },
  { citySlug: "bursa", district: "Osmangazi", siteType: "INDEPENDENT", m2: 90, buildingAge: "10-20", aidatAmount: 750, amenities: ["hasElevator"] },

  // Antalya
  { citySlug: "antalya", district: "Konyaaltı", siteType: "BLOCK", m2: 100, buildingAge: "0-5", aidatAmount: 3500, amenities: ["hasElevator", "hasParking", "hasSecurity", "hasPool"] },
  { citySlug: "antalya", district: "Muratpaşa", siteType: "INDEPENDENT", m2: 80, buildingAge: "10-20", aidatAmount: 1100, amenities: ["hasElevator"] },
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
        type: "AIDAT",
        cityId: city.id,
        districtId,
        amount: s.aidatAmount,
        currency: "TRY",
        data: {
          siteType: s.siteType,
          m2: s.m2,
          buildingAge: s.buildingAge,
          amenities: s.amenities,
          citySlug: s.citySlug,
          districtName: s.district ?? null,
          cityName: city.name,
        },
        status: "APPROVED",
        approvedAt: new Date(),
        trustScore: 50,
        qualityScore: 50,
        ipHash: `demo-aidat-${s.citySlug}-${s.aidatAmount}-${s.m2}`,
      },
    });
    inserted++;
  }
  console.log(`✔ ${inserted} demo aidat submission inserted.`);
}

main().catch(console.error).finally(() => db.$disconnect());
