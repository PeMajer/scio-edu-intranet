export type SanityRule = {
  required: () => SanityRule;
  min: (n: number) => SanityRule;
  max: (n: number) => SanityRule;
  custom: <V = unknown, C = unknown>(
    validator: (value: V, context: C) => string | true | Promise<string | true>
  ) => SanityRule;
};
