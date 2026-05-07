/**
 * Türkiye'de yayınlanmış resmi/açık veri referansları.
 *
 * Önemli: Bu dosya MANUAL CURATED bir snapshot. Sayılar ilgili kurumların
 * son public yayınlarından + makul enflasyon projeksiyonu ile kalibre
 * edildi. Otomatik güncelleme yok; TCMB EVDS API key alındıktan sonra
 * cron ile auto-refresh devreye girer (`lib/tcmb-evds.ts`).
 *
 * Veri ne için kullanılır?
 *  - Resmi vs Gerçek panel'i: kullanıcı verisi vs resmi sayı kıyas
 *  - Heatmap'in iskeleti (ilk gerçek user paylaşımları gelmeden önce)
 *  - "TÜİK diyor X / kullanıcı diyor Y" viral hikayesi
 *
 * Şeffaflık:
 *  - Her satır {source, sourceLabel, sourceUrl, referenceDate, methodology}
 *    ile etiketli, public sayfada kaynak gösterilir
 *  - Sayı tahmini ise "tahmin" işareti taşır
 */

export type OfficialSourceCode = "TCMB" | "TUIK" | "EPDK" | "MEB" | "BOTAS";

export interface OfficialReference {
  source: OfficialSourceCode;
  type: "SALARY" | "RENT" | "UTILITY";
  /** Filtreleme için scope alanları — module-spesifik */
  scope: {
    citySlug?: string;
    positionSlug?: string;
    utilityType?: "ELEKTRIK" | "DOGALGAZ" | "SU";
    // Kira için ek meta
    roomCount?: string;
  };
  /** Ana sayı (TL veya birim cinsinden). Aylık değer / kademeli tarife birim. */
  amount: number;
  /** Type-spesifik ek payload — Submission.data alanına yazılır */
  data: Record<string, unknown>;
  /** "2024-Q4", "2025", "2026-03" gibi referans periyodu */
  referenceDate: string;
  /** UI'da gösterilecek kısa kaynak adı */
  sourceLabel: string;
  /** Kaynak URL (mümkünse public publication) */
  sourceUrl: string;
  /** Sayının nasıl elde edildiğini özetler (tahmin / direct / aktif endeks) */
  methodology: "direct" | "projected" | "interpolated";
}

const TUIK_HBA = {
  source: "TUIK" as const,
  sourceLabel: "TÜİK Hanehalkı Bütçe Anketi",
  sourceUrl:
    "https://data.tuik.gov.tr/Kategori/GetKategori?p=gelir-yasam-tuketim-ve-yoksulluk-107",
  referenceDate: "2024-yıllık (yayın 2025-12)",
  methodology: "projected" as const,
};

const TCMB_KFE = {
  source: "TCMB" as const,
  sourceLabel: "TCMB Konut Fiyat Endeksi (KFE)",
  sourceUrl: "https://evds2.tcmb.gov.tr/index.php?/evds/serieMarket",
  referenceDate: "2025-Q4",
  methodology: "projected" as const,
};

const TUIK_ISGUCU = {
  source: "TUIK" as const,
  sourceLabel: "TÜİK İşgücü ve Kazanç İstatistikleri",
  sourceUrl: "https://data.tuik.gov.tr/Kategori/GetKategori?p=istihdam-issizlik-ve-ucret-108",
  referenceDate: "2024-Q4",
  methodology: "projected" as const,
};

const EPDK_TARIFE = {
  source: "EPDK" as const,
  sourceLabel: "EPDK Konut Tarifesi",
  sourceUrl: "https://www.epdk.gov.tr/Detay/Icerik/3-0-23/elektrik-tarifeleri",
  referenceDate: "2026-Q1",
  methodology: "direct" as const,
};

const BOTAS_TARIFE = {
  source: "BOTAS" as const,
  sourceLabel: "BOTAŞ Konut Doğalgaz Tarifesi",
  sourceUrl: "https://www.botas.gov.tr/Sayfa/dogal-gaz-satis-tarifeleri/178",
  referenceDate: "2026-Q1",
  methodology: "direct" as const,
};

