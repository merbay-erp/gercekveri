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

// =============== USD/TRY ===============
export function usdTrySchemas(opts: {
  lastValue?: number;
  lastDate?: string;
}) {
  const faqs: FaqItem[] = [
    {
      question: "Dolar TL ne kadar?",
      answer:
        opts.lastValue
          ? `Türkiye Cumhuriyet Merkez Bankası (TCMB) son verisine göre 1 USD ≈ ${opts.lastValue.toFixed(4)} TL (${opts.lastDate ?? "güncel"}). Veri TCMB EVDS API'den saatte bir çekilir.`
          : "TCMB Konjonktür Bülteni'nde günlük yayınlanan resmi USD/TL satış kurudur. Bu sayfada anlık değer + 12 ay tarihçe gösterilir.",
    },
    {
      question: "TCMB USD kuru neden değişir?",
      answer:
        "Döviz arz-talep, faiz farkı, enflasyon beklentisi, dış ticaret dengesi ve uluslararası para piyasaları kuru günlük belirler. TCMB serbest kur sistemi uygular; müdahale ancak kriz anlarında olur.",
    },
    {
      question: "Hangi banka USD kuru en iyi?",
      answer:
        "TCMB kuru referans alınır ama her bankanın 'alış' ve 'satış' kuru farklıdır. Ortalama makas (spread) 0.05-0.20 TL bandındadır. Yüksek hacimli işlemde bankanızla pazarlık edilebilir.",
    },
    {
      question: "Bu sayfa ne sıklıkla güncellenir?",
      answer:
        "TCMB EVDS API'sinden saatte bir otomatik fetch + DB cache. 1 saatlik gecikme dışında anlık veri.",
    },
  ];

  return jsonLdGraph(
    datasetSchema({
      name: "USD/TRY Döviz Kuru Tarihçesi — TCMB Resmi Veri",
      description:
        "Türkiye Cumhuriyet Merkez Bankası (TCMB) tarafından yayınlanan günlük USD/TL satış kurunun 12 aylık tarihçesi + son değer.",
      url: "/doviz/usd-try",
      keywords: [
        "dolar tl",
        "usd try",
        "tcmb dolar",
        "dolar kuru",
        "dolar fiyatı",
        "anlık dolar",
        "döviz kuru",
        "merkez bankası dolar",
      ],
      variableMeasured: ["USD/TRY satış kuru"],
      measurementTechnique:
        "TCMB EVDS API serisi TP.DK.USD.S (USD/TL satış kuru) hourly fetch",
      citation:
        "Türkiye Cumhuriyet Merkez Bankası, USD/TL Satış Kuru (TP.DK.USD.S), https://evds2.tcmb.gov.tr/",
      temporalCoverage: "2024/..",
    }),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Döviz", url: "/doviz" },
      { name: "USD/TRY", url: "/doviz/usd-try" },
    ]),
  );
}

// =============== EUR/TRY ===============
export function eurTrySchemas(opts: {
  lastValue?: number;
  lastDate?: string;
}) {
  const faqs: FaqItem[] = [
    {
      question: "Euro TL ne kadar?",
      answer:
        opts.lastValue
          ? `TCMB son verisine göre 1 EUR ≈ ${opts.lastValue.toFixed(4)} TL (${opts.lastDate ?? "güncel"}). Veri saatte bir TCMB EVDS API'den çekilir.`
          : "TCMB Konjonktür Bülteni'nde günlük yayınlanan resmi EUR/TL satış kurudur. Bu sayfada anlık değer + tarihçe gösterilir.",
    },
    {
      question: "Euro neden USD'den farklı hareket eder?",
      answer:
        "Avrupa Merkez Bankası (ECB) ve Fed'in farklı para politikaları, Eurozone ekonomisi ile ABD ekonomisinin asenkron seyri EUR/USD paritesi üzerinden TL'ye yansır.",
    },
    {
      question: "Bu sayfa güncel mi?",
      answer: "TCMB EVDS API'den saatte bir fetch — 1 saatlik gecikme dışında anlık.",
    },
  ];

  return jsonLdGraph(
    datasetSchema({
      name: "EUR/TRY Döviz Kuru Tarihçesi — TCMB Resmi Veri",
      description:
        "TCMB tarafından yayınlanan günlük EUR/TL satış kurunun 12 aylık tarihçesi + son değer.",
      url: "/doviz/eur-try",
      keywords: [
        "euro tl",
        "eur try",
        "tcmb euro",
        "euro kuru",
        "euro fiyatı",
        "anlık euro",
        "euro tl kuru",
      ],
      variableMeasured: ["EUR/TRY satış kuru"],
      measurementTechnique:
        "TCMB EVDS API serisi TP.DK.EUR.S hourly fetch",
      citation:
        "Türkiye Cumhuriyet Merkez Bankası, EUR/TL Satış Kuru (TP.DK.EUR.S), https://evds2.tcmb.gov.tr/",
      temporalCoverage: "2024/..",
    }),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Döviz", url: "/doviz" },
      { name: "EUR/TRY", url: "/doviz/eur-try" },
    ]),
  );
}

