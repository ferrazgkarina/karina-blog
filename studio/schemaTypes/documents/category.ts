import { defineField, defineType } from 'sanity';

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', type: 'slug', title: 'Slug', options: { source: 'title', maxLength: 60 }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', type: 'text', rows: 2, title: 'Description' }),
    defineField({
      name: 'destination',
      type: 'reference',
      title: 'Only for this destination (optional)',
      description: 'Empty = global category, available for every destination. Filled = exists only in that destination (e.g. Balloon Rides in Cappadocia).',
      to: [{ type: 'destination' }],
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'destination.name' }, prepare: ({ title, subtitle }) => ({ title, subtitle: subtitle ? `Only in ${subtitle}` : 'Global' }) },
});
