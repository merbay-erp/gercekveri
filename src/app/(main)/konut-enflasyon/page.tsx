import type { Metadata } from "next";
import Link from "next/link";
import { Building2, TrendingDown, AlertCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { KonutKarneTable } from "@/components/data-display/konut-karne-table";
import { TcmbHousingPanel } from "@/components/data-display/tcmb-housing-panel";
import { getKonutKarne } from "@/lib/konut-karne";
import { getHousingIndex } from "@/lib/tcmb-snapshot";
import { cities as CITIES } from "@/lib/cities";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Konut Enflasyon Karnesi — Türkiye'nin 81 İli için TÜFE vs KFE",
  description:
    "TCMB Konut Fiyat Endeksi vs TÜFE: hangi bölgede konut enflasyondan ne kadar geride? 19 bölge sıralı, 81 il dinamik karne.",
  alternates: { canonical: "/konut-enflasyon" },
  openGraph: {
    title: "Konut Enflasyon Karnesi — Türkiye 81 İl",
    description: "TCMB resmi verisinden: konut fiyatları TÜFE'nin altında mı üstünde mi?",
    type: "website",
  },
};

export default async function KonutEnflasyonPage() {
  const karne = await getKonutKarne();
  const tr = await getHousingIndex();

  if (!karne || karne.regions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Konut Enflasyon Karnesi</h1>
        <p className="mt-2 text-muted-foreground">
          Veri yüklenemedi. Birkaç dakika sonra tekrar dene.
        </p>
      </div>
    );
  }

  const { tufeYoy, tufeDate, regions, summary, national } = karne;

  // İllerin slug→isim mapping'i (linklerde kullanmak için)
  const sortedCities = [...CITIES].sort((a, b) => a.name.localeCompare(b.name, "tr"));

  return (
    <div className="container mx-auto px-4 py-12">
      <header className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          TCMB · Resmi Veri
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Konut Enflasyon Karnesi
        </h1>
        <p className="mt-3 text-muted-foreground">
          Türkiye'nin {summary.totalRegions} ekonomik bölgesi için <strong>Konut Fiyat Endeksi</strong>'nin
          son 12 ay artışını TÜFE ile karşılaştırdık. Konut yatırımı gerçekten enflasyona karşı koruyor mu?
        </p>
      </header>

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            TÜFE Yıllık
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">
            %{tufeYoy.toFixed(1)}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            son veri: {tufeDate}
          </p>
        </Card>
        <Card className="p-4 border-rose-500/30 bg-rose-500/[0.04]">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Enflasyona yakın
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-rose-600 dark:text-rose-400">
            {summary.overInflation} bölge
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            TÜFE ± %1 aralığı veya üstü
          </p>
        </Card>
        <Card className="p-4 border-emerald-500/30 bg-emerald-500/[0.04]">
          <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            Enflasyonun altında
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
            {summary.underInflation} bölge
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            reel değer kaybı yaşayanlar
          </p>
        </Card>
      </div>

      <Card className="mb-8 p-5 border-amber-500/30 bg-amber-500/[0.04]">
        <div className="flex gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-500/10">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </span>
          <div>
            <h2 className="text-base font-semibold">
              "Konut güvenli liman" miti — gerçeklik kontrolü
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {summary.totalRegions} bölgenin <strong>{summary.underInflation}'i</strong> enflasyonun
              altında kaldı. En iyi performans <strong>{summary.bestPerformerLabel}</strong>'da
              (sadece {regions[0].deltaToTufe <= 0 ? "TÜFE üstü" : `%${regions[0].deltaToTufe.toFixed(1)} altı`}),
              en kötü <strong>{summary.worstPerformerLabel}</strong>'da
              (TÜFE'nin %{regions[regions.length - 1].deltaToTufe.toFixed(1)} altında).
              Ortalama Türkiye konutsahibi yıllık <strong>%{(tufeYoy - (national?.yoyPct ?? tufeYoy)).toFixed(1)}</strong>
              {" "}reel değer kaybı yaşadı.
            </p>
          </div>
        </div>
      </Card>

      {tr ? (
        <div className="mb-8">
          <TcmbHousingPanel data={tr} />
        </div>
      ) : null}

      <KonutKarneTable rows={regions} tufeYoy={tufeYoy} mode="full" />

      <section className="mt-12">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold">
          <Building2 className="h-5 w-5" />
          81 il için detaylı karne
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Şehrini seç, kendi bölgenin konut fiyat trendini ve TÜFE karşılaştırmasını gör.
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {sortedCities.map((c) => (
            <Link
              key={c.slug}
              href={`/konut-enflasyon/${c.slug}`}
              className="text-sm text-muted-foreground transition hover:text-foreground hover:underline"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-12 flex flex-wrap items-center justify-between gap-2 border-t pt-6 text-xs text-muted-foreground">
        <p>
          Kaynak: TCMB EVDS · Konut Fiyat Endeksi (TP.KFE.TR*) · son güncelleme: {regions[0].lastDate}
        </p>
        <Link href="/" className="hover:text-foreground hover:underline">
          ← Anasayfa
        </Link>
      </footer>
    </div>
  );
}
