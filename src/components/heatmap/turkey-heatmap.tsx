"use client";

import * as React from "react";
import Link from "next/link";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

import { cn } from "@/lib/utils";
import type { CityMedian, HeatmapCategory } from "@/lib/city-medians";

interface CategoryConfig {
  label: string;
  href: (slug: string) => string;
  formatValue: (n: number) => string;
  /** Inverse coloring — lower is better (e.g. rent, fatura, aidat) */
  invert?: boolean;
  /** Custom palette stops — defaults to red gradient */
  palette?: { from: string; to: string };
}

const CATEGORY_CONFIG: Record<HeatmapCategory, CategoryConfig> = {
  SALARY: {
    label: "Maaş medyanı",
    href: (slug) => `/maaslar/sehir/${slug}`,
    formatValue: (n) => `₺${n.toLocaleString("tr-TR")}`,
    palette: { from: "#dcfce7", to: "#15803d" }, // emerald — high is good
  },
  RENT: {
    label: "Kira medyanı",
    href: (slug) => `/kira/sehir/${slug}`,
    formatValue: (n) => `₺${n.toLocaleString("tr-TR")}`,
    invert: true,
    palette: { from: "#fee2e2", to: "#b91c1c" }, // rose — high is expensive
  },
  AIDAT: {
    label: "Aidat medyanı",
    href: (slug) => `/aidat/sehir/${slug}`,
    formatValue: (n) => `₺${n.toLocaleString("tr-TR")}`,
    invert: true,
    palette: { from: "#fef3c7", to: "#b45309" },
  },
  INTERNET: {
    label: "Gerçek hız (Mbps) medyanı",
    href: (slug) => `/internet/sehir/${slug}`,
    formatValue: (n) => `${n.toLocaleString("tr-TR")} Mbps`,
    palette: { from: "#dbeafe", to: "#1d4ed8" }, // higher = better
  },
  UTILITY: {
    label: "Fatura medyanı",
    href: (slug) => `/fatura/sehir/${slug}`,
    formatValue: (n) => `₺${n.toLocaleString("tr-TR")}`,
    invert: true,
    palette: { from: "#fee2e2", to: "#b91c1c" },
  },
  TEXTILE: {
    label: "Tekstil fiyat medyanı",
    href: (slug) => `/tekstil/sehir/${slug}`,
    formatValue: (n) => `₺${n.toLocaleString("tr-TR")}`,
    palette: { from: "#fae8ff", to: "#86198f" },
  },
};

interface Props {
  /** Per-category city medians, all in one prop so user can toggle locally */
  byCategory: Record<HeatmapCategory, CityMedian[]>;
  /** Initial active category */
  defaultCategory?: HeatmapCategory;
  /** Whether to show the category tab strip — set false when embedding in
   *  a page that already provides its own picker. */
  showCategoryTabs?: boolean;
}

const CATEGORIES_IN_ORDER: HeatmapCategory[] = [
  "RENT",
  "SALARY",
  "AIDAT",
  "INTERNET",
  "UTILITY",
  "TEXTILE",
];

const NO_DATA_FILL = "#e5e7eb"; // neutral gray (light)
const NO_DATA_FILL_DARK = "#262626";

