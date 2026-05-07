import { Building2, AlertCircle } from "lucide-react";

import type { TcmbPulseItem } from "@/lib/tcmb-snapshot";

interface Props {
  items: TcmbPulseItem[];
}

function formatValue(code: string, v: number): string {
  // Döviz: 4 hane, faiz: 2 hane, endeks: 2 hane
  if (code.startsWith("TP.DK.")) return v.toFixed(4);
  return v.toFixed(2);
}

function formatDate(s: string): string {
  // EVDS aylık format: "2026-3" → "Mart 2026"
  const m = /^(\d{4})-(\d{1,2})$/.exec(s);
  if (m) {
    const months = [
      "Oca", "Şub", "Mar", "Nis", "May", "Haz",
      "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
    ];
    const mi = parseInt(m[2], 10) - 1;
    return `${months[mi] ?? "?"} ${m[1]}`;
  }
  // Günlük format: "2026-04-15" → "15 Nis"
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
 * TCMB Pulse — 4 ana göstergeyi (USD, EUR, TÜFE, faiz) hero altında
 * compact bir bantta gösterir. Veri TcmbSnapshot'tan okur, cron yeniler.
 *
 * 36 saat boyunca cron çalışmazsa stale flag rozeti çıkar.
 */
export function TcmbPulse({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="border-b border-border/60 bg-muted/30">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Building2 className="h-3.5 w-3.5" />
            TCMB göstergeler
          </div>
          {items.map((it) => {
            const yoy = it.yoyChangePct;
            const yoyTone =
              yoy === null
                ? "text-muted-foreground"
                : yoy >= 0
                  ? "text-rose-600 dark:text-rose-400"
                  : "text-emerald-600 dark:text-emerald-400";
            return (
              <div
                key={it.code}
                className="flex items-baseline gap-1.5"
                title={`${it.label} — ${formatDate(it.lastDate)}`}
              >
                <span className="text-[11px] text-muted-foreground">
                  {it.label.split("(")[0].trim()}
                </span>
                <span className="text-sm font-semibold tabular-nums">
                  {formatValue(it.code, it.lastValue!)}
                </span>
                {yoy !== null ? (
                  <span className={`text-[10px] font-medium tabular-nums ${yoyTone}`}>
                    {yoy >= 0 ? "+" : ""}%{yoy.toFixed(1)}
                  </span>
                ) : null}
                {it.isStale ? (
                  <AlertCircle
                    className="h-3 w-3 text-amber-500"
                    aria-label="Veri 36 saatten eski"
                  />
                ) : null}
              </div>
            );
          })}
          <span className="ml-auto text-[10px] text-muted-foreground">
            kaynak: TCMB EVDS · günlük güncelleme
          </span>
        </div>
      </div>
    </div>
  );
}
