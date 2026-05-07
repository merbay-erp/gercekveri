import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site-config";
import { OgBrandMark } from "@/lib/og-brand-mark";

export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function og() {
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
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 64 }}>
          <OgBrandMark size={56} />
          <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: -0.5 }}>
            {siteConfig.name}
          </div>
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: -2,
            background: "linear-gradient(180deg, #ffffff 0%, #a3a3a3 100%)",
            backgroundClip: "text",
            color: "transparent",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Türkiye'nin</span>
          <span>gerçek verisi.</span>
        </div>
        <div style={{ display: "flex", marginTop: "auto", gap: 32, fontSize: 22, color: "#a3a3a3" }}>
          <span>%100 anonim</span>
          <span>·</span>
          <span>Maaş, kira, internet</span>
          <span>·</span>
          <span>{siteConfig.domain}</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
