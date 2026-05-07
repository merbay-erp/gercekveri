/**
 * Demo seed — populates the live database with diverse salary samples so
 * the AI insight pipeline has enough signal to fire. Run once after first
 * launch, then drop the file (or skip when reseeding production data).
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

const samples = [
  { position: "Frontend Developer", positionSlug: "frontend-developer", citySlug: "istanbul", amount: 65000, exp: 3, mode: "REMOTE" as const, sector: "Yazılım" },
  { position: "Frontend Developer", positionSlug: "frontend-developer", citySlug: "istanbul", amount: 90000, exp: 7, mode: "HYBRID" as const, sector: "Yazılım" },
  { position: "Frontend Developer", positionSlug: "frontend-developer", citySlug: "istanbul", amount: 110000, exp: 9, mode: "REMOTE" as const, sector: "Fintech" },
  { position: "Frontend Developer", positionSlug: "frontend-developer", citySlug: "istanbul", amount: 55000, exp: 2, mode: "ONSITE" as const, sector: "E-ticaret" },
  { position: "Backend Developer",  positionSlug: "backend-developer",  citySlug: "istanbul", amount: 95000, exp: 6, mode: "HYBRID" as const, sector: "Yazılım" },
  { position: "Backend Developer",  positionSlug: "backend-developer",  citySlug: "ankara",   amount: 78000, exp: 5, mode: "ONSITE" as const, sector: "Kamu" },
  { position: "Yazılım Geliştirici", positionSlug: "yazilim-gelistirici", citySlug: "bursa", amount: 60000, exp: 4, mode: "ONSITE" as const, sector: "Otomotiv" },
  { position: "Makine Mühendisi", positionSlug: "makine-muhendisi", citySlug: "bursa", amount: 70000, exp: 6, mode: "ONSITE" as const, sector: "Otomotiv" },
  { position: "Doktor", positionSlug: "doktor", citySlug: "izmir", amount: 95000, exp: 8, mode: "ONSITE" as const, sector: "Sağlık" },
  { position: "Öğretmen", positionSlug: "ogretmen", citySlug: "ankara", amount: 42000, exp: 5, mode: "ONSITE" as const, sector: "Eğitim" },
];

async function main() {
  for (const s of samples) {
    const city = await db.city.findUnique({ where: { slug: s.citySlug } });
    if (!city) { console.warn("city not found", s.citySlug); continue; }
    await db.submission.create({
      data: {
        type: "SALARY",
        cityId: city.id,
        amount: s.amount,
        currency: "TRY",
        data: {
          position: s.position,
          positionSlug: s.positionSlug,
          experienceYears: s.exp,
          workMode: s.mode,
          sector: s.sector,
          citySlug: s.citySlug,
          cityName: city.name,
        },
        status: "APPROVED",
        approvedAt: new Date(),
        trustScore: 50,
        qualityScore: 50,
        ipHash: `demo-seed-${s.position}-${s.amount}`,
      },
    });
  }
  console.log(`✔ ${samples.length} demo submission inserted.`);
}

main().catch(console.error).finally(() => db.$disconnect());
