/**
 * Demo seed for tekstil B2B module — diverse samples across Bursa /
 * İstanbul / Çorlu / Denizli / Adıyaman / Maraş, covering all 7 sub-types
 * and a mix of units. ipHash prefix `demo-tekstil-*` for later purge.
 *
 * Numbers are realistic ballpark for early 2026 production prices in
 * TRY (KDV hariç). Real submissions will adjust the medians.
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { slugify } from "../src/lib/slug";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

interface TekstilSample {
  citySlug: string;
  district?: string;
  subType:
    | "KESIM"
    | "DIKIM"
    | "BOYAHANE"
    | "BASKI"
    | "NAKIS"
    | "UTU_PAKETLEME"
    | "KUMAS_URETIM";
  unit: "PIECE" | "METER" | "M2" | "KG" | "BATIS_1000";
  unitPrice: number;
  minOrderQuantity?: number;
  fabricType?:
    | "ORME"
    | "DOKUMA"
    | "DENIM"
    | "TRIKO"
    | "POLAR"
    | "KOT"
    | "TEKNIK"
    | "DIGER";
  colorCount?: number;
  customerType?:
    | "MARKA"
    | "KONFEKSIYONCU"
    | "PERAKENDE"
    | "BUTIK"
    | "EXPORT"
    | "DIGER";
}

const samples: TekstilSample[] = [
  // İstanbul — kesim, dikim, baskı (Merter, Laleli, Bayrampaşa)
  { citySlug: "istanbul", district: "Merter", subType: "DIKIM", unit: "PIECE", unitPrice: 18.5, minOrderQuantity: 500, fabricType: "ORME", customerType: "KONFEKSIYONCU" },
  { citySlug: "istanbul", district: "Bayrampaşa", subType: "DIKIM", unit: "PIECE", unitPrice: 22.0, minOrderQuantity: 1000, fabricType: "DOKUMA", customerType: "MARKA" },
  { citySlug: "istanbul", district: "Laleli", subType: "DIKIM", unit: "PIECE", unitPrice: 15.0, minOrderQuantity: 300, fabricType: "ORME", customerType: "PERAKENDE" },
  { citySlug: "istanbul", district: "Merter", subType: "KESIM", unit: "PIECE", unitPrice: 2.5, minOrderQuantity: 1000, fabricType: "ORME", customerType: "KONFEKSIYONCU" },
  { citySlug: "istanbul", district: "Esenyurt", subType: "KESIM", unit: "PIECE", unitPrice: 3.2, minOrderQuantity: 500, fabricType: "DENIM", customerType: "MARKA" },
  { citySlug: "istanbul", district: "Bayrampaşa", subType: "BASKI", unit: "PIECE", unitPrice: 4.5, colorCount: 1, minOrderQuantity: 500, fabricType: "ORME", customerType: "KONFEKSIYONCU" },
  { citySlug: "istanbul", district: "Bayrampaşa", subType: "BASKI", unit: "PIECE", unitPrice: 12.0, colorCount: 4, minOrderQuantity: 300, fabricType: "ORME", customerType: "BUTIK" },
  { citySlug: "istanbul", district: "Esenyurt", subType: "NAKIS", unit: "BATIS_1000", unitPrice: 1.8, minOrderQuantity: 100, customerType: "KONFEKSIYONCU" },
  { citySlug: "istanbul", district: "Merter", subType: "UTU_PAKETLEME", unit: "PIECE", unitPrice: 1.2, minOrderQuantity: 1000, customerType: "KONFEKSIYONCU" },

  // Bursa — boyahane, kumaş üretim (sektörün boyahane merkezi)
  { citySlug: "bursa", district: "Osmangazi", subType: "BOYAHANE", unit: "KG", unitPrice: 45.0, minOrderQuantity: 200, fabricType: "ORME", customerType: "KONFEKSIYONCU" },
  { citySlug: "bursa", district: "Nilüfer", subType: "BOYAHANE", unit: "KG", unitPrice: 52.0, minOrderQuantity: 500, fabricType: "POLAR", customerType: "MARKA" },
  { citySlug: "bursa", district: "Osmangazi", subType: "BOYAHANE", unit: "KG", unitPrice: 38.0, minOrderQuantity: 100, fabricType: "DOKUMA", customerType: "KONFEKSIYONCU" },
  { citySlug: "bursa", district: "Yıldırım", subType: "KUMAS_URETIM", unit: "METER", unitPrice: 28.0, minOrderQuantity: 1000, fabricType: "ORME", customerType: "EXPORT" },
  { citySlug: "bursa", district: "Nilüfer", subType: "KUMAS_URETIM", unit: "METER", unitPrice: 35.0, minOrderQuantity: 500, fabricType: "DOKUMA", customerType: "MARKA" },

  // Çorlu / Tekirdağ — denim
  { citySlug: "tekirdag", district: "Çorlu", subType: "DIKIM", unit: "PIECE", unitPrice: 32.0, minOrderQuantity: 1000, fabricType: "DENIM", customerType: "EXPORT" },
  { citySlug: "tekirdag", district: "Çorlu", subType: "BOYAHANE", unit: "KG", unitPrice: 48.0, minOrderQuantity: 500, fabricType: "DENIM", customerType: "EXPORT" },
  { citySlug: "tekirdag", district: "Çorlu", subType: "KESIM", unit: "PIECE", unitPrice: 4.0, minOrderQuantity: 1000, fabricType: "DENIM", customerType: "MARKA" },

  // Denizli — havlu / ev tekstili
  { citySlug: "denizli", district: "Pamukkale", subType: "KUMAS_URETIM", unit: "METER", unitPrice: 22.0, minOrderQuantity: 500, fabricType: "DOKUMA", customerType: "EXPORT" },
  { citySlug: "denizli", district: "Pamukkale", subType: "DIKIM", unit: "PIECE", unitPrice: 28.0, minOrderQuantity: 500, fabricType: "DOKUMA", customerType: "EXPORT" },

  // Maraş / Kahramanmaraş — örme, dikim
  { citySlug: "kahramanmaras", subType: "DIKIM", unit: "PIECE", unitPrice: 14.5, minOrderQuantity: 500, fabricType: "ORME", customerType: "KONFEKSIYONCU" },
  { citySlug: "kahramanmaras", subType: "KUMAS_URETIM", unit: "METER", unitPrice: 18.0, minOrderQuantity: 1000, fabricType: "ORME", customerType: "MARKA" },

  // Adıyaman — büyük markaların fason üreticileri
  { citySlug: "adiyaman", subType: "DIKIM", unit: "PIECE", unitPrice: 12.0, minOrderQuantity: 1000, fabricType: "ORME", customerType: "MARKA" },
  { citySlug: "adiyaman", subType: "KESIM", unit: "PIECE", unitPrice: 1.8, minOrderQuantity: 1000, fabricType: "ORME", customerType: "MARKA" },
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
        type: "TEXTILE",
        cityId: city.id,
        districtId,
        amount: s.unitPrice,
        currency: "TRY",
        data: {
          subType: s.subType,
          unit: s.unit,
          minOrderQuantity: s.minOrderQuantity ?? null,
          fabricType: s.fabricType ?? null,
          colorCount: s.colorCount ?? null,
          customerType: s.customerType ?? null,
          citySlug: s.citySlug,
          districtName: s.district ?? null,
          cityName: city.name,
        },
        status: "APPROVED",
        approvedAt: new Date(),
        trustScore: 50,
        qualityScore: 50,
        ipHash: `demo-tekstil-${s.citySlug}-${s.subType}-${s.unitPrice}`,
      },
    });
    inserted++;
  }
  console.log(`✔ ${inserted} demo tekstil submission inserted.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
