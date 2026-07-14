import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gercekveri.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Render kaynakları dahil tüm public sayfalar açık; yalnız özel uçlar kapalı.
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
        ],
      },
      // AdSense crawler; özel yönetim ve API uçları dışında erişebilir.
      {
        userAgent: "Mediapartners-Google",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      // AdSense reklam doğrulama bot'u — landing page kalite kontrolu icin
      {
        userAgent: "AdsBot-Google",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
      // AdSense mobile reklam doğrulama
      {
        userAgent: "AdsBot-Google-Mobile",
        allow: "/",
        disallow: ["/api/", "/admin/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
