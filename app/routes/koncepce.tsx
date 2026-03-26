import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { requireAuth } from "~/lib/supabase.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { FileText, Headphones, BookOpen, ExternalLink } from "lucide-react";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { headers } = await requireAuth(request, context);
  return json({}, { headers });
}

const resources = [
  {
    type: "podcast",
    title: "Podcasty",
    items: [
      { label: "Podcast o vzdělávání v ScioPolis", url: "#" },
      { label: "Rozhovory s lektory", url: "#" },
    ],
  },
  {
    type: "methodological",
    title: "Metodické balíky",
    items: [
      { label: "Metodický balík pro nováčky", url: "#" },
      { label: "Průvodce facilit ací", url: "#" },
    ],
  },
  {
    type: "conceptual",
    title: "Koncepční dokumenty",
    items: [
      { label: "Strategie vzdělávání 2024", url: "#" },
      { label: "Koncepční rámec ScioPolis", url: "#" },
    ],
  },
];

const iconMap = {
  podcast: Headphones,
  methodological: BookOpen,
  conceptual: FileText,
};

export default function Koncepce() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Koncepce</h1>
        <p className="text-lg text-[#687A7C]">
          Metodické balíky, koncepční dokumenty a podcasty
        </p>
      </div>

      <Card className="mb-8 bg-[#BADEDF]/20 border-[#1DA2AC]">
        <CardContent className="pt-6">
          <p className="text-[#687A7C] mb-2">
            Sekce se připravuje — ale už teď tu najdete užitečné zdroje pro vaši práci.
          </p>
          <p className="text-sm text-[#687A7C]">
            Postupně budeme přidávat další materiály a dokumenty.
          </p>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources.map((category) => {
          const Icon = iconMap[category.type as keyof typeof iconMap];
          return (
            <Card key={category.type}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-[#BADEDF] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#1DA2AC]" />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.items.map((item, idx) => (
                    <Button
                      key={idx}
                      variant="ghost"
                      className="w-full justify-between text-left h-auto py-3 px-3"
                      asChild
                    >
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        <span className="text-sm">{item.label}</span>
                        <ExternalLink className="w-4 h-4 flex-shrink-0" />
                      </a>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