export const OFFICIAL_REFERENCES: OfficialReference[] = [
  // ============================================================
  // RENT — il bazlı ortalama kiracı hane aylık kira (TL)
  // Kaynak: TÜİK Hanehalkı Bütçe Anketi 2024 + 2025 ortalama TÜFE
  // projection. NUTS-2 bölge ortalamaları il bazlı yansıtılır.
  // ============================================================
  {
    ...TUIK_HBA,
    type: "RENT",
    scope: { citySlug: "istanbul" },
    amount: 28500,
    data: {
      roomCount: "2+1",
      m2: 90,
      buildingAge: "10-20",
      furnished: "UNFURNISHED",
      heating: "KOMBI",
      citySlug: "istanbul",
      cityName: "İstanbul",
      note: "Türkiye İstatistik Kurumu Hanehalkı Bütçe verisi temel alınarak il bazlı projeksiyon",
    },
  },
  {
    ...TUIK_HBA,
    type: "RENT",
    scope: { citySlug: "ankara" },
    amount: 17000,
    data: {
      roomCount: "2+1",
      m2: 95,
      buildingAge: "10-20",
      furnished: "UNFURNISHED",
      heating: "MERKEZI",
      citySlug: "ankara",
      cityName: "Ankara",
    },
  },
  {
    ...TUIK_HBA,
    type: "RENT",
    scope: { citySlug: "izmir" },
    amount: 19500,
    data: {
      roomCount: "2+1",
      m2: 90,
      buildingAge: "10-20",
      furnished: "UNFURNISHED",
      heating: "KOMBI",
      citySlug: "izmir",
      cityName: "İzmir",
    },
  },
  {
    ...TUIK_HBA,
    type: "RENT",
    scope: { citySlug: "bursa" },
    amount: 14500,
    data: {
      roomCount: "2+1",
      m2: 95,
      buildingAge: "10-20",
      furnished: "UNFURNISHED",
      heating: "KOMBI",
      citySlug: "bursa",
      cityName: "Bursa",
    },
  },
  {
    ...TUIK_HBA,
    type: "RENT",
    scope: { citySlug: "antalya" },
    amount: 21000,
    data: {
      roomCount: "2+1",
      m2: 90,
      buildingAge: "5-10",
      furnished: "UNFURNISHED",
      heating: "KLIMA",
      citySlug: "antalya",
      cityName: "Antalya",
    },
  },
  {
    ...TUIK_HBA,
    type: "RENT",
    scope: { citySlug: "kocaeli" },
    amount: 13500,
    data: {
      roomCount: "2+1",
      m2: 95,
      buildingAge: "10-20",
      furnished: "UNFURNISHED",
      heating: "KOMBI",
      citySlug: "kocaeli",
      cityName: "Kocaeli",
    },
  },
  {
    ...TUIK_HBA,
    type: "RENT",
    scope: { citySlug: "eskisehir" },
    amount: 12000,
    data: {
      roomCount: "2+1",
      m2: 95,
      buildingAge: "10-20",
      furnished: "UNFURNISHED",
      heating: "KOMBI",
      citySlug: "eskisehir",
      cityName: "Eskişehir",
    },
  },
  {
    ...TUIK_HBA,
    type: "RENT",
    scope: { citySlug: "konya" },
    amount: 11500,
    data: {
      roomCount: "2+1",
      m2: 100,
      buildingAge: "10-20",
      furnished: "UNFURNISHED",
      heating: "KOMBI",
      citySlug: "konya",
      cityName: "Konya",
    },
  },

  // ============================================================
  // SALARY — sektörel ortalama net maaş (TL/ay)
  // Kaynak: TÜİK Kazanç Yapısı + 2025 zamlı projeksiyon
  // ============================================================
  {
    ...TUIK_ISGUCU,
    type: "SALARY",
    scope: { positionSlug: "yazilim-gelistirici" },
    amount: 58000,
    data: {
      positionSlug: "yazilim-gelistirici",
      positionName: "Yazılım Geliştirici",
      sector: "Bilgi ve İletişim",
      experienceYears: 5,
      note: "Bilgi-iletişim sektörü brüt ortalamasının net karşılığı (TÜİK Kazanç Yapısı 2024 + 2025 zamlı projeksiyon)",
    },
  },
  {
    ...TUIK_ISGUCU,
    type: "SALARY",
    scope: { positionSlug: "frontend-developer" },
    amount: 55000,
    data: {
      positionSlug: "frontend-developer",
      positionName: "Frontend Developer",
      sector: "Bilgi ve İletişim",
      experienceYears: 4,
    },
  },
  {
    ...TUIK_ISGUCU,
    type: "SALARY",
    scope: { positionSlug: "backend-developer" },
    amount: 60000,
    data: {
      positionSlug: "backend-developer",
      positionName: "Backend Developer",
      sector: "Bilgi ve İletişim",
      experienceYears: 5,
    },
  },
  {
    ...TUIK_ISGUCU,
    type: "SALARY",
    scope: { positionSlug: "ogretmen" },
    amount: 32000,
    data: {
      positionSlug: "ogretmen",
      positionName: "Öğretmen",
      sector: "Eğitim",
      experienceYears: 5,
      note: "MEB resmi maaş skalası — 1/4 derece kadrolu öğretmen net",
    },
  },
  {
    ...TUIK_ISGUCU,
    type: "SALARY",
    scope: { positionSlug: "doktor" },
    amount: 95000,
    data: {
      positionSlug: "doktor",
      positionName: "Doktor",
      sector: "Sağlık",
      experienceYears: 8,
    },
  },
  {
    ...TUIK_ISGUCU,
    type: "SALARY",
    scope: { positionSlug: "makine-muhendisi" },
    amount: 48000,
    data: {
      positionSlug: "makine-muhendisi",
      positionName: "Makine Mühendisi",
      sector: "Mühendislik",
      experienceYears: 6,
    },
  },
  {
    ...TUIK_ISGUCU,
    type: "SALARY",
    scope: { positionSlug: "muhasebeci" },
    amount: 33000,
    data: {
      positionSlug: "muhasebeci",
      positionName: "Muhasebeci",
      sector: "Mali ve Sigorta",
      experienceYears: 5,
    },
  },
  {
    ...TUIK_ISGUCU,
    type: "SALARY",
    scope: { positionSlug: "satis-temsilcisi" },
    amount: 28000,
    data: {
      positionSlug: "satis-temsilcisi",
      positionName: "Satış Temsilcisi",
      sector: "Toptan-Perakende",
      experienceYears: 4,
      note: "Genelde sabit + prim kombinasyonu — sabit kısım baz alındı",
    },
  },
  {
    ...TUIK_ISGUCU,
    type: "SALARY",
    scope: { positionSlug: "asgari-ucret" },
    amount: 22104,
    data: {
      positionSlug: "asgari-ucret",
      positionName: "Asgari Ücret (Net)",
      sector: "Genel",
      experienceYears: 0,
      note: "2025 yıllık asgari ücret — Aile, Çalışma ve Sosyal Hizmetler Bakanlığı 2024-12 açıklaması",
    },
  },

  // ============================================================
  // UTILITY — EPDK & BOTAŞ konut tarifesi (TL / birim)
  // Kaynak: EPDK Tüketici Tarifesi 2026-Q1
  // ============================================================
  {
    ...EPDK_TARIFE,
    type: "UTILITY",
    scope: { utilityType: "ELEKTRIK" },
    amount: 2.65,
    data: {
      utilityType: "ELEKTRIK",
      consumption: 1, // 1 kWh referans
      householdSize: "—",
      billingMonth: "2026-01",
      note: "Konut tarifesi 1. kademe (≤140 kWh/ay), tek-zaman, vergiler hariç birim fiyat",
    },
  },
  {
    ...BOTAS_TARIFE,
    type: "UTILITY",
    scope: { utilityType: "DOGALGAZ" },
    amount: 7.45,
    data: {
      utilityType: "DOGALGAZ",
      consumption: 1, // 1 m³ referans
      householdSize: "—",
      billingMonth: "2026-01",
      note: "Konut serbest tüketici m³ birim fiyatı — BOTAŞ 2026 Q1 tarifesi",
    },
  },
];

/**
 * Bir scope için resmi referans median'ı döner. Public sayfalarda
 * "TÜİK diyor X" satırı için kullanılır.
 */
export function findOfficialReference(
  type: OfficialReference["type"],
  scope: OfficialReference["scope"],
): OfficialReference | null {
  return (
    OFFICIAL_REFERENCES.find((r) => {
      if (r.type !== type) return false;
      if (scope.citySlug && r.scope.citySlug !== scope.citySlug) return false;
      if (scope.positionSlug && r.scope.positionSlug !== scope.positionSlug) return false;
      if (scope.utilityType && r.scope.utilityType !== scope.utilityType) return false;
      return true;
    }) ?? null
  );
}
