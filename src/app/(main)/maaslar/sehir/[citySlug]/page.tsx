import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { AdSlot } from "@/components/ad-slot";
import { MaasList } from "@/modules/maas/components/maas-list";
import { MaasStats } from "@/modules/maas/components/maas-stats";
import { MaasHistogram } from "@/modules/maas/components/maas-histogram";
import {
  getRelatedPositions,
  getSalaryStats,
  listSalarySubmissions,
  topCitySlugs,
} from "@/modules/maas/server/queries";
import { findCityBySlug, featuredCitySlugs } from "@/lib/cities";
import { formatNumber } from "@/lib/money";

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
    title: `${cityRecord.name} Maaşları — Anonim, Gerçek Veri`,
    description: `${cityRecord.name} şehrinde pozisyon ve sektör bazında anonim olarak paylaşılan gerçek net maaşlar.`,
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

  const [submissions, stats, relatedPositions] = await Promise.all([
    listSalarySubmissions({ citySlug, limit: 50 }).catch(() => []),
    getSalaryStats({ citySlug }).catch(() => emptyStats),
    getRelatedPositions(citySlug, "", 8).catch(
      () => [] as { slug: string; name: string; count: number }[],
    ),
  ]);

  const amounts = submissions.map((s) => s.amount);

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
            {cityRecord.region}
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {cityRecord.name} Maaşları
          </h1>
          <p className="text-muted-foreground">
            {formatNumber(stats.count)} anonim paylaşımdan derlenmiş — pozisyon ve
            sektör bazında.
          </p>
        </div>
        <Link href="/maaslar/yeni" className={buttonVariants()}>
          <Plus className="mr-1.5 h-4 w-4" /> Maaşımı paylaş
        </Link>
      </div>

      <div className="space-y-8">
        <MaasStats stats={stats} scopeLabel={`${cityRecord.name} · tüm pozisyonlar`} />

        {amounts.length >= 3 ? (
          <MaasHistogram
            amounts={amounts}
            scopeLabel={`${cityRecord.name} maaş aralığı dağılımı`}
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
