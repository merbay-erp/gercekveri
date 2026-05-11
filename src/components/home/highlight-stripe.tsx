import Link from "next/link";
import { Flame, ArrowUpRight, ArrowDownRight, ArrowRight } from "lucide-react";

import type { TcmbPulseItem } from "@/lib/tcmb-snapshot";
import type { CityMedianDelta } from "@/lib/realtime-deltas";

interface Props {
  tcmbItems: TcmbPulseItem[];
  movers: { rising: CityMedianDelta[]; falling: CityMedianDelta[] };
  totalSubmissions: number;
  totalLast24h: number;
}

// CategoryType → URL prefix
const TYPE_PATH: Record<string, string> = {
  SALARY: "maaslar",
  RENT: "kira",
  INTERNET: "internet",
  AIDAT: "aidat",
  UTILITY: "fatura",
  TEXTILE: "tekstil",
};

const TYPE_LABEL: Record<string, string> = {
  SALARY: "maaşı",
  RENT: "kirası",
  INTERNET: "interneti",
  AIDAT: "aidatı",
  UTILITY: "faturası",
  TEXTILE: "tekstili",
};

interface Highlight {
  id: string;
  label: string;
  value: string;
  href: string;
  tone: "up" | "down" | "neutral" | "viral";
}

function buildHighlights(props: Props): Highlight[] {
  const out: Highlight[] = [];

  // 1) Son 24 saatte paylaşım — sosyal proof
  if (props.totalLast24h > 0) {
    out.push({
      id: "live-24h",
      label: "Son 24 saatte",
      value: `${props.totalLast24h} yeni paylaşım`,
      href: "/istatistikler",
      tone: "viral",
    });
  }

  // 2) TÜFE yıllık — viral macro hook
  const tufe = props.tcmbItems.find((i) => i.code === "TP.FE.OKTG01");
  if (tufe?.yoyChangePct != null) {
    out.push({
      id: "tufe-yoy",
      label: "Yıllık enflasyon (TÜFE)",
      value: `%${tufe.yoyChangePct.toFixed(1)}`,
      href: "/tufe",
      tone: tufe.yoyChangePct > 0 ? "up" : "down",
    });
  }

  // 3) Faiz mevcut
  const faiz = props.tcmbItems.find((i) => i.code === "TP.APIFON4");
  if (faiz?.lastValue != null) {
    out.push({
      id: "faiz-now",
      label: "TCMB politika faizi",
      value: `%${faiz.lastValue.toFixed(2)}`,
      href: "/faiz",
      tone: "neutral",
    });
  }

  // 4) USD/TL
  const usd = props.tcmbItems.find((i) => i.code === "TP.DK.USD.S");
  if (usd?.lastValue != null) {
    out.push({
      id: "usd-now",
      label: "1 USD",
      value: `${usd.lastValue.toFixed(2)} TL`,
      href: "/doviz/usd-try",
      tone: "neutral",
    });
  }

  // 5) En çok yükselen şehir × kategori
  if (props.movers.rising[0]) {
    const r = props.movers.rising[0];
    const path = TYPE_PATH[r.type] ?? "maaslar";
    const label = TYPE_LABEL[r.type] ?? "değeri";
    out.push({
      id: `rising-${r.citySlug}-${r.type}`,
      label: `${r.cityName} ${label}`,
      value: `+%${Math.abs(r.deltaPct).toFixed(1)}`,
      href: `/${path}/sehir/${r.citySlug}`,
      tone: "up",
    });
  }

  return out.slice(0, 5);
}

/**
 * HighlightStripe — hero altında "öne çıkan veriler" şeridi.
 *
 * Viral hook'lar: TÜFE yıllık, faiz, USD, son 24 saat paylaşım, en çok
 * yükselen şehir. Her biri tıklanabilir → traffic + dwell time artar.
 *
 * Mobile: horizontal scroll. Desktop: 5 kart yan yana.
 */
export function HighlightStripe(props: Props) {
  const highlights = buildHighlights(props);
  if (highlights.length === 0) return null;

  return (
    <section className="container mx-auto px-4 pt-8">
      <div className="mb-3 flex items-center gap-2">
        <Flame className="h-4 w-4 text-amber-500" />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Bu an Türkiye'de
        </h2>
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:snap-none sm:grid-cols-3 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-5">
        {highlights.map((h) => {
          const ArrowIcon =
            h.tone === "up"
              ? ArrowUpRight
              : h.tone === "down"
                ? ArrowDownRight
                : h.tone === "viral"
                  ? Flame
                  : ArrowRight;
          const tone =
            h.tone === "up"
              ? "border-rose-500/30 hover:border-rose-500/60"
              : h.tone === "down"
                ? "border-emerald-500/30 hover:border-emerald-500/60"
                : h.tone === "viral"
                  ? "border-amber-500/30 hover:border-amber-500/60"
                  : "border-border hover:border-foreground/30";
          const valueTone =
            h.tone === "up"
              ? "text-rose-600 dark:text-rose-400"
              : h.tone === "down"
                ? "text-emerald-600 dark:text-emerald-400"
                : h.tone === "viral"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-foreground";

          return (
            <Link
              key={h.id}
              href={h.href}
              className={`group block min-w-[170px] shrink-0 snap-start rounded-lg border bg-card p-3 transition sm:min-w-0 ${tone}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    {h.label}
                  </p>
                  <p className={`text-xl font-semibold tabular-nums ${valueTone}`}>
                    {h.value}
                  </p>
                </div>
                <ArrowIcon className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 transition group-hover:text-foreground/80" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
