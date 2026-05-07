import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Kullanım Şartları — ${siteConfig.name}`,
  description: `${siteConfig.name} platformunu kullanırken uymanız gereken şartlar.`,
  alternates: { canonical: "/sartlar" },
};

const LAST_UPDATED = "Mayıs 2026";

export default function SartlarPage() {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
      <h1>Kullanım Şartları</h1>
      <p className="text-sm text-muted-foreground">Son güncelleme: {LAST_UPDATED}</p>

      <h2>1. Hizmet</h2>
      <p>
        {siteConfig.name} ({siteConfig.domain}), kullanıcıların maaş, kira, aidat,
        fatura, internet hızı ve tekstil B2B fiyatlarını <strong>anonim</strong>{" "}
        olarak paylaştığı, agregat istatistikler ve AI özetler üreten bir kamu
        veri platformudur.
      </p>

      <h2>2. Anonim Paylaşım</h2>
      <p>Platforma veri eklerken:</p>
      <ul>
        <li>
          <strong>Bilgilerinin doğru olduğunu</strong> taahhüt edersin (uydurma
          rakamlar yapay zeka kalite skoru tarafından düşük puan alır ve
          yetersiz veri sayılır).
        </li>
        <li>
          Hiçbir kişisel bilgi (ad, telefon, e-posta), şirket adı, marka adı veya
          başkasının özel verisini paylaşmazsın.
        </li>
        <li>
          Telif hakkı ihlali yaratacak veri (örn. kapalı şirket içi tablolar)
          paylaşmazsın.
        </li>
      </ul>

      <h2>3. Yasak Davranışlar</h2>
      <ul>
        <li>Toplu / scriptli sahte paylaşım üretmek (24 saatte 10+ paylaşım otomatik bloklanır).</li>
        <li>Hakaret, ifşa, kişisel bilgi sızdırma içeren serbest metin yazmak.</li>
        <li>Platformun teknik altyapısını kötüye kullanmak (DoS, scraping bot, vb.).</li>
        <li>Reklam veya promosyon amacıyla içerik üretmek.</li>
      </ul>

      <h2>4. İçerik Üzerindeki Haklar</h2>
      <p>
        Anonim olarak paylaştığın veri kamuya açık agregat istatistik üretiminde
        kullanılır. {siteConfig.name} bu agregat verilerin kullanım hakkına
        sahiptir. Kişisel olarak paylaşımı sahiplenme hakkı bulunmaz çünkü
        platform tarafından kimlik tespiti yapılmaz.
      </p>

      <h2>5. Garanti Reddi</h2>
      <p>
        Sayılar anonim kullanıcı katkısıyla oluşturulur ve <strong>yatırım,
        hukuki ya da finansal tavsiye değildir</strong>. Maaş pazarlığı, kira
        kararı, üretim teklifi gibi konularda sorumluluğunu kendin alırsın.
      </p>

      <h2>6. Hizmetin Değişmesi / Sonlanması</h2>
      <p>
        Platform, hizmeti dilediği zaman değiştirme veya sonlandırma hakkını
        saklı tutar. Önemli değişiklikler için ana sayfada banner gösterilir.
      </p>

      <h2>7. Yetkili Mahkeme</h2>
      <p>
        Bu şartlardan doğan uyuşmazlıklarda Türkiye Cumhuriyeti yasaları
        uygulanır; İstanbul mahkemeleri yetkilidir.
      </p>
    </article>
  );
}
