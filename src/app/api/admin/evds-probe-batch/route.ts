/**
 * Admin-only batch probe — 6 önemli TCMB serisini tek seferde çeker ve
 * TcmbSnapshot tablosunu doldurur. Cron'un manuel versiyonu, Mustafa'nın
 * "şu an çalış" demesi için.
 */
import { requireAdmin } from "@/lib/admin-auth";
import { refreshAllTcmbSnapshots } from "@/lib/tcmb-batch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await refreshAllTcmbSnapshots();

  return Response.json(summary, {
    status: summary.okCount > 0 ? 200 : 500,
  });
}
