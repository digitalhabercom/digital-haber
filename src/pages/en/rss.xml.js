import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { SITE } from '../../consts';

export async function GET(context) {
  const items = (await getCollection('haberler', ({ data }) => !data.draft && data.dil === 'en')).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );

  return rss({
    title: `${SITE.name} (English)`,
    description: SITE.descriptionEn,
    site: context.site,
    items: items.slice(0, 50).map((h) => ({
      title: h.data.title,
      description: h.data.description,
      pubDate: h.data.date,
      link: `/en/news/${h.id}/`,
      categories: [h.data.category, ...h.data.tags],
      author: h.data.author,
    })),
    customData: '<language>en-us</language>',
  });
}
