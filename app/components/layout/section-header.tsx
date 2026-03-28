import type { LucideIcon } from "lucide-react";
import { cn } from "~/lib/cn";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  className?: string;
}

export function SectionHeader({ icon: Icon, title, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="w-8 h-8 rounded-lg bg-brand-light-pale flex items-center justify-center">
        <Icon className="w-4 h-4 text-brand-primary" />
      </div>
      <h3 className="font-[family-name:var(--font-poppins)] font-bold text-2xl text-foreground">{title}</h3>
    </div>
  );
}
