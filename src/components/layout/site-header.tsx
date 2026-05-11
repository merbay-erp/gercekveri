import Link from "next/link";
import { Plus } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlobalSearch } from "@/components/search/global-search";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BrandMark } from "@/components/brand-mark";
import { mainNav } from "@/lib/site-config";
import { buildSearchIndex } from "@/lib/search-index";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const searchEntries = buildSearchIndex();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      {/* Top thin gradient accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(56,189,174,0.6) 30%, rgba(112,165,253,0.6) 50%, rgba(168,85,247,0.6) 70%, transparent 100%)",
        }}
        aria-hidden
      />

      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="group flex items-center gap-2 font-semibold tracking-tight"
          >
            <BrandMark className="h-7 w-7 shrink-0 transition group-hover:scale-110" />
            <span className="text-base">
              Gerçek
              <span className="bg-gradient-to-br from-emerald-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Veri
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 md:flex">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
                {/* Animated underline on hover */}
                <span
                  className="absolute bottom-0.5 left-3 right-3 h-px origin-left scale-x-0 transform bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 transition-transform duration-200 group-hover:scale-x-100"
                  aria-hidden
                />
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
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden md:inline-flex shadow-sm transition hover:shadow-md",
            )}
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
