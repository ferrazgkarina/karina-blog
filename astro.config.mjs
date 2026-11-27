import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import sanityLiveReload from './integrations/sanity-live-reload.mjs';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'https://example.com',
  integrations: [sanityLiveReload(), sitemap()],
  // Lançamento inicial só em inglês. i18n nativo do Astro já configurado
  // para que adicionar um locale (ex: 'es') no futuro seja só estender este
  // array — sem prefixo de idioma na URL enquanto houver um único locale.
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },
});
