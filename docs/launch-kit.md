# GerçekVeri Launch Kit

Bu doküman ilk kullanıcı kampanyası ve sosyal paylaşım için hazır şablonları
içerir. Hepsi Türkçe, gerçek olduğun gibi yaz — hype'lı dil itici geliyor.

## 1. Tweet / X paylaşımları

### A. Genel launch (tek tweet)

```
Türkiye'nin maaş, kira, internet ve aidat verilerini emlakçı/şirket
penceresinden değil, gerçek kullanıcılardan toplayan bir veri platformu
yaptım: gercekveri.com

%100 anonim. Hesap yok, e-posta yok. Sadece gerçek rakam.

Veri arttıkça doğruluk artıyor — sen de paylaş 🤝
```

### B. Şişkinlik tweet'i (en viral)

```
Türkiye'de kira ilanları gerçeği yansıtıyor mu?

Şu an İstanbul'da:
İlan medyanı: 60.154 TL
Gerçek ödenen: 47.000 TL
Şişkinlik: %28

7 ilden veri var, daha fazlası geliyor 👇
gercekveri.com/kira/sisme
```

(Sayılar canlı veriden — paylaşım sırasında güncel rakamı bak.)

### C. Maaş kıyas tweet'i

```
Maaşının Türkiye ortalamasının üstünde mi altında mı olduğunu 30 saniyede
gör — pozisyon + şehir + tutar yaz, anonim verilerden hesaplanmış medyan
ile kıyasla.

gercekveri.com/karsilastir/maas
```

### D. Sektörel tweet (tekstil B2B)

```
Tekstil sektöründe fiyatlar telefon üzerinden geziyor.

Bursa'da boyahane kg fiyatı, İstanbul'da dikim parça fiyatı, Çorlu denim
kesimi — hepsi piyasada belirsiz.

Anonim üretici verisinden yeni bir referans katmanı: gercekveri.com/tekstil

Sektör arkadaşlarına da yolla 🧵
```

### E. AI özet teaser

```
gercekveri.com'da her şehrin maaş/kira sayfasının başında "AI Yorumu" var.

Veriden ne çıkıyor, neyi gözden kaçırma, hangi açı eksik — Gemini'nin
agregat istatistiklerden çıkardığı analiz.

Tablodan değil, hikâyeden okuyacaksın.
```

## 2. LinkedIn (uzun-form)

### F. LinkedIn launch post

```
Bir hobi projem var: gercekveri.com.

Türkiye'de maaş tablolarını, kira ortalamalarını, fatura sayılarını arıyoruz
ama hep şirket beklentisi, emlakçı ilanı veya tahmini rakam buluyoruz. Ben
şunu yapmak istedim: gerçekten ödeyen / kazanan kullanıcı ne diyor?

Platform tamamen anonim. E-posta, hesap, telefon yok. Bir paylaşım
yaparken sadece kategori (maaş/kira/aidat/fatura/internet/tekstil), şehir
ve tutar gibi tanımlayıcı olmayan veriler işleniyor. IP adresi spam
korumak için tek yönlü hash'leniyor — orijinal IP saklanmıyor.

Şu anda canlı:
- 6 kategori, 81 ilde toplanan veri
- Şehir bazlı medyan + ortalama + dağılım grafiği
- "Sen nerede duruyorsun?" anlık karşılaştırma
- Türkiye geneli ısı haritası
- AI yorumu (Gemini, sadece agregat sayılar)
- Kira için "İlan vs gerçek" şişkinlik paneli
- Güven skoru sistemi (sayfa başına)

Veriyi büyütmek için sektör / lokasyon arkadaşlarınla paylaşabilirsen ben
mutlu olurum. Geri bildirim için DM açık.

#gercekveri #ürün #veri #anonim
```

## 3. Reddit / forum

### G. r/Turkey veya r/CodingTR

```
[Pet project] Türkiye'nin anonim veri platformu — gercekveri.com

Selam, son birkaç haftadır Next.js + Postgres + Gemini ile bir
"Türkiye'nin gerçek verisi" platformu yapıyorum.

Stack: Next.js 16 + React 19 + Tailwind 4 + Prisma 7 + Neon Postgres +
Vercel Hobby + Gemini Flash Lite (free tier). Tüm yığın $0.

Özellikler:
- 6 kategori (maaş, kira, internet, aidat, fatura, tekstil B2B)
- Anonim paylaşım (IP/UA hash + spam guard, hesap yok)
- 81 il × 6 kategori ısı haritası
- Şişkinlik paneli (kira için ilan vs gerçek)
- AI özetler (free Gemini quota)
- Programmatic SEO (~150 sayfa, /istanbul-kira-endeksi gibi rewrite)

Geri bildirime açığım — ne çalışmıyor / neresi sıkıcı / hangi kategori
bence önce gelmeli, hepsini duymak isterim.
```

## 4. WhatsApp / kişisel network mesajı

### H. Kısa mesaj template'i

```
Selam! Bir hobi projem var, dakikanı alır. gercekveri.com — Türkiye'de
maaş, kira, fatura vs. anonim toplanan gerçek rakamların platformu.

Sen sadece bir veri (ör. son ödediğin kira) paylaşırsan, sayfa daha
hassas oluyor. Hesap yok, e-posta yok, hiçbir şey kayıt edilmiyor.

Linki yolladım, beklerim 🤝
```

### I. Sektör (tekstil) için özel

```
Selam, bir veri platformu yapıyorum — gercekveri.com/tekstil

Boyahane / kesim / dikim fiyatları piyasada şu an telefon üzerinden
yürüyor. Anonim olarak (firma adı yok) kg veya parça başına fiyat
paylaşırsan herkesin yararına bir referans çıkıyor.

5 dakikalık iş. Yardımcı olur musun?
```

## 5. Hangi kanaldan başlayalım?

Önerim sıralama:
1. **WhatsApp / kişisel network** — 5-10 yakın, "ilk veriyi sen at" kıvılcımı.
   Gerçek-vs-ilan paneli için kira veya tekstil ilk hedef.
2. **Twitter/X** (B-tipi şişkinlik tweet) — paylaşım kartı (OG) hazır,
   `gercekveri.com/api/og/inflation?city=istanbul` şeklinde sosyal
   medyaya direkt çekiyor.
3. **LinkedIn (F)** — sektörel + ürün arkadaşları için, B2B akış.
4. **Reddit (G)** — son aşama, sadece veri çoğaldıktan sonra.

## 6. Sayım / takip

Vercel Analytics ücretsiz tier ziyaret sayısını gösterir. Adsense onayı
sonrası RPM gözle takip edilir.

İlk 7 gün hedef: 30+ gerçek paylaşım (demo seed dışı). Trust score badge'leri
yeşile döner, harita boş illerden sıyrılır, "Şu an ne oluyor?" panelinde
delta sayıları görünür.
