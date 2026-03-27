export const course = {
  name: 'course',
  title: 'Kurz',
  type: 'document',
  fields: [
    { name: 'title', title: 'Název kurzu', type: 'string', validation: (Rule: any) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' }, validation: (Rule: any) => Rule.required() },
    {
      name: 'highlight',
      title: 'Krátký highlight',
      type: 'text',
      rows: 2,
      description: 'O čem kurz je — krátký popis pro kartu a přehled (1–2 věty)',
    },
    { name: 'description', title: 'Podrobný popis', type: 'blockContent' },
    { name: 'target_audience', title: 'Pro koho je určen', type: 'text', rows: 3 },
    {
      name: 'benefits',
      title: 'Co účastník získá / co si odnese',
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
      description: 'Hlavní kategorie vzdělávání',
    },
    {
      name: 'subsection',
      title: 'Podsekce',
      type: 'string',
      options: {
        list: [
          { title: 'Kurzy na ScioCíle', value: 'sciocile' },
          { title: 'Řemeslo průvodce', value: 'remeslo' },
          { title: 'Osobní rozvoj', value: 'osobni-rozvoj' },
        ],
      },
      description: 'Pouze pro sekci „Vzdělávání a růst pro každého" — rozdělení kurzů do skupin. Pro ostatní sekce nevyplňujte.',
      hidden: ({ parent }: { parent: { section?: string } }) => parent?.section !== 'rust',
    },
    {
      name: 'tags',
      title: 'Štítky',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Expertní kurz', value: 'expertni' },
          { title: 'Didaktika', value: 'didaktika' },
          { title: 'AI', value: 'ai' },
          { title: 'SVP', value: 'svp' },
          { title: 'Na míru', value: 'na-miru' },
        ],
      },
    },
    {
      name: 'dates',
      title: 'Termíny',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'courseTerm',
          fields: [
            { name: 'date_start', title: 'Začátek', type: 'datetime' },
            { name: 'date_end', title: 'Konec', type: 'datetime' },
            { name: 'location', title: 'Místo konání', type: 'string' },
            { name: 'capacity', title: 'Kapacita', type: 'number' },
            {
              name: 'note',
              title: 'Poznámka k termínu',
              type: 'string',
              description: 'Např. "online", "náhradní termín"',
            },
          ],
          preview: {
            select: { title: 'date_start', subtitle: 'location' },
          },
        },
      ],
      description: 'Jeden kurz může mít více termínů. Uživatel si při přihlášení vybere konkrétní termín.',
    },
    { name: 'duration_minutes', title: 'Délka (minuty)', type: 'number' },
    {
      name: 'price',
      title: 'Cena',
      type: 'string',
      description: 'Např. "zdarma", "500 Kč", "hradí zaměstnavatel"',
    },
    { name: 'lecturer', title: 'Lektor', type: 'reference', to: [{ type: 'lecturer' }] },
    { name: 'contact_name', title: 'Kontaktní osoba', type: 'string' },
    { name: 'contact_email', title: 'Kontaktní e-mail', type: 'string' },
    { name: 'image', title: 'Obrázek kurzu', type: 'image', options: { hotspot: true } },
    {
      name: 'materials',
      title: 'Materiály',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Název', type: 'string' },
            { name: 'url', title: 'Odkaz (Google Drive, web...)', type: 'url' },
          ],
        },
      ],
      description: 'Odkazy na materiály z Google Drive nebo jiné zdroje',
    },
    {
      name: 'external_url',
      title: 'Externí odkaz',
      type: 'url',
      description: 'Pokud kurz vede na externí web (scioedu.cz apod.)',
    },
    { name: 'is_published', title: 'Publikováno', type: 'boolean', initialValue: true },
    {
      name: 'is_external',
      title: 'Externí kurz',
      type: 'boolean',
      initialValue: false,
      description: 'Pouze odkaz na jiný web — zobrazí zkrácený detail s tlačítkem "Přejít na přihlášení"',
    },
  ],
};
