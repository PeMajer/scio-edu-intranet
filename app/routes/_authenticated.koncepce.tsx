import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { requireAuth } from "~/lib/supabase.server";
import { PageHeader } from "~/components/layout/page-header";
import { HighlightBox } from "~/components/highlight-box";
import { SectionHeader } from "~/components/layout/section-header";
import { FileText, Headphones, BookOpen, ExternalLink, Info } from "lucide-react";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { headers } = await requireAuth(request, context);
  return json({}, { headers });
}

const resources = [
  {
    type: "podcast",
    title: "Podcasty",
    icon: Headphones,
    image: "/images/hero-discussion.jpg",
    items: [
      { label: "Podcast o vzdělávání v ScioPolis", url: "#" },
      { label: "Rozhovory s lektory", url: "#" },
    ],
  },
  {
    type: "methodological",
    title: "Metodické balíky",
    icon: BookOpen,
    image: "/images/hero-learning.jpg",
    items: [
      { label: "Metodický balík pro nováčky", url: "#" },
      { label: "Průvodce facilitací", url: "#" },
    ],
  },
  {
    type: "conceptual",
    title: "Koncepční dokumenty",
    icon: FileText,
    image: "/images/hero-team.jpg",
    items: [
      { label: "Strategie vzdělávání 2024", url: "#" },
      { label: "Koncepční rámec ScioPolis", url: "#" },
    ],
  },
];

export default function Koncepce() {
  return (
    <>
      <PageHeader fullWidth title="Koncepce" description="Metodické balíky, koncepční dokumenty a podcasty" imageUrl="/images/hero-team.jpg" className="-mt-6 mb-8" />

      <HighlightBox className="mb-8 flex items-start gap-3">
        <Info className="w-5 h-5 text-brand-accent shrink-0 mt-0.5" />
        <div>
          <p className="text-foreground font-medium mb-1">
            Sekce se připravuje
          </p>
          <p className="text-sm text-muted-foreground">
            Postupně přidáváme další materiály a dokumenty. Už teď tu ale najdete užitečné zdroje pro vaši práci.
          </p>
        </div>
      </HighlightBox>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((category) => (
          <div key={category.type} className="rounded-2xl border border-border overflow-hidden">
            <div className="relative border-b border-border">
              <img
                src={category.image}
                alt={category.title}
                className="aspect-video object-cover w-full"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(29,162,172,0.60) 0%, transparent 100%)' }}
              />
            </div>
            <div className="bg-card p-5 rounded-b-2xl">
              <SectionHeader icon={category.icon} title={category.title} className="mb-4" />
              {category.items.map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-between py-2.5 text-sm font-medium text-foreground hover:text-brand-primary transition-colors ${idx < category.items.length - 1 ? 'border-b border-border' : ''}`}
                >
                  <span>{item.label}</span>
                  <ExternalLink className="w-3.5 h-3.5 shrink-0 text-brand-primary" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
