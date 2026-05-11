"use client";

/**
 * KVKK + Google AdSense GDPR uyumlu çerez onay banneri.
 *
 * Davranış:
 * - İlk ziyarette sayfanın altında kayar (bottom slide-in)
 * - Kullanıcı seçim yapana kadar görünür
 * - 3 seçenek: "Tümünü Kabul" / "Sadece Zorunlu" / "Tercihler" (cerez sayfası)
 * - localStorage'da seçim saklanır (NO server-side fingerprint)
 * - Kabul edilirse window.adsbygoogle yüklenir (zaten yüklü, request consent)
 * - Reddedilirse AdSense kişiselleştirilmemiş reklam moduna geçer (npa=1)
 *
 * AdSense uyumluluk: Google Consent Mode v2 kullanılır (gtag).
 * Türkiye için KVKK uyumu da gerekiyor (Aydınlatma + Açık Rıza).
 */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, Check, Settings2 } from "lucide-react";

const STORAGE_KEY = "gercekveri.consent.v1";

type ConsentChoice = "all" | "essential" | "pending";

interface ConsentState {
  choice: ConsentChoice;
  timestamp: number;
}

export function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [choice, setChoice] = useState<ConsentChoice>("pending");

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as ConsentState;
        if (parsed.choice === "all" || parsed.choice === "essential") {
          setChoice(parsed.choice);
          applyConsent(parsed.choice);
        }
      }
    } catch {
      // localStorage devre dışı / korumalı — banner göster
    }
  }, []);

  const handle = (next: "all" | "essential") => {
    setChoice(next);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ choice: next, timestamp: Date.now() }),
      );
    } catch {
      /* sessiz */
    }
    applyConsent(next);
  };

  // SSR mismatch'i önle — sadece client'ta render et.
  if (!mounted) return null;
  if (choice !== "pending") return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 shadow-lg backdrop-blur-sm"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div>
              <h3
                id="cookie-consent-title"
                className="text-sm font-semibold"
              >
                Çerezler ve reklam tercihleri
              </h3>
              <p
                id="cookie-consent-desc"
                className="mt-1 text-xs text-muted-foreground"
              >
                Bu site, hizmetleri geliştirmek için zorunlu çerezler ve
                Google AdSense reklamları kullanır. KVKK kapsamında onayınızı
                yönetebilirsiniz.{" "}
                <Link
                  href="/cerez"
                  className="underline-offset-2 hover:underline"
                >
                  Detaylı bilgi
                </Link>
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/cerez"
              className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            >
              <Settings2 className="h-3.5 w-3.5" />
              Tercihler
            </Link>
            <button
              onClick={() => handle("essential")}
              className="inline-flex items-center rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-muted/50"
            >
              Sadece zorunlu
            </button>
            <button
              onClick={() => handle("all")}
              className="inline-flex items-center gap-1 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:opacity-90"
            >
              <Check className="h-3.5 w-3.5" />
              Tümünü kabul et
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Google Consent Mode v2 sinyalleri.
 *
 * AdSense bu sinyalleri okur:
 * - ad_storage: reklam çerezleri
 * - ad_user_data: reklam icin user data
 * - ad_personalization: kisisellestirilmis reklam
 *
 * Reddedildi halde non-personalized ads (NPA) gosterir → kanunen guvenli +
 * AdSense reklamlari calismaya devam eder (sadece kisisellestirilmemis).
 */
function applyConsent(choice: "all" | "essential") {
  if (typeof window === "undefined") return;

  // gtag/dataLayer mevcut degilse pas — AdSense kendi sinyalleri ile calisir.
  type GtagWindow = Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  const w = window as GtagWindow;
  w.dataLayer = w.dataLayer ?? [];

  const consentSignal =
    choice === "all"
      ? {
          ad_storage: "granted",
          ad_user_data: "granted",
          ad_personalization: "granted",
          analytics_storage: "granted",
        }
      : {
          ad_storage: "denied",
          ad_user_data: "denied",
          ad_personalization: "denied",
          analytics_storage: "denied",
        };

  // Consent Mode v2 — gtag varsa çağır, yoksa dataLayer'a push et.
  if (typeof w.gtag === "function") {
    w.gtag("consent", "update", consentSignal);
  } else {
    w.dataLayer.push(["consent", "update", consentSignal]);
  }
}
