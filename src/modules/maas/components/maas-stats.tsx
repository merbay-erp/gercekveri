import { Card } from "@/components/ui/card";
import { formatTRY, formatNumber } from "@/lib/money";
import type { SalaryStats } from "../types";

interface Props {
  stats: SalaryStats;
  scopeLabel?: string;
}

export function MaasStats({ stats, scopeLabel }: Props) {
  const empty = stats.count === 0;
  const items: { label: string; value: string; emphasize?: boolean }[] = [
    { label: "Veri sayısı", value: formatNumber(stats.count) },
    { label: "Medyan", value: empty ? "–" : formatTRY(stats.median), emphasize: true },
    { label: "Ortalama", value: empty ? "–" : formatTRY(stats.avg) },
    { label: "Alt %25", value: empty ? "–" : formatTRY(stats.p25) },
    { label: "Üst %75", value: empty ? "–" : formatTRY(stats.p75) },
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
