import { ExternalLink, Link2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { SectionHeader } from "~/components/layout/section-header";

export interface Resource {
  label: string;
  url: string;
  type?: string;
}

interface ResourcesCardProps {
  resources: Resource[];
  title?: string;
  icon?: LucideIcon;
}

export function ResourcesCard({
  resources,
  title = "Materiály a odkazy",
  icon: Icon = Link2,
}: ResourcesCardProps) {
  if (resources.length === 0) return null;

  return (
    <Card>
      <div className="p-5">
        <SectionHeader icon={Icon} title={title} className="mb-4" />
        <div className="space-y-0">
          {resources.map((resource, i) => (
            <div key={i}>
              {i > 0 && <Separator className="my-2" />}
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-2 py-2 text-sm text-foreground hover:text-primary transition-colors group"
              >
                <span>{resource.label}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