// =============== Döviz hub ===============
export function dovizHubSchemas() {
  const faqs: FaqItem[] = [
    {
      question: "Bu sayfadaki döviz verisi nereden geliyor?",
      answer:
        "Tüm değerler Türkiye Cumhuriyet Merkez Bankası (TCMB) Elektronik Veri Dağıtım Sistemi (EVDS) resmi API'sinden çekilir. Saatte bir otomatik güncellenir.",
    },
    {
      question: "Bankalardaki kur neden farklı?",
      answer:
        "TCMB referans satış kurunu yayınlar. Bankalar buna kendi 'alış' ve 'satış' marjını ekler (0.05-0.20 TL spread). Bu sayfada TCMB resmi kuru görüntülenir.",
    },
    {
      question: "GBP, CHF, JPY kuru var mı?",
      answer:
        "Şu an USD ve EUR aktif. İlerleyen sürümlerde diğer dövizler eklenecek. TCMB API'den çekilen tüm dövizler için sayfa otomatik üretilebilir.",
    },
  ];

  return jsonLdGraph(
    datasetSchema({
      name: "TCMB Döviz Kurları — USD, EUR Resmi Veri",
      description:
        "TCMB EVDS API'den çekilen günlük USD/TL ve EUR/TL satış kurları. Anlık değer + 12 aylık tarihçe + yıllık değişim oranları.",
      url: "/doviz",
      keywords: [
        "döviz",
        "tcmb döviz",
        "döviz kuru",
        "dolar euro",
        "anlık döviz",
        "merkez bankası kur",
      ],
      variableMeasured: ["USD/TRY", "EUR/TRY"],
      measurementTechnique: "TCMB EVDS API hourly fetch",
      citation:
        "Türkiye Cumhuriyet Merkez Bankası EVDS, https://evds2.tcmb.gov.tr/",
      temporalCoverage: "2024/..",
    }),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Döviz", url: "/doviz" },
    ]),
  );
}

// =============== Faiz ===============
export function faizSchemas(opts: {
  lastValue?: number;
  lastDate?: string;
}) {
  const faqs: FaqItem[] = [
    {
      question: "Politika faizi nedir?",
      answer:
        opts.lastValue
          ? `TCMB politika faizi (1 hafta repo / APİ fonlama oranı) şu an %${opts.lastValue.toFixed(2)} seviyesinde (${opts.lastDate ?? "güncel"}). Bu, bankaların TCMB'den borçlandığı temel maliyettir.`
          : "Türkiye Cumhuriyet Merkez Bankası'nın bankalara açtığı kısa vadeli fonlama maliyetidir. Mevduat, kredi ve döviz piyasası üzerindeki en güçlü etken.",
    },
    {
      question: "Faiz neden artar/azalır?",
      answer:
        "Enflasyon yüksekse TCMB faizi artırır (sıkılaşma) → kredi pahalanır → harcama azalır → talep enflasyonu düşer. Enflasyon düşükse tersi olur.",
    },
    {
      question: "Faiz mevduata nasıl yansır?",
      answer:
        "Bankalar mevduat faizi politika faizinin %80-110 bandında belirler. Politika %50 ise mevduat genelde %40-55 bandında olur. Vergi (%5-15) sonrası net getirir.",
    },
    {
      question: "Bu sayfa güncel mi?",
      answer:
        "TCMB EVDS API'sinden saatte bir fetch + DB cache (TP.APIFON4 serisi). 1 saatlik gecikme dışında anlık veri.",
    },
  ];

  return jsonLdGraph(
    datasetSchema({
      name: "TCMB Politika Faizi Tarihçesi — Resmi Veri",
      description:
        "Türkiye Cumhuriyet Merkez Bankası (TCMB) APİ Fonlama Oranı (1 hafta repo) son değer + 12 aylık tarihçe. Mevduat, kredi ve döviz piyasası temel referansı.",
      url: "/faiz",
      keywords: [
        "tcmb faiz",
        "politika faizi",
        "merkez bankası faiz",
        "api fonlama",
        "1 hafta repo",
        "anlık faiz",
        "faiz oranı",
      ],
      variableMeasured: ["APİ Fonlama Oranı (1 hafta repo)"],
      measurementTechnique: "TCMB EVDS API serisi TP.APIFON4 hourly fetch",
      citation:
        "Türkiye Cumhuriyet Merkez Bankası, APİ Fonlama (TP.APIFON4), https://evds2.tcmb.gov.tr/",
      temporalCoverage: "2024/..",
    }),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "Faiz", url: "/faiz" },
    ]),
  );
}

