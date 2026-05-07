import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { CachedInsight } from "@/services/ai/insights";

interface Props {
  insight: CachedInsight;
  /** Optional CTA below the insight body */
  cta?: { href: string; label: string };
}

/**
 * Hero-grade AI insight panel — designed for the homepage, where the
 * insight is the headline of the data layer rather than just a side
 * card on a category page. Larger typography, prominent gradient,
 * optional CTA.
 */
export function AmountAiInsightLarge({ insight, cta }: Props) {
  return (
    <Card className="relative overflow-hidden border-amber-500/30 bg-gradient-to-br from-amber-500/[0.08] via-amber-500/[0.02] to-transparent p-6 sm:p-8">
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500/15 text-amber-500">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              AI Yorumu
            </p>
            <p className="text-[11px] text-muted-foreground">
              {insight.inputCount} veri noktası · {insight.modelName}
            </p>
          </div>
        </div>

        {insight.title ? (
          <h3 className="mb-3 text-xl font-semibold leading-snug sm:text-2xl">
            {insight.title}
          </h3>
        ) : null}

        <p className="text-base leading-relaxed text-foreground/85">{insight.body}</p>

        {insight.bullets.length > 0 ? (
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {insight.bullets.map((bullet, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 rounded-lg border bg-card/40 px-3 py-2 text-foreground/85"
              >
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500/70" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-5 flex items-center justify-between border-t border-amber-500/15 pt-4">
          <p className="text-[11px] text-muted-foreground/80">
            AI tarafından üretildi — finansal tavsiye değildir.
          </p>
          {cta ? (
            <Link
              href={cta.href}
              className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 transition hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
            >
              {cta.label} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
