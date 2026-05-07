import Link from "next/link";
import { ArrowDown, ArrowUp, Minus, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ComparisonResult } from "@/lib/comparison";

interface Props {
  result: ComparisonResult;
  /** Brief context line, e.g. "Frontend Developer · İstanbul · 5 yıl deneyim" */
  context?: string;
  /** Internal link back to the relevant scope page for further exploration */
  exploreHref?: string;
  exploreLabel?: string;
}

const toneStyles: Record<ComparisonResult["tone"], { bar: string; ring: string; icon: typeof ArrowUp }> = {
  high: {
    bar: "bg-emerald-500",
    ring: "ring-emerald-500/30 bg-emerald-500/5",
    icon: ArrowUp,
  },
  mid: {
    bar: "bg-amber-500",
    ring: "ring-amber-500/30 bg-amber-500/5",
    icon: Minus,
  },
  low: {
    bar: "bg-rose-500",
    ring: "ring-rose-500/30 bg-rose-500/5",
    icon: ArrowDown,
  },
};

export function ComparisonResultCard({
  result,
  context,
  exploreHref,
  exploreLabel = "Tüm verilere bak",
}: Props) {
  const tone = toneStyles[result.tone];
  const ToneIcon = tone.icon;

  return (
    <Card className={cn("ring-1 p-6 transition", tone.ring)}>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-lg text-white",
              tone.bar,
            )}
          >
            <ToneIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1 space-y-2">
            <h2 className="text-xl font-semibold leading-snug sm:text-2xl">
              {result.headline}
            </h2>
            {context ? (
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                {context}
              </p>
            ) : null}
          </div>
          <Badge variant="secondary" className="font-mono text-xs">
            {result.percentile >= 50 ? `Üst %${100 - result.percentile + 1}` : `Alt %${result.percentile}`}
          </Badge>
        </div>

        {/* Percentile bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Alt %0</span>
            <span>Medyan</span>
            <span>Üst %100</span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <div className="absolute left-1/2 top-0 h-full w-px bg-border" />
            <div
              className={cn("h-full transition-all", tone.bar)}
              style={{ width: `${Math.min(100, Math.max(2, result.percentile))}%` }}
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">{result.body}</p>

        {exploreHref ? (
          <Link
            href={exploreHref}
            className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            <TrendingUp className="h-3.5 w-3.5" /> {exploreLabel}
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
