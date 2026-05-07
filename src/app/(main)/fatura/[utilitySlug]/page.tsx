import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { AdSlot } from "@/components/ad-slot";
import { AmountStatsPanel } from "@/components/data-display/amount-stats";
import { AmountHistogram } from "@/components/data-display/amount-histogram";
import { AmountAiInsight } from "@/components/data-display/amount-ai-insight";
import { FaturaList } from "@/modules/fatura/components/fatura-list";
import {
  listFaturaSubmissions,
  getFaturaStats,
  getFaturaUnitCostStats,
} from "@/modules/fatura/server/queries";
import {
  utilityFromSlug,
  utilityLabels,
  utilityPluralLabels,
  utilityUnits,
  utilitySlugs,
  utilityTypes,
} from "@/modules/fatura/config";
import { formatTRY } from "@/lib/money";
import { formatNumber } from "@/lib/money";
import { buildFaturaScope, getOrGenerateInsight } from "@/services/ai/insights";
import { OfficialVsRealPanel } from "@/components/data-display/official-vs-real-panel";
import { findOfficialReferenceFromDb } from "@/lib/official-server";

export const revalidate = 60;
export const dynamicParams = false;

type Params = Promise<{ utilitySlug: string }>;

export async function generateStaticParams() {
  return utilityTypes.map((u) => ({ utilitySlug: utilitySlugs[u] }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { utilitySlug } = await params;
  const utility = utilityFromSlug[utilitySlug];
  if (!utility) return { title: "Bulunamadı" };
  const label = utilityLabels[utility];
  return {
    title: `${label} Faturaları — Türkiye Geneli, Anonim Gerçek Veri`,
    description: `Türkiye'de ${label.toLowerCase()} faturası tutarları ve birim maliyetler. Anonim hane verisinden derlenmiş gerçek rakamlar.`,
    alternates: { canonical: `/fatura/${utilitySlug}` },
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

export default async function FaturaUtilityPage({ params }: { params: Params }) {
  const { utilitySlug } = await params;
  const utility = utilityFromSlug[utilitySlug];
  if (!utility) notFound();

  const label = utilityLabels[utility];
  const unitName = utilityUnits[utility];

  const [submissions, stats, unitStats, official] = await Promise.all([
    listFaturaSubmissions({ utilityType: utility, limit: 50 }).catch(() => []),
    getFaturaStats({ utilityType: utility }).catch(() => emptyStats),
    getFaturaUnitCostStats({ utilityType: utility }).catch(() => ({
      count: 0,
      median: null,
      p25: null,
      p75: null,
    })),
    findOfficialReferenceFromDb({ type: "UTILITY", utilityType: utility }).catch(
      () => null,
    ),
  ]);

  const insight = await getOrGenerateInsight({
    scope: buildFaturaScope(utilitySlug),
    scopeLabel: `Türkiye geneli — ${label.toLowerCase()} faturaları`,
    stats,
    nounSingular: `${label.toLowerCase()} faturası`,
    nounPlural: utilityPluralLabels[utility],
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
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {label} Faturaları
          </h1>
          <p className="text-muted-foreground">
            {formatNumber(stats.count)} anonim paylaşımdan derlenmiş Türkiye {label.toLowerCase()} faturası verisi.
          </p>
        </div>
        <Link href="/fatura/yeni" className={buttonVariants()}>
          <Plus className="mr-1.5 h-4 w-4" /> Faturamı paylaş
        </Link>
      </div>

      <div className="space-y-8">
        {official ? (
          <OfficialVsRealPanel
            sourceLabel={official.sourceLabel}
            sourceUrl={official.sourceUrl}
            referenceDate={official.referenceDate}
            officialValue={official.amount}
            userMedian={unitStats.median}
            userCount={unitStats.count}
            formatValue={(n) => `${formatTRY(n)} / ${unitName}`}
            metricLabel={`${label} birim fiyat (TL/${unitName})`}
            scopeLabel={label}
            methodology={(official.data.note as string) ?? undefined}
          />
        ) : null}

        {unitStats.median !== null ? (
          <div className="rounded-xl border bg-muted/20 p-4 text-sm sm:p-5">
            <p className="text-muted-foreground">
              Birim maliyet medyanı:{" "}
              <span className="font-semibold text-foreground tabular-nums">
                {formatTRY(unitStats.median)} / {unitName}
              </span>{" "}
              · {unitStats.p25 !== null ? `çeyreklik aralık ${formatTRY(unitStats.p25)}–${formatTRY(unitStats.p75 ?? 0)}` : ""}
            </p>
          </div>
        ) : null}

        <AmountStatsPanel
          stats={stats}
          scopeLabel={`Türkiye geneli · ${label} (toplam fatura)`}
        />

        {insight ? <AmountAiInsight insight={insight} /> : null}

        {amounts.length >= 3 ? (
          <AmountHistogram
            amounts={amounts}
            scopeLabel={`Türkiye geneli ${label.toLowerCase()} fatura dağılımı`}
            title="Tutar dağılımı"
            unitLabel="paylaşım"
          />
        ) : null}

        <AdSlot slotKey="fatura-utility-mid" format="leaderboard" />
        <FaturaList submissions={submissions} />
      </div>
    </div>
  );
}
