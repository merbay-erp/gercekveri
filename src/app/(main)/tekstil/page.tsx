import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Scissors } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdSlot } from "@/components/ad-slot";
import { TekstilList } from "@/modules/tekstil/components/tekstil-list";
import { TekstilFilterBar } from "@/modules/tekstil/components/tekstil-filter-bar";
import {
  listTekstilSubmissions,
  getTekstilStats,
} from "@/modules/tekstil/server/queries";
import {
  tekstilModule,
  subTypes,
  subTypeLabels,
  subTypeSlugs,
  defaultUnitFor,
  unitLabels,
} from "@/modules/tekstil/config";
import { formatTRY, formatNumber } from "@/lib/money";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Türkiye Tekstil Üretim Fiyatları — Anonim, Gerçek Veri",
  description:
    "Kesim, dikim, boyahane, baskı, nakış ve kumaş üretim fiyatları. Anonim üretici verisinden derlenmiş gerçek birim fiyatları, şehir ve iş tipine göre.",
  alternates: { canonical: "/tekstil" },
};

export default async function TekstilPage() {
  const submissions = await listTekstilSubmissions({ limit: 50 }).catch(() => []);

  const perSubType = await Promise.all(
    subTypes.map(async (s) => {
      const stats = await getTekstilStats({
        subType: s,
        unit: defaultUnitFor[s],
      }).catch(() => ({
        count: 0,
        median: null,
        avg: null,
        p25: null,
        p75: null,
        min: null,
        max: null,
      }));
      return { subType: s, stats };
    }),
  );

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Tekstil fiyatları
          </h1>
          <p className="max-w-2xl text-muted-foreground">{tekstilModule.description}</p>
        </div>
        <Link href={tekstilModule.newPath} className={buttonVariants()}>
          <Plus className="mr-1.5 h-4 w-4" /> Fiyatımı paylaş
        </Link>
      </div>

      <div className="space-y-8">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {perSubType.map(({ subType, stats }) => {
            const unit = unitLabels[defaultUnitFor[subType]];
            return (
              <Link
                key={subType}
                href={`/tekstil/${subTypeSlugs[subType]}`}
                className="group"
              >
                <Card className="h-full p-4 transition group-hover:border-foreground/30 group-hover:shadow-sm">
                  <div className="flex items-start gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-muted">
                      <Scissors className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <p className="font-medium leading-tight">
                        {subTypeLabels[subType]}
                      </p>
                      {stats.median !== null ? (
                        <p className="text-xs text-muted-foreground tabular-nums">
                          medyan {formatTRY(stats.median)} / {unit} ·{" "}
                          {formatNumber(stats.count)} paylaşım
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground">veri yok</p>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <TekstilFilterBar />

        <AdSlot slotKey="tekstil-list-top" format="leaderboard" />
        <TekstilList submissions={submissions} />
      </div>
    </div>
  );
}
