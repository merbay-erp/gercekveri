import { ImageResponse } from "next/og";

import { findCityBySlug } from "@/lib/cities";
import { listSalarySubmissions } from "@/modules/maas/server/queries";
import { listRentSubmissions } from "@/modules/kira/server/queries";
import { positionSlugFor } from "@/modules/maas/position-resolver";
import { computeComparison } from "@/lib/comparison";
import { siteConfig } from "@/lib/site-config";

export const runtime = "nodejs";

const fmtTry = (n: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(n);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kind = searchParams.get("kind") === "kira" ? "kira" : "maas";
  const amountNum = Number(searchParams.get("amount") ?? "");
  if (!Number.isFinite(amountNum) || amountNum <= 0) {
    return fallbackImage(kind);
  }

  const citySlug = searchParams.get("city") ?? undefined;
  const cityRecord = citySlug ? findCityBySlug(citySlug) : undefined;

  let scopeLabel = "Türkiye geneli";
  let result = null;

  try {
    if (kind === "maas") {
      const positionRaw = searchParams.get("position") ?? "";
      const positionSlug = positionRaw ? positionSlugFor(positionRaw) : undefined;
      const submissions = await listSalarySubmissions({
        citySlug,
        positionSlug,
        limit: 1000,
      });
      const sorted = submissions.map((s) => s.amount).filter((n) => n > 0).sort((a, b) => a - b);

      const labelParts: string[] = [];
      if (positionRaw.trim()) labelParts.push(positionRaw.trim());
      if (cityRecord) labelParts.push(cityRecord.name);
      scopeLabel = labelParts.length ? labelParts.join(" · ") : "Türkiye geneli";

      result = computeComparison({
        value: amountNum,
        sortedPeers: sorted,
        subjectLabel: "Maaşın",
        scopeLabel,
        higherIsBetter: true,
        formatValue: (n) => fmtTry(n),
      });
    } else {
      const districtName = searchParams.get("district")?.trim() ?? "";
      const submissions = await listRentSubmissions({ citySlug, limit: 1000 });
      const filtered = districtName
        ? submissions.filter((s) =>
            (s.data.districtName ?? "").toLowerCase().includes(districtName.toLowerCase()),
          )
        : submissions;
      const sorted = filtered.map((s) => s.amount).filter((n) => n > 0).sort((a, b) => a - b);

      if (cityRecord) scopeLabel = districtName ? `${cityRecord.name} · ${districtName}` : cityRecord.name;

      result = computeComparison({
        value: amountNum,
        sortedPeers: sorted,
        subjectLabel: "Kiran",
        scopeLabel,
        higherIsBetter: false,
        formatValue: (n) => fmtTry(n),
      });
    }
  } catch {
    return fallbackImage(kind);
  }

  const headline = result?.headline ?? `${fmtTry(amountNum)}`;
  const tone = result?.tone ?? "mid";
  const palette =
    tone === "high"
      ? { from: "#0a0a0a", via: "#0d2818", to: "#0e3b22", accent: "#10b981" }
      : tone === "low"
        ? { from: "#0a0a0a", via: "#2a1018", to: "#3b0e1a", accent: "#f43f5e" }
        : { from: "#0a0a0a", via: "#2a1f00", to: "#3b2900", accent: "#f59e0b" };

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
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
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
            karşılaştırma
          </div>
        </div>

        <div style={{ fontSize: 22, color: "#a3a3a3", marginBottom: 12 }}>{scopeLabel}</div>

        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: -1,
            marginBottom: 32,
            display: "flex",
          }}
        >
          {headline}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginTop: "auto",
            fontSize: 22,
            color: "#a3a3a3",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ color: "#a3a3a3" }}>Senin değerin</span>
            <span style={{ fontSize: 32, fontWeight: 600, color: palette.accent }}>
              {fmtTry(amountNum)}
            </span>
          </div>
          {result ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ color: "#a3a3a3" }}>Medyan</span>
              <span style={{ fontSize: 32, fontWeight: 600 }}>{fmtTry(result.median)}</span>
            </div>
          ) : null}
          {result ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ color: "#a3a3a3" }}>Yüzdelik</span>
              <span style={{ fontSize: 32, fontWeight: 600 }}>%{result.percentile}</span>
            </div>
          ) : null}
        </div>

        <div style={{ marginTop: 16, fontSize: 18, color: "#a3a3a3" }}>
          {siteConfig.domain}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}

function fallbackImage(kind: "maas" | "kira") {
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
        <div style={{ fontSize: 42, fontWeight: 600, marginBottom: 24 }}>{siteConfig.name}</div>
        <div style={{ fontSize: 64, fontWeight: 700, letterSpacing: -1 }}>
          {kind === "maas" ? "Maaşını karşılaştır" : "Kiranı karşılaştır"}
        </div>
        <div style={{ marginTop: "auto", fontSize: 22, color: "#a3a3a3" }}>
          {siteConfig.domain}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
