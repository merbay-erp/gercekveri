import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { AdSlot } from "@/components/ad-slot";
import { MaasList } from "@/modules/maas/components/maas-list";
import { MaasStats } from "@/modules/maas/components/maas-stats";
import { listSalarySubmissions, getSalaryStats } from "@/modules/maas/server/queries";
import { maasModule } from "@/modules/maas/config";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Türkiye'de Maaşlar — Anonim, Gerçek Veri",
  description:
    "Pozisyon, sektör ve şehir bazında Türkiye'deki gerçek maaşlar. Anonim olarak paylaşılan, doğrulanmış verilerle gerçek aralıkları gör.",
  alternates: { canonical: "/maaslar" },
};

export default async function MaaslarPage() {
  const [submissions, stats] = await Promise.all([
    listSalarySubmissions({ limit: 50 }).catch(() => []),
    getSalaryStats().catch(() => ({
      count: 0,
      avg: null,
      median: null,
      p25: null,
      p75: null,
      min: null,
      max: null,
    })),
  ]);

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
        <MaasStats stats={stats} scopeLabel="Türkiye geneli — tüm pozisyonlar" />
        <AdSlot slotKey="maaslar-list-top" format="leaderboard" />
        <MaasList submissions={submissions} />
      </div>
    </div>
  );
}
