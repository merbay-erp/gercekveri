/**
 * Server-side TcmbSnapshot reader. Cron tablosu doldurur, public sayfalar
 * buradan okur. Cron başarısız olduğu nadir durumda eski değer + lastError
 * döner — UI bunu "stale" göstergesi olarak kullanabilir.
 */
import { db } from "@/lib/db";

export interface TcmbPulseItem {
  code: string;
  label: string;
  lastDate: string;
  lastValue: number | null;
  yoyChangePct: number | null;
  fetchedAt: Date;
  isStale: boolean;
}

const PULSE_CODES: string[] = [
  "TP.DK.USD.S",
  "TP.DK.EUR.S",
  "TP.FE.OKTG01",
  "TP.APIFON4",
];

const STALE_AFTER_MS = 1000 * 60 * 60 * 36; // 36h — günlük cron + güvenlik

export async function getTcmbPulseItems(): Promise<TcmbPulseItem[]> {
  const rows = await db.tcmbSnapshot.findMany({
    where: { seriesCode: { in: PULSE_CODES } },
  });

  const now = Date.now();
  const byCode = new Map(rows.map((r) => [r.seriesCode, r]));

  const items: TcmbPulseItem[] = [];
  for (const code of PULSE_CODES) {
    const r = byCode.get(code);
    if (!r || r.lastValue === null) continue;
    items.push({
      code,
      label: r.label,
      lastDate: r.lastDate,
      lastValue: r.lastValue,
      yoyChangePct: r.yoyChangePct,
      fetchedAt: r.fetchedAt,
      isStale: now - r.fetchedAt.getTime() > STALE_AFTER_MS,
    });
  }
  return items;
}

/** TÜFE'nin son yıllık değişimini döner — null ise data yok ya da hata */
export async function getInflationYoyPct(): Promise<number | null> {
  const row = await db.tcmbSnapshot.findUnique({
    where: { seriesCode: "TP.FE.OKTG01" },
  });
  return row?.yoyChangePct ?? null;
}

export interface HousingIndexSnapshot {
  scope: "national" | "city";
  cityName?: string;
  seriesCode: string;
  label: string;
  lastDate: string;
  lastValue: number;
  yoyChangePct: number | null;
  fetchedAt: Date;
}

