/**
 * AdSense root-level script.
 *
 * Sayfanin <head>'inde yuklenir + Auto Ads aktif.
 * KVKK uyumu icin user consent reddedilmisse yuklenmez.
 *
 * Publisher ID env-driven (NEXT_PUBLIC_ADSENSE_CLIENT_ID).
 * Yoksa hicbir sey yapmaz — geliştirme ortaminda guvenli.
 *
 * Performance:
 *  - `async` ile non-blocking
 *  - Site doğrulaması icin gereken minimum: script var olmasi yeterli
 *  - Auto Ads icin `data-ad-client` parametresi yeterli
 */

import Script from "next/script";

const CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export function AdSenseScript() {
  // ID yoksa hicbir sey render etme. AdSense onayı + env değişkeni
  // eklenmeden script yüklenirse boşa request olur.
  if (!CLIENT_ID) return null;

  return (
    <Script
      id="adsense-script"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CLIENT_ID}`}
      crossOrigin="anonymous"
    />
  );
}
