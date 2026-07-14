import type { Metadata } from "next";
import Link from "next/link";
import {
  Scale,
  ShieldCheck,
  Database,
  FileText,
  Lock,
  Mail,
  AlertCircle,
  CheckCircle2,
  Settings,
  Cookie,
  Cpu,
  Server,
  Globe,
  KeyRound,
} from "lucide-react";

import {
  ContentSection,
  Callout,
  DefinitionList,
  RelatedDataGrid,
} from "@/components/content/article-blocks";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `KVKK Aydınlatma Metni — ${siteConfig.name}`,
  description: `6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında detaylı aydınlatma metni — dolandırıcılık sorgu platformunda veri sorumlusu, işleme amacı, haklar.`,
  alternates: { canonical: "/kvkk" },
};

const LAST_UPDATED = "Mayıs 2026";

export default function KvkkPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <header className="mb-10 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Yasal · KVKK Madde 10
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
          KVKK Aydınlatma Metni
        </h1>
        <p className="mt-3 text-muted-foreground">
          6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca veri
          sorumlusu olarak {siteConfig.name} platformunda işlenen kişisel
          veriler hakkında detaylı bilgilendirme.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Son güncelleme: <strong>{LAST_UPDATED}</strong>
        </p>
      </header>

      <Callout type="success" title="Tek satırda KVKK uyumu">
        Platform anonim — kişisel veri talep etmiyoruz. Sadece IP/UA hash'i
        (spam koruması, 90 gün) ve ihbar içeriği (anonim) işlenir. Madde 5/2-(f)
        kapsamında meşru menfaat gerekçeli.
      </Callout>

      <div className="mt-10 space-y-10">
        {/* 1. Veri Sorumlusu */}
        <ContentSection
          icon={ShieldCheck}
          title="1. Veri sorumlusunun kimliği"
          accent="emerald"
        >
          <p>KVKK Madde 3/ı kapsamında veri sorumlusu kimliği:</p>
          <DefinitionList
            items={[
              {
                icon: FileText,
                term: "Veri Sorumlusu",
                description: "Mustafa Erbay (bireysel — System Architect)",
              },
              {
                icon: Globe,
                term: "Yerleşim yeri",
                description: "Bursa, Türkiye",
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
                icon: KeyRound,
                term: "Otorite kimlik",
                description:
                  "Wikidata Q139679043 · ORCID 0009-0005-9624-4249 — kanonik kimlik referansı.",
              },
            ]}
          />
        </ContentSection>

        {/* 2. İşlenen Kişisel Veriler */}
        <ContentSection
          icon={Database}
          title="2. İşlenen kişisel veriler"
          accent="blue"
        >
          <Callout type="info" title="Platform anonim — minimal veri">
            Bu platform tasarımı gereği <strong>kişisel veri talep etmez</strong>.
            Tek istisna teknik koruma çerçevesinde minimal işlem yapılan
            hash'lerdir.
          </Callout>

          <p>İşlenen teknik veriler:</p>
          <DefinitionList
            items={[
              {
                icon: Lock,
                term: "IP adres hash'i",
                description:
                  "Bağlantı IP adresinin SHA-256 ile tek yönlü hash'i. Orijinal IP saklanmaz, hash'ten geri çevrilemez. Spam/suistimal tespiti için 90 gün saklanır.",
              },
              {
                icon: Lock,
                term: "Tarayıcı parmak izi hash'i",
                description:
                  "User-Agent + Accept-Language değerlerinin hash'i. Aynı tarayıcıdan tekrarlı ihbar tespiti için.",
              },
              {
                icon: Database,
                term: "İhbar içeriği (anonim)",
                description:
                  "Sorgulanan değer (web adresi / IBAN / telefon / ilan), dolandırıcılık kategorisi ve opsiyonel açıklama. Açıklamadaki IBAN/telefon otomatik maskelenir; hiçbir kişisel tanımlayıcı saklanmaz.",
              },
            ]}
          />

          <Callout type="warning" title="Toplanmayan veriler">
            <ul className="ml-4 list-disc space-y-0.5">
              <li>İsim, e-posta, telefon</li>
              <li>TC kimlik numarası, vergi no</li>
              <li>IBAN, kredi kartı, finansal hesap</li>
              <li>GPS konum, ev/iş adresi</li>
              <li>Sağlık verisi, biyometrik veri</li>
              <li>Cookie tabanlı kullanıcı kimlik (hesap yok)</li>
            </ul>
          </Callout>
        </ContentSection>

        {/* 3. İşleme Amaçları */}
        <ContentSection icon={Cpu} title="3. Kişisel verilerin işlenme amaçları" accent="purple">
          <DefinitionList
            items={[
              {
                icon: Database,
                term: "Anonim dolandırıcılık kaydı üretimi",
                description:
                  "Her sorgulanan değer için ihbar sayıları, görüntülenme ve 0-100 risk skorları toplulaştırılır. İhbarlar kimliğe bağlanamaz — tekil ihbarın sahibini tespit edemeyiz (anonim mimari).",
              },
              {
                icon: Settings,
                term: "Otomatik spam/suistimal tespiti",
                description:
                  "Aynı IP hash'inden yığın ihbarı bloklama (24 saatte 10+ ihbar = otomatik blok).",
              },
              {
                icon: AlertCircle,
                term: "Risk sinyali değerlendirmesi",
                description:
                  "Sorgulanan kamuya açık değer (ör. web adresi) ücretsiz üçüncü taraf servislerle değerlendirilerek risk skoru üretilir. Bu servislere hiçbir kişisel veri gönderilmez.",
              },
              {
                icon: CheckCircle2,
                term: "AI özet üretimi",
                description:
                  "Kişisel veri değil — yalnızca sorgulanan değer ve teknik risk sinyalleri Google Gemini API'ye gönderilir. İnsan-okur içgörü üretimi.",
              },
            ]}
          />
        </ContentSection>

        {/* 4. Hukuki Sebep */}
        <ContentSection icon={Scale} title="4. İşlemenin hukuki sebebi" accent="rose">
          <Callout type="info" title="KVKK Madde 5/2-(f)">
            "İlgili kişinin temel hak ve özgürlüklerine zarar vermemek
            kaydıyla, veri sorumlusunun meşru menfaatleri için veri
            işlenmesinin zorunlu olması" hükmü gereği işlem yapılır.
          </Callout>

          <p>
            Meşru menfaat:{" "}
            <strong className="text-foreground">
              spam ve sahte veri saldırılarına karşı platformun bütünlüğünü
              korumak
            </strong>
            . IP hash'i bu meşru menfaatin yegane teknik koruma aracıdır;
            kullanıcının kimliğini tespit etmek için kullanılmaz.
          </p>
        </ContentSection>

        {/* 5. Aktarım */}
        <ContentSection
          icon={Server}
          title="5. Kişisel verilerin aktarımı (üçüncü taraf)"
          accent="amber"
        >
          <p>Altyapı hizmetleri için aktarılan teknik veriler:</p>
          <DefinitionList
            items={[
              {
                icon: Server,
                term: "Vercel Inc.",
                description:
                  "Hosting hizmeti. Sunucu konumu: ABD/AB. GDPR uyumlu DPA imzalı. KVKK Madde 9 çerçevesinde yurt dışı transfer.",
              },
              {
                icon: Database,
                term: "Neon Inc.",
                description:
                  "PostgreSQL veritabanı. Sunucu konumu: Frankfurt (AB). DPA imzalı.",
              },
              {
                icon: Cpu,
                term: "Google LLC (AI)",
                description:
                  "AI özet servisi. Yalnızca sorgulanan değer ve teknik risk sinyalleri gönderilir, bireysel kişisel veri DEĞİL. KVKK Madde 9 çerçevesinde sınırlı transfer.",
              },
              {
                icon: Globe,
                term: "Google Ireland Ltd. (AdSense)",
                description:
                  "Reklam yayını. Çerez tabanlı veri akışı, Consent Mode v2 ile yönetilir.",
              },
              {
                icon: Server,
                term: "Risk sinyali servisleri (ücretsiz)",
                description:
                  "RDAP (rdap.org), Cloudflare DNS-over-HTTPS (cloudflare-dns.com), Google Cloud Web Risk, Internet Archive / Wayback (web.archive.org) ve ipwho.is servislerine yalnızca sorgulanan kamuya açık değer (ör. web adresi) iletilir. Bu servislere kullanıcıya ait ek kişisel veri gönderilmez.",
              },
            ]}
          />
        </ContentSection>

        {/* 6. Haklar */}
        <ContentSection icon={KeyRound} title="6. KVKK Madde 11 — Haklarınız" accent="emerald">
          <Callout type="warning" title="Anonim platformda pratik sınırlama">
            Anonim platform yapısı sebebiyle "kendi verilerimin işlenip
            işlenmediğini öğrenme" hakkı pratik olarak uygulanamaz — herhangi
            bir ihbarı sizinle eşleştirme imkanımız yoktur.
          </Callout>

          <p>Yine de aşağıdaki haklara sahipsiniz:</p>
          <DefinitionList
            items={[
              {
                term: "Bilgi talep etme",
                description:
                  "Hangi kategorideki verilerin işlendiğini öğrenme (genel açıklama, bu metinde mevcut).",
              },
              {
                term: "Düzeltme",
                description:
                  "Hatalı kayıt için ilgili adresi (risk kartının URL'si) belirterek başvuru.",
              },
              {
                term: "Silme / Anonimleştirme",
                description:
                  "Kaydın yayından kaldırılması. İlgili adres ile başvuru, 7 iş günü içinde işlenir.",
              },
              {
                term: "İtiraz hakkı",
                description: "Otomatik karar mekanizmalarına itiraz.",
              },
              {
                term: "Zarar tazmin hakkı",
                description: "Hukuka aykırı işlemeden doğan zararın tazmini.",
              },
            ]}
          />

          <Callout type="tip" title="Başvuru süreci">
            İlgili risk kartının URL'sini (örn.{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
              /sorgu/web/ornek-site.com
            </code>
            ) kopyala,{" "}
            <Link
              href="/iletisim"
              className="font-medium text-foreground underline-offset-2 hover:underline"
            >
              iletişim
            </Link>{" "}
            sayfasından bu adres ile başvur. KVKK Madde 13 uyarınca en geç{" "}
            <strong>30 gün</strong> içinde yanıtlanır (genelde 7 iş gününde).
          </Callout>
        </ContentSection>

        {/* 7. Veri Güvenliği */}
        <ContentSection icon={Lock} title="7. Veri güvenliği önlemleri" accent="purple">
          <DefinitionList
            items={[
              {
                icon: ShieldCheck,
                term: "HTTPS / TLS 1.3",
                description: "Tüm trafik şifreli. SSL Labs A+ seviyesi.",
              },
              {
                icon: Lock,
                term: "SHA-256 tek yönlü hash",
                description:
                  "IP/UA değerleri salt'lanarak hash'lenir. Hiçbir aşamada orijinal değer saklanmaz.",
              },
              {
                icon: KeyRound,
                term: "Yönetim paneli koruması",
                description:
                  "Admin erişimi bcrypt-hash parola + signed JWT cookie + audit log (180 gün).",
              },
              {
                icon: Database,
                term: "Veritabanı şifreleme",
                description:
                  "Neon Postgres at-rest encryption (AES-256). Connection: TLS only.",
              },
              {
                icon: AlertCircle,
                term: "Audit & monitoring",
                description:
                  "Tüm admin işlemleri loglanır. Anomali tespit + otomatik alarm.",
              },
            ]}
          />
        </ContentSection>

        {/* 8. Saklama Süresi */}
        <ContentSection
          icon={FileText}
          title="8. Saklama süresi"
          accent="muted"
        >
          <DefinitionList
            items={[
              {
                term: "İhbar verisi (anonim)",
                description:
                  "Süresiz — toplulaştırılarak yayında kalır. Anonim olduğu için saklama süresi sınırı yoktur (KVKK Madde 7 kapsamı dışı).",
              },
              {
                term: "IP/UA hash",
                description: "90 gün, sonrasında null'lanır.",
              },
              {
                term: "AI özet cache",
                description: "7 gün.",
              },
              {
                term: "Audit log (admin)",
                description: "180 gün (KVKK Madde 12 denetim gereği).",
              },
            ]}
          />
        </ContentSection>

        {/* İlgili sayfalar */}
        <ContentSection icon={FileText} title="İlgili yasal belgeler" accent="muted">
          <RelatedDataGrid
            links={[
              {
                title: "Gizlilik Politikası",
                description: "Detaylı gizlilik tercihleri, kullanıcı hakları.",
                href: "/gizlilik",
                icon: ShieldCheck,
                accent: "emerald",
              },
              {
                title: "Çerez Politikası",
                description: "Hangi çerezler kullanılır, AdSense ayarları.",
                href: "/cerez",
                icon: Cookie,
                accent: "blue",
              },
              {
                title: "Kullanım Şartları",
                description: "Platform kullanım koşulları, sorumluluk.",
                href: "/sartlar",
                icon: FileText,
                accent: "purple",
              },
              {
                title: "İletişim",
                description: "Veri silme, düzeltme, KVKK başvuru.",
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
