import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { createSanityClient, getImageUrlBuilder } from "~/lib/sanity.server";
import { PageHeader } from "~/components/layout/page-header";
import { SectionHeader } from "~/components/layout/section-header";
import { CourseCard } from "~/components/course-card";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Users, ExternalLink, Link2 } from "lucide-react";
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
      `*[_type == "course" && section == "tymy" && is_published == true] | order(_createdAt desc)`
    ),
    sanity.fetch<SectionPage | null>(
      `*[_type == "sectionPage" && section_key == "tymy" && is_visible == true][0]{ intro_text, resources, cover_image }`
    ),
  ]);

  const coursesWithImages = courses.map((c) => ({
    ...c,
    imageUrl: c.image
      ? imageBuilder.image(c.image).width(600).height(400).format("webp").url()
      : null,
  }));

  const coverImageUrl = sectionPage?.cover_image
    ? imageBuilder.image(sectionPage.cover_image).width(1200).height(400).format("webp").url()
    : null;

  return json({
    courses: coursesWithImages,
    introText: sectionPage?.intro_text ?? null,
    resources: sectionPage?.resources ?? [],
    coverImageUrl,
  }, { headers });
}

export default function VzdelavaniTymy() {
  const { courses, introText, resources, coverImageUrl } = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeader
        title="Rozvoj pro týmy a kvadriády"
        description="Specializované programy pro týmovou spolupráci a rozvoj kvadriád"
        imageUrl={coverImageUrl || "/images/hero-team.jpg"}
        breadcrumbs={[
          { label: "Vzdělávání", href: "/vzdelavani" },
          { label: "Týmy" },
        ]}
      />

      {introText && (
        <div className="prose prose-gray max-w-none mb-8">
          <PortableText value={introText} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Kurzy (2/3) */}
        <div className="lg:col-span-2">
          {courses.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Momentálně nejsou k dispozici žádné kurzy
              </h3>
              <p className="text-muted-foreground">Brzy přidáme nové týmové programy</p>
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
