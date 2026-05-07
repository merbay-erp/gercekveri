import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { TrustScore } from "@/lib/trust-score";

interface Props {
  score: TrustScore;
  /** Optional explicit label, e.g., "İstanbul kira verisi". */
  scopeLabel?: string;
  /** Compact pill-only variant; defaults to full panel. */
  variant?: "panel" | "pill";
}

const TONE: Record<
  TrustScore["level"],
  {
    border: string;
    bg: string;
    accent: string;
    accentText: string;
    Icon: typeof ShieldCheck;
    label: string;
  }
> = {
  high: {
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/[0.05]",
    accent: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    accentText: "text-emerald-600 dark:text-emerald-400",
    Icon: ShieldCheck,
    label: "Yüksek güven",
  },
  mid: {
    border: "border-amber-500/30",
    bg: "bg-amber-500/[0.05]",
    accent: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    accentText: "text-amber-600 dark:text-amber-400",
    Icon: ShieldAlert,
    label: "Orta güven",
  },
  low: {
    border: "border-rose-500/30",
    bg: "bg-rose-500/[0.05]",
    accent: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
    accentText: "text-rose-600 dark:text-rose-400",
    Icon: ShieldX,
    label: "Düşük güven",
  },
};

export function TrustScoreBadge({ score, scopeLabel, variant = "panel" }: Props) {
  const tone = TONE[score.level];
  const Icon = tone.Icon;

  if (variant === "pill") {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${tone.border} ${tone.bg} ${tone.accentText}`}
        title={`${tone.label}: ${score.score}/100`}
      >
        <Icon className="h-3 w-3" />
        Güven {score.score}/100
      </span>
    );
  }

  return (
    <Card className={`overflow-hidden ${tone.border} ${tone.bg} p-4 sm:p-5`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${tone.accent}`}
          >
            <Icon className="h-5 w-5" />
          </span>
          <div className="space-y-0.5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Güven Skoru
            </p>
            <p className="flex items-baseline gap-1.5">
              <span className={`text-2xl font-semibold tabular-nums ${tone.accentText}`}>
                {score.score}
              </span>
              <span className="text-sm text-muted-foreground">/ 100</span>
              <span className={`ml-2 text-xs font-medium ${tone.accentText}`}>
                {tone.label}
              </span>
            </p>
            {scopeLabel ? (
              <p className="text-xs text-muted-foreground">{scopeLabel}</p>
            ) : null}
          </div>
        </div>

        <ul className="flex-1 space-y-1.5 text-xs">
          {score.factors.map((f, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span
                className={`mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${
                  f.status === "ok"
                    ? "bg-emerald-500"
                    : f.status === "warn"
                      ? "bg-amber-500"
                      : "bg-rose-500"
                }`}
              />
              <span>
                <span className="font-medium text-foreground">{f.label}</span>
                <span className="ml-1.5 text-muted-foreground">— {f.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
