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
  { label: "İhbar et", href: "/ihbar" },
  { label: "Son dolandırıcılıklar", href: "/son-dolandiriciliklar" },
  { label: "Nasıl çalışır", href: "/hakkinda" },
  { label: "SSS", href: "/sss" },
];

export const footerNav = {
  product: [
    { label: "Web sitesi sorgula", href: "/" },
    { label: "IBAN sorgula", href: "/" },
    { label: "Telefon sorgula", href: "/" },
    { label: "İlan sorgula", href: "/" },
    { label: "Dolandırıcılık ihbar et", href: "/ihbar" },
    { label: "Son dolandırıcılıklar", href: "/son-dolandiriciliklar" },
  ],
  economy: [
    { label: "Nasıl çalışır", href: "/hakkinda" },
    { label: "Sık sorulan sorular", href: "/sss" },
    { label: "Son dolandırıcılıklar", href: "/son-dolandiriciliklar" },
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
