# digitalhaber.com 

Astro ile yapılmış, ücretsiz barındırılabilen teknoloji haber sitesi.

**Özellikler:** kayan manşet (6 haber) · kayan "Son Dakika" bandı · En Çok Okunanlar · tıklanabilir haber sayfaları · Paylaş penceresi · kategori sayfaları · RSS · sitemap · NewsArticle schema (SEO) · `/admin` editör paneli.

## 1. Bilgisayarında çalıştır

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # canlıya çıkacak dosyalar dist/ klasörüne
```

## 2. Yayına al (ücretsiz)

1. Bu klasörü bir **GitHub deposuna** yükle (örn. `kullanici/digitalhaber`).
2. **Cloudflare Pages** → Create project → GitHub deposunu bağla.
   - Build command: `npm run build`
   - Output directory: `dist`
3. Cloudflare'de domain ekleyerek `digitalhaber.com` adresini projeye bağla.

Her haber kaydedildiğinde site otomatik yeniden derlenir (genelde 1-2 dakika).

## 3. Editör paneli (WordPress gibi haber yazma)

Adres: **https://digitalhaber.com/admin**

Kurulum (bir kerelik):

1. `public/admin/config.yml` içindeki `repo: KULLANICI_ADINIZ/digitalhaber` satırını kendi GitHub deponla değiştir.
2. GitHub → Settings → Developer settings → **Fine-grained personal access token** oluştur:
   - Sadece bu depoya erişim ver
   - Yetki: **Contents → Read and write**
3. `/admin` sayfasında **GitHub ile giriş → Token ile giriş** seçeneğine bu token'ı yapıştır.

Sonra: **Haberler → Yeni Haber** → başlık, spot, kategori, kapak görseli, metin → **Yayınla**.
- **Manşette Göster** açıksa haber ana sayfadaki kayan manşete girer.
- **En Çok Okunanlar'da Göster** açıksa sağdaki listede çıkar.
- **Taslak** açıksa haber yayınlanmaz.

## 4. Önemli notlar

- **"En Çok Okunanlar" gerçek okuma sayısına göre sıralanmaz.** Site statik olduğu için sayaç yok; liste, editörün işaretlediği haberlerden oluşur (eksik kalırsa en yeniler tamamlanır). Gerçek sayaç için ileride Cloudflare Web Analytics veya küçük bir Worker eklenebilir.
- `src/content/haberler/` altındaki 8 haber **örnek içeriktir**. Kendi haberlerini girince panelden silebilirsin.
- `public/og-default.svg` varsayılan paylaşım görselidir; Facebook/WhatsApp SVG göstermez. 1200x630 bir **PNG** hazırlayıp `public/og-default.png` olarak koy ve `src/consts.ts` içindeki `defaultImage` değerini güncelle. (Her haberin kendi kapak görseli zaten kullanılır.)
- `src/consts.ts` içindeki e-posta adresini kendi adresinle değiştir. Hakkımızda ve Gizlilik sayfalarındaki metinleri de kendine göre güncelle (AdSense ve Google News için gerekli).
- Paylaş penceresinde TikTok ve Snapchat yok; bu platformların tarayıcıdan bağlantı paylaşma adresi bulunmuyor. Messenger butonu telefonda çalışır; bilgisayarda Facebook uygulama kimliği gerektirir.
- Yayına aldıktan sonra **Google Search Console**'a `https://digitalhaber.com/sitemap-index.xml` adresini gönder.
