import { simpleBlockContent } from './objects/simpleBlock';
import { postBody, bodyImage, atAGlance, callout, affiliateCta, embedWidget, internalLinkCard, faqItem, bookingCard, bookingSection } from './objects/postBody';
import { country } from './documents/country';
import { destination } from './documents/destination';
import { post } from './documents/post';
import { category } from './documents/category';
import { author } from './documents/author';
import { siteSettings } from './documents/siteSettings';

export const schemaTypes = [
  // documentos
  country, destination, post, category, author, siteSettings,
  // objetos
  simpleBlockContent, postBody, bodyImage, atAGlance, callout, affiliateCta, embedWidget, internalLinkCard, faqItem, bookingCard, bookingSection,
];

export const SINGLETONS = ['author', 'siteSettings'];
