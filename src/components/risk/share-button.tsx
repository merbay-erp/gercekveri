"use client";

import { Share2 } from "lucide-react";
import { toast } from "sonner";

export function ShareButton({ url, label = "Paylaş" }: { url: string; label?: string }) {
  async function onClick() {
    try {
      if (navigator.share) {
        await navigator.share({ url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Bağlantı kopyalandı");
      }
    } catch {
      // kullanıcı iptal etti — sessiz
    }
  }
  return (
    <button
      onClick={onClick}
      className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-muted"
    >
      <Share2 className="size-4" aria-hidden />
      {label}
    </button>
  );
}
