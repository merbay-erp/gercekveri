import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  BookOpen,
  DollarSign,
  Percent,
  LineChart,
  Calendar,
  Building2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { SchemaOrg } from "@/components/schema-org";
import { AdSlot } from "@/components/ad-slot";
import { SeriesHistoryChart } from "@/components/data-display/series-history-chart";
import {
  ContentSection,
  Callout,
  RelatedDataGrid,
} from "@/components/content/article-blocks";
import { eurTrySchemas } from "@/lib/schema-presets";
import {
  getTcmbSeries,
  formatTRY,
  formatPct,
  formatTcmbDate,
} from "@/lib/tcmb-series";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Euro TL Kuru — TCMB Resmi Veri, Anlık",
  description:
    "TCMB resmi EUR/TL satış kuru. Anlık değer, 12 aylık tarihçe, yıllık değişim. EVDS API'den saatte bir güncellenir.",
  alternates: { canonical: "/doviz/eur-try" },
  openGraph: {
    title: "Euro TL Kuru — TCMB Resmi Veri",
    description: "Anlık EUR/TL satış kuru + 12 aylık tarihçe.",
    type: "website",
  },
};

export default async function EurTryPage() {
  const series = await getTcmbSeries("TP.DK.EUR.S");

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <SchemaOrg
        data={eurTrySchemas({
          lastValue: series?.lastValue,
          lastDate: series?.lastDate,
        })}
      />

      <Link
        href="/doviz"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Tüm dövizler
      </Link>

      <header className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          TCMB · Resmi Veri · Saatlik güncellenir
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Euro TL Kuru (EUR/TRY)
        </h1>
        <p className="mt-3 text-muted-foreground">
          Türkiye Cumhuriyet Merkez Bankası tarafından yayınlanan resmi günlük
          EUR/TL satış kuru. EVDS API üzerinden saatte bir otomatik fetch.
        </p>
      </header>

      {!series ? (
        <Card className="border-amber-500/30 bg-amber-500/[0.04] p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <div>
              <p className="text-sm font-medium">Veri henüz hazır değil</p>
              <p className="mt-1 text-xs text-muted-foreground">
                TCMB EVDS senkronizasyonu bekleniyor. Birkaç dakika sonra
                tekrar dene.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <Card className="mb-6 p-6 border-blue-500/30 bg-gradient-to-br from-blue-500/[0.06] to-transparent">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  1 EUR =
                </p>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-5xl font-semibold tabular-nums tracking-tight">
                    {formatTRY(series.lastValue, 4)}
                  </span>
                  <span className="text-2xl font-medium text-muted-foreground">
                    TL
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Son veri: <strong>{formatTcmbDate(series.lastDate)}</strong>
                  {series.isStale ? (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-600">
                      Eski veri
                    </span>
                  ) : null}
                </p>
              </div>
              {series.yoyChangePct !== null ? (
                <div className="flex flex-col items-end">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Yıllık değişim
                  </p>
                  <div className="mt-1 flex items-center gap-1.5">
                    {series.yoyChangePct >= 0 ? (
                      <TrendingUp className="h-5 w-5 text-rose-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-emerald-500" />
                    )}
                    <span
                      className={`text-2xl font-semibold tabular-nums ${series.yoyChangePct >= 0 ? "text-rose-500" : "text-emerald-500"}`}
                    >
                      {formatPct(series.yoyChangePct, 1)}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </Card>

          {series.history && series.history.length > 0 ? (
            <Card className="mb-6 p-6">
              <h2 className="mb-1 text-sm font-semibold">12 Aylık Tarihçe</h2>
              <p className="mb-4 text-xs text-muted-foreground">
                TCMB EVDS API · saatte bir senkronize
              </p>
              <SeriesHistoryChart
                data={series.history}
                unit="TL"
                decimals={4}
                color="#3b82f6"
              />
            </Card>
          ) : null}

          <AdSlot
            slotKey="doviz-eur-mid"
            format="leaderboard"
            className="mb-12"
          />

          <div className="space-y-10">
            <ContentSection
              icon={BookOpen}
              title="EUR/TL ne demek?"
              accent="blue"
            >
              <p>
                Avrupa Birliği'nin ortak para birimi{" "}
                <strong className="text-foreground">Euro</strong>'nun Türk
                Lirası karşılığı. TCMB her iş günü saat 15:30'da günlük gösterge
                niteliğindeki kuru yayınlar.
              </p>

              <Callout type="info" title="Resmi kanonik referans">
                <strong>1 EUR ≈ {series.lastValue.toFixed(2)} TL</strong> demek,
                bankaların TCMB referansıyla yaklaşık bu fiyattan Euro satacağı
                anlamına gelir. Banka makası genelde 0.05-0.20 TL.
              </Callout>
            </ContentSection>

            <ContentSection
              icon={TrendingUp}
              title="Euro neden USD'den farklı hareket eder?"
              accent="purple"
            >
              <p>
                Eurozone ekonomisinin ABD'den farklı seyri,{" "}
                <strong className="text-foreground">ECB ve Fed</strong>'in
                farklı para politikaları, EUR/USD paritesini etkiler. Bu parite
                TL'ye dolaylı yansır.
              </p>

              <Callout type="tip" title="Euro borçlu/yatırımcı için">
                Euro'da kredi/yatırım varsa EUR/TL ayrı takip edilmelidir.
                Sadece USD/TL bakmak yanıltıcı olabilir — Euro'nun dolardan
                ayrıştığı dönemlerde EUR/TL kendi yönünü tutar.
              </Callout>
            </ContentSection>

            <ContentSection
              icon={LineChart}
              title="EUR/TL ile birlikte bakılması gerekenler"
              accent="emerald"
            >
              <RelatedDataGrid
                links={[
                  {
                    title: "USD/TL Kuru",
                    description:
                      "TCMB resmi dolar satış kuru — USD ile EUR asenkronizliğini takip et.",
                    href: "/doviz/usd-try",
                    icon: DollarSign,
                    accent: "emerald",
                  },
                  {
                    title: "Tüm Dövizler",
                    description: "USD + EUR overview, anlık karşılaştırma.",
                    href: "/doviz",
                    icon: DollarSign,
                    accent: "blue",
                  },
                  {
                    title: "TCMB Politika Faizi",
                    description: "Kur müdahale aracı — faiz yönü EUR'yu etkiler.",
                    href: "/faiz",
                    icon: Percent,
                    accent: "purple",
                  },
                  {
                    title: "TÜFE Enflasyon",
                    description: "Kur enflasyonu — özellikle Euro mal ithalatında.",
                    href: "/tufe",
                    icon: TrendingUp,
                    accent: "rose",
                  },
                ]}
              />
            </ContentSection>
          </div>

          <AdSlot
            slotKey="doviz-eur-bottom"
            format="responsive"
            className="mt-12"
          />

          <div className="mt-12 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Veri kaynağı:{" "}
            <a
              href="https://evds2.tcmb.gov.tr/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:underline"
            >
              TCMB EVDS
            </a>{" "}
            · Seri:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
              TP.DK.EUR.S
            </code>{" "}
            · Son fetch:{" "}
            {new Intl.DateTimeFormat("tr-TR", {
              dateStyle: "short",
              timeStyle: "short",
            }).format(series.fetchedAt)}
          </div>
        </>
      )}
    </div>
  );
}
