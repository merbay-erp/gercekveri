import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { AdSlot } from "@/components/ad-slot";
import { MaasList } from "@/modules/maas/components/maas-list";
import { MaasStats } from "@/modules/maas/components/maas-stats";
import { MaasHistogram } from "@/modules/maas/components/maas-histogram";
import { MaasFilterBar } from "@/modules/maas/components/maas-filter-bar";
import {
  getSalaryStats,
  listSalarySubmissions,
  topPositionSlugs,
} from "@/modules/maas/server/queries";
import {
  positionNameFromSlug,
  positionSlugFor,
} from "@/modules/maas/position-resolver";
import { maasModule } from "@/modules/maas/config";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Türkiye'de Maaşlar — Anonim, Gerçek Veri",
  description:
    "Pozisyon, sektör ve şehir bazında Türkiye'deki gerçek maaşlar. Anonim olarak paylaşılan, doğrulanmış verilerle gerçek aralıkları gör.",
  alternates: { canonical: "/maaslar" },
};

const emptyStats = {
  count: 0,
  avg: null,
  median: null,
  p25: null,
  p75: null,
  min: null,
  max: null,
};

export default async function MaaslarPage() {
  const [submissions, stats, popularSlugs] = await Promise.all([
    listSalarySubmissions({ limit: 50 }).catch(() => []),
    getSalaryStats().catch(() => emptyStats),
    topPositionSlugs(8).catch(() => [] as string[]),
  ]);

  const topPositions = popularSlugs.map((slug) => {
    const sample = submissions.find(
      (s) => s.data.position && slug === positionSlugFor(s.data.position),
    );
    return {
      slug,
      name: sample?.data.position ?? positionNameFromSlug(slug),
      count: submissions.filter(
        (s) => s.data.position && slug === positionSlugFor(s.data.position),
      ).length,
    };
  });

  const amounts = submissions.map((s) => s.amount);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Maaşlar</h1>
          <p className="text-muted-foreground">{maasModule.description}</p>
        </div>
        <Link href={maasModule.newPath} className={buttonVariants()}>
          <Plus className="mr-1.5 h-4 w-4" /> Maaşımı paylaş
        </Link>
      </div>

      <div className="space-y-8">
        <MaasFilterBar topPositions={topPositions} />
        <MaasStats stats={stats} scopeLabel="Türkiye geneli — tüm pozisyonlar" />

        {amounts.length >= 3 ? (
          <MaasHistogram amounts={amounts} scopeLabel="Türkiye geneli maaş dağılımı" />
        ) : null}

        <AdSlot slotKey="maaslar-list-top" format="leaderboard" />
        <MaasList submissions={submissions} />
      </div>
    </div>
  );
}

