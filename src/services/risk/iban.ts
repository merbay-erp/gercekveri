import type { ScanResult, Signal } from "./types";

// =============================================================================
// IBAN risk taraması — deterministik (mod-97 + banka kodu). İtibar tamamen
// halk ihbarından gelir; geçerli bir IBAN "güvenli" demek DEĞİLDİR (sadece
// biçimsel olarak doğru). Bu yüzden registry'de reputationOnly=true.
// =============================================================================

// TR EFT banka kodu (5 hane) → banka adı. En yaygın bankalar.
const BANKS: Record<string, string> = {
  "00010": "Ziraat Bankası",
  "00012": "Halkbank",
  "00015": "VakıfBank",
  "00032": "TEB",
  "00046": "Akbank",
  "00059": "Şekerbank",
  "00062": "Garanti BBVA",
  "00064": "İş Bankası",
  "00067": "Yapı Kredi",
  "00092": "Citibank",
  "00099": "ING",
  "00103": "Fibabanka",
  "00111": "QNB (Finansbank)",
  "00123": "HSBC",
  "00124": "Alternatifbank",
  "00125": "Burgan Bank",
  "00134": "Denizbank",
  "00143": "Odeabank",
  "00146": "Odea/Diğer",
  "00203": "Albaraka Türk",
  "00205": "Kuveyt Türk",
  "00206": "Türkiye Finans",
  "00209": "Ziraat Katılım",
  "00210": "Vakıf Katılım",
  "00211": "Emlak Katılım",
  "00800": "Papara",
  "00827": "Enpara",
};

export function normalizeIban(raw: string): string | null {
  const s = (raw ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!s) return null;
  if (!/^TR\d{2,}$/.test(s)) {
    // TR ile başlamıyorsa ama 24 hane ise TR ekle (kullanıcı TR yazmamış olabilir)
    if (/^\d{24}$/.test(s)) return `TR${s}`;
    return null;
  }
  return s;
}

function ibanValid(iban: string): boolean {
  if (!/^TR\d{24}$/.test(iban)) return false;
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let numeric = "";
  for (const ch of rearranged) {
    numeric += ch >= "A" && ch <= "Z" ? (ch.charCodeAt(0) - 55).toString() : ch;
  }
  let rem = 0;
  for (let i = 0; i < numeric.length; i++) {
    rem = (rem * 10 + (numeric.charCodeAt(i) - 48)) % 97;
  }
  return rem === 1;
}

export function formatIban(iban: string): string {
  return iban.replace(/(.{4})/g, "$1 ").trim();
}

export function scanIban(key: string): ScanResult {
  const signals: Signal[] = [];
  const valid = ibanValid(key);

  signals.push(
    valid
      ? { icon: "checkbox", label: "IBAN biçimi", value: "Geçerli (mod-97)", status: "good", pill: "Geçerli", weight: 0 }
      : { icon: "checkbox", label: "IBAN biçimi", value: "Geçersiz / hatalı", status: "bad", pill: "Geçersiz", weight: 35 },
  );

  if (valid) {
    const code = key.slice(4, 9);
    const bank = BANKS[code];
    signals.push({
      icon: "building-bank",
      label: "Banka",
      value: bank ?? `Tespit edilemedi (${code})`,
      status: bank ? "info" : "warn",
      pill: bank ? "Bilgi" : "Bilinmiyor",
      weight: bank ? 0 : 6,
    });
  }

  // Skor query katmanında halk ihbarıyla birleşir; bant reputationOnly ile UNKNOWN olabilir.
  const base = signals.reduce((s, x) => s + x.weight, 8);
  const score = Math.max(0, Math.min(100, base));
  return { signals, score, band: "UNKNOWN", scannedAt: new Date().toISOString() };
}
