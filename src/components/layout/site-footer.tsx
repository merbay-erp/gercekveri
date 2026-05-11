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

            {/* Social icons row */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="grid h-8 w-8 place-items-center rounded-md border border-border/60 text-muted-foreground transition hover:border-foreground/30 hover:bg-muted hover:text-foreground"
              >
                <Code2 className="h-3.5 w-3.5" />
              </a>
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
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
              <Link
                href="/iletisim"
                aria-label="İletişim"
                className="grid h-8 w-8 place-items-center rounded-md border border-border/60 text-muted-foreground transition hover:border-foreground/30 hover:bg-muted hover:text-foreground"
              >
                <Mail className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Founder credit */}
            <div className="space-y-1 pt-1">
              <p className="text-[11px] text-muted-foreground">
                Geliştiren:{" "}
                <a
                  href="https://mustafaerbay.com.tr/"
                  target="_blank"
                  rel="noopener noreferrer me author"
                  className="font-medium text-foreground/80 transition hover:text-foreground"
                >
                  Mustafa Erbay
                </a>
              </p>
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <a
                  href="https://orcid.org/0009-0005-9624-4249"
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="inline-flex items-center gap-0.5 transition hover:text-foreground"
                  title="ORCID iD"
                >
                  ORCID <ExternalLink className="h-2.5 w-2.5" />
                </a>
                <span className="opacity-40">·</span>
                <a
                  href="https://www.wikidata.org/wiki/Q139679043"
                  target="_blank"
                  rel="noopener noreferrer me"
                  className="inline-flex items-center gap-0.5 transition hover:text-foreground"
                  title="Wikidata"
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
