import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { createSanityClient } from "~/lib/sanity.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { BookOpen, ExternalLink } from "lucide-react";
import { PortableText } from "@portabletext/react";
import type { Course } from "~/lib/sanity.server";

type Resource = { label: string; url: string; type?: string };
type SectionPage = { intro_text?: any[]; resources?: Resource[] };

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { headers } = await requireAuth(request, context);

  const sanity = createSanityClient(context);
  const [courses, sectionPage] = await Promise.all([
    sanity.fetch<Course[]>(
      `*[_type == "course" && section == "novacek" && is_published == true] | order(_createdAt desc)`
    ),
    sanity.fetch<SectionPage | null>(
      `*[_type == "sectionPage" && section_key == "novacek" && is_visible == true][0]{ intro_text, resources }`
    ),
  ]);

  return json({
    courses,
    introText: sectionPage?.intro_text ?? null,
    resources: sectionPage?.resources ?? [],
  }, { headers });
}

export default function VzdelavaniNovacek() {
  const { courses, introText, resources } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Jsem ve ScioPolis nováček
        </h1>
        <p className="text-lg text-[#687A7C]">
          Úvodní kurzy a informace pro nové zaměstnance
        </p>
        {introText && (
          <div className="prose prose-gray max-w-none mt-4">
            <PortableText value={introText} />
          </div>
        )}
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Kurzy pro nováčky</CardTitle>
            <CardDescription>
              Základní vzdělávání pro nově příchozí zaměstnance
            </CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <div className="text-center py-8 text-[#687A7C]">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Momentálně nejsou k dispozici žádné kurzy</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
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
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-[#687A7C]">
                          {course.price ? `${course.price} Kč` : "Zdarma"}
                        </div>
                        <Button variant="accent" size="sm" asChild>
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
          <Card className="bg-[#BADEDF]/20">
            <CardHeader>
              <CardTitle>Materiály a odkazy</CardTitle>
              <CardDescription>
                Další zdroje a dokumenty pro nováčky
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {resources.map((resource, i) => (
                  <a
                    key={i}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-[#1DA2AC] hover:underline"
                  >
                    <ExternalLink className="w-4 h-4 shrink-0" />
                    {resource.label}
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
