import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Globe, Keyboard, Lock, Phone, Radar, Search, ShieldCheck, Tag } from "lucide-react";
import { getFraudStats, listRecentFraud } from "@/modules/lookup/server/queries";
import { LookupHero } from "@/components/risk/lookup-hero";
import { RecentFraudFeed } from "@/components/risk/recent-fraud-feed";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "GerçekVeri — Bu site gerçek mi, sahte mi? Dolandırıcılık sorgu",
  description:
    "Ödeme yapmadan önce sor. Web sitesi, IBAN, telefon ya da ilanın gerçek mi sahte mi olduğunu domain yaşı, kara liste ve halk ihbarıyla saniyede öğren.",
  alternates: { canonical: "/" },
};

const STEPS = [
  { icon: Keyboard, title: "1 · Gir", text: "Site, IBAN, numara ya da ilanı yapıştır." },
  { icon: Radar, title: "2 · Tara", text: "Domain yaşı, kara liste, halk ihbarı saniyede." },
  { icon: ShieldCheck, title: "3 · Karar ver", text: "Tek risk kartı ve sade tavsiye." },
];

const VERTICALS = [
  { label: "Web sitesi", desc: "Sahte e-ticaret, kargo/banka taklidi, phishing.", icon: Globe, live: true },
  { label: "IBAN", desc: "Kapora ve havale dolandırıcılığı.", icon: Building2, live: true },
  { label: "Telefon", desc: "Sahte banka araması, vishing.", icon: Phone, live: true },
  { label: "İlan", desc: "Pazaryeri / sahibinden sahte ilanlar.", icon: Tag, live: true },
];

export default async function HomePage() {
  const [stats, recent] = await Promise.all([getFraudStats(), listRecentFraud({ limit: 5 })]);

  return (
    <div className="container mx-auto max-w-3xl px-4">
      <section className="pt-14 pb-10 text-center">
        <span className="inline-flex items-center gap-1.5 text-xs text-info">
          <Search className="size-3.5" aria-hidden />
          Türkiye&apos;nin dolandırıcılık sorgu platformu
        </span>
        <h1 className="mx-auto mt-3 max-w-xl text-4xl font-medium tracking-tight">Ödeme yapmadan önce sor.</h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground">
          Web sitesi, IBAN, telefon ya da ilan — gerçek mi, sahte mi, saniyede öğren.
        </p>

        <div className="mt-7">
          <LookupHero autoFocus />
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-1 text-xs text-muted-foreground">
          <span>
            <b className="font-medium text-danger">{stats.flagged.toLocaleString("tr-TR")}</b> riskli adres
          </span>
          <span>
            <b className="font-medium text-foreground">{stats.reports.toLocaleString("tr-TR")}</b> halk ihbarı
          </span>
          <span>
            <b className="font-medium text-foreground">%100</b> ücretsiz
          </span>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="pb-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium">Son bildirilen dolandırıcılıklar</h2>
            <Link href="/son-dolandiriciliklar" className="text-xs text-muted-foreground hover:text-foreground">
              tümü
            </Link>
          </div>
          <RecentFraudFeed items={recent} />
        </section>
      )}

      <section className="grid gap-3 pb-10 sm:grid-cols-3">
        {STEPS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="rounded-lg bg-muted/50 p-4">
              <Icon className="size-5 text-info" aria-hidden />
              <div className="mt-2 text-sm font-medium">{s.title}</div>
              <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{s.text}</div>
            </div>
          );
        })}
      </section>

      <section className="pb-14">
        <h2 className="mb-3 text-sm font-medium">Neyi sorgulayabilirsin</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {VERTICALS.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.label}
                className={cn(
                  "flex items-start gap-3 rounded-lg border p-4",
                  v.live ? "border-border bg-card" : "border-dashed border-border bg-muted/20",
                )}
              >
                <Icon className={cn("mt-0.5 size-5 shrink-0", v.live ? "text-foreground" : "text-muted-foreground")} aria-hidden />
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {v.label}
                    {v.live ? (
                      <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] text-success">aktif</span>
                    ) : (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">yakında</span>
                    )}
                  </div>
                  <div className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{v.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="size-3.5" aria-hidden />
          İhbarlar anonim · teknik sinyaller ücretsiz kaynaklardan · veri kötüye kullanılmaz
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/ihbar"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Dolandırıcılık ihbar et
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}
