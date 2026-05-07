import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Database, Sparkles, Lock } from "lucide-react";

import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Hakkında",
  description:
    "GerçekVeri, Türkiye'de anonim olarak paylaşılan gerçek hayat verisinin tek noktada toplandığı, ücretsiz ve şeffaf bir platform.",
  alternates: { canonical: "/hakkinda" },
};

export default function HakkindaPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <div className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Hakkında
        </h1>
        <p className="text-lg text-muted-foreground">
          {siteConfig.name}, Türkiye'nin gerçek hayat verisini anonim olarak toplayan,
          analiz eden ve herkese ücretsiz açan bir platform.
        </p>
      </div>

      <div className="mt-12 space-y-12">
        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Neden var?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Türkiye'de maaş, kira, fatura, internet hızı gibi gerçek hayat verilerine
            ulaşmak çok zor. Resmi rakamlar geç açıklanır, kurumsal araştırmalar
            taraflıdır, sosyal medyada ise rastgele iddialarla karşılaşırsınız.
            {" "}
            <strong className="text-foreground">{siteConfig.name}</strong> bu boşluğu
            doldurmak için doğdu: tek bir kullanıcının paylaştığı veri
            {" "}
            <em>aynı anda</em> başkasının kararına yardımcı olur.
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
                Hesap yok, e-posta yok, kimlik bilgisi yok. IP'n bile tek yönlü
                hashlenir — geri çevrilemez.
              </p>
            </Card>
            <Card className="space-y-2 p-5">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-sky-500/10 text-sky-500">
                <Database className="h-5 w-5" />
              </span>
              <h3 className="font-medium">Şeffaf</h3>
              <p className="text-sm text-muted-foreground">
                Tüm veri kullanıcı katkısı. Kaynağı, sayısı, dağılımı görünür. Açık
                kaynak — kod
                {" "}
                <Link
                  href={siteConfig.links.github}
                  className="underline-offset-2 hover:underline"
                >
                  GitHub'da
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
                Her kullanıcı için sonsuza kadar ücretsiz. Sadece reklamla
                desteklenir, yanıltıcı tasarım yok.
              </p>
            </Card>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Nasıl çalışır?</h2>
          <ol className="ml-6 list-decimal space-y-2 text-muted-foreground">
            <li>
              Verini paylaşırsın — örneğin pozisyonun, deneyimin ve net maaşın.
              30 saniye sürer.
            </li>
            <li>
              Veri otomatik olarak agrega edilir; medyan, ortalama ve aralık
              hesaplanır.
            </li>
            <li>
              Şehir, pozisyon ve sektör bazında SEO sayfaları oluşur —
              Google'dan gelen biri kıyas yapabilir.
            </li>
            <li>
              Yapay zeka, öne çıkan trendleri özetler ve değişimleri yazar
              (yakında).
            </li>
          </ol>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">Veri güvenliği</h2>
          <p className="text-muted-foreground leading-relaxed">
            Hiçbir kişisel veri saklanmıyor. IP ve tarayıcı bilgileri yalnızca
            kötüye kullanım önlemi olarak tek yönlü hash'leniyor (SHA-256, gizli
            anahtarlı). KVKK ve GDPR uyumlu mimari hedefliyoruz; veri talep
            etmek veya silmek için
            {" "}
            <Link href="/iletisim" className="underline-offset-2 hover:underline">
              iletişim
            </Link>{" "}
            sayfasını kullanabilirsin.
          </p>
        </section>

        <section className="rounded-xl border bg-muted/30 p-6">
          <div className="flex items-start gap-3">
            <Lock className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="space-y-3">
              <p className="text-sm">
                Tek başına bir paylaşım = istatistiksel olarak işe yaramaz.
                <br />
                10.000 paylaşım = Türkiye'nin gerçek hayat verisi.
              </p>
              <Link href="/maaslar/yeni" className={buttonVariants()}>
                Şimdi sen de katıl
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
