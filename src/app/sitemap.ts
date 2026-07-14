import type { MetadataRoute } from "next";

import { guides } from "@/content/guides";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gercekveri.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entry = (
    path: string,
    priority: number,
    changeFrequency: "daily" | "weekly" | "monthly" = "monthly",
    lastModified: Date | string = now,
  ) => ({ url: `${SITE_URL}${path}`, lastModified, changeFrequency, priority });

  const staticEntries: MetadataRoute.Sitemap = [
    entry("/", 1, "daily"),
    entry("/rehber", 0.95, "weekly"),
    entry("/hakkinda", 0.7),
    entry("/sss", 0.7),
    entry("/iletisim", 0.5),
    entry("/gizlilik", 0.4),
    entry("/kvkk", 0.4),
    entry("/sartlar", 0.4),
    entry("/cerez", 0.4),
  ];

  const guideEntries: MetadataRoute.Sitemap = guides.map((guide) =>
    entry(`/rehber/${guide.slug}`, 0.85, "monthly", guide.reviewedAt),
  );

  // Kullanıcı sorguları, ihbar formu ve topluluk akışı bilerek sitemap'e alınmaz.
  // Bunlar araç ekranlarıdır; indekslenecek yayıncı içeriği rehber katmanındadır.
  return [...staticEntries, ...guideEntries];
}
