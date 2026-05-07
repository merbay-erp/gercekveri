import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

import { formatNumber } from "@/lib/money";

interface Props {
  totalApproved: number;
  totalLast24h: number;
  cities: number;
  districts: number;
  lastSubmissionAt: Date | null;
}

/**
 * Hero stat strip — surfaces the platform's "live data terminal" feel
 * right under the headline. Pulse dot + relative timestamp on the most
 * recent real submission signals the data isn't stale.
 */
export function HeroLiveCounters({
  totalApproved,
  totalLast24h,
  cities,
  districts,
  lastSubmissionAt,
}: Props) {
  const lastUpdate = lastSubmissionAt
    ? formatDistanceToNow(lastSubmissionAt, { addSuffix: true, locale: tr })
    : null;

  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4 shadow-sm backdrop-blur sm:p-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Veri noktası" value={formatNumber(totalApproved)} accent />
        <Stat label="Şehir" value={formatNumber(cities)} />
        <Stat label="İlçe / mahalle" value={formatNumber(districts)} />
        <Stat
          label="Son 24 saat"
          value={`+${formatNumber(totalLast24h)}`}
          tone={totalLast24h > 0 ? "emerald" : undefined}
        />
      </div>
      {lastUpdate ? (
        <div className="mt-3 flex items-center gap-2 border-t border-border/40 pt-3 text-xs text-muted-foreground">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Son veri {lastUpdate}
        </div>
      ) : null}
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  tone,
}: {
  label: string;
  value: string;
  accent?: boolean;
  tone?: "emerald";
}) {
  const valueClass =
    tone === "emerald"
      ? "text-emerald-600 dark:text-emerald-400"
      : accent
        ? "text-foreground"
        : "text-foreground/90";
  return (
    <div className="flex flex-col">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span
        className={`mt-1 text-2xl font-semibold tabular-nums sm:text-3xl ${valueClass}`}
      >
        {value}
      </span>
    </div>
  );
}
