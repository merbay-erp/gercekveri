import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { AdSlot } from "@/components/ad-slot";
import { AmountStatsPanel } from "@/components/data-display/amount-stats";
import { AmountHistogram } from "@/components/data-display/amount-histogram";
import { TekstilList } from "@/modules/tekstil/components/tekstil-list";
import {
  listTekstilSubmissions,
  getTekstilStats,
} from "@/modules/tekstil/server/queries";
import {
  subTypeFromSlug,
  subTypeLabels,
  subTypeSlugs,
  subTypes,
  defaultUnitFor,
  unitLabels,
} from "@/modules/tekstil/config";
import { formatTRY, formatNumber } from "@/lib/money";

export const revalidate = 60;
export const dynamicParams = false;

type Params = Promise<{ subTypeSlug: string }>;

export async function generateStaticParams() {
  return subTypes.map((s) => ({ subTypeSlug: subTypeSlugs[s] }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { subTypeSlug } = await params;
  const sub = subTypeFromSlug[subTypeSlug];
  if (!sub) return { title: "Bulunamadı" };
  return {
    title: `${subTypeLabels[sub]} Fiyatları — Türkiye Geneli, Anonim`,
    description: `Türkiye'de ${subTypeLabels[sub].toLowerCase()} işi için anonim üretici verisinden derlenmiş gerçek birim fiyatları.`,
    alternates: { canonical: `/tekstil/${subTypeSlug}` },
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

export default async function TekstilSubTypePage({ params }: { params: Params }) {
  const { subTypeSlug } = await params;
  const sub = subTypeFromSlug[subTypeSlug];
  if (!sub) notFound();

  const label = subTypeLabels[sub];
  const defaultUnit = defaultUnitFor[sub];
  const unitName = unitLabels[defaultUnit];

  const [submissions, stats] = await Promise.all([
    listTekstilSubmissions({ subType: sub, unit: defaultUnit, limit: 50 }).catch(() => []),
    getTekstilStats({ subType: sub, unit: defaultUnit }).catch(() => emptyStats),
  ]);

  const amounts = submissions.map((s) => s.amount);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/tekstil"
        className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Tüm tekstil fiyatları
      </Link>

      <div className="mt-4 mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {label} Fiyatları
          </h1>
          <p className="text-muted-foreground">
            {formatNumber(stats.count)} anonim paylaşımdan derlenmiş Türkiye{" "}
            {label.toLowerCase()} fiyatı verisi · birim: {unitName}
          </p>
        </div>
        <Link href="/tekstil/yeni" className={buttonVariants()}>
          <Plus className="mr-1.5 h-4 w-4" /> Fiyatımı paylaş
        </Link>
      </div>

      <div className="space-y-8">
        <AmountStatsPanel
          stats={stats}
          scopeLabel={`Türkiye geneli · ${label} (TL/${unitName})`}
        />

        {amounts.length >= 3 ? (
          <AmountHistogram
            amounts={amounts}
            scopeLabel={`Türkiye geneli ${label.toLowerCase()} fiyat dağılımı`}
            title={`${label} fiyat dağılımı`}
            unitLabel="paylaşım"
            formatValue={(n) => formatTRY(n)}
          />
        ) : null}

        <AdSlot slotKey="tekstil-subtype-mid" format="leaderboard" />
        <TekstilList submissions={submissions} />
      </div>
    </div>
  );
}
