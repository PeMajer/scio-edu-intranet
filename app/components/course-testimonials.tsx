import { HighlightBox } from "~/components/highlight-box";

export function CourseTestimonials({ testimonials }: { testimonials: string[] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="font-[family-name:var(--font-poppins)] font-bold text-lg mb-3">Napsali o kurzu</h3>

      <div
        className="-mx-4 pl-4 pr-8 md:mx-0 md:pl-0 md:pr-0 flex md:grid md:grid-cols-2 gap-3 md:gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory md:snap-none scroll-pl-4 md:scroll-pl-0 pb-3 md:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((text, idx) => (
          <div key={idx} className="shrink-0 w-[92%] md:w-auto snap-start">
            <HighlightBox variant="primary" className="h-full">
              <p className="italic text-foreground/85 leading-relaxed whitespace-pre-line">
                „{text}“
              </p>
            </HighlightBox>
          </div>
        ))}
      </div>
    </div>
  );
}
