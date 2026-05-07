import { ImageResponse } from "next/og";

import { findCityBySlug } from "@/lib/cities";
import { getRentInflationStats } from "@/modules/kira/server/queries";
import { siteConfig } from "@/lib/site-config";
import { ogFormatTRY as fmtTry } from "@/lib/og-format";
import { computeRealityScore } from "@/lib/reality-score";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    return await render(req);
  } catch (err) {
    const msg = err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    return new Response(msg.slice(0, 500), { status: 500, headers: { "content-type": "text/plain" } });
  }
}

async function render(req: Request) {
  const { searchParams } = new URL(req.url);
  const citySlug = searchParams.get("city") ?? undefined;
  const cityRecord = citySlug ? findCityBySlug(citySlug) : undefined;
  const districtName = searchParams.get("district") ?? undefined;

  let scopeLabel = "Türkiye geneli";
  if (cityRecord) scopeLabel = districtName ? `${cityRecord.name} · ${districtName}` : cityRecord.name;

  let stats: {
    pairCount: number;
    realMedian: number | null;
    listedMedian: number | null;
    inflationPct: number | null;
  } = { pairCount: 0, realMedian: null, listedMedian: null, inflationPct: null };

  try {
    stats = await getRentInflationStats({ citySlug, districtName });
  } catch {
    // Fall through to fallback rendering below
  }

  const insufficient =
    stats.pairCount < 3 ||
    stats.realMedian === null ||
    stats.listedMedian === null ||
    stats.inflationPct === null;

  if (insufficient) {
    return fallbackImage(scopeLabel);
  }

  const positive = (stats.inflationPct ?? 0) > 0;
  const palette = positive
    ? { from: "#0a0a0a", via: "#2a1018", to: "#3b0e1a", accent: "#f43f5e" }
    : { from: "#0a0a0a", via: "#0d2818", to: "#0e3b22", accent: "#10b981" };

  const headline = positive
    ? `İlan, gerçekten %${stats.inflationPct} yüksek`
    : `İlan, gerçekten %${Math.abs(stats.inflationPct ?? 0)} düşük`;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 64,
          background: `linear-gradient(135deg, ${palette.from} 0%, ${palette.via} 60%, ${palette.to} 100%)`,
          color: "#fafafa",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 11,
              background: "#fafafa",
              color: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            G
          </div>
          <div style={{ fontSize: 26, fontWeight: 600 }}>{siteConfig.name}</div>
          <div
            style={{
              marginLeft: "auto",
              fontSize: 18,
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
              color: "#a3a3a3",
            }}
          >
            kira şişkinliği
          </div>
        </div>

        <div style={{ fontSize: 22, color: "#a3a3a3", marginBottom: 12 }}>{scopeLabel}</div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -1,
            marginBottom: 32,
            display: "flex",
            color: palette.accent,
          }}
        >
          {headline}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 32,
            marginTop: "auto",
            fontSize: 22,
            color: "#a3a3a3",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ color: "#a3a3a3" }}>İlan medyanı</span>
            <span style={{ fontSize: 36, fontWeight: 600, color: "#fafafa" }}>
              {fmtTry(stats.listedMedian!)}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ color: "#a3a3a3" }}>Gerçek ödenen</span>
            <span style={{ fontSize: 36, fontWeight: 600, color: "#fafafa" }}>
              {fmtTry(stats.realMedian!)}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ color: "#a3a3a3" }}>Eşleşme</span>
            <span style={{ fontSize: 36, fontWeight: 600, color: "#fafafa" }}>
              {stats.pairCount}
            </span>
          </div>
          {(() => {
            const r = computeRealityScore(stats.inflationPct);
            if (!r) return null;
            const c =
              r.level === "ok" ? "#10b981" : r.level === "warn" ? "#f59e0b" : "#f43f5e";
            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ color: "#a3a3a3" }}>Gerçeklik</span>
                <span style={{ fontSize: 36, fontWeight: 600, color: c }}>
                  {`${r.score}/100`}
                </span>
              </div>
            );
          })()}
        </div>

        <div style={{ marginTop: 16, fontSize: 18, color: "#a3a3a3" }}>
          {`${siteConfig.domain}/kira/sisme`}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

function fallbackImage(scopeLabel: string) {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 80,
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 60%, #2a1a3a 100%)",
          color: "#fafafa",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ fontSize: 42, fontWeight: 600, marginBottom: 16 }}>
          {siteConfig.name}
        </div>
        <div style={{ fontSize: 22, color: "#a3a3a3", marginBottom: 12 }}>
          {scopeLabel}
        </div>
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1 }}>
          Gerçek vs İlan
        </div>
        <div style={{ fontSize: 22, color: "#a3a3a3", marginTop: 16 }}>
          Veri arttıkça şişkinlik sayıları yayılır.
        </div>
        <div style={{ marginTop: "auto", fontSize: 22, color: "#a3a3a3" }}>
          {`${siteConfig.domain}/kira/sisme`}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
