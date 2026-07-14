"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, Globe, Phone, Search, Tag } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { lookupPath } from "@/lib/lookup-path";

const TABS = [
  { key: "web", label: "Web sitesi", icon: Globe, placeholder: "ör. hizliodeme-kargo.com", live: true },
  { key: "iban", label: "IBAN", icon: Building2, placeholder: "ör. TR47 0001 0009 9912 3456 78", live: true },
  { key: "phone", label: "Telefon", icon: Phone, placeholder: "ör. 0850 840 12 34", live: true },
  { key: "ilan", label: "İlan", icon: Tag, placeholder: "ör. sahibinden.com/ilan/... bağlantısı", live: true },
] as const;

const EXAMPLES: Record<string, string[]> = {
  web: ["hizliodeme-kargo.com", "trendyol.com"],
  iban: ["TR47 0001 0009 9912 3456 78"],
  phone: ["0850 840 12 34"],
  ilan: ["sahibinden.com/ilan/123456"],
};

export function LookupHero({ autoFocus = false, initialTab = "web" }: { autoFocus?: boolean; initialTab?: string }) {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>(
    (TABS.find((t) => t.key === initialTab)?.key ?? "web") as (typeof TABS)[number]["key"],
  );
  const [q, setQ] = useState("");
  const active = TABS.find((t) => t.key === tab)!;

  function go(value?: string) {
    let v = (value ?? q).trim();
    if (!v) return;
    if (!active.live) {
      toast("Bu sorgu türü çok yakında", { description: `${active.label} sorgusu hazırlanıyor.` });
      return;
    }
    if (tab === "phone") {
      v = v.replace(/\D/g, "");
    }
    if (tab === "iban") {
      v = v.replace(/\s+/g, "").toUpperCase();
    }
    // ilan: bağlantıyı temizle (protokol/www/query) → host/path slash'leri segment olur
    if (tab === "ilan") {
      v = v.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("#")[0]!.split("?")[0]!;
    }
    router.push(lookupPath(tab, v));
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-2.5 flex gap-1 rounded-xl bg-muted p-1" role="tablist" aria-label="Sorgu türü">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              type="button"
              role="tab"
              onClick={() => {
                setTab(t.key);
                setQ("");
              }}
              aria-selected={tab === t.key}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-[13px] transition-colors",
                tab === t.key ? "bg-background font-medium text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-[15px]" aria-hidden />
              <span className="hidden sm:inline">{t.label}</span>
              {!t.live && <span className="hidden text-[10px] text-muted-foreground/70 md:inline">· yakında</span>}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            autoFocus={autoFocus}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && go()}
            placeholder={active.placeholder}
            aria-label="Sorgulanacak değer"
            className="h-11 w-full rounded-lg border border-input bg-background pr-3 pl-9 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>
        <button
          onClick={() => go()}
          className="h-11 shrink-0 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Sorgula
        </button>
      </div>

      {EXAMPLES[tab].length > 0 && (
        <div className="mt-2.5 flex flex-wrap justify-center gap-2">
          {EXAMPLES[tab].map((ex) => (
            <button
              key={ex}
              onClick={() => {
                setQ(ex);
                go(ex);
              }}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-border/80 hover:text-foreground"
            >
              {ex}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
