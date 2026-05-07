"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check, X, Flag } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  approveSubmission,
  rejectSubmission,
  flagSubmission,
} from "../actions";

interface Props {
  publicId: string;
  currentStatus: string;
}

export function ModerationActions({ publicId, currentStatus }: Props) {
  const router = useRouter();
  const [reason, setReason] = React.useState("");
  const [isPending, startTransition] = React.useTransition();

  const run = (
    fn: (id: string, r: string | null) => Promise<{ ok: boolean; error?: string }>,
    label: string,
  ) =>
    startTransition(async () => {
      const result = await fn(publicId, reason.trim() || null);
      if (!result.ok) {
        toast.error(result.error ?? "İşlem başarısız.");
        return;
      }
      toast.success(`${label} başarılı.`);
      setReason("");
      router.refresh();
    });

  const runApprove = () =>
    startTransition(async () => {
      const result = await approveSubmission(publicId);
      if (!result.ok) {
        toast.error(result.error ?? "İşlem başarısız.");
        return;
      }
      toast.success("Onaylandı.");
      router.refresh();
    });

  return (
    <div className="space-y-3 rounded-lg border bg-muted/20 p-4">
      <div>
        <label className="text-xs font-medium text-muted-foreground">
          Sebep / not (opsiyonel — reject/flag için tavsiye edilir)
        </label>
        <Textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Örn. ortalamadan 10x sapma, tahmini sahte"
          rows={2}
          className="mt-1"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          onClick={runApprove}
          disabled={isPending || currentStatus === "APPROVED"}
          className="bg-emerald-600 hover:bg-emerald-600/90"
        >
          {isPending ? (
            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="mr-1 h-3.5 w-3.5" />
          )}
          Onayla
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => run(rejectSubmission, "Reddedildi")}
          disabled={isPending || currentStatus === "REJECTED"}
        >
          <X className="mr-1 h-3.5 w-3.5" />
          Reddet
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => run(flagSubmission, "Flaglendi")}
          disabled={isPending || currentStatus === "FLAGGED"}
        >
          <Flag className="mr-1 h-3.5 w-3.5" />
          Flagle
        </Button>
      </div>
    </div>
  );
}
