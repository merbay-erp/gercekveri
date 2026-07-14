import type { Metadata } from "next";
import {
  Cookie,
  ShieldCheck,
  DollarSign,
  BarChart3,
  Settings,
  ExternalLink,
  Database,
  Mail,
  FileText,
} from "lucide-react";

import {
  ContentSection,
  Callout,
  DefinitionList,
  RelatedDataGrid,
} from "@/components/content/article-blocks";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Çerez Politikası — ${siteConfig.name}`,
  description: `${siteConfig.name} platformunda kullanılan çerezler, AdSense Google Consent Mode v2 ve tercihlerin yönetimi.`,
  alternates: { canonical: "/cerez" },
};

const LAST_UPDATED = "Mayıs 2026";

export default function CerezPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Yasal · KVKK + GDPR
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          Çerez Politikası
        </h1>
        <p className="mt-3 text-muted-foreground">
          {siteConfig.name} platformunda kullanılan çerezler, amaçları, üçüncü
          taraf çerezleri ve nasıl yönetebileceğin.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Son güncelleme: <strong>{LAST_UPDATED}</strong>
        </p>
      </header>

      <Callout type="info" title="Hesap çerezimiz yok">
        Platform hesap/login sistemi içermez. Kullanıcı kimliğine bağlı çerez{" "}
        <strong>oluşturmuyoruz</strong>. Sadece teknik (tema, oturum) ve
        üçüncü taraf reklam çerezleri vardır.
      </Callout>

      <div className="mt-10 space-y-10">
        {/* 1. Zorunlu Çerezler */}
        <ContentSection
          icon={ShieldCheck}
          title="1. Zorunlu çerezler"
          accent="emerald"
        >
          <p>
            Bu çerezler sitenin çalışması için gereklidir, dolayısıyla
            engellenemez.
          </p>
          <DefinitionList
            items={[
              {
                icon: Settings,
                term: "theme",
                description:
                  "Koyu/açık tema tercihini hatırlamak için. next-themes kütüphanesi kullanır. Sunucuya gönderilmez, yalnızca tarayıcıda saklanır.",
              },
              {
                icon: Database,
                term: "gercekveri.consent.v1 (localStorage)",
                description:
                  "Cookie consent banner üzerinden seçtiğin tercih (Tümünü Kabul / Sadece Zorunlu). Reklam çerezi tercihini Consent Mode v2'ye sinyaller.",
              },
              {
                icon: ShieldCheck,
                term: "gv_admin",
                description:
                  "Yalnızca /admin paneline giriş yapan yöneticide oluşur. httpOnly + signed JWT, 12 saat. Normal kullanıcıda oluşmaz.",
              },
            ]}
          />
        </ContentSection>

        {/* 2. AdSense Çerezleri */}
        <ContentSection
          icon={DollarSign}
          title="2. Google AdSense reklam çerezleri"
          accent="amber"
        >
          <p>
            Sayfada reklam alanları olduğu için Google AdSense aşağıdaki
            çerezleri kullanır:
          </p>
          <DefinitionList
            items={[
              {
                icon: Cookie,
                term: "__gads",
                description:
                  "AdSense'in reklam izleme çerezi. Reklam göstermek için kullanılır.",
              },
              {
                icon: Cookie,
                term: "__gpi",
                description:
                  "Google Publisher Identity — reklam yayıncısı kimliği.",
              },
              {
                icon: Cookie,
                term: "NID",
                description:
                  "Google hesap tercihleri (dil, arama ayarları, kişiselleştirme).",
              },
              {
                icon: Cookie,
                term: "IDE / DSID",
                description:
                  "Reklam etkileşim takibi. Hangi reklam görüldü, tıklandı.",
              },
            ]}
          />

          <Callout type="info" title="Consent Mode v2 ile yönetilir">
            Cookie banner'da <strong>Tümünü Kabul</strong> seçersen reklamlar
            kişiselleştirilir (yüksek CPM). <strong>Sadece Zorunlu</strong>{" "}
            seçersen Google Consent Mode v2 ile{" "}
            <em>npa=1</em> sinyali gönderilir → kişiselleştirilmemiş reklamlar
            (NPA) gösterilir, çerez ID'leri saklanmaz.
          </Callout>
        </ContentSection>

        {/* 3. Analytics */}
        <ContentSection
          icon={BarChart3}
          title="3. Analytics çerezleri"
          accent="blue"
        >
          <DefinitionList
            items={[
              {
                icon: BarChart3,
                term: "Vercel Analytics",
                description:
                  "Sayfa görüntüleme sayısını anonim ölçer. Kullanıcı kimliğine bağlı veri toplamaz, çerez kullanmaz (server-side first-party).",
              },
            ]}
          />
          <Callout type="success" title="Google Analytics kullanmıyoruz">
            Google Analytics tarayıcılarda yaygın çerez sıkıntısı yaratır.
            gercekveri Vercel Analytics ile yetinir — first-party, cookieless,
            performant.
          </Callout>
        </ContentSection>

        {/* 4. Reddi nasıl yaparsın */}
        <ContentSection
          icon={Settings}
          title="4. Çerezleri reddetmek / değiştirmek"
          accent="purple"
        >
          <p>3 farklı seviyede kontrolün var:</p>
          <DefinitionList
            items={[
              {
                term: "1. Cookie consent banner",
                description:
                  "Site ilk ziyarette altta açılır. 'Sadece Zorunlu' ile reklam çerezleri devre dışı, sadece zorunlular kalır.",
              },
              {
                term: "2. Tarayıcı ayarları",
                description:
                  "Chrome/Firefox/Safari'nin gizlilik ayarlarından tüm çerezleri devre dışı bırak. Site çalışmaya devam eder (tema kaydedilmez, reklamlar genel).",
              },
              {
                term: "3. Google Ad Personalization",
                description: (
                  <>
                    Google hesabında reklam tercihlerini yönet:{" "}
                    <a
                      href="https://www.google.com/settings/ads"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-foreground underline-offset-2 hover:underline"
                    >
                      google.com/settings/ads <ExternalLink className="inline h-3 w-3" />
                    </a>
                  </>
                ),
              },
            ]}
          />
        </ContentSection>

        {/* 5. AdSense politika linki */}
        <ContentSection
          icon={ExternalLink}
          title="5. Google'ın reklam politikaları"
          accent="muted"
        >
          <p>Google'ın çerez ve reklam politikalarını detaylı incelemek için:</p>
          <ul className="my-3 space-y-2 text-sm">
            <li>
              •{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                Google Reklam Çerezleri
              </a>
            </li>
            <li>
              •{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                Google Gizlilik Politikası
              </a>
            </li>
            <li>
              •{" "}
              <a
                href="https://support.google.com/adsense/answer/142293"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                AdSense Çerez Kullanımı
              </a>
            </li>
          </ul>
        </ContentSection>

        {/* İlgili sayfalar */}
        <ContentSection icon={FileText} title="İlgili yasal belgeler" accent="muted">
          <RelatedDataGrid
            links={[
              {
                title: "Gizlilik Politikası",
                description: "Hangi veriler toplanır, neden, ne kadar saklanır.",
                href: "/gizlilik",
                icon: ShieldCheck,
                accent: "emerald",
              },
              {
                title: "Kullanım Şartları",
                description: "Platform kullanım koşulları, sorumluluk.",
                href: "/sartlar",
                icon: FileText,
                accent: "purple",
              },
              {
                title: "KVKK Aydınlatma",
                description: "KVKK Madde 10 detaylı aydınlatma metni.",
                href: "/kvkk",
                icon: ShieldCheck,
                accent: "blue",
              },
              {
                title: "İletişim",
                description: "Soru, talep ve şikayetler.",
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
