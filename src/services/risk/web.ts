import type { ScanResult, Signal } from "./types";
import { bandForScore, scoreFromSignals } from "./score";

// =============================================================================
// Web sitesi (domain) risk taraması — TAMAMI ÜCRETSİZ, anahtarsız kaynaklar.
// RDAP (domain yaşı) · Cloudflare DoH (MX/DMARC) · Wayback CDX (ilk görülme)
// · ipwho.is (barındırma ülkesi) · Google Cloud Web Risk (varsa anahtar).
// Her kaynak bağımsız, zaman-aşımlı ve hata-toleranslı; biri düşse tarama sürer.
// =============================================================================

const UA = "GercekVeri-RiskBot/1.0 (+https://gercekveri.com)";

// Domain normalleştirme — sorgu/önbellek anahtarı için kanonik biçim.
// "https://WWW.Site.com/yol?x=1" → "site.com". Geçersizse null.
export function normalizeDomain(input: string): string | null {
  let s = (input ?? "").trim().toLowerCase();
  if (!s) return null;
  s = s.replace(/^https?:\/\//, "").replace(/^www\./, "");
  s = s.split("/")[0]!.split("?")[0]!.split("#")[0]!.split(":")[0]!;
  s = s.replace(/\.+$/, "");
  if (s.length < 4 || s.length > 253) return null;
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(s)) return null;
  if (s.includes("..")) return null;
  return s;
}

async function getJson(url: string, opts: RequestInit = {}, timeoutMs = 6000): Promise<unknown | null> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...opts,
      signal: ctrl.signal,
      headers: { "user-agent": UA, accept: "application/json", ...(opts.headers ?? {}) },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(t);
  }
}

function daysSince(iso: string): number | null {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return null;
  return Math.floor((Date.now() - t) / 86_400_000);
}

function fmtAge(days: number): string {
  if (days < 1) return "bugün";
  if (days < 45) return `${days} gün`;
  if (days < 730) return `${Math.round(days / 30)} ay`;
  return `${Math.round(days / 365)} yıl`;
}

// --- RDAP: domain yaşı (en güçlü tek sinyal) ---------------------------------
async function signalDomainAge(domain: string): Promise<Signal> {
  const data = (await getJson(`https://rdap.org/domain/${domain}`)) as
    | { events?: Array<{ eventAction?: string; eventDate?: string }> }
    | null;
  const reg = data?.events?.find((e) => e.eventAction === "registration")?.eventDate;
  const age = reg ? daysSince(reg) : null;
  if (age === null) {
    return { icon: "calendar", label: "Domain yaşı", value: "Tespit edilemedi", status: "info", pill: "Bilinmiyor", weight: 6 };
  }
  if (age < 14) return { icon: "calendar", label: "Domain yaşı", value: fmtAge(age), status: "bad", pill: "Çok yeni", weight: 42 };
  if (age < 90) return { icon: "calendar", label: "Domain yaşı", value: fmtAge(age), status: "warn", pill: "Yeni", weight: 22 };
  if (age < 365) return { icon: "calendar", label: "Domain yaşı", value: fmtAge(age), status: "info", pill: "Genç", weight: 8 };
  return { icon: "calendar", label: "Domain yaşı", value: fmtAge(age), status: "good", pill: "Köklü", weight: 0 };
}

// --- DoH: MX kaydı (gerçek işletme mail altyapısı) ---------------------------
async function signalMail(domain: string): Promise<Signal> {
  const data = (await getJson(
    `https://cloudflare-dns.com/dns-query?name=${domain}&type=MX`,
    { headers: { accept: "application/dns-json" } },
  )) as { Answer?: Array<{ type: number }> } | null;
  const hasMx = !!data?.Answer?.some((a) => a.type === 15);
  return hasMx
    ? { icon: "mail", label: "Mail altyapısı", value: "MX kaydı var", status: "good", pill: "Var", weight: 0 }
    : { icon: "mail", label: "Mail altyapısı", value: "MX kaydı yok", status: "warn", pill: "Eksik", weight: 12 };
}

// --- DoH: DMARC (kurumsallık) ------------------------------------------------
async function signalDmarc(domain: string): Promise<Signal> {
  const data = (await getJson(
    `https://cloudflare-dns.com/dns-query?name=_dmarc.${domain}&type=TXT`,
    { headers: { accept: "application/dns-json" } },
  )) as { Answer?: Array<{ data?: string }> } | null;
  const has = !!data?.Answer?.some((a) => (a.data ?? "").toLowerCase().includes("v=dmarc1"));
  return has
    ? { icon: "shield-check", label: "DMARC politikası", value: "Tanımlı", status: "good", pill: "Tam", weight: 0 }
    : { icon: "shield-check", label: "DMARC politikası", value: "Yok", status: "warn", pill: "Eksik", weight: 6 };
}

