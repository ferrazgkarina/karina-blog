import { createClient, type SanityClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';
import { toHTML } from '@portabletext/to-html';

const projectId = import.meta.env.SANITY_PROJECT_ID;
const dataset = import.meta.env.SANITY_DATASET ?? 'production';
const apiVersion = import.meta.env.SANITY_API_VERSION ?? '2024-01-01';

// useCdn: false — o site é estático (poucas consultas, só no build/dev) e o CDN
// pode devolver a versão anterior por alguns segundos após uma publicação.
export const sanityClient: SanityClient | null = projectId
  ? createClient({ projectId, dataset, apiVersion, useCdn: false })
  : null;

// Schema pensado para i18n desde já, mas o plugin @sanity/document-internationalization
// não precisa ser ativado agora — só quando um segundo idioma existir de fato.
// Plano: cada post carrega um campo `language`; uma tradução futura é um
// documento "post" NOVO com language: 'es', não uma reescrita de campos
// existentes. Quando isso acontecer, as queries abaixo ganham `&& language == $lang`.
const builder = projectId ? createImageUrlBuilder({ projectId, dataset }) : null;

function imageUrl(source: SanityImageSource | null | undefined, width: number, height: number): string | null {
  if (!builder || !source?.asset) return null;
  return builder.image(source).width(width).height(height).fit('crop').auto('format').url();
}

interface SanityImageSource {
  asset?: { _ref: string };
  hotspot?: { x: number; y: number };
  alt?: string;
}

// Escapa texto de usuário antes de colar em HTML montado na mão (alt, texto
// do CTA) — sem isso, um "&" ou aspas no conteúdo quebra a marcação.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

interface CtaCardValue {
  text?: string;
  link?: string;
  buttonText?: string;
  isAffiliate?: boolean;
}

// Atributos HTML de um link já resolvido por linkAttrs (target/rel só quando existem).
function anchorAttrs({ href, target, rel }: LinkAttrs): string {
  return `href="${escapeHtml(href)}"${target ? ` target="${target}"` : ''}${rel ? ` rel="${rel}"` : ''}`;
}

interface QuickPicksValue {
  title?: string;
  intro?: string;
  note?: string;
  items?: {
    label?: string;
    name?: string;
    link?: string;
    isAffiliate?: boolean;
    description?: string;
    priceNote?: string;
  }[];
}

// Fotos soltas e cards de CTA/afiliado inseridos no meio do texto (ver
// `body` em postSection.ts) — fotos em largura máxima, sem forçar
// proporção/corte como os cards de listagem (essas são editoriais, não
// thumbnails); CTA vira botão se `buttonText` existir, senão o próprio texto
// é o link.
const portableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImageSource }) => {
      if (!builder || !value?.asset) return '';
      const src = builder.image(value).width(1400).fit('max').auto('format').url();
      const alt = escapeHtml(value.alt ?? '');
      return `<img src="${src}" alt="${alt}" loading="lazy" class="body-image" />`;
    },
    ctaCard: ({ value }: { value: CtaCardValue }) => {
      const text = escapeHtml(value.text ?? '');
      // Cards antigos não têm o campo isAffiliate: contam como afiliado (o CTA
      // existe pra isso), igual aos Quick Picks.
      const attrs = anchorAttrs(linkAttrs(value.link ?? '#', value.isAffiliate !== false));
      if (value.buttonText) {
        return `<div class="cta-block"><p>${text}</p><a class="button cta-button" ${attrs}>${escapeHtml(value.buttonText)}</a></div>`;
      }
      return `<div class="cta-block cta-block--text-link"><a class="cta-text-link" ${attrs}>${text}</a></div>`;
    },
    quickPicks: ({ value }: { value: QuickPicksValue }) => {
      const items = (value.items ?? []).filter((item) => item.name);
      if (items.length === 0) return '';
      const itemsHtml = items
        .map((item) => {
          const name = escapeHtml(item.name ?? '');
          const nameHtml = item.link
            ? (() => {
                const { href, target, rel } = linkAttrs(item.link, item.isAffiliate !== false);
                return `<a href="${escapeHtml(href)}"${target ? ` target="${target}"` : ''}${rel ? ` rel="${rel}"` : ''}>${name}</a>`;
              })()
            : name;
          const label = item.label ? `<strong>${escapeHtml(item.label)}:</strong> ` : '';
          return `<li class="quick-picks-item"><p class="quick-picks-line">${label}${nameHtml}</p>${
            item.description ? `<p>${escapeHtml(item.description)}</p>` : ''
          }${item.priceNote ? `<p>${escapeHtml(item.priceNote)}</p>` : ''}</li>`;
        })
        .join('');
      return `<div class="quick-picks">${
        value.title ? `<h3 class="quick-picks-title">${escapeHtml(value.title)}</h3>` : ''
      }${value.intro ? `<p class="quick-picks-intro">${escapeHtml(value.intro)}</p>` : ''}<ul class="quick-picks-list">${itemsHtml}</ul>${
        value.note ? `<p class="quick-picks-note">${escapeHtml(value.note)}</p>` : ''
      }</div>`;
    },
  },
  // Links no meio do texto: o campo "Affiliate link" vem do schema (postSection.ts).
  marks: {
    link: ({ children, value }: { children: string; value?: { href?: string; isAffiliate?: boolean } }) => {
      if (!value?.href) return children;
      return `<a ${anchorAttrs(linkAttrs(value.href, value.isAffiliate === true))}>${children}</a>`;
    },
  },
};

