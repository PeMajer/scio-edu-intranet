import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { createSanityClient, getImageUrlBuilder } from "~/lib/sanity.server";
import { PageHeader } from "~/components/layout/page-header";
import { CourseCard } from "~/components/course-card";
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
        {visibleCategories.map((category) => (
          <CourseCard
            key={category.key}
            href={category.href}
            title={category.title}
            highlight={category.description}
            imageUrl={sectionImages[category.key] || category.fallbackImage}
            icon={category.icon}
            height="h-[220px] sm:h-[280px]"
          />
        ))}
      </div>
    </>
  );
}
