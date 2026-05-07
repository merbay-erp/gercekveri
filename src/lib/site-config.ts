import type { LucideIcon } from "lucide-react";
import { Banknote, Home, Wifi, Building2, Plug, Shirt } from "lucide-react";

export const siteConfig = {
  name: "GerçekVeri",
  domain: "gercekveri.com",
  description:
    "Türkiye'nin anonim gerçek veri platformu. Maaş, kira, internet ve daha fazlası — gerçek kullanıcılardan, gerçek verilerle.",
  tagline: "Türkiye'nin gerçek verisi",
  locale: "tr",
  ogImage: "/og.png",
  links: {
    twitter: "https://twitter.com/gercekveri",
    github: "https://github.com/merbay-erp/gercekveri",
  },
} as const;

export type CategorySlug = "maaslar" | "kira" | "internet" | "aidat" | "fatura" | "tekstil";
export type CategoryStatus = "live" | "soon";

export interface CategoryDef {
  slug: CategorySlug;
  type: "SALARY" | "RENT" | "INTERNET" | "AIDAT" | "UTILITY" | "TEXTILE";
  name: string;
  pluralName: string;
  shortDescription: string;
  longDescription: string;
  icon: LucideIcon;
  status: CategoryStatus;
  accent: string;
  sortOrder: number;
}

export const categories: CategoryDef[] = [
  {
    slug: "maaslar",
    type: "SALARY",
    name: "Maaş",
    pluralName: "Maaşlar",
    shortDescription: "Pozisyonuna ve şehrine göre Türkiye'deki gerçek maaşlar",
    longDescription:
      "Anonim olarak paylaşılan net maaş verileri. Yazılımcı, mühendis, öğretmen, satış temsilcisi — pozisyon ve şehre göre filtrele, gerçek aralıkları gör.",
    icon: Banknote,
    status: "live",
    accent: "from-emerald-500/20 to-emerald-500/5",
    sortOrder: 1,
  },
  {
    slug: "kira",
    type: "RENT",
    name: "Kira",
    pluralName: "Kiralar",
    shortDescription: "Şehir ve ilçe bazında gerçek kira fiyatları",
    longDescription:
      "Emlakçı bekleyen fiyatları değil, kiracıların ödediği gerçek tutarları gör. m², oda, bina yaşı bazında filtre.",
    icon: Home,
    status: "live",
    accent: "from-sky-500/20 to-sky-500/5",
    sortOrder: 2,
  },
  {
    slug: "internet",
    type: "INTERNET",
    name: "İnternet",
    pluralName: "İnternet sağlayıcıları",
    shortDescription: "Gerçek hız, ping, kesinti raporları",
    longDescription:
      "Türk Telekom, Superonline, Vodafone, TurkNet — paket hızı yerine gerçekte ölçülen hız, ping ve kesinti sıklığı.",
    icon: Wifi,
    status: "live",
    accent: "from-violet-500/20 to-violet-500/5",
    sortOrder: 3,
  },
  {
    slug: "aidat",
    type: "AIDAT",
    name: "Aidat",
    pluralName: "Site aidatları",
    shortDescription: "Sitelerin aylık aidatları, hizmet kapsamı",
    longDescription:
      "Komşunla aynı parayı mı veriyorsun yoksa kazıklanıyor musun? Bina yaşı, daire sayısı ve hizmetlere göre kıyas.",
    icon: Building2,
    status: "live",
    accent: "from-amber-500/20 to-amber-500/5",
    sortOrder: 4,
  },
  {
    slug: "fatura",
    type: "UTILITY",
    name: "Fatura",
    pluralName: "Fatura tutarları",
    shortDescription: "Elektrik, doğalgaz, su faturaları",
    longDescription:
      "Tüketim ve hane büyüklüğüne göre gerçek faturalar. Bölgesel ortalamadan ne kadar uzaktasın?",
    icon: Plug,
    status: "soon",
    accent: "from-rose-500/20 to-rose-500/5",
    sortOrder: 5,
  },
  {
    slug: "tekstil",
    type: "TEXTILE",
    name: "Tekstil",
    pluralName: "Tekstil fiyatları",
    shortDescription: "Üretim, boyahane, kesim, dikim fiyatları",
    longDescription:
      "Bursa'da boyahane, İstanbul'da kesim — sektörel B2B tekstil fiyatları. Üreticiler için gerçek piyasa şeffaflığı.",
    icon: Shirt,
    status: "soon",
    accent: "from-fuchsia-500/20 to-fuchsia-500/5",
    sortOrder: 6,
  },
];

export const liveCategories = categories.filter((c) => c.status === "live");
export const upcomingCategories = categories.filter((c) => c.status === "soon");

export const mainNav = [
  { label: "Maaşlar", href: "/maaslar" },
  { label: "Kira", href: "/kira" },
  { label: "Aidat", href: "/aidat" },
  { label: "İnternet", href: "/internet" },
  { label: "Karşılaştır", href: "/karsilastir" },
];

export const footerNav = {
  product: [
    { label: "Maaşlar", href: "/maaslar" },
    { label: "Kiralar", href: "/kira" },
    { label: "İnternet sağlayıcıları", href: "/internet" },
    { label: "Maaş paylaş", href: "/maaslar/yeni" },
    { label: "Kira paylaş", href: "/kira/yeni" },
    { label: "İnternet paylaş", href: "/internet/yeni" },
  ],
  legal: [
    { label: "Gizlilik Politikası", href: "/gizlilik" },
    { label: "Çerez Politikası", href: "/cerez" },
    { label: "Kullanım Şartları", href: "/sartlar" },
    { label: "KVKK Aydınlatma", href: "/kvkk" },
  ],
  about: [
    { label: "Hakkında", href: "/hakkinda" },
    { label: "İletişim", href: "/iletisim" },
    { label: "SSS", href: "/sss" },
  ],
};
