import { defineArrayMember, defineField, defineType } from 'sanity';

// Corpo único do post, em fluxo contínuo (sem lista de "seções").
// H1 não existe aqui: o H1 é o título do post.
export const postBody = defineType({
  name: 'postBody',
  title: 'Post body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bulleted', value: 'bullet' },
        { title: 'Numbered', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          defineArrayMember({
            name: 'link',
            type: 'object',
            title: 'External link',
            fields: [
              defineField({ name: 'href', type: 'url', title: 'URL', validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https', 'mailto'] }) }),
              defineField({ name: 'newTab', type: 'boolean', title: 'Open in new tab', initialValue: true }),
              defineField({ name: 'sponsored', type: 'boolean', title: 'Affiliate link (rel="sponsored")', initialValue: false }),
            ],
          }),
          defineArrayMember({
            name: 'internalLink',
            type: 'object',
            title: 'Internal link',
            description: 'Reference to another page. It never breaks if a slug changes.',
            fields: [
              defineField({
                name: 'reference',
                type: 'reference',
                title: 'Page',
                to: [{ type: 'post' }, { type: 'destination' }, { type: 'country' }],
                validation: (Rule) => Rule.required(),
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({ type: 'bodyImage' }),
    defineArrayMember({ type: 'atAGlance' }),
    defineArrayMember({ type: 'callout' }),
    defineArrayMember({ type: 'affiliateCta' }),
    defineArrayMember({ type: 'embedWidget' }),
    defineArrayMember({ type: 'internalLinkCard' }),
  ],
});

export const bodyImage = defineType({
  name: 'bodyImage',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [
    defineField({ name: 'alt', type: 'string', title: 'Alt text', validation: (Rule) => Rule.required() }),
    defineField({ name: 'caption', type: 'string', title: 'Caption' }),
  ],
  preview: { select: { title: 'caption', subtitle: 'alt', media: 'asset' } },
});

export const atAGlance = defineType({
  name: 'atAGlance',
  title: 'At a Glance',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title', initialValue: 'At a glance' }),
    defineField({
      name: 'items',
      type: 'array',
      title: 'Items',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label', validation: (Rule) => Rule.required() }),
            defineField({ name: 'text', type: 'text', title: 'Text', rows: 2, validation: (Rule) => Rule.required() }),
          ],
          preview: { select: { title: 'label', subtitle: 'text' } },
        }),
      ],
      validation: (Rule) => Rule.min(1),
    }),
  ],
  preview: { select: { title: 'title', items: 'items' }, prepare: ({ title, items }) => ({ title: title || 'At a glance', subtitle: `${items?.length ?? 0} items` }) },
});

export const callout = defineType({
  name: 'callout',
  title: 'Callout',
  type: 'object',
  fields: [
    defineField({
      name: 'tone',
      type: 'string',
      title: 'Type',
      options: { list: [{ title: 'Tip', value: 'tip' }, { title: 'Warning', value: 'warning' }], layout: 'radio' },
      initialValue: 'tip',
    }),
    defineField({ name: 'title', type: 'string', title: 'Title (optional)' }),
    defineField({ name: 'text', type: 'simpleBlockContent', title: 'Text', validation: (Rule) => Rule.required() }),
  ],
  preview: { select: { title: 'title', subtitle: 'tone' }, prepare: ({ title, subtitle }) => ({ title: title || 'Callout', subtitle }) },
});

export const affiliateCta = defineType({
  name: 'affiliateCta',
  title: 'Affiliate CTA',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required() }),
    defineField({ name: 'text', type: 'text', title: 'Short text', rows: 3 }),
    defineField({ name: 'buttonLabel', type: 'string', title: 'Button label', validation: (Rule) => Rule.required() }),
    defineField({ name: 'url', type: 'url', title: 'Affiliate URL', validation: (Rule) => Rule.required().uri({ scheme: ['http', 'https'] }) }),
    defineField({ name: 'platform', type: 'string', title: 'Platform', description: 'Free text (e.g. Booking.com, GetYourGuide, Viator).' }),
    defineField({
      name: 'trackingId',
      type: 'string',
      title: 'Tracking ID',
      description: 'Sub-ID / label of the affiliate program, to measure clicks and bookings separately (e.g. one per hotel).',
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'platform' } },
});

export const embedWidget = defineType({
  name: 'embedWidget',
  title: 'Embed / widget',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Internal name', description: 'Only to recognize it in the Studio.' }),
    defineField({ name: 'code', type: 'text', title: 'Widget code', rows: 6, description: 'Paste the widget snippet (e.g. Travelpayouts). It is loaded asynchronously.', validation: (Rule) => Rule.required() }),
    defineField({ name: 'isAffiliate', type: 'boolean', title: 'Affiliate widget (shows the affiliate notice)', initialValue: true }),
  ],
  preview: { select: { title: 'title' }, prepare: ({ title }) => ({ title: title || 'Widget', subtitle: 'Embed' }) },
});

export const internalLinkCard = defineType({
  name: 'internalLinkCard',
  title: 'Internal link card',
  type: 'object',
  fields: [
    defineField({ name: 'post', type: 'reference', title: 'Post', to: [{ type: 'post' }], validation: (Rule) => Rule.required() }),
  ],
  preview: { select: { title: 'post.title' }, prepare: ({ title }) => ({ title: title || 'Post card', subtitle: 'Internal link card' }) },
});

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ item',
  type: 'object',
  fields: [
    defineField({ name: 'question', type: 'string', title: 'Question', validation: (Rule) => Rule.required() }),
    defineField({ name: 'answer', type: 'text', title: 'Answer', rows: 4, validation: (Rule) => Rule.required() }),
  ],
  preview: { select: { title: 'question' } },
});

export const bookingCard = defineType({
  name: 'bookingCard',
  title: 'Booking card',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', type: 'text', title: 'Description', rows: 3 }),
    defineField({ name: 'image', type: 'image', title: 'Image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt text' }] }),
    defineField({ name: 'url', type: 'url', title: 'Affiliate URL', validation: (Rule) => Rule.required() }),
    defineField({ name: 'buttonLabel', type: 'string', title: 'Button label' }),
    defineField({ name: 'platform', type: 'string', title: 'Platform' }),
    defineField({ name: 'trackingId', type: 'string', title: 'Tracking ID' }),
  ],
  preview: { select: { title: 'title', subtitle: 'platform', media: 'image' } },
});

export const bookingSection = defineType({
  name: 'bookingSection',
  title: 'Booking section',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Title' }),
    defineField({ name: 'intro', type: 'simpleBlockContent', title: 'Intro' }),
    defineField({
      name: 'tabs',
      type: 'array',
      title: 'Tabs',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'bookingTab',
          fields: [
            defineField({
              name: 'kind',
              type: 'string',
              title: 'Tab',
              options: { list: [{ title: 'Hotels', value: 'hotels' }, { title: 'Rentals', value: 'rentals' }, { title: 'Car', value: 'car' }, { title: 'Activities', value: 'activities' }] },
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'cards', type: 'array', title: 'Cards', of: [defineArrayMember({ type: 'bookingCard' })] }),
          ],
          preview: { select: { title: 'kind', cards: 'cards' }, prepare: ({ title, cards }) => ({ title, subtitle: `${cards?.length ?? 0} cards` }) },
        }),
      ],
    }),
  ],
});
