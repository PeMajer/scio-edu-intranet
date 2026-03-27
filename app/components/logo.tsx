import { cn } from "~/lib/cn";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "color" | "white" | "dark";
  className?: string;
}

const sizes = {
  sm: "h-7",
  md: "h-9",
  lg: "h-12",
};

const filters = {
  color: "",
  white: "brightness-0 invert",
  dark: "brightness-0",
};

export function Logo({ size = "md", variant = "color", className }: LogoProps) {
  return (
    <img
      src="/images/logo.png"
      alt="ScioEdu"
      className={cn(sizes[size], "w-auto", filters[variant], className)}
    />
  );
}
