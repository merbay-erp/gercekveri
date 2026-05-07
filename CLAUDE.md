# CLAUDE.md — gercekveri.com için Claude Code rehberi

Bu dosyayı her oturum başında otomatik okursun. Projenin **konvansiyonları ve davranış kalıpları** burada — kişisel/sürekli memory için `memory/MEMORY.md`'ye bak.

## Proje özeti

**gercekveri.com** — Türkiye'nin anonim gerçek veri platformu. Maaş, kira, internet vs. anonim olarak paylaşılır, agregat istatistikler + AI özetler + programmatic SEO sayfaları üretilir.

Hedef: $0 bütçe ile ölçeklenebilir mimari. Solo dev. Faz planlı geliştirme.

Tüm vizyon ve faz planı için **README.md**.

## Mutlak kurallar

1. **Modül izolasyonu**: `src/modules/<slug>/` dışına modül-spesifik kod yazma. Lib/components/ui'da `if (type === "SALARY")` görürsen yanlış yerdeyiz.
2. **Anonimlik**: Submission tablosunda PII yok. IP/UA daima `lib/fingerprint.ts` üzerinden hash'lenir. Bu mimari karar — değişmez.
3. **Free-tier first**: Yeni bir servis/dependency önermeden önce free tier var mı kontrol et. Kullanıcı $0 bütçeyle çalışıyor (memory'ye bak).
4. **AdSense güvenliği**: Reklam = sadece `<AdSlot>` bileşeni. Yanıltıcı buton, tıklama tuzağı, "download" gibi ifadeler yasak.
5. **KVKK + k-anonymity**: Şehir + şirket + pozisyon kombinasyonu birini fişler. Public sayfalarda az veri varsa rich render etmek yerine 404'e düş — thin content cezası + privacy.

## Yığın notları (kafa karıştırıcı kısımlar)

- **Next.js 16** + Turbopack default. App Router. `revalidate = 60` ile ISR.
- **Tailwind 4** — config CSS'te (`globals.css`'teki `@theme inline { ... }`). PostCSS + `@import "tailwindcss"` paterni.
- **shadcn 4.x** — `@base-ui/react` kullanıyor (Radix değil). `<Button asChild>` **yok** — onun yerine `buttonVariants(...)` className helper'ı `<Link>`'e ver.
- **Prisma 7** — `url` artık schema'da değil, `prisma.config.ts` migrasyon için, runtime için `lib/db.ts`'deki `PrismaPg` adapter. Generated client `src/generated/prisma/client` altında.
- **Zod 4** — `error.flatten()` yerine `z.flattenError(err)`, `error.format()` yerine `z.treeifyError(err)`. `z.coerce.number()` input type `unknown` → react-hook-form ile birlikte resolver cast lazım (bkz. `maas-form.tsx`).
- **Path'te boşluk var**: `/Volumes/Mustafa ERBAY/mac projeler /gercekveri`. Bash komutlarında daima quote.

## Yeni kategori modülü ekleme reçetesi

```
src/modules/<slug>/
  config.ts          # module identity (name, basePath, ...)
  schema.ts          # zod input schema (form alanları)
  types.ts           # domain types (data payload + view + stats)
  server/
    actions.ts       # createXxxSubmission server action
    queries.ts       # listXxx + getXxxStats
  components/
    xxx-form.tsx     # client form
    xxx-card.tsx     # tek submission kartı
    xxx-list.tsx     # liste sarmalayıcı
    xxx-stats.tsx    # avg/median/p25/p75 panel
src/app/(main)/<slug-plural>/
  page.tsx           # liste + stats + ad slot
  yeni/page.tsx      # form
```

Generic Submission tablosu yeterli — `data: Json` ile esnek alanlar, `amount` + `currency` ile hızlı sorgulama. `categoryId` nullable (seed olmasa da çalışır).

## Komut alışkanlıkları

- Build verifyen değişiklikten sonra: `pnpm typecheck && pnpm build`.
- Şema değişikliği: `pnpm db:generate` zorunlu (Prisma 7 generated client kullanıyor).
- Veri ekleyince: `pnpm db:push` (yeni alanlar) + `pnpm db:seed` (yeni kategori).
- Lint sessizce hata gizleyebilir — `tsc --noEmit` ana doğrulama.

## Stil

- Türkçe UI metni, İngilizce kod yorumları (kod içindeki çok kısa açıklayıcı yorumlar Türkçe olabilir, ama JSDoc İngilizce).
- Comment yazma alışkanlığı: sadece **WHY**'ı açıklayan, gizli kısıtı/karar sebebini söyleyen kısa yorum. WHAT'i isim söylesin.
- `data-slot` attribute'larını shadcn pattern'inden gelen yerlerde koru.

## Memory

`memory/MEMORY.md` dosyasını oku. İçinde kullanıcı tercihleri, faz kararları, stack rationale var. Yeni karar/öğrenme oluştuğunda **memory'yi güncelle**, yeniden tartışma.
