import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";

import { Card } from "@/components/ui/card";
import { FaturaForm } from "@/modules/fatura/components/fatura-form";

export const metadata: Metadata = {
  title: "Faturanı Anonim Olarak Paylaş",
  description:
    "Elektrik, doğalgaz ya da su faturanı anonim paylaş. Komşundan farklı mı ödüyorsun, kıyas Türkiye geneli için kullanılacak.",
  alternates: { canonical: "/fatura/yeni" },
  robots: { index: false, follow: true },
};

export default function FaturaNewPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <Link
        href="/fatura"
        className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Faturalara dön
      </Link>

      <div className="mt-4 mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Faturanı paylaş</h1>
        <p className="text-muted-foreground">
          Türkiye'deki gerçek fatura aralıklarına anonim katkıda bulun. Abone numarası,
          sayaç bilgisi alınmaz; sadece tür, tutar, tüketim ve hane bilgisi.
        </p>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-lg border bg-muted/30 p-4 text-sm">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-muted-foreground">
          Hesap, isim, abone no alınmaz. Kötüye kullanım için IP tek yönlü hash'lenir.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <FaturaForm />
      </Card>
    </div>
  );
}
