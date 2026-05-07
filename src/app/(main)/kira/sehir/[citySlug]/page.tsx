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
import { KiraList } from "@/modules/kira/components/kira-list";
import { RentInflationPanel } from "@/modules/kira/components/rent-inflation-panel";
import {
  listRentSubmissions,
  getRentStats,
  getRentInflationStats,
  topRentCitySlugs,
} from "@/modules/kira/server/queries";
import { findCityBySlug, featuredCitySlugs } from "@/lib/cities";
import { formatNumber } from "@/lib/money";
import { buildRentScope, getOrGenerateInsight } from "@/services/ai/insights";
import { getScopeTrustScore } from "@/lib/trust-score-server";
import { TrustScoreBadge } from "@/components/data-display/trust-score-badge";
import { db } from "@/lib/db";

export const revalidate = 60;
export const dynamicParams = true;

type Params = Promise<{ citySlug: string }>;

export async function generateStaticParams() {
  const active = await topRentCitySlugs(20).catch(() => [] as string[]);
  const merged = Array.from(new Set([...active, ...featuredCitySlugs]));
  return merged.map((citySlug) => ({ citySlug }));
}

const CURRENT_YEAR = new Date().getFullYear();

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { citySlug } = await params;
  const cityRecord = findCityBySlug(citySlug);
  if (!cityRecord) return { title: "Bulunamadı" };
  return {
    title: `${cityRecord.name} Kira Endeksi ${CURRENT_YEAR} — Anonim Gerçek Veri`,
    description: `${cityRecord.name} kira endeksi: emlakçı ilanlarına değil, gerçek kiracılara dayalı medyan, ortalama, ilan-gerçek şişkinliği. m², oda sayısı ve bina yaşı kırılımıyla.`,
    alternates: { canonical: `/kira/sehir/${citySlug}` },
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

export default async function KiraCityPage({ params }: { params: Params }) {
  const { citySlug } = await params;
  const cityRecord = findCityBySlug(citySlug);
  if (!cityRecord) notFound();

  const cityDb = await db.city
    .findUnique({ where: { slug: cityRecord.slug }, select: { id: true } })
    .catch(() => null);

  const [submissions, stats, inflation, trust] = await Promise.all([
    listRentSubmissions({ citySlug, limit: 50 }).catch(() => []),
    getRentStats({ citySlug }).catch(() => emptyStats),
    getRentInflationStats({ citySlug }).catch(() => ({
      pairCount: 0,
      realMedian: null,
      listedMedian: null,
      inflationPct: null,
    })),
    cityDb
      ? getScopeTrustScore({ type: "RENT", cityId: cityDb.id }).catch(() => null)
      : Promise.resolve(null),
  ]);

  const insight = await getOrGenerateInsight({
    scope: buildRentScope(citySlug),
    scopeLabel: `${cityRecord.name} — kira ilanları`,
    stats,
    nounSingular: "kira",
    nounPlural: "kira ilanları",
  }).catch(() => null);

  const amounts = submissions.map((s) => s.amount);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/kira"
        className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Tüm kiralar
      </Link>

      <div className="mt-4 mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <Badge variant="secondary" className="font-normal">
            {cityRecord.region}
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {cityRecord.name} Kira Endeksi {CURRENT_YEAR}
          </h1>
          <p className="text-muted-foreground">
            {formatNumber(stats.count)} anonim kiracı paylaşımından derlenmiş gerçek
            aralıklar — emlakçı ilanlarından değil, ödeyenlerden.
          </p>
          {trust ? (
            <div className="pt-1">
              <TrustScoreBadge
                score={trust}
                scopeLabel={`${cityRecord.name} kira verisi`}
                variant="pill"
              />
            </div>
          ) : null}
        </div>
        <Link href="/kira/yeni" className={buttonVariants()}>
          <Plus className="mr-1.5 h-4 w-4" /> Kira ilanımı paylaş
        </Link>
      </div>

      <div className="space-y-8">
        {trust ? (
          <TrustScoreBadge
            score={trust}
            scopeLabel={`${cityRecord.name} · kira verisi`}
          />
        ) : null}

        <RentInflationPanel
          stats={inflation}
          scopeLabel={cityRecord.name}
          shareHref="/kira/sisme"
        />

        <AmountStatsPanel stats={stats} scopeLabel={`${cityRecord.name} · tüm tipler`} />

        {insight ? <AmountAiInsight insight={insight} /> : null}

        {amounts.length >= 3 ? (
          <AmountHistogram
            amounts={amounts}
            scopeLabel={`${cityRecord.name} kira dağılımı`}
            title="Kira dağılımı"
            unitLabel="ilan"
          />
        ) : null}

        <AdSlot slotKey="kira-city-mid" format="leaderboard" />
        <KiraList submissions={submissions} />
      </div>
    </div>
  );
}
