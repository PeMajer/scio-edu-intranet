import { cn } from "~/lib/cn";

type Variant = "accent" | "primary";

interface HighlightBoxProps {
  children: React.ReactNode;
  className?: string;
  variant?: Variant;
  withBorder?: boolean;
}

const variantTokens: Record<Variant, string> = {
  accent: "var(--color-scioedu-accent)",
  primary: "var(--color-scioedu-primary)",
};

export function HighlightBox({
  children,
  className,
  variant = "accent",
  withBorder = true,
}: HighlightBoxProps) {
  const color = variantTokens[variant];
  return (
    <div
      className={cn(
        "rounded-2xl p-6",
        withBorder && "border-l-4 border-y-0 border-r-0",
        className
      )}
      style={{
        ...(withBorder ? { borderColor: color } : {}),
        background: `linear-gradient(to right, color-mix(in srgb, ${color} 15%, white), color-mix(in srgb, ${color} 5%, white))`,
      }}
    >
      {children}
    </div>
  );
}