// =============== TÜFE ===============
export function tufeSchemas(opts: {
  yoyPct?: number;
  lastDate?: string;
}) {
  const faqs: FaqItem[] = [
    {
      question: "TÜFE nedir?",
      answer:
        "Tüketici Fiyat Endeksi — bir tüketicinin satın aldığı tipik mal/hizmet sepetinin zaman içindeki fiyat değişimi. TÜİK yayınlar, TCMB EVDS API üzerinden de erişilebilir. Enflasyon ölçütüdür.",
    },
    {
      question: "Yıllık TÜFE şu an ne kadar?",
      answer:
        opts.yoyPct !== undefined
          ? `Son veriye göre yıllık TÜFE artışı %${opts.yoyPct.toFixed(2)} (${opts.lastDate ?? "güncel"}). Bu, 1 yıl önce 100 TL olan bir sepetin bugün ne kadar olduğunu gösterir.`
          : "TÜİK her ayın 3. iş günü açıklar. gercekveri.com saatte bir TCMB EVDS API'den çeker.",
    },
    {
      question: "TÜFE ve ÜFE farkı?",
      answer:
        "TÜFE tüketici (perakende), ÜFE üretici (toptan) fiyatlarını ölçer. Genelde ÜFE daha volatil ve TÜFE'den önce hareket eder.",
    },
    {
      question: "Çekirdek TÜFE (C) nedir?",
      answer:
        "Enerji, gıda, alkol-tütün ve altın hariç tutulan, daha az dalgalı bir endeks. Para politikasında daha güvenilir referans olarak kullanılır.",
    },
    {
      question: "Konut TÜFE'nin altında mı kalır?",
      answer:
        "gercekveri.com/konut-enflasyon sayfasında 19 NUTS-2 bölgesi için TÜFE vs KFE karşılaştırması canlı gösterilir.",
    },
  ];

  return jsonLdGraph(
    datasetSchema({
      name: "Türkiye TÜFE Enflasyon Tarihçesi — TCMB Resmi Veri",
      description:
        "Tüketici Fiyat Endeksi (TÜFE) son değer, yıllık değişim ve 12 aylık tarihçe. TÜİK kaynak, TCMB EVDS API üzerinden saatlik fetch.",
      url: "/tufe",
      keywords: [
        "tüfe",
        "enflasyon",
        "tüfe oranı",
        "yıllık enflasyon",
        "tcmb enflasyon",
        "tüik tüfe",
        "fiyat artışı",
      ],
      variableMeasured: ["TÜFE genel endeks", "Yıllık değişim (%)"],
      measurementTechnique:
        "TCMB EVDS API serisi TP.FE.OKTG01 (TÜFE) hourly fetch",
      citation:
        "TÜİK / TCMB EVDS, TÜFE Genel Endeks (TP.FE.OKTG01), https://evds2.tcmb.gov.tr/",
      temporalCoverage: "2024/..",
    }),
    faqSchema(faqs),
    breadcrumbSchema([
      { name: "Ana Sayfa", url: "/" },
      { name: "TÜFE", url: "/tufe" },
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
