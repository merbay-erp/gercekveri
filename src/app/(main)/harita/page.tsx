import type { Metadata } from "next";
import { Map as MapIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TurkeyHeatmap } from "@/components/heatmap/turkey-heatmap";
import { getAllCityMedians } from "@/lib/city-medians";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `Türkiye Veri Haritası — Kira, Maaş, İnternet · ${siteConfig.name}`,
  description:
    "Türkiye geneli kira, maaş, aidat, fatura, internet ve tekstil verilerinin il bazında ısı haritası. Hangi şehirde hayat daha pahalı, kim daha çok kazanıyor?",
  alternates: { canonical: "/harita" },
};

export default async function HaritaPage() {
  const byCategory = await getAllCityMedians();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 max-w-2xl space-y-3">
        <Badge variant="secondary" className="font-normal">
          <MapIcon className="mr-1.5 h-3 w-3" /> Veri haritası
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Türkiye'nin gerçek verisi haritada
        </h1>
        <p className="text-muted-foreground">
          81 il, 6 kategori — anonim paylaşımların il bazında medyan değerleri.
          Bir şehre tıkla, detay sayfasına git. Veri arttıkça boş şehirler dolar.
        </p>
      </div>

      <Card className="p-4 sm:p-6">
        <TurkeyHeatmap byCategory={byCategory} defaultCategory="RENT" />
      </Card>

      <div className="mt-6 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
        <Card className="p-4">
          <p className="font-medium text-foreground">Renk skalası kategori başına</p>
          <p className="mt-1 text-xs">
            Maaş ve internet hızında <span className="text-emerald-600">yeşil = yüksek (iyi)</span>;
            kira / aidat / fatura'da <span className="text-rose-600">kırmızı = pahalı</span>.
            Her harita kendi min–max aralığında ölçeklenir.
          </p>
        </Card>
        <Card className="p-4">
          <p className="font-medium text-foreground">Boş şehirler</p>
          <p className="mt-1 text-xs">
            Gri renk = bu kategoride henüz yeterli paylaşım yok (en az 3 gerekli).
            İlin medyanını sen oluşturmak istersen{" "}
            <a
              href="/maaslar/yeni"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              veri paylaş
            </a>
            .
          </p>
        </Card>
      </div>
    </div>
  );
}
