import { ImageResponse } from "next/og";
import { positionNameFromSlug } from "@/modules/maas/position-resolver";
import { siteConfig } from "@/lib/site-config";
import { getSalaryStats } from "@/modules/maas/server/queries";
import { formatTRY, formatNumber } from "@/lib/money";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = { positionSlug: string };

export default async function og({ params }: { params: Params }) {
  const positionName = positionNameFromSlug(params.positionSlug);
  const stats = await getSalaryStats({ positionSlug: params.positionSlug }).catch(
    () =>
      ({ count: 0, avg: null, median: null, p25: null, p75: null, min: null, max: null }) as const,
  );

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: 64,
          background: "linear-gradient(135deg, #0a0a0a 0%, #14253a 70%, #1d3a5a 100%)",
          color: "#fafafa",
          fontFamily: "system-ui",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 40 }}>
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
        </div>

        <div style={{ fontSize: 28, color: "#a3a3a3", marginBottom: 8 }}>
          Türkiye'de {positionName} Maaşları
        </div>
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
            marginBottom: 40,
          }}
        >
          {stats.median ? formatTRY(stats.median) : "Veri toplanıyor"}
        </div>

        <div style={{ display: "flex", gap: 48, fontSize: 22 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ color: "#a3a3a3" }}>Veri sayısı</span>
            <span style={{ fontWeight: 600 }}>{formatNumber(stats.count)}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ color: "#a3a3a3" }}>Ortalama</span>
            <span style={{ fontWeight: 600 }}>
              {stats.avg ? formatTRY(stats.avg) : "—"}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ color: "#a3a3a3" }}>Üst %75</span>
            <span style={{ fontWeight: 600 }}>{stats.p75 ? formatTRY(stats.p75) : "—"}</span>
          </div>
        </div>

        <div style={{ marginTop: "auto", fontSize: 22, color: "#a3a3a3" }}>
          {siteConfig.domain} · anonim, gerçek veri
        </div>
      </div>
    ),
    { ...size },
  );
}
