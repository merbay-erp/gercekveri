"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, X, Flag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { bulkUpdateSubmissions, type BulkFilter } from "./actions";

interface Props {
  filter: BulkFilter;
  matchingCount: number;
  /** Current viewing status — disables redundant target. */
  currentStatus?: string;
}

export function BulkToolbar({ filter, matchingCount, currentStatus }: Props) {
  const router = useRouter();
  const [pendingFor, setPendingFor] = React.useState<string | null>(null);

  const run = async (target: "APPROVED" | "REJECTED" | "FLAGGED") => {
    const targetLabel =
      target === "APPROVED" ? "onayla" : target === "REJECTED" ? "reddet" : "flagle";
    if (
      !window.confirm(
        `Mevcut filtreye uyan ${matchingCount > 500 ? "ilk 500" : matchingCount} paylaşımı toplu ${targetLabel}lamak istiyor musun? Bu işlem geri alınamaz, ModerationLog'a kayıt düşer.`,
      )
    ) {
      return;
    }
    setPendingFor(target);
    const result = await bulkUpdateSubmissions(filter, target);
    setPendingFor(null);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`${result.count} paylaşım ${targetLabel}landı.`);
    router.refresh();
  };

  if (matchingCount === 0) return null;

  const showApprove = currentStatus !== "APPROVED";
  const showReject = currentStatus !== "REJECTED";
  const showFlag = currentStatus !== "FLAGGED";

  return (
    <div className="flex flex-wrap items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-sm">
      <span className="font-medium">
        Filtrelenen {matchingCount} paylaşıma toplu işlem:
      </span>
      <div className="ml-auto flex flex-wrap gap-2">
        {showApprove ? (
          <Button
            size="sm"
            onClick={() => run("APPROVED")}
            disabled={pendingFor !== null}
            className="bg-emerald-600 hover:bg-emerald-600/90"
          >
            {pendingFor === "APPROVED" ? (
              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Check className="mr-1 h-3.5 w-3.5" />
            )}
            Hepsini onayla
          </Button>
        ) : null}
        {showReject ? (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => run("REJECTED")}
            disabled={pendingFor !== null}
          >
            {pendingFor === "REJECTED" ? (
              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
            ) : (
              <X className="mr-1 h-3.5 w-3.5" />
            )}
            Hepsini reddet
          </Button>
        ) : null}
        {showFlag ? (
          <Button
            size="sm"
            variant="outline"
            onClick={() => run("FLAGGED")}
            disabled={pendingFor !== null}
          >
            {pendingFor === "FLAGGED" ? (
              <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
            ) : (
              <Flag className="mr-1 h-3.5 w-3.5" />
            )}
            Hepsini flagle
          </Button>
        ) : null}
      </div>
    </div>
  );
}
