import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `KVKK Aydınlatma Metni — ${siteConfig.name}`,
  description: `6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.`,
  alternates: { canonical: "/kvkk" },
};

const LAST_UPDATED = "Mayıs 2026";

export default function KvkkPage() {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
      <h1>KVKK Aydınlatma Metni</h1>
      <p className="text-sm text-muted-foreground">Son güncelleme: {LAST_UPDATED}</p>

      <p>
        6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, veri
        sorumlusu olarak {siteConfig.name} platformunda işlenen kişisel veriler
        hakkında bu metin sizi bilgilendirmektedir.
      </p>

      <h2>1. Veri Sorumlusu</h2>
      <p>
        {siteConfig.name} platformunu işleten kişisel kullanıcı:{" "}
        <span className="font-medium">Mustafa Erbay</span>.
        İletişim için: <a href="/iletisim">/iletisim</a> sayfası.
      </p>

      <h2>2. İşlenen Kişisel Veriler</h2>
      <p>Platform tasarımı gereği <strong>kişisel veri talep edilmemekte</strong> ve aşağıdaki minimal teknik veriler işlenmektedir:</p>
      <ul>
        <li>Bağlantı IP adresinin <strong>tek yönlü hash</strong>'i (orijinal IP saklanmaz)</li>
        <li>Tarayıcı User-Agent ve dil tercihi <strong>hash</strong>'i</li>
        <li>Kullanıcının kendi serbestçe paylaştığı, tanımlayıcı olmayan veri (tutar, şehir, m² vs.)</li>
      </ul>
      <p>
        İsim, e-posta, telefon, TC kimlik numarası, finansal hesap bilgisi, konum
        bilgisi <strong>kesinlikle talep edilmez ve işlenmez</strong>.
      </p>

      <h2>3. Kişisel Verilerin İşlenme Amaçları</h2>
      <ul>
        <li>Anonim agregat istatistik üretimi (medyan, ortalama, kategori dağılımı)</li>
        <li>Otomatik spam/suistimal tespiti (aynı IP hash'inden yığın paylaşımı bloklamak)</li>
        <li>Aykırı (outlier) veri tespiti</li>
      </ul>

      <h2>4. İşlemenin Hukuki Sebebi</h2>
      <p>
        KVKK madde 5/2-(f) — "İlgili kişinin temel hak ve özgürlüklerine zarar
        vermemek kaydıyla, veri sorumlusunun meşru menfaatleri için veri işlenmesinin
        zorunlu olması" hükmü uyarınca işlem yapılmaktadır.
      </p>

      <h2>5. Aktarım</h2>
      <ul>
        <li>Hosting: Vercel Inc. (ABD/AB sunucular).</li>
        <li>Veritabanı: Neon Inc. (AB sunucu — Frankfurt).</li>
        <li>AI özet servisi: Google LLC (yalnızca agregat sayılar gönderilir, bireysel veri değil).</li>
      </ul>

      <h2>6. KVKK Madde 11 Uyarınca Haklarınız</h2>
      <p>
        Anonim platform yapısı sebebiyle "kendi kişisel verilerinizin işlenip
        işlenmediğini öğrenme" gibi haklar pratik olarak uygulanamamaktadır,
        çünkü herhangi bir paylaşımı sizinle eşleştirme imkanımız yoktur.
      </p>
      <p>
        Yine de yanlışlıkla yapılmış / kaldırılmasını istediğiniz bir paylaşım
        varsa, paylaşımın <code>publicId</code>'sini belirterek{" "}
        <a href="/iletisim">/iletisim</a> üzerinden bize ulaşmanız halinde derhal
        kaldırılır.
      </p>

      <h2>7. Veri Güvenliği</h2>
      <p>
        Tüm trafik HTTPS üzerinden iletilir. IP ve UA hash'leri SHA-256 ile
        salt'lanarak üretilir; orijinal değerler hiçbir aşamada saklanmaz.
        Yönetim paneli erişimi bcrypt-hash'li parola + signed JWT cookie ile
        korunur.
      </p>
    </article>
  );
}
