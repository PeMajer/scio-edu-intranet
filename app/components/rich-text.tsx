import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { TypedObject } from "@portabletext/types";
import { cn } from "~/lib/cn";

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="leading-7">{children}</p>,
    h1: ({ children }) => (
      <h1 className="font-[family-name:var(--font-poppins)] font-bold text-2xl mt-6 mb-3">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="font-[family-name:var(--font-poppins)] font-bold text-xl mt-6 mb-3">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-[family-name:var(--font-poppins)] font-bold text-lg mt-5 mb-2">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-[family-name:var(--font-poppins)] font-semibold text-base mt-4 mb-2">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-brand-light pl-4 italic text-foreground/70 my-4">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc pl-6 space-y-1">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal pl-6 space-y-1">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="leading-7 marker:text-brand-primary">{children}</li>
    ),
    number: ({ children }) => (
      <li className="leading-7 marker:text-brand-primary">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ value, children }) => {
      const href = value?.href as string | undefined;
      const isExternal = !!href && /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="text-brand-primary underline underline-offset-2 hover:opacity-80"
        >
          {children}
        </a>
      );
    },
  },
};

export function RichText({
  value,
  className,
}: {
  value: TypedObject | TypedObject[];
  className?: string;
}) {
  return (
    <div className={cn("text-base text-foreground/80 space-y-4", className)}>
      <PortableText value={value} components={components} />
    </div>
  );
}
