import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  Percent,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Calculator,
  Calendar,
  Wallet,
  Home,
  DollarSign,
  LineChart,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { SchemaOrg } from "@/components/schema-org";
import { AdSlot } from "@/components/ad-slot";
import { SeriesHistoryChart } from "@/components/data-display/series-history-chart";
import {
  ContentSection,
  Callout,
  KeyPointGrid,
  KeyPointBox,
  RelatedDataGrid,
} from "@/components/content/article-blocks";
import { faizSchemas } from "@/lib/schema-presets";
import {
  getTcmbSeries,
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
                  Son güncelleme:{" "}
                  <strong>{formatTcmbDate(series.lastDate)}</strong>
                </p>
              </div>
              <Percent className="h-12 w-12 text-purple-500/30" />
            </div>
          </Card>

          {series.history && series.history.length > 0 ? (
            <Card className="mb-6 p-6">
              <h2 className="mb-1 text-sm font-semibold">12 Aylık Tarihçe</h2>
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

          <AdSlot slotKey="faiz-mid" format="leaderboard" className="mb-12" />

          <div className="space-y-10">
            <ContentSection
              icon={BookOpen}
              title="Politika faizi nedir?"
              accent="purple"
            >
              <p>
                TCMB'nin bankalara verdiği{" "}
                <strong className="text-foreground">1 hafta vadeli repo</strong>{" "}
                (APİ Fonlama Oranı) — bankaların TCMB'den borçlandığı temel
                maliyettir. Şu an{" "}
                <strong className="text-foreground">
                  %{series.lastValue.toFixed(2)}
                </strong>{" "}
                seviyesinde. Bu oran tüm finansal piyasaların referansıdır.
              </p>
            </ContentSection>

            <ContentSection
              icon={TrendingUp}
              title="Faiz neden artar/azalır?"
              accent="rose"
            >
              <p>
                Para politikasının temel aracı. Enflasyon hedefiyle ilişkilidir:
              </p>

              <KeyPointGrid>
                <KeyPointBox
                  label="Enflasyon yüksek"
                  value="↑ Faiz"
                  description="Sıkı para politikası, talep azalır"
                  tone="negative"
                />
                <KeyPointBox
                  label="Enflasyon düşük"
                  value="↓ Faiz"
                  description="Gevşek para, ekonomik canlanma"
                  tone="positive"
                />
              </KeyPointGrid>

              <Callout type="info" title="Aktarım mekanizması">
                Faiz artırınca: bankalar kredi pahalanır → tüketici harcaması
                azalır → talep enflasyonu düşer. Faiz indirince tersi olur. Bu
                aktarım <strong>3-6 ay</strong> gecikmeli çalışır.
              </Callout>
            </ContentSection>

            <ContentSection
              icon={Wallet}
              title="Mevduat faizi politika faizine nasıl bağlı?"
              accent="emerald"
            >
              <p>
                Bankalar mevduat faizini politika faizinin{" "}
                <strong className="text-foreground">%80-110</strong> bandında
                belirler.
              </p>

              <KeyPointGrid>
                <KeyPointBox
                  label="Mevduat min."
                  value={`%${(series.lastValue * 0.8).toFixed(1)}`}
                  description="Politika × 0.8"
                  tone="neutral"
                />
                <KeyPointBox
                  label="Mevduat ort."
                  value={`%${(series.lastValue * 0.95).toFixed(1)}`}
                  description="Politika × 0.95"
                  tone="positive"
                />
                <KeyPointBox
                  label="Mevduat max."
                  value={`%${(series.lastValue * 1.05).toFixed(1)}`}
                  description="Politika × 1.05"
                  tone="positive"
                />
                <KeyPointBox
                  label="Vergi sonrası net"
                  value={`~%${(series.lastValue * 0.95 * 0.85).toFixed(1)}`}
                  description="−%15 vergi"
                  tone="warning"
                />
              </KeyPointGrid>

              <Callout type="tip" title="Yüksek mevduat faizi pazarlığı">
                500.000 TL üzeri mevduatta bankayla pazarlık edilebilir.
                Promosyon dönemlerinde politika × 1.10 mümkün.
              </Callout>
            </ContentSection>

            <ContentSection
              icon={Calculator}
              title="Kredi faizine etki"
              accent="amber"
            >
              <p>
                Tüketici kredisi faizi genelde politika faizinin{" "}
                <strong className="text-foreground">%150-200</strong>'ü
                bandındadır. Konut kredisi daha düşük (politika × 1.2-1.6).
              </p>

              <KeyPointGrid>
                <KeyPointBox
                  label="Konut kredisi min."
                  value={`%${(series.lastValue * 1.2).toFixed(1)}`}
                  description="Politika × 1.2"
                  tone="positive"
                />
                <KeyPointBox
                  label="Konut kredisi ort."
                  value={`%${(series.lastValue * 1.4).toFixed(1)}`}
                  description="Politika × 1.4"
                  tone="warning"
                />
                <KeyPointBox
                  label="Tüketici kredisi"
                  value={`%${(series.lastValue * 1.75).toFixed(1)}`}
                  description="Politika × 1.75"
                  tone="negative"
                />
                <KeyPointBox
                  label="İhtiyaç kredisi"
                  value={`%${(series.lastValue * 2.0).toFixed(1)}`}
                  description="Politika × 2.0"
                  tone="negative"
                />
              </KeyPointGrid>
            </ContentSection>

            <ContentSection
              icon={LineChart}
              title="Politika faizi ile birlikte bakılması gerekenler"
              accent="emerald"
            >
              <RelatedDataGrid
                links={[
                  {
                    title: "TÜFE Enflasyon",
                    description:
                      "Faiz kararının ana gerekçesi — TÜFE > faiz olduğunda reel faiz negatif.",
                    href: "/tufe",
                    icon: TrendingUp,
                    accent: "rose",
                  },
                  {
                    title: "USD/TL Kuru",
                    description:
                      "Yüksek faiz → TL'ye geçiş → kur düşer. Faiz indirimi → tersi.",
                    href: "/doviz/usd-try",
                    icon: DollarSign,
                    accent: "emerald",
                  },
                  {
                    title: "Konut Enflasyon Karnesi",
                    description:
                      "Konut kredisi faizi konut piyasasını doğrudan etkiler.",
                    href: "/konut-enflasyon",
                    icon: Home,
                    accent: "amber",
                  },
                  {
                    title: "EUR/TL Kuru",
                    description:
                      "ECB-TCMB faiz farkı EUR/TL paritesini yönlendirir.",
                    href: "/doviz/eur-try",
                    icon: DollarSign,
                    accent: "blue",
                  },
                ]}
              />
            </ContentSection>
          </div>

          <AdSlot slotKey="faiz-bottom" format="responsive" className="mt-12" />

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
              TP.APIFON4
            </code>
          </div>
        </>
      )}
    </div>
  );
}
