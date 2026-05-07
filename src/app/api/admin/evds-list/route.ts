/**
 * EVDS DataGroup → SerieList probe.
 *
 * fatihmete v0.4 source'una göre `serieList?code=<datagroup>` endpoint'i
 * bir DataGroup altındaki tüm series'leri (SERIE_CODE + SERIE_NAME +
 * START_DATE) döner. HKFE/YKFE gibi grup koduyla gerçek seri isimlerini
 * keşfetmek için.
 *
 * Bilinen DataGroup kodları (TCMB EVDS UI'dan):
 *  - bie_hkfe   → Hedonik Konut Fiyat Endeksi
 *  - bie_kfe    → Konut Fiyat Endeksi
 *  - bie_ykfe   → Yeni Konutlar Fiyat Endeksi
 *  - bie_dkdovse → Döviz Kurları (satış)
 *  - bie_tufe1  → TÜFE
 *
 * Kullanım: /api/admin/evds-list?group=bie_hkfe
 */
import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BASE = "https://evds3.tcmb.gov.tr/igmevdsms-dis";

export async function GET(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const group = searchParams.get("group");
  if (!group) {
    return Response.json(
      {
        error: "group parametresi gerekli",
        examples: [
          "?group=bie_hkfe",
          "?group=bie_kfe",
          "?group=bie_ykfe",
        ],
      },
      { status: 400 },
    );
  }

  const key = process.env.TCMB_EVDS_API_KEY;
  if (!key) {
    return Response.json({ error: "TCMB_EVDS_API_KEY env yok" }, { status: 500 });
  }

  const url = `${BASE}/serieList/?type=json&code=${encodeURIComponent(group)}`;

  let response: Response;
  try {
    response = await fetch(url, {
      headers: {
        key,
        accept: "application/json",
        "user-agent":
          "Mozilla/5.0 (compatible; gercekveri/1.0; +https://gercekveri.com)",
      },
      cache: "no-store",
      redirect: "manual",
    });
  } catch (err) {
    return Response.json(
      {
        error: err instanceof Error ? err.message : "fetch failed",
        url,
      },
      { status: 500 },
    );
  }

  const ct = response.headers.get("content-type") ?? "";
  const text = await response.text();

  if (!response.ok) {
    return Response.json(
      {
        error: `HTTP ${response.status}`,
        bodyPreview: text.slice(0, 300),
        contentType: ct,
        url,
      },
      { status: 500 },
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return Response.json(
      {
        error: "JSON parse hatası",
        bodyPreview: text.slice(0, 300),
        contentType: ct,
      },
      { status: 500 },
    );
  }

  // Compact view: SERIE_CODE + SERIE_NAME + START_DATE
  const list = Array.isArray(parsed) ? parsed : [];
  const compact = list.map((row: Record<string, unknown>) => ({
    code: row.SERIE_CODE,
    name: row.SERIE_NAME ?? row.SERIE_NAME_TR,
    nameEng: row.SERIE_NAME_ENG,
    startDate: row.START_DATE,
    frequency: row.FREQUENCY_STR ?? row.FREQUENCY,
  }));

  return Response.json({
    group,
    count: compact.length,
    series: compact,
    url,
  });
}
