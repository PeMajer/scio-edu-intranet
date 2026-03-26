import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { createSanityClient } from "~/lib/sanity.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { BookOpen, ExternalLink } from "lucide-react";
import type { Course } from "~/lib/sanity.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { headers } = await requireAuth(request, context);

  const sanity = createSanityClient(context);
  const courses = await sanity.fetch<Course[]>(
    `*[_type == "course" && section == "novacek" && is_published == true] | order(_createdAt desc)`
  );

  return json({ courses }, { headers });
}

export default function VzdelavaniNovacek() {
  const { courses } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Jsem ve ScioPolis nováček
        </h1>
        <p className="text-lg text-[#687A7C]">
          Úvodní kurzy a informace pro nové zaměstnance
        </p>
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

        <Card className="bg-[#BADEDF]/20">
          <CardHeader>
            <CardTitle>Informace a koncepce</CardTitle>
            <CardDescription>
              Další materiály a dokumenty pro nováčky
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link to="/koncepce">
                <BookOpen className="w-4 h-4 mr-2" />
                Přejít na sekci Koncepce
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
