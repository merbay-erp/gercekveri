import type { Metadata } from "next";

import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Çerez Politikası — ${siteConfig.name}`,
  description: `${siteConfig.name} platformunda kullanılan çerezler ve amaçları.`,
  alternates: { canonical: "/cerez" },
};

const LAST_UPDATED = "Mayıs 2026";

export default function CerezPage() {
  return (
    <article className="container mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
      <h1>Çerez Politikası</h1>
      <p className="text-sm text-muted-foreground">Son güncelleme: {LAST_UPDATED}</p>

      <p>
        {siteConfig.name} platformu, kullanıcı kimliğine bağlı çerez{" "}
        <strong>kullanmaz</strong>; çünkü hesap / oturum sistemimiz yok. Aşağıdaki
        teknik çerezler işletim için gerekli olduğundan oluşturulur:
      </p>

      <h2>1. Zorunlu Çerezler</h2>
      <ul>
        <li>
          <code>theme</code> — koyu/açık tema tercihini hatırlamak için (next-themes).
          Asla sunucuya gönderilmez, yalnızca tarayıcıda saklanır.
        </li>
        <li>
          <code>gv_admin</code> — yalnızca <code>/admin</code> paneline giriş
          yapan yöneticide oluşur. httpOnly + signed JWT, 12 saat. Normal kullanıcıda
          oluşmaz.
        </li>
      </ul>

      <h2>2. Üçüncü Taraf Çerezleri</h2>
      <ul>
        <li>
          <strong>Google AdSense</strong> — sayfada reklam alanları varsa{" "}
          <code>__gads</code>, <code>NID</code> gibi çerezler oluşturabilir.
          AdSense'in kendi çerez politikası uygulanır:{" "}
          <a
            href="https://policies.google.com/technologies/ads"
            target="_blank"
            rel="noreferrer"
          >
            policies.google.com/technologies/ads
          </a>
        </li>
        <li>
          <strong>Vercel Analytics</strong> — sayfa görüntüleme sayısını anonim
          olarak ölçer. Kullanıcı kimliğine bağlı veri toplamaz.
        </li>
      </ul>

      <h2>3. Çerezleri Devre Dışı Bırakmak</h2>
      <p>
        Tarayıcı ayarlarından çerezleri devre dışı bırakabilirsin. Tema tercihi
        kaybolur, AdSense kişiselleştirilmiş reklam göstermez (genel reklamlar yine
        gösterilir). Veri paylaşımı için zorunlu bir çerez yoktur.
      </p>

      <h2>4. AdSense / Reklam Tercihleri</h2>
      <p>
        Google'ın kullandığı reklam çerezlerini yönetmek için:{" "}
        <a
          href="https://www.google.com/settings/ads"
          target="_blank"
          rel="noreferrer"
        >
          google.com/settings/ads
        </a>
      </p>
    </article>
  );
}
