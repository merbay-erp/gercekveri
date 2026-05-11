import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/providers";
import { SchemaOrg } from "@/components/schema-org";
import { AdSenseScript } from "@/components/adsense-script";
import { CookieConsent } from "@/components/cookie-consent";
import { siteConfig } from "@/lib/site-config";
import {
  organizationSchema,
  websiteSchema,
  personMustafaErbay,
  siteNavigationSchema,
  jsonLdGraph,
} from "@/lib/schema-org";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Türkiye",
    "maaş",
    "kira",
    "internet",
    "anonim veri",
    "gerçek veri",
    "maaş araştırması",
    "kira araştırması",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: siteUrl,
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    // OG image: src/app/opengraph-image.tsx auto-generates /opengraph-image
    // (dynamic, edge runtime, branded gradient + tagline).
    // Next.js metadata file convention takes precedence — explicit reference
    // here would shadow the file-based generator.
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    // Twitter card image: auto from opengraph-image.tsx (Next.js convention)
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  authors: [{ name: siteConfig.name }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Root-level JSON-LD: Organization + WebSite + Person (kanonik kimlikler).
  // Tek <script> icinde @graph ile birlikte verilir → Google parse'i kolay,
  // duplicate @context yok, knowledge graph entity birlestirmesi daha guclu.
  const rootJsonLd = jsonLdGraph(
    organizationSchema(),
    websiteSchema(),
    personMustafaErbay(),
    siteNavigationSchema([
      { name: "Maaşlar", url: "/maaslar" },
      { name: "Kira", url: "/kira" },
      { name: "Internet", url: "/internet" },
      { name: "Fatura", url: "/fatura" },
      { name: "Aidat", url: "/aidat" },
      { name: "Tekstil", url: "/tekstil" },
      { name: "Konut Enflasyon", url: "/konut-enflasyon" },
      { name: "Karşılaştır", url: "/karsilastir" },
      { name: "Harita", url: "/harita" },
      { name: "İstatistikler", url: "/istatistikler" },
    ]),
  );

  return (
    <html lang="tr" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* AdSense verification + Auto Ads.
            ENV NEXT_PUBLIC_ADSENSE_CLIENT_ID yoksa render olmaz (dev safe).
            Production'da Vercel env'inden cekilir. */}
        <AdSenseScript />
      </head>
      <body className="min-h-full bg-background font-sans text-foreground">
        <Providers>{children}</Providers>
        <SchemaOrg data={rootJsonLd} />
        <CookieConsent />
      </body>
    </html>
  );
}
