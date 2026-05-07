"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search as SearchIcon, ArrowRight } from "lucide-react";

import type { SearchEntry } from "@/lib/search-index";

interface Props {
  entries: SearchEntry[];
  /** Whether to render an input button that opens the dialog (Hero variant), or just the trigger pill (Header variant). */
  variant?: "hero" | "pill";
}

function fold(s: string): string {
  return s
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u");
}

export function GlobalSearch({ entries, variant = "hero" }: Props) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  // Cmd/Ctrl+K to open
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtered = React.useMemo(() => {
    if (!query.trim()) {
      // Default: surface a small curated mix when empty.
      return entries.filter(
        (e) => e.group === "Sayfa" || e.group === "Karşılaştır",
      );
    }
    const folded = fold(query);
    return entries
      .map((e) => {
        const idx = e.haystack.indexOf(folded);
        if (idx === -1) return null;
        // Earlier match + shorter label = higher rank.
        const score = idx + e.label.length / 100;
        return { entry: e, score };
      })
      .filter((x): x is { entry: SearchEntry; score: number } => x !== null)
      .sort((a, b) => a.score - b.score)
      .slice(0, 40)
      .map((x) => x.entry);
  }, [query, entries]);

  const grouped = React.useMemo(() => {
    const map = new Map<string, SearchEntry[]>();
    for (const e of filtered) {
      const arr = map.get(e.group) ?? [];
      arr.push(e);
      map.set(e.group, arr);
    }
    return Array.from(map.entries());
  }, [filtered]);

  const go = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  return (
    <>
      {variant === "hero" ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-3 rounded-xl border bg-background px-4 py-3 text-left text-sm text-muted-foreground transition hover:border-foreground/30 hover:shadow-sm sm:max-w-xl"
        >
          <SearchIcon className="h-4 w-4" />
          <span className="flex-1">Pozisyon, şehir veya kategori ara…</span>
          <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">
            ⌘K
          </kbd>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-md border bg-background px-2.5 py-1.5 text-xs text-muted-foreground transition hover:border-foreground/30"
        >
          <SearchIcon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Ara</span>
          <kbd className="rounded border bg-muted px-1 font-mono text-[10px]">⌘K</kbd>
        </button>
      )}

      {open ? (
        <div
          className="fixed inset-0 z-50 grid place-items-start bg-background/60 px-4 pt-[15vh] backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <Command
            className="w-full max-w-xl overflow-hidden rounded-xl border bg-background shadow-2xl"
            shouldFilter={false}
            label="Site içi arama"
          >
            <div className="flex items-center gap-2 border-b px-4">
              <SearchIcon className="h-4 w-4 text-muted-foreground" />
              <Command.Input
                value={query}
                onValueChange={setQuery}
                placeholder="Pozisyon, şehir, sağlayıcı…"
                className="flex h-12 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                autoFocus
              />
              <kbd className="hidden rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">
                Esc
              </kbd>
            </div>

            <Command.List className="max-h-[60vh] overflow-y-auto py-2">
              <Command.Empty className="px-4 py-8 text-center text-sm text-muted-foreground">
                Sonuç bulunamadı.
              </Command.Empty>

              {grouped.map(([group, list]) => (
                <Command.Group
                  key={group}
                  heading={group}
                  className="[&_[cmdk-group-heading]]:px-4 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-muted-foreground"
                >
                  {list.map((e) => (
                    <Command.Item
                      key={e.id}
                      value={e.id}
                      onSelect={() => go(e.href)}
                      className="mx-2 flex cursor-pointer items-center gap-2 rounded-md px-2 py-2 text-sm outline-none aria-selected:bg-muted data-[selected=true]:bg-muted"
                    >
                      <span className="flex-1 truncate">{e.label}</span>
                      {e.hint ? (
                        <span className="hidden truncate text-xs text-muted-foreground sm:inline">
                          {e.hint}
                        </span>
                      ) : null}
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    </Command.Item>
                  ))}
                </Command.Group>
              ))}
            </Command.List>
          </Command>
        </div>
      ) : null}
    </>
  );
}
