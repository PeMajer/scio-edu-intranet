import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { createSanityClient, getImageUrlBuilder } from "~/lib/sanity.server";
import { PageHeader } from "~/components/layout/page-header";
import { ArrowRight, GraduationCap, Sparkles, Users, Map, type LucideIcon } from "lucide-react";

const sectionMeta: Record<
  string,
  { title: string; description: string; href: string; icon: LucideIcon; gradient: string; fallbackImage: string }
> = {
  novacek: {
    title: "Jsem ve ScioPolis nováček",
    description: "Úvodní kurzy a informace pro nové zaměstnance",
    href: "/vzdelavani/novacek",
    icon: GraduationCap,
    gradient: "from-primary to-primary/80",
    fallbackImage: "/images/hero-classroom.jpg",
  },
  rust: {
    title: "Vzdělávání a růst pro každého",
    description: "Kurzy zaměřené na osobní rozvoj a řemeslo průvodce",
    href: "/vzdelavani/rust",
    icon: Sparkles,
    gradient: "from-secondary to-secondary/80",
    fallbackImage: "/images/hero-learning.jpg",
  },
  tymy: {
    title: "Rozvoj pro týmy a kvadriády",
    description: "Specializované programy pro týmovou spolupráci",
    href: "/vzdelavani/tymy",
    icon: Users,
    gradient: "from-muted to-muted/80",
    fallbackImage: "/images/hero-team.jpg",
  },
  cesty: {
    title: "Vzdělávací cesty",
    description: "Dlouhodobé vzdělávací programy a cesty rozvoje",
    href: "/vzdelavani/cesty",
    icon: Map,
    gradient: "from-primary to-primary/80",
    fallbackImage: "/images/hero-discussion.jpg",
  },
};

const sectionOrder = ["novacek", "rust", "tymy", "cesty"];

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { headers } = await requireAuth(request, context);

  const sanity = createSanityClient(context);
  const imageBuilder = getImageUrlBuilder(context);

  const [sections, sectionPages] = await Promise.all([
    sanity.fetch<string[]>(
      `array::unique(*[_type == "course" && is_published == true].section)`
    ),
    sanity.fetch<Array<{ section_key: string; cover_image?: any }>>(
      `*[_type == "sectionPage" && is_visible == true]{ section_key, cover_image }`
    ),
  ]);

  const sectionImages: Record<string, string | null> = {};
  for (const sp of sectionPages) {
    sectionImages[sp.section_key] = sp.cover_image
      ? imageBuilder.image(sp.cover_image).width(800).height(400).format("webp").url()
      : null;
  }

  return json({ sections, sectionImages }, { headers });
}

export default function VzdelavaniIndex() {
  const { sections, sectionImages } = useLoaderData<typeof loader>();

  const visibleCategories = sectionOrder
    .filter((key) => sections.includes(key))
    .map((key) => ({ key, ...sectionMeta[key] }));

  return (
    <>
      <PageHeader
        title="Vzdělávání"
        description="Vyberte si z našich vzdělávacích kategorií"
        imageUrl="/images/hero-classroom.jpg"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {visibleCategories.map((category) => {
          const Icon = category.icon;
          const image = sectionImages[category.key] || category.fallbackImage;
          return (
            <Link
              key={category.key}
              to={category.href}
              className="group relative overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-all"
            >
              <div className="h-44 relative overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${image}')` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${category.gradient} opacity-60`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-lg drop-shadow-md">
                    {category.title}
                  </h3>
                </div>
              </div>
              <div className="p-4 flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  {category.description}
                </p>
                <ArrowRight className="w-5 h-5 text-muted-foreground/40 shrink-0 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
