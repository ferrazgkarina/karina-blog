import type { APIRoute } from 'astro';

// Endpoint em vez de arquivo estático em public/ pra reaproveitar o `site`
// do astro.config.mjs — assim que o domínio real substituir o placeholder
// (https://example.com), a URL do sitemap abaixo se corrige sozinha.
export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL('sitemap-index.xml', site).toString();
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
