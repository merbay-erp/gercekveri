"use client";

import { useId } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface SeriesHistoryChartProps {
  data: Array<{ date: string; value: number }>;
  unit?: string;
  decimals?: number;
  color?: string;
  height?: number;
}

export function SeriesHistoryChart({
  data,
  unit = "",
  decimals = 4,
  color = "#38bdae",
  height = 280,
}: SeriesHistoryChartProps) {
  const gradientId = useId();

  if (data.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
        Henüz geçmiş veri yok
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.6} />
              <stop offset="100%" stopColor={color} stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
            tickFormatter={(d: string) => {
              // EVDS "2026-04-15" → "Nis"
              const parts = d.split("-");
              if (parts.length === 3) {
                const months = [
                  "Oca","Şub","Mar","Nis","May","Haz",
                  "Tem","Ağu","Eyl","Eki","Kas","Ara",
                ];
                return months[parseInt(parts[1], 10) - 1] ?? d;
              }
              return d;
            }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
            tickFormatter={(v: number) => v.toFixed(decimals > 2 ? 2 : decimals)}
            width={50}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 15, 20, 0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 8,
              fontSize: 12,
              color: "#fff",
            }}
            formatter={(value) => {
              const n = typeof value === "number" ? value : Number(value);
              return [`${n.toFixed(decimals)} ${unit}`.trim(), "Değer"];
            }}
            labelFormatter={(label) => `Tarih: ${String(label)}`}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
