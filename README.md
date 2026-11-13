# digitalhaber v3 güncellemesi

## Yükleme
GitHub'da depoyu aç → "Add file > Upload files" → bu klasördeki `src`, `public`, `astro.config.mjs`, `README.md` dosyalarını sürükle → tek commit. Cloudflare 1-2 dk içinde yayınlar.
Eski `public/og-default.svg` dosyası varsa GitHub'dan elle sil.

## Yenilikler
- /admin > Ayarlar > Kategoriler: ekle/sil/sırala, renk ve açıklama.
- /admin > Ayarlar > Reklam: 11 reklam alanı; AdSense kodu/slot veya kendi banner (resim+link); "yer tutucu göster" anahtarı.
- Haber sayfasında yan paylaşım çubuğu (mobilde alt çubuk), "daha fazla" penceresi.
- Haber sayfasında aşağı inince sıradaki haberler akar.
- Ana sayfa altında "Bunları da okuyun": 4 sütun, her yenilemede rastgele.
- Geniş arama (canlı öneri), yeni renkler (koyu gri alt bölüm, mercan sıra numaraları).

## Notlar
- Kategori `slug` değerini değiştirme; eski haberler bağlantısını kaybeder.
- Haberi olmayan kategori menüde görünmez.
- Kenar reklamlar yalnızca ≥1600px ekranlarda görünür.
- Reklamlar AdSense kodu/banner girilene veya yer tutucu açılana kadar gizlidir; AdSense çerez onayından sonra yüklenir.
