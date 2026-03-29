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
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
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
            {
              name: 'date_start',
              title: 'Začátek',
              type: 'datetime',
              options: { dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm', timeStep: 15 },
            },
            {
              name: 'date_end',
              title: 'Konec',
              type: 'datetime',
              options: { dateFormat: 'DD.MM.YYYY', timeFormat: 'HH:mm', timeStep: 15 },
            },
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
            select: { start: 'date_start', end: 'date_end', location: 'location', capacity: 'capacity', note: 'note' },
            prepare({ start, end, location, capacity, note }: { start?: string; end?: string; location?: string; capacity?: number; note?: string }) {
              const fmt = (v?: string) => {
                if (!v) return null;
                const d = new Date(v);
                return isNaN(d.getTime()) ? null : d.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
              };
              const startFmt = fmt(start);
              const endFmt = fmt(end);
              const title = startFmt && endFmt
                ? `${startFmt} – ${endFmt}`
                : startFmt || 'Datum neuvedeno';
              const parts = [location, capacity ? `${capacity} míst` : null, note].filter(Boolean);
              return {
                title,
                subtitle: parts.join(' · ') || '',
              };
            },
          },
        },
      ],
      description: 'Jeden kurz může mít více termínů. Uživatel si při přihlášení vybere konkrétní termín.',
    },
    { name: 'duration_minutes', title: 'Délka (minuty)', type: 'number' },
    {
      name: 'price',
      title: 'Cena',
      type: 'number',
      description: 'Částka v Kč (0 = zdarma). Jednotka "Kč" se doplní automaticky.',
    },
    {
      name: 'lecturers',
      title: 'Lektoři',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'lecturer' }] }],
    },
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
