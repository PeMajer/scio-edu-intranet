import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";

export type GalleryPhoto = {
  key: string;
  alt: string;
  width: number;
  height: number;
  thumb: string;
  full: string;
};

export function CourseGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length));
      } else if (e.key === "ArrowRight") {
        setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIndex, photos.length]);

  if (photos.length === 0) return null;

  const active = activeIndex !== null ? photos[activeIndex] : null;
  const showPrevNext = photos.length > 1;

  return (
    <div className="mt-6">
      <h3 className="font-[family-name:var(--font-poppins)] font-bold text-lg mb-3">Fotografie z kurzu</h3>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-3 [&>*]:mb-3 [&>*]:break-inside-avoid">
        {photos.map((photo, idx) => (
          <button
            key={photo.key}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className="block w-full overflow-hidden rounded-lg ring-1 ring-black/5 transition hover:opacity-90 hover:ring-brand-primary/40 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            aria-label={`Otevřít fotku: ${photo.alt}`}
          >
            <img
              src={photo.thumb}
              alt={photo.alt}
              loading="lazy"
              width={photo.width}
              height={photo.height}
              className="w-full h-auto block"
            />
          </button>
        ))}
      </div>

      <Dialog open={active !== null} onOpenChange={(open) => !open && setActiveIndex(null)}>
        <DialogContent className="max-w-6xl w-[95vw] p-0 bg-transparent border-0 shadow-none sm:rounded-none">
          <DialogTitle className="sr-only">{active?.alt ?? "Fotografie z kurzu"}</DialogTitle>
          {active && (
            <div className="relative flex items-center justify-center">
              <img
                src={active.full}
                alt={active.alt}
                className="max-h-[90vh] w-auto rounded-lg shadow-2xl"
              />
              {showPrevNext && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((i) => (i === null ? null : (i - 1 + photos.length) % photos.length))
                    }
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 text-white p-2 transition focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    aria-label="Předchozí fotka"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveIndex((i) => (i === null ? null : (i + 1) % photos.length))
                    }
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 hover:bg-black/70 text-white p-2 transition focus:outline-none focus:ring-2 focus:ring-brand-accent"
                    aria-label="Další fotka"
                  >
                    <ChevronRight size={28} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                    {activeIndex! + 1} / {photos.length}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
