# GerçekVeri

> **Türkiye'nin anonim gerçek veri platformu.**
> Maaş, kira, internet ve daha fazlası — gerçek kullanıcılardan, gerçek verilerle.

[gercekveri.com](https://gercekveri.com) · Anonim katkı, AI insight'lar, programmatic SEO sayfaları, gerçek istatistikler.

## Vizyon

Tek cümle: **"Türkiye'nin gerçek hayat verisinin tek kaynağı."** Anonim gönderim, agresif analiz, ücretsiz erişim.

## Hızlı başlangıç

```bash
# 1. Bağımlılıklar
pnpm install

# 2. Ortam değişkenleri
cp .env.example .env.local
# DATABASE_URL, HASH_SECRET değerlerini doldur (Neon free tier öneririz)

# 3. Veritabanı şeması + temel veri
pnpm db:push      # Schema → DB
pnpm db:seed      # 81 il, ilçeler, kategoriler

# 4. Geliştirme sunucusu
pnpm dev          # http://localhost:3000
```

## Teknoloji yığını

| Katman | Seçim | Not |
|---|---|---|
| Framework | **Next.js 16** App Router + Turbopack | Server Components + Server Actions |
| UI | **Tailwind 4** + **shadcn/ui** + Framer Motion | OKLCH renkler, dark mode |
| State | TanStack Query + Zustand | sunucu state + lightweight client state |
| DB | **PostgreSQL** + Prisma 7 + pg adapter | serverless-uyumlu adapter pattern |
| Form | react-hook-form + Zod 4 | şema-merkezli validasyon |
| Cache | Upstash Redis (HTTP) | edge-friendly |
| Queue | Upstash QStash | sunucusuz HTTP cron / job |
| AI | Google Gemini Flash (free tier) | insight summary üretimi |
| Charts | Recharts | server-friendly |

Tüm seçimler **$0 free tier** üzerinde duruyor.

## Klasör yapısı

```
src/
  app/                       # Next.js routes
    (main)/                  # public site (header + footer)
      page.tsx               #   /
      maaslar/page.tsx       #   /maaslar
      maaslar/yeni/page.tsx  #   /maaslar/yeni
    layout.tsx               # root layout (providers, fonts, metadata)
    not-found.tsx            # global 404
  components/
    layout/                  # site-header, site-footer
    ui/                      # shadcn primitives
    providers.tsx            # QueryClient + ThemeProvider + Toaster
    theme-toggle.tsx
    ad-slot.tsx              # AdSense-safe placeholder
  modules/                   # bir modül = bir kategori
    maas/                    #   salary modülü (template)
      config.ts              #     module identity
      schema.ts              #     zod input schema
      types.ts               #     domain types
      positions.ts           #     curated job titles
      server/
        actions.ts           #     server actions ("use server")
        queries.ts           #     read queries
      components/
        maas-form.tsx
        maas-card.tsx
        maas-list.tsx
        maas-stats.tsx
  lib/
    db.ts                    # Prisma client (adapter pattern)
    env.ts                   # zod-validated env
    site-config.ts           # siteConfig + categories + nav
    cities.ts                # 81 il
    money.ts                 # TRY formatters
    fingerprint.ts           # hash IP / UA — anonim
    utils.ts                 # cn helper
  generated/prisma/          # auto — Prisma client output
prisma/
  schema.prisma              # DB schema
  seed.ts                    # cities + categories + districts
```

## Mimarinin altın kuralı: **modül = kategori**

Her veri kategorisi (`maas`, `kira`, `internet`, `aidat`, ...) `src/modules/<slug>/` altında **kendi kendine yeten** bir modüldür.
- Generic schema (`Submission` + `data: Json` + opsiyonel `Category` + `CategoryField`) sayesinde yeni kategori eklemek **şemayı değiştirmeden** çalışır.
- Yeni modül eklemek = `maas` klasörünü kopyala, `config.ts` + `schema.ts` + `positions.ts` (ya da eşdeğeri) ayarla.
- Shared layer'larda (lib, components/ui) modül-spesifik kod **yasak**.

## Faz planı

| Faz | Hedef | Süre |
|---|---|---|
| 0 | İskelet + maaş submission/listing | 1-2 hf ✅ |
| 1 | Programmatic SEO sayfaları (şehir/pozisyon), chartlar, analytics motoru | 2-3 hf |
| 2 | Moderation pipeline + trust score + kira modülü | 2-3 hf |
| 3 | Internet modülü + viral compare + admin panel | 3-4 hf |
| 4 | AI insight pipeline + AdSense başvurusu + launch | 2-3 hf |

## Komutlar

| Komut | Yapar |
|---|---|
| `pnpm dev` | Geliştirme sunucusu (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Production server |
| `pnpm typecheck` | TypeScript kontrol |
| `pnpm lint` | ESLint |
| `pnpm db:generate` | Prisma client üret |
| `pnpm db:push` | Schema → DB (migrasyon dosyası yaratmadan) |
| `pnpm db:migrate` | Migrasyon dosyası oluştur + uygula |
| `pnpm db:studio` | Prisma Studio (DB GUI) |
| `pnpm db:seed` | Temel veri (iller + kategoriler) |

## Ortam değişkenleri

Tam liste için `.env.example` dosyasına bak. Asgari (MVP):

- `DATABASE_URL` — Postgres connection string (Neon → free tier)
- `HASH_SECRET` — IP/fingerprint hash için 32 byte hex (`openssl rand -hex 32`)
- `NEXT_PUBLIC_SITE_URL` — canonical URL (`https://gercekveri.com`)

Faz 1+ için: `UPSTASH_REDIS_*`, `QSTASH_*`, `GOOGLE_GENERATIVE_AI_API_KEY`, `ADMIN_BOOTSTRAP_*`.

## Deployment

İki yol:
- **Vercel hobby** — `vercel deploy`. Daha pürüzsüz; Prisma + Neon out-of-the-box.
- **Cloudflare Pages** — `@opennextjs/cloudflare` adapter. Tek ekosistem (DNS + CDN + R2 + Pages); Prisma için Neon driver adapter gerekir.

## Gizlilik & yasal

- **%100 anonim** — kayıt, e-posta, hesap istemiyoruz.
- IP ve user agent **tek yönlü hash**leniyor (`HASH_SECRET` ile salted SHA-256). Ham PII saklanmıyor.
- KVKK + GDPR uyumlu mimari hedefleniyor; k-anonymity (özellikle maaş için: şirket+pozisyon+şehir kombinasyonu fişleyebilir) Faz 1'de uygulanacak.

## Lisans

Bu repo şimdilik özel.
