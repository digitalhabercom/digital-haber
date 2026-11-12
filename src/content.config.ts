import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const haberler = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/haberler' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    category: z.enum([
      'yapay-zeka',
      'donanim',
      'siber-guvenlik',
      'yazilim',
      'bulut-altyapi',
    ]),
    image: z.string(),
    imageAlt: z.string().optional(),
    author: z.string().default('digitalhaber Editör'),
    featured: z.boolean().default(false), // manşet slider'ında göster
    popular: z.boolean().default(false), // "En Çok Okunanlar" listesinde göster
    draft: z.boolean().default(false),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { haberler };
