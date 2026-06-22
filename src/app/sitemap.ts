import type { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { kindFromEntity } from "@/services/risk/registry";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gercekveri.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const u = (
    path: string,
    priority: number,
    changeFrequency: "daily" | "weekly" | "monthly" = "weekly",
  ) => ({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency, priority });

  const staticEntries: MetadataRoute.Sitemap = [
    u("/", 1.0, "daily"),
    u("/ihbar", 0.8, "weekly"),
    u("/son-dolandiriciliklar", 0.9, "daily"),
    u("/hakkinda", 0.4, "monthly"),
    u("/sss", 0.5, "monthly"),
    u("/iletisim", 0.3, "monthly"),
    u("/gizlilik", 0.2, "monthly"),
    u("/kvkk", 0.2, "monthly"),
    u("/sartlar", 0.2, "monthly"),
    u("/cerez", 0.2, "monthly"),
  ];

  // En çok ihbar alan sorgu sayfaları — SEO yüzeyi ("X dolandırıcı mı").
  const entities = await db.fraudEntity
    .findMany({
      where: { reportCount: { gt: 0 } },
      orderBy: { reportCount: "desc" },
      take: 5000,
      select: { kind: true, key: true, updatedAt: true },
    })
    .catch(() => [] as { kind: string; key: string; updatedAt: Date }[]);

  const entityEntries: MetadataRoute.Sitemap = entities.map((e) => ({
    url: `${SITE_URL}/sorgu/${kindFromEntity(e.kind).kind}/${e.key}`,
    lastModified: e.updatedAt,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticEntries, ...entityEntries];
}
