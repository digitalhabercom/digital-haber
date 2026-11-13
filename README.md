# digitalhaber.com

Astro ile yapılmış, ücretsiz barındırılan teknoloji haber sitesi. Telefon, tablet ve bilgisayara uyumludur; telefon koyu moddaysa site de koyu görünür.

## Haber ekleme (editör paneli)

Adres: `https://www.digitalhaber.com/admin`

1. **Haberler → Yeni Haber**'e basın.
2. Başlık, kısa açıklama, kategori yazın.
3. **Manşet / Kapak Görseli** alanından bilgisayarınızdan görsel yükleyin (yatay, 1600 piksel genişlik, 300 KB altı ideal).
4. Haber metnini yazın. Başlık, kalın, liste, bağlantı ve görsel ekleyebilirsiniz.
5. Manşette görünsün istiyorsanız **Manşette Göster**'i açın (en fazla 6 haber).
6. Sağ üstten **Yayınla**'ya basın. Site 1-2 dakika içinde kendini yeniler.

Haber taslak kalsın istiyorsanız **Taslak**'ı açın.

## Reklam alanları

Sitede hazır reklam yerleri var: manşet altı, haber içi (2. paragraftan sonra), yan sütun (iki yer) ve haber sonu. AdSense onayı gelene kadar yayında görünmezler, sayfada boşluk kalmaz.

Onay gelince `src/consts.ts` dosyasında:

1. `adsenseClient` alanına `ca-pub-...` kodunuzu yazın.
2. `slots` içine AdSense'te oluşturduğunuz reklam birimi numaralarını yazın.

Reklamlar, ziyaretçi çerez bildirimini kabul ettikten sonra yüklenir. AdSense onayı için yeterli sayıda özgün haber, Hakkımızda, İletişim ve Gizlilik sayfaları gerekir. Bu sayfalar hazır; metinleri kendinize göre güncelleyin.

## Kendi bilgisayarınızda deneme

```bash
npm install
npm run dev      # http://localhost:4321
```

## SEO

- Her haber için NewsArticle, BreadcrumbList ve site için NewsMediaOrganization verisi
- `sitemap-index.xml` ve Google News için `news-sitemap.xml`
- RSS (`/rss.xml`), canonical adresler, paylaşım kartları (Open Graph)
- Search Console'a iki site haritasını da gönderin:
  `https://www.digitalhaber.com/sitemap-index.xml` ve `https://www.digitalhaber.com/news-sitemap.xml`

## Notlar

- "En Çok Okunanlar" gerçek okunma sayısına göre değil, editörün işaretlediği haberlere göre dolar.
- Kategori eklemek için `src/lib/news.ts`, `src/content.config.ts` ve `public/admin/config.yml` dosyalarındaki kategori listesine aynı kaydı ekleyin.
- Kendi görsellerinizi kullanın ya da kaynağını belirtin; başka sitelerden alınan görseller telif sorunu çıkarabilir.
- `src/consts.ts` içindeki e-posta adresini kendi adresinizle değiştirin.
