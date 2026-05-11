import type { Metadata } from "next";
import Link from "next/link";
import {
  HelpCircle,
  ShieldCheck,
  DollarSign,
  Cpu,
  BarChart3,
  Smartphone,
  GitBranch,
  Lightbulb,
  AlertCircle,
  Mail,
  Settings,
  Trash2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { SchemaOrg } from "@/components/schema-org";
import { faqSchema } from "@/lib/schema-org";
import {
  ContentSection,
  Callout,
} from "@/components/content/article-blocks";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Sıkça Sorulan Sorular — ${siteConfig.name}`,
  description: `${siteConfig.name} hakkında en sık sorulan sorular: anonimlik, veri doğruluğu, AI özetler, AdSense, paylaşım rehberi.`,
  alternates: { canonical: "/sss" },
};

interface QA {
  q: string;
  a: React.ReactNode;
  // Plain-text version for FAQ schema
  aText: string;
  category: "guvenlik" | "para" | "ai" | "veri" | "kullanim" | "diger";
}

const CATEGORY_META = {
  guvenlik: {
    label: "Gizlilik & Güvenlik",
    icon: ShieldCheck,
    accent: "emerald" as const,
  },
  para: {
    label: "Para Modeli & AdSense",
    icon: DollarSign,
    accent: "amber" as const,
  },
  ai: { label: "AI & Otomasyon", icon: Cpu, accent: "purple" as const },
  veri: { label: "Veri Doğruluğu", icon: BarChart3, accent: "blue" as const },
  kullanim: {
    label: "Kullanım & Mobil",
    icon: Smartphone,
    accent: "rose" as const,
  },
  diger: { label: "Diğer", icon: GitBranch, accent: "muted" as const },
};

const QAS: QA[] = [
  {
    category: "para",
    q: "Bu site nasıl para kazanıyor? Verimi satıyor musunuz?",
    aText:
      "Hayır, hiçbir kişisel veri toplamıyoruz, satılacak veri yok. Site yalnızca Google AdSense reklamlarıyla finanse ediliyor. Anonim agregat istatistikleri herkesin kullanımına açık ve ücretsiz.",
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
    category: "guvenlik",
    q: "Paylaştığım veri gerçekten anonim mi?",
    aText:
      "Evet. Hesap, e-posta, telefon, isim talep edilmez. IP ve User-Agent değerleri tek yönlü SHA-256 hash'lenir; orijinal değerler asla saklanmaz.",
    a: (
      <>
        Evet. Hesap, e-posta, telefon, isim talep edilmez. Spam korumak için
        IP ve tarayıcı User-Agent değerleri tek yönlü <code className="rounded bg-muted px-1.5 py-0.5 text-xs">SHA-256</code>{" "}
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
    category: "guvenlik",
    q: "Yanlışlıkla paylaştım, nasıl silebilirim?",
    aText:
      "Paylaşımının publicId'sini iletişim sayfasından bize gönder, 7 iş günü içinde silinir.",
    a: (
      <>
        Sayfa sahibi anonim olduğu için "kendi paylaşımım" eşleştirmesi
        yapamayız, ama paylaşımın detay URL'sindeki <code className="rounded bg-muted px-1.5 py-0.5 text-xs">publicId</code>{" "}
        değerini bize iletirsen kaldırırız.{" "}
        <Link href="/iletisim" className="font-medium underline-offset-2 hover:underline">
          /iletisim
        </Link>{" "}
        sayfasından e-posta at, 7 iş günü içinde işlenir.
      </>
    ),
  },
  {
    category: "veri",
    q: "Veriler ne kadar güvenilir?",
    aText:
      "Her sayfanın üstünde Güven Skoru badge'i var. Veri yoğunluğu, paylaşım yaşı, çeşitlilik ve outlier oranından hesaplanır. Az veri varsa 'yetersiz veri' yazılır.",
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
    category: "ai",
    q: "AI özetleri kim üretiyor? Hatalı çıkıyor mu?",
    aText:
      "Google Gemini 2.5 Flash Lite kullanılır. Sadece agregat istatistikler prompt'a gönderilir, bireysel paylaşım değil. Çıktıların altında 'AI üretti' uyarısı var.",
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
    category: "veri",
    q: '"İlan vs Gerçek" şişkinlik nasıl hesaplanıyor?',
    aText:
      "Kullanıcı paylaşırken ilan fiyatını ve gerçek ödediğini ayrı yazıyor. En az 3 eşleşmiş paylaşımdan medyanlar çıkarılıyor: şişkinlik = (ilan − gerçek) / gerçek.",
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
    category: "veri",
    q: '"Gerçeklik Skoru" nedir?',
    aText:
      "İlan-gerçek farkını 0-100'e çeviren tek sayı. %0 sapma = 100/100, %50 sapma = 50/100. Bölgenin ilanlarına güvenilirlik göstergesi.",
    a: (
      <>
        İlan-gerçek farkını 0-100'e çeviren tek bir sayı. %0 sapma → 100/100,
        %25 sapma → 72/100, %50 sapma → 50/100. Bir bölgenin "ilanlarına ne
        kadar güvenebilirsin" sorusunun anlık cevabı.
      </>
    ),
  },
  {
    category: "kullanim",
    q: "Site mobilde zor kullanılıyor, ne yapmalıyım?",
    aText:
      "Üst sağdaki menü ikonuna dokun, nav linklerine ulaş. Tablolar yatayda kaydırılabilir. Hata varsa iletişim sayfasından bildir.",
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
    category: "diger",
    q: "Yeni bir kategori istiyorum (örn. 'akaryakıt fiyatı'). Ne yapmalıyım?",
    aText:
      "Şu an 6 kategori canlı: maaş, kira, aidat, fatura, internet, tekstil. Yeni kategori önerisi için iletişim sayfasından yaz.",
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
    category: "diger",
    q: "Sitenin kaynak kodu açık mı?",
    aText:
      "Şu an private GitHub repo'da. İleride API ve yardımcı kütüphaneler açık kaynak yayınlanacak.",
    a: (
      <>
        Şu an private bir GitHub repo'da. İleride API + bazı yardımcı
        kütüphaneleri açık kaynak yayınlamak planda. Erken erişim isteyenler
        için bekleme listesi açacağız.
      </>
    ),
  },
];

// Group QAs by category
const QAS_BY_CATEGORY = QAS.reduce<Record<QA["category"], QA[]>>(
  (acc, qa) => {
    if (!acc[qa.category]) acc[qa.category] = [];
    acc[qa.category].push(qa);
    return acc;
  },
  {} as Record<QA["category"], QA[]>,
);

export default function SssPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* FAQ Schema for Google rich snippet */}
      <SchemaOrg
        data={faqSchema(
          QAS.map((qa) => ({ question: qa.q, answer: qa.aText })),
        )}
      />

      <header className="mb-8 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Yardım · {QAS.length} soru
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Sıkça Sorulan Sorular
        </h1>
        <p className="mt-3 text-muted-foreground">
          {siteConfig.name} hakkında en sık sorulanlar. Cevabını bulamadığın
          bir soru varsa{" "}
          <Link
            href="/iletisim"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            iletişim
          </Link>{" "}
          sayfasından yaz.
        </p>
      </header>

      <Callout type="info" title="Kategori menüsü">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(CATEGORY_META) as QA["category"][])
            .filter((c) => QAS_BY_CATEGORY[c]?.length > 0)
            .map((c) => {
              const m = CATEGORY_META[c];
              const Icon = m.icon;
              return (
                <a
                  key={c}
                  href={`#${c}`}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2.5 py-1 text-xs font-medium transition hover:bg-muted"
                >
                  <Icon className="h-3 w-3" />
                  {m.label}
                  <span className="text-muted-foreground">
                    ({QAS_BY_CATEGORY[c].length})
                  </span>
                </a>
              );
            })}
        </div>
      </Callout>

      <div className="mt-10 space-y-10">
        {(Object.keys(CATEGORY_META) as QA["category"][])
          .filter((c) => QAS_BY_CATEGORY[c]?.length > 0)
          .map((category) => {
            const meta = CATEGORY_META[category];
            const items = QAS_BY_CATEGORY[category];
            return (
              <ContentSection
                key={category}
                icon={meta.icon}
                title={meta.label}
                accent={meta.accent}
                id={category}
              >
                <div className="space-y-3">
                  {items.map((qa, idx) => (
                    <Card
                      key={`${category}-${idx}`}
                      className="p-5 transition hover:border-foreground/20"
                    >
                      <div className="flex items-start gap-3">
                        <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
                        <div className="flex-1">
                          <h3 className="text-base font-semibold leading-snug sm:text-lg">
                            {qa.q}
                          </h3>
                          <div className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {qa.a}
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </ContentSection>
            );
          })}
      </div>

      <Callout type="tip" title="Cevap bulamadın mı?" >
        <p className="text-sm">
          <Link
            href="/iletisim"
            className="font-medium text-foreground underline-offset-2 hover:underline"
          >
            İletişim
          </Link>{" "}
          sayfasından e-posta atabilirsin — yanıt 1-3 iş günü içinde gelir.
        </p>
      </Callout>
    </div>
  );
}
