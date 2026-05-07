"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import { formatCompact, formatTRY } from "@/lib/money";

interface Props {
  amounts: number[];
  scopeLabel?: string;
  /** Default: "Dağılım" */
  title?: string;
  /** Default: "kayıt" — singular noun used in tooltip ("12 kayıt") */
  unitLabel?: string;
}

interface Bin {
  label: string;
  midpoint: number;
  count: number;
}

function buildBins(amounts: number[]): Bin[] {
  if (amounts.length === 0) return [];

  const sorted = [...amounts].sort((a, b) => a - b);
  // Drop extreme tails (top/bottom 1%) so the histogram isn't dominated by
  // a single outlier — keeps the bars readable at small data sizes.
  const trimmed =
    sorted.length >= 50
      ? sorted.slice(Math.floor(sorted.length * 0.01), Math.ceil(sorted.length * 0.99))
      : sorted;

  const min = trimmed[0];
  const max = trimmed[trimmed.length - 1];
  const range = Math.max(max - min, 1);
  const targetBins = Math.min(12, Math.max(5, Math.ceil(Math.sqrt(trimmed.length))));

  const rawWidth = range / targetBins;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawWidth)));
  const niceWidth = Math.ceil(rawWidth / magnitude) * magnitude;

  const startEdge = Math.floor(min / niceWidth) * niceWidth;
  const bins: Bin[] = [];
  for (let edge = startEdge; edge < max + niceWidth; edge += niceWidth) {
    bins.push({
      label: formatCompact(edge),
      midpoint: edge + niceWidth / 2,
      count: 0,
    });
  }

  for (const value of amounts) {
    const idx = Math.min(Math.floor((value - startEdge) / niceWidth), bins.length - 1);
    if (idx >= 0) bins[idx].count += 1;
  }

  return bins;
}

/**
 * Generic histogram for monetary amounts. Bin width is computed from a "nice
 * number" rounded to the leading magnitude so axis labels read cleanly even
 * on small samples. Module-specific copy (e.g. "Maaş dağılımı") is passed in
 * via the `title` and `unitLabel` props so the same chart can render salary,
 * rent, utility, etc. without forking.
 */
export function AmountHistogram({
  amounts,
  scopeLabel,
  title = "Dağılım",
  unitLabel = "kayıt",
}: Props) {
  const bins = React.useMemo(() => buildBins(amounts), [amounts]);

  if (bins.length < 3) {
    return null;
  }

  return (
    <Card className="p-5">
      {scopeLabel ? (
        <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {scopeLabel}
        </p>
      ) : null}
      <h3 className="mb-4 text-sm font-medium">{title}</h3>
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bins} margin={{ top: 8, right: 12, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)" }}
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                fontSize: 12,
                color: "var(--foreground)",
              }}
              formatter={(value) =>
                [`${String(value)} ${unitLabel}`, "Veri sayısı"] as [string, string]
              }
              labelFormatter={(_label: unknown, payload: ReadonlyArray<{ payload?: Bin }>) => {
                const bin = payload?.[0]?.payload;
                return bin ? `~${formatTRY(bin.midpoint)}` : "";
              }}
            />
            <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
