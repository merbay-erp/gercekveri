import Link from "next/link";
import { Flame, ArrowRight, Target } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTRY, formatNumber } from "@/lib/money";
import { computeRealityScore } from "@/lib/reality-score";
import type { RentInflationStats } from "../server/queries";

interface Props {
  stats: RentInflationStats;
  scopeLabel: string;
  /** Optional CTA — e.g., link to share or to /kira/sisme */
  shareHref?: string;
}

/**
 * "Gerçek vs ilan" panel — surfaces the gap between what's listed online
 * and what tenants actually pay. Headline number is the inflation %.
 *
 * Renders a soft-fail "yetersiz veri" state when fewer than 3 paired
 * submissions exist in scope. We never publish a single-anomaly figure.
 */
export function RentInflationPanel({ stats, scopeLabel, shareHref }: Props) {
  const insufficient =
    stats.pairCount < 3 ||
    stats.realMedian === null ||
    stats.listedMedian === null ||
    stats.inflationPct === null;

  if (insufficient) {
    return (
      <Card className="border-rose-500/20 bg-gradient-to-br from-rose-500/[0.04] via-transparent to-transparent p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-rose-500/10 text-rose-500">
            <Flame className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-medium">Gerçek vs İlan şişkinlik</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {scopeLabel} için yeterli eşleşmiş veri yok ({stats.pairCount} paylaşım,
              en az 3 gerek). İlan fiyatını da paylaşan kullanıcılar arttıkça bu
              panel sayı yayar.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const positive = (stats.inflationPct ?? 0) > 0;
  const tone = positive ? "rose" : "emerald";
  const toneAccent =
    tone === "rose"
      ? "border-rose-500/30 bg-gradient-to-br from-rose-500/[0.08] via-rose-500/[0.02] to-transparent"
      : "border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.08] via-emerald-500/[0.02] to-transparent";
  const toneIcon =
    tone === "rose"
      ? "bg-rose-500/15 text-rose-500"
      : "bg-emerald-500/15 text-emerald-500";
  const toneNumber =
    tone === "rose"
      ? "text-rose-600 dark:text-rose-400"
      : "text-emerald-600 dark:text-emerald-400";

  const headline = positive
    ? `İlan fiyatı, gerçek kiradan %${stats.inflationPct} fazla.`
    : `İlan fiyatı, gerçek kiradan %${Math.abs(stats.inflationPct ?? 0)} düşük — nadir durum.`;

  const reality = computeRealityScore(stats.inflationPct ?? null);

  return (
    <Card className={`relative overflow-hidden p-6 sm:p-8 ${toneAccent}`}>
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" />

      <div className="relative">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className={`grid h-10 w-10 place-items-center rounded-xl ${toneIcon}`}>
            <Flame className="h-5 w-5" />
          </span>
          <div>
            <p
              className={`text-xs font-semibold uppercase tracking-wider ${
                tone === "rose"
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              Gerçek vs İlan
            </p>
            <p className="text-[11px] text-muted-foreground">
              {scopeLabel} · {formatNumber(stats.pairCount)} eşleşmiş paylaşım
            </p>
          </div>
          <div className="ml-auto flex flex-wrap items-center gap-2">
            {reality ? (
              <Badge
                variant="outline"
                className={`gap-1 font-semibold tabular-nums ${
                  reality.level === "ok"
                    ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                    : reality.level === "warn"
                      ? "border-amber-500/40 text-amber-600 dark:text-amber-400"
                      : "border-rose-500/40 text-rose-600 dark:text-rose-400"
                }`}
                title={reality.message}
              >
                <Target className="h-3 w-3" />
                Gerçeklik {reality.score}/100
              </Badge>
            ) : null}
            <Badge
              variant="secondary"
              className={`font-semibold tabular-nums ${toneNumber}`}
            >
              {positive ? "+" : ""}%{stats.inflationPct}
            </Badge>
          </div>
        </div>

        <h3 className="mb-4 text-xl font-semibold leading-snug sm:text-2xl">
          {headline}
        </h3>

        {reality ? (
          <p className="mb-4 text-sm text-muted-foreground">{reality.message}</p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <Stat
            label="İlan medyanı"
            value={formatTRY(stats.listedMedian!)}
            sub="emlakçı/sahibinden"
            highlight={positive}
          />
          <Stat
            label="Gerçek ödenen"
            value={formatTRY(stats.realMedian!)}
            sub="anonim kiracı verisi"
          />
        </div>

        {shareHref ? (
          <div className="mt-5 flex items-center justify-between border-t border-rose-500/15 pt-4">
            <p className="text-[11px] text-muted-foreground/80">
              Paylaşımlar arttıkça doğruluk artar.
            </p>
            <Link
              href={shareHref}
              className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
            >
              Detaylı şişkinlik tablosu <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        ) : null}
      </div>
    </Card>
  );
}

function Stat({
  label,
  value,
  sub,
  highlight,
}: {
  label: string;
  value: string;
  sub: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border bg-card/40 p-4">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={`mt-1 text-2xl font-semibold tabular-nums ${
          highlight ? "text-rose-600 dark:text-rose-400" : "text-foreground"
        }`}
      >
        {value}
      </p>
      <p className="mt-0.5 text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}
