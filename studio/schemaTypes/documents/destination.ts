import { defineArrayMember, defineField, defineType } from 'sanity';
import { isUniqueTopLevelSlug, topLevelSlugValidation } from '../../lib/slugs';

export const destination = defineType({
  name: 'destination',
  title: 'Destination',
  type: 'document',
  groups: [
    { name: 'main', title: 'Main', default: true },
    { name: 'hub', title: 'Hub content' },
    { name: 'booking', title: 'Booking' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Name', group: 'main', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      group: 'main',
      description: 'URL: /slug. Must be unique across countries and destinations.',
      options: { source: 'name', maxLength: 60, isUnique: isUniqueTopLevelSlug },
      validation: topLevelSlugValidation,
    }),
    defineField({ name: 'country', type: 'reference', title: 'Country', group: 'main', to: [{ type: 'country' }], validation: (Rule) => Rule.required() }),
    defineField({ name: 'heroImage', type: 'image', title: 'Hero image', group: 'main', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text', validation: (Rule) => Rule.required() }] }),
    defineField({
      name: 'showInMenu',
      type: 'boolean',
      title: 'Show in menu',
      group: 'main',
      description: 'Off = posts can be published before the destination appears in the menu, /destinations and the home.',
      initialValue: false,
    }),
    defineField({ name: 'menuOrder', type: 'number', title: 'Menu order', group: 'main', initialValue: 100 }),
    defineField({ name: 'hubIntro', type: 'simpleBlockContent', title: 'Hub intro', group: 'hub' }),
    defineField({
      name: 'featuredGroups',
      type: 'array',
      title: 'Featured groups',
      group: 'hub',
      description: 'Curated groups of posts shown on the hub (e.g. Cappadocia by season).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'featuredGroup',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'posts',
              type: 'array',
              title: 'Posts',
              of: [defineArrayMember({ type: 'reference', to: [{ type: 'post' }] })],
            }),
          ],
          preview: { select: { title: 'title', posts: 'posts' }, prepare: ({ title, posts }) => ({ title, subtitle: `${posts?.length ?? 0} posts` }) },
        }),
      ],
    }),
    defineField({ name: 'bookingSection', type: 'bookingSection', title: 'Booking section (optional)', group: 'booking' }),
    defineField({ name: 'seoTitle', type: 'string', title: 'SEO title', group: 'seo' }),
    defineField({ name: 'seoDescription', type: 'text', rows: 3, title: 'SEO description', group: 'seo' }),
  ],
  orderings: [{ title: 'Menu order', name: 'menuOrder', by: [{ field: 'menuOrder', direction: 'asc' }] }],
  preview: {
    select: { title: 'name', country: 'country.name', showInMenu: 'showInMenu', media: 'heroImage' },
    prepare: ({ title, country, showInMenu, media }) => ({ title, subtitle: `${country ?? 'No country'}${showInMenu ? '' : ' · hidden from menu'}`, media }),
  },
});
