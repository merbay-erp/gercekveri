/**
 * Resmi referans veri seed'i. lib/official-references.ts'deki snapshot'ı
 * Submission tablosuna kaydeder. Her referans bir Submission row'u olur,
 * source field'ı kaynak kuruma işaret eder (TUIK / TCMB / EPDK / BOTAS).
 *
 * Idempotent: ipHash 'src:<source>:<type>:<scope-key>' deterministic ki
 * tekrar çalıştırınca duplicate yaratmaz.
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

import { OFFICIAL_REFERENCES } from "../src/lib/official-references";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

function scopeKey(scope: Record<string, string | undefined>): string {
  return Object.entries(scope)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k}:${v}`)
    .join("|") || "all";
}

async function main() {
  let inserted = 0;
  let updated = 0;

  for (const ref of OFFICIAL_REFERENCES) {
    const ipHash = `src:${ref.source}:${ref.type}:${scopeKey(ref.scope)}`;

    // Şehir resolve
    let cityId: number | null = null;
    if (ref.scope.citySlug) {
      const city = await db.city.findUnique({
        where: { slug: ref.scope.citySlug },
        select: { id: true },
      });
      cityId = city?.id ?? null;
    }

    const dataPayload = {
      ...ref.data,
      sourceMeta: {
        sourceLabel: ref.sourceLabel,
        sourceUrl: ref.sourceUrl,
        referenceDate: ref.referenceDate,
        methodology: ref.methodology,
      },
    };

    // Upsert pattern (deterministic ipHash)
    const existing = await db.submission.findFirst({
      where: { ipHash },
      select: { id: true },
    });

    if (existing) {
      await db.submission.update({
        where: { id: existing.id },
        data: {
          amount: ref.amount,
          data: dataPayload,
          source: ref.source,
          status: "APPROVED",
          approvedAt: new Date(),
        },
      });
      updated++;
    } else {
      await db.submission.create({
        data: {
          type: ref.type,
          cityId,
          amount: ref.amount,
          currency: "TRY",
          data: dataPayload,
          status: "APPROVED",
          approvedAt: new Date(),
          trustScore: 100, // resmi kaynak — tam güven
          qualityScore: 95,
          source: ref.source,
          ipHash,
        },
      });
      inserted++;
    }
  }

  console.log(
    `✔ Resmi referans seed tamam: ${inserted} yeni, ${updated} güncel.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
