import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, CircleAlert, SearchCheck, ShieldCheck } from "lucide-react";

import { GuideCard } from "@/components/content/guide-card";
import { SchemaOrg } from "@/components/schema-org";
import { guides } from "@/content/guides";
import { breadcrumbSchema, itemListSchema, jsonLdGraph } from "@/lib/schema-org";

export const metadata: Metadata = {
  title: "Dolandırıcılıktan Korunma Rehberi",
  description:
    "Sahte site, IBAN, telefon, SMS, ilan ve kapora dolandırıcılığını fark etmek; mağduriyet sonrası doğru adımları atmak için kaynaklı ve uygulamalı rehberler.",
  alternates: { canonical: "/rehber" },
  openGraph: {
    title: "Dolandırıcılıktan Korunma Rehberi · GerçekVeri",
    description:
      "Ödeme öncesi kontroller, acil müdahale adımları ve GerçekVeri'nin açık risk metodolojisi.",
    url: "/rehber",
    type: "website",
  },
};

const PRINCIPLES = [
  {
    icon: SearchCheck,
    title: "Tek işarete değil, örüntüye bak",
    text: "HTTPS, eski alan adı veya geçerli IBAN tek başına güven kanıtı değildir. Birbirinden bağımsız sinyalleri birlikte değerlendir.",
  },
  {
    icon: ShieldCheck,
    title: "Mesajın dışından doğrula",
    text: "Arayanın verdiği numarayı ve bağlantıyı kullanma. Kurumun resmi uygulamasına veya daha önce bildiğin kanala kendin git.",
  },
  {
    icon: CircleAlert,
    title: "Acele baskısında işlemi durdur",
    text: "Gerçek bir kurum kısa bir güvenlik kontrolüne izin verir. Korku, fırsat ve gizlilik baskısı sosyal mühendisliğin temel aracıdır.",
  },
];

export default function GuideIndexPage() {
  const jsonLd = jsonLdGraph(
    breadcrumbSchema([
      { name: "Ana sayfa", url: "/" },
      { name: "Rehber", url: "/rehber" },
    ]),
    itemListSchema({
      name: "Dolandırıcılıktan Korunma Rehberleri",
      description: "GerçekVeri tarafından hazırlanan kaynaklı dijital güvenlik rehberleri.",
      items: guides.map((guide) => ({ name: guide.title, url: `/rehber/${guide.slug}` })),
    }),
  );

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <SchemaOrg data={jsonLd} />

      <header className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
          <BookOpenCheck className="size-3.5" aria-hidden />
          Kaynaklı · Uygulamalı · Güncel
        </span>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Dolandırıcılıktan korunma rehberi
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Bir risk puanından daha fazlası: neyi, neden kontrol ettiğini ve şüpheli bir durumda hangi
          adımı önce atacağını öğren. Rehberler resmi kaynaklarla desteklenir ve yeni yöntemlere göre
          düzenli gözden geçirilir.
        </p>
      </header>

      <section aria-labelledby="guide-list" className="mt-12">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Bilgi merkezi</p>
            <h2 id="guide-list" className="mt-1 text-2xl font-semibold tracking-tight">
              Ödeme öncesinden acil müdahaleye
            </h2>
          </div>
          <span className="hidden text-sm text-muted-foreground sm:inline">{guides.length} kapsamlı rehber</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <GuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-border bg-muted/20 p-6 sm:p-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Ortak savunma modeli</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Her senaryoda çalışan üç alışkanlık</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Dolandırıcılık türleri değişse de saldırı akışı çoğunlukla aynı kalır: güven kazan, düşünme
            süresini azalt ve geri döndürülmesi zor bir işlem yaptır. Aşağıdaki alışkanlıklar bu akışı
            ödeme veya veri paylaşımı aşamasında keser.
          </p>
        </div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {PRINCIPLES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-xl border border-border/70 bg-background p-5">
              <Icon className="size-5 text-info" aria-hidden />
              <h3 className="mt-3 font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl bg-foreground p-6 text-background sm:flex-row sm:items-center sm:p-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-65">Şu anda şüpheli bir adres mi var?</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Önce sorgula, sonra bağımsız doğrula.</h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed opacity-75">
            GerçekVeri teknik sinyalleri ve topluluk ihbarlarını tek kartta gösterir. Sonuç kesin hüküm
            değildir; özellikle para ve kimlik içeren işlemlerde resmi kanalı ayrıca kontrol et.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:opacity-90"
        >
          Ücretsiz sorgula
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </section>
    </div>
  );
}
