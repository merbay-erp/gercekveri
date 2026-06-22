import type { RiskBand } from "@/services/risk/types";
import { bandText } from "./risk-tokens";
import { cn } from "@/lib/utils";

export function ScoreRing({ score, band, size = 124 }: { score: number; band: RiskBand; size?: number }) {
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.max(0, Math.min(100, score)) / 100);
  const cx = size / 2;

  return (
    <div className={cn("relative shrink-0", bandText[band])} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={cx}
          cy={cx}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${cx} ${cx})`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-medium leading-none">{Math.round(score)}</span>
        <span className="mt-1 text-[11px] text-muted-foreground">risk / 100</span>
      </div>
    </div>
  );
}
