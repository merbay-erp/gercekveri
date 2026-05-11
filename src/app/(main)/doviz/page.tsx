import type { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  ChevronRight,
  BookOpen,
  Calculator,
  AlertTriangle,
  Building2,
  Calendar,
  DollarSign,
  Percent,
  Home,
  LineChart,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { SchemaOrg } from "@/components/schema-org";
import { AdSlot } from "@/components/ad-slot";
import {
  ContentSection,
  Callout,
  DefinitionList,
  RelatedDataGrid,
} from "@/components/content/article-blocks";
import { dovizHubSchemas } from "@/lib/schema-presets";
import {
  getTcmbSeriesBatch,
  formatTRY,
  formatPct,
  formatTcmbDate,
} from "@/lib/tcmb-series";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Döviz Kurları — TCMB Resmi Anlık Veri",
  description:
    "Dolar, Euro ve diğer döviz kurları. TCMB EVDS API'den saatte bir güncellenir. Anlık değer + 12 aylık tarihçe + yıllık değişim.",
  alternates: { canonical: "/doviz" },
  openGraph: {
    title: "Döviz Kurları — TCMB Anlık",
    description: "USD, EUR resmi TCMB satış kuru ve tarihçe.",
    type: "website",
  },
};

interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  emoji: string;
  href: string;
  accentClass: string;
}

const CURRENCIES: CurrencyConfig[] = [
  {
    code: "TP.DK.USD.S",
    name: "Amerikan Doları",
    symbol: "USD",
    emoji: "🇺🇸",
    href: "/doviz/usd-try",
    accentClass: "border-emerald-500/30 hover:border-emerald-500/60",
  },
  {
    code: "TP.DK.EUR.S",
    name: "Euro",
    symbol: "EUR",
    emoji: "🇪🇺",
    href: "/doviz/eur-try",
    accentClass: "border-blue-500/30 hover:border-blue-500/60",
  },
];

