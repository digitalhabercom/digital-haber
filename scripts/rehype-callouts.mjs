// Haber metninde alıntıları (>) kutuya çevirir.
//   > **Bilgi:** ...   -> mavi bilgi kutusu
//   > **İpucu:** ...   -> yeşil ipucu kutusu
//   > **Dikkat:** ...  -> turuncu uyarı kutusu
//   > düz alıntı       -> büyük alıntı satırı
const KINDS = { bilgi: 'bilgi', info: 'bilgi', ipucu: 'ipucu', ipuçu: 'ipucu', tip: 'ipucu', dikkat: 'uyari', uyari: 'uyari', uyarı: 'uyari', warning: 'uyari' };

const text = (n) => (n.type === 'text' ? n.value : (n.children || []).map(text).join(''));
const isEl = (n, tag) => n && n.type === 'element' && (!tag || n.tagName === tag);

function walk(node) {
  if (!node || !node.children) return;
  for (const child of node.children) {
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