/** Linear interpolation between two hex colors. t ∈ [0, 1]. */
function interpolateHex(a: string, b: string, t: number): string {
  const ar = parseInt(a.slice(1, 3), 16);
  const ag = parseInt(a.slice(3, 5), 16);
  const ab = parseInt(a.slice(5, 7), 16);
  const br = parseInt(b.slice(1, 3), 16);
  const bg = parseInt(b.slice(3, 5), 16);
  const bb = parseInt(b.slice(5, 7), 16);
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bl = Math.round(ab + (bb - ab) * t);
  return `#${[r, g, bl].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
}

export function TurkeyHeatmap({
  byCategory,
  defaultCategory = "RENT",
  showCategoryTabs = true,
}: Props) {
  const [category, setCategory] = React.useState<HeatmapCategory>(defaultCategory);
  const [hovered, setHovered] = React.useState<{
    plate: number;
    name: string;
    median: number | null;
    count: number;
    slug: string;
    x: number;
    y: number;
  } | null>(null);

  const cfg = CATEGORY_CONFIG[category];
  const data = byCategory[category] ?? [];

  // Lookup tables for hot path
  const dataByPlate = React.useMemo(() => {
    const m = new Map<number, CityMedian>();
    for (const d of data) m.set(d.plate, d);
    return m;
  }, [data]);

  // Compute domain (min/max of medians) for color scaling
  const domain = React.useMemo(() => {
    const values = data.map((d) => d.median).filter((v): v is number => v !== null);
    if (values.length === 0) return null;
    const min = Math.min(...values);
    const max = Math.max(...values);
    return { min, max };
  }, [data]);

  const fillFor = (plate: number): string => {
    const row = dataByPlate.get(plate);
    if (!row || row.median === null || !domain || domain.max === domain.min) {
      return NO_DATA_FILL;
    }
    const tRaw = (row.median - domain.min) / (domain.max - domain.min);
    const t = cfg.invert ? tRaw : tRaw;
    return interpolateHex(cfg.palette!.from, cfg.palette!.to, t);
  };

  const dataCount = data.filter((d) => d.median !== null).length;

  return (
    <div className="space-y-4">
      {showCategoryTabs ? (
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES_IN_ORDER.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                category === cat
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
              )}
            >
              {CATEGORY_CONFIG[cat].label}
            </button>
          ))}
        </div>
      ) : null}

      <div className="relative overflow-hidden rounded-xl border bg-card dark:bg-muted/20">
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            center: [35.5, 39],
            scale: 2300,
          }}
          width={800}
          height={400}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography="/data/tr-cities.geo.json">
            {({ geographies }) =>
              geographies.map((geo) => {
                const plate = geo.properties.number as number | undefined;
                const row = plate !== undefined ? dataByPlate.get(plate) : undefined;
                const fill = plate !== undefined ? fillFor(plate) : NO_DATA_FILL;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#fafafa"
                    strokeWidth={0.5}
                    onMouseEnter={(e) => {
                      if (!row) return;
                      const rect = (
                        e.currentTarget.ownerSVGElement?.getBoundingClientRect() ?? {
                          left: 0,
                          top: 0,
                        }
                      ) as DOMRect;
                      setHovered({
                        plate: row.plate,
                        name: row.name,
                        median: row.median,
                        count: row.count,
                        slug: row.slug,
                        x: e.clientX - rect.left,
                        y: e.clientY - rect.top,
                      });
                    }}
                    onMouseMove={(e) => {
                      const rect = (
                        e.currentTarget.ownerSVGElement?.getBoundingClientRect() ?? {
                          left: 0,
                          top: 0,
                        }
                      ) as DOMRect;
                      setHovered((prev) =>
                        prev
                          ? {
                              ...prev,
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top,
                            }
                          : prev,
                      );
                    }}
                    onMouseLeave={() => setHovered(null)}
                    style={{
                      default: { outline: "none", transition: "fill 200ms" },
                      hover: { outline: "none", fill, opacity: 0.85, cursor: "pointer" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {hovered ? (
          <div
            className="pointer-events-none absolute z-10 max-w-[220px] rounded-md border bg-popover/95 px-3 py-2 text-xs shadow-lg backdrop-blur"
            style={{
              left: Math.min(hovered.x + 12, 600),
              top: Math.max(hovered.y - 60, 8),
            }}
          >
            <p className="font-semibold">{hovered.name}</p>
            {hovered.median !== null ? (
              <>
                <p className="mt-0.5 text-muted-foreground">
                  {cfg.label}: <span className="font-medium text-foreground">{cfg.formatValue(hovered.median)}</span>
                </p>
                <p className="text-muted-foreground">{hovered.count} paylaşım</p>
              </>
            ) : (
              <p className="mt-0.5 text-muted-foreground">
                {hovered.count > 0
                  ? `${hovered.count} paylaşım — yetersiz`
                  : "Henüz veri yok"}
              </p>
            )}
          </div>
        ) : null}
      </div>

      {/* Legend */}
      {domain ? (
        <div className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Düşük</span>
              <div className="flex h-3 w-32 overflow-hidden rounded">
                {Array.from({ length: 12 }, (_, i) => (
                  <div
                    key={i}
                    className="flex-1"
                    style={{
                      background: interpolateHex(
                        cfg.palette!.from,
                        cfg.palette!.to,
                        i / 11,
                      ),
                    }}
                  />
                ))}
              </div>
              <span>Yüksek</span>
            </div>
            {dataCount > 0 ? (
              <span className="text-[11px] text-muted-foreground">
                {dataCount} şehirde veri var
              </span>
            ) : null}
          </div>

          {hovered && hovered.median !== null ? (
            <Link
              href={cfg.href(hovered.slug)}
              className="inline-flex items-center gap-1 text-xs font-medium hover:underline"
            >
              {hovered.name} detayına git →
            </Link>
          ) : null}
        </div>
      ) : (
        <p className="text-center text-xs text-muted-foreground">
          Bu kategoride henüz harita çizecek kadar veri yok.
        </p>
      )}
    </div>
  );
}
