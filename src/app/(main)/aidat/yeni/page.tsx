import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";

import { Card } from "@/components/ui/card";
import { AidatForm } from "@/modules/aidat/components/aidat-form";

export const metadata: Metadata = {
  title: "Aidatını Anonim Olarak Paylaş",
  description:
    "Sitendeki ya da binandaki aidat tutarını anonim paylaş. Komşunla aynı parayı mı veriyorsun, kıyas Türkiye geneli için kullanılacak.",
  alternates: { canonical: "/aidat/yeni" },
  robots: { index: false, follow: true },
};

export default function AidatNewPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <Link
        href="/aidat"
        className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Aidatlara dön
      </Link>

      <div className="mt-4 mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Aidatını paylaş</h1>
        <p className="text-muted-foreground">
          Türkiye'deki gerçek aidat aralıklarına anonim katkıda bulun. Bina/site adı
          alınmaz; yalnızca semt yeterli.
        </p>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-lg border bg-muted/30 p-4 text-sm">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-muted-foreground">
          Hesap, isim, daire numarası, yönetici bilgisi alınmaz. Kötüye kullanım için IP
          tek yönlü hash'lenir.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <AidatForm />
      </Card>
    </div>
  );
}
