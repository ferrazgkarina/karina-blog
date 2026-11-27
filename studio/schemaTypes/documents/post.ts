import { defineArrayMember, defineField, defineType } from 'sanity';
import { isUniquePostSlug } from '../../lib/slugs';

export const post = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  groups: [
    { name: 'main', title: 'Main', default: true },
    { name: 'content', title: 'Content' },
    { name: 'extras', title: 'FAQ & notes' },
    { name: 'seo', title: 'SEO' },
  ],
  // Exige destino OU país (não os dois vazios).
  validation: (Rule) =>
    Rule.custom((doc) => {
      const d = doc as { destination?: unknown; country?: unknown } | undefined;
      return d?.destination || d?.country ? true : 'Choose a destination (city post) or a country (country-wide post).';
    }),
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title', group: 'main', description: 'Title Case.', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      group: 'main',
      options: { source: 'title', maxLength: 90, isUnique: isUniquePostSlug },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'destination',
      type: 'reference',
      title: 'Destination',
      group: 'main',
      description: 'City post: /destination/slug.',
      to: [{ type: 'destination' }],
      hidden: ({ document }) => Boolean((document?.country as unknown) && !(document?.destination as unknown)),
    }),
    defineField({
      name: 'country',
      type: 'reference',
      title: 'Country (only for country-wide posts)',
      group: 'main',
      description: 'Country-wide post, e.g. "China for first-timers": /country/slug. Leave empty if the post has a destination.',
      to: [{ type: 'country' }],
      hidden: ({ document }) => Boolean(document?.destination as unknown),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      title: 'Category',
      group: 'main',
      to: [{ type: 'category' }],
      // Globais + as exclusivas do destino do post.
      options: {
        filter: ({ document }) => {
          const dest = (document?.destination as { _ref?: string } | undefined)?._ref;
          return dest
            ? { filter: '!defined(destination) || destination._ref == $dest', params: { dest } }
            : { filter: '!defined(destination)' };
        },
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'excerpt', type: 'text', rows: 3, title: 'Excerpt', group: 'main', validation: (Rule) => Rule.required().max(300) }),
    defineField({
      name: 'heroImage',
      type: 'image',
      title: 'Hero image',
      group: 'main',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt text', validation: (Rule) => Rule.required() })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'publishedAt', type: 'datetime', title: 'Published at', group: 'main', initialValue: () => new Date().toISOString(), validation: (Rule) => Rule.required() }),
    defineField({ name: 'lastUpdated', type: 'datetime', title: 'Last updated', group: 'main', description: 'Shown on the post instead of the publish date. Update it when you revise the post.' }),
    defineField({ name: 'body', type: 'postBody', title: 'Body', group: 'content' }),
    defineField({
      name: 'faq',
      type: 'array',
      title: 'FAQ (optional)',
      group: 'extras',
      description: 'Generates the FAQ structured data automatically.',
      of: [defineArrayMember({ type: 'faqItem' })],
    }),
    defineField({
      name: 'disclosureNote',
      type: 'text',
      rows: 3,
      title: 'Disclosure note (optional)',
      group: 'extras',
      description: 'Transparency note shown at the top of the post (e.g. "The owner of Naraca Cave House is a friend of the author").',
    }),
    defineField({ name: 'seoTitle', type: 'string', title: 'SEO title', group: 'seo', validation: (Rule) => Rule.max(70).warning('Over 70 characters may be cut off in search results.') }),
    defineField({ name: 'seoDescription', type: 'text', rows: 3, title: 'SEO description', group: 'seo', validation: (Rule) => Rule.max(170).warning('Over 170 characters may be cut off in search results.') }),
  ],
  orderings: [{ title: 'Last updated', name: 'updated', by: [{ field: 'lastUpdated', direction: 'desc' }, { field: 'publishedAt', direction: 'desc' }] }],
  preview: {
    select: { title: 'title', destination: 'destination.name', country: 'country.name', media: 'heroImage' },
    prepare: ({ title, destination, country, media }) => ({ title, subtitle: destination ?? `${country ?? ''} (country)`, media }),
  },
});
