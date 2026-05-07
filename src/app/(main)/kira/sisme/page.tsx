import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, Flame, ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RentInflationPanel } from "@/modules/kira/components/rent-inflation-panel";
import {
  getRentInflationStats,
  getTopInflationCities,
} from "@/modules/kira/server/queries";
import { siteConfig } from "@/lib/site-config";
import { formatNumber, formatTRY } from "@/lib/money";

export const revalidate = 300;

export const metadata: Metadata = {
  title: `Türkiye Kira Şişkinliği — İlan vs Gerçek · ${siteConfig.name}`,
  description:
    "Sahibinden / emlakçı ilanlarındaki fiyatlar ile kiracıların gerçekten ödediği tutarlar arasındaki fark. Anonim kiracı verisi, şehir bazlı şişkinlik tablosu.",
  alternates: { canonical: "/kira/sisme" },
  openGraph: {
    images: [{ url: "/api/og/inflation", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/api/og/inflation"],
  },
};

export default async function KiraSismePage() {
  const [overall, topCities] = await Promise.all([
    getRentInflationStats({}).catch(() => ({
      pairCount: 0,
      realMedian: null,
      listedMedian: null,
      inflationPct: null,
    })),
    getTopInflationCities(3, 30).catch(() => []),
  ]);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/kira"
        className="inline-flex items-center text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ChevronLeft className="mr-1 h-4 w-4" /> Kira sayfasına dön
      </Link>

      <div className="mt-4 mb-8 max-w-2xl space-y-3">
        <Badge variant="secondary" className="font-normal">
          <Flame className="mr-1.5 h-3 w-3" /> Gerçek vs İlan
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Kira ilanları gerçeği yansıtıyor mu?
        </h1>
        <p className="text-muted-foreground">
          Sahibinden, hepsiemlak vb. ilanlarındaki <span className="font-medium text-foreground">istek fiyatları</span> ile
          anonim kiracıların aynı tipte daireler için <span className="font-medium text-foreground">gerçekten ödediği</span> tutarlar arasındaki fark. Veri arttıkça hassasiyet artar.
        </p>
      </div>

      <RentInflationPanel
        stats={overall}
        scopeLabel="Türkiye geneli"
        shareHref={undefined}
      />

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold tracking-tight">
          Şehir bazlı şişkinlik
        </h2>

        {topCities.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Henüz şehir kıyaslayacak kadar eşleşmiş ilan/gerçek çifti yok. İlk
              veriyi sen ekle — kira paylaşırken ilan fiyatını da yaz.
            </p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/30">
                <tr>
                  <Th>Şehir</Th>
                  <Th>İlan medyanı</Th>
                  <Th>Gerçek medyanı</Th>
                  <Th align="right">Şişkinlik</Th>
                  <Th align="right">Eşleşme</Th>
                </tr>
              </thead>
              <tbody>
                {topCities.map((c) => (
                  <tr
                    key={c.citySlug}
                    className="border-b last:border-0 hover:bg-muted/20"
                  >
                    <Td>
                      <Link
                        href={`/kira/sehir/${c.citySlug}`}
                        className="font-medium hover:underline"
                      >
                        {c.cityName}
                      </Link>
                    </Td>
                    <Td>
                      <span className="tabular-nums">
                        {formatTRY(c.listedMedian)}
                      </span>
                    </Td>
                    <Td>
                      <span className="tabular-nums">
                        {formatTRY(c.realMedian)}
                      </span>
                    </Td>
                    <Td align="right">
                      <span
                        className={`font-semibold tabular-nums ${
                          c.inflationPct > 0
                            ? "text-rose-600 dark:text-rose-400"
                            : c.inflationPct < 0
                              ? "text-emerald-600 dark:text-emerald-400"
                              : ""
                        }`}
                      >
                        {c.inflationPct > 0 ? "+" : ""}%{c.inflationPct}
                      </span>
                    </Td>
                    <Td align="right">
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {formatNumber(c.pairCount)}
                      </span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </div>

      <Card className="mt-10 bg-muted/20 p-6">
        <h3 className="mb-2 text-base font-medium">Nasıl katkıda bulunabilirsin?</h3>
        <p className="text-sm text-muted-foreground">
          Kira paylaşma formunda artık <span className="font-medium text-foreground">"İlan fiyatı"</span>{" "}
          alanı var. Hem ilanı, hem gerçek ödediğini girersen veri tek paylaşımdan
          iki sinyal birden çıkıyor. Anonim — hiçbir kişisel bilgi alınmıyor.
        </p>
        <Link
          href="/kira/yeni"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          Kira paylaş <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </Card>
    </div>
  );
}

function Th({ children, align }: { children: React.ReactNode; align?: "right" }) {
  return (
    <th
      className={`px-4 py-2.5 text-xs font-medium text-muted-foreground ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Td({ children, align }: { children: React.ReactNode; align?: "right" }) {
  return (
    <td className={`px-4 py-2.5 ${align === "right" ? "text-right" : ""}`}>{children}</td>
  );
}
