import { Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { CachedInsight } from "@/services/ai/insights";

interface Props {
  insight: CachedInsight;
}

export function MaasAiInsight({ insight }: Props) {
  return (
    <Card className="overflow-hidden border-amber-500/20 bg-gradient-to-br from-amber-500/[0.04] via-transparent to-transparent p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-amber-500/10 text-amber-500">
          <Sparkles className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-wider text-amber-500/80">
              AI Özeti
            </span>
            <span className="text-xs text-muted-foreground">
              · {insight.inputCount} veriden
            </span>
            <span className="text-xs text-muted-foreground">· {insight.modelName}</span>
          </div>

          {insight.title ? (
            <h3 className="text-base font-medium leading-snug">{insight.title}</h3>
          ) : null}

          <p className="text-sm leading-relaxed text-muted-foreground">{insight.body}</p>

          {insight.bullets.length > 0 ? (
            <ul className="space-y-1.5 text-sm">
              {insight.bullets.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                  <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-amber-500/60" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          ) : null}

          <p className="pt-1 text-[11px] text-muted-foreground/70">
            AI tarafından üretildi — yalnızca yukarıdaki istatistik özetidir, finansal tavsiye değildir.
          </p>
        </div>
      </div>
    </Card>
  );
}
