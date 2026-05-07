import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";

import { Card } from "@/components/ui/card";
import { KiraForm } from "@/modules/kira/components/kira-form";

export const metadata: Metadata = {
  title: "Kira Tutarını Anonim Olarak Paylaş",
  description:
    "Kiranın tutarını, m²'sini ve bina yaşını saniyeler içinde anonim olarak paylaş. Adres, isim veya iletişim bilgisi alınmıyor.",
  alternates: { canonical: "/kira/yeni" },
  robots: { index: false, follow: true },
};

export default function KiraNewPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <Link
        href="/kira"
        className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Kiralara dön
      </Link>

      <div className="mt-4 mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Kira ilanını paylaş</h1>
        <p className="text-muted-foreground">
          Verin, Türkiye'deki gerçek kira aralıklarının oluşmasına anonim olarak katkı sağlar.
        </p>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-lg border bg-muted/30 p-4 text-sm">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-muted-foreground">
          Hiçbir hesap açmana gerek yok. Adres, isim veya iletişim bilgisi alınmıyor; sadece
          semt/mahalle adı yeterli.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <KiraForm />
      </Card>
    </div>
  );
}
