# GerçekVeri

GerçekVeri, web sitesi, IBAN, telefon ve ilan bağlantılarındaki risk sinyallerini açıklanabilir bir kartta gösteren; dolandırıcılıktan korunma rehberleri yayımlayan bağımsız bir Türkçe güvenlik platformudur.

Canlı adres: [gercekveri.com](https://gercekveri.com)

## Ürün yüzeyleri

- Dört sorgu türü: web sitesi, IBAN, telefon ve ilan
- Açıklanabilir 0–100 risk skoru; her sinyal ayrı görünür
- Anonim topluluk bildirimi, oran sınırlama ve PII maskeleme
- Kaynaklı korunma rehberleri, yazar/inceleme tarihi ve resmi başvurular
- İtiraz ve kayıt düzeltme kanalı
- AdSense için araç ekranı / yayıncı içeriği ayrımı
- Metadata, Article/FAQ/Breadcrumb JSON-LD, temiz sitemap ve robots politikası

## Risk motoru

Web sorgusu şu kaynakları hata toleranslı ve paralel biçimde değerlendirir:

- ICANN uyumlu RDAP: alan adı kayıt zamanı
- Google Cloud Web Risk: ticari kullanıma uygun URL tehdit listesi
- Internet Archive CDX: ilk arşiv geçmişi
- Cloudflare DNS-over-HTTPS: A, MX ve DMARC kayıtları
- ipwho.is: barındırma bağlamı
- GerçekVeri topluluk bildirimleri

Bir kaynağın yanıt vermemesi güvenli sonuç sayılmaz. IBAN ve telefon gibi yalnızca biçim/hat bağlamı üreten sorgular, ihbar yoksa `UNKNOWN` bandında kalır.

## Teknoloji

| Katman | Seçim |
|---|---|
| Uygulama | Next.js 16 App Router, React 19, TypeScript |
| UI | Tailwind CSS 4, shadcn/ui, Lucide |
| Veri | PostgreSQL, Prisma 7, pg adapter |
| AI özeti | Google Gemini; anahtar yoksa kural tabanlı yedek |
| Form | React Hook Form, Zod |
| Dağıtım | Vercel + harici PostgreSQL |

## Yerel geliştirme

Prisma 7 nedeniyle Node.js `20.19+`, `22.12+` veya `24+` kullan.

```bash
pnpm install
cp .env.example .env.local
pnpm db:generate
pnpm dev
```

Kalite kapıları:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Gerekli ortam değişkenleri

Asgari:

- `DATABASE_URL`
- `HASH_SECRET`
- `NEXT_PUBLIC_SITE_URL`

İsteğe bağlı yetenekler:

- `GOOGLE_WEB_RISK_API_KEY`
- `GOOGLE_GENERATIVE_AI_API_KEY`
- `NEXT_PUBLIC_ADSENSE_CLIENT_ID`

Tam liste ve örnek değerler için [.env.example](./.env.example) dosyasını kullan.

## İçerik ve indeksleme ilkesi

Arama motorlarının indekslediği ana yüzeyler; ana sayfa, kurumsal/yasal sayfalar ve özgün rehberlerdir. Kullanıcı tarafından oluşturulan sorgu sonuçları, ihbar formu ve topluluk akışı `noindex` olarak işaretlenir ve sitemap'e alınmaz. AdSense betiği de bu araç ekranlarında yüklenmez.

Rehberlerin tümü:

- belirli bir kullanıcı sorusunu çözer,
- resmi/birincil kaynaklara bağlantı verir,
- yazar ve son inceleme tarihini gösterir,
- aracın sınırlarını ve resmi başvuru yollarını açıklar.

## Sorumluluk sınırı

Risk skoru bilgilendirme ve karar desteği amaçlıdır. Mahkeme kararı, resmi suç tespiti veya ödeme güvenliği garantisi değildir. Maddi kayıp durumunda banka ve yetkili resmi mercilere başvurulmalıdır.
