import Link from "next/link";
import { Building2, ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  /** Resmi kaynak adı: "TÜİK", "TCMB", "EPDK", "MEB" */
  sourceLabel: string;
  /** Tam URL — public yayın */
  sourceUrl: string;
  /** "2024-Q4", "2025-yıllık (yayın 2025-12)" gibi referans periyodu */
  referenceDate: string;
  /** Resmi kaynağın söylediği değer (TL/birim) */
  officialValue: number;
  /** Kullanıcı verisinin medyanı — null ise kullanıcı verisi henüz yetersiz */
  userMedian: number | null;
  /** Kullanıcı paylaşım sayısı (null'sa "henüz yok") */
  userCount: number;
  /** UI'da formatlama (₺ / Mbps / kWh vb.) */
  formatValue: (n: number) => string;
  /** "Aylık kira", "Aylık net maaş" gibi metric label'ı */
  metricLabel: string;
  /** UI scope label — "İstanbul · 2+1 daire", "Yazılım Geliştirici" */
  scopeLabel: string;
  /** Sayı yorumu için ekstra not (örn. "%19 düşük — gerçek hayat daha pahalı") */
  methodology?: string;
}

/**
 * "TÜİK diyor X / Kullanıcı diyor Y / Fark %Z" panel'i.
 *
 * Şişkinlik panel'inin yapısal eşi ama farklı kaynaklı: resmi vs anonim
 * kullanıcı. Veri saydamlığı için kaynak adı + tarih + URL gösterir.
 */
export function OfficialVsRealPanel({
  sourceLabel,
  sourceUrl,
  referenceDate,
  officialValue,
  userMedian,
  userCount,
  formatValue,
  metricLabel,
  scopeLabel,
  methodology,
}: Props) {
  const hasUser = userMedian !== null && userCount >= 3;
  const deltaPct =
    hasUser && officialValue > 0
      ? Math.round(((userMedian! - officialValue) / officialValue) * 100)
      : null;

  const tone =
    deltaPct === null
      ? "neutral"
      : deltaPct >= 5
        ? "rose" // kullanıcı resmi'den yüksek = gerçek hayat daha pahalı
        : deltaPct <= -5
          ? "emerald"
          : "neutral";

  const toneClass = {
    rose: "border-rose-500/30 bg-gradient-to-br from-rose-500/[0.06] via-transparent to-transparent",
    emerald:
      "border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.06] via-transparent to-transparent",
    neutral:
      "border-border bg-gradient-to-br from-muted/30 via-transparent to-transparent",
  }[tone];

  const numberClass = {
    rose: "text-rose-600 dark:text-rose-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    neutral: "text-foreground",
  }[tone];

  const headline =
    !hasUser
      ? `${sourceLabel} ${scopeLabel} için ${metricLabel.toLowerCase()}: ${formatValue(officialValue)}.`
      : deltaPct! >= 5
        ? `Gerçek hayat ${sourceLabel}'in %${deltaPct} üstünde.`
        : deltaPct! <= -5
          ? `Kullanıcı verisi ${sourceLabel}'in %${Math.abs(deltaPct!)} altında.`
          : `Resmi rakam ve kullanıcı verisi yakın (%${Math.abs(deltaPct!)} fark).`;

  return (
    <Card className={`overflow-hidden p-5 sm:p-6 ${toneClass}`}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-foreground/10">
          <Building2 className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Resmi vs Gerçek
          </p>
          <p className="text-[11px] text-muted-foreground">
            {scopeLabel} · {metricLabel}
          </p>
        </div>
        {deltaPct !== null ? (
          <Badge
            variant="secondary"
            className={`ml-auto font-semibold tabular-nums ${numberClass}`}
          >
            {deltaPct >= 0 ? "+" : ""}%{deltaPct}
          </Badge>
        ) : null}
      </div>

      <h3 className="mb-3 text-base font-semibold leading-snug sm:text-lg">
        {headline}
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border bg-card/50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {sourceLabel}
          </p>
          <p className="mt-0.5 text-xl font-semibold tabular-nums">
            {formatValue(officialValue)}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {referenceDate}
          </p>
        </div>
        <div className="rounded-lg border bg-card/50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Kullanıcı medyanı
          </p>
          {hasUser ? (
            <>
              <p className={`mt-0.5 text-xl font-semibold tabular-nums ${numberClass}`}>
                {formatValue(userMedian!)}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {userCount} anonim paylaşım
              </p>
            </>
          ) : (
            <>
              <p className="mt-0.5 text-xl font-semibold tabular-nums text-muted-foreground">
                —
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {userCount} paylaşım, en az 3 gerek
              </p>
            </>
          )}
        </div>
      </div>

      {methodology ? (
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          {methodology}
        </p>
      ) : null}

      <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-3">
        <Link
          href={sourceUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="text-[11px] text-muted-foreground transition hover:text-foreground"
        >
          Kaynak: {sourceLabel} →
        </Link>
        {!hasUser ? (
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[11px] font-medium hover:underline"
          >
            Sen de veri ekle <ArrowRight className="h-3 w-3" />
          </Link>
        ) : null}
      </div>
    </Card>
  );
}
