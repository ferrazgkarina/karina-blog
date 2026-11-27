import type { SlugValidationContext } from 'sanity';

// Páginas fixas e rotas do site que nenhum país/destino pode usar como slug.
export const RESERVED_SLUGS = ['about', 'destinations', 'blog', 'contact', 'privacy-policy', 'robots.txt', 'sitemap', 'studio', 'api', '404'];

// País e destino dividem o mesmo nível de URL (/china, /chengdu): o slug
// precisa ser único entre os dois tipos e nunca colidir com páginas fixas.
export async function isUniqueTopLevelSlug(slug: string, context: SlugValidationContext) {
  const { document, getClient } = context;
  if (!document) return true;
  const id = document._id.replace(/^drafts\./, '');
  const client = getClient({ apiVersion: '2024-01-01' });
  const taken = await client.fetch<boolean>(
    `defined(*[_type in ["country","destination"] && slug.current == $slug && !(_id in [$id, "drafts." + $id])][0]._id)`,
    { slug, id },
  );
  return !taken;
}

export function topLevelSlugValidation(Rule: any) {
  return Rule.required().custom((value: { current?: string } | undefined) => {
    const current = value?.current;
    if (current && RESERVED_SLUGS.includes(current)) return `"${current}" é reservado (página fixa do site).`;
    return true;
  });
}

// Slug do post: único dentro do mesmo destino (ou país).
export async function isUniquePostSlug(slug: string, context: SlugValidationContext) {
  const { document, getClient } = context;
  if (!document) return true;
  const id = document._id.replace(/^drafts\./, '');
  const parent = (document.destination as { _ref?: string } | undefined)?._ref ?? (document.country as { _ref?: string } | undefined)?._ref;
  const client = getClient({ apiVersion: '2024-01-01' });
  const taken = await client.fetch<boolean>(
    `defined(*[_type == "post" && slug.current == $slug && !(_id in [$id, "drafts." + $id]) && (destination._ref == $parent || country._ref == $parent)][0]._id)`,
    { slug, id, parent: parent ?? '' },
  );
  return !taken;
}
