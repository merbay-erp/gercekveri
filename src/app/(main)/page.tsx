import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, MapPin, Briefcase } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AdSlot } from "@/components/ad-slot";
import { categories, siteConfig } from "@/lib/site-config";
import { db } from "@/lib/db";
import { formatNumber, formatTRY } from "@/lib/money";
import {
  topPositionSlugs,
  topCitySlugs,
  getSalaryStats,
} from "@/modules/maas/server/queries";
import { topRentCitySlugs, getRentStats } from "@/modules/kira/server/queries";
import { positionNameFromSlug } from "@/modules/maas/position-resolver";
import { findCityBySlug } from "@/lib/cities";
import { buildSearchIndex } from "@/lib/search-index";
import { GlobalSearch } from "@/components/search/global-search";
import { HeroLiveCounters } from "@/components/home/hero-live-counters";
import { LiveTrendsPanel } from "@/components/home/live-trends-panel";
import { AmountAiInsightLarge } from "@/components/data-display/amount-ai-insight-large";
import { getPublicStatsOverview } from "@/lib/public-stats";
import {
  getCategoryDeltas,
  getRecentSubmissions,
  getTrendingCities,
  getCoverageCounts,
} from "@/lib/recent-activity";
import { buildSalaryScope, getOrGenerateInsight } from "@/services/ai/insights";

export const revalidate = 60;

async function getHomepageStats() {
  try {
    const [
      salaryCount,
      rentCount,
      generalStats,
      rentStats,
      popularPositionSlugs,
      popularSalaryCitySlugs,
      popularRentCitySlugs,
    ] = await Promise.all([
      db.submission.count({ where: { type: "SALARY", status: "APPROVED" } }),
      db.submission.count({ where: { type: "RENT", status: "APPROVED" } }),
      getSalaryStats(),
      getRentStats(),
      topPositionSlugs(6),
      topCitySlugs(6),
      topRentCitySlugs(6),
    ]);
    return {
      salaryCount,
      rentCount,
      generalStats,
      rentStats,
      popularPositionSlugs,
      popularSalaryCitySlugs,
      popularRentCitySlugs,
    };
  } catch {
    return {
      salaryCount: 0,
      rentCount: 0,
      generalStats: { count: 0, median: null, avg: null, p25: null, p75: null, min: null, max: null },
      rentStats: { count: 0, median: null, avg: null, p25: null, p75: null, min: null, max: null },
      popularPositionSlugs: [] as string[],
      popularSalaryCitySlugs: [] as string[],
      popularRentCitySlugs: [] as string[],
    };
  }
}

