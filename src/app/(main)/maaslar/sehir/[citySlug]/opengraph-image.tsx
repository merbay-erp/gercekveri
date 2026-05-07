import { ImageResponse } from "next/og";
import { findCityBySlug } from "@/lib/cities";
import { siteConfig } from "@/lib/site-config";
import { getSalaryStats } from "@/modules/maas/server/queries";
import { formatNumber } from "@/lib/money";
import { ogFormatTRY as formatTRY } from "@/lib/og-format";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Params = { citySlug: string };

export default async function og({ params }: { params: Params }) {
  const city = findCityBySlug(params.citySlug);
  const cityName = city?.name ?? params.citySlug;
  const stats = await getSalaryStats({ citySlug: params.citySlug }).catch(
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
          background: "linear-gradient(135deg, #0a0a0a 0%, #2a1a3a 60%, #3a1a4a 100%)",
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
          {cityName} maaşları
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
            marginBottom: 32,
          }}
        >
          {cityName}
        </div>
        <div style={{ fontSize: 32, color: "#a3a3a3", marginBottom: 24 }}>
          {stats.count > 0 ? `Medyan ${formatTRY(stats.median)}` : "Veri toplanıyor"}
        </div>

        <div style={{ display: "flex", gap: 48, fontSize: 22 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ color: "#a3a3a3" }}>Paylaşım</span>
            <span style={{ fontWeight: 600 }}>{formatNumber(stats.count)}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ color: "#a3a3a3" }}>Ortalama</span>
            <span style={{ fontWeight: 600 }}>
              {stats.avg ? formatTRY(stats.avg) : "—"}
            </span>
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
