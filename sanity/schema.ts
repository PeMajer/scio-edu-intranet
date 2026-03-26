export const course = {
  name: 'course',
  title: 'Kurz',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Název kurzu',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'highlight',
      title: 'Zvýraznění (krátký popis)',
      type: 'text',
      rows: 2,
    },
    {
      name: 'description',
      title: 'Popis kurzu',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'target_audience',
      title: 'Pro koho je kurz určen',
      type: 'text',
      rows: 3,
    },
    {
      name: 'benefits',
      title: 'Benefity',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'section',
      title: 'Sekce',
      type: 'string',
      options: {
        list: [
          { title: 'Jsem ve ScioPolis nováček', value: 'novacek' },
          { title: 'Vzdělávání a růst pro každého', value: 'rust' },
          { title: 'Rozvoj pro týmy a kvadriády', value: 'tymy' },
          { title: 'Vzdělávací cesty', value: 'cesty' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'subsection',
      title: 'Podsekce',
      type: 'string',
    },
    {
      name: 'tags',
      title: 'Tagy',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'dates',
      title: 'Termíny',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'date_start', title: 'Datum zahájení', type: 'datetime' },
            { name: 'date_end', title: 'Datum ukončení', type: 'datetime' },
            { name: 'location', title: 'Místo', type: 'string' },
            { name: 'capacity', title: 'Kapacita', type: 'number' },
            { name: 'note', title: 'Poznámka', type: 'text', rows: 2 },
          ],
        },
      ],
    },
    {
      name: 'duration_minutes',
      title: 'Délka kurzu (minuty)',
      type: 'number',
    },
    {
      name: 'price',
      title: 'Cena (Kč)',
      type: 'number',
    },
    {
      name: 'lecturer',
      title: 'Lektor',
      type: 'reference',
      to: [{ type: 'lecturer' }],
    },
    {
      name: 'contact_name',
      title: 'Jméno organizátora',
      type: 'string',
    },
    {
      name: 'contact_email',
      title: 'Email organizátora',
      type: 'email',
    },
    {
      name: 'image',
      title: 'Obrázek kurzu',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'materials',
      title: 'Materiály',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Popisek', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
          ],
        },
      ],
    },
    {
      name: 'external_url',
      title: 'Externí URL (pro externí kurzy)',
      type: 'url',
    },
    {
      name: 'is_published',
      title: 'Publikováno',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'is_external',
      title: 'Externí kurz',
      type: 'boolean',
      initialValue: false,
    },
  ],
};

export const lecturer = {
  name: 'lecturer',
  title: 'Lektor',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Jméno',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'photo',
      title: 'Fotografie',
      type: 'image',
      options: { hotspot: true },
    },
    {
      name: 'bio',
      title: 'Biografie',
      type: 'text',
      rows: 5,
    },
    {
      name: 'email',
      title: 'Email',
      type: 'email',
    },
  ],
};

export const sectionPage = {
  name: 'sectionPage',
  title: 'Sekce stránky',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Název sekce',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'intro_text',
      title: 'Úvodní text',
      type: 'array',
      of: [{ type: 'block' }],
    },
    {
      name: 'section_key',
      title: 'Klíč sekce',
      type: 'string',
      options: {
        list: [
          { title: 'Koncepce', value: 'koncepce' },
          { title: 'Vzdělávání', value: 'vzdelavani' },
        ],
      },
    },
    {
      name: 'resources',
      title: 'Zdroje',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Popisek', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
            {
              name: 'type',
              title: 'Typ',
              type: 'string',
              options: {
                list: [
                  { title: 'Podcast', value: 'podcast' },
                  { title: 'Metodický balík', value: 'methodological' },
                  { title: 'Koncepční dokument', value: 'conceptual' },
                ],
              },
            },
          ],
        },
      ],
    },
    {
      name: 'is_visible',
      title: 'Viditelné',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'order',
      title: 'Pořadí',
      type: 'number',
      initialValue: 0,
    },
  ],
};

export const schemaTypes = [course, lecturer, sectionPage];
