import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Lock } from "lucide-react";

import { Card } from "@/components/ui/card";
import { InternetForm } from "@/modules/internet/components/internet-form";

export const metadata: Metadata = {
  title: "İnternet Ölçümünü Anonim Olarak Paylaş",
  description:
    "Sağlayıcının, paket hızının, gerçek hızının ve ping'inin anonim olarak paylaşıldığı yer.",
  alternates: { canonical: "/internet/yeni" },
  robots: { index: false, follow: true },
};

export default function InternetNewPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <Link
        href="/internet"
        className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> İnternete dön
      </Link>

      <div className="mt-4 mb-8 space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">İnternetini paylaş</h1>
        <p className="text-muted-foreground">
          Türkiye'deki ISP'lerin gerçek hız ve memnuniyet aralıklarına anonim katkı.
        </p>
      </div>

      <div className="mb-6 flex items-start gap-3 rounded-lg border bg-muted/30 p-4 text-sm">
        <Lock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
        <p className="text-muted-foreground">
          Hesap, isim, abone numarası — hiçbir kişisel veri istenmiyor. Sadece sağlayıcı
          ve şehir/ilçe.
        </p>
      </div>

      <Card className="p-6 sm:p-8">
        <InternetForm />
      </Card>
    </div>
  );
}
