import { getCollection } from 'astro:content';
import { SITE } from '../consts';

// llms-full.txt: son haberlerin tam metni (yapay zekâ araçları için tek dosyada)
export async function GET(context) {
  const origin = context.site.href.replace(/\/$/, '');
  const all = (await getCollection('haberler', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf()
  );
  const part = (h) => {
    const path = h.data.dil === 'en' ? '/en/news/' : '/haber/';
    return `## ${h.data.title}
URL: ${origin}${path}${h.id}/
Date: ${h.data.date.toISOString().slice(0, 10)}${h.data.updated ? ` (updated ${h.data.updated.toISOString().slice(0, 10)})` : ''}
Author: ${h.data.author}
${h.data.source ? `Source: ${h.data.source}\n` : ''}
${h.data.description}

${(h.body ?? '').trim()}
`;
  };
  const text = `# ${SITE.name} — full text of recent stories\n\n${all.slice(0, 30).map(part).join('\n---\n\n')}`;
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
