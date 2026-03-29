export const tag = {
  name: 'tag',
  title: 'Štítek',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Název',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'value',
      title: 'Hodnota (slug)',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule: any) => Rule.required(),
      description: 'Unikátní identifikátor štítku (generuje se z názvu)',
    },
  ],
  preview: {
    select: { title: 'title' },
  },
};
