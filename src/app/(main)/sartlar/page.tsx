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
                term: "Dolandırıcılık sorgusu & risk skoru",
                description:
                  "Web sitesi, IBAN, telefon ya da ilan için ücretsiz teknik sinyaller (domain yaşı, kara liste, barındırma) + halk ihbarından üretilen 0-100 risk skoru.",
              },
              {
                icon: Database,
                term: "Anonim halk ihbarı",
                description:
                  "Kullanıcıların anonim olarak bildirdiği sahte site / dolandırıcılık kayıtları.",
              },
              {
                icon: Database,
                term: "AI özet",
                description:
                  "Risk kartı için Google Gemini ile (anahtar yoksa sinyallerden kural-tabanlı) üretilen sade-dil değerlendirme.",
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
                term: "İyi niyet & doğruluk",
                description:
                  "Yaptığın ihbarın kendi gerçek deneyimine ya da somut bir gerekçeye dayandığını. Bir adresi haksız yere karalamak için sahte ihbar üretmezsin.",
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
                term: "Sahte / kötü niyetli ihbar",
                description:
                  "Bir rakibi ya da kişiyi haksız yere karalamak için toplu/scriptli ihbar, aynı IP'den yığın gönderim. Oran sınırı ve bot koruması bunu engeller; tespit edilen IP hash'i cezalandırılır.",
              },
              {
                icon: XCircle,
                term: "Hakaret ve ifşa",
                description:
                  "İhbar açıklamasına hakaret, kişiye yönelik asılsız suçlama veya üçüncü tarafın özel hayatını ihlal eden içerik yazılmaz.",
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
            Yaptığın anonim ihbar{" "}
            <strong className="text-foreground">
              kamuya açık dolandırıcılık istatistiği üretiminde
            </strong>{" "}
            kullanılır.
          </p>
          <Callout type="info" title="Sahiplik ve lisanslama">
            Agregat (toplu) verileri{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              CC-BY-4.0
            </a>{" "}
            lisansı altında yayınlanır. Atıf zorunlu, ticari kullanım serbest.
            Bireysel ihbarı sahiplenme hakkın bulunmaz çünkü platform kimlik
            tespiti yapmaz (anonim mimari).
          </Callout>
        </ContentSection>

        {/* 5. Garanti reddi */}
        <ContentSection
          icon={AlertTriangle}
          title="5. Garanti reddi ve sorumluluk sınırı"
          accent="amber"
        >
          <Callout type="warning" title="ÖNEMLİ — Kesin hüküm değildir">
            <strong>
              Risk skoru bilgilendirme amaçlıdır; bir adresin gerçekten
              dolandırıcı olup olmadığına dair kesin hüküm değildir.
            </strong>{" "}
            &quot;Güvenli görünüyor&quot; düşük risk demektir, sıfır risk değil;
            &quot;Yüksek risk&quot; ise bir uyarıdır, mahkeme kararı değil.
            Sinyaller ve ihbarlar &quot;olduğu gibi&quot; (as-is) gösterilir.
          </Callout>

          <p>Aşağıdaki durumlarda sorumluluğu kendin alırsın:</p>
          <ul className="my-2 ml-4 list-disc space-y-1 text-sm">
            <li>Skora bakıp bir siteye ödeme yapma ya da yapmama</li>
            <li>Bir IBAN&apos;a havale/EFT gönderme</li>
            <li>Bir ilan veya satıcıyla işleme girme</li>
            <li>Bir telefon numarasını engelleme/yanıtlama</li>
          </ul>

          <Callout type="tip" title="Resmi mercilere de başvur">
            Dolandırıldığını düşünüyorsan vakit kaybetmeden bankanı ara, BTK ve
            Cumhuriyet Savcılığına başvur. {siteConfig.name} bir rehberdir — son
            söz resmi mercilerindir.
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
