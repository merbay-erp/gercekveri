import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  const result = await db.aiSummary.deleteMany({
    where: { scope: { startsWith: "internet" } },
  });
  console.log(`✔ purged ${result.count} internet AI cache rows`);
}

main().catch(console.error).finally(() => db.$disconnect());
