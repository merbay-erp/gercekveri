/**
 * Admin-only EVDS probe endpoint. Mustafa burayı bir series code ile
 * çağırır, dönen JSON'u görür → hangi TCMB series kodlarının ne ürettiğini
 * deneme yanılma keşfeder.
 *
 * Korumalı: requireAdmin başında. Anahtarsız erişim 401.
 *
 * Örnek:
 *   /api/admin/evds-probe?series=TP.DK.USD.S&start=01-01-2025&end=01-12-2025
 *
 * Mustafa'nın deneyebileceği önemli serisler:
 *  - TP.DK.USD.S            — USD/TRY günlük (test bağlantı)
 *  - TP.HKFE01              — Hedonik konut fiyat endeksi (TR)
 *  - TP.HKFE02              — Hedonik konut fiyat endeksi (İstanbul)
 *  - TP.HKFE03              — Hedonik konut fiyat endeksi (Ankara)
 *  - TP.HKFE04              — Hedonik konut fiyat endeksi (İzmir)
 *  - TP.FG.J0102            — TÜFE Gerçek Kira (aylık değişim)
 */
import { requireAdmin } from "@/lib/admin-auth";
import { fetchEvds } from "@/lib/tcmb-evds";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const series = searchParams.get("series");
  if (!series) {
    return Response.json(
      {
        error:
          "series parametresi gerekli (örn. ?series=TP.DK.USD.S&start=01-01-2025&end=01-12-2025)",
      },
      { status: 400 },
    );
  }

  // Default tarih aralığı: son 12 ay
  const today = new Date();
  const yearAgo = new Date(today.getTime() - 365 * 24 * 60 * 60 * 1000);
  const fmt = (d: Date) =>
    `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;

  const startDate = searchParams.get("start") || fmt(yearAgo);
  const endDate = searchParams.get("end") || fmt(today);
  const frequency = (searchParams.get("frequency") || "5") as "1" | "5" | "8";

  const result = await fetchEvds({
    series,
    startDate,
    endDate,
    frequency,
  });

  return Response.json(result, {
    status: result.ok ? 200 : 500,
  });
}
