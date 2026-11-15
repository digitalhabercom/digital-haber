# digitalhaber v5 güncellemesi

## Yükleme
Zip'ten çıkan `guncelleme` klasörünün İÇİNDEKİLERİ (src, public, scripts, astro.config.mjs, package.json, README.md) GitHub'a sürükle, tek commit yap. Klasörün kendisini değil. Cloudflare 1-2 dk içinde yayınlar.
`public/og-default.svg` eski dosyası varsa elle sil.

## Yenilikler
- **İngilizce site:** /en/ altında (haberler, kategoriler, arama, hakkında, iletişim, gizlilik). Panelde "Haberler (İngilizce)" bölümünden eklenir. Her İngilizce haberde "Türkçe haberin karşılığı" seçilirse iki sayfa dil bağlantısıyla (hreflang) birbirine bağlanır.
- **Dil önerisi:** Tarayıcı dili Türkçe değilse üstte "Read in English" şeridi çıkar (zorla yönlendirme yok, arama botlarını bozmaz).
- **Arama motorları:** IndexNow (Bing, Yandex, Naver, Seznam'a yeni haberler build sırasında otomatik bildirilir), `llms.txt`, AI botlarına açık robots.txt, her dil için haber site haritası (news-sitemap.xml, en/news-sitemap.xml), doğrulama kodu alanları.
- **Haber sayfası:** "Kısaca" özet kutusu, İçindekiler, yazar kutusu ve yazar sayfası, yazı boyutu düğmesi (Aa).
- **Arayüz:** açık/koyu tema düğmesi, telefonda alt menü, dil düğmesi.
- **Panel:** Ayarlar > Yazarlar, Ayarlar > Site Ayarları (Search Console/Bing/Yandex kodları, Cloudflare Analytics, sosyal hesaplar, görsel optimizasyonu), kategorilere İngilizce ad/açıklama.

## Yayından sonra yapılacaklar
1. Search Console, Bing Webmaster, Yandex Webmaster'a siteyi ekle; doğrulama kodlarını Ayarlar > Site Ayarları'na yaz.
2. Cloudflare > Security > Bots bölümünde "AI Scrapers and Crawlers" engeli açıksa kapat (yoksa ChatGPT/Perplexity seni kaynak gösteremez).
3. Cloudflare > Images > Transformations'ı aç, sonra panelde "Görsel optimizasyonu"nu etkinleştir (isteğe bağlı).
4. Cloudflare > Web Analytics'ten token alıp Site Ayarları'na yaz.
