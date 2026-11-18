import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Panelden boş ya da bozuk gelen tarihleri yok sayar (build'i düşürmesin)
const optDate = z.preprocess((v) => {
  if (v === null || v === undefined || v === '') return undefined;
  const d = v instanceof Date ? v : new Date(String(v));
  return isNaN(d.getTime()) ? undefined : d;
}, z.date().optional());

const schema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  updated: optDate,
  category: z.string(), // kategori kodu; liste panelden yönetilir (Ayarlar → Kategoriler)
  image: z.string(), // manşet / kapak görseli: /uploads/dosya.jpg veya https://...
  imageAlt: z.string().optional(),
  imageCredit: z.string().optional(),
  imageCaption: z.string().optional(),
  tur: z.enum(['haber', 'analiz', 'rehber', 'karsilastirma', 'inceleme']).default('haber'),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  source: z.string().optional(), // kaynak adı (ör. The Verge)
  sourceUrl: z.string().optional(), // kaynak bağlantısı
  author: z.string().default('digitalhaber Editör'),
  summary: z.array(z.string()).default([]), // "Kısaca" kutusu maddeleri
  featured: z.boolean().default(false), // manşette göster
  popular: z.boolean().default(false), // en çok okunanlarda göster
  draft: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  dil: z.enum(['tr', 'en']).default('tr'), // haberin dili: tr = Türkçe site, en = İngilizce site (/en/)
  translationOf: z.string().optional(), // İngilizce haberde: Türkçe haberin kodu (dil bağlantısı için)
});

const haberler = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/haberler' }),
  schema,
});


export const collections = { haberler };
