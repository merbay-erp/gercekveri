import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AdSlot } from "@/components/ad-slot";
import { SchemaOrg } from "@/components/schema-org";
import { cityDetailBreadcrumb } from "@/lib/schema-presets";
import { MaasList } from "@/modules/maas/components/maas-list";
import { AmountStatsPanel } from "@/components/data-display/amount-stats";
import { AmountHistogram } from "@/components/data-display/amount-histogram";
import { AmountAiInsight } from "@/components/data-display/amount-ai-insight";
import { buildSalaryScope, getOrGenerateInsight } from "@/services/ai/insights";
import {
  getRelatedPositions,
  getSalaryStats,
  listSalarySubmissions,
  topCitySlugs,
} from "@/modules/maas/server/queries";
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
  const active = await topCitySlugs(20).catch(() => [] as string[]);
  const merged = Array.from(new Set([...active, ...featuredCitySlugs]));
  return merged.map((citySlug) => ({ citySlug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { citySlug } = await params;
  const cityRecord = findCityBySlug(citySlug);
  if (!cityRecord) return { title: "Bulunamadı" };
  return {
    title: `${cityRecord.name} Maaş Endeksi ${CURRENT_YEAR} — Anonim Gerçek Veri`,
    description: `${cityRecord.name} maaş endeksi: pozisyon ve sektör bazında anonim çalışanlardan derlenmiş gerçek net maaşlar — şirket beklentisi değil, ödenen.`,
    alternates: { canonical: `/maaslar/sehir/${citySlug}` },
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

export default async function CityPage({ params }: { params: Params }) {
  const { citySlug } = await params;
  const cityRecord = findCityBySlug(citySlug);
  if (!cityRecord) notFound();

  const cityDb = await db.city
    .findUnique({ where: { slug: cityRecord.slug }, select: { id: true } })
    .catch(() => null);

  const [submissions, stats, relatedPositions, trust] = await Promise.all([
    listSalarySubmissions({ citySlug, limit: 50 }).catch(() => []),
    getSalaryStats({ citySlug }).catch(() => emptyStats),
    getRelatedPositions(citySlug, "", 8).catch(
      () => [] as { slug: string; name: string; count: number }[],
    ),
    cityDb
      ? getScopeTrustScore({ type: "SALARY", cityId: cityDb.id }).catch(() => null)
      : Promise.resolve(null),
  ]);

  const insight = await getOrGenerateInsight({
    scope: buildSalaryScope(undefined, citySlug),
    scopeLabel: `${cityRecord.name} — tüm pozisyonlar`,
    stats,
    nounSingular: "maaş",
    nounPlural: "maaşlar",
  }).catch(() => null);

  const amounts = submissions.map((s) => s.amount);

  return (
    <div className="container mx-auto px-4 py-12">
      <SchemaOrg
        data={cityDetailBreadcrumb({
          categoryLabel: "Maaşlar",
          categoryPath: "/maaslar",
          cityName: cityRecord.name,
          citySlug,
        })}
      />
      <Link
        href="/maaslar"
        className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Tüm maaşlar
      </Link>

      <div className="mt-4 mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <Badge variant="secondary" className="font-normal">
            {cityRecord.region}
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {cityRecord.name} Maaş Endeksi {CURRENT_YEAR}
          </h1>
          <p className="text-muted-foreground">
            {formatNumber(stats.count)} anonim çalışan paylaşımı — pozisyon ve sektör
            bazında, şirket beklentisi değil ödenen tutarlar.
          </p>
          {trust ? (
            <div className="pt-1">
              <TrustScoreBadge
                score={trust}
                scopeLabel={`${cityRecord.name} maaş verisi`}
                variant="pill"
              />
            </div>
          ) : null}
        </div>
        <Link href="/maaslar/yeni" className={buttonVariants()}>
          <Plus className="mr-1.5 h-4 w-4" /> Maaşımı paylaş
        </Link>
      </div>

      <div className="space-y-8">
        {trust ? (
          <TrustScoreBadge
            score={trust}
            scopeLabel={`${cityRecord.name} · maaş verisi`}
          />
        ) : null}

        <AmountStatsPanel stats={stats} scopeLabel={`${cityRecord.name} · tüm pozisyonlar`} />

        {insight ? <AmountAiInsight insight={insight} /> : null}

        {amounts.length >= 3 ? (
          <AmountHistogram
            amounts={amounts}
            scopeLabel={`${cityRecord.name} maaş aralığı dağılımı`}
            title="Maaş dağılımı"
            unitLabel="kişi"
          />
        ) : null}

        <AdSlot slotKey="city-page-mid" format="leaderboard" />

        {relatedPositions.length > 0 ? (
          <Card className="p-5">
            <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Pozisyona göre kır
            </h2>
            <div className="flex flex-wrap gap-2">
              {relatedPositions.map((p) => (
                <Link
                  key={p.slug}
                  href={`/maaslar/${p.slug}/${citySlug}`}
                  className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm transition hover:border-foreground/30 hover:bg-muted"
                >
                  {p.name}
                  <span className="text-xs text-muted-foreground">{p.count}</span>
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
