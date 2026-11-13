import { getCollection } from 'astro:content';

const CATS = {
  'yapay-zeka': 'Yapay Zeka',
  donanim: 'Donanım',
  'siber-guvenlik': 'Siber Güvenlik',
  yazilim: 'Yazılım',
  'bulut-altyapi': 'Bulut Altyapı',
};

export async function GET() {
  const all = (await getCollection('haberler', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
  const items = all.map((h) => ({
    t: h.data.title,
    d: h.data.description,
    u: `/haber/${h.id}/`,
    c: CATS[h.data.category] ?? h.data.category,
    i: h.data.image,
    s: h.data.tags.join(' '),
  }));
  return new Response(JSON.stringify(items), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
