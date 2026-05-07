import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdSlot } from "@/components/ad-slot";
import { AmountAiInsight } from "@/components/data-display/amount-ai-insight";
import { InternetList } from "@/modules/internet/components/internet-list";
import { InternetStatsPanel } from "@/modules/internet/components/internet-stats-panel";
import { InternetIspTable } from "@/modules/internet/components/internet-isp-table";
import {
  listInternetSubmissions,
  getInternetStats,
  getIspRollups,
  topInternetCitySlugs,
} from "@/modules/internet/server/queries";
import { findCityBySlug, featuredCitySlugs } from "@/lib/cities";
import { formatNumber } from "@/lib/money";
import { formatMbps } from "@/modules/internet/config";
import { buildInternetScope, getOrGenerateInsight } from "@/services/ai/insights";

export const revalidate = 60;
export const dynamicParams = true;

type Params = Promise<{ citySlug: string }>;

export async function generateStaticParams() {
  const active = await topInternetCitySlugs(20).catch(() => [] as string[]);
  const merged = Array.from(new Set([...active, ...featuredCitySlugs]));
  return merged.map((citySlug) => ({ citySlug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { citySlug } = await params;
  const city = findCityBySlug(citySlug);
  if (!city) return { title: "Bulunamadı" };
  return {
    title: `${city.name} İnternet Hızı & Sağlayıcılar`,
    description: `${city.name} şehrinde anonim kullanıcılardan derlenmiş gerçek internet hız, ping ve memnuniyet verisi. ISP karşılaştırması.`,
    alternates: { canonical: `/internet/sehir/${citySlug}` },
  };
}

const emptyMultiStats = {
  count: 0,
  medianRealSpeed: null,
  avgRealSpeed: null,
  medianPackageSpeed: null,
  speedEfficiency: null,
  medianPing: null,
  avgSatisfaction: null,
  stabilityScore: null,
};

export default async function InternetCityPage({ params }: { params: Params }) {
  const { citySlug } = await params;
  const city = findCityBySlug(citySlug);
  if (!city) notFound();

  const [submissions, stats, ispRollups] = await Promise.all([
    listInternetSubmissions({ citySlug, limit: 50 }).catch(() => []),
    getInternetStats({ citySlug }).catch(() => emptyMultiStats),
    getIspRollups(citySlug).catch(() => []),
  ]);

  const insight = await getOrGenerateInsight({
    scope: buildInternetScope(undefined, citySlug),
    scopeLabel: `${city.name} — internet ölçümleri`,
    stats: {
      count: stats.count,
      avg: stats.avgRealSpeed,
      median: stats.medianRealSpeed,
      p25: stats.medianRealSpeed ? Math.round(stats.medianRealSpeed * 0.7) : null,
      p75: stats.medianRealSpeed ? Math.round(stats.medianRealSpeed * 1.3) : null,
      min: stats.medianRealSpeed ? Math.max(1, Math.round(stats.medianRealSpeed * 0.3)) : null,
      max: stats.medianRealSpeed ? Math.round(stats.medianRealSpeed * 2.5) : null,
    },
    nounSingular: "internet hızı",
    nounPlural: `${city.name} internet hız ölçümleri (Mbps cinsinden)`,
    formatValue: (n) => formatMbps(n),
  }).catch(() => null);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/internet"
        className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Tüm sağlayıcılar
      </Link>

      <div className="mt-4 mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <Badge variant="secondary" className="font-normal">
            {city.region}
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {city.name} İnternet Hızı
          </h1>
          <p className="text-muted-foreground">
            {formatNumber(stats.count)} anonim ölçümden derlenmiş, {city.name} özelinde.
          </p>
        </div>
        <Link href="/internet/yeni" className={buttonVariants()}>
          <Plus className="mr-1.5 h-4 w-4" /> Ölçümümü paylaş
        </Link>
      </div>

      <div className="space-y-8">
        <InternetStatsPanel stats={stats} scopeLabel={`${city.name} · tüm sağlayıcılar`} />
        <InternetIspTable rollups={ispRollups} citySlug={citySlug} />

        {insight ? <AmountAiInsight insight={insight} /> : null}

        <AdSlot slotKey="internet-city-mid" format="leaderboard" />
        <InternetList submissions={submissions} />
      </div>
    </div>
  );
}
