import { defineArrayMember, defineType } from 'sanity';

// Portable Text simples (intros de país/destino): parágrafos, negrito, itálico, link.
export const simpleBlockContent = defineType({
  name: 'simpleBlockContent',
  title: 'Simple text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }],
      lists: [],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [{ name: 'link', type: 'object', title: 'Link', fields: [{ name: 'href', type: 'url', title: 'URL' }] }],
      },
    }),
  ],
});
