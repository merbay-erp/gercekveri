import type { MetadataRoute } from "next";

import { topCitySlugs, topPositionSlugs } from "@/modules/maas/server/queries";
import { curatedPositionSlugs } from "@/modules/maas/position-resolver";
import { featuredCitySlugs } from "@/lib/cities";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gercekveri.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [activePositions, activeCities] = await Promise.all([
    topPositionSlugs(50).catch(() => [] as string[]),
    topCitySlugs(20).catch(() => [] as string[]),
  ]);

  const positions = Array.from(new Set([...activePositions, ...curatedPositionSlugs.slice(0, 30)]));
  const citySet = Array.from(new Set([...activeCities, ...featuredCitySlugs]));

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
    u("/hakkinda", 0.4, "monthly"),
  ];

  const positionEntries = positions.map((slug) => u(`/maaslar/${slug}`, 0.7, "weekly"));
  const cityEntries = citySet.map((slug) => u(`/maaslar/sehir/${slug}`, 0.7, "weekly"));

  // Cross routes — limit fan-out to avoid huge sitemap on launch.
  const crossEntries: MetadataRoute.Sitemap = [];
  for (const positionSlug of positions.slice(0, 20)) {
    for (const citySlug of citySet.slice(0, 8)) {
      crossEntries.push(u(`/maaslar/${positionSlug}/${citySlug}`, 0.5, "weekly"));
    }
  }

  return [...staticEntries, ...positionEntries, ...cityEntries, ...crossEntries];
}
