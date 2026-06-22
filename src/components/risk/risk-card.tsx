import Link from "next/link";
import { AlertTriangle, Flag, MessageSquareWarning, Sparkles } from "lucide-react";
import type { EntityView } from "@/modules/lookup/types";
import { BAND_LABEL } from "@/services/risk/types";
import { ScoreRing } from "./score-ring";
import { SignalRow } from "./signal-row";
import { ShareButton } from "./share-button";
import { bandSoft } from "./risk-tokens";
import { siteConfig } from "@/lib/site-config";
import { lookupPath } from "@/lib/lookup-path";
import { cn } from "@/lib/utils";

export function RiskCard({ entity }: { entity: EntityView }) {
  const shareUrl = `https://${siteConfig.domain}${lookupPath(entity.kind, entity.key)}`;
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2.5 border-b border-border px-4 py-3">
        <span className="text-xs text-muted-foreground">Sorgu</span>
        <span className="font-mono text-sm font-medium break-all">{entity.display}</span>
        <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">
          {entity.lastScanAt ? "önbellekli tarama" : "canlı tarama"}
        </span>
      </div>

      <div className="flex flex-col items-center gap-5 border-b border-border p-5 sm:flex-row sm:items-center">
        <ScoreRing score={entity.score} band={entity.band} />
        <div>
          <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium", bandSoft[entity.band])}>
            <AlertTriangle className="size-4" aria-hidden />
            {BAND_LABEL[entity.band]}
          </span>
          <p className="mt-2.5 flex gap-2 text-sm leading-relaxed text-muted-foreground">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-info" aria-hidden />
            <span>{entity.aiSummary}</span>
          </p>
        </div>
      </div>

      <div className="px-4 py-2">
        {entity.signals.map((s, i) => (
          <SignalRow key={`${s.label}-${i}`} signal={s} />
        ))}
      </div>

      <div className="flex flex-col gap-2 border-t border-border bg-muted/40 p-4 sm:flex-row">
        <Link
          href={`/ihbar?kind=${entity.kind}&value=${encodeURIComponent(entity.key)}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted"
        >
          <Flag className="size-4" aria-hidden />
          İhbar et
        </Link>
        <ShareButton url={shareUrl} />
        <Link
          href="/iletisim"
          className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted"
        >
          <MessageSquareWarning className="size-4" aria-hidden />
          Yanlışsa itiraz et
        </Link>
      </div>
    </div>
  );
}
