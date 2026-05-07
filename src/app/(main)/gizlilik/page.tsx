import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Gizlilik Politikası — ${siteConfig.name}`,
  description: `${siteConfig.name} platformunda toplanan veriler, kullanım amacı ve kullanıcı hakları.`,
  alternates: { canonical: "/gizlilik" },
};

const LAST_UPDATED = "Mayıs 2026";

export default function GizlilikPage() {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
      <h1>Gizlilik Politikası</h1>
      <p className="text-sm text-muted-foreground">Son güncelleme: {LAST_UPDATED}</p>

      <h2>1. Hangi verileri topluyoruz?</h2>
      <p>
        {siteConfig.name} <strong>anonim</strong> bir veri platformudur. Kullanıcı
        kaydı, hesap, e-posta veya telefon numarası talep etmiyoruz. Bir paylaşım
        oluşturduğunda yalnızca şunlar saklanır:
      </p>
      <ul>
        <li>
          <strong>Paylaşım içeriği:</strong> kategori (maaş/kira/aidat vb.) için
          formda doldurduğun alanlar (tutar, şehir, m², pozisyon adı vb.).
        </li>
        <li>
          <strong>IP adresi hash'i:</strong> spam/suistimal önlemek için tek yönlü
          SHA-256 ile hash'lenir; orijinal IP adresi saklanmaz.
        </li>
        <li>
          <strong>Tarayıcı parmak izi:</strong> User-Agent + Accept-Language
          değerlerinin hash'i. Yine geri çevrilemez.
        </li>
      </ul>
      <p>
        Saklamadığımız: ad-soyad, e-posta, telefon, IBAN, TC kimlik, GPS konum,
        cookie tabanlı kullanıcı kimlikleri.
      </p>

      <h2>2. Bu verileri ne için kullanıyoruz?</h2>
      <ul>
        <li>Kategori başına agregat istatistikler üretmek (medyan, ortalama, dağılım).</li>
        <li>Spam ve aynı IP'den yığın paylaşımı önlemek (24 saatte 10+ paylaşım otomatik bloklanır).</li>
        <li>Outlier tespiti — şehir ortalamasından çok sapan veriler işaretlenir.</li>
      </ul>

      <h2>3. Üçüncü taraflarla veri paylaşımı</h2>
      <ul>
        <li>
          <strong>Hosting:</strong> Vercel (ABD/AB) — Next.js uygulaması.
        </li>
        <li>
          <strong>Veritabanı:</strong> Neon Postgres (Frankfurt, AB).
        </li>
        <li>
          <strong>AI özetler:</strong> Google Gemini API — yalnızca agregat istatistikler
          (median/avg/min/max) gönderilir, asla bireysel paylaşımlar.
        </li>
        <li>
          <strong>Reklam:</strong> Google AdSense — sayfa ziyaretiyle ilgili çerezler
          kullanır (bkz. <a href="/cerez">Çerez Politikası</a>).
        </li>
      </ul>

      <h2>4. Verilerinin silinmesi</h2>
      <p>
        Anonim olduğumuz için bireysel paylaşımları "senin paylaşımın" olarak
        eşleştirmemiz mümkün değildir. Ancak yanlışlıkla ya da haklı sebeple
        belirli bir paylaşımın kaldırılmasını talep edebilirsin — paylaşımdaki{" "}
        <code>publicId</code>'yi belirterek <a href="/iletisim">iletişim</a>{" "}
        sayfasından bize ulaş.
      </p>

      <h2>5. Veri saklama süresi</h2>
      <ul>
        <li>Paylaşım verileri: süresiz (toplulaştırılarak yayında kalır).</li>
        <li>IP/UA hash: spam tespiti için 90 gün (sonrasında null).</li>
        <li>AI özet cache'i: 7 gün, sonra yeniden üretilir.</li>
      </ul>

      <h2>6. Çocukların gizliliği</h2>
      <p>
        Platform 18 yaş üstü kullanıcılar için tasarlanmıştır. Bilinçli olarak
        18 yaş altından veri toplamıyoruz.
      </p>

      <h2>7. Bu politikadaki değişiklikler</h2>
      <p>
        Politika güncellendiğinde "Son güncelleme" tarihi değişir. Önemli değişiklikler
        için ana sayfada banner gösterilir.
      </p>
    </article>
  );
}
