import type { SanityRule } from '../types';

export const lecturer = {
  name: 'lecturer',
  title: 'Lektor',
  type: 'document',
  fields: [
    { name: 'name', title: 'Jméno a příjmení', type: 'string', validation: (Rule: SanityRule) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: (Rule: SanityRule) => Rule.required() },
    { name: 'photo', title: 'Foto', type: 'image', options: { hotspot: true } },
    { name: 'bio', title: 'Krátký medailonek', type: 'text', rows: 5 },
    { name: 'email', title: 'E-mail', type: 'string' },
  ],
};
