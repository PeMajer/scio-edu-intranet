import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { createSanityClient, getImageUrlBuilder } from "~/lib/sanity.server";
import { PageHeader } from "~/components/layout/page-header";
import { SectionHeader } from "~/components/layout/section-header";
import { CourseCard } from "~/components/course-card";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Target, Wrench, Sparkles, ExternalLink, Link2 } from "lucide-react";
import { PortableText } from "@portabletext/react";
import type { Course } from "~/lib/sanity.server";

type Resource = { label: string; url: string; type?: string };
type SectionPage = { intro_text?: any[]; resources?: Resource[]; cover_image?: any };

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { headers } = await requireAuth(request, context);

  const sanity = createSanityClient(context);
  const imageBuilder = getImageUrlBuilder(context);
  const [courses, sectionPage] = await Promise.all([
    sanity.fetch<Course[]>(
      `*[_type == "course" && section == "rust" && is_published == true] | order(_createdAt desc)`
    ),
    sanity.fetch<SectionPage | null>(
      `*[_type == "sectionPage" && section_key == "rust" && is_visible == true][0]{ intro_text, resources, cover_image }`
    ),
  ]);

  const coursesWithImages = courses.map((c) => ({
    ...c,
    imageUrl: c.image
      ? imageBuilder.image(c.image).width(600).height(400).format("webp").url()
      : null,
  }));

  const subsections = {
    sciocile: coursesWithImages.filter((c) => c.subsection === "sciocile"),
    remeslo: coursesWithImages.filter((c) => c.subsection === "remeslo"),
    "osobni-rozvoj": coursesWithImages.filter((c) => c.subsection === "osobni-rozvoj"),
  };

  const coverImageUrl = sectionPage?.cover_image
    ? imageBuilder.image(sectionPage.cover_image).width(1200).height(400).format("webp").url()
    : null;

  return json({
    subsections,
    introText: sectionPage?.intro_text ?? null,
    resources: sectionPage?.resources ?? [],
    coverImageUrl,
  }, { headers });
}

const subsectionConfig = {
  sciocile: { title: "Kurzy na ScioCíle", icon: Target },
  remeslo: { title: "Řemeslo průvodce", icon: Wrench },
  "osobni-rozvoj": { title: "Osobní rozvoj", icon: Sparkles },
};

export default function VzdelavaniRust() {
  const { subsections, introText, resources, coverImageUrl } = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeader
        fullWidth
        title="Vzdělávání a růst pro každého"
        description="Kurzy zaměřené na osobní rozvoj a odborné dovednosti"
        imageUrl={coverImageUrl || "/images/hero-learning.jpg"}
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="text-white/70 hover:text-white transition-colors">
                  <Link to="/vzdelavani">Vzdělávání</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/50" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-medium">Osobní růst</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
        className="-mt-6 mb-8"
      />

      {introText && (
        <div className="prose prose-gray max-w-none mb-8">
          <PortableText value={introText} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Kurzy (2/3) */}
        <div className="lg:col-span-2 space-y-10">
          {Object.entries(subsectionConfig).map(([key, config]) => {
            const courses = subsections[key as keyof typeof subsections];
            return (
              <section key={key}>
                <SectionHeader icon={config.icon} title={config.title} className="mb-5" />
                {courses.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-border p-10 text-center text-muted-foreground">
                    <p className="text-sm">Momentálně nejsou k dispozici žádné kurzy.</p>
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-5">
                    {courses.map((course) => (
                      <CourseCard
                        key={course._id}
                        title={course.title}
                        slug={course.slug.current}
                        highlight={course.highlight}
                        price={course.price}
                        isExternal={course.is_external}
                        imageUrl={course.imageUrl}
                      />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-6">
          {resources.length > 0 && (
            <Card>
              <div className="p-5">
                <SectionHeader icon={Link2} title="Materiály a odkazy" className="mb-4" />
                <div className="space-y-0">
                  {resources.map((resource, i) => (
                    <div key={i}>
                      {i > 0 && <Separator className="my-2" />}
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-2 py-2 text-sm text-foreground hover:text-primary transition-colors group"
                      >
                        <span>{resource.label}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
