// Arquivo único de tema: cores, fontes, logo e favicon. As variáveis CSS são
// geradas daqui (ver themeCss) e injetadas no <head> pelo BaseLayout.
// Para outro site (ex.: Brasil, Going to Rio), troque só este arquivo.
// Os componentes usam tokens SEMÂNTICOS (--color-bg, --color-text...), nunca
// nomes de cor, para o dark mode futuro ser só preencher `dark` abaixo.

export const theme = {
  // Logo: texto por enquanto (a Karina ainda vai desenhar a logo). Quando
  // existir, aponte `src` para o arquivo em /public (versão para fundo azul)
  // e `srcOnLight` para a versão em French Blue (favicon, OG, pins, e-mails).
  logo: { src: '', srcOnLight: '' },
  favicon: '', // caminho em /public, ex.: '/favicon.svg'

  fonts: {
    heading: "'Amaranth', Georgia, serif",
    body: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  },

  colors: {
    light: {
      bg: '#FBF5F0', // fundo de todas as páginas
      surface: '#FEFAF8', // Snow: faixa do título, cards, sidebar, texto sobre o primary
      text: '#1F2433',
      'text-muted': '#5A6072', // datas, legendas, rótulos (nunca em texto longo)
      border: '#E6DCD4',
      primary: '#0E3C8B', // French Blue: header, H1/H2, links, botões, rodapé
      green: '#90AD87', // só detalhes pequenos
      'green-light': '#DDE6DB', // card de bio, caixa de hotéis
      pink: '#D7A8CA', // só elementos pequenos
      'pink-light': '#F4CFE9', // Quick facts
      accent: '#D99A1E', // mostarda: logo sobre o primary, pílulas, ícones, sublinhado; nunca texto
    } as Record<string, string>,
    // Dark mode (futuro): preencha com os mesmos nomes e ele é ativado sozinho.
    dark: null as Record<string, string> | null,
  },

  // Aliases dos nomes antigos usados pelos componentes herdados. Somem
  // conforme os componentes forem reescritos nas etapas 4 a 6.
  legacyAliases: {
    '--color-background': 'var(--color-bg)',
    '--color-background-highlight': 'var(--color-green-light)',
    '--color-secondary': 'var(--color-accent)',
    '--color-tertiary': 'var(--color-text-muted)',
    '--color-text-secondary': 'var(--color-text-muted)',
    '--color-link': 'var(--color-primary)',
  } as Record<string, string>,
};

const toVars = (colors: Record<string, string>) =>
  Object.entries(colors)
    .map(([name, value]) => `--color-${name}:${value};`)
    .join('');

export function themeCss(): string {
  const { colors, fonts, legacyAliases } = theme;
  const aliases = Object.entries(legacyAliases)
    .map(([k, v]) => `${k}:${v};`)
    .join('');
  let css = `:root{${toVars(colors.light)}${aliases}--font-heading:${fonts.heading};--font-body:${fonts.body};}`;
  if (colors.dark) {
    css += `@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){${toVars(colors.dark)}}}`;
    css += `:root[data-theme="dark"]{${toVars(colors.dark)}}`;
  }
  return css;
}
