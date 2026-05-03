import type { SanityRule } from '../types';

export const sectionPage = {
  name: 'sectionPage',
  title: 'Stránka sekce',
  type: 'document',
  fields: [
    { name: 'title', title: 'Název sekce', type: 'string', validation: (Rule: SanityRule) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (Rule: SanityRule) => Rule.required() },
    { name: 'intro_text', title: 'Úvodní text', type: 'blockContent' },
    {
      name: 'section_key',
      title: 'Klíč sekce',
      type: 'string',
      options: {
        list: [
          { title: 'Nováček', value: 'novacek' },
          { title: 'Růst', value: 'rust' },
          { title: 'Týmy', value: 'tymy' },
          { title: 'Cesty', value: 'cesty' },
          { title: 'Koncepce', value: 'koncepce' },
        ],
      },
    },
    {
      name: 'resources',
      title: 'Materiály a odkazy',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Název', type: 'string' },
            { name: 'url', title: 'Odkaz', type: 'url' },
            {
              name: 'type',
              title: 'Typ',
              type: 'string',
              options: {
                list: [
                  { title: 'Google Drive', value: 'google-drive' },
                  { title: 'Externí web', value: 'external-web' },
                  { title: 'Interní odkaz', value: 'internal-link' },
                  { title: 'Podcast', value: 'podcast' },
                ],
              },
            },
          ],
        },
      ],
      description: 'Odkazy na Google Drive dokumenty, podcasty, externí weby apod.',
    },
    {
      name: 'cover_image',
      title: 'Obrázek sekce',
      type: 'image',
      options: { hotspot: true },
      description: 'Hero obrázek zobrazený v hlavičce stránky sekce',
    },
    {
      name: 'highlight_boxes',
      title: 'Highlight boxy (pod stránkou)',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'highlightBox' }] }],
      description: 'Boxy s CTA, které se zobrazí pod sebou na konci stránky sekce.',
    },
    { name: 'is_visible', title: 'Viditelná', type: 'boolean', initialValue: true },
    { name: 'order', title: 'Pořadí', type: 'number', initialValue: 0 },
  ],
};
