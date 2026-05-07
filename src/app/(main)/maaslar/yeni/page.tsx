import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";

import { Card } from "@/components/ui/card";
import { MaasForm } from "@/modules/maas/components/maas-form";

export const metadata: Metadata = {
  title: "Maaşını Anonim Olarak Paylaş",
  description:
    "Pozisyonun, deneyimin ve net maaşını saniyeler içinde anonim olarak paylaş. E-posta, hesap veya kişisel bilgi gerekmez.",
  alternates: { canonical: "/maaslar/yeni" },
  robots: { index: false, follow: true },
};

export default function MaasNewPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <Link
        href="/maaslar"
        className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Maaşlara dön
      </Link>

      <div className="mt-4 mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Maaşını paylaş</h1>
        <p className="text-muted-foreground">
          Verin, Türkiye'deki gerçek aralıkların oluşmasına anonim olarak katkı sağlıyor.
        </p>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-lg border bg-muted/30 p-4 text-sm">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-muted-foreground">
          Hiçbir hesap açmana gerek yok. IP'n ve tarayıcı bilgilerin saklanmaz; yalnızca tek
          yönlü hash'leri kötüye kullanım önlemi olarak tutulur.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <MaasForm />
      </Card>
    </div>
  );
}
