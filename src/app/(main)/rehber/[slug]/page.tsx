import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  ExternalLink,
  Info,
  ListChecks,
  ShieldAlert,
} from "lucide-react";

import { GuideCard, guideIconMap } from "@/components/content/guide-card";
import { SchemaOrg } from "@/components/schema-org";
import { guideBySlug, guides } from "@/content/guides";
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  jsonLdGraph,
} from "@/lib/schema-org";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideBySlug.get(slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/rehber/${guide.slug}` },
    authors: [{ name: "Mustafa Erbay", url: "https://mustafaerbay.com.tr/" }],
    openGraph: {
      type: "article",
      title: guide.title,
      description: guide.description,
      url: `/rehber/${guide.slug}`,
      publishedTime: guide.publishedAt,
      modifiedTime: guide.reviewedAt,
      authors: ["https://mustafaerbay.com.tr/"],
      section: guide.category,
    },
  };
}

export default async function GuidePage({ params }: { params: Params }) {
  const { slug } = await params;
  const guide = guideBySlug.get(slug);
  if (!guide) notFound();

  const Icon = guideIconMap[guide.icon];
  const relatedGuides = guide.related
    .map((relatedSlug) => guideBySlug.get(relatedSlug))
    .filter((item) => item !== undefined);
  const jsonLd = jsonLdGraph(
    articleSchema({
      headline: guide.title,
      description: guide.description,
      path: `/rehber/${guide.slug}`,
      datePublished: guide.publishedAt,
      dateModified: guide.reviewedAt,
      section: guide.category,
    }),
    breadcrumbSchema([
      { name: "Ana sayfa", url: "/" },
      { name: "Rehber", url: "/rehber" },
      { name: guide.shortTitle, url: `/rehber/${guide.slug}` },
    ]),
    faqSchema(guide.faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))),
  );

  return (
    <article className="container mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <SchemaOrg data={jsonLd} />

      <Link href="/rehber" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden />
        Tüm rehberler
      </Link>

      <header className="mt-7 max-w-4xl">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <span className="grid size-8 place-items-center rounded-lg bg-muted text-foreground">
            <Icon className="size-4" aria-hidden />
          </span>
          {guide.category}
        </div>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{guide.title}</h1>
        <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">{guide.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-border py-3 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">Mustafa Erbay</span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="size-3.5" aria-hidden />
            Son inceleme: 14 Temmuz 2026
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-3.5" aria-hidden />
            {guide.readingMinutes} dakika okuma
          </span>
          <Link href="/hakkinda#yayin-ilkeleri" className="font-medium text-foreground hover:underline">
            Yayın ilkeleri
          </Link>
        </div>
      </header>

      <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="min-w-0">
          <section aria-labelledby="kisa-cevap" className="rounded-xl border border-info/20 bg-info/[0.04] p-5 sm:p-6">
            <div className="flex items-center gap-2 text-info">
              <Info className="size-5" aria-hidden />
              <h2 id="kisa-cevap" className="font-semibold text-foreground">Kısa cevap</h2>
            </div>
            <p className="mt-3 text-[15px] leading-7 text-foreground/90">{guide.quickAnswer}</p>
          </section>

          <div className="mt-8 space-y-4 text-[16px] leading-7 text-muted-foreground">
            {guide.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <section className="mt-10 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.035] p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <ListChecks className="size-5 text-emerald-600 dark:text-emerald-400" aria-hidden />
              <h2 className="text-xl font-semibold tracking-tight">{guide.checklistTitle}</h2>
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {guide.checklist.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Check className="size-3" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-12 space-y-12">
            {guide.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-2xl font-semibold tracking-tight">{section.title}</h2>
                <div className="mt-4 space-y-4 text-[16px] leading-7 text-muted-foreground">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets ? (
                  <ul className="mt-5 space-y-2.5 rounded-xl border border-border bg-muted/20 p-5">
                    {section.bullets.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85">
                        <Check className="mt-0.5 size-4 shrink-0 text-info" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}
                {section.numbered ? (
                  <ol className="mt-5 space-y-3">
                    {section.numbered.map((item, index) => (
                      <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/85">
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-foreground text-xs font-semibold text-background">
                          {index + 1}
                        </span>
                        <span className="pt-0.5">{item}</span>
                      </li>
                    ))}
                  </ol>
                ) : null}
                {section.note ? (
                  <div className="mt-5 flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/[0.04] p-4 text-sm leading-relaxed">
                    <ShieldAlert className="mt-0.5 size-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
                    <p>{section.note}</p>
                  </div>
                ) : null}
              </section>
            ))}
          </div>

          <section className="mt-14" aria-labelledby="sources">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Şeffaf kaynak kullanımı</p>
            <h2 id="sources" className="mt-1.5 text-2xl font-semibold tracking-tight">Başvurulan resmi kaynaklar</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Bu rehber, aşağıdaki birincil kaynaklar temel alınarak GerçekVeri için özgün biçimde hazırlanmıştır.
              Kaynaklar içeriğin yerine geçmez; iddiaların doğrulanmasını kolaylaştırır.
            </p>
            <div className="mt-5 space-y-3">
              {guide.sources.map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start justify-between gap-4 rounded-xl border border-border p-4 transition hover:border-foreground/20 hover:bg-muted/30"
                >
                  <div>
                    <p className="font-medium">{source.title}</p>
                    <p className="mt-0.5 text-xs font-medium text-muted-foreground">{source.publisher}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{source.note}</p>
                  </div>
                  <ExternalLink className="mt-1 size-4 shrink-0 text-muted-foreground transition group-hover:text-foreground" aria-hidden />
                </a>
              ))}
            </div>
          </section>

          <section className="mt-14" aria-labelledby="faq">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Sık sorulanlar</p>
            <h2 id="faq" className="mt-1.5 text-2xl font-semibold tracking-tight">Bu konu hakkında kısa cevaplar</h2>
            <div className="mt-5 divide-y divide-border rounded-xl border border-border">
              {guide.faqs.map((faq) => (
                <div key={faq.question} className="p-5">
                  <h3 className="font-semibold">{faq.question}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Bu rehberde</p>
            <nav className="mt-3" aria-label="İçindekiler">
              <ul className="space-y-2.5">
                {guide.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`} className="text-sm leading-snug text-muted-foreground transition hover:text-foreground">
                      {section.title}
                    </a>
                  </li>
                ))}
                <li><a href="#sources" className="text-sm text-muted-foreground hover:text-foreground">Resmi kaynaklar</a></li>
                <li><a href="#faq" className="text-sm text-muted-foreground hover:text-foreground">Sık sorulanlar</a></li>
              </ul>
            </nav>
            <div className="mt-5 border-t border-border pt-5">
              <p className="text-xs leading-relaxed text-muted-foreground">Şüpheli adresi teknik sinyaller ve topluluk kayıtlarıyla kontrol et.</p>
              <Link href="/" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold">
                Ücretsiz sorgula
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </aside>
      </div>

      <section className="mt-16 border-t border-border pt-10" aria-labelledby="related-guides">
        <h2 id="related-guides" className="text-2xl font-semibold tracking-tight">İlgili rehberler</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {relatedGuides.map((item) => (
            <GuideCard key={item.slug} guide={item} compact />
          ))}
        </div>
      </section>
    </article>
  );
}
