/**
 * EVDS endpoint discovery — TCMB EVDS3'ün doğru URL pattern'ini tespit eder.
 *
 * EVDS2 sunset olduktan sonra fatihmete/evds source'u (igmevdsms-dis path-style
 * query) artık 404 dönüyor. Bu endpoint birkaç olası pattern'i paralelde
 * deneyip ilk 200/JSON döneni rapor eder.
 *
 * Kullanım: admin login + tarayıcıda `/api/admin/evds-discovery`
 */
import { requireAdmin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TEST_SERIES = "TP.DK.USD.S";
const TEST_START = "01-01-2026";
const TEST_END = "01-05-2026";

interface ProbeResult {
  label: string;
  method: "GET" | "POST";
  url: string;
  status: number;
  contentType?: string;
  bodyPreview: string;
  isJson: boolean;
  isOk: boolean;
}

const COMMON_PARAMS = `series=${TEST_SERIES}&startDate=${TEST_START}&endDate=${TEST_END}&type=json&frequency=1&aggregationTypes=avg&formulas=0`;

function makeProbes(key: string): Array<{ label: string; method: "GET" | "POST"; url: string; body?: string }> {
  return [
    {
      label: "EVDS3 igmevdsms-dis path-style (fatihmete)",
      method: "GET",
      url: `https://evds3.tcmb.gov.tr/igmevdsms-dis/${COMMON_PARAMS}`,
    },
    {
      label: "EVDS3 igmevdsms-dis trailing-slash + query",
      method: "GET",
      url: `https://evds3.tcmb.gov.tr/igmevdsms-dis/?${COMMON_PARAMS}`,
    },
    {
      label: "EVDS3 igmevdsms-dis /fe path-style",
      method: "GET",
      url: `https://evds3.tcmb.gov.tr/igmevdsms-dis/fe/${COMMON_PARAMS}`,
    },
    {
      label: "EVDS3 igmevdsms-dis /fe query",
      method: "GET",
      url: `https://evds3.tcmb.gov.tr/igmevdsms-dis/fe?${COMMON_PARAMS}`,
    },
    {
      label: "EVDS3 igmevdsms-dis /serie/data",
      method: "GET",
      url: `https://evds3.tcmb.gov.tr/igmevdsms-dis/serie/data?${COMMON_PARAMS}`,
    },
    {
      label: "EVDS3 igmevdsms-dis /service/evds",
      method: "GET",
      url: `https://evds3.tcmb.gov.tr/igmevdsms-dis/service/evds/${COMMON_PARAMS}`,
    },
    {
      label: "EVDS3 root /service/evds (eski path)",
      method: "GET",
      url: `https://evds3.tcmb.gov.tr/service/evds/${COMMON_PARAMS}`,
    },
    {
      label: "EVDS-P2 root path-style",
      method: "GET",
      url: `https://evds-p2.tcmb.gov.tr/${COMMON_PARAMS}`,
    },
    {
      label: "EVDS-P2 /fe POST",
      method: "POST",
      url: `https://evds-p2.tcmb.gov.tr/fe`,
      body: JSON.stringify({
        series: TEST_SERIES,
        startDate: TEST_START,
        endDate: TEST_END,
        type: "json",
        frequency: 1,
        aggregationTypes: "avg",
        formulas: 0,
      }),
    },
    {
      label: "EVDS3 igmevdsms-dis /fe POST",
      method: "POST",
      url: `https://evds3.tcmb.gov.tr/igmevdsms-dis/fe`,
      body: JSON.stringify({
        series: TEST_SERIES,
        startDate: TEST_START,
        endDate: TEST_END,
        type: "json",
        frequency: 1,
        aggregationTypes: "avg",
        formulas: 0,
      }),
    },
    {
      label: "EVDS3 igmevdsms-dis /categories (referans test)",
      method: "GET",
      url: `https://evds3.tcmb.gov.tr/igmevdsms-dis/categories/?type=json`,
    },
  ];
}

async function probe(
  spec: { label: string; method: "GET" | "POST"; url: string; body?: string },
  key: string,
): Promise<ProbeResult> {
  try {
    const init: RequestInit = {
      method: spec.method,
      headers: {
        key,
        accept: "application/json",
        "user-agent":
          "Mozilla/5.0 (compatible; gercekveri/1.0; +https://gercekveri.com)",
        ...(spec.method === "POST" ? { "content-type": "application/json" } : {}),
      },
      cache: "no-store",
      redirect: "manual",
      ...(spec.body ? { body: spec.body } : {}),
    };

    const response = await fetch(spec.url, init);
    const ct = response.headers.get("content-type") ?? "";
    const text = await response.text();
    const trimmed = text.slice(0, 200);

    return {
      label: spec.label,
      method: spec.method,
      url: spec.url,
      status: response.status,
      contentType: ct,
      bodyPreview: trimmed,
      isJson: ct.includes("application/json"),
      isOk: response.status === 200,
    };
  } catch (err) {
    return {
      label: spec.label,
      method: spec.method,
      url: spec.url,
      status: 0,
      bodyPreview: err instanceof Error ? err.message : "fetch failed",
      isJson: false,
      isOk: false,
    };
  }
}

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const key = process.env.TCMB_EVDS_API_KEY;
  if (!key) {
    return Response.json(
      { error: "TCMB_EVDS_API_KEY env tanımlı değil" },
      { status: 500 },
    );
  }

  const probes = makeProbes(key);
  const results = await Promise.all(probes.map((p) => probe(p, key)));

  // En umut verici sonucu öne çıkar
  const winners = results.filter((r) => r.isOk && r.isJson);
  const partial = results.filter((r) => r.isOk && !r.isJson);

  return Response.json({
    keyPrefix: key.slice(0, 4) + "…",
    keyLength: key.length,
    summary: {
      total: results.length,
      jsonWinners: winners.length,
      okButHtml: partial.length,
    },
    winners,
    allResults: results,
  });
}
