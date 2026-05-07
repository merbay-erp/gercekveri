import type { Metadata } from "next";
import Link from "next/link";
import { Banknote, Home, Building2, Plug, Scissors, ArrowRight } from "lucide-react";

import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Karşılaştır — kendin nerede duruyorsun?",
  description:
    "Maaşını, kiranı, aidatını ve faturanı Türkiye ortalamasıyla anlık olarak kıyasla. Kişisel bilgi alınmaz, sadece bu sayfa için hesaplanır.",
  alternates: { canonical: "/karsilastir" },
};

const options = [
  {
    href: "/karsilastir/maas",
    icon: Banknote,
    title: "Maaşımı karşılaştır",
    body: "Pozisyon ve şehir bazında medyan ile kıyas. Hangi yüzdelik dilimdesin?",
    accent: "from-emerald-500/10",
  },
  {
    href: "/karsilastir/kira",
    icon: Home,
    title: "Kiramı karşılaştır",
    body: "Şehir ve ilçe medyanı ile kıyas. Pahalı mı uygun mu?",
    accent: "from-sky-500/10",
  },
  {
    href: "/karsilastir/aidat",
    icon: Building2,
    title: "Aidatımı karşılaştır",
    body: "Yapı tipi + bölge medyanı ile kıyas. Komşundan ne kadar farklı?",
    accent: "from-amber-500/10",
  },
  {
    href: "/karsilastir/fatura",
    icon: Plug,
    title: "Faturamı karşılaştır",
    body: "Elektrik, gaz, su faturanı bölge medyanıyla kıyasla. Hane filtresi var.",
    accent: "from-rose-500/10",
  },
  {
    href: "/karsilastir/tekstil",
    icon: Scissors,
    title: "Tekstil fiyatımı karşılaştır",
    body: "Kesim, dikim, boyahane vs. birim fiyatın piyasa medyanına göre nerede?",
    accent: "from-fuchsia-500/10",
  },
];

export default function CompareLandingPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="mb-12 space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Sen nerede duruyorsun?
        </h1>
        <p className="text-lg text-muted-foreground">
          Maaşını, kiranı, aidatını veya faturanı yaz; Türkiye'deki anonim verilerden
          hesaplanmış medyanla ne kadar uzakta olduğunu gör. Kişisel bilgi istemez,
          hesabın saklanmaz.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {options.map(({ href, icon: Icon, title, body, accent }) => (
          <Link key={href} href={href} className="group">
            <Card
              className={`relative h-full overflow-hidden p-6 transition group-hover:border-foreground/30 group-hover:shadow-md`}
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${accent} to-transparent opacity-60`}
              />
              <div className="relative space-y-4">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-foreground/5 backdrop-blur">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="space-y-1">
                  <h2 className="font-medium">{title}</h2>
                  <p className="text-sm text-muted-foreground">{body}</p>
                </div>
                <p className="flex items-center gap-1 text-sm font-medium">
                  Karşılaştır
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
