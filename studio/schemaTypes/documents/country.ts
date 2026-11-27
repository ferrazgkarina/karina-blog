import { defineField, defineType } from 'sanity';
import { isUniqueTopLevelSlug, topLevelSlugValidation } from '../../lib/slugs';

export const country = defineType({
  name: 'country',
  title: 'Country',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Name', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'URL: /slug. Must be unique across countries and destinations.',
      options: { source: 'name', maxLength: 60, isUnique: isUniqueTopLevelSlug },
      validation: topLevelSlugValidation,
    }),
    defineField({
      name: 'region',
      type: 'string',
      title: 'Region',
      options: { list: ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania', 'Middle East'] },
    }),
    defineField({ name: 'coverImage', type: 'image', title: 'Cover image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] }),
    defineField({ name: 'intro', type: 'simpleBlockContent', title: 'Intro' }),
    defineField({ name: 'menuOrder', type: 'number', title: 'Menu order', description: 'Lower numbers come first.', initialValue: 100 }),
    defineField({ name: 'seoTitle', type: 'string', title: 'SEO title' }),
    defineField({ name: 'seoDescription', type: 'text', rows: 3, title: 'SEO description' }),
  ],
  orderings: [{ title: 'Menu order', name: 'menuOrder', by: [{ field: 'menuOrder', direction: 'asc' }] }],
  preview: { select: { title: 'name', subtitle: 'region', media: 'coverImage' } },
});
