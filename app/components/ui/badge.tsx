import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-label",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#1DA2AC] text-white shadow",
        secondary: "border-transparent bg-[#BADEDF] text-[#1DA2AC] shadow-sm",
        accent: "border-transparent bg-[#FCB813] text-gray-900 shadow",
        destructive: "border-transparent bg-red-500 text-white shadow",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
