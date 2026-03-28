import { Link } from "@remix-run/react";

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
      className="group relative h-[200px] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-lg transition-all duration-200"
    >
      <img
        src={bgImage}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-3/5"
        style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--color-scioedu-primary) 90%, black) 0%, color-mix(in srgb, var(--color-scioedu-primary) 50%, transparent) 60%, transparent 100%)' }}
      />
      <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
        <h3 className="font-[family-name:var(--font-poppins)] font-bold text-lg text-white mb-1 line-clamp-2">
          {title}
        </h3>
        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-white/90 flex-1 line-clamp-2">
            {highlight || (price === 0 ? "Zdarma" : price ? `${price.toLocaleString("cs-CZ")} Kč` : "")}
          </span>
          <span className="text-white text-lg shrink-0">→</span>
        </div>
      </div>
    </Link>
  );
}
