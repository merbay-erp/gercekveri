/**
 * Tek seferlik: ipHash 'demo-' prefix'li tüm submission'ları source='DEMO'
 * olarak işaretle. Public query'ler artık source != 'DEMO' filtresiyle
 * default'a girer.
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  const result = await db.submission.updateMany({
    where: {
      ipHash: { startsWith: "demo-" },
      source: "USER",
    },
    data: { source: "DEMO" },
  });
  console.log(`✔ ${result.count} demo submission marked source='DEMO'.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
