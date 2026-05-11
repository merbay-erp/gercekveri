import Link from "next/link";
import {
  Package,
  TrendingUp,
  Info,
  Scale,
  Code2,
  Mail,
  ExternalLink,
  Heart,
  Globe,
} from "lucide-react";

import { footerNav, siteConfig } from "@/lib/site-config";
import { BrandMark } from "@/components/brand-mark";

const COL_META = {
  product: { icon: Package, label: "Ürün", items: footerNav.product },
  economy: {
    icon: TrendingUp,
    label: "Ekonomi (TCMB)",
    items: footerNav.economy,
  },
  about: { icon: Info, label: "Hakkında", items: footerNav.about },
  legal: { icon: Scale, label: "Yasal", items: footerNav.legal },
};

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t border-border/60 bg-gradient-to-b from-muted/10 via-muted/20 to-muted/30">
      {/* Top gradient accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(56,189,174,0.5) 20%, rgba(112,165,253,0.5) 50%, rgba(168,85,247,0.5) 80%, transparent 100%)",
        }}
        aria-hidden
      />

      <div className="container mx-auto px-4 py-14">
        {/* Main grid */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand column (col-span-2) */}
          <div className="space-y-4 sm:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 group"
            >
              <BrandMark className="h-9 w-9 shrink-0 transition group-hover:scale-105" />
              <span className="text-lg font-semibold tracking-tight">
                Gerçek
                <span className="bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  Veri
                </span>
              </span>
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">
              {siteConfig.tagline}.{" "}
              <span className="text-foreground font-medium">
                Anonim, doğru, ücretsiz.
              </span>
            </p>

            {/* Social icons row — founder/brand cross-link (knowledge graph) */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href={siteConfig.links.blog}
                target="_blank"
                rel="noopener noreferrer me author"
                aria-label="mustafaerbay.com.tr — founder blog"
                title="mustafaerbay.com.tr"
                className="grid h-8 w-8 place-items-center rounded-md border border-border/60 text-muted-foreground transition hover:border-foreground/30 hover:bg-muted hover:text-foreground"
              >
                <Globe className="h-3.5 w-3.5" />
              </a>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                title="GitHub"
                className="grid h-8 w-8 place-items-center rounded-md border border-border/60 text-muted-foreground transition hover:border-foreground/30 hover:bg-muted hover:text-foreground"
              >
                <Code2 className="h-3.5 w-3.5" />
              </a>
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label="X / Twitter"
                title="X (@merbay86)"
                className="grid h-8 w-8 place-items-center rounded-md border border-border/60 text-muted-foreground transition hover:border-foreground/30 hover:bg-muted hover:text-foreground"
              >
                {/* X / Twitter inline SVG (lucide-react doesn't ship a Twitter icon) */}
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={siteConfig.links.bluesky}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label="Bluesky"
                title="Bluesky"
                className="grid h-8 w-8 place-items-center rounded-md border border-border/60 text-muted-foreground transition hover:border-foreground/30 hover:bg-muted hover:text-foreground"
              >
                {/* Bluesky butterfly inline SVG (lucide doesn't ship it) */}
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 600 530"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M135.72 44.03C202.21 93.93 273.74 195.1 300 249.39c26.26-54.29 97.79-155.46 164.28-205.36C512.27 8.01 590-19.51 590 68.13c0 17.5-10.04 147.06-15.93 168.09-20.49 73.11-94.97 91.74-161.18 80.45 115.7 19.7 145.13 84.81 81.55 149.7-120.41 122.55-172.36-30.94-185.74-70.27-2.45-7.21-3.6-10.65-3.62-7.72-.02-2.93-1.17.51-3.62 7.72-13.38 39.33-65.33 192.82-185.74 70.27-63.58-64.89-34.15-130 81.55-149.7-66.21 11.29-140.69-7.34-161.18-80.45C29.2 215.19 19.16 85.63 19.16 68.13c0-87.64 77.73-60.12 116.56-24.1z" />
                </svg>
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label="LinkedIn"
                title="LinkedIn"
                className="grid h-8 w-8 place-items-center rounded-md border border-border/60 text-muted-foreground transition hover:border-foreground/30 hover:bg-muted hover:text-foreground"
              >
                {/* LinkedIn inline SVG */}
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M20.45 20.45h-3.55v-5.56c0-1.33-.03-3.03-1.85-3.03-1.85 0-2.13 1.44-2.13 2.93v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.43v6.31zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zm-1.78 13.02h3.55V9H3.56v11.45z" />
                </svg>
              </a>
              <a
                href={siteConfig.links.mastodon}
                target="_blank"
                rel="noopener noreferrer me"
                aria-label="Mastodon"
                title="Mastodon"
                className="grid h-8 w-8 place-items-center rounded-md border border-border/60 text-muted-foreground transition hover:border-foreground/30 hover:bg-muted hover:text-foreground"
              >
                {/* Mastodon inline SVG (M logo) */}
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M23.193 7.88c0-5.207-3.413-6.733-3.413-6.733C18.057.353 15.103.045 12.036.02h-.075c-3.067.025-6.02.333-7.74 1.127 0 0-3.413 1.526-3.413 6.732 0 1.193-.024 2.62.013 4.131.123 5.092.933 10.11 5.637 11.355 2.169.574 4.032.694 5.531.611 2.72-.151 4.247-.971 4.247-.971l-.09-1.974s-1.944.613-4.126.539c-2.16-.075-4.44-.236-4.79-2.89a5.43 5.43 0 01-.048-.748s2.123.519 4.815.642c1.646.075 3.19-.097 4.758-.283 3.008-.359 5.625-2.211 5.955-3.903.52-2.667.477-6.508.477-6.508zm-4.045 6.749h-2.512v-6.157c0-1.298-.546-1.957-1.638-1.957-1.207 0-1.812.78-1.812 2.323v3.365h-2.498V8.838c0-1.543-.605-2.323-1.812-2.323-1.092 0-1.638.659-1.638 1.957v6.157H4.726V8.495c0-1.296.33-2.326.992-3.09.683-.764 1.578-1.156 2.69-1.156 1.285 0 2.257.493 2.906 1.479L12 6.732l.686-1.004c.65-.986 1.621-1.479 2.906-1.479 1.112 0 2.007.392 2.69 1.156.662.764.992 1.794.992 3.09v6.134z" />
                </svg>
              </a>
              <Link
                href="/iletisim"
                aria-label="İletişim"
                title="İletişim"
                className="grid h-8 w-8 place-items-center rounded-md border border-border/60 text-muted-foreground transition hover:border-foreground/30 hover:bg-muted hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Founder + brand cross-link (E-A-T + Knowledge Graph backlink) */}
            <div className="space-y-1.5 rounded-lg border border-border/40 bg-card/40 p-3">
              <p className="text-[11px] text-muted-foreground">
                Geliştiren:{" "}
                <a
                  href={siteConfig.links.blog}
                  target="_blank"
                  rel="noopener noreferrer me author"
                  className="font-semibold text-foreground transition hover:underline underline-offset-2"
                >
                  Mustafa Erbay
                </a>{" "}
                <span className="text-muted-foreground/70">·</span>{" "}
                System Architect
              </p>
              <p className="text-[10px] leading-relaxed text-muted-foreground">
                Teknoloji + sistem mimarisi yazıları:{" "}
                <a
                  href={siteConfig.links.blog}
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="font-medium text-foreground/80 transition hover:text-foreground hover:underline underline-offset-2"
                >
                  mustafaerbay.com.tr
                </a>{" "}
                <span className="text-muted-foreground/60">(970+ post · TR + EN)</span>
              </p>
              <div className="flex items-center gap-2 pt-0.5 text-[10px] text-muted-foreground">
                <a
                  href="https://orcid.org/0009-0005-9624-4249"
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="inline-flex items-center gap-0.5 transition hover:text-foreground"
                  title="ORCID iD — 0009-0005-9624-4249"
                >
                  ORCID <ExternalLink className="h-2.5 w-2.5" />
                </a>
                <span className="opacity-40">·</span>
                <a
                  href="https://www.wikidata.org/wiki/Q139679043"
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="inline-flex items-center gap-0.5 transition hover:text-foreground"
                  title="Wikidata — Q139679043"
                >
                  Wikidata <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
          </div>

          {/* 4 nav columns with icon headers */}
          {(Object.keys(COL_META) as (keyof typeof COL_META)[]).map((key) => {
            const col = COL_META[key];
            const Icon = col.icon;
            return (
              <div key={key}>
                <div className="mb-4 flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-muted/60">
                    <Icon className="h-3 w-3 text-muted-foreground" />
                  </span>
                  <h3 className="text-sm font-semibold text-foreground">
                    {col.label}
                  </h3>
                </div>
                <ul className="space-y-2.5 text-sm">
                  {col.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-border/40 pt-6">
          <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
            <p>
              © {year} <span className="font-medium">{siteConfig.name}</span>.
              Tüm veriler kullanıcı katkısıdır, doğruluğu garanti edilmez.
            </p>
            <p className="inline-flex items-center gap-1.5">
              Made with{" "}
              <Heart className="h-3 w-3 fill-rose-500 text-rose-500" />
              <span className="opacity-50">&</span>
              <span className="opacity-70">☕</span>
              {" "}in Türkiye 🇹🇷
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
