import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, TrendingDown, AlertCircle, BarChart3 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SchemaOrg } from "@/components/schema-org";
import { AdSlot } from "@/components/ad-slot";
import { SeriesHistoryChart } from "@/components/data-display/series-history-chart";
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
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            {/* Endeks değeri */}
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

            {/* Yıllık değişim — kritik */}
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

          <AdSlot slotKey="tufe-mid" format="leaderboard" />

          <article className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
            <h2>TÜFE nedir?</h2>
            <p>
              <strong>Tüketici Fiyat Endeksi</strong> — bir tüketicinin satın
              aldığı tipik mal ve hizmet sepetinin zaman içindeki fiyat
              değişimi. TÜİK her ayın 3. iş günü açıklar, TCMB EVDS üzerinden
              dağıtır.
            </p>

            <h2>TÜFE neden önemli?</h2>
            <ul>
              <li>
                <strong>Enflasyon ölçütü</strong> — yıllık TÜFE artışı = yıllık
                enflasyon oranı.
              </li>
              <li>
                <strong>Maaş ayarlaması</strong> — toplu sözleşmeler ve memur
                zamlarında referans alınır.
              </li>
              <li>
                <strong>Kira artışı</strong> — yıllık kira artışı en fazla TÜFE
                kadar yapılabilir (TÜFE Yoy üst sınır).
              </li>
              <li>
                <strong>Para politikası</strong> — TCMB faiz kararını TÜFE
                hedefine göre verir.
              </li>
            </ul>

            <h2>TÜFE alt kalemleri</h2>
            <p>
              TÜFE 12 ana harcama grubuna ayrılır: gıda, alkol-tütün, giyim,
              konut, ev eşyası, sağlık, ulaştırma, haberleşme, eğlence, eğitim,
              lokanta-otel, çeşitli mal-hizmet. Her grubun ağırlığı tüketici
              harcama oranına göre yıllık güncellenir.
            </p>

            <h2>TÜFE vs gerçek hayat</h2>
            <p>
              Resmi TÜFE genel ortalamadır. Bireysel tüketici sepetiniz bundan
              sapabilir — kiranızı yeni başlattıysanız konut etkisi çok daha
              güçlü olabilir.
              {series.yoyChangePct !== null
                ? ` Şu an resmi yıllık enflasyon %${series.yoyChangePct.toFixed(1)} — sizin sepetiniz farklı olabilir.`
                : ""}
            </p>
            <p>
              <Link href="/konut-enflasyon">
                Konut enflasyon karnesi
              </Link>{" "}
              ile bölgenizdeki konut fiyatlarının TÜFE'ye karşı performansını
              ölç. {/* */}
              <Link href="/kira">Gerçek kira verisi</Link> ile resmi
              istatistikleri karşılaştır.
            </p>

            <h2>Çekirdek TÜFE (C)</h2>
            <p>
              Enerji, gıda, alkol-tütün ve altın hariç tutulan bir endeks. Daha
              az dalgalı olduğu için para politikasında daha güvenilir referans
              olarak kullanılır.
            </p>

            <h2>İlgili veriler</h2>
            <ul>
              <li>
                <Link href="/faiz">TCMB Politika Faizi</Link> — enflasyona
                müdahale aracı
              </li>
              <li>
                <Link href="/doviz">Döviz kurları</Link> — kur enflasyonu
                tetikler
              </li>
              <li>
                <Link href="/konut-enflasyon">Konut enflasyon karnesi</Link>
              </li>
              <li>
                <Link href="/kira">Gerçek kira fiyatları</Link>
              </li>
              <li>
                <Link href="/maaslar">Gerçek maaşlar</Link>
              </li>
            </ul>
          </article>

          <AdSlot slotKey="tufe-bottom" format="responsive" className="mt-8" />

          <p className="mt-12 text-center text-xs text-muted-foreground">
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
          </p>
        </>
      )}
    </div>
  );
}
