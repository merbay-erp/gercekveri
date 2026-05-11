import type { Metadata } from "next";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Info,
  BookOpen,
  BarChart3,
  Calendar,
  Briefcase,
  Home,
  Percent,
  DollarSign,
  LineChart,
  Package,
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
import { tufeSchemas } from "@/lib/schema-presets";
import {
  getTcmbSeries,
  formatPct,
  formatTcmbDate,
} from "@/lib/tcmb-series";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "TÜFE Enflasyon — Anlık Resmi Veri (TÜİK / TCMB)",
  description:
    "Tüketici Fiyat Endeksi (TÜFE) son değer, yıllık değişim ve 12 aylık tarihçe. Türkiye'de enflasyonun resmi ölçütü.",
  alternates: { canonical: "/tufe" },
  openGraph: {
    title: "TÜFE Enflasyon — Anlık",
    description: "Yıllık enflasyon oranı + 12 aylık trend.",
    type: "website",
  },
};

export default async function TufePage() {
  const series = await getTcmbSeries("TP.FE.OKTG01");

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <SchemaOrg
        data={tufeSchemas({
          yoyPct: series?.yoyChangePct ?? undefined,
          lastDate: series?.lastDate,
        })}
      />

      <header className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          TÜİK · TCMB EVDS · Aylık
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Türkiye Enflasyon (TÜFE)
        </h1>
        <p className="mt-3 text-muted-foreground">
          Tüketici Fiyat Endeksi — Türkiye'de tüketicinin satın aldığı mal ve
          hizmet sepetinin fiyat değişimi. TÜİK her ayın 3. iş günü açıklar.
        </p>
      </header>

      {!series ? (
        <Card className="border-amber-500/30 bg-amber-500/[0.04] p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
            <p className="text-sm">TCMB EVDS senkronizasyonu bekleniyor.</p>
          </div>
        </Card>
      ) : (
        <>
          {/* Hero data cards */}
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Endeks değeri
              </p>
              <p className="mt-1 text-3xl font-semibold tabular-nums">
                {series.lastValue.toFixed(2)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {formatTcmbDate(series.lastDate)}
              </p>
            </Card>

            <Card className="p-5 border-rose-500/30 bg-gradient-to-br from-rose-500/[0.06] to-transparent">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Yıllık değişim (TÜFE Yoy)
              </p>
              {series.yoyChangePct !== null ? (
                <div className="mt-1 flex items-center gap-2">
                  {series.yoyChangePct >= 0 ? (
                    <TrendingUp className="h-6 w-6 text-rose-500" />
                  ) : (
                    <TrendingDown className="h-6 w-6 text-emerald-500" />
                  )}
                  <span
                    className={`text-3xl font-semibold tabular-nums ${series.yoyChangePct >= 0 ? "text-rose-500" : "text-emerald-500"}`}
                  >
                    {formatPct(series.yoyChangePct, 1)}
                  </span>
                </div>
              ) : (
                <p className="mt-1 text-3xl font-semibold tabular-nums">-</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                100 TL'lik sepet bugün {(100 + (series.yoyChangePct ?? 0)).toFixed(0)} TL
              </p>
            </Card>
          </div>

          {series.history && series.history.length > 0 ? (
            <Card className="mb-6 p-6">
              <h2 className="mb-1 text-sm font-semibold">
                TÜFE Endeks Tarihçesi (12 ay)
              </h2>
              <p className="mb-4 text-xs text-muted-foreground">
                TCMB EVDS · TÜİK kaynak
              </p>
              <SeriesHistoryChart
                data={series.history}
                unit=""
                decimals={2}
                color="#f43f5e"
              />
            </Card>
          ) : null}

          <AdSlot slotKey="tufe-mid" format="leaderboard" className="mb-12" />

          {/* CONTENT BLOCKS — eski düz prose yerine tasarlanmış componentler */}
          <div className="space-y-10">
            <ContentSection icon={BookOpen} title="TÜFE nedir?" accent="blue">
              <p>
                <strong className="text-foreground">Tüketici Fiyat Endeksi</strong>{" "}
                — bir tüketicinin satın aldığı tipik mal ve hizmet sepetinin
                zaman içindeki fiyat değişimi. TÜİK her ayın <strong>3. iş günü</strong>
                {" "}açıklar, TCMB EVDS üzerinden dağıtır.
              </p>

              <Callout type="info" title="Resmi metodoloji">
                TÜFE, 12 ana harcama grubuna (gıda, alkol-tütün, giyim, konut,
                ev eşyası, sağlık, ulaştırma, haberleşme, eğlence, eğitim,
                lokanta-otel, çeşitli mal-hizmet) ayrılır. Her grubun ağırlığı
                tüketici harcama oranına göre <strong>yıllık güncellenir</strong>.
              </Callout>
            </ContentSection>

            <ContentSection
              icon={TrendingUp}
              title="TÜFE neden önemli?"
              accent="rose"
            >
              <p>
                Yıllık TÜFE artışı doğrudan{" "}
                <strong className="text-foreground">enflasyon oranı</strong>
                'dır. Türkiye ekonomisinin onlarca kritik kararını şekillendirir:
              </p>

              <DefinitionList
                items={[
                  {
                    icon: Briefcase,
                    term: "Maaş ayarlaması",
                    description:
                      "Toplu sözleşmeler, memur zamları ve asgari ücret artışı TÜFE'ye göre belirlenir. Yıllık TÜFE %X ise, maaş artışı genelde bunun ±%5 bandında olur.",
                  },
                  {
                    icon: Home,
                    term: "Kira artışı üst sınırı",
                    description:
                      "Yasal düzenlemeye göre yıllık kira artışı en fazla TÜFE oranında yapılabilir (12 aylık ortalama TÜFE). 2023 sonrası bu kuralla kira piyasası daha öngörülebilir.",
                  },
                  {
                    icon: Percent,
                    term: "Para politikası",
                    description:
                      "TCMB politika faizini, enflasyon hedefine göre yönlendirir. Yüksek enflasyon → sıkı para politikası (yüksek faiz) → talep düşüşü → enflasyon iniş.",
                  },
                  {
                    icon: DollarSign,
                    term: "Yatırım kararı",
                    description:
                      "Mevduat, hisse senedi, gayrimenkul — hepsinin getirisi 'reel' olarak TÜFE'den çıkartılır. Nominal getiri %50 ise TÜFE %30, reel getirin sadece %15.",
                  },
                ]}
              />
            </ContentSection>

            <ContentSection
              icon={BarChart3}
              title="TÜFE alt kalemleri"
              accent="purple"
            >
              <p>
                TÜFE, tek bir rakam gibi görünür ama 12 farklı harcama
                grubunun ağırlıklı ortalamasıdır. Sepetin içinde ne var?
              </p>

              <div className="my-4 grid gap-2 sm:grid-cols-2">
                {[
                  { name: "Gıda ve alkolsüz içecek", weight: "~25%" },
                  { name: "Konut, su, elektrik, gaz", weight: "~14%" },
                  { name: "Ulaştırma", weight: "~13%" },
                  { name: "Lokanta ve otel", weight: "~10%" },
                  { name: "Ev eşyası", weight: "~7%" },
                  { name: "Giyim ve ayakkabı", weight: "~6%" },
                  { name: "Sağlık", weight: "~4%" },
                  { name: "Eğitim", weight: "~3%" },
                  { name: "Eğlence ve kültür", weight: "~3%" },
                  { name: "Haberleşme", weight: "~3%" },
                  { name: "Alkollü içecek + tütün", weight: "~5%" },
                  { name: "Çeşitli mal ve hizmet", weight: "~7%" },
                ].map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-md border border-border/60 bg-card px-3 py-2 text-sm"
                  >
                    <span className="text-foreground">{item.name}</span>
                    <span className="tabular-nums font-medium text-muted-foreground">
                      {item.weight}
                    </span>
                  </div>
                ))}
              </div>

              <Callout type="tip" title="Çekirdek TÜFE (C)">
                Enerji, gıda, alkol-tütün ve altın hariç tutulan bir endeks.
                Daha az dalgalı olduğu için para politikasında daha güvenilir
                referans olarak kullanılır.
              </Callout>
            </ContentSection>

            <ContentSection
              icon={Info}
              title="TÜFE vs gerçek hayat"
              accent="amber"
            >
              <p>
                Resmi TÜFE <strong>Türkiye geneli ortalamasıdır</strong>.
                Bireysel tüketici sepetin bundan sapabilir. Örneğin:
              </p>

              <Callout type="warning" title="Sizin enflasyonunuz farklı olabilir">
                {series.yoyChangePct !== null ? (
                  <>
                    Şu an resmi yıllık enflasyon{" "}
                    <strong>%{series.yoyChangePct.toFixed(1)}</strong>. Ama kiranızı
                    yeni başlattıysanız konut etkisi sepetinizde 2-3x daha
                    güçlü olabilir. Çocuğunuz okula gidiyorsa eğitim
                    kalemi öne çıkar. Bireysel enflasyonunuz resmi rakamdan
                    farklı seyredebilir.
                  </>
                ) : (
                  "Bireysel tüketici sepetiniz Türkiye ortalamasından farklı seyredebilir. Konut, eğitim, sağlık gibi kalemlerin ağırlığı kişiden kişiye değişir."
                )}
              </Callout>

              <p>
                Konut tarafının resmi TÜFE'ye göre nasıl seyrettiğini görmek
                için{" "}
                <Link
                  href="/konut-enflasyon"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  konut enflasyon karnesi
                </Link>
                'ne, gerçek kira ödemelerini görmek için{" "}
                <Link
                  href="/kira"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  anonim kira verisi
                </Link>
                'ne göz at.
              </p>
            </ContentSection>

            <ContentSection
              icon={LineChart}
              title="TÜFE ile birlikte bakman gereken veriler"
              accent="emerald"
            >
              <RelatedDataGrid
                links={[
                  {
                    title: "TCMB Politika Faizi",
                    description:
                      "Enflasyona müdahale aracı — yüksek faiz, talep frenler.",
                    href: "/faiz",
                    icon: Percent,
                    accent: "purple",
                  },
                  {
                    title: "Döviz Kurları",
                    description:
                      "Kur enflasyonu tetikler — ithalat-yoğun sepette etki büyük.",
                    href: "/doviz",
                    icon: DollarSign,
                    accent: "emerald",
                  },
                  {
                    title: "Konut Enflasyon Karnesi",
                    description:
                      "19 NUTS-2 bölge için TÜFE vs KFE — konut yatırımı reel mi?",
                    href: "/konut-enflasyon",
                    icon: Home,
                    accent: "rose",
                  },
                  {
                    title: "Gerçek Maaşlar",
                    description:
                      "Pozisyon × şehir bazında anonim net maaşlar — reel kazanç ölç.",
                    href: "/maaslar",
                    icon: Briefcase,
                    accent: "blue",
                  },
                  {
                    title: "Gerçek Kira Fiyatları",
                    description:
                      "İlan değil, gerçek ödenen kiralar — yıllık artış üst sınırı kontrolü.",
                    href: "/kira",
                    icon: Home,
                    accent: "amber",
                  },
                  {
                    title: "Faturalar",
                    description:
                      "Elektrik, doğalgaz, su — mevsimsel normalizasyon dahil.",
                    href: "/fatura",
                    icon: Package,
                    accent: "muted",
                  },
                ]}
              />
            </ContentSection>
          </div>

          <AdSlot slotKey="tufe-bottom" format="responsive" className="mt-12" />

          <div className="mt-12 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            Veri kaynağı:{" "}
            <a
              href="https://www.tuik.gov.tr/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:underline"
            >
              TÜİK
            </a>{" "}
            ·{" "}
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
              TP.FE.OKTG01
            </code>
          </div>
        </>
      )}
    </div>
  );
}
