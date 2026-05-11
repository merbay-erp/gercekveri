import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronLeft,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  BookOpen,
  Building2,
  Calculator,
  Percent,
  DollarSign,
  LineChart,
  Calendar,
  TrendingUp as TrendIcon,
  Wallet,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { SchemaOrg } from "@/components/schema-org";
import { AdSlot } from "@/components/ad-slot";
import { SeriesHistoryChart } from "@/components/data-display/series-history-chart";
import {
  ContentSection,
  Callout,
  DefinitionList,
  RelatedDataGrid,
} from "@/components/content/article-blocks";
import { usdTrySchemas } from "@/lib/schema-presets";
import {
  getTcmbSeries,
  formatTRY,
  formatPct,
  formatTcmbDate,
} from "@/lib/tcmb-series";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Dolar TL Kuru — TCMB Resmi Veri, Anlık",
  description:
    "TCMB resmi USD/TL satış kuru. Anlık değer, 12 aylık tarihçe, yıllık değişim. EVDS API'den saatte bir güncellenir.",
  alternates: { canonical: "/doviz/usd-try" },
  openGraph: {
    title: "Dolar TL Kuru — TCMB Resmi Veri",
    description: "Anlık USD/TL satış kuru + 12 aylık tarihçe.",
    type: "website",
  },
};

export default async function UsdTryPage() {
  const series = await getTcmbSeries("TP.DK.USD.S");

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <SchemaOrg
        data={usdTrySchemas({
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
          Dolar TL Kuru (USD/TRY)
        </h1>
        <p className="mt-3 text-muted-foreground">
          Türkiye Cumhuriyet Merkez Bankası tarafından yayınlanan resmi günlük
          USD/TL satış kuru. EVDS API üzerinden saatte bir otomatik fetch.
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
          {/* Anlık değer kartı */}
          <Card className="mb-6 p-6 border-emerald-500/30 bg-gradient-to-br from-emerald-500/[0.06] to-transparent">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  1 USD =
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
                color="#22c55e"
              />
            </Card>
          ) : null}

          <AdSlot slotKey="doviz-usd-mid" format="leaderboard" className="mb-12" />

          {/* CONTENT */}
          <div className="space-y-10">
            <ContentSection
              icon={BookOpen}
              title="USD/TL kuru ne anlama geliyor?"
              accent="emerald"
            >
              <p>
                TCMB'nin günlük yayınladığı USD/TL satış kuru, Türkiye'de{" "}
                <strong className="text-foreground">
                  ithalat-ihracat, döviz mevduatı, kredi geri ödemesi ve
                  enflasyon beklentisi
                </strong>{" "}
                için temel referans göstergesidir.
              </p>

              <Callout type="info" title="Kanonik referans">
                <strong>1 dolar ≈ {series.lastValue.toFixed(2)} TL</strong> demek,
                bankaların TCMB referansıyla yaklaşık bu fiyattan dolar satacağı
                anlamına gelir. TCMB serbest kur sistemi uygular — günlük
                gösterge kuru saat 15:30'da yayınlanır.
              </Callout>
            </ContentSection>

            <ContentSection
              icon={TrendIcon}
              title="Yıllık değişim niye önemli?"
              accent="rose"
            >
              <p>
                Yıllık değişim oranı, TL'nin dolar karşısında 12 ayda ne kadar
                değer kaybettiğini gösterir. Enflasyon hesaplamaları, ücret
                ayarlamaları ve yatırım kararları için bu rakam{" "}
                <strong className="text-foreground">kritiktir</strong>.
              </p>

              {series.yoyChangePct !== null ? (
                <Callout
                  type={series.yoyChangePct > 0 ? "warning" : "success"}
                  title={
                    series.yoyChangePct > 0
                      ? "TL değer kaybediyor"
                      : "TL değer kazanıyor"
                  }
                >
                  {series.yoyChangePct > 0
                    ? `Son 12 ayda USD/TL %${series.yoyChangePct.toFixed(1)} arttı. Bu TL'nin dolar karşısında zayıfladığı anlamına gelir — döviz borçlusu için maliyet artar, ihracatçı için avantaj artar.`
                    : `Son 12 ayda USD/TL %${Math.abs(series.yoyChangePct).toFixed(1)} azaldı. TL dolar karşısında güçlendi — ithalatçı için avantaj, ihracatçı için baskı.`}
                </Callout>
              ) : null}
            </ContentSection>

            <ContentSection
              icon={Calculator}
              title="Bankalardaki dolar kuru neden farklı?"
              accent="blue"
            >
              <p>
                TCMB tek bir referans satış kuru yayınlar. Bankalar buna kendi{" "}
                <strong className="text-foreground">alış-satış marjını</strong>{" "}
                ekler:
              </p>

              <DefinitionList
                items={[
                  {
                    icon: TrendingUp,
                    term: "Banka satış kuru",
                    description: "TCMB referans + 0.05-0.20 TL marj",
                  },
                  {
                    icon: TrendingDown,
                    term: "Banka alış kuru",
                    description: "TCMB referans − 0.05-0.20 TL marj",
                  },
                  {
                    icon: Wallet,
                    term: "Kambiyo bürosu",
                    description: "Makas genelde 0.20-0.50 TL — daha geniş",
                  },
                ]}
              />

              <Callout type="tip" title="Pazarlık yapılabilir mi?">
                Büyük tutarlarda evet — kurumsal müşteriler için bankayla
                referans+0.02 TL bandında özel kurlar mümkündür. Bireysel
                100.000 TL+ işlemde de pazarlık denenebilir.
              </Callout>
            </ContentSection>

            <ContentSection
              icon={Percent}
              title="Faiz - kur ilişkisi"
              accent="purple"
            >
              <p>
                TCMB politika faizi yükselince TL faizi cazip hale gelir →
                döviz mevduatından TL'ye geçiş → USD/TL düşer. Faiz düşünce
                tersi olur. Bu yüzden kur takibi ile faiz takibi birlikte
                anlam kazanır.
              </p>
            </ContentSection>

            <ContentSection
              icon={LineChart}
              title="USD/TL ile birlikte bakılması gerekenler"
              accent="emerald"
            >
              <RelatedDataGrid
                links={[
                  {
                    title: "EUR/TL Kuru",
                    description:
                      "Avrupa ile ticaret + Euro yatırımı için referans. USD ile asenkronizlik takibi.",
                    href: "/doviz/eur-try",
                    icon: DollarSign,
                    accent: "blue",
                  },
                  {
                    title: "TCMB Politika Faizi",
                    description:
                      "Kur müdahale aracı — faiz yön kararı kur'u doğrudan etkiler.",
                    href: "/faiz",
                    icon: Percent,
                    accent: "purple",
                  },
                  {
                    title: "TÜFE Enflasyon",
                    description:
                      "Kur enflasyonu tetikler — özellikle ithalat-yoğun sepette etki büyük.",
                    href: "/tufe",
                    icon: TrendingUp,
                    accent: "rose",
                  },
                  {
                    title: "Konut Enflasyon Karnesi",
                    description:
                      "Kur + enflasyon konuta nasıl yansıyor — 19 bölge karşılaştırma.",
                    href: "/konut-enflasyon",
                    icon: Building2,
                    accent: "amber",
                  },
                ]}
              />
            </ContentSection>
          </div>

          <AdSlot
            slotKey="doviz-usd-bottom"
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
              TP.DK.USD.S
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
