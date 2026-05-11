import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gercekveri.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Generic bots — tum public sayfalar acik, sadece /api/admin/ kapali
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/maaslar/yeni",
          "/_next/",
        ],
      },
      // AdSense crawler — TUM sayfalara erisim sart, aksi halde Auto Ads
      // calismaz. Sadece /admin/ ve /api/ kapali (gercek admin alani).
      // ÖNEMLI: form sayfalari da acik → AdSense kalite analizi.
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
