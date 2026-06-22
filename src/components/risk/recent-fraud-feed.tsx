import Link from "next/link";
import { Building2, Globe, Phone, Tag, type LucideIcon } from "lucide-react";
import type { FraudFeedItem } from "@/modules/lookup/types";
import { reportCategoryLabel, type LookupKind } from "@/services/risk/registry";
import { bandSoft } from "./risk-tokens";
import { cn } from "@/lib/utils";

const KIND_ICON: Record<LookupKind, LucideIcon> = {
  web: Globe,
  iban: Building2,
  phone: Phone,
  ilan: Tag,
};

export function RecentFraudFeed({ items }: { items: FraudFeedItem[] }) {
  if (items.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">
        Henüz ihbar yok. İlk bildirimi sen yapabilirsin.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {items.map((it) => {
        const Icon = KIND_ICON[it.kind] ?? Globe;
        return (
          <Link
            key={`${it.kind}-${it.key}`}
            href={`/sorgu/${it.kind}/${it.key}`}
            className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2.5 transition-colors hover:bg-muted/50"
          >
            <Icon className="size-[18px] shrink-0 text-muted-foreground" aria-hidden />
            <div className="min-w-0 flex-1">
              <div className="truncate font-mono text-sm font-medium">{it.display}</div>
              <div className="text-xs text-muted-foreground">
                {it.topCategory ? reportCategoryLabel(it.kind, it.topCategory) : "İhbar"}
              </div>
            </div>
            <span className={cn("shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium", bandSoft[it.band])}>
              {it.reportCount} ihbar
            </span>
          </Link>
        );
      })}
    </div>
  );
}
