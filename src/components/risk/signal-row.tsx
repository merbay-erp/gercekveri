import type { Signal } from "@/services/risk/types";
import { iconFor } from "./icon-map";
import { statusIcon, statusSoft } from "./risk-tokens";
import { cn } from "@/lib/utils";

export function SignalRow({ signal }: { signal: Signal }) {
  const Icon = iconFor(signal.icon);
  return (
    <div className="flex items-center gap-3 border-t border-border/60 py-2.5 first:border-t-0">
      <Icon className={cn("size-[18px] shrink-0", statusIcon[signal.status])} aria-hidden />
      <span className="flex-1 text-sm text-muted-foreground">{signal.label}</span>
      <span className="text-sm font-medium">{signal.value}</span>
      <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-medium", statusSoft[signal.status])}>
        {signal.pill}
      </span>
    </div>
  );
}
