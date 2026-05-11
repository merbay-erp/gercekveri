import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Providers } from "@/components/providers";
import { SchemaOrg } from "@/components/schema-org";
import { siteConfig } from "@/lib/site-config";
import {
  organizationSchema,
  websiteSchema,
  personMustafaErbay,
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
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/og.png"],
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
  );

  return (
    <html lang="tr" className={`${inter.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-background font-sans text-foreground">
        <Providers>{children}</Providers>
        <SchemaOrg data={rootJsonLd} />
      </body>
    </html>
  );
}
