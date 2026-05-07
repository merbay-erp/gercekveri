import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { AdSlot } from "@/components/ad-slot";
import { AmountAiInsight } from "@/components/data-display/amount-ai-insight";
import { InternetList } from "@/modules/internet/components/internet-list";
import { InternetStatsPanel } from "@/modules/internet/components/internet-stats-panel";
import { InternetIspTable } from "@/modules/internet/components/internet-isp-table";
import { InternetFilterBar } from "@/modules/internet/components/internet-filter-bar";
import {
  listInternetSubmissions,
  getInternetStats,
  getIspRollups,
} from "@/modules/internet/server/queries";
import { internetModule, formatMbps } from "@/modules/internet/config";
import { buildInternetScope, getOrGenerateInsight } from "@/services/ai/insights";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Türkiye'de İnternet Sağlayıcıları — Anonim, Gerçek Hız",
  description:
    "Türk Telekom, Superonline, Vodafone, TurkNet ve diğer ISP'lerin gerçek hızı, ping ve memnuniyet verisi — anonim kullanıcılardan.",
  alternates: { canonical: "/internet" },
};

const emptyMultiStats = {
  count: 0,
  medianRealSpeed: null,
  avgRealSpeed: null,
  medianPackageSpeed: null,
  speedEfficiency: null,
  medianPing: null,
  avgSatisfaction: null,
  stabilityScore: null,
};

export default async function InternetPage() {
  const [submissions, stats, ispRollups] = await Promise.all([
    listInternetSubmissions({ limit: 50 }).catch(() => []),
    getInternetStats().catch(() => emptyMultiStats),
    getIspRollups().catch(() => []),
  ]);

  const insight = await getOrGenerateInsight({
    scope: buildInternetScope(),
    scopeLabel: "Türkiye geneli — internet sağlayıcıları",
    stats: {
      count: stats.count,
      avg: stats.avgRealSpeed,
      median: stats.medianRealSpeed,
      p25: stats.medianRealSpeed ? Math.round(stats.medianRealSpeed * 0.7) : null,
      p75: stats.medianRealSpeed ? Math.round(stats.medianRealSpeed * 1.3) : null,
      min: stats.medianRealSpeed ? Math.max(1, Math.round(stats.medianRealSpeed * 0.3)) : null,
      max: stats.medianRealSpeed ? Math.round(stats.medianRealSpeed * 2.5) : null,
    },
    nounSingular: "internet hızı",
    nounPlural: "internet ölçümleri (Mbps cinsinden)",
    formatValue: (n) => formatMbps(n),
  }).catch(() => null);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            İnternet sağlayıcıları
          </h1>
          <p className="text-muted-foreground">{internetModule.description}</p>
        </div>
        <Link href={internetModule.newPath} className={buttonVariants()}>
          <Plus className="mr-1.5 h-4 w-4" /> Ölçümümü paylaş
        </Link>
      </div>

      <div className="space-y-8">
        <InternetFilterBar />
        <InternetStatsPanel stats={stats} scopeLabel="Türkiye geneli — tüm sağlayıcılar" />
        <InternetIspTable rollups={ispRollups} />

        {insight ? <AmountAiInsight insight={insight} /> : null}

        <AdSlot slotKey="internet-list-top" format="leaderboard" />
        <InternetList submissions={submissions} />
      </div>
    </div>
  );
}
