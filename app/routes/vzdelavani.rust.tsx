import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Link } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { createSanityClient } from "~/lib/sanity.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Target, Wrench, Sparkles, BookOpen } from "lucide-react";
import type { Course } from "~/lib/sanity.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { headers } = await requireAuth(request, context);

  const sanity = createSanityClient(context);
  const courses = await sanity.fetch<Course[]>(
    `*[_type == "course" && section == "rust" && is_published == true] | order(_createdAt desc)`
  );

  const subsections = {
    "sciocile": courses.filter(c => c.subsection === "sciocile"),
    "remeslo": courses.filter(c => c.subsection === "remeslo"),
    "osobni": courses.filter(c => c.subsection === "osobni"),
  };

  return json({ subsections }, { headers });
}

const subsectionConfig = {
  sciocile: {
    title: "Kurzy na ScioCíle",
    description: "Specializované kurzy zaměřené na ScioCíle",
    icon: Target,
  },
  remeslo: {
    title: "Řemeslo průvodce",
    description: "Praktické dovednosti pro práci průvodce",
    icon: Wrench,
  },
  osobni: {
    title: "Osobní rozvoj",
    description: "Kurzy zaměřené na osobní růst a seberozvoj",
    icon: Sparkles,
  },
};

export default function VzdelavaniRust() {
  const { subsections } = useLoaderData<typeof loader>();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Vzdělávání a růst pro každého
        </h1>
        <p className="text-lg text-[#687A7C]">
          Kurzy zaměřené na osobní rozvoj a odborné dovednosti
        </p>
      </div>

      <div className="space-y-8">
        {Object.entries(subsectionConfig).map(([key, config]) => {
          const Icon = config.icon;
          const courses = subsections[key as keyof typeof subsections];

          return (
            <Card key={key}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#BADEDF] flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#1DA2AC]" />
                  </div>
                  <div>
                    <CardTitle>{config.title}</CardTitle>
                    <CardDescription>{config.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {courses.length === 0 ? (
                  <div className="text-center py-6 text-[#687A7C]">
                    <p>Momentálně nejsou k dispozici žádné kurzy</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {courses.map((course) => (
                      <Card key={course._id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-base">{course.title}</CardTitle>
                            {course.is_external && (
                              <Badge variant="outline" className="text-xs">
                                Externí
                              </Badge>
                            )}
                          </div>
                          {course.highlight && (
                            <CardDescription className="text-sm">{course.highlight}</CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <div className="text-sm text-[#687A7C]">
                              {course.price ? `${course.price} Kč` : "Zdarma"}
                            </div>
                            <Button variant="accent" size="sm" asChild>
                              <Link to={`/vzdelavani/kurz/${course.slug.current}`}>
                                Detail
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
          );
        })}
      </div>
    </div>
  );
}
