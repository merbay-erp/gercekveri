import Link from "next/link";
import {
  Building2,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  ArrowRight,
  Percent,
  BarChart3,
} from "lucide-react";

import type { TcmbPulseItem } from "@/lib/tcmb-snapshot";
import { Card } from "@/components/ui/card";

interface Props {
  items: TcmbPulseItem[];
}

// Seri kodundan hedef link, etiket ve renk şeması
const SERIES_META: Record<
  string,
  {
    href: string;
    title: string;
    symbol: string;
    accent: string;
    gradientFrom: string;
    icon: typeof BarChart3;
    suffix?: string;
    decimals: number;
  }
> = {
  "TP.DK.USD.S": {
    href: "/doviz/usd-try",
    title: "Dolar / TL",
    symbol: "USD",
    accent: "border-emerald-500/30 hover:border-emerald-500/60",
    gradientFrom: "from-emerald-500/[0.08]",
    icon: BarChart3,
    suffix: " TL",
    decimals: 4,
  },
  "TP.DK.EUR.S": {
    href: "/doviz/eur-try",
    title: "Euro / TL",
    symbol: "EUR",
    accent: "border-blue-500/30 hover:border-blue-500/60",
    gradientFrom: "from-blue-500/[0.08]",
    icon: BarChart3,
    suffix: " TL",
    decimals: 4,
  },
  "TP.FE.OKTG01": {
    href: "/tufe",
    title: "TÜFE Endeks",
    symbol: "TÜFE",
    accent: "border-rose-500/30 hover:border-rose-500/60",
    gradientFrom: "from-rose-500/[0.08]",
    icon: TrendingUp,
    decimals: 2,
  },
  "TP.APIFON4": {
    href: "/faiz",
    title: "Politika Faizi",
    symbol: "Faiz",
    accent: "border-purple-500/30 hover:border-purple-500/60",
    gradientFrom: "from-purple-500/[0.08]",
    icon: Percent,
    suffix: "%",
    decimals: 2,
  },
};

function formatValue(code: string, v: number, decimals: number, suffix?: string): string {
  return `${v.toFixed(decimals)}${suffix ?? ""}`;
}

function formatDate(s: string): string {
  const m = /^(\d{4})-(\d{1,2})$/.exec(s);
  if (m) {
    const months = [
      "Oca", "Şub", "Mar", "Nis", "May", "Haz",
      "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
    ];
    return `${months[parseInt(m[2], 10) - 1] ?? "?"} ${m[1]}`;
  }
  const d = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(s);
  if (d) {
    const months = [
      "Oca", "Şub", "Mar", "Nis", "May", "Haz",
      "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
    ];
    return `${parseInt(d[3], 10)} ${months[parseInt(d[2], 10) - 1]}`;
  }
  return s;
}

/**
 * MarketDashboard — TCMB göstergelerini hero'nun hemen altında büyük,
 * tıklanabilir kartlar olarak gösterir. Eski TcmbPulse'in genişletilmiş hali.
 *
 * Her kart kendi dedicated sayfasına (/doviz/usd-try, /tufe vb.) link verir →
 * SEO crawl + click-through hem trafiği hem reklam görüntülemeyi artırır.
 */
export function MarketDashboard({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="container mx-auto px-4 py-6 sm:py-10">
      <div className="mb-4 flex items-end justify-between">
        <div className="space-y-0.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Building2 className="-mt-0.5 mr-1 inline h-3 w-3" />
            TCMB · Resmi Anlık Veri
          </p>
          <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
            Piyasa göstergeleri
          </h2>
        </div>
        <Link
          href="/doviz"
          className="hidden text-xs text-muted-foreground transition hover:text-foreground sm:inline-flex sm:items-center sm:gap-1"
        >
          Tüm dövizler <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => {
          const meta = SERIES_META[it.code];
          if (!meta) return null;

          const yoy = it.yoyChangePct;
          const yoyPositive = yoy !== null && yoy >= 0;
          const yoyTone =
            yoy === null
              ? "text-muted-foreground"
              : yoyPositive
                ? "text-rose-500"
                : "text-emerald-500";

          const TrendIcon = yoyPositive ? TrendingUp : TrendingDown;
          const Icon = meta.icon;

          return (
            <Link key={it.code} href={meta.href} className="group block">
              <Card
                className={`relative h-full overflow-hidden bg-gradient-to-br ${meta.gradientFrom} to-transparent p-5 transition ${meta.accent} group-hover:shadow-md`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {meta.title}
                    </p>
                    <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl">
                      {formatValue(
                        it.code,
                        it.lastValue!,
                        meta.decimals,
                        meta.suffix,
                      )}
                    </p>
                  </div>
                  <Icon className="h-5 w-5 shrink-0 text-muted-foreground/40 transition group-hover:text-foreground/60" />
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{formatDate(it.lastDate)}</span>
                  {yoy !== null ? (
                    <span className={`flex items-center gap-0.5 font-medium tabular-nums ${yoyTone}`}>
                      <TrendIcon className="h-3 w-3" />
                      {yoy >= 0 ? "+" : ""}
                      {yoy.toFixed(1)}%
                    </span>
                  ) : null}
                </div>

                {it.isStale ? (
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-medium text-amber-600">
                    <AlertCircle className="h-2.5 w-2.5" />
                    eski
                  </span>
                ) : null}

                <ArrowRight className="absolute bottom-3 right-3 h-3.5 w-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
              </Card>
            </Link>
          );
        })}
      </div>

      <p className="mt-3 text-center text-[10px] text-muted-foreground sm:text-left">
        Kaynak:{" "}
        <a
          href="https://evds2.tcmb.gov.tr/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-2 hover:underline"
        >
          TCMB EVDS
        </a>{" "}
        · saatlik senkron · tıklayarak detaylı analiz + 12 aylık tarihçe
      </p>
    </section>
  );
}
