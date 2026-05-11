import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdSlot } from "@/components/ad-slot";
import { SchemaOrg } from "@/components/schema-org";
import { positionCityBreadcrumb } from "@/lib/schema-presets";
import { MaasList } from "@/modules/maas/components/maas-list";
import { AmountStatsPanel } from "@/components/data-display/amount-stats";
import { AmountHistogram } from "@/components/data-display/amount-histogram";
import { AmountAiInsight } from "@/components/data-display/amount-ai-insight";
import { buildSalaryScope, getOrGenerateInsight } from "@/services/ai/insights";
import {
  getSalaryStats,
  listSalarySubmissions,
  topPositionSlugs,
  topCitySlugs,
} from "@/modules/maas/server/queries";
import { positionNameFromSlug } from "@/modules/maas/position-resolver";
import { findCityBySlug } from "@/lib/cities";
import { formatNumber } from "@/lib/money";

const RESERVED_POSITION_SLUGS = new Set(["yeni", "sehir"]);

export const revalidate = 60;
export const dynamicParams = true;

type Params = Promise<{ positionSlug: string; citySlug: string }>;

export async function generateStaticParams() {
  // Fan out only the strongest signals — top positions × top cities — so the
  // initial deploy doesn't try to prerender thousands of nearly-empty pages.
  const [positions, cities] = await Promise.all([
    topPositionSlugs(20).catch(() => [] as string[]),
    topCitySlugs(8).catch(() => [] as string[]),
  ]);
  const out: { positionSlug: string; citySlug: string }[] = [];
  for (const positionSlug of positions) {
    if (RESERVED_POSITION_SLUGS.has(positionSlug)) continue;
    for (const citySlug of cities) {
      out.push({ positionSlug, citySlug });
    }
  }
  return out;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { positionSlug, citySlug } = await params;
  const positionName = positionNameFromSlug(positionSlug);
  const cityRecord = findCityBySlug(citySlug);
  if (!cityRecord) return { title: "Bulunamadı" };
  return {
    title: `${cityRecord.name}'da ${positionName} Maaşları`,
    description: `${cityRecord.name} şehrinde ${positionName} pozisyonu için anonim olarak paylaşılmış gerçek net maaşlar.`,
    alternates: { canonical: `/maaslar/${positionSlug}/${citySlug}` },
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

export default async function PositionCityPage({ params }: { params: Params }) {
  const { positionSlug, citySlug } = await params;
  if (RESERVED_POSITION_SLUGS.has(positionSlug)) notFound();
  const cityRecord = findCityBySlug(citySlug);
  if (!cityRecord) notFound();

  const positionName = positionNameFromSlug(positionSlug);

  const [submissions, stats, citywideStats] = await Promise.all([
    listSalarySubmissions({ positionSlug, citySlug, limit: 50 }).catch(() => []),
    getSalaryStats({ positionSlug, citySlug }).catch(() => emptyStats),
    getSalaryStats({ citySlug }).catch(() => emptyStats),
  ]);

  const insight = await getOrGenerateInsight({
    scope: buildSalaryScope(positionSlug, citySlug),
    scopeLabel: `${cityRecord.name} — ${positionName}`,
    stats,
    nounSingular: "maaş",
    nounPlural: "maaşlar",
  }).catch(() => null);

  const amounts = submissions.map((s) => s.amount);

  return (
    <div className="container mx-auto px-4 py-12">
      <SchemaOrg
        data={positionCityBreadcrumb({
          positionName,
          positionSlug,
          cityName: cityRecord.name,
          citySlug,
        })}
      />
      <Link
        href={`/maaslar/${positionSlug}`}
        className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> {positionName} (Türkiye geneli)
      </Link>

      <div className="mt-4 mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <Badge variant="secondary" className="font-normal">
            {cityRecord.name}
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {cityRecord.name}'da {positionName} Maaşları
          </h1>
          <p className="text-muted-foreground">
            {formatNumber(stats.count)} anonim paylaşımdan derlenmiş gerçek aralıklar.
          </p>
        </div>
        <Link href="/maaslar/yeni" className={buttonVariants()}>
          <Plus className="mr-1.5 h-4 w-4" /> Maaşımı paylaş
        </Link>
      </div>

      <div className="space-y-8">
        <AmountStatsPanel stats={stats} scopeLabel={`${positionName} · ${cityRecord.name}`} />

        {insight ? <AmountAiInsight insight={insight} /> : null}

        {amounts.length >= 3 ? (
          <AmountHistogram
            amounts={amounts}
            scopeLabel={`${cityRecord.name} ${positionName} dağılımı`}
            title="Maaş dağılımı"
            unitLabel="kişi"
          />
        ) : null}

        <AdSlot slotKey="position-city-mid" format="leaderboard" />

        <div className="flex flex-wrap gap-2 text-sm">
          <Link
            href={`/maaslar/sehir/${citySlug}`}
            className="rounded-full border bg-background px-3 py-1 transition hover:bg-muted"
          >
            {cityRecord.name} (tüm pozisyonlar)
            {citywideStats.count > 0 ? (
              <span className="ml-2 text-xs text-muted-foreground">
                {formatNumber(citywideStats.count)}
              </span>
            ) : null}
          </Link>
          <Link
            href={`/maaslar/${positionSlug}`}
            className="rounded-full border bg-background px-3 py-1 transition hover:bg-muted"
          >
            {positionName} (Türkiye geneli)
          </Link>
        </div>

        <div>
          <h2 className="mb-3 text-lg font-medium">Son paylaşımlar</h2>
          <MaasList submissions={submissions} />
        </div>
      </div>
    </div>
  );
}
