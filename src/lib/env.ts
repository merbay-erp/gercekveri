import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  HASH_SECRET: z.string().min(16, "HASH_SECRET must be at least 16 chars"),
  UPSTASH_REDIS_REST_URL: z.string().url().optional().or(z.literal("")),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional().or(z.literal("")),
  QSTASH_TOKEN: z.string().optional().or(z.literal("")),
  QSTASH_CURRENT_SIGNING_KEY: z.string().optional().or(z.literal("")),
  QSTASH_NEXT_SIGNING_KEY: z.string().optional().or(z.literal("")),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().optional().or(z.literal("")),
  // Google Cloud Web Risk Lookup API — ticari URL tehdit kontrolü. Yoksa atlanır.
  GOOGLE_WEB_RISK_API_KEY: z.string().optional().or(z.literal("")),
  ADMIN_BOOTSTRAP_EMAIL: z.string().email().optional().or(z.literal("")),
  ADMIN_BOOTSTRAP_PASSWORD: z.string().optional().or(z.literal("")),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url(),
  NEXT_PUBLIC_SITE_NAME: z.string().default("GerçekVeri"),
  NEXT_PUBLIC_ADSENSE_CLIENT_ID: z.string().optional().or(z.literal("")),
});

const clientEnv = {
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME ?? "GerçekVeri",
  NEXT_PUBLIC_ADSENSE_CLIENT_ID: process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "",
};

const isServer = typeof window === "undefined";

function parseServerEnv() {
  const parsed = serverSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("❌ Invalid server environment variables:", z.treeifyError(parsed.error));
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
}

function parseClientEnv() {
  const parsed = clientSchema.safeParse(clientEnv);
  if (!parsed.success) {
    console.error("❌ Invalid client environment variables:", z.treeifyError(parsed.error));
    throw new Error("Invalid environment variables");
  }
  return parsed.data;
}

export const env = isServer
  ? { ...parseServerEnv(), ...parseClientEnv() }
  : (parseClientEnv() as ReturnType<typeof parseClientEnv> & Partial<ReturnType<typeof parseServerEnv>>);

export type Env = typeof env;
