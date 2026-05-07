"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  data: Array<{ date: string; count: number }>;
}

export function DailySubmissionsChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.18} />
        <XAxis
          dataKey="date"
          fontSize={11}
          tickFormatter={(s: string) => s.slice(5)}
          tickMargin={6}
          stroke="currentColor"
          opacity={0.6}
        />
        <YAxis
          fontSize={11}
          allowDecimals={false}
          stroke="currentColor"
          opacity={0.6}
          width={28}
        />
        <Tooltip
          formatter={(v) => [`${v} paylaşım`, "Adet"]}
          labelFormatter={(l) => l}
          contentStyle={{
            background: "var(--background)",
            border: "1px solid var(--border)",
            borderRadius: "0.5rem",
            fontSize: "12px",
          }}
        />
        <Bar dataKey="count" fill="currentColor" opacity={0.85} radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
