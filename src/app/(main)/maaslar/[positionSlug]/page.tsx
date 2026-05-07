import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AdSlot } from "@/components/ad-slot";
import { MaasList } from "@/modules/maas/components/maas-list";
import { AmountStatsPanel } from "@/components/data-display/amount-stats";
import { AmountHistogram } from "@/components/data-display/amount-histogram";
import { AmountAiInsight } from "@/components/data-display/amount-ai-insight";
import { buildSalaryScope, getOrGenerateInsight } from "@/services/ai/insights";
import {
  getRelatedPositions,
  getSalaryStats,
  listSalarySubmissions,
  topPositionSlugs,
} from "@/modules/maas/server/queries";
import {
  curatedPositionSlugs,
  positionNameFromSlug,
} from "@/modules/maas/position-resolver";
import { topCitySlugs } from "@/modules/maas/server/queries";
import { findCityBySlug } from "@/lib/cities";
import { formatNumber } from "@/lib/money";

const RESERVED_SLUGS = new Set(["yeni", "sehir"]);

export const revalidate = 60;
export const dynamicParams = true;

type Params = Promise<{ positionSlug: string }>;

export async function generateStaticParams() {
  // Combine top *active* position slugs with curated list — guarantees an
  // SEO surface even before any submission for that position arrives.
  const active = await topPositionSlugs(50).catch(() => [] as string[]);
  const seed = curatedPositionSlugs.slice(0, 30);
  const merged = Array.from(new Set([...active, ...seed])).filter(
    (s) => !RESERVED_SLUGS.has(s),
  );
  return merged.map((positionSlug) => ({ positionSlug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { positionSlug } = await params;
  const name = positionNameFromSlug(positionSlug);
  return {
    title: `${name} Maaşları — Türkiye`,
    description: `${name} pozisyonu için Türkiye'deki gerçek net maaşlar. Anonim kullanıcı verisiyle medyan, ortalama ve aralık.`,
    alternates: { canonical: `/maaslar/${positionSlug}` },
  };
}

const emptyStats = {
  count: 0,
  avg: null,
  median: null,
  p25: null,
  p75: null,
  min: null,
  max: null,
};

export default async function PositionPage({ params }: { params: Params }) {
  const { positionSlug } = await params;
  if (RESERVED_SLUGS.has(positionSlug)) notFound();

  const positionName = positionNameFromSlug(positionSlug);

  const [submissions, stats] = await Promise.all([
    listSalarySubmissions({ positionSlug, limit: 50 }).catch(() => []),
    getSalaryStats({ positionSlug }).catch(() => emptyStats),
  ]);

  const insight = await getOrGenerateInsight({
    scope: buildSalaryScope(positionSlug),
    scopeLabel: `${positionName} — Türkiye geneli`,
    stats,
    nounSingular: "maaş",
    nounPlural: "maaşlar",
  }).catch(() => null);

  const amounts = submissions.map((s) => s.amount);

  const cityCounts = new Map<string, { name: string; count: number }>();
  for (const s of submissions) {
    if (!s.cityName || !s.data.citySlug) continue;
    const entry = cityCounts.get(s.data.citySlug);
    if (entry) entry.count += 1;
    else cityCounts.set(s.data.citySlug, { name: s.cityName, count: 1 });
  }
  const topCities = Array.from(cityCounts.entries())
    .map(([slug, { name, count }]) => ({ slug, name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/maaslar"
        className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Tüm maaşlar
      </Link>

      <div className="mt-4 mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <Badge variant="secondary" className="font-normal">
            Türkiye geneli
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {positionName} Maaşları
          </h1>
          <p className="text-muted-foreground">
            {formatNumber(stats.count)} anonim kullanıcı verisinden derlenmiş gerçek
            aralıklar — {positionName} pozisyonu için.
          </p>
        </div>
        <Link href="/maaslar/yeni" className={buttonVariants()}>
          <Plus className="mr-1.5 h-4 w-4" /> Maaşımı paylaş
        </Link>
      </div>

      <div className="space-y-8">
        <AmountStatsPanel stats={stats} scopeLabel={`${positionName} · Türkiye geneli`} />

        {insight ? <AmountAiInsight insight={insight} /> : null}

        {amounts.length >= 3 ? (
          <AmountHistogram
            amounts={amounts}
            scopeLabel={`${positionName} maaş aralığı dağılımı`}
            title="Maaş dağılımı"
            unitLabel="kişi"
          />
        ) : null}

        <AdSlot slotKey="position-page-mid" format="leaderboard" />

        {topCities.length > 0 ? (
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Şehre göre kır
            </h2>
            <div className="flex flex-wrap gap-2">
              {topCities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/maaslar/${positionSlug}/${city.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm transition hover:border-foreground/30 hover:bg-muted"
                >
                  {city.name}
                  <span className="text-xs text-muted-foreground">{city.count}</span>
                </Link>
              ))}
            </div>
          </Card>
        ) : null}

        <div>
          <h2 className="mb-3 text-lg font-medium">Son paylaşımlar</h2>
          <MaasList submissions={submissions} />
        </div>
      </div>
    </div>
  );
}
