import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { createSanityClient } from "~/lib/sanity.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Users, BookOpen } from "lucide-react";
import type { Course } from "~/lib/sanity.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { headers } = await requireAuth(request, context);

  const sanity = createSanityClient(context);
  const courses = await sanity.fetch<Course[]>(
    `*[_type == "course" && section == "tymy" && is_published == true] | order(_createdAt desc)`
  );

  return json({ courses }, { headers });
}

export default function VzdelavaniTymy() {
  const { courses } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Rozvoj pro týmy a kvadriády
        </h1>
        <p className="text-lg text-[#687A7C]">
          Specializované programy pro týmovou spolupráci a rozvoj kvadriád
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-[#687A7C] flex items-center justify-center">
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
            <div className="text-center py-12 text-[#687A7C]">
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
                        <div className="text-sm text-[#687A7C]">
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
    </div>
  );
}
