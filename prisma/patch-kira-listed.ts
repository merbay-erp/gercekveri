/**
 * One-shot patch: add `listedPrice` to existing demo-kira-* submissions.
 *
 * Picks a per-city inflation factor (15–35%) and applies it to each
 * RENT submission's data payload. Only touches rows whose ipHash starts
 * with `demo-kira-` so production user data is left alone.
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

// Per-city inflation factor — picked to feel realistic (Türkiye 2026
// rental market shows ~15–30% gap between listed and actually paid).
const cityInflation: Record<string, number> = {
  istanbul: 0.28,
  ankara: 0.18,
  izmir: 0.22,
  bursa: 0.16,
  antalya: 0.24,
  default: 0.2,
};

async function main() {
  const rows = await db.submission.findMany({
    where: {
      type: "RENT",
      ipHash: { startsWith: "demo-kira-" },
    },
    select: {
      id: true,
      amount: true,
      data: true,
      city: { select: { slug: true } },
    },
  });

  let updated = 0;
  for (const row of rows) {
    const data = (row.data ?? {}) as Record<string, unknown>;
    if (typeof data.listedPrice === "number" && data.listedPrice > 0) {
      // Already patched — skip
      continue;
    }
    const real = row.amount ? Number(row.amount.toString()) : 0;
    if (real <= 0) continue;

    const slug = row.city?.slug ?? "default";
    const factor = cityInflation[slug] ?? cityInflation.default;
    // Add per-row jitter (±5 percentage points) so medians don't all line up
    const jitter = (Math.random() - 0.5) * 0.1;
    const listed = Math.round(real * (1 + factor + jitter));

    await db.submission.update({
      where: { id: row.id },
      data: {
        data: {
          ...data,
          listedPrice: listed,
        },
      },
    });
    updated++;
  }

  console.log(`✔ ${updated} demo-kira-* rows patched with listedPrice.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
