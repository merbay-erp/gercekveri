import type { Metadata } from "next";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Sıkça Sorulan Sorular — ${siteConfig.name}`,
  description: `${siteConfig.name} hakkında en sık sorulan sorular: anonimlik, veri doğruluğu, AI özetler, AdSense, paylaşım rehberi.`,
  alternates: { canonical: "/sss" },
};

interface QA {
  q: string;
  a: React.ReactNode;
}

const QAS: QA[] = [
  {
    q: "Bu site nasıl para kazanıyor? Verimi satıyor musunuz?",
    a: (
      <>
        Hayır, hiçbir kişisel veri toplamıyoruz, dolayısıyla satılacak veri de
        yok. Site yalnızca <strong>Google AdSense</strong> reklamlarıyla
        finanse ediliyor. Anonim agregat istatistikleri (medyan, ortalama)
        herkesin kullanımına açık şekilde gösteriyoruz; bu veri herkes için
        ücretsiz.
      </>
    ),
  },
  {
    q: "Paylaştığım veri gerçekten anonim mi?",
    a: (
      <>
        Evet. Hesap, e-posta, telefon, isim talep edilmez. Spam korumak için
        IP ve tarayıcı User-Agent değerleri tek yönlü <code>SHA-256</code>{" "}
        hash'lenir; orijinal değerler asla saklanmaz. Detay için{" "}
        <Link href="/gizlilik" className="font-medium underline-offset-2 hover:underline">
          /gizlilik
        </Link>{" "}
        ve{" "}
        <Link href="/kvkk" className="font-medium underline-offset-2 hover:underline">
          /kvkk
        </Link>
        .
      </>
    ),
  },
  {
    q: "Yanlışlıkla paylaştım, nasıl silebilirim?",
    a: (
      <>
        Sayfa sahibi anonim olduğu için "kendi paylaşımım" eşleştirmesi
        yapamayız, ama paylaşımın detay URL'sindeki <code>publicId</code>{" "}
        değerini bize iletirsen kaldırırız. {" "}
        <Link href="/iletisim" className="font-medium underline-offset-2 hover:underline">
          /iletisim
        </Link>{" "}
        sayfasından e-posta at.
      </>
    ),
  },
  {
    q: "Veriler ne kadar güvenilir?",
    a: (
      <>
        Her sayfanın üstünde <strong>Güven Skoru</strong> badge'i var (örn.
        "Güven 65/100"). Skor; veri yoğunluğu, en yeni paylaşımın yaşı, kaynak
        çeşitliliği ve aykırı veri oranından hesaplanır. Az veri varsa
        "yetersiz veri" mesajı gösteriyoruz, yanıltıcı sayı koymuyoruz.
      </>
    ),
  },
  {
    q: "AI özetleri kim üretiyor? Hatalı çıkıyor mu?",
    a: (
      <>
        Google Gemini 2.5 Flash Lite. Yalnızca agregat istatistikler (medyan,
        çeyreklikler) prompt'a gönderilir, asla bireysel paylaşımlar.
        Çıktıyı her sayfada altta etiketliyoruz: "AI tarafından üretildi —
        finansal tavsiye değildir." Hata gördüğünüzde admin panelimizden
        manuel düzelttirebiliyoruz.
      </>
    ),
  },
  {
    q: '"İlan vs Gerçek" şişkinlik nasıl hesaplanıyor?',
    a: (
      <>
        Kira paylaşırken, kullanıcı opsiyonel olarak{" "}
        <strong>ilan fiyatı</strong>nı (sahibinden, hepsiemlak vs.) ve{" "}
        <strong>gerçek ödediğini</strong> ayrı yazıyor. Aynı bölgedeki en az 3
        eşleşmiş paylaşımdan medyanlar çıkarılıyor: şişkinlik = (ilan medyanı
        − gerçek medyanı) / gerçek medyanı.{" "}
        <Link href="/kira/sisme" className="font-medium underline-offset-2 hover:underline">
          /kira/sisme
        </Link>{" "}
        sayfasında detaylı görebilirsin.
      </>
    ),
  },
  {
    q: '"Gerçeklik Skoru" nedir?',
    a: (
      <>
        İlan-gerçek farkını 0-100'e çeviren tek bir sayı. %0 sapma → 100/100,
        %25 sapma → 72/100, %50 sapma → 50/100. Bir bölgenin "ilanlarına ne
        kadar güvenebilirsin" sorusunun anlık cevabı.
      </>
    ),
  },
  {
    q: "Site mobile'de zor kullanılıyor, ne yapmalıyım?",
    a: (
      <>
        Üst sağdaki <strong>menü ikonuna</strong> dokunarak nav linklerine
        ulaşabilirsin. Tablolar dar ekrandan kaydırılabilir.
        <br />
        Hâlâ takıldığın bir yer varsa{" "}
        <Link href="/iletisim" className="font-medium underline-offset-2 hover:underline">
          /iletisim
        </Link>
        'den hata bildir.
      </>
    ),
  },
  {
    q: "Yeni bir kategori istiyorum (örn. 'akaryakıt fiyatı'). Ne yapmalıyım?",
    a: (
      <>
        Şu an 6 kategori canlı: maaş, kira, aidat, fatura, internet, tekstil
        B2B. Yeni kategori önerisi için{" "}
        <Link href="/iletisim" className="font-medium underline-offset-2 hover:underline">
          /iletisim
        </Link>
        'den DM at — ürün vizyonuna uygunsa eklenir.
      </>
    ),
  },
  {
    q: "Sitenin kaynak kodu açık mı?",
    a: (
      <>
        Şu an private bir GitHub repo'da. İleride API + bazı yardımcı
        kütüphaneleri açık kaynak yayınlamak planda. Erken erişim isteyenler
        için bekleme listesi açacağız.
      </>
    ),
  },
];

export default function SssPage() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 max-w-2xl space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Sıkça Sorulan Sorular
        </h1>
        <p className="text-muted-foreground">
          {siteConfig.name} hakkında en sık sorulanlar. Cevabını bulamadığın
          bir soru varsa{" "}
          <Link
            href="/iletisim"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            /iletisim
          </Link>
          .
        </p>
      </div>

      <div className="space-y-3">
        {QAS.map((qa, idx) => (
          <Card key={idx} className="p-5 sm:p-6">
            <h2 className="text-base font-semibold leading-snug sm:text-lg">
              {qa.q}
            </h2>
            <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {qa.a}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
