import { cn } from "~/lib/cn";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "color" | "white" | "dark";
  className?: string;
  showText?: boolean;
}

const sizes = {
  sm: "h-7",
  md: "h-9",
  lg: "h-12",
};

const textSizes = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
};

const colors = {
  color: "text-primary",
  white: "text-white",
  dark: "text-foreground",
};

export function Logo({
  size = "md",
  variant = "color",
  className,
  showText = true,
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 120 60"
        className={cn(sizes[size], "w-auto", colors[variant])}
        fill="currentColor"
        aria-hidden="true"
      >
        {/* ScioEdu infinity/eyes symbol */}
        <path d="M30 10c-11 0-20 9-20 20s9 20 20 20c5.5 0 10.5-2.2 14.1-5.9L60 30l-15.9-14.1C40.5 12.2 35.5 10 30 10zm0 8c3.3 0 6.3 1.3 8.5 3.5L30 30l8.5 8.5c-2.2 2.2-5.2 3.5-8.5 3.5-6.6 0-12-5.4-12-12s5.4-12 12-12zm-4 10a4 4 0 108 0 4 4 0 00-8 0z" />
        <path d="M90 10c-5.5 0-10.5 2.2-14.1 5.9L60 30l15.9 14.1C79.5 47.8 84.5 50 90 50c11 0 20-9 20-20S101 10 90 10zm0 8c6.6 0 12 5.4 12 12s-5.4 12-12 12c-3.3 0-6.3-1.3-8.5-3.5L90 30l-8.5-8.5C83.7 19.3 86.7 18 90 18zm-4 10a4 4 0 108 0 4 4 0 00-8 0z" />
      </svg>
      {showText && (
        <span
          className={cn(
            "font-bold tracking-tight",
            textSizes[size],
            colors[variant]
          )}
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          scio<span className="font-normal">edu</span>
        </span>
      )}
    </div>
  );
}
