import Link from "next/link";

import { footerNav, siteConfig } from "@/lib/site-config";
import { Separator } from "@/components/ui/separator";
import { BrandMark } from "@/components/brand-mark";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border/60 bg-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="space-y-3 sm:col-span-2">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <BrandMark className="h-7 w-7 shrink-0" />
              <span>{siteConfig.name}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              {siteConfig.tagline}. Anonim, doğru, ücretsiz.
            </p>
            <p className="text-xs text-muted-foreground max-w-xs">
              <a
                href="https://mustafaerbay.com.tr/"
                target="_blank"
                rel="noopener noreferrer me author"
                className="hover:text-foreground transition-colors underline-offset-2 hover:underline"
              >
                Mustafa Erbay
              </a>{" "}
              tarafından geliştirildi · System Architect ·{" "}
              <a
                href="https://orcid.org/0009-0005-9624-4249"
                target="_blank"
                rel="noopener noreferrer me"
                className="hover:text-foreground transition-colors"
                title="ORCID iD"
              >
                ORCID
              </a>{" "}
              ·{" "}
              <a
                href="https://www.wikidata.org/wiki/Q139679043"
                target="_blank"
                rel="noopener noreferrer me"
                className="hover:text-foreground transition-colors"
                title="Wikidata entry"
              >
                Wikidata
              </a>
            </p>
          </div>

          <FooterCol title="Ürün" items={footerNav.product} />
          <FooterCol title="Ekonomi (TCMB)" items={footerNav.economy} />
          <FooterCol title="Hakkında" items={footerNav.about} />
          <FooterCol title="Yasal" items={footerNav.legal} />
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {year} {siteConfig.name}. Tüm veriler kullanıcı katkısıdır,
            doğruluğu garanti edilmez.
          </p>
          <p>Made with ☕ in Türkiye</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-medium text-foreground">{title}</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="hover:text-foreground transition-colors">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
