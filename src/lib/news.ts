import { getCollection, type CollectionEntry } from 'astro:content';
import catData from '../data/kategoriler.json';
import authorData from '../data/yazarlar.json';
import siteData from '../data/site.json';
import { ROUTES, T, type Lang } from './i18n';

export type Haber = CollectionEntry<'haberler'>;
export type Category = { slug: string; name: string; color: string; desc?: string };
export type Author = { slug: string; name: string; role: string; bio: string; photo: string };

export const SITE_CFG = siteData as {
  googleDogrulama?: string;
  bingDogrulama?: string;
  yandexDogrulama?: string;
  cloudflareAnalitikToken?: string;
  gorselOptimizasyon?: boolean;
  sosyal?: Record<string, string>;
};

type RawCat = { slug: string; name: string; color: string; desc?: string; name_en?: string; desc_en?: string };
const RAW: RawCat[] = (((catData as unknown as { categories?: RawCat[] }).categories) ?? []).filter(
  (c) => c && c.slug && c.name
);

/** Kategoriler panelden (Ayarlar → Kategoriler) yönetilir: src/data/kategoriler.json */
export const CATEGORIES: Category[] = RAW;

const loc = (c: RawCat, lang: Lang): Category => ({
  slug: c.slug,
  color: c.color,
  name: lang === 'en' ? c.name_en || c.name : c.name,
  desc: lang === 'en' ? c.desc_en || '' : c.desc,
});

export const catsFor = (lang: Lang): Category[] => RAW.map((c) => loc(c, lang));

export const catOf = (slug: string, lang: Lang = 'tr'): Category => {
  const c = RAW.find((x) => x.slug === slug);
  return c ? loc(c, lang) : { slug, name: slug, color: '#2455d6', desc: '' };
};

/** Taslak olmayan tüm haberler, yeniden eskiye sıralı. */
export async function getNews(lang: Lang = 'tr'): Promise<Haber[]> {
  const all: Haber[] = await getCollection('haberler', ({ data }) => !data.draft && data.dil === lang);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** En az bir haberi olan kategoriler (menüde boş sekme görünmesin diye). */
export const activeCategories = (all: Haber[], lang: Lang = 'tr'): Category[] =>
  catsFor(lang).filter((c) => all.some((h) => h.data.category === c.slug));

/** "popular" işaretliler önce, eksik kalırsa en yeniler tamamlar. */
export function getPopular(all: Haber[], n = 5, excludeId?: string): Haber[] {
  const pool = all.filter((h) => h.id !== excludeId);
  return [...pool.filter((h) => h.data.popular), ...pool.filter((h) => !h.data.popular)].slice(0, n);
}

export const haberUrl = (id: string, lang: Lang = 'tr') => `${ROUTES[lang].news}${id}/`;
export const catUrl = (slug: string, lang: Lang = 'tr') => `${ROUTES[lang].cat}${slug}/`;
export const tagUrl = (slug: string, lang: Lang = 'tr') => `${ROUTES[lang].tag}${slug}/`;

/** Haber sayfasında aşağı inince sırayla yüklenecek haberler: önce aynı kategori, sonra diğerleri. */
export function queueFor(all: Haber[], entry: Haber, n = 12, lang: Lang = 'tr'): string[] {
  const same = all.filter((h) => h.id !== entry.id && h.data.category === entry.data.category);
  const rest = all.filter((h) => h.id !== entry.id && h.data.category !== entry.data.category);
  return [...same, ...rest].slice(0, n).map((h) => haberUrl(h.id, lang));
}

const TZ = 'Europe/Istanbul';
export const fmtDate = (d: Date, lang: Lang = 'tr') =>
  d.toLocaleDateString(T[lang].dateLocale, { day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ });
export const fmtShort = (d: Date, lang: Lang = 'tr') =>
  d.toLocaleDateString(T[lang].dateLocale, { day: 'numeric', month: 'short', timeZone: TZ });

export const readMins = (body = '') =>
  Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200));

export const tagSlug = (t: string) =>
  t
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .toLowerCase()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const absUrl = (path: string, site: URL | string | undefined) =>
  path.startsWith('http') ? path : new URL(path, site).href;

/** Yazarlar panelden yönetilir: Ayarlar → Yazarlar (src/data/yazarlar.json) */
type RawAuthor = { slug: string; name: string; role?: string; role_en?: string; bio?: string; bio_en?: string; photo?: string };
const RAW_AUTHORS: RawAuthor[] = (((authorData as unknown as { authors?: RawAuthor[] }).authors) ?? []).filter(
  (a) => a && a.slug && a.name
);
const locAuthor = (a: RawAuthor, lang: Lang): Author => ({
  slug: a.slug,
  name: a.name,
  role: (lang === 'en' ? a.role_en || a.role : a.role) || '',
  bio: (lang === 'en' ? a.bio_en || a.bio : a.bio) || '',
  photo: a.photo || '',
});
export const authorsFor = (lang: Lang): Author[] => RAW_AUTHORS.map((a) => locAuthor(a, lang));
export const authorByName = (name: string, lang: Lang = 'tr'): Author | undefined => {
  const a = RAW_AUTHORS.find((x) => x.name.toLowerCase() === name.toLowerCase());
  return a ? locAuthor(a, lang) : undefined;
};
export const authorUrl = (slug: string, lang: Lang = 'tr') => `${ROUTES[lang].author}${slug}/`;

/**
 * Görsel optimizasyonu: Cloudflare'de "Image Transformations" açıksa ve Ayarlar → Site Ayarları'nda
 * "Görsel optimizasyonu" açılmışsa, yüklenen görseller istenen genişlikte, WebP/AVIF olarak sunulur.
 */
export const img = (src: string, width: number): string =>
  SITE_CFG.gorselOptimizasyon && src.startsWith('/uploads/')
    ? `/cdn-cgi/image/width=${width},quality=80,format=auto${src}`
    : src;

/** Aynı haberin diğer dildeki karşılığı (hreflang ve dil değiştirici için). */
export async function counterpart(entry: Haber, lang: Lang): Promise<string | undefined> {
  if (lang === 'tr') {
    const en = await getNews('en');
    const m = en.find((h) => h.data.translationOf === entry.id);
    return m ? haberUrl(m.id, 'en') : undefined;
  }
  const id = entry.data.translationOf;
  if (!id) return undefined;
  const tr = await getNews('tr');
  return tr.some((h) => h.id === id) ? haberUrl(id, 'tr') : undefined;
}
