/**
 * Hazir Schema.org preset'leri — kategori sayfalari icin.
 *
 * Her preset Dataset + FAQ + Breadcrumb dondurur. Sayfa page.tsx'te tek satirla
 * eklenir: <SchemaOrg data={maaslarSchemas(stats)} />
 */

import {
  datasetSchema,
  faqSchema,
  breadcrumbSchema,
  jsonLdGraph,
  type FaqItem,
} from "./schema-org";

// =============== MAAŞLAR (Salary) ===============
export function maaslarSchemas(opts: { recordCount?: number } = {}) {
  const faqs: FaqItem[] = [
    {
      question: "Türkiye'de ortalama maaş ne kadar?",
      answer:
        "Anonim olarak paylaşılan gerçek verilerden hesaplanan medyan ve ortalama maaşlar pozisyon, sektör ve şehir bazında gercekveri.com/maaslar sayfasında güncel olarak gösterilir. Tek bir 'ortalama' yok — meslek ve şehre göre büyük farklar var.",
    },
    {
      question: "Maaş verisi nasıl toplanıyor?",
      answer:
        "Kullanıcılar maaşlarını anonim olarak paylaşıyor. Hiçbir kişisel bilgi (isim, e-posta, telefon) tutulmuyor. K-anonymity kuralı uygulanır: bir şehir + şirket + pozisyon kombinasyonunda en az 3 gönderim olmadan veri gösterilmez.",
    },
    {
      question: "Veriler güvenilir mi?",
      answer:
        "Her gönderim ham veri olarak agregat istatistiklere katılır. Outlier'lar (uç değerler) IQR yöntemi ile temizlenir. Trust Score sistemi düşük güvenilirliğe sahip gönderimleri filtreler.",
    },
    {
      question: "Maaşımı paylaşırsam ne olur?",
      answer:
        "Maaşın anonim olarak veri tabanına eklenir. Sen ve diğer kullanıcılar pozisyonun + şehrin için güncel medyan, ortalama, p25 ve p75 değerlerini görebilir. Kimse seni kişisel olarak tanıyamaz.",
    },
    {
      question: "Hangi sektörlerde veri var?",
      answer:
        "Yazılım, sağlık, finans, üretim, eğitim, perakende, lojistik gibi 20+ sektörde veri var. Sektör + pozisyon bazlı filtreleme yapılabilir.",
    },
  ];

  return jsonLdGraph(
    datasetSchema({
      name: "Türkiye'de Maaşlar — Anonim Gerçek Veri",
      description:
        "Anonim olarak paylaşılan gerçek maaş verilerinden hesaplanan medyan, ortalama, p25 ve p75 değerleri. Pozisyon, sektör ve şehir bazında filtrelenir. K-anonymity korumalı.",
      url: "/maaslar",
      keywords: [
        "Türkiye maaşlar",
        "maaş araştırması",
        "ortalama maaş",
        "medyan maaş",
        "pozisyon bazlı maaş",
        "şehir bazlı maaş",
        "anonim maaş verisi",
      ],
      variableMeasured: ["amount (TRY)", "position", "city", "industry", "experience"],
      measurementTechnique:
        "Anonim self-reporting + IQR outlier removal + k-anonymity (min 3) + Trust Score filtering",
      recordCount: opts.recordCount,
      temporalCoverage: "2026/..",
    }),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Maaşlar", url: "/maaslar" },
    ]),
  );
}

