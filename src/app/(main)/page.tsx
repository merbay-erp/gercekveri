import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  Check,
  ExternalLink,
  Globe,
  Keyboard,
  Lock,
  Phone,
  Radar,
  Search,
  ShieldCheck,
  Tag,
  Users,
} from "lucide-react";

import { GuideCard } from "@/components/content/guide-card";
import { LookupHero } from "@/components/risk/lookup-hero";
import { RecentFraudFeed } from "@/components/risk/recent-fraud-feed";
import { featuredGuides } from "@/content/guides";
import { getFraudStats, listRecentFraud } from "@/modules/lookup/server/queries";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dolandırıcılık sorgulama ve korunma rehberi",
  description:
    "Web sitesi, IBAN, telefon veya ilanı teknik sinyaller ve topluluk kayıtlarıyla sorgula; kaynaklı rehberlerle ödeme öncesi doğru kontrolleri öğren.",
  alternates: { canonical: "/" },
};

const STEPS = [
  { icon: Keyboard, title: "1 · Adresi gir", text: "Site, IBAN, numara veya ilan bağlantısını yapıştır." },
  { icon: Radar, title: "2 · Sinyalleri gör", text: "Teknik kontrolleri ve topluluk kayıtlarını ayrı ayrı incele." },
  { icon: ShieldCheck, title: "3 · Bağımsız doğrula", text: "Sonucu rehber olarak kullan; resmi kanalı ayrıca kontrol et." },
];

const VERTICALS = [
  { label: "Web sitesi", desc: "Alan adı yaşı, Web Risk, internet geçmişi ve e-posta altyapısı.", icon: Globe },
  { label: "IBAN", desc: "Mod-97 biçim kontrolü, banka bilgisi ve topluluk ihbarları.", icon: Building2 },
  { label: "Telefon", desc: "Hat türü bağlamı ve bildirilen arama/SMS senaryoları.", icon: Phone },
  { label: "İlan", desc: "Pazaryeri tanıma, bağlantı analizi ve satıcı riski uyarısı.", icon: Tag },
];

const SOURCES = [
  {
    label: "Alan adı kayıt verisi",
    source: "ICANN RDAP",
    href: "https://www.icann.org/rdap/",
  },
  {
    label: "Zararlı URL kontrolü",
    source: "Google Cloud Web Risk",
    href: "https://docs.cloud.google.com/web-risk/docs/lookup-api",
  },
  {
    label: "Resmi zararlı bağlantılar",
    source: "T.C. Siber Güvenlik Başkanlığı",
    href: "https://siberguvenlik.gov.tr/zararli-baglantilar",
  },
];

