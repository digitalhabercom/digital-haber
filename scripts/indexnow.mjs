// Yayından sonra yeni haberleri IndexNow ile Bing, Yandex ve diğer arama motorlarına bildirir.
// Yalnızca Cloudflare Pages derlemesinde çalışır; hata verirse derlemeyi bozmaz.
import { readFile } from 'node:fs/promises';

const KEY = 'c25c6ba3a9f8151988a5fdb46e81ecdb'; // public/<anahtar>.txt ile aynı
const HOST = 'www.digitalhaber.com';
const ORIGIN = `https://${HOST}`;

async function main() {
  if (!process.env.CF_PAGES || process.env.INDEXNOW === 'off') {
    console.log('[indexnow] atlandı (yalnızca Cloudflare derlemesinde çalışır)');
    return;
  }
  const urls = new Set([`${ORIGIN}/`, `${ORIGIN}/en/`]);
  for (const f of ['dist/news-sitemap.xml', 'dist/en/news-sitemap.xml']) {
    try {
      const xml = await readFile(f, 'utf8');
      for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(m[1]);
    } catch {
      /* dosya yoksa geç */
    }
  }
  const list = [...urls].slice(0, 500);
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList: list }),
    signal: AbortSignal.timeout(10000),
  });
  console.log(`[indexnow] ${list.length} adres gönderildi, yanıt: ${res.status}`);
}

main().catch((e) => console.log('[indexnow] gönderilemedi:', e?.message ?? e));
