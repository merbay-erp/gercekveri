/**
 * Per-scope güven skoru — bir kategori sayfası ya da şehir agregat
 * sayfası için "bu rakamlara ne kadar güvenebilirsin?" skoru çıkarır.
 *
 * Score (0-100):
 *  - Volume: kaç paylaşım var?
 *  - Recency: en yeni paylaşım ne kadar taze?
 *  - Diversity: kaç farklı IP'den geldi (tek bir kişi sürekli paylaşmamış)?
 *  - Outlier rate: low-quality submissions oranı (varsa)
 *
 * Floors at 30 (we never publish "0/100" — even thin data has *some*
 * signal). Ceilings at 100 (large, fresh, diverse, clean → max).
 */

export interface TrustScoreFactor {
  /** İşaretsiz ekran etiketi */
  label: string;
  /** Durum — UI tone'lar bunu kullanır */
  status: "ok" | "warn" | "bad";
  /** Detay açıklaması */
  detail: string;
  /** Skora etkisi (negatif) — hesaplama transparency için */
  delta: number;
}

export interface TrustScore {
  score: number;
  level: "high" | "mid" | "low";
  factors: TrustScoreFactor[];
}

export interface TrustScoreInput {
  count: number;
  /** Number of distinct ipHash values among the count above */
  distinctIpHashes: number;
  /** ISO date or Date — most recent submission timestamp */
  latestSubmissionAt: Date | null;
  /** 0..1 — fraction of submissions with qualityScore < 30 (optional) */
  outlierRatio?: number;
}

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function computeTrustScore(input: TrustScoreInput): TrustScore {
  let score = 100;
  const factors: TrustScoreFactor[] = [];

  // Volume — single dominant signal
  if (input.count >= 50) {
    factors.push({
      label: `${input.count} paylaşım`,
      status: "ok",
      detail: "Yeterli veri yoğunluğu — medyan istikrarlı.",
      delta: 0,
    });
  } else if (input.count >= 20) {
    score -= 10;
    factors.push({
      label: `${input.count} paylaşım`,
      status: "ok",
      detail: "Veri yeterli; her yeni paylaşımla doğruluk artıyor.",
      delta: -10,
    });
  } else if (input.count >= 10) {
    score -= 20;
    factors.push({
      label: `${input.count} paylaşım`,
      status: "warn",
      detail: "Sınırlı veri — yön doğru, ama medyan biraz oynak olabilir.",
      delta: -20,
    });
  } else if (input.count >= 3) {
    score -= 35;
    factors.push({
      label: `${input.count} paylaşım`,
      status: "warn",
      detail: "Az veri — yön gösterici, kesin sayı olarak değerlendirme.",
      delta: -35,
    });
  } else {
    score -= 55;
    factors.push({
      label: `${input.count} paylaşım`,
      status: "bad",
      detail: "Çok az veri — istatistik anlamlı değil, gösterilmemeli.",
      delta: -55,
    });
  }

  // Recency
  if (input.latestSubmissionAt) {
    const ageDays = Math.floor(
      (Date.now() - input.latestSubmissionAt.getTime()) / ONE_DAY_MS,
    );
    if (ageDays <= 7) {
      factors.push({
        label: "Son 7 gün içinde güncel",
        status: "ok",
        detail: `En yeni paylaşım ${ageDays} gün önce.`,
        delta: 0,
      });
    } else if (ageDays <= 30) {
      score -= 5;
      factors.push({
        label: "Son 30 gün içinde güncel",
        status: "ok",
        detail: `En yeni paylaşım ${ageDays} gün önce.`,
        delta: -5,
      });
    } else if (ageDays <= 90) {
      score -= 15;
      factors.push({
        label: "Veri biraz eski",
        status: "warn",
        detail: `En yeni paylaşım ${ageDays} gün önce — piyasa değişmiş olabilir.`,
        delta: -15,
      });
    } else {
      score -= 25;
      factors.push({
        label: "Veri eski",
        status: "bad",
        detail: `En yeni paylaşım ${ageDays} gün önce.`,
        delta: -25,
      });
    }
  } else if (input.count > 0) {
    score -= 15;
    factors.push({
      label: "Tarih bilgisi yok",
      status: "warn",
      detail: "Paylaşım tarihi okunamadı.",
      delta: -15,
    });
  }

  // Diversity — distinct IP ratio (only when we have enough rows for this
  // to mean anything; below 3 it's noise).
  if (input.count >= 3) {
    const ratio = input.distinctIpHashes / input.count;
    if (ratio >= 0.5) {
      factors.push({
        label: "Çoklu kaynak doğrulaması",
        status: "ok",
        detail: `${input.distinctIpHashes} farklı kaynaktan veri — tek elden gelmemiş.`,
        delta: 0,
      });
    } else if (ratio >= 0.25) {
      score -= 5;
      factors.push({
        label: "Orta kaynak çeşitliliği",
        status: "warn",
        detail: `${input.distinctIpHashes} farklı kaynak — bazıları tekrarlı.`,
        delta: -5,
      });
    } else {
      score -= 15;
      factors.push({
        label: "Düşük kaynak çeşitliliği",
        status: "bad",
        detail: `Sadece ${input.distinctIpHashes} farklı kaynak — tek el etkisi olabilir.`,
        delta: -15,
      });
    }
  }

  // Outlier rate — penalty when many submissions have low qualityScore
  if (typeof input.outlierRatio === "number" && input.count >= 3) {
    if (input.outlierRatio >= 0.2) {
      score -= 10;
      factors.push({
        label: `%${Math.round(input.outlierRatio * 100)} aykırı veri`,
        status: "bad",
        detail: "Şehir ortalamasından sapan paylaşım oranı yüksek.",
        delta: -10,
      });
    } else if (input.outlierRatio > 0) {
      factors.push({
        label: `%${Math.round(input.outlierRatio * 100)} aykırı veri`,
        status: "ok",
        detail: "Aykırı paylaşım oranı normal.",
        delta: 0,
      });
    }
  }

  // Floor + ceiling
  if (score < 30) score = 30;
  if (score > 100) score = 100;

  const level: TrustScore["level"] =
    score >= 75 ? "high" : score >= 55 ? "mid" : "low";

  return { score, level, factors };
}
