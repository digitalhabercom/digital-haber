import { getCollection } from 'astro:content';
import { SITE } from '../../consts';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Google News site haritası: yalnızca son 2 günün haberleri (site her yayında yeniden derlenir)
export async function GET(context) {
  const origin = context.site.href.replace(/\/$/, '');
  const cutoff = Date.now() - 2 * 24 * 60 * 60 * 1000;
  const recent = (await getCollection('en', ({ data }) => !data.draft))
    .filter((h) => h.data.date.valueOf() >= cutoff)
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .slice(0, 1000);

  const urls = recent
    .map(
      (h) => `  <url>
    <loc>${esc(`${origin}/en/news/${h.id}/`)}</loc>
    <news:news>
      <news:publication><news:name>${esc(SITE.name)}</news:name><news:language>en</news:language></news:publication>
      <news:publication_date>${h.data.date.toISOString()}</news:publication_date>
      <news:title>${esc(h.data.title)}</news:title>
    </news:news>
  </url>`
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${urls}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
