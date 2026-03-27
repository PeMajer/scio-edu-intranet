import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { createSanityClient, getImageUrlBuilder } from "~/lib/sanity.server";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { PageHeader } from "~/components/layout/page-header";
import { ArrowRight, Calendar, GraduationCap, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import type { Enrollment } from "~/lib/types";
import type { Course } from "~/lib/sanity.server";

type EnrollmentWithCourse = Enrollment & {
  course?: Pick<Course, "_id" | "title" | "slug" | "highlight" | "image" | "dates"> & {
    imageUrl?: string;
  };
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { user, supabase, headers } = await requireAuth(request, context);

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false });

  if (!enrollments || enrollments.length === 0) {
    return json({ enrollments: [] as EnrollmentWithCourse[] }, { headers });
  }

  const courseIds = [...new Set(enrollments.map((e) => e.course_id))];
  const sanity = createSanityClient(context);
  const imageBuilder = getImageUrlBuilder(context);

  const courses = await sanity.fetch<Course[]>(
    `*[_type == "course" && _id in $ids]{ _id, title, slug, highlight, image, dates }`,
    { ids: courseIds }
  );

  const courseMap = new Map(
    courses.map((c) => [
      c._id,
      {
        ...c,
        imageUrl: c.image ? imageBuilder.image(c.image).width(400).url() : null,
      },
    ])
  );

  const enriched: EnrollmentWithCourse[] = enrollments.map((e) => ({
    ...e,
    course: courseMap.get(e.course_id) || undefined,
  }));

  return json({ enrollments: enriched }, { headers });
}

const statusColors = {
  enrolled: "secondary",
  completed: "default",
  cancelled: "destructive",
} as const;

const statusLabels = {
  enrolled: "Přihlášen",
  completed: "Dokončeno",
  cancelled: "Zrušeno",
};

export default function MojeKurzy() {
  const { enrollments } = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeader title="Moje kurzy" description="Přehled vašich přihlášených kurzů" imageUrl="/images/hero-discussion.jpg" />

      {enrollments.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border bg-card">
          <div
            className="h-40 bg-cover bg-center relative"
            style={{ backgroundImage: "url('/images/hero-classroom.jpg')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/70 to-primary/20" />
          </div>
          <div className="text-center px-6 pb-10 -mt-8 relative z-10">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Zatím nemáte žádné kurzy
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Přihlaste se do svého prvního kurzu a začněte rozvíjet své dovednosti
            </p>
            <Button variant="accent" size="lg" asChild>
              <Link to="/vzdelavani">Prohlédnout kurzy</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {enrollments.map((enrollment: EnrollmentWithCourse) => {
            const course = enrollment.course;
            const termDate = course?.dates?.[enrollment.term_index]?.date_start;
            const termLocation = course?.dates?.[enrollment.term_index]?.location;

            return (
              <Link
                key={enrollment.id}
                to={course?.slug ? `/vzdelavani/kurz/${course.slug.current}` : "#"}
                className="group relative overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-all flex flex-col"
              >
                {/* Image */}
                <div className="h-36 relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{
                      backgroundImage: `url('${course?.imageUrl || "/images/hero-classroom.jpg"}')`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <Badge variant={statusColors[enrollment.status]} className="text-xs shadow-md">
                      {statusLabels[enrollment.status]}
                    </Badge>
                  </div>
                </div>
                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 line-clamp-2">
                    {course?.title || "Neznámý kurz"}
                  </h3>
                  <div className="space-y-1.5 flex-1">
                    {termDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span>{format(new Date(termDate), "d. MMMM yyyy", { locale: cs })}</span>
                      </div>
                    )}
                    {termLocation && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span>{termLocation}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="text-xs text-muted-foreground">
                      Přihlášeno {format(new Date(enrollment.enrolled_at), "d. M. yyyy", { locale: cs })}
                    </span>
                    <span className="text-sm font-medium text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                      Detail
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
