"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  /** Stable slot key — used for analytics + later AdSense unit lookup */
  slotKey: string;
  /**
   * AdSense ad unit slot ID. Eğer verilirse manuel ad unit gösterir.
   * Verilmezse, AdSense Auto Ads bu pozisyonu kendisi optimize eder.
   */
  adSlotId?: string;
  /** Reserve the layout area to avoid CLS even when ad fails to render */
  format?: "leaderboard" | "rectangle" | "responsive" | "inline";
  className?: string;
}

const formatHeights: Record<NonNullable<AdSlotProps["format"]>, string> = {
  leaderboard: "min-h-[90px]",
  rectangle: "min-h-[280px]",
  responsive: "min-h-[120px]",
  inline: "min-h-[100px]",
};

const formatToAdSenseFormat: Record<
  NonNullable<AdSlotProps["format"]>,
  string
> = {
  leaderboard: "horizontal",
  rectangle: "rectangle",
  responsive: "auto",
  inline: "fluid",
};

/**
 * AdSense-ready, CLS-safe ad slot.
 *
 * Davranış:
 * - Geliştirme ortamı: işaretli boş kart (placement audit için)
 * - Production + ID yok: hiç render etmez (boş alan değil)
 * - Production + ID var:
 *   - adSlotId verildiyse: manuel <ins> ad unit + adsbygoogle.push()
 *   - adSlotId yoksa: hidden div (Auto Ads bu DOM'u yine de görür)
 *
 * Always reserves layout space → zero CLS impact (Core Web Vitals friendly).
 */
export function AdSlot({
  slotKey,
  adSlotId,
  format = "responsive",
  className,
}: AdSlotProps) {
  const height = formatHeights[format];
  const isDev = process.env.NODE_ENV !== "production";
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const pushedRef = useRef(false);

  // Manuel ad unit kullanılıyorsa, adsbygoogle queue'ya bir kez push et.
  useEffect(() => {
    if (!clientId || !adSlotId || pushedRef.current) return;
    if (typeof window === "undefined") return;
    try {
      // window.adsbygoogle Google tarafindan inject ediliyor.
      (
        (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle ?? []
      ).push({});
      pushedRef.current = true;
    } catch {
      // sessizce yut — adblocker / network hatası
    }
  }, [clientId, adSlotId]);

  // Geliştirme: işaretli placeholder (placement density audit için).
  if (isDev) {
    return (
      <div
        role="complementary"
        aria-label="Reklam alanı"
        data-ad-slot={slotKey}
        className={cn(
          "w-full rounded-lg border border-dashed border-border/60 bg-muted/30",
          "flex items-center justify-center",
          height,
          className,
        )}
      >
        <span className="text-xs text-muted-foreground/60 font-mono">
          AdSlot · {slotKey} · {format}
          {adSlotId ? ` · #${adSlotId}` : " · auto"}
        </span>
      </div>
    );
  }

  // Production: ID yoksa hiç render etme.
  if (!clientId) return null;

  // Manuel ad unit — adSlotId verildiyse.
  if (adSlotId) {
    return (
      <div
        data-ad-slot-key={slotKey}
        className={cn("w-full overflow-hidden", height, className)}
      >
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={clientId}
          data-ad-slot={adSlotId}
          data-ad-format={formatToAdSenseFormat[format]}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // Auto Ads modu — slot ID yok, Google kendisi placement seçer.
  // Bu div'i AdSense crawler görür ve uygunsa otomatik dolurur.
  return (
    <div
      data-ad-slot-key={slotKey}
      data-auto-ad-zone="true"
      className={cn("w-full", height, className)}
    />
  );
}
