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
import { FaturaList } from "@/modules/fatura/components/fatura-list";
import {
  listFaturaSubmissions,
  getFaturaStats,
  getFaturaUnitCostStats,
  topFaturaCitySlugs,
} from "@/modules/fatura/server/queries";
import {
  utilityTypes,
  utilityLabels,
  utilityUnits,
} from "@/modules/fatura/config";
import { findCityBySlug, featuredCitySlugs } from "@/lib/cities";
import { formatTRY, formatNumber } from "@/lib/money";
import { buildFaturaScope, getOrGenerateInsight } from "@/services/ai/insights";
import { getScopeTrustScore } from "@/lib/trust-score-server";
import { TrustScoreBadge } from "@/components/data-display/trust-score-badge";
import { db } from "@/lib/db";

const CURRENT_YEAR = new Date().getFullYear();

export const revalidate = 60;
export const dynamicParams = true;

type Params = Promise<{ citySlug: string }>;

export async function generateStaticParams() {
  const active = await topFaturaCitySlugs(20).catch(() => [] as string[]);
  const merged = Array.from(new Set([...active, ...featuredCitySlugs]));
  return merged.map((citySlug) => ({ citySlug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { citySlug } = await params;
  const city = findCityBySlug(citySlug);
  if (!city) return { title: "Bulunamadı" };
  return {
    title: `${city.name} Fatura Endeksi ${CURRENT_YEAR} — Anonim Gerçek Veri`,
    description: `${city.name}'da elektrik, doğalgaz ve su faturası tutarları. Anonim hane verisinden derlenmiş gerçek rakamlar.`,
    alternates: { canonical: `/fatura/sehir/${citySlug}` },
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

export default async function FaturaCityPage({ params }: { params: Params }) {
  const { citySlug } = await params;
  const city = findCityBySlug(citySlug);
  if (!city) notFound();

  const cityDb = await db.city
    .findUnique({ where: { slug: city.slug }, select: { id: true } })
    .catch(() => null);

  const [submissions, stats, trust] = await Promise.all([
    listFaturaSubmissions({ citySlug, limit: 50 }).catch(() => []),
    getFaturaStats({ citySlug }).catch(() => emptyStats),
    cityDb
      ? getScopeTrustScore({ type: "UTILITY", cityId: cityDb.id }).catch(() => null)
      : Promise.resolve(null),
  ]);

  const perUtility = await Promise.all(
    utilityTypes.map(async (u) => {
      const unit = await getFaturaUnitCostStats({ citySlug, utilityType: u }).catch(
        () => ({ count: 0, median: null, p25: null, p75: null }),
      );
      return { utility: u, unit };
    }),
  );

  const insight = await getOrGenerateInsight({
    scope: buildFaturaScope(undefined, citySlug),
    scopeLabel: `${city.name} — faturalar`,
    stats,
    nounSingular: "fatura",
    nounPlural: `${city.name} faturaları`,
  }).catch(() => null);

  const amounts = submissions.map((s) => s.amount);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/fatura"
        className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Tüm faturalar
      </Link>

      <div className="mt-4 mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <Badge variant="secondary" className="font-normal">
            {city.region}
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {city.name} Fatura Endeksi {CURRENT_YEAR}
          </h1>
          <p className="text-muted-foreground">
            {formatNumber(stats.count)} anonim paylaşımdan derlenmiş, {city.name} özelinde.
          </p>
        </div>
        <Link href="/fatura/yeni" className={buttonVariants()}>
          <Plus className="mr-1.5 h-4 w-4" /> Faturamı paylaş
        </Link>
      </div>

      <div className="space-y-8">
        {trust ? (
          <TrustScoreBadge score={trust} scopeLabel={`${city.name} · fatura verisi`} />
        ) : null}

        <div className="grid gap-3 sm:grid-cols-3">
          {perUtility.map(({ utility, unit }) => (
            <div key={utility} className="rounded-xl border bg-muted/20 p-4">
              <p className="text-sm font-medium">{utilityLabels[utility]}</p>
              {unit.median !== null ? (
                <p className="mt-1 text-sm text-muted-foreground tabular-nums">
                  medyan {formatTRY(unit.median)} / {utilityUnits[utility]}
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted-foreground">veri yok</p>
              )}
            </div>
          ))}
        </div>

        <AmountStatsPanel
          stats={stats}
          scopeLabel={`${city.name} · tüm fatura türleri`}
        />

        {insight ? <AmountAiInsight insight={insight} /> : null}

        {amounts.length >= 3 ? (
          <AmountHistogram
            amounts={amounts}
            scopeLabel={`${city.name} fatura dağılımı`}
            title="Fatura dağılımı"
            unitLabel="paylaşım"
          />
        ) : null}

        <AdSlot slotKey="fatura-city-mid" format="leaderboard" />
        <FaturaList submissions={submissions} />
      </div>
    </div>
  );
}
