import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Clock3,
  Globe2,
  LifeBuoy,
  Phone,
  Radar,
  Tag,
  type LucideIcon,
} from "lucide-react";

import type { Guide, GuideIcon } from "@/content/guides";
import { cn } from "@/lib/utils";

export const guideIconMap: Record<GuideIcon, LucideIcon> = {
  globe: Globe2,
  building: Building2,
  phone: Phone,
  tag: Tag,
  "life-buoy": LifeBuoy,
  radar: Radar,
};

const guideTone: Record<GuideIcon, string> = {
  globe: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  building: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  phone: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  tag: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  "life-buoy": "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  radar: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
};

export function GuideCard({ guide, compact = false }: { guide: Guide; compact?: boolean }) {
  const Icon = guideIconMap[guide.icon];

  return (
    <Link
      href={`/rehber/${guide.slug}`}
      className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-foreground/20 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <span className={cn("grid size-10 shrink-0 place-items-center rounded-lg", guideTone[guide.icon])}>
          <Icon className="size-5" aria-hidden />
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock3 className="size-3" aria-hidden />
          {guide.readingMinutes} dk
        </span>
      </div>
      <div className="mt-4 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {guide.category}
        </p>
        <h3 className={cn("mt-1.5 font-semibold leading-snug tracking-tight", compact ? "text-base" : "text-lg")}>
          {guide.shortTitle}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{guide.description}</p>
      </div>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium">
        Rehberi oku
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
