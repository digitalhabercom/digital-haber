import { getCollection, type CollectionEntry } from 'astro:content';

export type Haber = CollectionEntry<'haberler'>;

export const CATEGORIES = [
  { slug: 'yapay-zeka', name: 'Yapay Zeka', color: '#7c3aed' },
  { slug: 'donanim', name: 'Donanım', color: '#d97706' },
  { slug: 'siber-guvenlik', name: 'Siber Güvenlik', color: '#dc2626' },
  { slug: 'yazilim', name: 'Yazılım', color: '#059669' },
  { slug: 'bulut-altyapi', name: 'Bulut Altyapı', color: '#0284c7' },
] as const;

export const catName = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;

export const catColor = (slug: string) =>
  CATEGORIES.find((c) => c.slug === slug)?.color ?? '#0284c7';

/** Taslak olmayan tüm haberler, yeniden eskiye sıralı. */
export async function getNews(): Promise<Haber[]> {
  const all = await getCollection('haberler', ({ data }) => !data.draft);
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const fmtDate = (d: Date) =>
  d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

export const readMins = (body = '') =>
  Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200));
