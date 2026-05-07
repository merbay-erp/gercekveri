/**
 * Demo seed for kira (rent) module — same intent as seed-demo.ts but for
 * the new rent vertical. Marked via ipHash prefix `demo-kira-*` for
 * easy purging later.
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { slugify } from "../src/lib/slug";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

interface RentSample {
  citySlug: string;
  district?: string;
  roomCount: "studio" | "1+0" | "1+1" | "2+1" | "3+1" | "4+1" | "5+";
  m2: number;
  buildingAge: "0-5" | "5-10" | "10-20" | "20+";
  rentPrice: number;
  furnished: "FURNISHED" | "UNFURNISHED" | "PARTIAL";
  heating?: "KOMBI" | "MERKEZI" | "DOGALGAZ_SOBASI" | "KLIMA" | "SOBALI" | "YOK";
}

const samples: RentSample[] = [
  // Istanbul — heavy weight
  { citySlug: "istanbul", district: "Kadıköy", roomCount: "1+1", m2: 70, buildingAge: "10-20", rentPrice: 38000, furnished: "UNFURNISHED", heating: "KOMBI" },
  { citySlug: "istanbul", district: "Kadıköy", roomCount: "2+1", m2: 95, buildingAge: "5-10", rentPrice: 52000, furnished: "UNFURNISHED", heating: "KOMBI" },
  { citySlug: "istanbul", district: "Beşiktaş", roomCount: "1+1", m2: 65, buildingAge: "20+", rentPrice: 35000, furnished: "PARTIAL", heating: "KOMBI" },
  { citySlug: "istanbul", district: "Şişli", roomCount: "2+1", m2: 100, buildingAge: "10-20", rentPrice: 47000, furnished: "UNFURNISHED", heating: "MERKEZI" },
  { citySlug: "istanbul", district: "Üsküdar", roomCount: "3+1", m2: 130, buildingAge: "0-5", rentPrice: 65000, furnished: "UNFURNISHED", heating: "KOMBI" },
  { citySlug: "istanbul", district: "Ataşehir", roomCount: "2+1", m2: 110, buildingAge: "5-10", rentPrice: 55000, furnished: "UNFURNISHED", heating: "KOMBI" },
  { citySlug: "istanbul", district: "Esenyurt", roomCount: "1+1", m2: 60, buildingAge: "10-20", rentPrice: 18000, furnished: "UNFURNISHED", heating: "KOMBI" },

  // Ankara
  { citySlug: "ankara", district: "Çankaya", roomCount: "2+1", m2: 95, buildingAge: "5-10", rentPrice: 28000, furnished: "UNFURNISHED", heating: "KOMBI" },
  { citySlug: "ankara", district: "Keçiören", roomCount: "3+1", m2: 120, buildingAge: "10-20", rentPrice: 22000, furnished: "UNFURNISHED", heating: "MERKEZI" },
  { citySlug: "ankara", district: "Yenimahalle", roomCount: "1+1", m2: 65, buildingAge: "20+", rentPrice: 14000, furnished: "UNFURNISHED", heating: "KOMBI" },

  // Izmir
  { citySlug: "izmir", district: "Konak", roomCount: "1+1", m2: 70, buildingAge: "10-20", rentPrice: 24000, furnished: "UNFURNISHED", heating: "KOMBI" },
  { citySlug: "izmir", district: "Karşıyaka", roomCount: "2+1", m2: 100, buildingAge: "5-10", rentPrice: 32000, furnished: "UNFURNISHED", heating: "KOMBI" },
  { citySlug: "izmir", district: "Bornova", roomCount: "1+1", m2: 60, buildingAge: "20+", rentPrice: 18000, furnished: "FURNISHED", heating: "KOMBI" },

  // Bursa
  { citySlug: "bursa", district: "Nilüfer", roomCount: "2+1", m2: 105, buildingAge: "0-5", rentPrice: 25000, furnished: "UNFURNISHED", heating: "KOMBI" },
  { citySlug: "bursa", district: "Osmangazi", roomCount: "1+1", m2: 65, buildingAge: "10-20", rentPrice: 13000, furnished: "UNFURNISHED", heating: "DOGALGAZ_SOBASI" },

  // Antalya
  { citySlug: "antalya", district: "Muratpaşa", roomCount: "1+1", m2: 70, buildingAge: "5-10", rentPrice: 22000, furnished: "FURNISHED", heating: "KLIMA" },
  { citySlug: "antalya", district: "Konyaaltı", roomCount: "2+1", m2: 100, buildingAge: "0-5", rentPrice: 35000, furnished: "UNFURNISHED", heating: "KOMBI" },
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
        type: "RENT",
        cityId: city.id,
        districtId,
        amount: s.rentPrice,
        currency: "TRY",
        data: {
          roomCount: s.roomCount,
          m2: s.m2,
          buildingAge: s.buildingAge,
          furnished: s.furnished,
          heating: s.heating ?? null,
          citySlug: s.citySlug,
          districtName: s.district ?? null,
          cityName: city.name,
        },
        status: "APPROVED",
        approvedAt: new Date(),
        trustScore: 50,
        qualityScore: 50,
        ipHash: `demo-kira-${s.citySlug}-${s.rentPrice}-${s.m2}`,
      },
    });
    inserted++;
  }
  console.log(`✔ ${inserted} demo kira submission inserted.`);
}

main().catch(console.error).finally(() => db.$disconnect());
