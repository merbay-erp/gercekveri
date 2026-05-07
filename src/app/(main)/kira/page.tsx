import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { AdSlot } from "@/components/ad-slot";
import { AmountStatsPanel } from "@/components/data-display/amount-stats";
import { AmountHistogram } from "@/components/data-display/amount-histogram";
import { AmountAiInsight } from "@/components/data-display/amount-ai-insight";
import { KiraList } from "@/modules/kira/components/kira-list";
import { KiraFilterBar } from "@/modules/kira/components/kira-filter-bar";
import { listRentSubmissions, getRentStats } from "@/modules/kira/server/queries";
import { kiraModule } from "@/modules/kira/config";
import { buildRentScope, getOrGenerateInsight } from "@/services/ai/insights";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Türkiye'de Kiralar — Anonim, Gerçek Veri",
  description:
    "Şehir ve ilçe bazında Türkiye'deki gerçek kira fiyatları. Anonim kiracı verisinden derlenmiş medyan, ortalama ve aralık.",
  alternates: { canonical: "/kira" },
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

export default async function KiraPage() {
  const [submissions, stats] = await Promise.all([
    listRentSubmissions({ limit: 50 }).catch(() => []),
    getRentStats().catch(() => emptyStats),
  ]);

  const insight = await getOrGenerateInsight({
    scope: buildRentScope(),
    scopeLabel: "Türkiye geneli — tüm kira ilanları",
    stats,
    nounSingular: "kira",
    nounPlural: "kira ilanları",
  }).catch(() => null);

  const amounts = submissions.map((s) => s.amount);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Kiralar</h1>
          <p className="text-muted-foreground">{kiraModule.description}</p>
        </div>
        <Link href={kiraModule.newPath} className={buttonVariants()}>
          <Plus className="mr-1.5 h-4 w-4" /> Kira ilanımı paylaş
        </Link>
      </div>

      <div className="space-y-8">
        <KiraFilterBar />
        <AmountStatsPanel stats={stats} scopeLabel="Türkiye geneli — tüm kira ilanları" />

        {insight ? <AmountAiInsight insight={insight} /> : null}

        {amounts.length >= 3 ? (
          <AmountHistogram
            amounts={amounts}
            scopeLabel="Türkiye geneli kira dağılımı"
            title="Kira dağılımı"
            unitLabel="ilan"
          />
        ) : null}

        <AdSlot slotKey="kira-list-top" format="leaderboard" />
        <KiraList submissions={submissions} />
      </div>
    </div>
  );
}
