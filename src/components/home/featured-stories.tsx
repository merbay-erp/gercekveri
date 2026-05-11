import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { Card } from "@/components/ui/card";

interface Story {
  title: string;
  description: string;
  href: string;
  badge: string;
  tag: string;
  image: string;
  imageAlt: string;
}

// Unsplash CC0 fotograflari — kategoriye uygun, marka-bagimsiz.
// w=800 + q=80 + auto=format → optimize edilmis WebP/AVIF (Next.js Image otomatik)
const U = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=800&q=80&auto=format&fit=crop`;

const STORIES: Story[] = [
  {
    badge: "TCMB · Resmi",
    title: "Konut TÜFE'yi yendi mi?",
    description:
      "19 NUTS-2 bölgesi için TCMB Konut Fiyat Endeksi vs TÜFE karşılaştırması. Konut yatırımı reel değer kaybediyor mu kazanıyor mu?",
    href: "/konut-enflasyon",
    tag: "Karne 2026",
    // İstanbul ufuk çizgisi - modern binalar
    image: U("1539037116277-4db20889f2d4"),
    imageAlt: "İstanbul modern konut ufkı",
  },
  {
    badge: "Anonim · Halk verisi",
    title: "Şehirde maaş aralığın nedir?",
    description:
      "Pozisyon, sektör ve şehir bazında gerçek net maaşlar. Anonim, IQR ile temizlenmiş, K-anonymity korumalı.",
    href: "/maaslar",
    tag: "Maaş endeksi",
    // Modern ofis - yazılım çalışma alanı
    image: U("1497366216548-37526070297c"),
    imageAlt: "Modern ofis çalışma alanı",
  },
  {
    badge: "Anlık · TCMB",
    title: "Dolar TL gerçekten ne kadar?",
    description:
      "TCMB referans satış kuru — bankaların referans aldığı resmi değer. Yıllık değişim + 12 aylık tarihçe grafik.",
    href: "/doviz/usd-try",
    tag: "USD / TRY",
    // Dolar - finansal görsel
    image: U("1554224155-6726b3ff858f"),
    imageAlt: "Dolar bankot finansal görsel",
  },
  {
    badge: "Kira şişmesi",
    title: "İlan kira vs gerçek kira",
    description:
      "Emlakçı sitelerindeki kira değerlerinin gerçek ödenen kiraya oranı. Hangi şehirde fark en yüksek?",
    href: "/kira/sisme",
    tag: "Şehir analizi",
    // Anahtar - kira/ev
    image: U("1560448204-e02f11c3d0e2"),
    imageAlt: "Ev anahtarı kira görsel",
  },
  {
    badge: "Anonim · 5 ISP",
    title: "ISS'in promosyon sonrası ne istiyor?",
    description:
      "Gerçek aylık internet faturaları — promosyon dönemi değil, sürekli ödenen değerler. Şehir + paket karşılaştırma.",
    href: "/internet",
    tag: "ISP karşılaştırma",
    // Fiber optic kablolar
    image: U("1518770660439-4636190af475"),
    imageAlt: "Fiber optik internet kablolar",
  },
  {
    badge: "TCMB · Aylık",
    title: "Yıllık enflasyon kaç ay önce zirveydi?",
    description:
      "TÜFE 12 aylık trendi + endeks. 100 TL'lik sepetin bugünkü karşılığı. Resmi vs gerçek hayat farkı.",
    href: "/tufe",
    tag: "Enflasyon",
    // Market sepeti - enflasyon
    image: U("1542838132-92c53300491e"),
    imageAlt: "Market alışveriş sepeti",
  },
];

/**
 * Featured Stories — 6 görsel kart (3×2 grid) — her birinde gerçek fotoğraf
 * + başlık + açıklama. Görsellerin amacı: dwell time + tıklanma + AdSense
 * impression artışı. Unsplash CC0 görselleri Next.js Image optimize eder.
 */
export function FeaturedStories() {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="mb-8 flex items-end justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Bu ay öne çıkanlar
          </h2>
          <p className="text-muted-foreground">
            En çok tıklanan veri analizleri — TCMB + anonim halk verisi.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {STORIES.map((s) => (
          <Link key={s.href} href={s.href} className="group block">
            <Card className="relative h-full overflow-hidden p-0 transition group-hover:shadow-lg group-hover:-translate-y-0.5 duration-300">
              {/* IMAGE — orantili aspect ratio, overlay'li */}
              <div className="relative aspect-[16/10] w-full overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.imageAlt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-background/85 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-foreground backdrop-blur-sm">
                  {s.badge}
                </span>
              </div>

              <div className="space-y-2 p-5">
                <h3 className="text-lg font-semibold tracking-tight group-hover:text-foreground">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {s.description}
                </p>

                <div className="flex items-center justify-between border-t border-border/40 pt-3 text-xs">
                  <span className="font-medium text-muted-foreground">
                    {s.tag}
                  </span>
                  <span className="inline-flex items-center gap-0.5 font-medium text-foreground opacity-70 transition group-hover:opacity-100">
                    İncele
                    <ArrowUpRight className="h-3 w-3 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
