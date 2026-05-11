import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Shield,
  AlertTriangle,
  Ban,
  Scale,
  Database,
  Mail,
  Settings,
  CheckCircle2,
  XCircle,
  Gavel,
  ShieldCheck,
  Cookie,
} from "lucide-react";

import {
  ContentSection,
  Callout,
  DefinitionList,
  RelatedDataGrid,
} from "@/components/content/article-blocks";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Kullanım Şartları — ${siteConfig.name}`,
  description: `${siteConfig.name} platformunu kullanırken uyman gereken şartlar — anonim katkı, kullanım kuralları, sorumluluk reddi.`,
  alternates: { canonical: "/sartlar" },
};

const LAST_UPDATED = "Mayıs 2026";

export default function SartlarPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Yasal · Platform Kullanım Koşulları
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Kullanım Şartları
        </h1>
        <p className="mt-3 text-muted-foreground">
          {siteConfig.name} platformunu kullanırken uyman gereken kurallar,
          kullanıcı yükümlülükleri, platformun sorumluluk sınırları.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Son güncelleme: <strong>{LAST_UPDATED}</strong>
        </p>
      </header>

      <Callout type="info" title="Sözleşme niteliği">
        Bu sayfayı görüntüleyerek, sitemizi kullanarak veya veri paylaşarak
        aşağıdaki şartları kabul etmiş sayılırsın. Şartları kabul etmiyorsan
        platformu kullanmamalısın.
      </Callout>

      <div className="mt-10 space-y-10">
        {/* 1. Hizmet tanımı */}
        <ContentSection icon={FileText} title="1. Hizmet tanımı" accent="blue">
          <p>
            <strong className="text-foreground">{siteConfig.name}</strong> (
            <a
              href={`https://${siteConfig.domain}`}
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              {siteConfig.domain}
            </a>
            ), Türkiye'de:
          </p>
          <DefinitionList
            items={[
              {
                icon: Database,
                term: "Anonim halk verisi",
                description:
                  "Maaş, kira, aidat, fatura, internet hızı, tekstil fiyatları — kullanıcı katkısı.",
              },
              {
                icon: Database,
                term: "TCMB resmi verisi",
                description:
                  "Döviz kurları (USD/TL, EUR/TL), TÜFE enflasyon, politika faizi, konut fiyat endeksi (KFE) — EVDS API'den çekilir.",
              },
              {
                icon: Database,
                term: "AI özetler + istatistikler",
                description:
                  "Agregat değerlerden Google Gemini API ile insan-okur özetler.",
              },
            ]}
          />
        </ContentSection>

        {/* 2. Anonim Paylaşım */}
        <ContentSection
          icon={Shield}
          title="2. Anonim paylaşım yükümlülükleri"
          accent="emerald"
        >
          <p>Platforma veri eklediğinde aşağıdakileri taahhüt edersin:</p>
          <DefinitionList
            items={[
              {
                icon: CheckCircle2,
                term: "Doğruluk",
                description:
                  "Paylaştığın rakamların kendi gerçek deneyimine dayalı olduğunu. Uydurma rakamlar AI kalite skoru tarafından düşük puan alır ve istatistiklerden çıkarılır.",
              },
              {
                icon: XCircle,
                term: "PII paylaşmama",
                description:
                  "Ad-soyad, telefon, e-posta, IBAN, TC kimlik gibi kişisel bilgi paylaşmazsın. Free-text alanlara bu tür veri yazılmaz.",
              },
              {
                icon: XCircle,
                term: "Üçüncü taraf verisi",
                description:
                  "Başkasının (eşi, arkadaşı, çalışanı, müvekkili) bilgisini onun rızası olmadan paylaşmazsın.",
              },
              {
                icon: XCircle,
                term: "Telif hakkı",
                description:
                  "Kapalı şirket içi tablolar, NDA altındaki veriler, müşteri sözleşmeleri gibi gizli kaynaklardan veri aktarmazsın.",
              },
            ]}
          />
        </ContentSection>

        {/* 3. Yasak Davranışlar */}
        <ContentSection icon={Ban} title="3. Yasak davranışlar" accent="rose">
          <p>Platform üzerinde aşağıdaki davranışlar yasaktır:</p>
          <DefinitionList
            items={[
              {
                icon: XCircle,
                term: "Sahte paylaşım üretmek",
                description:
                  "Toplu/scriptli paylaşım, aynı IP'den yığın gönderim. 24 saatte 10+ paylaşım otomatik bloklanır + IP hash 90 gün cezalı.",
              },
              {
                icon: XCircle,
                term: "Hakaret ve ifşa",
                description:
                  "Free-text alanlara hakaret, kişiye yönelik suçlama, üçüncü tarafın özel hayatını ihlal eden içerik yazılmaz.",
              },
              {
                icon: XCircle,
                term: "Teknik suistimal",
                description:
                  "DoS, scraping bot, API enjeksiyon, XSS, vb. Tespit edilirse hukuki yola başvurulur (CMK 250).",
              },
              {
                icon: XCircle,
                term: "Reklam / promosyon",
                description:
                  "Ürün/hizmet tanıtımı için paylaşım üretmek. Platform editorial bağımsızlığını korur.",
              },
            ]}
          />
        </ContentSection>

        {/* 4. İçerik hakları */}
        <ContentSection
          icon={Database}
          title="4. İçerik üzerindeki haklar"
          accent="purple"
        >
          <p>
            Anonim olarak paylaştığın veri{" "}
            <strong className="text-foreground">
              kamuya açık agregat istatistik üretiminde
            </strong>{" "}
            kullanılır.
          </p>
          <Callout type="info" title="Sahiplik ve lisanslama">
            Agregat verileri{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              CC-BY-4.0
            </a>{" "}
            lisansı altında yayınlanır. Atıf zorunlu, ticari kullanım serbest.
            Bireysel paylaşımı sahiplenme hakkın bulunmaz çünkü platform kimlik
            tespiti yapmaz (anonim mimari).
          </Callout>
        </ContentSection>

        {/* 5. Garanti reddi */}
        <ContentSection
          icon={AlertTriangle}
          title="5. Garanti reddi ve sorumluluk sınırı"
          accent="amber"
        >
          <Callout type="warning" title="ÖNEMLİ — Tavsiye değildir">
            <strong>Bu site finansal, hukuki veya yatırım tavsiyesi vermez.</strong>{" "}
            Sayılar anonim kullanıcı katkısıyla oluşur, doğruluğu garanti
            edilmez. TCMB verisi de "as-is" (olduğu gibi) gösterilir.
          </Callout>

          <p>Aşağıdaki kararları aldığında sorumluluğu kendin alırsın:</p>
          <ul className="my-2 ml-4 list-disc space-y-1 text-sm">
            <li>Maaş pazarlığında verileri referans alma</li>
            <li>Kira kararı, ev seçimi</li>
            <li>Yatırım/döviz pozisyonu</li>
            <li>Üretim teklifi hazırlama</li>
            <li>Kredi/borç planlama</li>
            <li>Vergi hesaplaması</li>
          </ul>

          <Callout type="tip" title="Resmi kaynaklara da bak">
            Önemli kararlarda TCMB, TÜİK, SGK gibi resmi otoritelerin güncel
            verilerini de kontrol et. gercekveri agregat veri sunar — son söz
            resmi otoritenin.
          </Callout>
        </ContentSection>

        {/* 6. Reklam ve gelir */}
        <ContentSection
          icon={Settings}
          title="6. Reklam, gelir modeli ve editorial bağımsızlık"
          accent="muted"
        >
          <p>
            Platform Google AdSense ile reklam yayınlar. Bu, hizmetin ücretsiz
            kalması için gerekli gelir kaynağıdır.
          </p>
          <Callout type="success" title="Editorial bağımsızlık">
            Reklam veren hiçbir kurumla sponsorlu içerik anlaşmamız yoktur. AdSense
            reklamları bağlamsal (sayfa içeriğine göre) seçilir, editorial
            içeriği etkilemez. Stat hesaplamaları reklam veren etkisinden
            bağımsız yapılır.
          </Callout>
        </ContentSection>

        {/* 7. Hizmetin değişmesi */}
        <ContentSection
          icon={Settings}
          title="7. Hizmetin değişmesi / sonlanması"
          accent="muted"
        >
          <p>
            Platform, hizmeti dilediği zaman değiştirme veya sonlandırma hakkını
            saklı tutar. Önemli değişiklikler için ana sayfada banner gösterilir,
            30 gün önceden duyurulur.
          </p>
          <p>
            Sürüm geçmişi GitHub'ta açık şekilde takip edilebilir — şeffaflık
            için.
          </p>
        </ContentSection>

        {/* 8. Yetkili mahkeme */}
        <ContentSection icon={Gavel} title="8. Yetkili mahkeme ve yargı" accent="rose">
          <Callout type="info" title="Yetki ve uygulanacak hukuk">
            Bu şartlardan doğan uyuşmazlıklarda{" "}
            <strong>Türkiye Cumhuriyeti yasaları</strong> uygulanır. Yetkili
            mahkeme: <strong>Bursa Mahkemeleri</strong> ve İcra Daireleri (veri
            sorumlusunun yerleşim yeri).
          </Callout>
        </ContentSection>

        {/* İlgili sayfalar */}
        <ContentSection icon={FileText} title="İlgili yasal belgeler" accent="muted">
          <RelatedDataGrid
            links={[
              {
                title: "Gizlilik Politikası",
                description: "Hangi veriler toplanır, ne kadar saklanır.",
                href: "/gizlilik",
                icon: ShieldCheck,
                accent: "emerald",
              },
              {
                title: "Çerez Politikası",
                description: "Hangi çerezler, AdSense ayarları, Consent Mode v2.",
                href: "/cerez",
                icon: Cookie,
                accent: "blue",
              },
              {
                title: "KVKK Aydınlatma",
                description: "KVKK Madde 10 detaylı aydınlatma metni.",
                href: "/kvkk",
                icon: Scale,
                accent: "purple",
              },
              {
                title: "İletişim",
                description: "Soru, talep, veri silme başvurusu.",
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
