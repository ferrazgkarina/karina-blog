import { utimesSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';

// Só para `astro dev`: o Astro busca o Sanity uma vez (getStaticPaths) e guarda
// o resultado até o servidor reiniciar. Aqui consultamos o Sanity a cada poucos
// segundos; quando algo é publicado/alterado/apagado, "tocamos" um arquivo-fonte
// (o Astro descarta o cache de rotas nesse evento) e recarregamos a página.
const POLL_MS = 5000;
const WATCHED_FILE = fileURLToPath(new URL('../src/lib/sanity.ts', import.meta.url));
const QUERY =
  '{"latest": *[!(_id in path("_.**"))] | order(_updatedAt desc)[0]._updatedAt, "count": count(*[!(_id in path("_.**"))])}';

export default function sanityLiveReload() {
  return {
    name: 'sanity-live-reload',
    hooks: {
      'astro:server:setup': ({ server }) => {
        const env = loadEnv('development', process.cwd(), '');
        const { SANITY_PROJECT_ID: projectId, SANITY_DATASET: dataset = 'production' } = env;
        const apiVersion = env.SANITY_API_VERSION ?? '2024-01-01';
        if (!projectId) return;

        // api.sanity.io (sem CDN) para enxergar a publicação na hora.
        const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(QUERY)}`;
        let lastSignature = null;

        const timer = setInterval(async () => {
          try {
            const response = await fetch(url);
            if (!response.ok) return;
            const { result } = await response.json();
            const signature = `${result.latest}|${result.count}`;
            if (lastSignature !== null && signature !== lastSignature) {
              const now = new Date();
              utimesSync(WATCHED_FILE, now, now);
              setTimeout(() => server.ws.send({ type: 'full-reload' }), 500);
              console.log('[sanity-live-reload] conteúdo mudou no Sanity — recarregando');
            }
            lastSignature = signature;
          } catch {
            // Sem rede / API instável: tenta de novo no próximo ciclo.
          }
        }, POLL_MS);

        server.httpServer?.on('close', () => clearInterval(timer));
      },
    },
  };
}