// --- Wayback CDX: ilk arşiv kaydı (geçmiş = güven) ---------------------------
async function signalHistory(domain: string): Promise<Signal> {
  const data = (await getJson(
    `https://web.archive.org/cdx/search/cdx?url=${domain}&output=json&limit=1&fl=timestamp`,
  )) as string[][] | null;
  const ts = Array.isArray(data) && data[1]?.[0];
  if (!ts || ts.length < 8) {
    return { icon: "history", label: "İnternet geçmişi", value: "Arşiv kaydı yok", status: "warn", pill: "Geçmişsiz", weight: 10 };
  }
  const iso = `${ts.slice(0, 4)}-${ts.slice(4, 6)}-${ts.slice(6, 8)}`;
  const age = daysSince(iso);
  if (age === null) return { icon: "history", label: "İnternet geçmişi", value: "Bilinmiyor", status: "info", pill: "Bilinmiyor", weight: 0 };
  if (age < 90) return { icon: "history", label: "İnternet geçmişi", value: `İlk kayıt: ${fmtAge(age)} önce`, status: "warn", pill: "Yeni", weight: 8 };
  return { icon: "history", label: "İnternet geçmişi", value: `İlk kayıt: ${fmtAge(age)} önce`, status: "good", pill: "Köklü", weight: 0 };
}

// --- ipwho.is: barındırma ülkesi --------------------------------------------
async function signalHosting(domain: string): Promise<Signal> {
  const dns = (await getJson(
    `https://cloudflare-dns.com/dns-query?name=${domain}&type=A`,
    { headers: { accept: "application/dns-json" } },
  )) as { Answer?: Array<{ type: number; data?: string }> } | null;
  const ip = dns?.Answer?.find((a) => a.type === 1)?.data;
  if (!ip) return { icon: "server", label: "Barındırma", value: "Çözümlenemedi", status: "warn", pill: "Yok", weight: 10 };
  const geo = (await getJson(`https://ipwho.is/${ip}`)) as
    | { success?: boolean; country?: string; country_code?: string }
    | null;
  if (!geo?.success) return { icon: "server", label: "Barındırma", value: ip, status: "info", pill: "Bilinmiyor", weight: 0 };
  const tr = geo.country_code === "TR";
  return {
    icon: "server",
    label: "Barındırma",
    value: geo.country ?? geo.country_code ?? ip,
    status: tr ? "good" : "info",
    pill: tr ? "Yerel" : "Yurt dışı",
    weight: tr ? 0 : 6,
  };
}

// --- Google Cloud Web Risk (ticari kullanıma uygun Lookup API) ---------------
async function signalBlacklist(domain: string): Promise<Signal> {
  const key = process.env.GOOGLE_WEB_RISK_API_KEY;
  if (!key) {
    return { icon: "ban", label: "Web Risk", value: "Anahtar tanımlı değil", status: "info", pill: "Atlandı", weight: 0 };
  }

  const lookup = async (uri: string) => {
    const params = new URLSearchParams({ uri, key });
    params.append("threatTypes", "MALWARE");
    params.append("threatTypes", "SOCIAL_ENGINEERING");
    params.append("threatTypes", "UNWANTED_SOFTWARE");
    return (await getJson(`https://webrisk.googleapis.com/v1/uris:search?${params}`)) as
      | { threat?: { threatTypes?: string[] } }
      | null;
  };

  const [httpResult, httpsResult] = await Promise.all([
    lookup(`http://${domain}`),
    lookup(`https://${domain}`),
  ]);
  const flagged = [httpResult, httpsResult].some(
    (result) => (result?.threat?.threatTypes?.length ?? 0) > 0,
  );
  return flagged
    ? { icon: "ban", label: "Web Risk", value: "Tehdit listesinde eşleşme", status: "bad", pill: "Tehlikeli", weight: 45 }
    : { icon: "ban", label: "Web Risk", value: "Eşleşme bulunmadı", status: "good", pill: "Eşleşme yok", weight: 0 };
}

/** Bir domaini paralel ücretsiz sinyallerle tarar → skor + bant. */
export async function scanWeb(domain: string): Promise<ScanResult> {
  const results = await Promise.allSettled([
    signalDomainAge(domain),
    signalBlacklist(domain),
    signalHistory(domain),
    signalHosting(domain),
    signalMail(domain),
    signalDmarc(domain),
  ]);
  const signals = results
    .filter((r): r is PromiseFulfilledResult<Signal> => r.status === "fulfilled")
    .map((r) => r.value);
  const score = scoreFromSignals(signals);
  return { signals, score, band: bandForScore(score, signals.length > 0), scannedAt: new Date().toISOString() };
}
