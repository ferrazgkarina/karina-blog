import { defineField, defineType } from 'sanity';

// Singleton: um único documento (Karina).
export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Name', validation: (Rule) => Rule.required() }),
    defineField({ name: 'photo', type: 'image', title: 'Photo', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] }),
    defineField({ name: 'shortBio', type: 'text', rows: 3, title: 'Short bio', description: 'Sidebar card: name + short credentials.' }),
    defineField({ name: 'longBio', type: 'simpleBlockContent', title: 'Long bio', description: 'About page.' }),
  ],
  preview: { select: { title: 'name', media: 'photo' } },
});
