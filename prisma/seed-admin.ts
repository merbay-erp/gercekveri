/**
 * Seed an admin user — run via:
 *   pnpm tsx prisma/seed-admin.ts <email> <password> [name]
 *
 * Idempotent: if email exists, password is updated.
 */
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });
loadEnv({ path: ".env" });

import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const db = new PrismaClient({ adapter });

async function main() {
  const [email, password, name] = process.argv.slice(2);
  if (!email || !password) {
    console.error("Usage: pnpm tsx prisma/seed-admin.ts <email> <password> [name]");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const normalized = email.toLowerCase();

  const user = await db.adminUser.upsert({
    where: { email: normalized },
    update: { passwordHash, isActive: true, ...(name ? { name } : {}) },
    create: {
      email: normalized,
      passwordHash,
      role: "ADMIN",
      isActive: true,
      ...(name ? { name } : {}),
    },
  });

  console.log(`✔ Admin user ready: ${user.email} (id=${user.id}, role=${user.role})`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
