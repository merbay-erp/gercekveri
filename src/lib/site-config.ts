export const siteConfig = {
  name: "GerçekVeri",
  domain: "gercekveri.com",
  description:
    "Ödeme yapmadan önce sor. Web sitesi, IBAN, telefon ya da ilanın gerçek mi sahte mi olduğunu domain yaşı, kara liste ve halk ihbarıyla saniyede sorgula.",
  tagline: "Bu gerçek mi, sahte mi?",
  locale: "tr",
  ogImage: "/og.png",
  links: {
    twitter: "https://x.com/merbay86",
    github: "https://github.com/merbay-erp/gercekveri",
    bluesky: "https://bsky.app/profile/mustafaerbay.bsky.social",
    linkedin: "https://www.linkedin.com/in/mustafa-e-6a891370/",
    mastodon: "https://mastodon.social/@mustafaerbay",
    blog: "https://mustafaerbay.com.tr/",
    devto: "https://dev.to/merbayerp",
    hashnode: "https://mustafaerbay.hashnode.dev/",
  },
} as const;

export const mainNav = [
  { label: "Sorgula", href: "/" },
  { label: "Rehber", href: "/rehber" },
  { label: "İhbar et", href: "/ihbar" },
  { label: "Son dolandırıcılıklar", href: "/son-dolandiriciliklar" },
  { label: "Nasıl çalışır", href: "/hakkinda" },
  { label: "SSS", href: "/sss" },
];

export const footerNav = {
  product: [
    { label: "Risk sorgulama", href: "/#sorgula" },
    { label: "Dolandırıcılık ihbar et", href: "/ihbar" },
    { label: "Son dolandırıcılıklar", href: "/son-dolandiriciliklar" },
  ],
  economy: [
    { label: "Korunma rehberleri", href: "/rehber" },
    { label: "Sahte siteyi anlama", href: "/rehber/sahte-site-nasil-anlasilir" },
    { label: "Dolandırıldım: ilk adımlar", href: "/rehber/dolandirildim-ne-yapmaliyim" },
    { label: "Risk skoru metodolojisi", href: "/rehber/risk-skoru-nasil-hesaplaniyor" },
    { label: "Nasıl çalışır", href: "/hakkinda" },
    { label: "Sık sorulan sorular", href: "/sss" },
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
  ],
};
