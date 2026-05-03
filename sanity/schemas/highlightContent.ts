export const highlightContent = {
  name: 'highlightContent',
  title: 'Krátký text',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [{ title: 'Normální', value: 'normal' }],
      lists: [],
      marks: {
        decorators: [
          { title: 'Tučně', value: 'strong' },
          { title: 'Kurzíva', value: 'em' },
        ],
        annotations: [],
      },
    },
  ],
};
