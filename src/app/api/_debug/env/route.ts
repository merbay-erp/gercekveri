/**
 * Geçici debug endpoint — env değişkenlerinin runtime'a ulaşıp
 * ulaşmadığını görür. Asla gerçek değerleri dönmez, sadece boolean
 * "set / notset" + length. Sorun çözüldükten sonra silinecek.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const probe = (key: string) => {
    const v = process.env[key];
    return {
      set: typeof v === "string" && v.length > 0,
      length: typeof v === "string" ? v.length : 0,
      prefix: typeof v === "string" ? v.slice(0, 4) : null,
    };
  };

  return Response.json({
    RESEND_API_KEY: probe("RESEND_API_KEY"),
    ADMIN_NOTIFY_EMAIL: probe("ADMIN_NOTIFY_EMAIL"),
    EMAIL_FROM: probe("EMAIL_FROM"),
    ADMIN_SESSION_SECRET: probe("ADMIN_SESSION_SECRET"),
    NODE_ENV: process.env.NODE_ENV ?? null,
    VERCEL_ENV: process.env.VERCEL_ENV ?? null,
  });
}
