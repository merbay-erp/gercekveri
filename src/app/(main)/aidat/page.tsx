import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { AdSlot } from "@/components/ad-slot";
import { SchemaOrg } from "@/components/schema-org";
import { aidatSchemas } from "@/lib/schema-presets";
import { AmountStatsPanel } from "@/components/data-display/amount-stats";
import { AmountHistogram } from "@/components/data-display/amount-histogram";
import { AmountAiInsight } from "@/components/data-display/amount-ai-insight";
import { AidatList } from "@/modules/aidat/components/aidat-list";
import { AidatFilterBar } from "@/modules/aidat/components/aidat-filter-bar";
import { listAidatSubmissions, getAidatStats } from "@/modules/aidat/server/queries";
import { aidatModule } from "@/modules/aidat/config";
import { buildAidatScope, getOrGenerateInsight } from "@/services/ai/insights";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Türkiye'de Apartman & Site Aidatları — Anonim, Gerçek Veri",
  description:
    "Şehir ve ilçe bazında apartman ve site aidatları. Anonim sakin verisinden derlenmiş gerçek tutarlar, hizmet kapsamı ve karşılaştırma.",
  alternates: { canonical: "/aidat" },
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

export default async function AidatPage() {
  const [submissions, stats] = await Promise.all([
    listAidatSubmissions({ limit: 50 }).catch(() => []),
    getAidatStats().catch(() => emptyStats),
  ]);

  const insight = await getOrGenerateInsight({
    scope: buildAidatScope(),
    scopeLabel: "Türkiye geneli — site aidatları",
    stats,
    nounSingular: "aidat",
    nounPlural: "site aidatları",
  }).catch(() => null);

  const amounts = submissions.map((s) => s.amount);

  return (
    <div className="container mx-auto px-4 py-12">
      <SchemaOrg data={aidatSchemas({ recordCount: stats.count })} />
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Site aidatları
          </h1>
          <p className="text-muted-foreground">{aidatModule.description}</p>
        </div>
        <Link href={aidatModule.newPath} className={buttonVariants()}>
          <Plus className="mr-1.5 h-4 w-4" /> Aidatımı paylaş
        </Link>
      </div>

      <div className="space-y-8">
        <AidatFilterBar />
        <AmountStatsPanel stats={stats} scopeLabel="Türkiye geneli — site aidatları" />

        {insight ? <AmountAiInsight insight={insight} /> : null}

        {amounts.length >= 3 ? (
          <AmountHistogram
            amounts={amounts}
            scopeLabel="Türkiye geneli aidat dağılımı"
            title="Aidat dağılımı"
            unitLabel="paylaşım"
          />
        ) : null}

        <AdSlot slotKey="aidat-list-top" format="leaderboard" />
        <AidatList submissions={submissions} />
      </div>
    </div>
  );
}
