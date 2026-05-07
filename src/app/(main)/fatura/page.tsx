import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Zap, Flame, Droplet } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdSlot } from "@/components/ad-slot";
import { AmountStatsPanel } from "@/components/data-display/amount-stats";
import { AmountHistogram } from "@/components/data-display/amount-histogram";
import { AmountAiInsight } from "@/components/data-display/amount-ai-insight";
import { FaturaList } from "@/modules/fatura/components/fatura-list";
import { FaturaFilterBar } from "@/modules/fatura/components/fatura-filter-bar";
import {
  listFaturaSubmissions,
  getFaturaStats,
  getFaturaUnitCostStats,
} from "@/modules/fatura/server/queries";
import {
  faturaModule,
  utilityTypes,
  utilityLabels,
  utilityUnits,
  utilitySlugs,
  type UtilityType,
} from "@/modules/fatura/config";
import { formatTRY } from "@/lib/money";
import { buildFaturaScope, getOrGenerateInsight } from "@/services/ai/insights";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Türkiye'de Elektrik, Doğalgaz & Su Faturaları — Anonim, Gerçek Veri",
  description:
    "Türkiye'de fatura tutarları ve birim maliyetler. Anonim hane verisinden derlenmiş gerçek elektrik, doğalgaz ve su rakamları, şehir ve hane bazında.",
  alternates: { canonical: "/fatura" },
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

const utilityIcon: Record<UtilityType, typeof Zap> = {
  ELEKTRIK: Zap,
  DOGALGAZ: Flame,
  SU: Droplet,
};

export default async function FaturaPage() {
  const [submissions, stats] = await Promise.all([
    listFaturaSubmissions({ limit: 50 }).catch(() => []),
    getFaturaStats().catch(() => emptyStats),
  ]);

  const insight = await getOrGenerateInsight({
    scope: buildFaturaScope(),
    scopeLabel: "Türkiye geneli — faturalar",
    stats,
    nounSingular: "fatura",
    nounPlural: "faturalar",
  }).catch(() => null);

  const amounts = submissions.map((s) => s.amount);

  // Per-utility unit cost mini-cards: surfaces the "₺/kWh" or "₺/m³" headline
  // because that's what users actually want to know vs. raw bill totals.
  const perUtility = await Promise.all(
    utilityTypes.map(async (u) => {
      const unit = await getFaturaUnitCostStats({ utilityType: u }).catch(() => ({
        count: 0,
        median: null,
        p25: null,
        p75: null,
      }));
      return { utility: u, unit };
    }),
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Faturalar
          </h1>
          <p className="text-muted-foreground">{faturaModule.description}</p>
        </div>
        <Link href={faturaModule.newPath} className={buttonVariants()}>
          <Plus className="mr-1.5 h-4 w-4" /> Faturamı paylaş
        </Link>
      </div>

      <div className="space-y-8">
        <div className="grid gap-3 sm:grid-cols-3">
          {perUtility.map(({ utility, unit }) => {
            const Icon = utilityIcon[utility];
            const unitName = utilityUnits[utility];
            return (
              <Link
                key={utility}
                href={`/fatura/${utilitySlugs[utility]}`}
                className="group"
              >
                <Card className="h-full p-4 transition group-hover:border-foreground/30 group-hover:shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-muted">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div className="space-y-0.5">
                      <p className="font-medium leading-tight">
                        {utilityLabels[utility]}
                      </p>
                      {unit.median !== null ? (
                        <p className="text-sm text-muted-foreground tabular-nums">
                          medyan {formatTRY(unit.median)} / {unitName} ·{" "}
                          {unit.count} paylaşım
                        </p>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          henüz veri yok
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <FaturaFilterBar />
        <AmountStatsPanel
          stats={stats}
          scopeLabel="Türkiye geneli — tüm fatura türleri (toplam)"
        />

        {insight ? <AmountAiInsight insight={insight} /> : null}

        {amounts.length >= 3 ? (
          <AmountHistogram
            amounts={amounts}
            scopeLabel="Türkiye geneli fatura dağılımı"
            title="Fatura dağılımı"
            unitLabel="paylaşım"
          />
        ) : null}

        <AdSlot slotKey="fatura-list-top" format="leaderboard" />
        <FaturaList submissions={submissions} />
      </div>
    </div>
  );
}
