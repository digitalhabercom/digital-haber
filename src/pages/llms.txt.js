import { getCollection } from 'astro:content';
import { SITE } from '../consts';
import cats from '../data/kategoriler.json';

// llms.txt: yapay zekâ arama ve sohbet araçlarına sitenin ne olduğunu ve en güncel içeriklerini sade metinle anlatır
export async function GET(context) {
  const origin = context.site.href.replace(/\/$/, '');
  const load = async (name) =>
    (await getCollection('haberler', ({ data }) => !data.draft && data.dil === name)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const tr = await load('tr');
  const en = await load('en');

  const line = (h, prefix) => `- [${h.data.title}](${origin}${prefix}${h.id}/): ${h.data.description}`;
  const catLines = (cats.categories ?? []).map((c) => `- ${c.name} / ${c.name_en || c.name}: ${c.desc || ''}`).join('\n');

  const text = `# ${SITE.name}

> ${SITE.description}
> ${SITE.descriptionEn}

${SITE.name} is an independent Turkish technology news site (with an English edition) covering AI, hardware, cybersecurity, software and cloud. Stories carry author, publication date and update date. Content may be quoted with a link to the source page.

## Sections
${catLines}

## Latest stories (Türkçe)
${tr.slice(0, 40).map((h) => line(h, '/haber/')).join('\n')}

## Latest stories (English)
${en.slice(0, 40).map((h) => line(h, '/en/news/')).join('\n')}

## Feeds
- [Sitemap](${origin}/sitemap-index.xml)
- [News sitemap (TR)](${origin}/news-sitemap.xml)
- [News sitemap (EN)](${origin}/en/news-sitemap.xml)
- [RSS (TR)](${origin}/rss.xml)
- [RSS (EN)](${origin}/en/rss.xml)
`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
