import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const haberler = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/haberler' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.string(), // kategori kodu; liste panelden yönetilir (Ayarlar → Kategoriler)
    image: z.string(), // manşet / kapak görseli: /uploads/dosya.jpg veya https://...
    imageAlt: z.string().optional(),
    imageCredit: z.string().optional(),
    author: z.string().default('digitalhaber Editör'),
    featured: z.boolean().default(false), // manşette göster
    popular: z.boolean().default(false), // en çok okunanlarda göster
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { haberler };
