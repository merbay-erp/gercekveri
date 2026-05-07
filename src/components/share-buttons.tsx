"use client";

import * as React from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { toast } from "sonner";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  url: string;
  text: string;
  className?: string;
}

/**
 * Native Web Share + Twitter/X intent + WhatsApp intent + copy fallback.
 *
 * Web Share is preferred on mobile because it surfaces every installed
 * messaging app — but desktop browsers don't have it, so we keep the
 * Twitter / WhatsApp / copy buttons visible regardless.
 */
export function ShareButtons({ url, text, className }: Props) {
  const [copied, setCopied] = React.useState(false);

  const tweetUrl =
    "https://twitter.com/intent/tweet?" +
    new URLSearchParams({ text, url }).toString();
  const whatsappUrl =
    "https://wa.me/?" +
    new URLSearchParams({ text: `${text}\n${url}` }).toString();

  const onNativeShare = async () => {
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ text, url, title: "GerçekVeri" });
      } catch {
        // user cancelled, do nothing
      }
    } else {
      onCopy();
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Bağlantı kopyalandı.");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Bağlantı kopyalanamadı.");
    }
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <button
        type="button"
        onClick={onNativeShare}
        className={cn(buttonVariants({ size: "sm" }), "gap-1.5")}
      >
        <Share2 className="h-3.5 w-3.5" />
        Paylaş
      </button>
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1.5")}
      >
        Twitter
      </a>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ size: "sm", variant: "outline" }), "gap-1.5")}
      >
        WhatsApp
      </a>
      <button
        type="button"
        onClick={onCopy}
        className={cn(buttonVariants({ size: "sm", variant: "ghost" }), "gap-1.5")}
      >
        {copied ? (
          <>
            <Check className="h-3.5 w-3.5" /> Kopyalandı
          </>
        ) : (
          <>
            <Copy className="h-3.5 w-3.5" /> Bağlantıyı kopyala
          </>
        )}
      </button>
    </div>
  );
}
