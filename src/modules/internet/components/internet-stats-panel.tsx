import { Card } from "@/components/ui/card";
import { formatNumber } from "@/lib/money";
import { formatMbps, formatMs } from "../config";
import type { InternetMultiStats } from "../types";

interface Props {
  stats: InternetMultiStats;
  scopeLabel?: string;
}

/**
 * Internet has multiple metrics (speed, ping, satisfaction, stability) so the
 * generic AmountStatsPanel doesn't fit — this panel shows a compact summary
 * grid tailored to ISP measurements.
 */
export function InternetStatsPanel({ stats, scopeLabel }: Props) {
  const empty = stats.count === 0;
  const items: { label: string; value: string; emphasize?: boolean }[] = [
    { label: "Veri sayısı", value: formatNumber(stats.count) },
    {
      label: "Medyan gerçek hız",
      value: empty ? "–" : formatMbps(stats.medianRealSpeed),
      emphasize: true,
    },
    {
      label: "Verim (gerçek/paket)",
      value:
        empty || stats.speedEfficiency === null
          ? "–"
          : `%${Math.round(stats.speedEfficiency * 100)}`,
    },
    { label: "Medyan ping", value: empty ? "–" : formatMs(stats.medianPing) },
    {
      label: "Memnuniyet",
      value:
        empty || stats.avgSatisfaction === null
          ? "–"
          : `${stats.avgSatisfaction.toFixed(1)} / 5`,
    },
    {
      label: "Stabilite",
      value:
        empty || stats.stabilityScore === null
          ? "–"
          : `%${Math.round(stats.stabilityScore * 100)}`,
    },
  ];

  return (
    <Card className="p-5">
      {scopeLabel ? (
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {scopeLabel}
        </p>
      ) : null}
      <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
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
