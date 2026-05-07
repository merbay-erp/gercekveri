import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdSlot } from "@/components/ad-slot";
import { AmountStatsPanel } from "@/components/data-display/amount-stats";
import { AmountHistogram } from "@/components/data-display/amount-histogram";
import { AmountAiInsight } from "@/components/data-display/amount-ai-insight";
import { AidatList } from "@/modules/aidat/components/aidat-list";
import {
  listAidatSubmissions,
  getAidatStats,
  topAidatCitySlugs,
} from "@/modules/aidat/server/queries";
import { findCityBySlug, featuredCitySlugs } from "@/lib/cities";
import { formatNumber } from "@/lib/money";
import { buildAidatScope, getOrGenerateInsight } from "@/services/ai/insights";

export const revalidate = 60;
export const dynamicParams = true;

type Params = Promise<{ citySlug: string }>;

export async function generateStaticParams() {
  const active = await topAidatCitySlugs(20).catch(() => [] as string[]);
  const merged = Array.from(new Set([...active, ...featuredCitySlugs]));
  return merged.map((citySlug) => ({ citySlug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { citySlug } = await params;
  const city = findCityBySlug(citySlug);
  if (!city) return { title: "Bulunamadı" };
  return {
    title: `${city.name} Aidatları — Anonim, Gerçek Veri`,
    description: `${city.name} şehrinde apartman ve site aidatları. Anonim kullanıcı verisinden derlenmiş gerçek tutarlar.`,
    alternates: { canonical: `/aidat/sehir/${citySlug}` },
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

export default async function AidatCityPage({ params }: { params: Params }) {
  const { citySlug } = await params;
  const city = findCityBySlug(citySlug);
  if (!city) notFound();

  const [submissions, stats] = await Promise.all([
    listAidatSubmissions({ citySlug, limit: 50 }).catch(() => []),
    getAidatStats({ citySlug }).catch(() => emptyStats),
  ]);

  const insight = await getOrGenerateInsight({
    scope: buildAidatScope(citySlug),
    scopeLabel: `${city.name} — site aidatları`,
    stats,
    nounSingular: "aidat",
    nounPlural: `${city.name} aidatları`,
  }).catch(() => null);

  const amounts = submissions.map((s) => s.amount);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/aidat"
        className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Tüm aidatlar
      </Link>

      <div className="mt-4 mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <Badge variant="secondary" className="font-normal">
            {city.region}
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {city.name} Aidatları
          </h1>
          <p className="text-muted-foreground">
            {formatNumber(stats.count)} anonim paylaşımdan derlenmiş, {city.name} özelinde.
          </p>
        </div>
        <Link href="/aidat/yeni" className={buttonVariants()}>
          <Plus className="mr-1.5 h-4 w-4" /> Aidatımı paylaş
        </Link>
      </div>

      <div className="space-y-8">
        <AmountStatsPanel stats={stats} scopeLabel={`${city.name} · tüm tipler`} />

        {insight ? <AmountAiInsight insight={insight} /> : null}

        {amounts.length >= 3 ? (
          <AmountHistogram
            amounts={amounts}
            scopeLabel={`${city.name} aidat dağılımı`}
            title="Aidat dağılımı"
            unitLabel="paylaşım"
          />
        ) : null}

        <AdSlot slotKey="aidat-city-mid" format="leaderboard" />
        <AidatList submissions={submissions} />
      </div>
    </div>
  );
}
