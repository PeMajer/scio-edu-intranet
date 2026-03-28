import { cn } from "~/lib/cn";

interface HighlightBoxProps {
  children: React.ReactNode;
  className?: string;
}

export function HighlightBox({ children, className }: HighlightBoxProps) {
  return (
    <div
      className={cn(
        "rounded-2xl p-6 border-l-4 border-y-0 border-r-0",
        className
      )}
      style={{
        borderColor: 'var(--color-scioedu-accent)',
        background: 'linear-gradient(to right, color-mix(in srgb, var(--color-scioedu-accent) 15%, white), color-mix(in srgb, var(--color-scioedu-accent) 5%, white))',
      }}
    >
      {children}
    </div>
  );
}