// 81 il × 19 NUTS region tam eşleşme — TCMB EVDS resmi NUTS-2 sınıflandırması.
// Her şehrin konut fiyat endeksi kendi bölgesinin verisini görür.
// Tek-il bölgeler (İstanbul, Ankara, İzmir) salt o ili kapsar; diğerleri
// birden fazla ili gruplar (örn. TR41 = Bursa+Eskişehir+Bilecik).
const CITY_KFE_MAP: Record<string, { code: string; cityName: string }> = (() => {
  const groups: Array<{ code: string; cityName: string; slugs: string[] }> = [
    { code: "TP.KFE.TR10", cityName: "İstanbul", slugs: ["istanbul"] },
    { code: "TP.KFE.TR21", cityName: "Tekirdağ-Edirne-Kırklareli", slugs: ["tekirdag", "edirne", "kirklareli"] },
    { code: "TP.KFE.TR22", cityName: "Balıkesir-Çanakkale", slugs: ["balikesir", "canakkale"] },
    { code: "TP.KFE.TR31", cityName: "İzmir", slugs: ["izmir"] },
    { code: "TP.KFE.TR32", cityName: "Aydın-Denizli-Muğla", slugs: ["aydin", "denizli", "mugla"] },
    { code: "TP.KFE.TR33", cityName: "Manisa-Afyon-Kütahya-Uşak", slugs: ["manisa", "afyonkarahisar", "kutahya", "usak"] },
    { code: "TP.KFE.TR41", cityName: "Bursa-Eskişehir-Bilecik", slugs: ["bursa", "eskisehir", "bilecik"] },
    { code: "TP.KFE.TR42", cityName: "Kocaeli-Sakarya-Düzce-Bolu-Yalova", slugs: ["kocaeli", "sakarya", "duzce", "bolu", "yalova"] },
    { code: "TP.KFE.TR51", cityName: "Ankara", slugs: ["ankara"] },
    { code: "TP.KFE.TR52", cityName: "Konya-Karaman", slugs: ["konya", "karaman"] },
    { code: "TP.KFE.TR61", cityName: "Antalya-Isparta-Burdur", slugs: ["antalya", "isparta", "burdur"] },
    { code: "TP.KFE.TR62", cityName: "Adana-Mersin", slugs: ["adana", "mersin"] },
    { code: "TP.KFE.TR63", cityName: "Hatay-Maraş-Osmaniye", slugs: ["hatay", "kahramanmaras", "osmaniye"] },
    { code: "TP.KFE.TR7", cityName: "Orta Anadolu (Kayseri-Sivas-Yozgat-Niğde-Nevşehir-Kırşehir-Aksaray-Kırıkkale)",
      slugs: ["kayseri", "sivas", "yozgat", "nigde", "nevsehir", "kirsehir", "aksaray", "kirikkale"] },
    { code: "TP.KFE.TR8", cityName: "Batı Karadeniz (Samsun-Tokat-Çorum-Amasya-Zonguldak-Karabük-Bartın-Kastamonu-Çankırı-Sinop)",
      slugs: ["samsun", "tokat", "corum", "amasya", "zonguldak", "karabuk", "bartin", "kastamonu", "cankiri", "sinop"] },
    { code: "TP.KFE.TR9", cityName: "Doğu Karadeniz (Trabzon-Ordu-Giresun-Rize-Artvin-Gümüşhane)",
      slugs: ["trabzon", "ordu", "giresun", "rize", "artvin", "gumushane"] },
    { code: "TP.KFE.TRA", cityName: "Kuzeydoğu Anadolu (Erzurum-Erzincan-Bayburt-Ağrı-Kars-Iğdır-Ardahan)",
      slugs: ["erzurum", "erzincan", "bayburt", "agri", "kars", "igdir", "ardahan"] },
    { code: "TP.KFE.TRB", cityName: "Ortadoğu Anadolu (Malatya-Elazığ-Bingöl-Tunceli-Van-Muş-Bitlis-Hakkari)",
      slugs: ["malatya", "elazig", "bingol", "tunceli", "van", "mus", "bitlis", "hakkari"] },
    { code: "TP.KFE.TRC", cityName: "Güneydoğu Anadolu (Gaziantep-Şanlıurfa-Diyarbakır-Mardin-Adıyaman-Kilis-Batman-Şırnak-Siirt)",
      slugs: ["gaziantep", "sanliurfa", "diyarbakir", "mardin", "adiyaman", "kilis", "batman", "sirnak", "siirt"] },
  ];
  const map: Record<string, { code: string; cityName: string }> = {};
  for (const g of groups) {
    for (const slug of g.slugs) {
      map[slug] = { code: g.code, cityName: g.cityName };
    }
  }
  return map;
})();

/**
 * Şehir bazlı konut fiyat endeksi. Şu an Türkiye geneli (TP.KFE.TR) fallback —
 * şehir kırılımı kodları keşfedilince map güncellenir.
 */
export async function getHousingIndex(
  citySlug?: string,
): Promise<HousingIndexSnapshot | null> {
  const cityEntry = citySlug ? CITY_KFE_MAP[citySlug] : undefined;
  const code = cityEntry?.code ?? "TP.KFE.TR";

  const row = await db.tcmbSnapshot.findUnique({
    where: { seriesCode: code },
  });
  if (!row || row.lastValue === null) return null;

  return {
    scope: cityEntry ? "city" : "national",
    cityName: cityEntry?.cityName,
    seriesCode: code,
    label: row.label,
    lastDate: row.lastDate,
    lastValue: row.lastValue,
    yoyChangePct: row.yoyChangePct,
    fetchedAt: row.fetchedAt,
  };
}
