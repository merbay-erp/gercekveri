import type { ScanResult, Signal } from "./types";

// =============================================================================
// Telefon risk taraması — hat türü (deterministik) + halk ihbarı. Numaranın
// "kime ait" olduğunu bilemeyiz; itibar ihbardan gelir → reputationOnly=true.
// 0850/444/0900 gibi santral hatları dolandırıcı çağrı merkezlerinde sık
// kullanıldığından hafif uyarı verir (ama tek başına suçlama değildir).
// =============================================================================

// 10 haneli ulusal numara döner ("5XXXXXXXXX" / "2XXXXXXXXX") ya da 444 için "444XXXX".
export function normalizePhone(raw: string): string | null {
  let d = (raw ?? "").replace(/\D/g, "");
  if (!d) return null;
  if (d.startsWith("0090")) d = d.slice(4);
  else if (d.startsWith("90") && d.length >= 12) d = d.slice(2);
  else if (d.startsWith("0") && d.length >= 11) d = d.slice(1);
  if (d.startsWith("444") && d.length === 7) return d; // kurumsal kısa hat
  if (d.length !== 10) return null;
  return d;
}

export function formatPhone(key: string): string {
  if (key.length === 7) return `${key.slice(0, 3)} ${key.slice(3, 5)} ${key.slice(5)}`;
  return `0${key.slice(0, 3)} ${key.slice(3, 6)} ${key.slice(6, 8)} ${key.slice(8)}`;
}

const CITY_CODES: Record<string, string> = {
  "212": "İstanbul (Avrupa)",
  "216": "İstanbul (Anadolu)",
  "312": "Ankara",
  "232": "İzmir",
  "224": "Bursa",
  "242": "Antalya",
  "322": "Adana",
};

function lineType(key: string): Signal {
  if (key.length === 7 && key.startsWith("444")) {
    return { icon: "phone", label: "Hat türü", value: "Kurumsal kısa hat (444)", status: "info", pill: "Kurumsal", weight: 4 };
  }
  const area = key.slice(0, 3);
  if (key.startsWith("5")) {
    return { icon: "phone", label: "Hat türü", value: "Cep telefonu (GSM)", status: "info", pill: "Mobil", weight: 0 };
  }
  if (area === "850") {
    return { icon: "phone", label: "Hat türü", value: "Sanal santral (0850)", status: "warn", pill: "Dikkat", weight: 8 };
  }
  if (area === "800") {
    return { icon: "phone", label: "Hat türü", value: "Ücretsiz hat (0800)", status: "info", pill: "Ücretsiz", weight: 0 };
  }
  if (area === "900") {
    return { icon: "phone", label: "Hat türü", value: "Katma değerli hat (0900)", status: "warn", pill: "Dikkat", weight: 10 };
  }
  const city = CITY_CODES[area];
  return {
    icon: "phone",
    label: "Hat türü",
    value: city ? `Sabit hat — ${city}` : "Sabit hat",
    status: "info",
    pill: "Sabit",
    weight: 0,
  };
}

export function scanPhone(key: string): ScanResult {
  const signals: Signal[] = [lineType(key)];
  const base = signals.reduce((s, x) => s + x.weight, 8);
  const score = Math.max(0, Math.min(100, base));
  return { signals, score, band: "UNKNOWN", scannedAt: new Date().toISOString() };
}
