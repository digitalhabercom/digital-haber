// Haber metninde alıntıları (>) kutuya çevirir.
//   > **Bilgi:** ...   -> mavi bilgi kutusu
//   > **İpucu:** ...   -> yeşil ipucu kutusu
//   > **Dikkat:** ...  -> turuncu uyarı kutusu
//   > düz alıntı       -> büyük alıntı satırı
// Tek başına bir satıra yapıştırılan YouTube / Vimeo bağlantısı -> yerleşik video
const KINDS = { bilgi: 'bilgi', info: 'bilgi', ipucu: 'ipucu', ipuçu: 'ipucu', tip: 'ipucu', dikkat: 'uyari', uyari: 'uyari', uyarı: 'uyari', warning: 'uyari' };

const text = (n) => (n.type === 'text' ? n.value : (n.children || []).map(text).join(''));
const isEl = (n, tag) => n && n.type === 'element' && (!tag || n.tagName === tag);

function videoSrc(href) {
  let u;
  try { u = new URL(href); } catch { return null; }
  const h = u.hostname.replace(/^www\./, '').replace(/^m\./, '');
  let id = null;
  if (h === 'youtu.be') id = u.pathname.slice(1).split('/')[0];
  else if (h === 'youtube.com' || h === 'youtube-nocookie.com') {
    if (u.pathname === '/watch') id = u.searchParams.get('v');
    else { const m = u.pathname.match(/^\/(embed|shorts|live)\/([\w-]{6,})/); if (m) id = m[2]; }
  } else if (h === 'vimeo.com') {
    const m = u.pathname.match(/^\/(\d+)/);
    if (m) return { src: 'https://player.vimeo.com/video/' + m[1], title: 'Vimeo videosu' };
  }
  if (id && /^[\w-]{6,}$/.test(id)) {
    const t = u.searchParams.get('t') || u.searchParams.get('start');
    const start = t && /^\d+s?$/.test(t) ? '?start=' + parseInt(t, 10) : '';
    return { src: 'https://www.youtube-nocookie.com/embed/' + id + start, title: 'YouTube videosu' };
  }
  return null;
}

function videoNode(v) {
  return {
    type: 'element', tagName: 'div', properties: { className: ['video'] },
    children: [{
      type: 'element', tagName: 'iframe',
      properties: { src: v.src, title: v.title, loading: 'lazy', allowFullScreen: true,
        allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
        referrerPolicy: 'strict-origin-when-cross-origin' },
      children: [],
    }],
  };
}

function walk(node) {
  if (!node || !node.children) return;
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (isEl(child, 'p')) {
      const kids = child.children.filter((c) => !(c.type === 'text' && !c.value.trim()));
      if (kids.length === 1 && isEl(kids[0], 'a') && kids[0].properties && kids[0].properties.href) {
        const v = videoSrc(String(kids[0].properties.href));
        if (v) { node.children[i] = videoNode(v); continue; }
      }
    }
    if (isEl(child, 'blockquote')) {
      const p = child.children.find((c) => isEl(c, 'p'));
      const first = p && p.children.find((c) => !(c.type === 'text' && !c.value.trim()));
      let kind = null;
      if (isEl(first, 'strong')) {
        const label = text(first).trim().replace(/[:：]+$/, '').toLocaleLowerCase('tr');
        kind = KINDS[label] || null;
      }
      child.properties = child.properties || {};
      child.properties.className = kind ? ['box', 'box--' + kind] : ['pull'];
    }
    walk(child);
  }
}

export default function rehypeCallouts() {
  return (tree) => walk(tree);
}
