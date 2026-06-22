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
    label: "Ücretsiz & Reklam",
    icon: DollarSign,
    accent: "amber" as const,
  },
  ai: { label: "AI & Otomasyon", icon: Cpu, accent: "purple" as const },
  veri: { label: "Sorgu & Doğruluk", icon: BarChart3, accent: "blue" as const },
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
    q: "Sorgu ücretli mi? Site nasıl para kazanıyor?",
    aText:
      "Sorgu da ihbar da tamamen ücretsiz. Hiçbir kişisel veri toplamıyoruz, satılacak veri yok. Site yalnızca Google AdSense reklamlarıyla finanse ediliyor.",
    a: (
      <>
        Hem sorgu hem ihbar herkese <strong>ücretsiz</strong>. Hiçbir kişisel
        veri toplamadığımız için satılacak veri de yok. Site yalnızca{" "}
        <strong>Google AdSense</strong> reklamlarıyla finanse ediliyor; ödeme
        duvarı ya da gizli ücret yok.
      </>
    ),
  },
  {
    category: "guvenlik",
    q: "Sorgu ve ihbarım gerçekten anonim mi?",
    aText:
      "Evet. Hesap, e-posta, telefon, isim talep edilmez. IP ve User-Agent değerleri tek yönlü SHA-256 hash'lenir; orijinal değerler asla saklanmaz.",
    a: (
      <>
        Evet. Hesap, e-posta, telefon, isim talep edilmez. Kötüye kullanımı
        engellemek için IP ve tarayıcı User-Agent değerleri tek yönlü{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">SHA-256</code>{" "}
        hash&apos;lenir; orijinal değerler asla saklanmaz. İhbar metnindeki
        IBAN/telefon gibi veriler de otomatik maskelenir. Detay için{" "}
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
    q: "Bir adres hakkında yanlış sonuç var / yanlışlıkla ihbar ettim. Nasıl düzeltilir?",
    aText:
      "Risk kartındaki 'Yanlışsa itiraz et' bağlantısından ya da iletişim sayfasından adresi bize bildir. Teknik sinyallerle desteklenmeyen tekil ihbarlar zaten 'doğrulanmadı' gösterilir; itirazlar 7 iş günü içinde incelenir.",
    a: (
      <>
        Risk kartındaki <strong>&quot;Yanlışsa itiraz et&quot;</strong>{" "}
        bağlantısını ya da{" "}
        <Link href="/iletisim" className="font-medium underline-offset-2 hover:underline">
          /iletisim
        </Link>{" "}
        sayfasını kullan. Teknik sinyalle desteklenmeyen tekil ihbarlar zaten{" "}
        <em>doğrulanmadı</em> olarak işaretlenir; itirazlar 7 iş günü içinde
        incelenir ve gerekirse kayıt kaldırılır.
      </>
    ),
  },
  {
    category: "veri",
    q: "Risk skoru nasıl hesaplanıyor?",
    aText:
      "Skor 0-100 arası. Domain yaşı (RDAP), kara liste (Google Safe Browsing), internet geçmişi (Wayback), barındırma ülkesi, mail altyapısı (MX/DMARC) gibi ücretsiz teknik sinyaller ve topluluğun yaptığı anonim ihbarlar birleşip tek bir skora dönüşür.",
    a: (
      <>
        Skor 0-100 arası. <strong>Domain yaşı</strong> (RDAP),{" "}
        <strong>kara liste</strong> (Google Safe Browsing),{" "}
        <strong>internet geçmişi</strong> (Wayback), barındırma ülkesi ve mail
        altyapısı (MX/DMARC) gibi ücretsiz teknik sinyaller, topluluğun yaptığı
        anonim <strong>halk ihbarlarıyla</strong> birleşip tek bir risk skoruna
        ve sade bir tavsiyeye dönüşür.
      </>
    ),
  },
  {
    category: "veri",
    q: "Sonuç ne kadar güvenilir? Az veri varsa ne oluyor?",
    aText:
      "Sonuç bir rehberdir, kesin hüküm değil. Yeterli sinyal yoksa skor 'Doğrulanmadı' olarak işaretlenir; yanıltıcı bir sayı uydurmayız. Risk kartında her sinyal açıkça gösterilir.",
    a: (
      <>
        Sonuç bir <strong>rehberdir</strong>, kesin hüküm değil. Yeterli sinyal
        toplanamazsa skor <strong>&quot;Doğrulanmadı&quot;</strong> olarak
        işaretlenir; yanıltıcı bir sayı uydurmayız. Karardaki her sinyali (yeşil/
        sarı/kırmızı) açıkça gösteriyoruz ki neye baktığını sen de görebilesin.
      </>
    ),
  },
  {
    category: "veri",
    q: '"Güvenli görünüyor" dedi ama yine de dolandırıldım?',
    aText:
      "Düşük risk, sıfır risk demek değildir. Dolandırıcılar yeni adresler açar; biz bilinen sinyallere bakarız. Skor düşük olsa bile ödeme adresini ve satıcıyı bağımsız bir kanaldan teyit et.",
    a: (
      <>
        Düşük risk, <strong>sıfır risk demek değildir.</strong> Dolandırıcılar
        sürekli yeni adresler açar; biz bilinen teknik sinyallere ve ihbarlara
        bakarız. Skor düşük olsa bile ödeme adresini ve satıcıyı her zaman
        bağımsız bir kanaldan teyit et.
      </>
    ),
  },
  {
    category: "ai",
    q: "Risk kartındaki yorumu kim üretiyor? Hatalı olur mu?",
    aText:
      "Google Gemini ile sade bir özet üretilir; anahtar yoksa sinyallerden kural-tabanlı bir özet gösterilir. Çıktı 'tavsiye amaçlıdır, kesin hüküm değildir' olarak etiketlenir.",
    a: (
      <>
        Sade-dil özeti Google <strong>Gemini</strong> ile üretilir; anahtar
        yoksa toplanan sinyallerden <strong>kural-tabanlı</strong> bir özet
        gösterilir (kart asla boş kalmaz). Çıktı bilgilendirme amaçlıdır, kesin
        hüküm değildir — kararı her zaman sen verirsin.
      </>
    ),
  },
  {
    category: "guvenlik",
    q: "İhbarım anında herkese görünür mü?",
    aText:
      "Hayır. İhbarlar moderasyondan geçer ve teknik sinyalle desteklenmeyen tekil ihbarlar 'doğrulanmadı' olarak beklemede kalır. Oran sınırı ve bot koruması manipülasyonu engeller.",
    a: (
      <>
        Hayır. İhbarlar moderasyondan geçer; teknik sinyalle desteklenmeyen
        tekil ihbarlar <em>doğrulanmadı</em> olarak beklemede kalır. Oran sınırı
        ve bot koruması, bir adresi haksız yere karalamaya yönelik manipülasyonu
        engeller.
      </>
    ),
  },
  {
    category: "kullanim",
    q: "Site mobilde zor kullanılıyor, ne yapmalıyım?",
    aText:
      "Üst sağdaki menü ikonuna dokun, nav linklerine ulaş. Hata varsa iletişim sayfasından bildir.",
    a: (
      <>
        Üst sağdaki <strong>menü ikonuna</strong> dokunarak tüm bağlantılara
        ulaşabilirsin. Hâlâ takıldığın bir yer varsa{" "}
        <Link href="/iletisim" className="font-medium underline-offset-2 hover:underline">
          /iletisim
        </Link>
        &apos;den hata bildir.
      </>
    ),
  },
  {
    category: "diger",
    q: "IBAN, telefon ve ilan sorgusu ne zaman gelecek?",
    aText:
      "Şu an web sitesi (domain) sorgusu canlı. IBAN (mod-97 + banka + ihbar), telefon ve ilan dikeyleri yakında ekleniyor; motor aynı, sadece veri tipi değişiyor.",
    a: (
      <>
        Şu an <strong>web sitesi (domain)</strong> sorgusu tam canlı.{" "}
        <strong>IBAN</strong> (mod-97 + banka + ihbar), <strong>telefon</strong>{" "}
        ve <strong>ilan</strong> dikeyleri yakında ekleniyor — motor aynı,
        yalnızca veri tipi değişiyor. Önerin varsa{" "}
        <Link href="/iletisim" className="font-medium underline-offset-2 hover:underline">
          /iletisim
        </Link>
        &apos;den yaz.
      </>
    ),
  },
  {
    category: "diger",
    q: "Sitenin kaynak kodu açık mı?",
    aText:
      "Evet, açık kaynak. Kod GitHub'da merbay-erp/gercekveri deposunda yayınlanıyor.",
    a: (
      <>
        Evet, <strong>açık kaynak</strong>. Kod{" "}
        <Link
          href={siteConfig.links.github}
          className="font-medium underline-offset-2 hover:underline"
        >
          GitHub&apos;da
        </Link>{" "}
        yayınlanıyor — risk motorunun hangi sinyallere baktığını satır satır
        inceleyebilirsin.
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
