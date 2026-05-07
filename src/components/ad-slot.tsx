import { cn } from "@/lib/utils";

interface AdSlotProps {
  /** Stable slot key — used for analytics + later AdSense unit lookup */
  slotKey: string;
  /** Reserve the layout area to avoid CLS even when ad fails to render */
  format?: "leaderboard" | "rectangle" | "responsive" | "inline";
  className?: string;
}

const formatHeights: Record<NonNullable<AdSlotProps["format"]>, string> = {
  leaderboard: "h-[90px]",
  rectangle: "h-[280px]",
  responsive: "min-h-[120px]",
  inline: "h-[100px]",
};

/**
 * Reusable, AdSense-safe ad slot.
 *
 * - Always renders a placeholder so layout shift (CLS) is zero whether the ad
 *   loads or not.
 * - In dev, shows a faint outline labelled "AdSlot · {key}" so we can audit
 *   placement density without showing real ads.
 * - In prod (when adsense client id is wired) we'll inject the real script
 *   conditionally; for now this is a stub.
 */
export function AdSlot({ slotKey, format = "responsive", className }: AdSlotProps) {
  const height = formatHeights[format];
  const isDev = process.env.NODE_ENV !== "production";
  const adsenseEnabled = Boolean(process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID);

  // Production'da AdSense ID yoksa hiç render etme — boş gri kart kullanıcıyı
  // yoruyor. AdSense onayı + env eklenince otomatik gösterime girer.
  if (!isDev && !adsenseEnabled) return null;

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
      {isDev ? (
        <span className="text-xs text-muted-foreground/60 font-mono">
          AdSlot · {slotKey} · {format}
        </span>
      ) : null}
    </div>
  );
}
