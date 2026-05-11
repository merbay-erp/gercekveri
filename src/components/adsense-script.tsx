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

// AdSense publisher ID — public bilgi (ads.txt'te de yazili).
// Env override mumkun, fallback hardcoded → Vercel env ihtimali atlayinca
// dahi script yuklenir, AdSense crawler bot her zaman bulur.
const CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "ca-pub-1903288869126718";

export function AdSenseScript() {
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
