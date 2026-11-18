import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeCallouts from './scripts/rehype-callouts.mjs';

export default defineConfig({
  site: 'https://www.digitalhaber.com',
  markdown: { rehypePlugins: [rehypeCallouts] },
  integrations: [sitemap({ filter: (page) => !page.includes('/arama') && !page.includes('/en/search') && !page.includes('/kaydedilenler') && !page.includes('/en/saved') })],
});
