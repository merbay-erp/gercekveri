import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdSlot } from "@/components/ad-slot";
import { AmountAiInsight } from "@/components/data-display/amount-ai-insight";
import { InternetList } from "@/modules/internet/components/internet-list";
import { InternetStatsPanel } from "@/modules/internet/components/internet-stats-panel";
import {
  listInternetSubmissions,
  getInternetStats,
} from "@/modules/internet/server/queries";
import { isps, ispsBySlug } from "@/modules/internet/config";
import type { IspSlug } from "@/modules/internet/types";
import { buildInternetScope, getOrGenerateInsight } from "@/services/ai/insights";

const RESERVED_SLUGS = new Set(["yeni", "sehir"]);

export const revalidate = 60;
export const dynamicParams = true;

type Params = Promise<{ ispSlug: string }>;

export async function generateStaticParams() {
  return isps.map((isp) => ({ ispSlug: isp.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { ispSlug } = await params;
  if (RESERVED_SLUGS.has(ispSlug)) return { title: "Bulunamadı" };
  const isp = ispsBySlug.get(ispSlug);
  if (!isp) return { title: "Bulunamadı" };
  return {
    title: `${isp.name} Hız Testi & Memnuniyet — Türkiye`,
    description: `${isp.name} için Türkiye genelinde anonim kullanıcılarla derlenmiş gerçek hız, ping ve memnuniyet skoru.`,
    alternates: { canonical: `/internet/${ispSlug}` },
  };
}

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

export default async function IspPage({ params }: { params: Params }) {
  const { ispSlug } = await params;
  if (RESERVED_SLUGS.has(ispSlug)) notFound();
  const isp = ispsBySlug.get(ispSlug);
  if (!isp) notFound();

  const ispKey = ispSlug as IspSlug;
  const [submissions, stats] = await Promise.all([
    listInternetSubmissions({ isp: ispKey, limit: 50 }).catch(() => []),
    getInternetStats({ isp: ispKey }).catch(() => emptyMultiStats),
  ]);

  const insight = await getOrGenerateInsight({
    scope: buildInternetScope(ispSlug),
    scopeLabel: `${isp.name} — Türkiye geneli`,
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
    nounPlural: `${isp.name} ölçümleri`,
  }).catch(() => null);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/internet"
        className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Tüm sağlayıcılar
      </Link>

      <div className="mt-4 mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <Badge variant="secondary" className="font-normal">
            ISP
          </Badge>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {isp.name} Hız & Memnuniyet
          </h1>
          <p className="text-muted-foreground">
            Türkiye genelinde {isp.name} için kullanıcı tarafından paylaşılan gerçek
            ölçümler.
          </p>
        </div>
        <Link href="/internet/yeni" className={buttonVariants()}>
          <Plus className="mr-1.5 h-4 w-4" /> Ölçümümü paylaş
        </Link>
      </div>

      <div className="space-y-8">
        <InternetStatsPanel stats={stats} scopeLabel={`${isp.name} · Türkiye geneli`} />

        {insight ? <AmountAiInsight insight={insight} /> : null}

        <AdSlot slotKey="internet-isp-mid" format="leaderboard" />

        <div>
          <h2 className="mb-3 text-lg font-medium">Son ölçümler</h2>
          <InternetList submissions={submissions} />
        </div>
      </div>
    </div>
  );
}
