import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { createSanityClient, getImageUrlBuilder } from "~/lib/sanity.server";
import { PageHeader } from "~/components/layout/page-header";
import { CourseGrid } from "~/components/course-grid";
import { ResourcesCard } from "~/components/resources-card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Users } from "lucide-react";
import { RichText } from "~/components/rich-text";
import { HighlightBoxList } from "~/components/highlight-box-list";
import { HIGHLIGHT_BOXES_PROJECTION, type HighlightBoxDoc } from "~/lib/highlight-box";
import type { Course } from "~/lib/sanity.server";

type Resource = { label: string; url: string; type?: string };
type SectionPage = {
  intro_text?: any[];
  resources?: Resource[];
  cover_image?: any;
  highlight_boxes?: HighlightBoxDoc[];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { headers } = await requireAuth(request, context);

  const sanity = createSanityClient(context);
  const imageBuilder = getImageUrlBuilder(context);
  const [courses, sectionPage] = await Promise.all([
    sanity.fetch<Course[]>(
      `*[_type == "course" && section == "tymy" && is_published == true] | order(_createdAt desc)`
    ),
    sanity.fetch<SectionPage | null>(
      `*[_type == "sectionPage" && section_key == "tymy" && is_visible == true][0]{
        intro_text,
        resources,
        cover_image,
        ${HIGHLIGHT_BOXES_PROJECTION}
      }`
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
    highlightBoxes: sectionPage?.highlight_boxes ?? [],
    coverImageUrl,
  }, { headers });
}

export default function VzdelavaniTymy() {
  const { courses, introText, resources, highlightBoxes, coverImageUrl } = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeader
        fullWidth
        title="Rozvoj pro týmy a kvadriády"
        description="Specializované programy pro týmovou spolupráci a rozvoj kvadriád"
        imageUrl={coverImageUrl || "/images/hero-team.jpg"}
        breadcrumb={
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="text-white/60 hover:text-white/90 transition-colors">
                  <Link to="/programy">Programy</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/40" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white/80 font-medium">Týmy</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        }
        className="-mt-6 mb-8"
      />

      <div className={`grid gap-6 ${resources.length > 0 ? "lg:grid-cols-3" : ""}`}>
        <div className={resources.length > 0 ? "lg:col-span-2" : ""}>
          {introText && <RichText value={introText} className="mb-8" />}
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
            <CourseGrid courses={courses} />
          )}
          <HighlightBoxList boxes={highlightBoxes} />
        </div>

        {resources.length > 0 && (
          <div className="space-y-6">
            <ResourcesCard resources={resources} />
          </div>
        )}
      </div>
    </>
  );
}
