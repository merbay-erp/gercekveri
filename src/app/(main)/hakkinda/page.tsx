import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenCheck, ExternalLink, ShieldCheck, Radar, Sparkles, Lock, UserRoundCheck } from "lucide-react";

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
                Sorgu ve ihbar herkese ücretsiz. Rehber içeriklerinde gösterilecek reklamlarla
                sürdürülebilir olması planlanır; araç ve form ekranlarında reklam yüklenmez.
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
              yaşı (RDAP), tehdit listesi (Google Cloud Web Risk), internet geçmişi (Wayback), barındırma ve
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

        <section id="yayin-ilkeleri" className="scroll-mt-24 space-y-5">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Yayın ilkeleri ve içerik sorumluluğu</h2>
            <p className="mt-2 text-muted-foreground leading-relaxed">
              GerçekVeri&apos;deki rehberler arama trafiği üretmek için otomatik çoğaltılmaz. Her içerik
              belirli bir kullanıcı sorusunu çözmek üzere özgün hazırlanır; resmi veya birincil kaynaklara
              bağlantı verir, son inceleme tarihini gösterir ve aracın yapamayacağı şeyleri açıkça belirtir.
              Maddi veya hukuki karar gerektiren konularda kesin sonuç, garanti ya da kişiye özel hukuk
              danışmanlığı verilmez.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <UserRoundCheck className="h-5 w-5 text-info" aria-hidden />
              <h3 className="mt-3 font-medium">Yazar ve sorumlu</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Platform ve yayın içeriği, sistem mimarisi ve altyapı alanında çalışan Mustafa Erbay
                tarafından hazırlanır. Teknik iddialar kaynak belgeler ve çalışan uygulama koduyla
                karşılaştırılır.
              </p>
              <a
                href={siteConfig.links.blog}
                target="_blank"
                rel="noopener noreferrer author"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
              >
                Yazar profili <ExternalLink className="size-3.5" aria-hidden />
              </a>
            </Card>
            <Card className="p-5">
              <BookOpenCheck className="h-5 w-5 text-info" aria-hidden />
              <h3 className="mt-3 font-medium">Düzeltme ve güncelleme</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                Kaynak değiştiğinde veya yeni bir dolandırıcılık yöntemi ortaya çıktığında içerik yeniden
                incelenir. Doğrulanabilir bir hata için iletişim kanalından bildirim yapılabilir; gerekli
                düzeltme içerik ve tarih bilgisine yansıtılır.
              </p>
              <Link href="/iletisim" className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline">
                Düzeltme bildir
              </Link>
            </Card>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Başlıca teknik ve resmi kaynaklar</h2>
          <p className="text-muted-foreground leading-relaxed">
            Alan adı kayıt zamanı için ICANN&apos;ın RDAP standardı; ticari zararlı URL kontrolü için
            Google Cloud Web Risk; Türkiye&apos;de yayımlanan zararlı bağlantılar ve ihbar yönlendirmesi
            için T.C. Siber Güvenlik Başkanlığı kaynakları esas alınır. Dış kaynak yanıt vermediğinde
            sistem bunu güvenli sonuç saymaz, kartta bilinmiyor veya atlandı olarak gösterir.
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            <a href="https://www.icann.org/rdap/" target="_blank" rel="noopener noreferrer" className="rounded-md border px-3 py-1.5 hover:bg-muted">ICANN RDAP</a>
            <a href="https://docs.cloud.google.com/web-risk/docs/lookup-api" target="_blank" rel="noopener noreferrer" className="rounded-md border px-3 py-1.5 hover:bg-muted">Google Web Risk</a>
            <a href="https://siberguvenlik.gov.tr/zararli-baglantilar" target="_blank" rel="noopener noreferrer" className="rounded-md border px-3 py-1.5 hover:bg-muted">SGB Zararlı Bağlantılar</a>
          </div>
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
