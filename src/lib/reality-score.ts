/**
 * Bölge Gerçeklik Skoru — ilan ↔ gerçek farkını 0-100 ölçeğine çevirir.
 *
 * Mantık: şişkinlik (listed - real) / real:
 *   %0 sapma  → 100/100 (ilan = gerçek, mükemmel)
 *   %25 sapma →  72/100 (kabul edilebilir)
 *   %50 sapma →  50/100 (ciddi sapma)
 *   %100+ sapma → 0/100 (ilan gerçeği yansıtmıyor)
 *
 * Negatif şişkinlik (gerçek > ilan) nadir ama mümkün — bu durumda da
 * 100 dönülür çünkü "ilanın altında ödüyor" beklenmedik bir avantaj.
 */

export interface RealityScore {
  score: number; // 0..100
  level: "ok" | "warn" | "bad";
  /** Bir cümlelik özet — UI'da kullanıma hazır */
  message: string;
}

const FALLBACK_K = 1.4; // her %1 şişkinlik → 1.4 puan düşüş (ampirik tuning)

export function computeRealityScore(inflationPct: number | null): RealityScore | null {
  if (inflationPct === null) return null;

  // Negatif şişkinlik = gerçek > ilan, ilan zaten gerçeğin altında
  // Bu beklenmedik bir avantaj, score 100.
  if (inflationPct <= 0) {
    return {
      score: 100,
      level: "ok",
      message: "İlanlar gerçeğin altında ya da eşit — bölge dürüst.",
    };
  }

  const raw = 100 - inflationPct * FALLBACK_K;
  const score = Math.max(0, Math.min(100, Math.round(raw)));

  if (score >= 75) {
    return {
      score,
      level: "ok",
      message: `İlan fiyatları gerçeğin yakınında — şişkinlik dar (%${inflationPct}).`,
    };
  }
  if (score >= 50) {
    return {
      score,
      level: "warn",
      message: `Bölgedeki ilan fiyatları kullanıcı verisinin %${inflationPct} üzerinde — pazarlık alanı var.`,
    };
  }
  return {
    score,
    level: "bad",
    message: `İlanlar gerçeği fena halde şişiriyor (%${inflationPct} üstte). Pazarlık şart.`,
  };
}
