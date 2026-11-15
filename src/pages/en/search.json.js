import { getCollection } from 'astro:content';
import cats from '../../data/kategoriler.json';

const TZ = 'Europe/Istanbul';
const mins = (body = '') => Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200));

export async function GET() {
  const byslug = Object.fromEntries((cats.categories ?? []).map((c) => [c.slug, c]));
  const all = (await getCollection('en', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
  const items = all.map((h) => ({
    id: h.id,
    t: h.data.title,
    d: h.data.description,
    u: `/en/news/${h.id}/`,
    c: byslug[h.data.category]?.name_en || byslug[h.data.category]?.name || h.data.category,
    col: byslug[h.data.category]?.color ?? '#2455d6',
    i: h.data.image,
    s: h.data.tags.join(' '),
    dt: h.data.date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', timeZone: TZ }),
    rm: mins(h.body),
  }));
  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
