import { useState, useEffect } from "react";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData, useFetcher } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { createSanityClient, getImageUrlBuilder } from "~/lib/sanity.server";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { PageHeader } from "~/components/layout/page-header";
import { Badge } from "~/components/ui/badge";
import { ArrowRight, Calendar, GraduationCap, MapPin } from "lucide-react";
import { parseISO } from "date-fns";
import { formatPrague } from "~/lib/format-date";
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
    .eq("status", "enrolled")
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

export async function action({ request, context }: ActionFunctionArgs) {
  const { user, supabase, headers } = await requireAuth(request, context);

  const formData = await request.formData();
  const enrollmentId = formData.get("enrollmentId") as string;

  const { error } = await supabase
    .from("enrollments")
    .update({ status: "cancelled" })
    .eq("id", enrollmentId)
    .eq("user_id", user.id);

  if (error) {
    return json({ error: error.message }, { status: 400, headers });
  }

  return json({ success: true }, { headers });
}

function CancelButton({ enrollmentId, courseTitle, termDate, termLocation }: {
  enrollmentId: string;
  courseTitle?: string;
  termDate?: string;
  termLocation?: string;
}) {
  const fetcher = useFetcher<{ error?: string; success?: boolean }>();
  const [open, setOpen] = useState(false);
  const isSubmitting = fetcher.state === "submitting";

  useEffect(() => {
    if (fetcher.data?.success) {
      setOpen(false);
    }
  }, [fetcher.data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-brand-primary font-medium text-sm cursor-pointer transition-all hover:opacity-80">
          Odhlásit se
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Odhlásit se z kurzu</DialogTitle>
          <DialogDescription>
            Opravdu se chcete odhlásit z tohoto kurzu?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <p><span className="text-muted-foreground">Kurz:</span> <span className="font-semibold">{courseTitle}</span></p>
            {termDate && (
              <p><span className="text-muted-foreground">Termín:</span> <span className="font-medium">{formatPrague(parseISO(termDate), "d. MMMM yyyy")}</span></p>
            )}
            {termLocation && (
              <p><span className="text-muted-foreground">Místo:</span> <span className="font-medium">{termLocation}</span></p>
            )}
          </div>
          {fetcher.data?.error && (
            <p className="text-sm text-destructive">{fetcher.data.error}</p>
          )}
          <fetcher.Form method="post">
            <input type="hidden" name="enrollmentId" value={enrollmentId} />
            <Button
              type="submit"
              variant="destructive"
              size="xl"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Odhlašuji..." : "Potvrdit odhlášení"}
            </Button>
          </fetcher.Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function MojeKurzy() {
  const { enrollments } = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeader
        fullWidth
        title="Moje kurzy"
        description="Přehled vašich přihlášených kurzů"
        imageUrl="/images/hero-discussion.jpg"
        className="-mt-6 mb-8"
      />

      {enrollments.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-16 text-center">
          <div className="bg-brand-light-pale rounded-full p-4 inline-flex mb-4">
            <GraduationCap className="w-8 h-8 text-brand-primary" />
          </div>
          <h3 className="font-[family-name:var(--font-poppins)] font-bold text-xl">
            Zatím nemáte žádné kurzy
          </h3>
          <p className="text-muted-foreground text-sm mt-2 mb-6 max-w-md mx-auto">
            Přihlaste se do svého prvního kurzu a začněte rozvíjet své dovednosti
          </p>
          <Button variant="primary" asChild>
            <Link to="/programy">Prohlédnout kurzy</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment: EnrollmentWithCourse) => {
            const course = enrollment.course;
            const termDate = course?.dates?.[enrollment.term_index]?.date_start;
            const termLocation = course?.dates?.[enrollment.term_index]?.location;
            const termNote = course?.dates?.[enrollment.term_index]?.note;
            const courseHref = course?.slug ? `/programy/kurz/${course.slug.current}` : "#";

            return (
              <div
                key={enrollment.id}
                className="flex flex-col sm:flex-row gap-0 sm:gap-5 bg-card rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Image */}
                <Link to={courseHref} className="shrink-0 sm:w-56 h-40 sm:h-auto sm:self-stretch relative overflow-hidden group block">
                  <img
                    src={course?.imageUrl || "/images/hero-classroom.jpg"}
                    alt={course?.title || ""}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to right, color-mix(in srgb, var(--color-scioedu-primary) 60%, transparent) 0%, transparent 100%)' }}
                  />
                </Link>

                {/* Content */}
                <div className="flex-1 p-5 flex flex-col justify-between">
                  <div>
                    <Link to={courseHref} className="font-[family-name:var(--font-poppins)] font-bold text-lg text-foreground hover:text-brand-primary transition-colors line-clamp-2 block">
                      {course?.title || "Neznámý kurz"}
                    </Link>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                      {termDate && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="text-brand-primary" size={14} />
                          {formatPrague(parseISO(termDate), "d. MMMM yyyy")}
                        </span>
                      )}
                      {termLocation && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="text-brand-muted" size={14} />
                          {termLocation}
                        </span>
                      )}
                      {termNote && (
                        <Badge variant="brand" size="sm" className="capitalize">{termNote}</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <CancelButton
                      enrollmentId={enrollment.id}
                      courseTitle={course?.title}
                      termDate={termDate}
                      termLocation={termLocation}
                    />
                    <Link
                      to={courseHref}
                      className="text-brand-primary font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
                    >
                      Detail kurzu
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
