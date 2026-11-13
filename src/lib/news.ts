import { getCollection, type CollectionEntry } from 'astro:content';
import catData from '../data/kategoriler.json';

export type Haber = CollectionEntry<'haberler'>;
export type Category = { slug: string; name: string; color: string; desc?: string };

/** Kategoriler panelden (Ayarlar → Kategoriler) yönetilir: src/data/kategoriler.json */
export const CATEGORIES: Category[] = (((catData as unknown as { categories?: Category[] }).categories) ?? []).filter(
  (c) => c && c.slug && c.name
);

export const catOf = (slug: string): Category =>
  CATEGORIES.find((c) => c.slug === slug) ?? { slug, name: slug, color: '#2455d6', desc: '' };

/** Taslak olmayan tüm haberler, yeniden eskiye sıralı. */
export async function getNews(): Promise<Haber[]> {
  const all = await getCollection('haberler', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** En az bir haberi olan kategoriler (menüde boş sekme görünmesin diye). */
export const activeCategories = (all: Haber[]): Category[] =>
  CATEGORIES.filter((c) => all.some((h) => h.data.category === c.slug));

/** "popular" işaretliler önce, eksik kalırsa en yeniler tamamlar. */
export function getPopular(all: Haber[], n = 5, excludeId?: string): Haber[] {
  const pool = all.filter((h) => h.id !== excludeId);
  return [...pool.filter((h) => h.data.popular), ...pool.filter((h) => !h.data.popular)].slice(0, n);
}

export const haberUrl = (id: string) => `/haber/${id}/`;

/** Haber sayfasında aşağı inince sırayla yüklenecek haberler: önce aynı kategori, sonra diğerleri. */
export function queueFor(all: Haber[], entry: Haber, n = 12): string[] {
  const same = all.filter((h) => h.id !== entry.id && h.data.category === entry.data.category);
  const rest = all.filter((h) => h.id !== entry.id && h.data.category !== entry.data.category);
  return [...same, ...rest].slice(0, n).map((h) => haberUrl(h.id));
}

const TZ = 'Europe/Istanbul';
export const fmtDate = (d: Date) =>
  d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ });
export const fmtShort = (d: Date) =>
  d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', timeZone: TZ });

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
