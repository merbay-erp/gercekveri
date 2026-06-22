import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Radar, Sparkles, Lock } from "lucide-react";

import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Hakkında — Nasıl çalışır",
  description:
    "GerçekVeri, bir web sitesinin, IBAN'ın ya da numaranın gerçek mi sahte mi olduğunu ücretsiz teknik sinyaller ve halk ihbarıyla saniyede gösteren bir dolandırıcılık sorgu platformu.",
  alternates: { canonical: "/hakkinda" },
};

export default function HakkindaPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Hakkında</h1>
        <p className="text-lg text-muted-foreground">
          {siteConfig.name}, ödeme yapmadan önce &quot;bu gerçek mi, sahte mi?&quot; sorusunu saniyede
          yanıtlayan, anonim ve ücretsiz bir dolandırıcılık sorgu platformu.
        </p>
      </div>

      <div className="mt-12 space-y-12">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Neden var?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Türkiye&apos;de sahte e-ticaret siteleri, kargo/banka taklitleri, kapora ve IBAN
            dolandırıcılığı her gün binlerce kişiyi mağdur ediyor. Bir adresin gerçek mi olduğunu
            anlamak için harcanan birkaç saniye, kaybedilecek paranın önüne geçer.{" "}
            <strong className="text-foreground">{siteConfig.name}</strong> bu boşluğu doldurmak için
            doğdu: bir kişinin yaptığı tek ihbar <em>aynı anda</em> başkasını ödeme yapmadan korur.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Üç temel ilke</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="space-y-2 p-5">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h3 className="font-medium">Anonim</h3>
              <p className="text-sm text-muted-foreground">
                Sorgu ve ihbar için hesap yok, e-posta yok, kimlik yok. IP&apos;n bile tek yönlü
                hashlenir — geri çevrilemez.
              </p>
            </Card>
            <Card className="space-y-2 p-5">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-sky-500/10 text-sky-500">
                <Radar className="h-5 w-5" />
              </span>
              <h3 className="font-medium">Şeffaf</h3>
              <p className="text-sm text-muted-foreground">
                Risk skorunun arkasındaki her sinyal (domain yaşı, kara liste, ihbar) açıkça
                gösterilir. Açık kaynak — kod{" "}
                <Link href={siteConfig.links.github} className="underline-offset-2 hover:underline">
                  GitHub&apos;da
                </Link>
                .
              </p>
            </Card>
            <Card className="space-y-2 p-5">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-amber-500/10 text-amber-500">
                <Sparkles className="h-5 w-5" />
              </span>
              <h3 className="font-medium">Ücretsiz</h3>
              <p className="text-sm text-muted-foreground">
                Sorgu da ihbar da herkese sonsuza kadar ücretsiz. Sadece reklamla desteklenir,
                yanıltıcı tasarım yok.
              </p>
            </Card>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Nasıl çalışır?</h2>
          <ol className="ml-6 list-decimal space-y-2 text-muted-foreground">
            <li>Bir web adresi, IBAN, telefon ya da ilan girersin. 5 saniye sürer.</li>
            <li>
              Sistem ücretsiz ve bağımsız kaynaklardan teknik sinyalleri paralel toplar: domain
              yaşı (RDAP), kara liste (Safe Browsing), internet geçmişi (Wayback), barındırma ve
              mail altyapısı.
            </li>
            <li>
              Bu sinyaller, topluluğun yaptığı anonim ihbarlarla birleşip 0–100 arası tek bir risk
              skoruna ve sade bir tavsiyeye dönüşür.
            </li>
            <li>
              Yapay zeka, sonucu panik yapmadan tek paragrafta özetler ve ne yapman gerektiğini
              söyler.
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Veri ve doğruluk</h2>
          <p className="text-muted-foreground leading-relaxed">
            İhbarlar anonimdir; IP ve tarayıcı bilgileri yalnızca kötüye kullanım önlemi olarak tek
            yönlü hash&apos;lenir (SHA-256, gizli anahtarlı). İhbar metnindeki IBAN/telefon gibi
            kişisel veriler otomatik maskelenir. Teknik sinyalle desteklenmeyen tekil ihbarlar
            &quot;doğrulanmadı&quot; olarak işaretlenir. Bir adres yanlışlıkla işaretlendiyse{" "}
            <Link href="/iletisim" className="underline-offset-2 hover:underline">
              iletişim
            </Link>{" "}
            sayfasından itiraz edebilirsin.
          </p>
        </section>

        <section className="rounded-xl border bg-muted/30 p-6">
          <div className="flex items-start gap-3">
            <Lock className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="space-y-3">
              <p className="text-sm">
                Tek bir ihbar = birini ödeme yapmadan korur.
                <br />
                Binlerce ihbar = Türkiye&apos;nin topluluk destekli dolandırıcılık kalkanı.
              </p>
              <Link href="/ihbar" className={buttonVariants()}>
                Dolandırıcılık ihbar et
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
