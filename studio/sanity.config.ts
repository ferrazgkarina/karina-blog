import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes, SINGLETONS } from './schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'Travel Blog',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID ?? 'ravcarwx',
  dataset: process.env.SANITY_STUDIO_DATASET ?? 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem().title('Posts').schemaType('post').child(S.documentTypeList('post').title('Posts')),
            S.listItem().title('Destinations').schemaType('destination').child(S.documentTypeList('destination').title('Destinations')),
            S.listItem().title('Countries').schemaType('country').child(S.documentTypeList('country').title('Countries')),
            S.listItem().title('Categories').schemaType('category').child(S.documentTypeList('category').title('Categories')),
            S.divider(),
            S.listItem().title('Author').id('author').child(S.document().schemaType('author').documentId('author')),
            S.listItem().title('Site settings').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
          ]),
    }),
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],
  schema: {
    types: schemaTypes,
    // Singletons não aparecem no menu "Create new".
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },
  document: {
    // Singletons: só publicar/editar, nunca duplicar ou apagar.
    actions: (input, context) =>
      SINGLETONS.includes(context.schemaType) ? input.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action)) : input,
  },
});
