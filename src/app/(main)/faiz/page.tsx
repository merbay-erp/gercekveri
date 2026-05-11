import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, TrendingDown, AlertCircle, Percent } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SchemaOrg } from "@/components/schema-org";
import { AdSlot } from "@/components/ad-slot";
import { SeriesHistoryChart } from "@/components/data-display/series-history-chart";
import { faizSchemas } from "@/lib/schema-presets";
import {
  getTcmbSeries,
  formatPct,
  formatTcmbDate,
} from "@/lib/tcmb-series";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "TCMB Politika Faizi — Anlık Resmi Veri",
  description:
    "TCMB APİ Fonlama (1 hafta repo) politika faizi anlık değeri + 12 aylık tarihçe. EVDS API saatlik fetch.",
  alternates: { canonical: "/faiz" },
  openGraph: {
    title: "TCMB Politika Faizi — Anlık",
    description: "1 hafta repo / APİ fonlama oranı, resmi TCMB veri.",
    type: "website",
  },
};

export default async function FaizPage() {
  const series = await getTcmbSeries("TP.APIFON4");

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <SchemaOrg
        data={faizSchemas({
          lastValue: series?.lastValue,
          lastDate: series?.lastDate,
        })}
      />

      <header className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          TCMB · Resmi Veri · Saatlik
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          TCMB Politika Faizi
        </h1>
        <p className="mt-3 text-muted-foreground">
          APİ Fonlama Oranı (1 hafta repo) — TCMB'nin bankalara açtığı kısa
          vadeli fonlama maliyeti. Mevduat, kredi ve döviz piyasası temel
          referansı.
        </p>
      </header>

      {!series ? (
        <Card className="border-amber-500/30 bg-amber-500/[0.04] p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-sm">
              TCMB EVDS senkronizasyonu bekleniyor. Birkaç dakika sonra tekrar
              dene.
            </p>
          </div>
        </Card>
      ) : (
        <>
          <Card className="mb-6 p-6 border-purple-500/30 bg-gradient-to-br from-purple-500/[0.06] to-transparent">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Politika Faizi (1 hafta repo)
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-5xl font-semibold tabular-nums tracking-tight">
                    %{series.lastValue.toFixed(2)}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Son güncelleme: <strong>{formatTcmbDate(series.lastDate)}</strong>
                </p>
              </div>
              <Percent className="h-12 w-12 text-purple-500/30" />
            </div>
          </Card>

          {series.history && series.history.length > 0 ? (
            <Card className="mb-6 p-6">
              <h2 className="mb-1 text-sm font-semibold">
                12 Aylık Tarihçe
              </h2>
              <p className="mb-4 text-xs text-muted-foreground">
                TCMB EVDS · saatlik senkron
              </p>
              <SeriesHistoryChart
                data={series.history}
                unit="%"
                decimals={2}
                color="#a855f7"
              />
            </Card>
          ) : null}

          <AdSlot slotKey="faiz-mid" format="leaderboard" />

          <article className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
            <h2>Politika faizi nedir?</h2>
            <p>
              TCMB'nin bankalara verdiği <strong>1 hafta vadeli repo</strong>{" "}
              (APİ Fonlama Oranı) — bankaların TCMB'den borçlandığı temel
              maliyettir. Şu an <strong>%{series.lastValue.toFixed(2)}</strong>{" "}
              seviyesinde. Bu oran tüm finansal piyasaların referansıdır.
            </p>

            <h2>Faiz neden artar/azalır?</h2>
            <p>
              Enflasyon yüksekse TCMB faizi artırır (sıkılaşma) → kredi pahalanır
              → harcama azalır → talep enflasyonu düşer. Enflasyon düşükse
              tersi yapılır (gevşeme).
            </p>

            <h2>Mevduat faizi politika faizine nasıl bağlı?</h2>
            <p>
              Bankalar mevduat faizini politika faizinin{" "}
              <strong>%80-110</strong> bandında belirler. Politika %50 ise
              mevduat genelde %40-55 bandında olur. Vergi (%5-15) sonrası net
              getirir.
            </p>
            <p>
              Tahmini mevduat aralığı: <strong>%{(series.lastValue * 0.8).toFixed(1)} - %{(series.lastValue * 1.05).toFixed(1)}</strong>
            </p>

            <h2>Kredi faizine etki</h2>
            <p>
              Tüketici kredisi faizi genelde politika faizinin{" "}
              <strong>%150-200</strong>'ü bandındadır. Politika %50 ise tüketici
              kredisi <strong>%75-100</strong> faiz arar. Konut kredisi daha
              düşük (politika × 1.2-1.6).
            </p>
            <p>
              Tahmini konut kredisi aralığı:{" "}
              <strong>%{(series.lastValue * 1.2).toFixed(1)} - %{(series.lastValue * 1.6).toFixed(1)}</strong>
            </p>

            <h2>İlgili veriler</h2>
            <ul>
              <li>
                <Link href="/tufe">TÜFE enflasyon</Link> — faiz kararının ana
                gerekçesi
              </li>
              <li>
                <Link href="/doviz">Döviz kurları</Link> — faiz müdahale aracı
              </li>
              <li>
                <Link href="/konut-enflasyon">Konut enflasyon karnesi</Link>
              </li>
            </ul>
          </article>

          <AdSlot slotKey="faiz-bottom" format="responsive" className="mt-8" />

          <p className="mt-12 text-center text-xs text-muted-foreground">
            Veri kaynağı:{" "}
            <a
              href="https://evds2.tcmb.gov.tr/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:underline"
            >
              TCMB EVDS
            </a>{" "}
            · Seri kodu:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
              TP.APIFON4
            </code>
          </p>
        </>
      )}
    </div>
  );
}
