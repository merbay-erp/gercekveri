import { Card } from "@/components/ui/card";
import { formatTRY, formatNumber } from "@/lib/money";

export interface AmountStats {
  count: number;
  avg: number | null;
  median: number | null;
  p25: number | null;
  p75: number | null;
  min: number | null;
  max: number | null;
}

interface Props {
  stats: AmountStats;
  scopeLabel?: string;
  /** Format value cells (e.g. "₺28.000" or "78 Mbps"). Defaults to TRY. */
  formatValue?: (value: number) => string;
}

/**
 * Generic five-bucket stats panel — the same layout works for salary, rent,
 * utility bills, anything monetary. Pass `scopeLabel` to caption the grid.
 */
export function AmountStatsPanel({ stats, scopeLabel, formatValue = formatTRY }: Props) {
  const empty = stats.count === 0;
  const fmt = (n: number | null | undefined) => (n == null ? "–" : formatValue(n));
  const items: { label: string; value: string; emphasize?: boolean }[] = [
    { label: "Veri sayısı", value: formatNumber(stats.count) },
    { label: "Medyan", value: empty ? "–" : fmt(stats.median), emphasize: true },
    { label: "Ortalama", value: empty ? "–" : fmt(stats.avg) },
    { label: "Alt %25", value: empty ? "–" : fmt(stats.p25) },
    { label: "Üst %75", value: empty ? "–" : fmt(stats.p75) },
  ];

  return (
    <Card className="p-5">
      {scopeLabel ? (
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {scopeLabel}
        </p>
      ) : null}
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        {items.map((item) => (
          <div key={item.label}>
            <dt className="text-xs text-muted-foreground">{item.label}</dt>
            <dd
              className={
                item.emphasize
                  ? "mt-1 text-2xl font-semibold tabular-nums"
                  : "mt-1 text-lg font-medium tabular-nums"
              }
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