export default async function HomePage() {
  const [stats, recent] = await Promise.all([getFraudStats(), listRecentFraud({ limit: 5 })]);

  return (
    <div>
      <section id="sorgula" className="relative overflow-hidden border-b border-border/60">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.09),transparent_68%)]"
          aria-hidden
        />
        <div className="container relative mx-auto max-w-5xl px-4 pb-14 pt-14 text-center sm:pt-20">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
            <Search className="size-3.5 text-info" aria-hidden />
            Ücretsiz risk sorgusu + kaynaklı güvenlik rehberleri
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Ödeme yapmadan önce <span className="text-info">sinyalleri gör.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Web sitesi, IBAN, telefon veya ilanı teknik veriler ve topluluk bildirimleriyle kontrol et.
            Sonucu oluşturan her işareti açıkça gör, sonra bağımsız doğrulama yap.
          </p>

          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-border bg-card p-4 shadow-xl shadow-foreground/[0.04] sm:p-6">
            <LookupHero autoFocus />
            <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
              <Lock className="size-3.5" aria-hidden />
              Hesap gerekmez · Sorgu sonucu kesin hüküm veya güvenlik garantisi değildir
            </p>
          </div>

          <div className="mx-auto mt-7 flex max-w-2xl flex-wrap items-center justify-center gap-x-7 gap-y-2 text-xs text-muted-foreground">
            <span><b className="font-semibold text-foreground">{stats.entities.toLocaleString("tr-TR")}</b> incelenen adres</span>
            <span><b className="font-semibold text-danger">{stats.flagged.toLocaleString("tr-TR")}</b> riskli kayıt</span>
            <span><b className="font-semibold text-foreground">{stats.reports.toLocaleString("tr-TR")}</b> topluluk bildirimi</span>
          </div>
        </div>
      </section>

      <div className="container mx-auto max-w-6xl px-4">
        <section className="py-12" aria-labelledby="how-it-works">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Karar destek akışı</p>
            <h2 id="how-it-works" className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Üç adımda daha bilinçli kontrol</h2>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="rounded-xl border border-border bg-card p-5">
                  <span className="grid size-9 place-items-center rounded-lg bg-info/10 text-info">
                    <Icon className="size-4.5" aria-hidden />
                  </span>
                  <h3 className="mt-3 font-semibold">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-y border-border py-12" aria-labelledby="lookup-types">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Çoklu sorgu motoru</p>
              <h2 id="lookup-types" className="mt-2 text-3xl font-semibold tracking-tight">Dört farklı risk yüzeyi, tek açıklanabilir kart</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Her veri türü aynı şeyi ölçmez. IBAN biçiminin geçerli olması hesabı güvenli yapmaz;
                bilinen bir pazaryeri de satıcıyı garanti etmez. Bu nedenle her sorgu türü kendi
                sınırlarıyla birlikte sunulur.
              </p>
              <Link href="/rehber/risk-skoru-nasil-hesaplaniyor" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold">
                Açık metodolojiyi incele
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {VERTICALS.map((vertical) => {
                const Icon = vertical.icon;
                return (
                  <div key={vertical.label} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-muted text-foreground">
                      <Icon className="size-4.5" aria-hidden />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{vertical.label}</h3>
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">
                          <Check className="size-2.5" aria-hidden /> aktif
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{vertical.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {recent.length > 0 ? (
          <section className="py-12" aria-labelledby="recent-reports">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  <Users className="size-3.5" aria-hidden /> Topluluk sinyali
                </p>
                <h2 id="recent-reports" className="mt-1.5 text-2xl font-semibold tracking-tight">Son bildirilen adresler</h2>
              </div>
              <Link href="/son-dolandiriciliklar" className="text-sm font-medium text-muted-foreground hover:text-foreground">Tümünü gör</Link>
            </div>
            <RecentFraudFeed items={recent} />
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Kullanıcı bildirimi resmi suç tespiti değildir. Her kaydın teknik sinyallerini ve bildirim yoğunluğunu ayrıca incele.
            </p>
          </section>
        ) : null}

        <section className={cn("py-12", recent.length > 0 && "border-t border-border")} aria-labelledby="featured-guides">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                <BookOpenCheck className="size-3.5" aria-hidden /> Bilgi merkezi
              </p>
              <h2 id="featured-guides" className="mt-1.5 text-3xl font-semibold tracking-tight">Sorgudan sonra neye bakacağını bil</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Resmi kaynaklarla desteklenen, özgün ve uygulanabilir rehberler. Ödeme öncesi kontrol,
                mağduriyet sonrası ilk adımlar ve puanlama sisteminin tüm sınırları açıkça anlatılır.
              </p>
            </div>
            <Link href="/rehber" className="inline-flex items-center gap-1.5 text-sm font-semibold">
              Tüm rehberler
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {featuredGuides.map((guide) => <GuideCard key={guide.slug} guide={guide} compact />)}
          </div>
        </section>

        <section className="mb-4 rounded-2xl border border-border bg-muted/20 p-6 sm:p-8" aria-labelledby="transparent-sources">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Şeffaflık</p>
              <h2 id="transparent-sources" className="mt-2 text-2xl font-semibold tracking-tight">Kaynak adı kartın arkasında saklanmaz</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Teknik değerlendirme, erişilebilen bağımsız veri kaynaklarından gelir. Bir kaynak yanıt
                vermediğinde bunu “temiz” saymayız; kartta atlandı veya bilinmiyor olarak gösteririz.
              </p>
              <div className="mt-5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-success" /> Açıklanabilir puan</span>
                <span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-success" /> 24 saatlik tarama yenileme</span>
                <span className="inline-flex items-center gap-1.5"><Check className="size-3.5 text-success" /> İtiraz ve düzeltme kanalı</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {SOURCES.map((source) => (
                <a key={source.href} href={source.href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 rounded-xl border border-border bg-background px-4 py-3 transition hover:border-foreground/20">
                  <div>
                    <p className="text-xs text-muted-foreground">{source.label}</p>
                    <p className="mt-0.5 text-sm font-semibold">{source.source}</p>
                  </div>
                  <ExternalLink className="size-4 text-muted-foreground group-hover:text-foreground" aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
