import type { ScanResult, Signal } from "./types";
import { scanWeb } from "./web";
import { scoreFromSignals } from "./score";

// =============================================================================
// İlan risk taraması — pazaryeri bağlantısı odaklı. Bilinen platform mu, sahte/
// bilinmeyen site mi? Bilinmeyense alan adı web motoruyla taranır. Satıcı riski
// platformdan bağımsız olduğundan her ilan için "satıcıyı doğrula" uyarısı verilir.
// Anahtar = host + path (her ilan kendi kaydı; aynı sahte siteye gelen ihbarlar
// host üzerinden değil tam yol üzerinden birikir).
// =============================================================================

// Bilinen meşru pazaryerleri (host → görünen ad).
const MARKETPLACES: Record<string, string> = {
  "sahibinden.com": "Sahibinden",
  "hepsiemlak.com": "Hepsiemlak",
  "emlakjet.com": "Emlakjet",
  "arabam.com": "Arabam.com",
  "dolap.com": "Dolap",
  "gardrops.com": "Gardrops",
  "letgo.com": "letgo",
  "n11.com": "n11",
  "trendyol.com": "Trendyol",
  "hepsiburada.com": "Hepsiburada",
  "amazon.com.tr": "Amazon TR",
  "ciceksepeti.com": "Çiçeksepeti",
  "gittigidiyor.com": "GittiGidiyor",
  "vatanbilgisayar.com": "Vatan Bilgisayar",
  "teknosa.com": "Teknosa",
};

// Sosyal medya / mesajlaşma — meşru ama ilan dolandırıcılığında yüksek risk.
const SOCIAL: Record<string, string> = {
  "instagram.com": "Instagram",
  "facebook.com": "Facebook",
  "fb.com": "Facebook",
  "t.me": "Telegram",
  "wa.me": "WhatsApp",
};

export function normalizeListing(raw: string): string | null {
  let s = (raw ?? "").trim().toLowerCase();
  if (!s) return null;
  s = s.replace(/^https?:\/\//, "").replace(/^www\./, "");
  s = s.split("#")[0]!.split("?")[0]!;
  const slash = s.indexOf("/");
  const host = (slash === -1 ? s : s.slice(0, slash)).replace(/:.*$/, "");
  let path = slash === -1 ? "" : s.slice(slash);
  path = path.replace(/\/+$/, "");
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(host) || host.includes("..")) return null;
  return host + path;
}

export function formatListing(key: string): string {
  return key.length > 60 ? `${key.slice(0, 57)}…` : key;
}

const SELLER_WARNING: Signal = {
  icon: "alert-triangle",
  label: "Satıcı riski",
  value: "Platformdan bağımsız",
  status: "warn",
  pill: "Doğrula",
  weight: 6,
};

export async function scanListing(key: string): Promise<ScanResult> {
  const host = key.split("/")[0]!;
  const market = MARKETPLACES[host];
  const social = SOCIAL[host];
  const scannedAt = new Date().toISOString();

  if (market) {
    const signals: Signal[] = [
      { icon: "tag", label: "Pazaryeri", value: `${market} — tanınan platform`, status: "good", pill: "Tanınıyor", weight: 0 },
      SELLER_WARNING,
    ];
    return { signals, score: scoreFromSignals(signals), band: "SAFE", scannedAt };
  }

  if (social) {
    const signals: Signal[] = [
      { icon: "tag", label: "Kaynak", value: `${social} — sosyal medya satışı`, status: "warn", pill: "Riskli", weight: 22 },
      { icon: "alert-triangle", label: "Satıcı riski", value: "Sosyal medyada satıcı koruması yok", status: "warn", pill: "Dikkat", weight: 6 },
    ];
    return { signals, score: scoreFromSignals(signals), band: "SUSPICIOUS", scannedAt };
  }

  // Bilinmeyen platform → alan adını web motoruyla tara + "tanınmayan site" işareti.
  const web = await scanWeb(host);
  const signals: Signal[] = [
    { icon: "tag", label: "Pazaryeri", value: "Tanınmayan / şüpheli site", status: "bad", pill: "Şüpheli", weight: 28 },
    ...web.signals,
  ];
  const score = scoreFromSignals(signals);
  return { signals, score, band: score >= 70 ? "DANGER" : "SUSPICIOUS", scannedAt };
}
