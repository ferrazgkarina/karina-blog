import { defineArrayMember, defineField, defineType } from 'sanity';

// Singleton.
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', type: 'string', title: 'Site name', validation: (Rule) => Rule.required() }),
    defineField({ name: 'logo', type: 'image', title: 'Logo', fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] }),
    defineField({
      name: 'socialLinks',
      type: 'array',
      title: 'Social links',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'socialLink',
          fields: [
            defineField({ name: 'platform', type: 'string', title: 'Platform', validation: (Rule) => Rule.required() }),
            defineField({ name: 'url', type: 'url', title: 'URL', validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'platform', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({ name: 'footer', type: 'simpleBlockContent', title: 'Footer text' }),
    defineField({
      name: 'affiliateDisclosure',
      type: 'text',
      rows: 3,
      title: 'Affiliate notice',
      description: 'Shown automatically at the top of any post that has an Affiliate CTA or widget.',
      initialValue: 'This post contains affiliate links. If you book through them, I may earn a small commission at no extra cost to you.',
    }),
    defineField({
      name: 'defaultSeo',
      type: 'object',
      title: 'Default SEO',
      fields: [
        defineField({ name: 'title', type: 'string', title: 'Default title' }),
        defineField({ name: 'description', type: 'text', rows: 3, title: 'Default description' }),
        defineField({ name: 'image', type: 'image', title: 'Default share image' }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
});
