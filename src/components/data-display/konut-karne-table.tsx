import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

import type { KarneRow } from "@/lib/konut-karne";

interface Props {
  rows: KarneRow[];
  tufeYoy: number;
  /** "compact" anasayfa ribbon için (top 5 + "tümünü gör"); "full" detay sayfası için tümü */
  mode: "compact" | "full";
}

const TONE_CLASS: Record<KarneRow["tone"], string> = {
  rose: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30",
  amber: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
  emerald: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
};

const TONE_DOT: Record<KarneRow["tone"], string> = {
  rose: "bg-rose-500",
  amber: "bg-amber-500",
  emerald: "bg-emerald-500",
};

function DeltaCell({ delta }: { delta: number }) {
  // delta = TÜFE - KFE; pozitif = enflasyonun altında (reel kayıp)
  const Icon = delta <= 0 ? TrendingUp : delta >= 5 ? TrendingDown : Minus;
  const color =
    delta <= 0
      ? "text-rose-600 dark:text-rose-400"
      : delta >= 5
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-amber-600 dark:text-amber-400";
  const text =
    delta <= 0
      ? `+%${Math.abs(delta).toFixed(1)} üstü`
      : `-%${delta.toFixed(1)} altı`;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold tabular-nums ${color}`}>
      <Icon className="h-3 w-3" />
      {text}
    </span>
  );
}

export function KonutKarneTable({ rows, tufeYoy, mode }: Props) {
  const display = mode === "compact" ? rows.slice(0, 5) : rows;

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="border-b border-border/40 bg-muted/30 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Konut Enflasyon Karnesi
            </p>
            <p className="text-[11px] text-muted-foreground">
              TÜFE %{tufeYoy.toFixed(1)} ile karşılaştırma · TCMB EVDS
            </p>
          </div>
          {mode === "compact" ? (
            <Link
              href="/konut-enflasyon"
              className="text-xs font-medium text-foreground hover:underline"
            >
              Tüm 19 bölge →
            </Link>
          ) : null}
        </div>
      </div>

      <div className="divide-y divide-border/40">
        {display.map((r) => (
          <div
            key={r.code}
            className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3"
          >
            <span className="w-7 shrink-0 text-xs font-mono text-muted-foreground tabular-nums">
              #{r.rank}
            </span>
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${TONE_DOT[r.tone]}`}
            />
            <span className="min-w-0 flex-1 truncate text-sm font-medium">
              {r.regionLabel}
            </span>
            <span
              className={`inline-flex shrink-0 items-center rounded-full border px-2 py-0.5 text-xs font-semibold tabular-nums ${TONE_CLASS[r.tone]}`}
            >
              %{r.yoyPct.toFixed(1)}
            </span>
            <DeltaCell delta={r.deltaToTufe} />
          </div>
        ))}
      </div>

      {mode === "compact" && rows.length > 5 ? (
        <div className="border-t border-border/40 bg-muted/20 px-4 py-2 text-center">
          <Link
            href="/konut-enflasyon"
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            +{rows.length - 5} bölge daha →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
