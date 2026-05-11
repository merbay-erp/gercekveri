import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, TrendingDown, ChevronRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { SchemaOrg } from "@/components/schema-org";
import { AdSlot } from "@/components/ad-slot";
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
          döviz kurları. EVDS API üzerinden saatte bir otomatik fetch — bankalar
          arası referans değer.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
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

      <AdSlot slotKey="doviz-hub-mid" format="leaderboard" className="mt-8" />

      <article className="prose prose-neutral dark:prose-invert mt-12 max-w-none">
        <h2>Döviz kurları nereden geliyor?</h2>
        <p>
          Tüm değerler <strong>Türkiye Cumhuriyet Merkez Bankası (TCMB)</strong>{" "}
          Elektronik Veri Dağıtım Sistemi (EVDS) resmi API'sinden çekilir.
          gercekveri.com bu veriyi saatte bir cache'ler — TCMB'nin günlük
          gösterge kuru, bankaların referans aldığı resmi değerdir.
        </p>

        <h2>Bankalardaki kur neden farklı?</h2>
        <p>
          TCMB tek bir referans satış kuru yayınlar (örneğin USD için saat
          15:30'da). Bankalar buna kendi 'alış-satış' marjını ekler:
        </p>
        <ul>
          <li>
            <strong>Banka satış kuru</strong> = TCMB referans + 0.05-0.20 TL
          </li>
          <li>
            <strong>Banka alış kuru</strong> = TCMB referans − 0.05-0.20 TL
          </li>
        </ul>
        <p>
          Yatırım amaçlı dövize giriş/çıkış yapıyorsan büyük tutarlarda spread'i
          dikkate al — küçük ölçekli işlemlerde bile bu fark binde 2-5 maliyet
          demektir.
        </p>

        <h2>İlgili sayfalar</h2>
        <ul>
          <li>
            <Link href="/tufe">TÜFE enflasyon</Link> — kur ile birlikte
            satın alma gücünü etkiler
          </li>
          <li>
            <Link href="/faiz">Politika faizi</Link> — kur müdahale aracı
          </li>
          <li>
            <Link href="/konut-enflasyon">Konut enflasyon karnesi</Link> — kur +
            enflasyon konuta nasıl yansıyor
          </li>
        </ul>
      </article>
    </div>
  );
}
