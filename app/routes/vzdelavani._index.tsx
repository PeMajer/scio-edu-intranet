import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { createSanityClient } from "~/lib/sanity.server";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { GraduationCap, Sparkles, Users, Map, type LucideIcon } from "lucide-react";

const sectionMeta: Record<string, { title: string; description: string; href: string; icon: LucideIcon; color: string }> = {
  novacek: {
    title: "Jsem ve ScioPolis nováček",
    description: "Úvodní kurzy a informace pro nové zaměstnance",
    href: "/vzdelavani/novacek",
    icon: GraduationCap,
    color: "bg-[#1DA2AC]",
  },
  rust: {
    title: "Vzdělávání a růst pro každého",
    description: "Kurzy zaměřené na osobní rozvoj a řemeslo průvodce",
    href: "/vzdelavani/rust",
    icon: Sparkles,
    color: "bg-[#FCB813]",
  },
  tymy: {
    title: "Rozvoj pro týmy a kvadriády",
    description: "Specializované programy pro týmovou spolupráci",
    href: "/vzdelavani/tymy",
    icon: Users,
    color: "bg-[#687A7C]",
  },
  cesty: {
    title: "Vzdělávací cesty",
    description: "Dlouhodobé vzdělávací programy a cesty rozvoje",
    href: "/vzdelavani/cesty",
    icon: Map,
    color: "bg-[#1DA2AC]",
  },
};

const sectionOrder = ["novacek", "rust", "tymy", "cesty"];

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { headers } = await requireAuth(request, context);

  const sanity = createSanityClient(context);
  const sections = await sanity.fetch<string[]>(
    `array::unique(*[_type == "course" && is_published == true].section)`
  );

  return json({ sections }, { headers });
}

export default function VzdelavaniIndex() {
  const { sections } = useLoaderData<typeof loader>();

  const visibleCategories = sectionOrder
    .filter((key) => sections.includes(key))
    .map((key) => ({ key, ...sectionMeta[key] }));

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Vzdělávání</h1>
        <p className="text-lg text-[#687A7C]">
          Vyberte si z našich vzdělávacích kategorií
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleCategories.map((category) => {
          const Icon = category.icon;
          return (
            <Link key={category.key} to={category.href}>
              <Card className="h-full hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-lg ${category.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription className="text-base">
                    {category.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
