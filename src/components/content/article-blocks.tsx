import Link from "next/link";
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Info,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Quote,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Article content building blocks — düz prose yerine görsel hiyerarşi.
 *
 * Kategori sayfalarinin alt bilgi kismi için tasarlandı (TÜFE, USD/TRY,
 * faiz vb.). prose-className kombinasyonu yerine semantik blok'lardan
 * oluşan content layout.
 */

// =============== ContentSection ===============
// Icon'lu başlık + sol border accent + content
interface ContentSectionProps {
  icon: LucideIcon;
  title: string;
  accent?: "emerald" | "blue" | "rose" | "purple" | "amber" | "muted";
  children: ReactNode;
  id?: string;
}

const ACCENT_BORDER = {
  emerald: "border-l-emerald-500",
  blue: "border-l-blue-500",
  rose: "border-l-rose-500",
  purple: "border-l-purple-500",
  amber: "border-l-amber-500",
  muted: "border-l-border",
};

const ACCENT_ICON_BG = {
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  rose: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  muted: "bg-muted text-muted-foreground",
};

export function ContentSection({
  icon: Icon,
  title,
  accent = "muted",
  children,
  id,
}: ContentSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "border-l-2 pl-6 py-2",
        ACCENT_BORDER[accent],
      )}
    >
      <div className="mb-4 flex items-center gap-3">
        <span
          className={cn(
            "grid h-9 w-9 place-items-center rounded-lg",
            ACCENT_ICON_BG[accent],
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h2>
      </div>
      <div className="space-y-3 text-[15px] leading-relaxed text-muted-foreground">
        {children}
      </div>
    </section>
  );
}

// =============== Callout ===============
// Bilgi/uyarı/ipucu/başarı kutuları
interface CalloutProps {
  type: "info" | "warning" | "tip" | "success" | "quote";
  title?: string;
  children: ReactNode;
}

const CALLOUT_META: Record<
  CalloutProps["type"],
  { icon: LucideIcon; classes: string; iconClass: string }
> = {
  info: {
    icon: Info,
    classes: "border-blue-500/20 bg-blue-500/[0.04]",
    iconClass: "text-blue-500",
  },
  warning: {
    icon: AlertTriangle,
    classes: "border-amber-500/20 bg-amber-500/[0.04]",
    iconClass: "text-amber-500",
  },
  tip: {
    icon: Lightbulb,
    classes: "border-purple-500/20 bg-purple-500/[0.04]",
    iconClass: "text-purple-500",
  },
  success: {
    icon: CheckCircle2,
    classes: "border-emerald-500/20 bg-emerald-500/[0.04]",
    iconClass: "text-emerald-500",
  },
  quote: {
    icon: Quote,
    classes: "border-rose-500/20 bg-rose-500/[0.04]",
    iconClass: "text-rose-500",
  },
};

export function Callout({ type, title, children }: CalloutProps) {
  const meta = CALLOUT_META[type];
  const Icon = meta.icon;
  return (
    <div className={cn("my-4 rounded-lg border p-4", meta.classes)}>
      <div className="flex items-start gap-3">
        <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", meta.iconClass)} />
        <div className="flex-1 space-y-1">
          {title ? (
            <p className="text-sm font-semibold text-foreground">{title}</p>
          ) : null}
          <div className="text-sm leading-relaxed text-foreground/90">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// =============== KeyPointBox ===============
// "Önemli nokta" vurgu kutusu — big number + label
interface KeyPointBoxProps {
  label: string;
  value: string;
  description?: string;
  tone?: "neutral" | "positive" | "negative" | "warning";
}

const TONE_META = {
  neutral: { border: "border-border", value: "text-foreground" },
  positive: {
    border: "border-emerald-500/30 bg-emerald-500/[0.04]",
    value: "text-emerald-600 dark:text-emerald-400",
  },
  negative: {
    border: "border-rose-500/30 bg-rose-500/[0.04]",
    value: "text-rose-600 dark:text-rose-400",
  },
  warning: {
    border: "border-amber-500/30 bg-amber-500/[0.04]",
    value: "text-amber-600 dark:text-amber-400",
  },
};

export function KeyPointBox({
  label,
  value,
  description,
  tone = "neutral",
}: KeyPointBoxProps) {
  const m = TONE_META[tone];
  return (
    <div className={cn("rounded-lg border p-4", m.border)}>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 text-2xl font-semibold tabular-nums tracking-tight sm:text-3xl",
          m.value,
        )}
      >
        {value}
      </p>
      {description ? (
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}

// =============== KeyPointGrid ===============
// Yan yana 2-4 KeyPointBox grid
export function KeyPointGrid({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}

// =============== DefinitionList ===============
// İkon'lu tanım listesi (bold term + description)
export interface DefinitionItem {
  term: string;
  description: string | ReactNode;
  icon?: LucideIcon;
}

export function DefinitionList({ items }: { items: DefinitionItem[] }) {
  return (
    <dl className="my-4 space-y-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.term}
            className="flex items-start gap-3 rounded-lg border border-border/60 bg-card p-3"
          >
            {Icon ? (
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                <Icon className="h-3.5 w-3.5" />
              </span>
            ) : (
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            )}
            <div className="flex-1">
              <dt className="text-sm font-semibold text-foreground">
                {item.term}
              </dt>
              <dd className="mt-0.5 text-sm text-muted-foreground">
                {item.description}
              </dd>
            </div>
          </div>
        );
      })}
    </dl>
  );
}

// =============== RelatedDataGrid ===============
// "İlgili veriler" görsel grid
interface RelatedLink {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  accent?: keyof typeof ACCENT_ICON_BG;
}

export function RelatedDataGrid({ links }: { links: RelatedLink[] }) {
  return (
    <div className="my-6 grid gap-3 sm:grid-cols-2">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link key={link.href} href={link.href} className="group block">
            <Card className="h-full p-4 transition hover:border-foreground/30 hover:shadow-sm">
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-lg",
                    ACCENT_ICON_BG[link.accent ?? "muted"],
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-foreground">{link.title}</p>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {link.description}
                  </p>
                </div>
              </div>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

// =============== StatLine ===============
// İçinde değer + label yan yana bilgi satırı
export function StatLine({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border/40 py-2 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="text-right">
        <span className="font-semibold tabular-nums">{value}</span>
        {hint ? (
          <p className="text-[10px] text-muted-foreground">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}
