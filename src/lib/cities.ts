/**
 * Türkiye 81 il listesi — plaka kodu + slug + bölge.
 * MVP'de bu modül DB'den önce statik bir kaynak olarak çalışır.
 * Phase 1'de seed scriptiyle DB'ye yansıtılır.
 */

export interface CityRecord {
  plate: number;
  name: string;
  slug: string;
  region: TurkishRegion;
}

export type TurkishRegion =
  | "Marmara"
  | "Ege"
  | "Akdeniz"
  | "İç Anadolu"
  | "Karadeniz"
  | "Doğu Anadolu"
  | "Güneydoğu Anadolu";

export const cities: CityRecord[] = [
  { plate: 1, name: "Adana", slug: "adana", region: "Akdeniz" },
  { plate: 2, name: "Adıyaman", slug: "adiyaman", region: "Güneydoğu Anadolu" },
  { plate: 3, name: "Afyonkarahisar", slug: "afyonkarahisar", region: "Ege" },
  { plate: 4, name: "Ağrı", slug: "agri", region: "Doğu Anadolu" },
  { plate: 5, name: "Amasya", slug: "amasya", region: "Karadeniz" },
  { plate: 6, name: "Ankara", slug: "ankara", region: "İç Anadolu" },
  { plate: 7, name: "Antalya", slug: "antalya", region: "Akdeniz" },
  { plate: 8, name: "Artvin", slug: "artvin", region: "Karadeniz" },
  { plate: 9, name: "Aydın", slug: "aydin", region: "Ege" },
  { plate: 10, name: "Balıkesir", slug: "balikesir", region: "Marmara" },
  { plate: 11, name: "Bilecik", slug: "bilecik", region: "Marmara" },
  { plate: 12, name: "Bingöl", slug: "bingol", region: "Doğu Anadolu" },
  { plate: 13, name: "Bitlis", slug: "bitlis", region: "Doğu Anadolu" },
  { plate: 14, name: "Bolu", slug: "bolu", region: "Karadeniz" },
  { plate: 15, name: "Burdur", slug: "burdur", region: "Akdeniz" },
  { plate: 16, name: "Bursa", slug: "bursa", region: "Marmara" },
  { plate: 17, name: "Çanakkale", slug: "canakkale", region: "Marmara" },
  { plate: 18, name: "Çankırı", slug: "cankiri", region: "İç Anadolu" },
  { plate: 19, name: "Çorum", slug: "corum", region: "Karadeniz" },
  { plate: 20, name: "Denizli", slug: "denizli", region: "Ege" },
  { plate: 21, name: "Diyarbakır", slug: "diyarbakir", region: "Güneydoğu Anadolu" },
  { plate: 22, name: "Edirne", slug: "edirne", region: "Marmara" },
  { plate: 23, name: "Elazığ", slug: "elazig", region: "Doğu Anadolu" },
  { plate: 24, name: "Erzincan", slug: "erzincan", region: "Doğu Anadolu" },
  { plate: 25, name: "Erzurum", slug: "erzurum", region: "Doğu Anadolu" },
  { plate: 26, name: "Eskişehir", slug: "eskisehir", region: "İç Anadolu" },
  { plate: 27, name: "Gaziantep", slug: "gaziantep", region: "Güneydoğu Anadolu" },
  { plate: 28, name: "Giresun", slug: "giresun", region: "Karadeniz" },
  { plate: 29, name: "Gümüşhane", slug: "gumushane", region: "Karadeniz" },
  { plate: 30, name: "Hakkari", slug: "hakkari", region: "Doğu Anadolu" },
  { plate: 31, name: "Hatay", slug: "hatay", region: "Akdeniz" },
  { plate: 32, name: "Isparta", slug: "isparta", region: "Akdeniz" },
  { plate: 33, name: "Mersin", slug: "mersin", region: "Akdeniz" },
  { plate: 34, name: "İstanbul", slug: "istanbul", region: "Marmara" },
  { plate: 35, name: "İzmir", slug: "izmir", region: "Ege" },
  { plate: 36, name: "Kars", slug: "kars", region: "Doğu Anadolu" },
  { plate: 37, name: "Kastamonu", slug: "kastamonu", region: "Karadeniz" },
  { plate: 38, name: "Kayseri", slug: "kayseri", region: "İç Anadolu" },
  { plate: 39, name: "Kırklareli", slug: "kirklareli", region: "Marmara" },
  { plate: 40, name: "Kırşehir", slug: "kirsehir", region: "İç Anadolu" },
  { plate: 41, name: "Kocaeli", slug: "kocaeli", region: "Marmara" },
  { plate: 42, name: "Konya", slug: "konya", region: "İç Anadolu" },
  { plate: 43, name: "Kütahya", slug: "kutahya", region: "Ege" },
  { plate: 44, name: "Malatya", slug: "malatya", region: "Doğu Anadolu" },
  { plate: 45, name: "Manisa", slug: "manisa", region: "Ege" },
  { plate: 46, name: "Kahramanmaraş", slug: "kahramanmaras", region: "Akdeniz" },
  { plate: 47, name: "Mardin", slug: "mardin", region: "Güneydoğu Anadolu" },
  { plate: 48, name: "Muğla", slug: "mugla", region: "Ege" },
  { plate: 49, name: "Muş", slug: "mus", region: "Doğu Anadolu" },
  { plate: 50, name: "Nevşehir", slug: "nevsehir", region: "İç Anadolu" },
  { plate: 51, name: "Niğde", slug: "nigde", region: "İç Anadolu" },
  { plate: 52, name: "Ordu", slug: "ordu", region: "Karadeniz" },
  { plate: 53, name: "Rize", slug: "rize", region: "Karadeniz" },
  { plate: 54, name: "Sakarya", slug: "sakarya", region: "Marmara" },
  { plate: 55, name: "Samsun", slug: "samsun", region: "Karadeniz" },
  { plate: 56, name: "Siirt", slug: "siirt", region: "Güneydoğu Anadolu" },
  { plate: 57, name: "Sinop", slug: "sinop", region: "Karadeniz" },
  { plate: 58, name: "Sivas", slug: "sivas", region: "İç Anadolu" },
  { plate: 59, name: "Tekirdağ", slug: "tekirdag", region: "Marmara" },
  { plate: 60, name: "Tokat", slug: "tokat", region: "Karadeniz" },
  { plate: 61, name: "Trabzon", slug: "trabzon", region: "Karadeniz" },
  { plate: 62, name: "Tunceli", slug: "tunceli", region: "Doğu Anadolu" },
  { plate: 63, name: "Şanlıurfa", slug: "sanliurfa", region: "Güneydoğu Anadolu" },
  { plate: 64, name: "Uşak", slug: "usak", region: "Ege" },
  { plate: 65, name: "Van", slug: "van", region: "Doğu Anadolu" },
  { plate: 66, name: "Yozgat", slug: "yozgat", region: "İç Anadolu" },
  { plate: 67, name: "Zonguldak", slug: "zonguldak", region: "Karadeniz" },
  { plate: 68, name: "Aksaray", slug: "aksaray", region: "İç Anadolu" },
  { plate: 69, name: "Bayburt", slug: "bayburt", region: "Karadeniz" },
  { plate: 70, name: "Karaman", slug: "karaman", region: "İç Anadolu" },
  { plate: 71, name: "Kırıkkale", slug: "kirikkale", region: "İç Anadolu" },
  { plate: 72, name: "Batman", slug: "batman", region: "Güneydoğu Anadolu" },
  { plate: 73, name: "Şırnak", slug: "sirnak", region: "Güneydoğu Anadolu" },
  { plate: 74, name: "Bartın", slug: "bartin", region: "Karadeniz" },
  { plate: 75, name: "Ardahan", slug: "ardahan", region: "Doğu Anadolu" },
  { plate: 76, name: "Iğdır", slug: "igdir", region: "Doğu Anadolu" },
  { plate: 77, name: "Yalova", slug: "yalova", region: "Marmara" },
  { plate: 78, name: "Karabük", slug: "karabuk", region: "Karadeniz" },
  { plate: 79, name: "Kilis", slug: "kilis", region: "Güneydoğu Anadolu" },
  { plate: 80, name: "Osmaniye", slug: "osmaniye", region: "Akdeniz" },
  { plate: 81, name: "Düzce", slug: "duzce", region: "Karadeniz" },
];

export const citiesBySlug = new Map(cities.map((c) => [c.slug, c]));
export const citiesByPlate = new Map(cities.map((c) => [c.plate, c]));

export function findCityBySlug(slug: string): CityRecord | undefined {
  return citiesBySlug.get(slug.toLowerCase());
}

/** Top-tier cities for prefilled hero selectors */
export const featuredCitySlugs = [
  "istanbul",
  "ankara",
  "izmir",
  "bursa",
  "antalya",
  "adana",
  "konya",
  "gaziantep",
] as const;
