export const blockContent = {
  name: 'blockContent',
  title: 'Obsah',
  type: 'array',
  of: [
    {
      type: 'block',
      marks: {
        annotations: [
          {
            name: 'link',
            type: 'object',
            fields: [
              { name: 'href', type: 'url' },
              { name: 'isExternal', type: 'boolean', initialValue: false },
            ],
          },
        ],
      },
    },
    { type: 'image', options: { hotspot: true } },
  ],
};
