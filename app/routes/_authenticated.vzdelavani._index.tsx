import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { createSanityClient, getImageUrlBuilder } from "~/lib/sanity.server";
import { PageHeader } from "~/components/layout/page-header";
import { GraduationCap, Sparkles, Users, Map, type LucideIcon } from "lucide-react";

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
        fullWidth
        title="Vzdělávání"
        description="Vyberte si z našich vzdělávacích kategorií"
        imageUrl="/images/hero-classroom.jpg"
        className="-mt-6 mb-8"
      />

      <div className="grid md:grid-cols-2 gap-6">
        {visibleCategories.map((category) => {
          const Icon = category.icon;
          const image = sectionImages[category.key] || category.fallbackImage;
          return (
            <Link
              key={category.key}
              to={category.href}
              className="group relative h-[280px] rounded-2xl overflow-hidden cursor-pointer"
            >
              <img
                src={image}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
              />
              <div
                className="absolute inset-x-0 bottom-0 h-3/5"
                style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--color-scioedu-primary) 90%, black) 0%, color-mix(in srgb, var(--color-scioedu-primary) 50%, transparent) 60%, transparent 100%)' }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <div className="flex items-center gap-2 text-lg font-semibold text-white mb-1" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                  <Icon className="w-5 h-5" />
                  {category.title}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base text-white/90 flex-1">{category.description}</span>
                  <span className="text-white text-lg">→</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