export default async function HomePage() {
  const [
    stats,
    publicOverview,
    categoryDeltas,
    trendingCities,
    recentSubmissions,
    coverage,
  ] = await Promise.all([
    getHomepageStats(),
    getPublicStatsOverview().catch(() => null),
    getCategoryDeltas().catch(() => []),
    getTrendingCities().catch(() => []),
    getRecentSubmissions(8).catch(() => []),
    getCoverageCounts().catch(() => ({ cities: 0, districts: 0 })),
  ]);

  const headlineInsight = publicOverview
    ? await getOrGenerateInsight({
        scope: buildSalaryScope(),
        scopeLabel: "Türkiye geneli — anonim veri",
        stats: stats.generalStats,
        nounSingular: "maaş",
        nounPlural: "Türkiye genelinde paylaşılan maaşlar",
      }).catch(() => null)
    : null;

  const searchEntries = buildSearchIndex();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border/40">
        <div className="container mx-auto px-4 py-20 sm:py-28">
          <div className="max-w-3xl space-y-6">
            <Badge variant="secondary" className="font-normal">
              <Sparkles className="mr-1.5 h-3 w-3" /> Beta — yeni veri kaynağı
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-6xl">
              Türkiye'nin{" "}
              <span className="bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
                gerçek verisi.
              </span>
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
              {siteConfig.description}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/karsilastir" className={buttonVariants({ size: "lg" })}>
                Sen nerede duruyorsun? <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/maaslar/yeni" className={buttonVariants({ size: "lg", variant: "outline" })}>
                Verini paylaş
              </Link>
            </div>

            <div className="pt-2">
              <GlobalSearch entries={searchEntries} variant="hero" />
            </div>

            <div className="pt-2">
              <HeroLiveCounters
                totalApproved={publicOverview?.totalApproved ?? 0}
                totalLast24h={publicOverview?.totalLast24h ?? 0}
                cities={coverage.cities}
                districts={coverage.districts}
                lastSubmissionAt={publicOverview?.lastSubmissionAt ?? null}
              />
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> %100 anonim
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" /> AI özetler aktif
              </span>
            </div>
          </div>
        </div>
      </section>

      {headlineInsight ? (
        <section className="container mx-auto px-4 pt-12">
          <AmountAiInsightLarge
            insight={headlineInsight}
            cta={{ href: "/istatistikler", label: "Tüm istatistikler" }}
          />
        </section>
      ) : null}

      <LiveTrendsPanel
        categoryDeltas={categoryDeltas}
        trendingCities={trendingCities}
        recentSubmissions={recentSubmissions}
      />

      {/* POPULAR LINKS — surfaces SEO pages directly on the home for crawl
          discovery + repeat-visit retention */}
      {stats.popularPositionSlugs.length +
        stats.popularSalaryCitySlugs.length +
        stats.popularRentCitySlugs.length >
      0 ? (
        <section className="container mx-auto px-4 pt-4 pb-12">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <Briefcase className="h-3.5 w-3.5" /> Popüler pozisyonlar
              </div>
              <div className="flex flex-wrap gap-2">
                {stats.popularPositionSlugs.map((slug) => (
                  <Link
                    key={slug}
                    href={`/maaslar/${slug}`}
                    className="rounded-full border bg-background px-3 py-1 text-sm transition hover:border-foreground/30 hover:bg-muted"
                  >
                    {positionNameFromSlug(slug)}
                  </Link>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> Maaş şehirleri
              </div>
              <div className="flex flex-wrap gap-2">
                {stats.popularSalaryCitySlugs.map((slug) => {
                  const city = findCityBySlug(slug);
                  if (!city) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/maaslar/sehir/${slug}`}
                      className="rounded-full border bg-background px-3 py-1 text-sm transition hover:border-foreground/30 hover:bg-muted"
                    >
                      {city.name}
                    </Link>
                  );
                })}
              </div>
            </Card>
            <Card className="p-5">
              <div className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> Kira şehirleri
              </div>
              <div className="flex flex-wrap gap-2">
                {stats.popularRentCitySlugs.map((slug) => {
                  const city = findCityBySlug(slug);
                  if (!city) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/kira/sehir/${slug}`}
                      className="rounded-full border bg-background px-3 py-1 text-sm transition hover:border-foreground/30 hover:bg-muted"
                    >
                      {city.name}
                    </Link>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {stats.generalStats.median ? (
              <Card className="space-y-2 p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Türkiye geneli maaş medyanı
                </p>
                <p className="text-2xl font-semibold tabular-nums sm:text-3xl">
                  {formatTRY(stats.generalStats.median)}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    net / ay
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(stats.generalStats.count)} paylaşım · P25{" "}
                  {formatTRY(stats.generalStats.p25)} · P75{" "}
                  {formatTRY(stats.generalStats.p75)}
                </p>
              </Card>
            ) : null}
            {stats.rentStats.median ? (
              <Card className="space-y-2 p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Türkiye geneli kira medyanı
                </p>
                <p className="text-2xl font-semibold tabular-nums sm:text-3xl">
                  {formatTRY(stats.rentStats.median)}
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    aylık
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatNumber(stats.rentStats.count)} ilan · P25{" "}
                  {formatTRY(stats.rentStats.p25)} · P75{" "}
                  {formatTRY(stats.rentStats.p75)}
                </p>
              </Card>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* CATEGORIES */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Veri kategorileri</h2>
            <p className="text-muted-foreground">Türkiye'nin gerçek hayat verileri, tek bir yerde.</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isLive = cat.status === "live";
            const href = `/${cat.slug}`;
            const Wrapper = isLive ? Link : "div";
            const wrapperProps = isLive ? { href } : {};

            return (
              <Wrapper
                key={cat.slug}
                {...(wrapperProps as { href: string })}
                className={
                  isLive
                    ? "group block focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl"
                    : ""
                }
              >
                <Card
                  className={`relative h-full overflow-hidden p-6 transition ${
                    isLive ? "group-hover:border-foreground/30 group-hover:shadow-md" : "opacity-70"
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${cat.accent} pointer-events-none opacity-60`}
                    aria-hidden
                  />
                  <div className="relative space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-foreground/5 backdrop-blur">
                        <Icon className="h-5 w-5" />
                      </span>
                      {isLive ? null : (
                        <Badge variant="outline" className="font-normal">
                          Yakında
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">{cat.pluralName}</h3>
                      <p className="text-sm text-muted-foreground">{cat.shortDescription}</p>
                    </div>
                    {isLive ? (
                      <p className="flex items-center gap-1 text-sm font-medium text-foreground">
                        Keşfet <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                      </p>
                    ) : null}
                  </div>
                </Card>
              </Wrapper>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-10 max-w-2xl space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Nasıl çalışıyor?</h2>
          <p className="text-muted-foreground">
            Üç adım. Üyelik, e-posta, kişisel bilgi yok.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Verini paylaş",
              body: "Maaşını, kiranı veya internet hızını anonim olarak gönder. 30 saniye sürer.",
            },
            {
              step: "02",
              title: "Topluluğu güçlendir",
              body: "Veri arttıkça medyan, ortalama ve trendler kesinleşir. Herkese fayda.",
            },
            {
              step: "03",
              title: "Karşılaştır, karar ver",
              body: "Şehrindeki ortalamayla kendini kıyasla. Pazarlık ve karar için somut veri.",
            },
          ].map((card) => (
            <Card key={card.step} className="p-6">
              <p className="font-mono text-xs text-muted-foreground">{card.step}</p>
              <h3 className="mt-2 font-medium">{card.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{card.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        <AdSlot slotKey="homepage-bottom" format="responsive" />
      </div>
    </>
  );
}
