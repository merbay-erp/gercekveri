/**
 * Seed: cities (81 il), districts (top metro), and the SALARY category.
 * Run with: pnpm db:seed
 *
 * Idempotent — safe to re-run; uses upsert so changes to the source data
 * propagate but historical submissions stay linked.
 */

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { cities } from "../src/lib/cities";
import { categories as categoryDefs } from "../src/lib/site-config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL not set — copy .env.example to .env.local first.");
}

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

const sampleDistricts: Record<string, string[]> = {
  istanbul: [
    "Kadıköy", "Üsküdar", "Beşiktaş", "Şişli", "Beyoğlu", "Fatih",
    "Bakırköy", "Ataşehir", "Maltepe", "Pendik", "Kartal", "Esenyurt",
    "Beylikdüzü", "Sarıyer", "Eyüpsultan", "Ümraniye",
  ],
  ankara: ["Çankaya", "Keçiören", "Yenimahalle", "Mamak", "Etimesgut", "Sincan", "Pursaklar"],
  izmir: ["Konak", "Karşıyaka", "Bornova", "Buca", "Çiğli", "Gaziemir", "Bayraklı"],
  bursa: ["Nilüfer", "Osmangazi", "Yıldırım", "Mudanya", "Gemlik", "Gürsu"],
  antalya: ["Muratpaşa", "Konyaaltı", "Kepez", "Aksu", "Döşemealtı"],
  adana: ["Seyhan", "Yüreğir", "Çukurova", "Sarıçam"],
  konya: ["Selçuklu", "Meram", "Karatay"],
  gaziantep: ["Şahinbey", "Şehitkamil"],
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function seedCategories() {
  for (const def of categoryDefs) {
    await db.category.upsert({
      where: { type: def.type },
      update: {
        slug: def.slug,
        name: def.name,
        pluralName: def.pluralName,
        description: def.shortDescription,
        isActive: def.status === "live",
        sortOrder: def.sortOrder,
      },
      create: {
        type: def.type,
        slug: def.slug,
        name: def.name,
        pluralName: def.pluralName,
        description: def.shortDescription,
        isActive: def.status === "live",
        sortOrder: def.sortOrder,
      },
    });
  }
  console.log(`✔ ${categoryDefs.length} kategori seed edildi.`);
}

async function seedCities() {
  let created = 0;
  for (const c of cities) {
    await db.city.upsert({
      where: { slug: c.slug },
      update: { name: c.name, plate: c.plate, region: c.region },
      create: { slug: c.slug, name: c.name, plate: c.plate, region: c.region },
    });
    created++;
  }
  console.log(`✔ ${created} şehir seed edildi.`);
}

async function seedDistricts() {
  let total = 0;
  for (const [citySlug, districts] of Object.entries(sampleDistricts)) {
    const city = await db.city.findUnique({ where: { slug: citySlug } });
    if (!city) continue;
    for (const districtName of districts) {
      const slug = slugify(districtName);
      await db.district.upsert({
        where: { cityId_slug: { cityId: city.id, slug } },
        update: { name: districtName },
        create: { cityId: city.id, slug, name: districtName },
      });
      total++;
    }
  }
  console.log(`✔ ${total} ilçe seed edildi.`);
}

async function main() {
  console.log("🌱 Seed başlıyor...");
  await seedCategories();
  await seedCities();
  await seedDistricts();
  console.log("✅ Seed tamamlandı.");
}

main()
  .catch((err) => {
    console.error("❌ Seed hatası:", err);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
