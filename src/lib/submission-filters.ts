/**
 * Submission tablosu için ortak filter pattern'ları.
 *
 * Public sayfalar DEMO seed'lerini gizler ama official referans veriyi
 * (TCMB, TUIK, EPDK) gösterir. Admin panel her şeyi görür — orada
 * filter kullanılmaz.
 */

/** Public-facing query'lerin baz filter'ı: DEMO hariç tüm onaylı satırlar. */
export const PUBLIC_SUBMISSION_FILTER = {
  status: "APPROVED" as const,
  NOT: { source: "DEMO" },
};

/** Sadece gerçek kullanıcı paylaşımları (resmi referans dahil değil) */
export const USER_ONLY_FILTER = {
  status: "APPROVED" as const,
  source: "USER",
};

/** Sadece resmi referans (TCMB / TÜİK / EPDK) */
export const OFFICIAL_ONLY_FILTER = {
  status: "APPROVED" as const,
  source: { in: ["TCMB", "TUIK", "EPDK"] },
};

/** "Real activity" sayılan paylaşımlar — recent-activity panellerinde
 *  yalnızca USER kabul edilir (resmi referans aktivite sayılmaz). */
export const REAL_ACTIVITY_FILTER = USER_ONLY_FILTER;
