import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Database,
  Share2,
  Trash2,
  Clock,
  Baby,
  AlertCircle,
  FileText,
  Server,
  Cpu,
  DollarSign,
  Mail,
  Lock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import {
  ContentSection,
  Callout,
  DefinitionList,
  RelatedDataGrid,
} from "@/components/content/article-blocks";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Gizlilik Politikası — ${siteConfig.name}`,
  description: `${siteConfig.name} platformunda toplanan veriler, kullanım amacı ve kullanıcı hakları. Anonim, K-anonymity korumalı, KVKK uyumlu.`,
  alternates: { canonical: "/gizlilik" },
};

const LAST_UPDATED = "Mayıs 2026";

export default function GizlilikPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Yasal · KVKK Uyumlu
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Gizlilik Politikası
        </h1>
        <p className="mt-3 text-muted-foreground">
          {siteConfig.name}, anonim katkıya dayalı bir veri platformudur. Bu
          politika hangi verileri topladığımızı, neden topladığımızı ve hangi
          haklara sahip olduğunu açıklar.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Son güncelleme: <strong>{LAST_UPDATED}</strong>
        </p>
      </header>

      <Callout type="success" title="Tek satırda özet">
        Hesap yok, e-posta yok, telefon yok. Sadece paylaştığın veri + IP/UA
        hash'i (spam koruması için). Hiç PII saklamıyoruz, K-anonymity ile
        kombine bireysel veriyi gizliyoruz.
      </Callout>

      <div className="mt-10 space-y-10">
        {/* 1. Veri sorumlusu */}
        <ContentSection icon={Shield} title="1. Veri sorumlusu" accent="emerald">
          <p>
            KVKK Madde 3/ı kapsamında veri sorumlusu kimliği:
          </p>
          <DefinitionList
            items={[
              {
                icon: FileText,
                term: "Veri Sorumlusu",
                description: "Mustafa Erbay (bireysel — System Architect)",
              },
              {
                icon: Mail,
                term: "İletişim",
                description: (
                  <Link
                    href="/iletisim"
                    className="font-medium text-foreground underline-offset-2 hover:underline"
                  >
                    /iletisim sayfası
                  </Link>
                ),
              },
              {
                icon: Lock,
                term: "Otorite kimliği",
                description:
                  "Wikidata Q139679043 · ORCID 0009-0005-9624-4249 — kimlik kanonik referansı.",
              },
            ]}
          />
        </ContentSection>

        {/* 2. Hangi verileri topluyoruz */}
        <ContentSection icon={Database} title="2. Hangi verileri topluyoruz?" accent="blue">
          <p>
            <strong className="text-foreground">{siteConfig.name}</strong>{" "}
            kullanıcı kaydı, hesap, e-posta veya telefon numarası talep etmiyor.
            Bir paylaşım oluşturduğunda saklanan tek şeyler:
          </p>
          <DefinitionList
            items={[
              {
                icon: FileText,
                term: "Paylaşım içeriği",
                description:
                  "Form alanları (tutar, şehir, m², pozisyon adı, ISP, fatura tipi vb.) — kategoriye özel.",
              },
              {
                icon: Lock,
                term: "IP adresi hash'i",
                description:
                  "Spam/suistimal önlemek için SHA-256 ile tek yönlü hash'lenir. Orijinal IP saklanmaz, geri çevrilemez.",
              },
              {
                icon: Lock,
                term: "Tarayıcı parmak izi",
                description:
                  "User-Agent + Accept-Language değerlerinin hash'i. Yine geri çevrilemez.",
              },
            ]}
          />

          <Callout type="info" title="Saklamadığımız bilgiler">
            <ul className="ml-4 list-disc space-y-0.5">
              <li>Ad-soyad, e-posta, telefon</li>
              <li>IBAN, TC kimlik, vergi no</li>
              <li>GPS konum, ev/iş adresi</li>
              <li>Cookie tabanlı kullanıcı kimlik (login yok)</li>
              <li>Sosyal medya hesap bilgileri</li>
            </ul>
          </Callout>
        </ContentSection>

        {/* 3. Veriler ne için */}
        <ContentSection icon={Cpu} title="3. Bu verileri ne için kullanıyoruz?" accent="purple">
          <p>Toplanan veriler 3 amaca hizmet eder:</p>
          <DefinitionList
            items={[
              {
                icon: Database,
                term: "Agregat istatistikler",
                description:
                  "Kategori × şehir × pozisyon bazında medyan, ortalama, p25, p75 dağılımları. K-anonymity (min 3 katkı) uygulanır.",
              },
              {
                icon: XCircle,
                term: "Spam ve suistimal önleme",
                description:
                  "24 saatte 10+ paylaşım yapan IP otomatik bloklanır. Outlier tespit (IQR yöntemi) ile aykırı veriler işaretlenir.",
              },
              {
                icon: CheckCircle2,
                term: "AI özet üretimi",
                description:
                  "Bireysel paylaşım değil — yalnızca agregat istatistikler (median/avg) Google Gemini API'ye gönderilir. Tek bir kullanıcının verisi AI'ya ulaşmaz.",
              },
            ]}
          />
        </ContentSection>

        {/* 4. K-anonymity */}
        <ContentSection icon={Shield} title="4. K-anonymity koruması" accent="emerald">
          <p>
            Bireysel paylaşımı tespit edilemez kılan teknik kuralımız:
          </p>
          <Callout type="success" title="Min 3 katkı kuralı">
            Bir <strong>şehir × kategori × özellik</strong> kombinasyonunda en
            az 3 farklı paylaşım yoksa, o veri agregat olarak gösterilmez.
            Örnek: <em>Trabzon × Yazılım Mühendisi × Senior</em> kombinasyonunda
            2 kişi varsa, bu pozisyon Trabzon sayfasında medyan
            hesaplamasından çıkartılır.
          </Callout>
          <p>
            Bu, dolaylı tanımlama (re-identification) saldırılarına karşı
            koruma sağlar. Akademik literatürdeki k=3 minimum standardına
            sadıktır.
          </p>
        </ContentSection>

        {/* 5. Üçüncü taraflar */}
        <ContentSection icon={Share2} title="5. Üçüncü taraflarla veri paylaşımı" accent="amber">
          <p>Bazı altyapı hizmetleri için verinin işlendiği üçüncü taraflar:</p>
          <DefinitionList
            items={[
              {
                icon: Server,
                term: "Hosting — Vercel",
                description:
                  "Next.js uygulaması. Sunucu konumu: ABD/AB. Vercel'in kendi gizlilik politikası: vercel.com/legal/privacy",
              },
              {
                icon: Database,
                term: "Veritabanı — Neon Postgres",
                description:
                  "Sunucu konumu: Frankfurt (AB). GDPR uyumlu, DPA imzalı.",
              },
              {
                icon: Cpu,
                term: "AI özetler — Google Gemini",
                description:
                  "Yalnızca agregat istatistikler (medyan, ortalama, dağılım sayıları) gönderilir. Bireysel paylaşım VERİSİ asla gönderilmez.",
              },
              {
                icon: DollarSign,
                term: "Reklam — Google AdSense",
                description: (
                  <>
                    Sayfa ziyaretiyle ilgili çerezler kullanır.{" "}
                    <Link
                      href="/cerez"
                      className="font-medium text-foreground underline-offset-2 hover:underline"
                    >
                      Çerez Politikası
                    </Link>{" "}
                    + Google Consent Mode v2 ile yönetilir.
                  </>
                ),
              },
              {
                icon: Server,
                term: "TCMB EVDS API",
                description:
                  "Döviz, faiz, TÜFE verileri TCMB'den çekilir. Bu tek yönlü bir veri alımıdır — sana ait hiçbir veri TCMB'ye gönderilmez.",
              },
            ]}
          />
        </ContentSection>

        {/* 6. Reklam yayıncılarıyla */}
        <ContentSection icon={DollarSign} title="6. Google AdSense + reklam yayıncıları" accent="amber">
          <p>
            Bu site Google AdSense ile reklam yayınlar (Publisher ID:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              pub-1903288869126718
            </code>
            ).
          </p>

          <Callout type="info" title="Çerez tercihiniz reklamları etkiler">
            Cookie consent banner üzerinden seçtiğin tercih (Tümünü Kabul /
            Sadece Zorunlu) Google Consent Mode v2 ile AdSense'e sinyallenir.
            Reddedersen kişiselleştirilmemiş reklam (NPA) gösterilir — reklamlar
            yine görünür ama hedeflemesiz.
          </Callout>

          <p>
            Google'ın reklam çerezi politikası:{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              policies.google.com/technologies/ads
            </a>
            . Tercihleri yönetmek:{" "}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              google.com/settings/ads
            </a>
          </p>
        </ContentSection>

        {/* 7. Kullanıcı hakları */}
        <ContentSection icon={Trash2} title="7. Kullanıcı hakları (KVKK Madde 11)" accent="rose">
          <p>
            KVKK kapsamında veri sorumlusuna başvurarak şu haklarını
            kullanabilirsin:
          </p>
          <DefinitionList
            items={[
              {
                term: "Bilgi talep etme hakkı",
                description:
                  "Hangi kategorideki verilerin işlendiğini öğrenme. (Anonim olduğumuz için bireysel veri eşleştiremiyoruz.)",
              },
              {
                term: "Düzeltme hakkı",
                description:
                  "Eksik/yanlış bir paylaşımın düzeltilmesi. publicId belirterek talep edebilirsin.",
              },
              {
                term: "Silme hakkı",
                description:
                  "Bir paylaşımın yayından kaldırılması. publicId ile başvur, 7 iş günü içinde işlenir.",
              },
              {
                term: "İtiraz hakkı",
                description: "Otomatik karar mekanizmalarına itiraz edebilirsin.",
              },
            ]}
          />
          <Callout type="tip" title="Paylaşım silme nasıl yapılır?">
            Paylaşımının altındaki <strong>publicId</strong>'yi (örn. abc123def)
            kopyala,{" "}
            <Link
              href="/iletisim"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              iletişim
            </Link>{" "}
            sayfasından bu ID ile başvur. 7 iş günü içinde silinir.
          </Callout>
        </ContentSection>

        {/* 8. Saklama süresi */}
        <ContentSection icon={Clock} title="8. Veri saklama süresi" accent="muted">
          <DefinitionList
            items={[
              {
                term: "Paylaşım verileri",
                description: "Süresiz (toplulaştırılarak yayında kalır).",
              },
              {
                term: "IP/UA hash",
                description: "Spam tespiti için 90 gün, sonrasında null'lanır.",
              },
              {
                term: "AI özet cache",
                description: "7 gün, sonra yeniden üretilir.",
              },
              {
                term: "Audit log",
                description: "Admin işlemleri 180 gün (denetim için).",
              },
            ]}
          />
        </ContentSection>

        {/* 9. Çocukların gizliliği */}
        <ContentSection icon={Baby} title="9. Çocukların gizliliği" accent="rose">
          <Callout type="warning" title="18 yaş üstü kullanım">
            Platform 18 yaş üstü kullanıcılar için tasarlanmıştır. Bilinçli
            olarak 18 yaş altından veri toplamıyoruz. Çocuk verisi tespit
            edilirse derhal silinir.
          </Callout>
        </ContentSection>

        {/* 10. Değişiklikler */}
        <ContentSection icon={AlertCircle} title="10. Bu politikadaki değişiklikler" accent="muted">
          <p>
            Politika güncellendiğinde "Son güncelleme" tarihi değişir. Önemli
            değişiklikler için 30 gün önceden ana sayfa banner ile haber
            verilir. Sürüm geçmişi GitHub'ta açık (gercekveri repo).
          </p>
        </ContentSection>

        {/* İlgili sayfalar */}
        <ContentSection icon={FileText} title="İlgili yasal belgeler" accent="muted">
          <RelatedDataGrid
            links={[
              {
                title: "Çerez Politikası",
                description: "Hangi çerezler, AdSense ayarları, Consent Mode v2.",
                href: "/cerez",
                icon: Database,
                accent: "blue",
              },
              {
                title: "Kullanım Şartları",
                description: "Platform kullanım koşulları, sorumluluk reddi.",
                href: "/sartlar",
                icon: FileText,
                accent: "purple",
              },
              {
                title: "KVKK Aydınlatma",
                description: "KVKK Madde 10 kapsamında detaylı aydınlatma metni.",
                href: "/kvkk",
                icon: Shield,
                accent: "emerald",
              },
              {
                title: "İletişim",
                description: "Veri silme, düzeltme, soru ve şikayetler.",
                href: "/iletisim",
                icon: Mail,
                accent: "amber",
              },
            ]}
          />
        </ContentSection>
      </div>
    </div>
  );
}