// =============== KIRA (Rent) ===============
export function kiraSchemas(opts: { recordCount?: number } = {}) {
  const faqs: FaqItem[] = [
    {
      question: "Türkiye'de ortalama kira ne kadar?",
      answer:
        "Şehir ve ilçeye göre büyük farklar var. İstanbul, Ankara, İzmir gibi büyük şehirlerde 1+1 daire kirası 15.000-35.000 TL bandında. Anonim olarak paylaşılan gerçek kiralar gercekveri.com/kira sayfasında güncel olarak gösterilir.",
    },
    {
      question: "Kira veriniz nasıl güncel kalıyor?",
      answer:
        "Yeni gönderimler ile veri her saat güncellenir. Eski gönderimler ağırlıklarını kademeli olarak kaybeder (recency-weighted average). Şu anda en güncel veri seti son 6 aydır.",
    },
    {
      question: "Kira şişmesi nedir?",
      answer:
        "gercekveri.com/kira/sisme sayfasında, ilan sitelerindeki kiralar ile gerçek ödenen kiralar arasındaki fark gösterilir. Genelde ilan kira'sı, gerçek kiranın %20-40 üzerinde olur.",
    },
    {
      question: "Kira verimi paylaşmak güvenli mi?",
      answer:
        "Evet. Hiçbir kişisel bilgi tutulmuyor. Sadece amount + city + district + room type + size + year tutuluyor. K-anonymity uygulanır.",
    },
    {
      question: "Konut Fiyat Endeksi (KFE) ile farkı ne?",
      answer:
        "TCMB Konut Fiyat Endeksi resmi veridir ama satış fiyatına dayanır. gercekveri.com/kira ise gerçek ödenen kira'yı toplar. İkisi farklı pazarları yansıtır — biri yatırım, diğeri kullanım.",
    },
  ];

  return jsonLdGraph(
    datasetSchema({
      name: "Türkiye'de Kiralar — Anonim Gerçek Veri",
      description:
        "Şehir, ilçe ve oda sayısı bazında Türkiye'deki gerçek ödenen kira fiyatları. İlan kiraları değil — gerçek sözleşme verileri.",
      url: "/kira",
      keywords: [
        "Türkiye kira",
        "şehir bazlı kira",
        "ilçe bazlı kira",
        "kira araştırması",
        "kira şişmesi",
        "gerçek kira fiyatları",
        "1+1 kira",
        "2+1 kira",
      ],
      variableMeasured: ["amount (TRY)", "city", "district", "rooms", "size_m2", "year"],
      measurementTechnique:
        "Anonim self-reporting + recency-weighted average + IQR outlier removal",
      recordCount: opts.recordCount,
      temporalCoverage: "2026/..",
    }),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Kiralar", url: "/kira" },
    ]),
  );
}

// =============== INTERNET ===============
export function internetSchemas(opts: { recordCount?: number } = {}) {
  const faqs: FaqItem[] = [
    {
      question: "Türkiye'de internet ne kadar?",
      answer:
        "100 Mbps fiber internet aylık 250-450 TL bandında. ISS (Türk Telekom, TurkNet, Vodafone, Superonline) ve hız paketine göre değişir. Gerçek faturalardaki değerleri gercekveri.com/internet sayfasında karşılaştırabilirsin.",
    },
    {
      question: "En ucuz internet hangisi?",
      answer:
        "Şehir + adres bazında ISS değişir. TurkNet ve Millenicom çoğu yerde rakiplerinden %20-30 ucuz. Ancak servis kalitesi değişebilir — gercekveri.com'da gerçek kullanıcı raporlarını gör.",
    },
    {
      question: "Promosyon fiyatı vs gerçek fatura?",
      answer:
        "ISS'ler 1-3 ay promosyon sonrası faturaları %30-60 artırır. gercekveri.com gerçek aylık fatura değerlerini toplar — promosyon değil, sürekli ödeme.",
    },
  ];

  return jsonLdGraph(
    datasetSchema({
      name: "Türkiye'de Internet Maliyetleri — Anonim Gerçek Veri",
      description:
        "İSS, şehir ve hız paketi bazında Türkiye'deki gerçek aylık internet faturaları. Promosyon fiyatları değil — sürekli ödenen değerler.",
      url: "/internet",
      keywords: [
        "Türkiye internet fiyatları",
        "internet faturası",
        "ISS karşılaştırma",
        "Türk Telekom",
        "TurkNet",
        "Vodafone internet",
        "Superonline",
        "fiber internet maliyeti",
      ],
      variableMeasured: ["amount (TRY)", "isp", "city", "speed_mbps", "type"],
      measurementTechnique: "Anonim self-reporting + recency-weighted average",
      recordCount: opts.recordCount,
      temporalCoverage: "2026/..",
    }),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Internet", url: "/internet" },
    ]),
  );
}

