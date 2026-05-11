import type { MetadataRoute } from "next";

import { topCitySlugs, topPositionSlugs } from "@/modules/maas/server/queries";
import { topRentCitySlugs } from "@/modules/kira/server/queries";
import { topAidatCitySlugs } from "@/modules/aidat/server/queries";
import { topFaturaCitySlugs } from "@/modules/fatura/server/queries";
import { utilityTypes, utilitySlugs } from "@/modules/fatura/config";
import { topTekstilCitySlugs } from "@/modules/tekstil/server/queries";
import { subTypes as tekstilSubTypes, subTypeSlugs as tekstilSubTypeSlugs } from "@/modules/tekstil/config";
import { topInternetCitySlugs } from "@/modules/internet/server/queries";
import { curatedPositionSlugs } from "@/modules/maas/position-resolver";
import { isps } from "@/modules/internet/config";
import { featuredCitySlugs, cities } from "@/lib/cities";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gercekveri.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [
    activePositions,
    activeSalaryCities,
    activeRentCities,
    activeAidatCities,
    activeFaturaCities,
    activeTekstilCities,
    activeInternetCities,
  ] = await Promise.all([
    topPositionSlugs(50).catch(() => [] as string[]),
    topCitySlugs(20).catch(() => [] as string[]),
    topRentCitySlugs(20).catch(() => [] as string[]),
    topAidatCitySlugs(20).catch(() => [] as string[]),
    topFaturaCitySlugs(20).catch(() => [] as string[]),
    topTekstilCitySlugs(20).catch(() => [] as string[]),
    topInternetCitySlugs(20).catch(() => [] as string[]),
  ]);

  const positions = Array.from(new Set([...activePositions, ...curatedPositionSlugs.slice(0, 30)]));
  const salaryCitySet = Array.from(new Set([...activeSalaryCities, ...featuredCitySlugs]));
  const rentCitySet = Array.from(new Set([...activeRentCities, ...featuredCitySlugs]));
  const aidatCitySet = Array.from(new Set([...activeAidatCities, ...featuredCitySlugs]));
  const faturaCitySet = Array.from(new Set([...activeFaturaCities, ...featuredCitySlugs]));
  const tekstilCitySet = Array.from(new Set([...activeTekstilCities, ...featuredCitySlugs]));
  const internetCitySet = Array.from(new Set([...activeInternetCities, ...featuredCitySlugs]));

  const now = new Date();
  const u = (path: string, priority: number, changeFreq: "daily" | "weekly" | "monthly" = "weekly") => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: changeFreq,
    priority,
  });

  const staticEntries: MetadataRoute.Sitemap = [
    u("/", 1.0, "daily"),
    u("/maaslar", 0.9, "daily"),
    u("/maaslar/yeni", 0.6, "monthly"),
    u("/kira", 0.9, "daily"),
    u("/kira/yeni", 0.6, "monthly"),
    u("/kira/sisme", 0.8, "daily"),
    u("/aidat", 0.9, "daily"),
    u("/aidat/yeni", 0.6, "monthly"),
    u("/fatura", 0.9, "daily"),
    u("/fatura/yeni", 0.6, "monthly"),
    u("/tekstil", 0.9, "daily"),
    u("/tekstil/yeni", 0.6, "monthly"),
    u("/internet", 0.9, "daily"),
    u("/internet/yeni", 0.6, "monthly"),
    u("/karsilastir", 0.8, "weekly"),
    u("/karsilastir/maas", 0.7, "weekly"),
    u("/karsilastir/kira", 0.7, "weekly"),
    u("/karsilastir/aidat", 0.7, "weekly"),
    u("/karsilastir/fatura", 0.7, "weekly"),
    u("/karsilastir/tekstil", 0.7, "weekly"),
    u("/istatistikler", 0.6, "daily"),
    u("/harita", 0.7, "daily"),
    u("/hakkinda", 0.4, "monthly"),
    u("/sss", 0.5, "monthly"),
    u("/konut-enflasyon", 0.85, "daily"),
    // Yeni TCMB sayfalari — yuksek arama hacmi
    u("/doviz", 0.85, "daily"),
    u("/doviz/usd-try", 0.95, "daily"),
    u("/doviz/eur-try", 0.9, "daily"),
    u("/faiz", 0.85, "daily"),
    u("/tufe", 0.9, "daily"),
  ];

  const konutCityEntries = cities.map((c) =>
    u(`/konut-enflasyon/${c.slug}`, 0.65, "weekly"),
  );

  const positionEntries = positions.map((slug) => u(`/maaslar/${slug}`, 0.7, "weekly"));
  const salaryCityEntries = salaryCitySet.map((slug) => u(`/maaslar/sehir/${slug}`, 0.7, "weekly"));
  const rentCityEntries = rentCitySet.map((slug) => u(`/kira/sehir/${slug}`, 0.7, "weekly"));
  const aidatCityEntries = aidatCitySet.map((slug) => u(`/aidat/sehir/${slug}`, 0.7, "weekly"));
  const faturaCityEntries = faturaCitySet.map((slug) => u(`/fatura/sehir/${slug}`, 0.7, "weekly"));
  const faturaUtilityEntries = utilityTypes.map((u_) =>
    u(`/fatura/${utilitySlugs[u_]}`, 0.8, "weekly"),
  );
  const tekstilCityEntries = tekstilCitySet.map((slug) => u(`/tekstil/sehir/${slug}`, 0.7, "weekly"));
  const tekstilSubTypeEntries = tekstilSubTypes.map((s) =>
    u(`/tekstil/${tekstilSubTypeSlugs[s]}`, 0.8, "weekly"),
  );
  const ispEntries = isps.map((isp) => u(`/internet/${isp.slug}`, 0.8, "weekly"));
  const internetCityEntries = internetCitySet.map((slug) =>
    u(`/internet/sehir/${slug}`, 0.7, "weekly"),
  );

  // Cross routes — limit fan-out to avoid huge sitemap on launch.
  const crossEntries: MetadataRoute.Sitemap = [];
  for (const positionSlug of positions.slice(0, 20)) {
    for (const citySlug of salaryCitySet.slice(0, 8)) {
      crossEntries.push(u(`/maaslar/${positionSlug}/${citySlug}`, 0.5, "weekly"));
    }
  }

  return [
    ...staticEntries,
    ...positionEntries,
    ...salaryCityEntries,
    ...rentCityEntries,
    ...aidatCityEntries,
    ...faturaUtilityEntries,
    ...faturaCityEntries,
    ...tekstilSubTypeEntries,
    ...tekstilCityEntries,
    ...ispEntries,
    ...internetCityEntries,
    ...konutCityEntries,
    ...crossEntries,
  ];
}
