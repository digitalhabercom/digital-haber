import { getCollection, type CollectionEntry } from 'astro:content';

export type Haber = CollectionEntry<'haberler'>;

export const CATEGORIES = [
  { slug: 'yapay-zeka', name: 'Yapay Zeka', color: '#6d28d9', desc: 'Yapay zeka modelleri, araçları ve günlük hayata etkileri.' },
  { slug: 'donanim', name: 'Donanım', color: '#b45309', desc: 'Bilgisayar, telefon ve donanım dünyasından haberler ve alım rehberleri.' },
  { slug: 'siber-guvenlik', name: 'Siber Güvenlik', color: '#b91c1c', desc: 'Güvenlik açıkları, saldırılar ve korunma yöntemleri.' },
  { slug: 'yazilim', name: 'Yazılım', color: '#047857', desc: 'Yazılım geliştirme, araçlar ve programlamaya dair rehberler.' },
  { slug: 'bulut-altyapi', name: 'Bulut Altyapı', color: '#0369a1', desc: 'Bulut hizmetleri, sunucular, ağlar ve yedekleme çözümleri.' },
] as const;

export const catOf = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug) ?? { slug, name: slug, color: '#2a3df5', desc: '' };

/** Taslak olmayan tüm haberler, yeniden eskiye sıralı. */
export async function getNews(): Promise<Haber[]> {
  const all = await getCollection('haberler', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** "popular" işaretliler önce, eksik kalırsa en yeniler tamamlar. */
export function getPopular(all: Haber[], n = 5, excludeId?: string): Haber[] {
  const pool = all.filter((h) => h.id !== excludeId);
  return [...pool.filter((h) => h.data.popular), ...pool.filter((h) => !h.data.popular)].slice(0, n);
}

const TZ = 'Europe/Istanbul';
export const fmtDate = (d: Date) =>
  d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: TZ });
export const fmtShort = (d: Date) =>
  d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', timeZone: TZ });

export const readMins = (body = '') =>
  Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200));

export const haberUrl = (id: string) => `/haber/${id}/`;

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