// =============== FATURA (Bills) ===============
export function faturaSchemas(opts: { recordCount?: number } = {}) {
  const faqs: FaqItem[] = [
    {
      question: "Elektrik faturası ne kadar olmalı?",
      answer:
        "Hane büyüklüğü, ısıtma türü ve cihaz sayısına göre değişir. 3 kişilik bir hanede ortalama elektrik faturası 800-1500 TL bandında. gercekveri.com/fatura/elektrik sayfasında şehir bazlı medyanı gör.",
    },
    {
      question: "Doğalgaz faturası nasıl hesaplanıyor?",
      answer:
        "m³ bazlı tüketim × birim fiyat + sabit ücretler. Kış aylarında doğalgaz faturaları 3-5 kat artar. gercekveri.com gerçek aylık fatura değerlerini toplar, mevsimsellik dahil.",
    },
    {
      question: "Su faturası niye yüksek?",
      answer:
        "İSKİ, ASKİ, BUSKİ gibi belediye şirketlerine göre tarife değişir. Genelde 200-600 TL bandında. Sızıntı varsa anormal yüksek olabilir.",
    },
  ];

  return jsonLdGraph(
    datasetSchema({
      name: "Türkiye'de Faturalar — Anonim Gerçek Veri",
      description:
        "Elektrik, doğalgaz, su faturalarının şehir ve kullanım profiline göre gerçek aylık değerleri. Anonim self-reporting.",
      url: "/fatura",
      keywords: [
        "elektrik faturası",
        "doğalgaz faturası",
        "su faturası",
        "Türkiye fatura ortalaması",
        "şehir bazlı fatura",
        "mevsimsel fatura",
      ],
      variableMeasured: ["amount (TRY)", "utility_type", "city", "household_size", "month"],
      measurementTechnique: "Anonim self-reporting + mevsimsel normalizasyon",
      recordCount: opts.recordCount,
      temporalCoverage: "2026/..",
    }),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Faturalar", url: "/fatura" },
    ]),
  );
}

// =============== AIDAT (HOA Fees) ===============
export function aidatSchemas(opts: { recordCount?: number } = {}) {
  const faqs: FaqItem[] = [
    {
      question: "Türkiye'de site aidatı ne kadar?",
      answer:
        "Site özellikleri (havuz, fitness, güvenlik, otopark) ve şehre göre 300-3000 TL bandında. Lüks sitelerde 5000 TL+ olabilir. gercekveri.com/aidat şehir bazlı medyanı gösterir.",
    },
    {
      question: "Aidat artışı yasal mı?",
      answer:
        "KMK (Kat Mülkiyeti Kanunu) çerçevesinde yıllık aidat artışı genel kurul kararıyla yapılır. TÜFE üstü artışlar yasal olabilir ama itiraz hakkı vardır.",
    },
  ];

  return jsonLdGraph(
    datasetSchema({
      name: "Türkiye'de Aidat — Anonim Gerçek Veri",
      description: "Site/apartman aidatlarının şehir ve özellik bazında gerçek aylık değerleri.",
      url: "/aidat",
      keywords: ["site aidatı", "apartman aidatı", "Türkiye aidat", "şehir bazlı aidat"],
      variableMeasured: ["amount (TRY)", "city", "district", "amenities", "unit_count"],
      measurementTechnique: "Anonim self-reporting",
      recordCount: opts.recordCount,
      temporalCoverage: "2026/..",
    }),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Aidat", url: "/aidat" },
    ]),
  );
}

// =============== TEKSTIL ===============
export function tekstilSchemas(opts: { recordCount?: number } = {}) {
  const faqs: FaqItem[] = [
    {
      question: "Tekstil ürünlerinde gerçek fiyat ne kadar?",
      answer:
        "Mağaza ve marka bazında büyük farklar var. gercekveri.com/tekstil gömlek, pantolon, ayakkabı gibi temel ürünlerin gerçek satın alma fiyatlarını toplar.",
    },
  ];

  return jsonLdGraph(
    datasetSchema({
      name: "Türkiye'de Tekstil Fiyatları — Anonim Gerçek Veri",
      description: "Gömlek, pantolon, ayakkabı gibi tekstil ürünlerinin gerçek satın alma fiyatları.",
      url: "/tekstil",
      keywords: ["tekstil fiyatları", "giyim fiyatı", "ayakkabı fiyatı", "gömlek fiyatı"],
      variableMeasured: ["amount (TRY)", "product_type", "brand", "city"],
      measurementTechnique: "Anonim self-reporting",
      recordCount: opts.recordCount,
      temporalCoverage: "2026/..",
    }),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Tekstil", url: "/tekstil" },
    ]),
  );
}

// =============== DETAIL PAGE BREADCRUMBS ===============
// Sub-page breadcrumb preset'leri — kategori sayfasindan detay sayfasina yol.

export function cityDetailBreadcrumb(opts: {
  categoryLabel: string;
  categoryPath: string;
  cityName: string;
  citySlug: string;
}) {
  return breadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: opts.categoryLabel, url: opts.categoryPath },
    {
      name: opts.cityName,
      url: `${opts.categoryPath}/sehir/${opts.citySlug}`,
    },
  ]);
}