export default async function DovizHubPage() {
  const codes = CURRENCIES.map((c) => c.code);
  const seriesMap = await getTcmbSeriesBatch(codes);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <SchemaOrg data={dovizHubSchemas()} />

      <header className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          TCMB · Resmi Veri · Saatlik
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Döviz Kurları
        </h1>
        <p className="mt-3 text-muted-foreground">
          Türkiye Cumhuriyet Merkez Bankası (TCMB) tarafından yayınlanan resmi
          döviz kurları. EVDS API üzerinden saatte bir otomatik fetch —
          bankalar arası referans değer.
        </p>
      </header>

      <Callout type="info" title="TCMB referans kuru — Banka kuru değil">
        Burada gösterilen değerler TCMB'nin yayınladığı{" "}
        <strong>resmi satış kurudur</strong>. Bankaların kendi alış-satış
        kurları bu referansa 0.05-0.20 TL marj eklenerek belirlenir.
      </Callout>

      {/* Currency cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {CURRENCIES.map((cur) => {
          const series = seriesMap[cur.code];
          if (!series) {
            return (
              <Card
                key={cur.code}
                className={`p-6 ${cur.accentClass} transition`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cur.emoji}</span>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">
                      {cur.symbol} / TRY
                    </p>
                    <p className="text-sm font-medium">{cur.name}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Veri yükleniyor...
                </p>
              </Card>
            );
          }

          return (
            <Link key={cur.code} href={cur.href} className="group">
              <Card
                className={`h-full p-6 transition ${cur.accentClass} group-hover:shadow-md`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cur.emoji}</span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">
                        {cur.symbol} / TRY
                      </p>
                      <p className="text-sm font-medium">{cur.name}</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1" />
                </div>

                <div className="mt-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-semibold tabular-nums tracking-tight">
                      {formatTRY(series.lastValue, 4)}
                    </span>
                    <span className="text-base text-muted-foreground">TL</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {formatTcmbDate(series.lastDate)}
                  </p>
                </div>

                {series.yoyChangePct !== null ? (
                  <div className="mt-4 flex items-center gap-2 border-t border-border/50 pt-3">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Yıllık:
                    </span>
                    <div className="flex items-center gap-1">
                      {series.yoyChangePct >= 0 ? (
                        <TrendingUp className="h-3.5 w-3.5 text-rose-500" />
                      ) : (
                        <TrendingDown className="h-3.5 w-3.5 text-emerald-500" />
                      )}
                      <span
                        className={`text-sm font-semibold tabular-nums ${series.yoyChangePct >= 0 ? "text-rose-500" : "text-emerald-500"}`}
                      >
                        {formatPct(series.yoyChangePct, 1)}
                      </span>
                    </div>
                  </div>
                ) : null}
              </Card>
            </Link>
          );
        })}
      </div>

      <AdSlot slotKey="doviz-hub-mid" format="leaderboard" className="mt-8 mb-12" />

      {/* CONTENT BLOCKS */}
      <div className="space-y-10">
        <ContentSection
          icon={BookOpen}
          title="Döviz kurları nereden geliyor?"
          accent="emerald"
        >
          <p>
            Tüm değerler{" "}
            <strong className="text-foreground">
              Türkiye Cumhuriyet Merkez Bankası (TCMB)
            </strong>{" "}
            Elektronik Veri Dağıtım Sistemi (EVDS) resmi API'sinden çekilir.
            gercekveri.com bu veriyi <strong>saatte bir</strong> cache'ler.
          </p>

          <Callout type="info" title="TCMB Gösterge Kuru ne demek?">
            Her iş günü saat <strong>15:30'da</strong> TCMB günün döviz alış-satış
            kurunu açıklar. Bu bankaların gün boyu kullandığı referans değerdir —
            "gösterge" terimi, gerçek piyasa fiyatına yön veren ana sinyal anlamında.
          </Callout>
        </ContentSection>

        <ContentSection
          icon={Calculator}
          title="Bankalardaki kur neden farklı?"
          accent="blue"
        >
          <p>
            TCMB tek bir referans satış kuru yayınlar. Bankalar buna kendi
            alış-satış marjını ekler:
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
                icon: Calculator,
                term: "Kambiyo bürosu",
                description: "Makas genelde 0.20-0.50 TL — daha geniş",
              },
              {
                icon: DollarSign,
                term: "Online platformlar",
                description: "Forex broker'lar 0.001-0.01 TL spread (kurumsal)",
              },
            ]}
          />

          <Callout type="warning" title="Spread maliyeti hesaplaması">
            500.000 TL'lik dolar alımı yaparken banka spread'i 0.15 TL ise{" "}
            <strong>~3.000 TL ek maliyet</strong> doğar. Büyük tutarlarda mutlaka
            bankayla pazarlık et — kurumsal müşterilerde referans+0.02 TL bandı
            mümkün.
          </Callout>
        </ContentSection>

        <ContentSection
          icon={AlertTriangle}
          title="Yatırım amaçlı dövize giriş"
          accent="amber"
        >
          <p>
            Döviz yatırımı yapıyorsan dikkat etmen gereken 4 şey:
          </p>

          <DefinitionList
            items={[
              {
                icon: Building2,
                term: "Reel getiri",
                description:
                  "Kur artışı + faiz − enflasyon = reel getiri. TÜFE %30 + USD %35 artış varsa reel getirin sadece %5.",
              },
              {
                icon: Calculator,
                term: "Spread'i hesaba kat",
                description:
                  "Giriş + çıkış spread'i = toplam %0.5-1.5 maliyet. Kısa vadeli trade'lerde bu önemli.",
              },
              {
                icon: Percent,
                term: "Faiz farkı",
                description:
                  "TL faizi %50, USD faizi %5 ise carry trade ile TL'de kalmak avantajlı. Faiz değişimleri kur yönünü değiştirir.",
              },
              {
                icon: TrendingDown,
                term: "Müdahale riski",
                description:
                  "TCMB acil rezerv satışı yapabilir — beklenmedik kur düşüşleri olur. Stop-loss kullan.",
              },
            ]}
          />
        </ContentSection>

        <ContentSection
          icon={Calendar}
          title="Veri güncellik garantisi"
          accent="purple"
        >
          <Callout type="success" title="Saatlik senkron">
            EVDS API'den her saat başı otomatik fetch yapılır. TCMB resmi
            yayını günde 1 kez (15:30), gercekveri 24 saat bu değeri canlı
            tutar. Stale veri durumunda kart üzerinde "eski veri" badge
            görünür.
          </Callout>

          <p>
            Veri kaynak: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">TP.DK.USD.S</code>{" "}
            ve <code className="rounded bg-muted px-1.5 py-0.5 text-xs">TP.DK.EUR.S</code>{" "}
            serileri — TCMB'nin döviz kurları endeksinde resmi tanımlı kodlar.
          </p>
        </ContentSection>

        <ContentSection
          icon={LineChart}
          title="Döviz ile birlikte bakılması gerekenler"
          accent="emerald"
        >
          <RelatedDataGrid
            links={[
              {
                title: "USD/TL Detaylı",
                description:
                  "Anlık dolar + 12 aylık tarihçe grafiği + analiz.",
                href: "/doviz/usd-try",
                icon: DollarSign,
                accent: "emerald",
              },
              {
                title: "EUR/TL Detaylı",
                description: "Anlık Euro + tarihçe + Euro-USD parity analizi.",
                href: "/doviz/eur-try",
                icon: DollarSign,
                accent: "blue",
              },
              {
                title: "TCMB Politika Faizi",
                description:
                  "Kur'un en güçlü belirleyicisi — yüksek faiz TL'yi cazip yapar.",
                href: "/faiz",
                icon: Percent,
                accent: "purple",
              },
              {
                title: "TÜFE Enflasyon",
                description:
                  "Kur enflasyona, enflasyon kura yansır — birbirini besler.",
                href: "/tufe",
                icon: TrendingUp,
                accent: "rose",
              },
              {
                title: "Konut Enflasyon Karnesi",
                description:
                  "Kur yüksekken konut fiyatları nasıl seyrediyor — 19 bölge analizi.",
                href: "/konut-enflasyon",
                icon: Home,
                accent: "amber",
              },
              {
                title: "Maaş Endeksi",
                description:
                  "Dolar bazında reel maaşın ne kadar değişti — anonim halk verisi.",
                href: "/maaslar",
                icon: Calculator,
                accent: "muted",
              },
            ]}
          />
        </ContentSection>
      </div>

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
        · saatlik senkron · 2 döviz çifti aktif (USD, EUR)
      </div>
    </div>
  );
}
