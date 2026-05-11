import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdSlot } from "@/components/ad-slot";
import { SchemaOrg } from "@/components/schema-org";
import { cityDetailBreadcrumb } from "@/lib/schema-presets";
import { AmountStatsPanel } from "@/components/data-display/amount-stats";
import { AmountHistogram } from "@/components/data-display/amount-histogram";
import { TekstilList } from "@/modules/tekstil/components/tekstil-list";
import {
  listTekstilSubmissions,
  getTekstilStats,
  topTekstilCitySlugs,
} from "@/modules/tekstil/server/queries";
import { findCityBySlug, featuredCitySlugs } from "@/lib/cities";
import { formatNumber } from "@/lib/money";
import { getScopeTrustScore } from "@/lib/trust-score-server";
import { TrustScoreBadge } from "@/components/data-display/trust-score-badge";
import { db } from "@/lib/db";

const CURRENT_YEAR = new Date().getFullYear();

export const revalidate = 60;
export const dynamicParams = true;

type Params = Promise<{ citySlug: string }>;

export async function generateStaticParams() {
  const active = await topTekstilCitySlugs(20).catch(() => [] as string[]);
  const merged = Array.from(new Set([...active, ...featuredCitySlugs]));
  return merged.map((citySlug) => ({ citySlug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { citySlug } = await params;
  const city = findCityBySlug(citySlug);
  if (!city) return { title: "Bulunamadı" };
  return {
    title: `${city.name} Tekstil Fiyat Endeksi ${CURRENT_YEAR} — Anonim Gerçek Veri`,
    description: `${city.name}'da kesim, dikim, boyahane, baskı ve kumaş üretim fiyatları. Anonim üretici verisinden derlenmiş gerçek rakamlar.`,
    alternates: { canonical: `/tekstil/sehir/${citySlug}` },
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

export default async function TekstilCityPage({ params }: { params: Params }) {
  const { citySlug } = await params;
  const city = findCityBySlug(citySlug);
  if (!city) notFound();

  const cityDb = await db.city
    .findUnique({ where: { slug: city.slug }, select: { id: true } })
    .catch(() => null);

  const [submissions, stats, trust] = await Promise.all([
    listTekstilSubmissions({ citySlug, limit: 50 }).catch(() => []),
    getTekstilStats({ citySlug }).catch(() => emptyStats),
    cityDb
      ? getScopeTrustScore({ type: "TEXTILE", cityId: cityDb.id }).catch(() => null)
      : Promise.resolve(null),
  ]);

  const amounts = submissions.map((s) => s.amount);

  return (
    <div className="container mx-auto px-4 py-12">
      <SchemaOrg
        data={cityDetailBreadcrumb({
          categoryLabel: "Tekstil",
          categoryPath: "/tekstil",
          cityName: city.name,
          citySlug,
        })}
      />
      <Link
        href="/tekstil"
        className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Tüm tekstil fiyatları
      </Link>

      <div className="mt-4 mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <Badge variant="secondary" className="font-normal">
            {city.region}
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {city.name} Tekstil Fiyat Endeksi {CURRENT_YEAR}
          </h1>
          <p className="text-muted-foreground">
            {formatNumber(stats.count)} anonim üretici paylaşımı, {city.name} özelinde.
            Birim fiyatlar iş tipine göre farklı birimlerde olabilir — detay listede.
          </p>
        </div>
        <Link href="/tekstil/yeni" className={buttonVariants()}>
          <Plus className="mr-1.5 h-4 w-4" /> Fiyatımı paylaş
        </Link>
      </div>

      <div className="space-y-8">
        {trust ? (
          <TrustScoreBadge score={trust} scopeLabel={`${city.name} · tekstil verisi`} />
        ) : null}

        <AmountStatsPanel
          stats={stats}
          scopeLabel={`${city.name} · tüm tekstil işleri (karma birim)`}
        />

        {amounts.length >= 3 ? (
          <AmountHistogram
            amounts={amounts}
            scopeLabel={`${city.name} tekstil fiyat dağılımı`}
            title="Fiyat dağılımı"
            unitLabel="paylaşım"
          />
        ) : null}

        <AdSlot slotKey="tekstil-city-mid" format="leaderboard" />
        <TekstilList submissions={submissions} />
      </div>
    </div>
  );
}
