"use client";

import * as React from "react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

import type { RecentSubmissionItem } from "@/lib/recent-activity";

interface Props {
  items: RecentSubmissionItem[];
}

const TYPE_TONE: Record<string, string> = {
  SALARY: "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  RENT: "bg-rose-500/12 text-rose-700 dark:text-rose-300 border-rose-500/30",
  AIDAT: "bg-amber-500/12 text-amber-700 dark:text-amber-300 border-amber-500/30",
  INTERNET: "bg-violet-500/12 text-violet-700 dark:text-violet-300 border-violet-500/30",
  UTILITY: "bg-orange-500/12 text-orange-700 dark:text-orange-300 border-orange-500/30",
  TEXTILE: "bg-fuchsia-500/12 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/30",
};

/**
 * Hero altındaki canlı bant — son N gerçek paylaşımı yatay kayan chip'lerle
 * gösterir. CSS-only infinite scroll (içerik 2x duplicate, transform animation).
 * Hover'da pause.
 *
 * Veri sparse (henüz az gerçek user paylaşımı) durumunda çubuk gizlenir —
 * 3 chip ile "kaymayan" durumu ekran kalabalığı yapar.
 */
export function LiveTicker({ items }: Props) {
  if (items.length < 4) return null;

  // İçeriği 2x duplicate ediyoruz ki transition seamless loop'a girsin
  const doubled = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden border-y border-border/60 bg-background/40 backdrop-blur">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent" />

      <div className="flex items-center gap-2 px-4 py-3">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Canlı akış
        </span>

        <div
          className="relative flex flex-1 overflow-hidden"
          aria-label="Son paylaşımlar"
        >
          <div className="flex animate-ticker gap-2 whitespace-nowrap will-change-transform hover:[animation-play-state:paused]">
            {doubled.map((it, idx) => (
              <span
                key={`${it.publicId}-${idx}`}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${
                  TYPE_TONE[it.type] ?? "bg-muted/40 text-muted-foreground"
                }`}
              >
                <span className="font-medium">{it.summary}</span>
                {it.cityName ? (
                  <span className="opacity-75">· {it.cityName}</span>
                ) : null}
                <span className="opacity-60">
                  · {formatDistanceToNow(it.createdAt, { addSuffix: true, locale: tr })}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 60s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-ticker { animation: none; }
        }
      `}</style>
    </div>
  );
}
