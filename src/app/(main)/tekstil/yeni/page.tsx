import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";

import { Card } from "@/components/ui/card";
import { TekstilForm } from "@/modules/tekstil/components/tekstil-form";

export const metadata: Metadata = {
  title: "Tekstil Fiyatını Anonim Olarak Paylaş",
  description:
    "Kesim, dikim, boyahane, baskı veya kumaş üretim fiyatını anonim paylaş. Sektörde gerçek piyasa şeffaflığı için veri.",
  alternates: { canonical: "/tekstil/yeni" },
  robots: { index: false, follow: true },
};

export default function TekstilNewPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <Link
        href="/tekstil"
        className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Tekstil fiyatlarına dön
      </Link>

      <div className="mt-4 mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Fiyatını paylaş</h1>
        <p className="text-muted-foreground">
          Sektörde piyasa şeffaflığı için anonim katkıda bulun. Şirket adı, müşteri
          adı, sipariş numarası alınmaz; sadece iş tipi, birim, fiyat.
        </p>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-lg border bg-muted/30 p-4 text-sm">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-muted-foreground">
          Hesap, isim, müşteri firma adı alınmaz. Kötüye kullanım için IP tek yönlü
          hash'lenir.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <TekstilForm />
      </Card>
    </div>
  );
}
