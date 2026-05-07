/**
 * Inline brand mark for next/og ImageResponse layouts.
 *
 * BrandMark SVG component'inin görsel ikizi ama next/og 44×44 div tabanlı
 * (next/og full SVG'yi destekliyor ama flex/positioning daha güvenli).
 * Kullanım: OG card header'larda 44×44 marka kutusu.
 */
export function OgBrandMark({ size = 44 }: { size?: number }) {
  // 64-grid → 44 scale: 0.6875 (kareleri orantılı küçülttük)
  const k = size / 64;
  const px = (n: number) => Math.round(n * k);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: px(14),
        background: "#0a0a0a",
        display: "flex",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          display: "flex",
          alignItems: "flex-end",
          gap: px(3),
          left: px(12),
          bottom: px(12),
        }}
      >
        <div style={{ width: px(7), height: px(14), background: "#fafafa", borderRadius: px(1.5) }} />
        <div style={{ width: px(7), height: px(24), background: "#fafafa", borderRadius: px(1.5) }} />
        <div style={{ width: px(7), height: px(20), background: "#fafafa", borderRadius: px(1.5) }} />
        <div style={{ width: px(7), height: px(30), background: "#fafafa", borderRadius: px(1.5) }} />
      </div>
      <div
        style={{
          position: "absolute",
          top: px(10),
          right: px(10),
          width: px(8),
          height: px(8),
          borderRadius: px(4),
          background: "#10b981",
        }}
      />
    </div>
  );
}