export function positionDetailBreadcrumb(opts: {
  positionName: string;
  positionSlug: string;
}) {
  return breadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Maaşlar", url: "/maaslar" },
    {
      name: opts.positionName,
      url: `/maaslar/${opts.positionSlug}`,
    },
  ]);
}

export function ispDetailBreadcrumb(opts: { ispName: string; ispSlug: string }) {
  return breadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Internet", url: "/internet" },
    { name: opts.ispName, url: `/internet/${opts.ispSlug}` },
  ]);
}

export function utilityDetailBreadcrumb(opts: {
  utilityLabel: string;
  utilitySlug: string;
}) {
  return breadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Faturalar", url: "/fatura" },
    {
      name: opts.utilityLabel,
      url: `/fatura/${opts.utilitySlug}`,
    },
  ]);
}

export function tekstilSubTypeBreadcrumb(opts: {
  subTypeLabel: string;
  subTypeSlug: string;
}) {
  return breadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Tekstil", url: "/tekstil" },
    {
      name: opts.subTypeLabel,
      url: `/tekstil/${opts.subTypeSlug}`,
    },
  ]);
}

// 4-level breadcrumb: Maaşlar → Position → City
export function positionCityBreadcrumb(opts: {
  positionName: string;
  positionSlug: string;
  cityName: string;
  citySlug: string;
}) {
  return breadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Maaşlar", url: "/maaslar" },
    { name: opts.positionName, url: `/maaslar/${opts.positionSlug}` },
    {
      name: `${opts.positionName} — ${opts.cityName}`,
      url: `/maaslar/${opts.positionSlug}/${opts.citySlug}`,
    },
  ]);
}

export function konutCityBreadcrumb(opts: { cityName: string; citySlug: string }) {
  return breadcrumbSchema([
    { name: "Ana Sayfa", url: "/" },
    { name: "Konut Enflasyon", url: "/konut-enflasyon" },
    {
      name: opts.cityName,
      url: `/konut-enflasyon/${opts.citySlug}`,
    },
  ]);
}

// =============== KONUT ENFLASYON (TCMB) ===============
export function konutEnflasyonSchemas() {
  const faqs: FaqItem[] = [
    {
      question: "Konut Fiyat Endeksi (KFE) nedir?",
      answer:
        "TCMB tarafından hesaplanan, Türkiye'deki konut fiyatlarının zamansal değişimini ölçen resmi endekstir. Ulusal ve bölgesel olarak yayınlanır.",
    },
    {
      question: "Konut TÜFE'yi yendi mi?",
      answer:
        "Bölgeye göre değişir. gercekveri.com/konut-enflasyon sayfasında 19 NUTS-2 bölgesi için TÜFE vs KFE karşılaştırması canlı olarak gösterilir.",
    },
    {
      question: "81 il için veri var mı?",
      answer:
        "TCMB bölgesel KFE'yi 19 NUTS-2 bölgesi için yayınlar. gercekveri.com 81 ili bu bölgelere eşleştirir, her il için dinamik karne sunar.",
    },
    {
      question: "Veri ne sıklıkla güncelleniyor?",
      answer: "TCMB EVDS API'sinden saatte bir çekilir. Resmi yayın aylıktır.",
    },
  ];

  return jsonLdGraph(
    datasetSchema({
      name: "Türkiye Konut Enflasyon Karnesi — TCMB Resmi Veri",
      description:
        "TCMB Konut Fiyat Endeksi (KFE) ve TÜFE karşılaştırması. 19 NUTS-2 bölgesi + 81 il dinamik eşleme.",
      url: "/konut-enflasyon",
      keywords: [
        "konut fiyat endeksi",
        "KFE",
        "TÜFE",
        "TCMB",
        "konut enflasyon",
        "Türkiye konut",
        "NUTS-2",
        "bölgesel konut",
      ],
      variableMeasured: ["KFE_yoy", "TUFE_yoy", "region_code", "city"],
      measurementTechnique: "TCMB EVDS API resmi veri",
      citation:
        "Türkiye Cumhuriyet Merkez Bankası, Konut Fiyat Endeksi (KFE), https://evds2.tcmb.gov.tr/",
      temporalCoverage: "2010-01/..",
    }),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Konut Enflasyon", url: "/konut-enflasyon" },
    ]),
  );
}
