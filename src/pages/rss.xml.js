import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../consts';

export async function GET(context) {
  const haberler = (await getCollection('haberler', ({ data }) => !data.draft && data.dil === 'tr')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site,
    items: haberler.slice(0, 50).map((h) => ({
      title: h.data.title,
      description: h.data.description,
      pubDate: h.data.date,
      link: `/haber/${h.id}/`,
      categories: [h.data.category, ...h.data.tags],
      author: h.data.author,
    })),
    customData: '<language>tr-tr</language>',
  });
}
