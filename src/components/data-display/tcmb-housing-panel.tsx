import Link from "next/link";
import { Building2, TrendingUp, TrendingDown } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { HousingIndexSnapshot } from "@/lib/tcmb-snapshot";

interface Props {
  data: HousingIndexSnapshot;
}

function formatDate(s: string): string {
  const m = /^(\d{4})-(\d{1,2})$/.exec(s);
  if (!m) return s;
  const months = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
  ];
  return `${months[parseInt(m[2], 10) - 1]} ${m[1]}`;
}

/**
 * Şehir ya da Türkiye geneli için TCMB Hedonik Konut Fiyat Endeksi paneli.
 * Kira sayfalarında "konut FIYATI" makro trendini gösterir — kira ile direkt
 * karşılaştırılmaz ama bölge ısınması/soğuması için referans.
 */
export function TcmbHousingPanel({ data }: Props) {
  const yoy = data.yoyChangePct;
  const tone =
    yoy === null
      ? "neutral"
      : yoy >= 60
        ? "rose"
        : yoy >= 30
          ? "amber"
          : "emerald";

  const toneClass = {
    rose: "border-rose-500/30 bg-gradient-to-br from-rose-500/[0.06] via-transparent to-transparent",
    amber: "border-amber-500/30 bg-gradient-to-br from-amber-500/[0.06] via-transparent to-transparent",
    emerald: "border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.06] via-transparent to-transparent",
    neutral: "border-border bg-muted/20",
  }[tone];

  const numberClass = {
    rose: "text-rose-600 dark:text-rose-400",
    amber: "text-amber-600 dark:text-amber-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    neutral: "text-foreground",
  }[tone];

  const scopeLabel =
    data.scope === "city" && data.cityName
      ? data.cityName
      : "Türkiye geneli";

  const headline =
    yoy === null
      ? `${scopeLabel}: konut fiyat endeksi son veri ${formatDate(data.lastDate)}.`
      : yoy >= 60
        ? `${scopeLabel}'de konut fiyatları yıllık %${yoy.toFixed(1)} arttı — sert tırmanış.`
        : yoy >= 30
          ? `${scopeLabel}'de konut fiyatları yıllık %${yoy.toFixed(1)} arttı.`
          : yoy >= 0
            ? `${scopeLabel}'de konut fiyatları yıllık %${yoy.toFixed(1)} — ılımlı seyir.`
            : `${scopeLabel}'de konut fiyatları yıllık %${yoy.toFixed(1)} — düşüş eğilimi.`;

  const TrendIcon =
    yoy === null ? Building2 : yoy >= 0 ? TrendingUp : TrendingDown;

  return (
    <Card className={`overflow-hidden p-5 sm:p-6 ${toneClass}`}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-foreground/10">
          <Building2 className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            TCMB · Hedonik Konut Fiyat Endeksi
          </p>
          <p className="text-[11px] text-muted-foreground">
            {scopeLabel} · {formatDate(data.lastDate)}
          </p>
        </div>
        {yoy !== null ? (
          <span
            className={`ml-auto inline-flex items-center gap-1 rounded-full bg-card/70 px-2.5 py-1 text-xs font-semibold tabular-nums ${numberClass}`}
          >
            <TrendIcon className="h-3 w-3" />
            {yoy >= 0 ? "+" : ""}%{yoy.toFixed(1)} y/y
          </span>
        ) : null}
      </div>

      <h3 className="mb-3 text-base font-semibold leading-snug sm:text-lg">
        {headline}
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border bg-card/50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Endeks değeri
          </p>
          <p className="mt-0.5 text-xl font-semibold tabular-nums">
            {data.lastValue.toFixed(1)}
          </p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {formatDate(data.lastDate)} · 2017=100 baz
          </p>
        </div>
        <div className="rounded-lg border bg-card/50 p-3">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Yıllık değişim
          </p>
          {yoy !== null ? (
            <p className={`mt-0.5 text-xl font-semibold tabular-nums ${numberClass}`}>
              {yoy >= 0 ? "+" : ""}%{yoy.toFixed(1)}
            </p>
          ) : (
            <p className="mt-0.5 text-xl font-semibold tabular-nums text-muted-foreground">
              —
            </p>
          )}
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            12 ay önceye göre
          </p>
        </div>
      </div>

      <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
        Konut fiyat endeksi kira değil, satış fiyatlarını ölçer. Yine de
        bölgenin ısınma/soğuma trendi için kira beklentisinin makro arka planı.
      </p>

      <div className="mt-3 border-t border-border/40 pt-3">
        <Link
          href="https://www.tcmb.gov.tr/wps/wcm/connect/tr/tcmb+tr/main+menu/istatistikler/reel+sektor+istatistikleri/konut+fiyat+endeksi/"
          target="_blank"
          rel="noreferrer noopener"
          className="text-[11px] text-muted-foreground transition hover:text-foreground"
        >
          Kaynak: TCMB Konut Fiyat Endeksi → ({data.seriesCode})
        </Link>
      </div>
    </Card>
  );
}
