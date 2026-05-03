export function portableTextToPlain(value: unknown): string {
  if (!Array.isArray(value)) return "";
  return value
    .map((block) => {
      if (
        !block ||
        typeof block !== "object" ||
        (block as { _type?: string })._type !== "block"
      ) {
        return "";
      }
      const children = (block as { children?: Array<{ text?: unknown }> }).children;
      if (!Array.isArray(children)) return "";
      return children
        .map((c) => (typeof c?.text === "string" ? c.text : ""))
        .join("");
    })
    .filter(Boolean)
    .join("\n\n");
}
