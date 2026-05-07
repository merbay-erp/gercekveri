/**
 * Vercel Cron — günde 1 kere TCMB EVDS'i yeniler.
 *
 * Auth: Vercel cron `Authorization: Bearer <CRON_SECRET>` header'ı ile gelir.
 * Anonim erişim 401 — ama "manuel test" için CRON_SECRET'le curl atılabilir.
 *
 * vercel.json içinde tetiklenir (her gün 03:00 TR saati = 00:00 UTC).
 */
import { refreshAllTcmbSnapshots } from "@/lib/tcmb-batch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return Response.json(
      { error: "CRON_SECRET env tanımlı değil" },
      { status: 500 },
    );
  }

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${expected}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const startedAt = Date.now();
  const summary = await refreshAllTcmbSnapshots();
  const elapsedMs = Date.now() - startedAt;

  console.log(
    `[cron/refresh-tcmb] ok=${summary.okCount} err=${summary.errorCount} elapsed=${elapsedMs}ms`,
  );

  return Response.json(
    { ...summary, elapsedMs, ranAt: new Date().toISOString() },
    { status: 200 },
  );
}
