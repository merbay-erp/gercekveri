"use client";

/**
 * AdSense root-level script.
 *
 * Yayıncı içeriği bulunan rotalarda Auto Ads betiğini yükler.
 * Araç sonucu, ihbar formu ve UGC akışı reklamdan hariç tutulur.
 *
 * Performance:
 *  - `async` ile non-blocking
 *  - Site sahipliği ayrıca root metadata'daki AdSense account etiketiyle doğrulanır
 */

import Script from "next/script";
import { usePathname } from "next/navigation";

// AdSense publisher ID — public bilgi (ads.txt'te de yazili).
// Env override mumkun, fallback hardcoded → Vercel env ihtimali atlayinca
// dahi script yuklenir, AdSense crawler bot her zaman bulur.
const CLIENT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ?? "ca-pub-1903288869126718";

export function AdSenseScript() {
  const pathname = usePathname();
  const isToolScreen =
    pathname.startsWith("/sorgu/") ||
    pathname === "/ihbar" ||
    pathname === "/son-dolandiriciliklar";

  // Arama sonucu, form ve kullanıcı akışı ekranlarında yayıncı içeriği sınırlıdır.
  // Google-served ads bu rotalarda bilinçli olarak yüklenmez.
  if (process.env.NODE_ENV !== "production" || isToolScreen) return null;

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
