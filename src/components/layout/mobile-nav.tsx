"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
}

interface Props {
  items: NavItem[];
}

/**
 * Mobile-only nav. Header desktop'ta hidden, mobile'da bir menü iconu + tıklanınca
 * full-screen overlay drawer. Kullanıcı linklere kolay ulaşsın diye Sheet/Dialog
 * yerine basit toggle.
 */
export function MobileNav({ items }: Props) {
  const [open, setOpen] = React.useState(false);

  // Close on route change (defensive — Next router usually unmounts on navigate)
  React.useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("popstate", close);
    return () => window.removeEventListener("popstate", close);
  }, [open]);

  // Lock body scroll while open
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Menü"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background text-muted-foreground transition hover:border-foreground/30 hover:text-foreground md:hidden"
      >
        <Menu className="h-4 w-4" />
      </button>

      {open ? (
        <div
          className={cn(
            "fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur",
            "md:hidden",
          )}
        >
          <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="font-semibold">Menü</span>
            <button
              type="button"
              aria-label="Kapat"
              onClick={() => setOpen(false)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 p-4">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg border bg-background px-4 py-3 text-base font-medium transition hover:border-foreground/30 hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </>
  );
}
