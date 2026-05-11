import Link from "next/link";
import {
  ArrowUpRight,
  Map as MapIcon,
  Building2,
  TrendingUp,
  Wallet,
  Wifi,
} from "lucide-react";

import { Card } from "@/components/ui/card";

interface Story {
  title: string;
  description: string;
  href: string;
  badge: string;
  Icon: typeof MapIcon;
  accent: string;
  tag: string;
}

const STORIES: Story[] = [
  {
    badge: "TCMB · Resmi",
    title: "Konut TÜFE'yi yendi mi?",
    description:
      "19 NUTS-2 bölgesi için TCMB Konut Fiyat Endeksi vs TÜFE karşılaştırması. Hangi bölgede konut yatırımı reel değer kaybediyor, hangisinde kazanıyor?",
    href: "/konut-enflasyon",
    Icon: Building2,
    accent: "border-rose-500/20 hover:border-rose-500/40 from-rose-500/[0.05]",
    tag: "Karne 2026",
  },
  {
    badge: "Anonim · Halk verisi",
    title: "Şehirde maaş aralığın nedir?",
    description:
      "Pozisyon, sektör ve şehir bazında gerçek net maaşlar. Anonim olarak paylaşılan, IQR ile temizlenmiş, K-anonymity korumalı.",
    href: "/maaslar",
    Icon: Wallet,
    accent: "border-emerald-500/20 hover:border-emerald-500/40 from-emerald-500/[0.05]",
    tag: "Maaş endeksi",
  },
  {
    badge: "Anlık · TCMB",
    title: "Dolar TL gerçekten ne kadar?",
    description:
      "TCMB referans satış kuru — bankaların referans aldığı resmi değer. Yıllık değişim + 12 aylık tarihçe grafik.",
    href: "/doviz/usd-try",
    Icon: TrendingUp,
    accent: "border-emerald-500/20 hover:border-emerald-500/40 from-emerald-500/[0.05]",
    tag: "USD / TRY",
  },
  {
    badge: "Kira şişmesi",
    title: "İlan kira vs gerçek kira",
    description:
      "Emlakçı sitelerindeki kiraların kullanıcı raporlarına oranı. Hangi şehirde ilan, ödenen değerden ne kadar yüksek?",
    href: "/kira/sisme",
    Icon: MapIcon,
    accent: "border-amber-500/20 hover:border-amber-500/40 from-amber-500/[0.05]",
    tag: "Şehir analizi",
  },
  {
    badge: "Anonim · 5 ISP",
    title: "ISS'in promosyon sonrası ne istiyor?",
    description:
      "Türk Telekom, TurkNet, Vodafone, Superonline gerçek aylık faturalar — promosyon değil, sürekli ödenen değerler.",
    href: "/internet",
    Icon: Wifi,
    accent: "border-violet-500/20 hover:border-violet-500/40 from-violet-500/[0.05]",
    tag: "ISP karşılaştırma",
  },
  {
    badge: "TCMB · Aylık",
    title: "Yıllık enflasyon kaç ay önce zirveydi?",
    description:
      "TÜFE 12 aylık trendi + endeks. 100 TL'lik sepetin bugünkü karşılığı. Resmi vs gerçek hayat farkı.",
    href: "/tufe",
    Icon: TrendingUp,
    accent: "border-rose-500/20 hover:border-rose-500/40 from-rose-500/[0.05]",
    tag: "Enflasyon",
  },
];

/**
 * Featured Stories — hero altında 6 görsel "story kart" (3×2 grid).
 *
 * Her kart kendi viral data konusunu vurgular ve hedef sayfaya link verir.
 * Tıklanan kart yeni bir sayfa görüntülemesi → reklam impression artışı.
 *
 * Statik içerik (editorial picks). İlerleyen sürümde DB'den dinamik
 * "bu ay öne çıkanlar" hesaplanabilir.
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STORIES.map((s) => {
          const Icon = s.Icon;
          return (
            <Link key={s.href} href={s.href} className="group block">
              <Card
                className={`relative h-full overflow-hidden bg-gradient-to-br ${s.accent} to-transparent p-5 transition group-hover:shadow-md`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-md bg-background/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
                    {s.badge}
                  </span>
                  <Icon className="h-4 w-4 text-muted-foreground/60 transition group-hover:text-foreground/80" />
                </div>

                <h3 className="text-lg font-semibold tracking-tight">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>

                <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-3 text-xs">
                  <span className="font-medium text-muted-foreground">
                    {s.tag}
                  </span>
                  <span className="inline-flex items-center gap-0.5 font-medium text-foreground opacity-60 transition group-hover:opacity-100">
                    İncele
                    <ArrowUpRight className="h-3 w-3 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
