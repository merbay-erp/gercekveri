# AdSense yeniden inceleme hazırlığı

Bu belge kod tarafındaki iyileştirmeler ile yayın sonrası yapılması gereken manuel kontrolleri ayırır. AdSense onayı garanti edilemez; nihai karar Google'a aittir.

## Kodda tamamlananlar

- Altı özgün, kaynaklı ve kapsamlı rehber
- Rehber merkezi ve ana sayfadan güçlü iç bağlantılar
- Makale yazarı, yayın/inceleme tarihi, resmi kaynaklar ve düzeltme kanalı
- Article, FAQ, Breadcrumb ve ItemList JSON-LD
- Kullanıcı sorgu sonuçları, ihbar formu ve UGC akışı için `noindex`
- Bu araç sayfalarının sitemap'ten çıkarılması
- AdSense betiğinin araç/form/UGC rotalarında yüklenmemesi
- AdSense hesap meta etiketi ve geçerli `ads.txt`
- Google Consent Mode v2 varsayılanının etiketlerden önce kurulması
- Google Safe Browsing yerine ticari kullanıma uygun Google Cloud Web Risk
- `/_next/` kaynaklarını engellemeyen crawler politikası
- Eski ürün URL rewrite'larının ve içerik tutarsızlıklarının kaldırılması

## Deploy sonrasında kontrol et

1. Üretim ortamında `NEXT_PUBLIC_SITE_URL=https://gercekveri.com` olmalı.
2. `GOOGLE_WEB_RISK_API_KEY` Google Cloud'da etkin Web Risk API anahtarı olmalı.
3. `/robots.txt`, `/sitemap.xml`, `/ads.txt` ve rehber sayfaları 200 dönmeli.
4. Sayfa kaynağında `google-adsense-account` meta etiketi görünmeli.
5. Sorgu sonucu ve `/ihbar` sayfasında AdSense betiği bulunmamalı.
6. Rehberlerde başlık, açıklama, canonical ve JSON-LD doğrulanmalı.
7. Kırık iç/dış bağlantı ve boş sayfa kalmamalı.
8. Mobil ve masaüstünde Lighthouse/PageSpeed kontrolü yapılmalı.

## AdSense panelinde yapılacaklar

1. **Privacy & messaging** bölümünden Google'ın sertifikalı European regulations CMP mesajını yapılandır.
2. Auto Ads içinde `/sorgu/*`, `/ihbar` ve `/son-dolandiriciliklar` URL'lerini ayrıca hariç tut.
3. Google Search Console'da yeni sitemap'i gönder ve önemli rehber URL'lerini incelet.
4. İçerik sayfalarının indekslenmesini bekle; boş veya hatalı dağıtım kalmadığını kontrol et.
5. Ancak bundan sonra “sorunları giderdim” onayını vererek yeniden inceleme iste.

## Resmi kaynaklar

- [Make sure your site's pages are ready for AdSense](https://support.google.com/adsense/answer/7299563)
- [Your AdSense account wasn't approved](https://support.google.com/adsense/answer/81904)
- [Google Publisher Policies](https://support.google.com/adsense/answer/10502938)
- [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Certified CMP requirements for publishers](https://support.google.com/adsense/answer/13554116)
