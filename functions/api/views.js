// Okunma sayacı (Cloudflare Pages Functions + D1).
// Kurulum yoksa (DB bağlı değilse) sessizce boş döner; site normal çalışır.
const PATH = /^\/(haber|en\/news)\/[a-z0-9-]{1,160}\/$/;
const json = (o, s = 200) =>
  new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });

export async function onRequestGet({ request, env }) {
  if (!env.DB) return json({});
  const url = new URL(request.url);
  const paths = (url.searchParams.get('p') || '').split(',').filter((p) => PATH.test(p)).slice(0, 20);
  if (!paths.length) return json({});
  try {
    const q = paths.map(() => '?').join(',');
    const { results } = await env.DB.prepare(`SELECT slug, n FROM views WHERE slug IN (${q})`).bind(...paths).all();
    const out = {};
    for (const r of results || []) out[r.slug] = r.n;
    return json(out);
  } catch { return json({}); }
}

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({});
  const ua = request.headers.get('user-agent') || '';
  if (!ua || /bot|crawl|spider|slurp|preview|headless/i.test(ua)) return json({});
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return json({}, 403);
  let path;
  try { ({ p: path } = await request.json()); } catch { return json({}, 400); }
  if (typeof path !== 'string' || !PATH.test(path)) return json({}, 400);
  try {
    await env.DB.prepare('INSERT INTO views (slug, n) VALUES (?, 1) ON CONFLICT(slug) DO UPDATE SET n = n + 1').bind(path).run();
    const row = await env.DB.prepare('SELECT n FROM views WHERE slug = ?').bind(path).first();
    return json({ [path]: row ? row.n : 1 });
  } catch { return json({}); }
}
