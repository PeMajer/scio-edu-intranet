import { Link } from "@remix-run/react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";

interface CourseCardProps {
  title: string;
  slug: string;
  highlight?: string;
  price?: number;
  isExternal?: boolean;
  imageUrl?: string;
}

const placeholderImages = [
  "/images/hero-classroom.jpg",
  "/images/hero-learning.jpg",
  "/images/hero-team.jpg",
  "/images/hero-discussion.jpg",
  "/images/hero-workshop.jpg",
];

function getPlaceholderImage(title: string): string {
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = ((hash << 5) - hash + title.charCodeAt(i)) | 0;
  }
  return placeholderImages[Math.abs(hash) % placeholderImages.length];
}

export function CourseCard({
  title,
  slug,
  highlight,
  price,
  isExternal,
  imageUrl,
}: CourseCardProps) {
  const bgImage = imageUrl || getPlaceholderImage(title);

  return (
    <Link
      to={`/vzdelavani/kurz/${slug}`}
      className="group relative overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-all flex flex-col"
    >
      {/* Image */}
      <div className="h-36 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          {isExternal && (
            <Badge variant="accent" className="text-xs shadow-md">
              <ExternalLink className="w-3 h-3 mr-1" />
              Externí
            </Badge>
          )}
          {typeof price === "number" && price > 0 && (
            <Badge variant="secondary" className="text-xs shadow-md">
              {price.toLocaleString("cs-CZ")} Kč
            </Badge>
          )}
          {(!price || price === 0) && (
            <Badge variant="secondary" className="text-xs shadow-md">
              Zdarma
            </Badge>
          )}
        </div>
      </div>
      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1 line-clamp-2">
          {title}
        </h3>
        {highlight && (
          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
            {highlight}
          </p>
        )}
        <div className="flex items-center justify-end mt-3 pt-3 border-t">
          <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
            Zobrazit detail
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
