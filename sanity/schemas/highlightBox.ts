export const highlightBox = {
  name: 'highlightBox',
  title: 'Highlight box',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Interní název',
      type: 'string',
      description: 'Pro orientaci v administraci (např. „CTA — prohlédnout kurzy"). Nezobrazuje se na webu.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heading',
      title: 'Nadpis',
      type: 'string',
      description: 'Hlavní text boxu (např. „Hledáte kurz pro sebe nebo svůj tým?").',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Popisek',
      type: 'string',
      description: 'Doplňující věta pod nadpisem.',
    },
    {
      name: 'variant',
      title: 'Barevná varianta',
      type: 'string',
      options: {
        list: [
          { title: 'Žlutá (accent)', value: 'accent' },
          { title: 'Tyrkysová (primary)', value: 'primary' },
        ],
        layout: 'radio',
      },
      initialValue: 'accent',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'button',
      title: 'Tlačítko',
      type: 'object',
      validation: (Rule: any) => Rule.required(),
      fields: [
        {
          name: 'label',
          title: 'Text tlačítka',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'linkType',
          title: 'Typ odkazu',
          type: 'string',
          options: {
            list: [
              { title: 'Kurz', value: 'course' },
              { title: 'Stránka sekce', value: 'section' },
              { title: 'Vlastní URL', value: 'url' },
            ],
            layout: 'radio',
          },
          initialValue: 'course',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'course',
          title: 'Kurz',
          type: 'reference',
          to: [{ type: 'course' }],
          hidden: ({ parent }: { parent?: { linkType?: string } }) => parent?.linkType !== 'course',
          validation: (Rule: any) =>
            Rule.custom((value: unknown, context: { parent?: { linkType?: string } }) => {
              if (context.parent?.linkType === 'course' && !value) return 'Vyberte kurz.';
              return true;
            }),
        },
        {
          name: 'section',
          title: 'Stránka sekce',
          type: 'reference',
          to: [{ type: 'sectionPage' }],
          hidden: ({ parent }: { parent?: { linkType?: string } }) => parent?.linkType !== 'section',
          validation: (Rule: any) =>
            Rule.custom((value: unknown, context: { parent?: { linkType?: string } }) => {
              if (context.parent?.linkType === 'section' && !value) return 'Vyberte stránku sekce.';
              return true;
            }),
        },
        {
          name: 'url',
          title: 'URL',
          type: 'string',
          description: 'Začíná „/" pro interní cestu (např. /profil) nebo „https://" pro externí web.',
          hidden: ({ parent }: { parent?: { linkType?: string } }) => parent?.linkType !== 'url',
          validation: (Rule: any) =>
            Rule.custom((value: string | undefined, context: { parent?: { linkType?: string } }) => {
              if (context.parent?.linkType !== 'url') return true;
              if (!value) return 'Zadejte URL.';
              if (!/^(\/|https?:\/\/)/.test(value)) {
                return 'URL musí začínat „/" (interní) nebo „http(s)://" (externí).';
              }
              return true;
            }),
        },
      ],
    },
  ],
  preview: {
    select: { title: 'title', subtitle: 'heading', variant: 'variant' },
    prepare({ title, subtitle, variant }: { title?: string; subtitle?: string; variant?: string }) {
      const variantLabel = variant === 'primary' ? '🟢 ' : '🟡 ';
      return {
        title: title || 'Highlight box',
        subtitle: `${variantLabel}${subtitle || ''}`.trim(),
      };
    },
  },
};
