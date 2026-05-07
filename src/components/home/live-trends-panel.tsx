import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import { TrendingUp, TrendingDown, Activity, ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTRY, formatNumber } from "@/lib/money";
import type {
  CategoryDelta,
  RecentSubmissionItem,
  TrendingCity,
} from "@/lib/recent-activity";

interface Props {
  categoryDeltas: CategoryDelta[];
  trendingCities: TrendingCity[];
  recentSubmissions: RecentSubmissionItem[];
}

const TYPE_LABELS: Record<string, string> = {
  SALARY: "Maaş",
  RENT: "Kira",
  AIDAT: "Aidat",
  INTERNET: "İnternet",
  UTILITY: "Fatura",
  TEXTILE: "Tekstil",
};

const TYPE_HREF: Record<string, string> = {
  SALARY: "/maaslar",
  RENT: "/kira",
  AIDAT: "/aidat",
  INTERNET: "/internet",
  UTILITY: "/fatura",
  TEXTILE: "/tekstil",
};

export function LiveTrendsPanel({
  categoryDeltas,
  trendingCities,
  recentSubmissions,
}: Props) {
  // Filter out categories with no activity in either window — empty rows
  // make the panel feel sparse rather than alive.
  const visibleDeltas = categoryDeltas.filter(
    (d) => d.thisPeriod > 0 || d.prevPeriod > 0,
  );
  const hasSignal = visibleDeltas.length > 0 || trendingCities.length > 0;

  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-6 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <h2 className="text-2xl font-semibold tracking-tight">Şu an ne oluyor?</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium">Son 7 gün hareketi</h3>
            <Badge variant="secondary" className="font-normal">
              kategori başı
            </Badge>
          </div>

          {!hasSignal ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Henüz hareketi ölçecek kadar gerçek paylaşım yok. İlk veriyi sen ekle —
              veriler arttıkça bu panel canlı sinyal yayacak.
            </p>
          ) : (
            <>
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {visibleDeltas.map((d) => {
                  const Icon =
                    d.deltaPct === null
                      ? Activity
                      : d.deltaPct > 0
                        ? TrendingUp
                        : d.deltaPct < 0
                          ? TrendingDown
                          : Activity;
                  const toneClass =
                    d.deltaPct === null
                      ? "text-muted-foreground"
                      : d.deltaPct > 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : d.deltaPct < 0
                          ? "text-rose-600 dark:text-rose-400"
                          : "text-muted-foreground";
                  return (
                    <li key={d.type}>
                      <Link
                        href={TYPE_HREF[d.type] ?? "/"}
                        className="flex items-center justify-between rounded-md border px-3 py-2 text-sm transition hover:border-foreground/30 hover:bg-muted/30"
                      >
                        <span className="font-medium">
                          {TYPE_LABELS[d.type] ?? d.type}
                        </span>
                        <span
                          className={`flex items-center gap-1.5 tabular-nums ${toneClass}`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {d.deltaPct === null
                            ? `${formatNumber(d.thisPeriod)} yeni`
                            : `${d.deltaPct >= 0 ? "+" : ""}%${d.deltaPct} · ${formatNumber(d.thisPeriod)} yeni`}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>

              {trendingCities.length > 0 ? (
                <>
                  <div className="my-4 border-t" />
                  <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Yükselişte
                  </div>
                  <ul className="grid gap-1.5">
                    {trendingCities.map((c) => (
                      <li
                        key={`${c.type}:${c.citySlug}`}
                        className="flex items-center justify-between rounded-md border bg-emerald-500/5 px-3 py-2 text-sm"
                      >
                        <span className="flex items-center gap-2">
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                          <span className="font-medium">
                            {c.cityName} {TYPE_LABELS[c.type]?.toLowerCase()}
                          </span>
                        </span>
                        <span className="tabular-nums text-emerald-600 dark:text-emerald-400">
                          +%{c.deltaPct}
                        </span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </>
          )}
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-medium">Canlı akış</h3>
            <Link
              href="/istatistikler"
              className="text-xs text-muted-foreground transition hover:text-foreground"
            >
              istatistikler →
            </Link>
          </div>
          {recentSubmissions.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Henüz gerçek paylaşım yok.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {recentSubmissions.map((s) => (
                <li
                  key={s.publicId}
                  className="flex items-start gap-3 rounded-md border px-3 py-2 text-sm"
                >
                  <span className="mt-1.5 inline-flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500/70" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{s.summary}</p>
                    <p className="text-xs text-muted-foreground">
                      {s.cityName ?? "—"}
                      {s.districtName ? ` · ${s.districtName}` : ""}
                      {s.amount !== null && s.type !== "INTERNET"
                        ? ` · ${formatTRY(s.amount)}`
                        : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {formatDistanceToNow(s.createdAt, {
                      addSuffix: true,
                      locale: tr,
                    })}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-6 flex justify-center">
        <Link
          href="/istatistikler"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          Tüm istatistikler <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
