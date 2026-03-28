import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border border-transparent bg-primary text-primary-foreground shadow",
        secondary: "border border-transparent bg-accent text-primary shadow-sm",
        accent: "border border-transparent bg-secondary text-secondary-foreground shadow",
        destructive: "border border-transparent bg-destructive text-destructive-foreground shadow",
        outline: "border text-foreground",
        brand: "bg-brand-light text-brand-primary",
        "brand-accent": "bg-brand-accent text-black font-bold",
        "brand-success": "bg-brand-light text-brand-primary font-bold",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs rounded-md",
        sm: "px-2 py-0.5 text-xs rounded-full",
        md: "px-3 py-1 text-xs rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
