import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { requireAuth } from "~/lib/supabase.server";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { PageHeader } from "~/components/layout/page-header";
import { SectionHeader } from "~/components/layout/section-header";
import { Separator } from "~/components/ui/separator";
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
      <PageHeader title="Koncepce" description="Metodické balíky, koncepční dokumenty a podcasty" imageUrl="/images/hero-team.jpg" />

      <Card className="mb-8 border-primary/30 bg-primary/5">
        <CardContent className="pt-6 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-foreground font-medium mb-1">
              Sekce se připravuje
            </p>
            <p className="text-sm text-muted-foreground">
              Postupně přidáváme další materiály a dokumenty. Už teď tu ale najdete užitečné zdroje pro vaši práci.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((category) => (
          <Card key={category.type} className="overflow-hidden">
            {/* Image header */}
            <div
              className="h-32 bg-cover bg-center relative"
              style={{ backgroundImage: `url('${category.image}')` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            </div>
            <div className="p-5 pt-3">
              <SectionHeader icon={category.icon} title={category.title} className="mb-4" />
              <div className="space-y-0">
                {category.items.map((item, idx) => (
                  <div key={idx}>
                    {idx > 0 && <Separator className="my-2" />}
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 py-2 text-sm text-foreground hover:text-primary transition-colors group"
                    >
                      <span>{item.label}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
