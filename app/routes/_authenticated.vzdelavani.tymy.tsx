import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { createSanityClient } from "~/lib/sanity.server";
import { PageHeader } from "~/components/layout/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Users, BookOpen, ExternalLink } from "lucide-react";
import { PortableText } from "@portabletext/react";
import type { Course } from "~/lib/sanity.server";

type Resource = { label: string; url: string; type?: string };
type SectionPage = { intro_text?: any[]; resources?: Resource[] };

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { headers } = await requireAuth(request, context);

  const sanity = createSanityClient(context);
  const [courses, sectionPage] = await Promise.all([
    sanity.fetch<Course[]>(
      `*[_type == "course" && section == "tymy" && is_published == true] | order(_createdAt desc)`
    ),
    sanity.fetch<SectionPage | null>(
      `*[_type == "sectionPage" && section_key == "tymy" && is_visible == true][0]{ intro_text, resources }`
    ),
  ]);

  return json({
    courses,
    introText: sectionPage?.intro_text ?? null,
    resources: sectionPage?.resources ?? [],
  }, { headers });
}

export default function VzdelavaniTymy() {
  const { courses, introText, resources } = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeader
        title="Rozvoj pro týmy a kvadriády"
        description="Specializované programy pro týmovou spolupráci a rozvoj kvadriád"
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

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle>Týmové kurzy</CardTitle>
              <CardDescription>
                Kurzy zaměřené na týmovou spolupráci a vedení
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="mb-2">Momentálně nejsou k dispozici žádné kurzy</p>
              <p className="text-sm">Brzy přidáme nové týmové programy</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {courses.map((course) => (
                <Card key={course._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg">{course.title}</CardTitle>
                      {course.is_external && (
                        <Badge variant="outline" className="text-xs">
                          Externí
                        </Badge>
                      )}
                    </div>
                    {course.highlight && (
                      <CardDescription>{course.highlight}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {course.price && (
                        <div className="text-sm text-muted-foreground">
                          Cena: <span className="font-semibold">{course.price} Kč</span>
                        </div>
                      )}
                      <Button variant="accent" size="sm" className="w-full" asChild>
                        <Link to={`/vzdelavani/kurz/${course.slug.current}`}>
                          Zobrazit detail
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {resources.length > 0 && (
        <Card className="bg-accent/20 mt-6">
          <CardHeader>
            <CardTitle>Materiály a odkazy</CardTitle>
            <CardDescription>Další zdroje pro týmový rozvoj</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {resources.map((resource, i) => (
                <a
                  key={i}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary hover:underline"
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  {resource.label}
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
