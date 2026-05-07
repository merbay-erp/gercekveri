import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Building2 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TcmbHousingPanel } from "@/components/data-display/tcmb-housing-panel";
import { KonutKarneTable } from "@/components/data-display/konut-karne-table";
import { findCityBySlug, cities } from "@/lib/cities";
import { getKonutKarne, getCityKonutKarne } from "@/lib/konut-karne";
import { getHousingIndex } from "@/lib/tcmb-snapshot";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ citySlug: string }>;
}

export async function generateStaticParams() {
  return cities.map((c) => ({ citySlug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { citySlug } = await params;
  const city = findCityBySlug(citySlug);
  if (!city) return { title: "Bulunamadı" };
  return {
    title: `${city.name}'da Konut Fiyatları Enflasyonun Ne Kadar Altında? — Karne 2026`,
    description: `${city.name} için TCMB Konut Fiyat Endeksi vs TÜFE karşılaştırması. Konut yatırımı reel değer mi kaybediyor mu kazanıyor mu?`,
    alternates: { canonical: `/konut-enflasyon/${city.slug}` },
    openGraph: {
      title: `${city.name} Konut Enflasyon Karnesi`,
      description: "TCMB resmi verisinden bölgenin konut/enflasyon dengesi",
      type: "article",
    },
  };
}

export default async function CityKonutEnflasyonPage({ params }: PageProps) {
  const { citySlug } = await params;
  const city = findCityBySlug(citySlug);
  if (!city) notFound();

  const [detail, housingIndex, fullKarne] = await Promise.all([
    getCityKonutKarne(city.slug, city.name),
    getHousingIndex(city.slug),
    getKonutKarne(),
  ]);

  if (!detail || !fullKarne) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-semibold">Veri henüz yüklenmedi</h1>
        <p className="mt-2 text-muted-foreground">
          Birkaç dakika sonra tekrar dene.
        </p>
        <Link
          href="/konut-enflasyon"
          className="mt-4 inline-block text-sm text-muted-foreground hover:underline"
        >
          ← Türkiye karnesi
        </Link>
      </div>
    );
  }

  const { region, tufeYoy, tufeDate } = detail;
  const delta = region.deltaToTufe;
  const deltaText =
    delta <= 0
      ? `enflasyonun %${Math.abs(delta).toFixed(1)} ÜSTÜNDE`
      : `enflasyonun %${delta.toFixed(1)} altında`;

  const headlineTone =
    delta <= 0
      ? "rose"
      : delta <= 5
        ? "amber"
        : "emerald";

  const toneClass = {
    rose: "border-rose-500/30 bg-rose-500/[0.04]",
    amber: "border-amber-500/30 bg-amber-500/[0.04]",
    emerald: "border-emerald-500/30 bg-emerald-500/[0.04]",
  }[headlineTone];

  const numberClass = {
    rose: "text-rose-600 dark:text-rose-400",
    amber: "text-amber-600 dark:text-amber-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
  }[headlineTone];

  // Bölge isminden city'nin gruplandığı bölgeyi göster
  const regionLabel = region.regionLabel;
  const isStandalone = /^(İstanbul|Ankara|İzmir)$/.test(regionLabel);

  return (
    <div className="container mx-auto px-4 py-12">
      <Link
        href="/konut-enflasyon"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
        Türkiye karnesi
      </Link>

      <header className="mb-6 max-w-3xl">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="font-mono">
            #{region.rank}/{fullKarne.regions.length}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {region.code} · son veri {region.lastDate}
          </span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {city.name}'da konut fiyatları{" "}
          <span className={numberClass}>{deltaText}</span>
        </h1>
        {!isStandalone ? (
          <p className="mt-3 text-muted-foreground">
            {city.name} TCMB'nin <strong>{regionLabel}</strong> bölgesine dahil. Bu bölgenin
            konut fiyat endeksi son 12 ayda <strong className="tabular-nums">%{region.yoyPct.toFixed(1)}</strong> arttı,
            TÜFE ise %{tufeYoy.toFixed(1)} arttı.
          </p>
        ) : (
          <p className="mt-3 text-muted-foreground">
            {city.name}'da konut fiyat endeksi son 12 ayda <strong className="tabular-nums">%{region.yoyPct.toFixed(1)}</strong> arttı,
            TÜFE ise %{tufeYoy.toFixed(1)} arttı.
          </p>
        )}
      </header>

      <Card className={`mb-8 p-5 ${toneClass}`}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Konut yıllık
            </p>
            <p className={`mt-1 text-3xl font-semibold tabular-nums ${numberClass}`}>
              %{region.yoyPct.toFixed(1)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {regionLabel} · KFE
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              TÜFE yıllık
            </p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">
              %{tufeYoy.toFixed(1)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              son veri: {tufeDate}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Reel performans
            </p>
            <p className={`mt-1 text-3xl font-semibold tabular-nums ${numberClass}`}>
              {delta > 0 ? "−" : "+"}%{Math.abs(delta).toFixed(1)}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {delta > 0 ? "değer kaybı" : "değer kazanımı"}
            </p>
          </div>
        </div>
      </Card>

      {housingIndex ? (
        <div className="mb-8">
          <TcmbHousingPanel data={housingIndex} />
        </div>
      ) : null}

      <section className="mb-8">
        <h2 className="mb-3 flex items-center gap-2 text-xl font-semibold">
          <Building2 className="h-5 w-5" />
          {regionLabel} ne durumda?
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {region.rank === 1 ? (
            <>
              <strong>{regionLabel}</strong>, Türkiye'nin {fullKarne.regions.length} bölgesi
              arasında konut fiyatı en hızlı artan bölge. Bu liderlik enflasyonu yenmeye yetiyor mu?
              %{region.yoyPct.toFixed(1)} artış, TÜFE'nin {delta <= 0 ? "üstünde — yatırım reel kazanç sağladı" : "altında — kazanç yine de eridi"}.
            </>
          ) : region.rank === fullKarne.regions.length ? (
            <>
              <strong>{regionLabel}</strong>, Türkiye'nin {fullKarne.regions.length} bölgesi
              arasında konut fiyat artışı en yavaş olan. Buradaki konut sahipleri son 12 ayda
              enflasyonun %{delta.toFixed(1)} gerisinde kaldı — gerçek değer kaybı.
            </>
          ) : (
            <>
              {fullKarne.regions.length} bölge arasında <strong>{region.rank}.</strong> sırada.
              {delta > 5 ? " Konut bu bölgede enflasyona karşı koruyamadı, ciddi reel kayıp var." : null}
              {delta > 0 && delta <= 5 ? " Konut enflasyonun gerisinde kaldı ama fark dar." : null}
              {delta <= 0 ? " Konut enflasyonu yendi, reel kazanç sağladı." : null}
            </>
          )}
        </p>
      </section>

      <KonutKarneTable rows={fullKarne.regions} tufeYoy={tufeYoy} mode="full" />

      <section className="mt-8 rounded-xl border bg-muted/30 p-5">
        <h2 className="mb-2 text-base font-semibold">{city.name} kira ilanları nerede?</h2>
        <p className="mb-3 text-sm text-muted-foreground">
          Bu sayfa konut SATIŞ fiyat trendini gösteriyor. {city.name}'da gerçek kira fiyatları
          için anonim kullanıcı verisine bak.
        </p>
        <Link
          href={`/kira/sehir/${city.slug}`}
          className="inline-block text-sm font-medium hover:underline"
        >
          {city.name} kira sayfası →
        </Link>
      </section>

      <footer className="mt-8 flex flex-wrap items-center justify-between gap-2 border-t pt-6 text-xs text-muted-foreground">
        <p>
          Kaynak: TCMB EVDS · {region.code} · son güncelleme: {region.lastDate}
        </p>
        <Link href="/konut-enflasyon" className="hover:text-foreground hover:underline">
          Türkiye karnesi →
        </Link>
      </footer>
    </div>
  );
}
