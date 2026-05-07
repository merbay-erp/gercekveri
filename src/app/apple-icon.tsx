import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#0a0a0a",
          borderRadius: 39,
          position: "relative",
        }}
      >
        {/* Histogram bars */}
        <div
          style={{
            position: "absolute",
            display: "flex",
            alignItems: "flex-end",
            gap: 12,
            left: 28,
            bottom: 36,
          }}
        >
          <div style={{ width: 20, height: 40, background: "#fafafa", borderRadius: 4 }} />
          <div style={{ width: 20, height: 68, background: "#fafafa", borderRadius: 4 }} />
          <div style={{ width: 20, height: 56, background: "#fafafa", borderRadius: 4 }} />
          <div style={{ width: 20, height: 84, background: "#fafafa", borderRadius: 4 }} />
        </div>
        {/* Emerald pulse dot */}
        <div
          style={{
            position: "absolute",
            top: 28,
            right: 28,
            width: 18,
            height: 18,
            borderRadius: 9,
            background: "#10b981",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
