export type Ctx = { url: string; title: string; image: string };

/** Paylaşım adresleri. Hem sunucuda (ShareBar) hem tarayıcıda (paylaş penceresi, yan çubuk) kullanılır. */
export function shareHref(net: string, c: Ctx): string {
  const u = encodeURIComponent(c.url);
  const t = encodeURIComponent(c.title);
  const m = encodeURIComponent(c.image);
  switch (net) {
    case 'pinterest': return `https://pinterest.com/pin/create/button/?url=${u}&media=${m}&description=${t}`;
    case 'facebook': return `https://www.facebook.com/sharer/sharer.php?u=${u}`;
    case 'x': return `https://twitter.com/intent/tweet?url=${u}&text=${t}`;
    case 'whatsapp': return `https://wa.me/?text=${t}%20${u}`;
    case 'telegram': return `https://t.me/share/url?url=${u}&text=${t}`;
    case 'messenger': return `fb-messenger://share/?link=${u}`;
    case 'reddit': return `https://www.reddit.com/submit?url=${u}&title=${t}`;
    case 'linkedin': return `https://www.linkedin.com/sharing/share-offsite/?url=${u}`;
    case 'gmail': return `https://mail.google.com/mail/?view=cm&su=${t}&body=${u}`;
    case 'mail': return `mailto:?subject=${t}&body=${u}`;
    default: return c.url;
  }
}
