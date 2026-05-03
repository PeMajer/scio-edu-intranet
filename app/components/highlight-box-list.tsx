import { Link } from "@remix-run/react";
import { HighlightBox } from "~/components/highlight-box";
import { Button } from "~/components/ui/button";
import {
  type HighlightBoxDoc,
  isExternalHref,
  resolveButtonHref,
} from "~/lib/highlight-box";

interface HighlightBoxListProps {
  boxes?: HighlightBoxDoc[] | null;
  className?: string;
}

export function HighlightBoxList({ boxes, className }: HighlightBoxListProps) {
  if (!boxes || boxes.length === 0) return null;

  return (
    <div className={className ?? "flex flex-col gap-4 mt-8"}>
      {boxes.map((box) => {
        const href = resolveButtonHref(box.button);
        const external = isExternalHref(href);
        return (
          <HighlightBox
            key={box._id}
            variant={box.variant ?? "accent"}
            className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{box.heading}</p>
              {box.description && (
                <p className="text-sm text-muted-foreground mt-0.5">{box.description}</p>
              )}
            </div>
            <Button variant="primary" className="shrink-0 w-full sm:w-auto" asChild>
              {external ? (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {box.button.label}
                </a>
              ) : (
                <Link to={href}>{box.button.label}</Link>
              )}
            </Button>
          </HighlightBox>
        );
      })}
    </div>
  );
}