// Links: afiliado ou externo abre em nova aba (afiliado ganha rel="sponsored");
// caminho interno ("/blog/...") fica como link normal.
export interface LinkAttrs {
  href: string;
  target?: '_blank';
  rel?: string;
}

export function linkAttrs(href: string, isAffiliate: boolean): LinkAttrs {
  // Link pro próprio site digitado como URL completa: é interno, nunca afiliado.
  const ownHost = (import.meta.env.PUBLIC_SITE_URL ?? '').replace(/^https?:\/\/(www\.)?/i, '').replace(/\/$/, '');
  const own = ownHost
    ? href.match(new RegExp(`^https?://(?:www\\.)?${ownHost.replace(/\./g, '\\.')}(/.*)?$`, 'i'))
    : null;
  if (own) return { href: own[1] || '/', target: '_blank', rel: 'noopener' };
  if (isAffiliate) return { href, target: '_blank', rel: 'sponsored noopener' };
  // Tudo que não é âncora da própria página (#secao) abre em nova aba, links internos inclusos.
  if (href.startsWith('#')) return { href };
  if (/^https?:\/\//i.test(href)) return { href, target: '_blank', rel: 'noopener noreferrer' };
  return { href, target: '_blank', rel: 'noopener' };
}

// Texto curto do "Good to know" (Portable Text simples, só com o mark `link`).
const goodToKnowTextComponents = {
  marks: {
    link: ({ children, value }: { children: string; value?: { href?: string; isAffiliate?: boolean } }) => {
      if (!value?.href) return children;
      const { href, target, rel } = linkAttrs(value.href, value.isAffiliate === true);
      return `<a href="${escapeHtml(href)}"${target ? ` target="${target}"` : ''}${rel ? ` rel="${rel}"` : ''}>${children}</a>`;
    },
  },
};

export interface GoodToKnowItemData {
  label: string;
  rating: number | null;
  textHtml: string;
  link: { text: string; attrs: LinkAttrs } | null;
}

export interface GoodToKnowData {
  title: string;
  jumpLinkText: string;
  items: GoodToKnowItemData[];
}

// Tudo opcional — as páginas caem pro título/teaser/capa do post quando algum
// campo fica em branco no Studio.
export interface PostSeoData {
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  noIndex: boolean;
}

export interface RelatedPostRef {
  title: string;
  slug: string;
  category: string;
  coverImageUrl: string | null;
}

export interface PostSectionData {
  id: string;
  heading: string;
  bodyHtml: string;
  showInComingNext: boolean;
  weatherCards:
    | { sunrise: string; sunset: string; tempMaxC: number; tempMinC: number; position: 'top' | 'bottom' }
    | null;
  suggestedPosts: RelatedPostRef[];
}

export type ContentItem =
  | { kind: 'section'; section: PostSectionData }
  | { kind: 'block'; html: string };

export interface PostData {
  slug: string;
  category: string;
  title: string;
  teaser: string;
  author: string;
  updatedAt: string | null;
  // HTML do parágrafo de abertura: introRich (com links) ou o campo antigo em texto simples.
  introHtml: string;
  coverImageUrl: string | null;
  content: ContentItem[];
  sections: PostSectionData[];
  goodToKnow: GoodToKnowData | null;
  relatedPosts: RelatedPostRef[];
  authorBio: { name: string; role: string; bio: string };
  seo: PostSeoData;
}

// Projeção compartilhada entre a busca de um post (getPostBySlug, se
// precisar no futuro) e a listagem usada pelo getStaticPaths — um só lugar
// pra manter os campos em sincronia.
const postProjection = `{
  "slug": slug.current,
  category,
  title,
  teaser,
  "author": author->name,
  updatedAt,
  intro,
  introRich,
  coverImage,
  "sections": sections[]{
    _type,
    _type == "ctaCard" => { text, link, buttonText, isAffiliate },
    _type == "quickPicks" => { title, intro, note, items },
    !(_type in ["ctaCard", "quickPicks"]) => {
      "id": anchorId,
      heading,
      body,
      showInComingNext,
      weatherCards,
      "suggestedPosts": suggestedPosts[]->{
        title,
        "slug": slug.current,
        category,
        coverImage
      }
    }
  },
  goodToKnow{
    title,
    jumpLinkText,
    items[]{
      label,
      rating,
      text,
      link
    }
  },
  "relatedPosts": relatedPosts[]->{
    title,
    "slug": slug.current,
    category,
    coverImage
  },
  "authorBio": author->{ name, role, bio },
  seo{
    title,
    description,
    image,
    noIndex
  }
}`;

function transformGoodToKnow(raw: any): GoodToKnowData | null {
  const items = (raw?.items ?? []).filter((item: any) => item?.label);
  if (items.length === 0) return null;
  return {
    title: raw.title || '',
    jumpLinkText: raw.jumpLinkText || '',
    items: items.map((item: any) => ({
      label: item.label,
      rating: typeof item.rating === 'number' ? item.rating : null,
      textHtml: item.text ? toHTML(item.text, { components: goodToKnowTextComponents }) : '',
      link:
        item.link?.url && item.link?.text
          ? { text: item.link.text, attrs: linkAttrs(item.link.url, item.link.isAffiliate === true) }
          : null,
    })),
  };
}

function transformRelated(ref: {
  title: string;
  slug: string;
  category: string;
  coverImage?: SanityImageSource;
}): RelatedPostRef {
  return {
    title: ref.title,
    slug: ref.slug,
    category: ref.category,
    coverImageUrl: imageUrl(ref.coverImage, 400, 300),
  };
}

function transformSection(section: any): PostSectionData {
  return {
    id: section.id,
    heading: section.heading,
    bodyHtml: section.body ? toHTML(section.body, { components: portableTextComponents }) : '',
    showInComingNext: section.showInComingNext === true,
    // Sanity Studio's `position` field default ends up saving a bare
    // `{ position: 'top' }` on sections that never had weather cards filled
    // in — so presence alone isn't enough, we require actual data too.
    weatherCards:
      section.weatherCards && (section.weatherCards.sunrise || section.weatherCards.sunset)
        ? { ...section.weatherCards, position: section.weatherCards.position ?? 'top' }
        : null,
    suggestedPosts: (section.suggestedPosts ?? []).map(transformRelated),
  };
}

// `sections` no Sanity mistura H2s (postSection) com blocos soltos entre eles
// (ctaCard, quickPicks). `content` mantém a ordem para o ArticleBody;
// `sections` (só os H2s) alimenta o "In This Post" e a barra "Coming next".
function transformContent(rawItems: any[]): ContentItem[] {
  return rawItems.map((item) =>
    item._type === 'ctaCard' || item._type === 'quickPicks'
      ? { kind: 'block', html: toHTML([item], { components: portableTextComponents }) }
      : { kind: 'section', section: transformSection(item) }
  );
}

const introComponents = {
  ...portableTextComponents,
  block: { normal: ({ children }: { children?: string }) => `<p class="intro">${children ?? ''}</p>` },
};

function buildIntroHtml(rich: any[] | undefined, legacy: string | undefined): string {
  if (rich && rich.length > 0) return toHTML(rich, { components: introComponents as any });
  return (legacy ?? '')
    .split(/\n+/)
    .filter((paragraph) => paragraph.trim())
    .map((paragraph) => `<p class="intro">${escapeHtml(paragraph)}</p>`)
    .join('');
}

function transformPost(raw: any): PostData {
  const content = transformContent(raw.sections ?? []);
  return {
    slug: raw.slug,
    category: raw.category,
    title: raw.title,
    teaser: raw.teaser,
    author: raw.author,
    updatedAt: raw.updatedAt ?? null,
    introHtml: buildIntroHtml(raw.introRich, raw.intro),
    coverImageUrl: imageUrl(raw.coverImage, 1400, 1050),
    content,
    sections: content.flatMap((item) => (item.kind === 'section' ? [item.section] : [])),
    goodToKnow: transformGoodToKnow(raw.goodToKnow),
    relatedPosts: (raw.relatedPosts ?? []).map(transformRelated),
    authorBio: raw.authorBio
      ? { name: raw.authorBio.name, role: raw.authorBio.role ?? '', bio: raw.authorBio.bio ?? '' }
      : { name: raw.author, role: '', bio: '' },
    seo: {
      title: raw.seo?.title || null,
      description: raw.seo?.description || null,
      imageUrl: imageUrl(raw.seo?.image, 1200, 630),
      noIndex: raw.seo?.noIndex === true,
    },
  };
}

export async function getAllPosts(): Promise<PostData[]> {
  if (!sanityClient) {
    throw new Error('Sanity client não configurado — defina SANITY_PROJECT_ID em .env');
  }
  const raw = await sanityClient.fetch(`*[_type == "post" && defined(slug.current)]${postProjection}`);
  return raw.map(transformPost);
}

export async function getPostBySlug(slug: string): Promise<PostData | null> {
  if (!sanityClient) {
    throw new Error('Sanity client não configurado — defina SANITY_PROJECT_ID em .env');
  }
  const raw = await sanityClient.fetch(`*[_type == "post" && slug.current == $slug][0]${postProjection}`, { slug });
  return raw ? transformPost(raw) : null;
}

// Shape leve pra listagens (página do Blog, carrossel "Latest posts" da
// Home) — não busca sections/body, só o que os cards mostram.
export interface PostCard {
  slug: string;
  title: string;
  category: string;
  updatedAt: string | null;
  isSiteFeatured: boolean;
  isCategoryHub: boolean;
  coverImageUrl: string | null;
}

const postCardProjection = `{
  "slug": slug.current,
  title,
  category,
  updatedAt,
  isSiteFeatured,
  isCategoryHub,
  coverImage
}`;

export async function getAllPostCards(): Promise<PostCard[]> {
  if (!sanityClient) {
    throw new Error('Sanity client não configurado — defina SANITY_PROJECT_ID em .env');
  }
  const raw = await sanityClient.fetch(
    `*[_type == "post" && defined(slug.current)]${postCardProjection} | order(updatedAt desc)`
  );
  return raw.map((post: any) => ({
    slug: post.slug,
    title: post.title,
    category: post.category,
    updatedAt: post.updatedAt ?? null,
    isSiteFeatured: Boolean(post.isSiteFeatured),
    isCategoryHub: Boolean(post.isCategoryHub),
    coverImageUrl: imageUrl(post.coverImage, 800, 600),
  }));
}
