import Link from "next/link";
import { Database, Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlobalSearch } from "@/components/search/global-search";
import { MobileNav } from "@/components/layout/mobile-nav";
import { mainNav, siteConfig } from "@/lib/site-config";
import { buildSearchIndex } from "@/lib/search-index";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const searchEntries = buildSearchIndex();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
              <Database className="h-3.5 w-3.5" />
            </span>
            <span>{siteConfig.name}</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <GlobalSearch entries={searchEntries} variant="pill" />
          </div>
          <Link
            href="/maaslar/yeni"
            className={cn(buttonVariants({ size: "sm" }), "hidden md:inline-flex")}
          >
            <Plus className="mr-1.5 h-4 w-4" /> Veri Paylaş
          </Link>
          <Link
            href="/maaslar/yeni"
            aria-label="Veri Paylaş"
            className={cn(buttonVariants({ size: "icon" }), "md:hidden")}
          >
            <Plus className="h-4 w-4" />
          </Link>
          <ThemeToggle />
          <MobileNav items={[...mainNav]} />
        </div>
      </div>
    </header>
  );
}
