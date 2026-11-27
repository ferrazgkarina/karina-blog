// Identidade do site em um só lugar. Tudo aqui é placeholder até a Karina
// definir nome e domínio; troque via variáveis de ambiente (.env.example).
// Cores e fontes entram no arquivo de tema na etapa 2.
export const siteConfig = {
  name: import.meta.env.PUBLIC_SITE_NAME ?? 'Travel Blog',
  url: import.meta.env.PUBLIC_SITE_URL ?? 'https://example.com',
  contactEmail: import.meta.env.PUBLIC_CONTACT_EMAIL ?? '',
  // Vazio = nenhum analytics carregado.
  gaId: import.meta.env.PUBLIC_GA_ID ?? '',
  // Imagem padrão de compartilhamento (caminho em /public ou URL). Vazio = sem og:image.
  defaultOgImage: import.meta.env.PUBLIC_DEFAULT_OG_IMAGE ?? '',
};
