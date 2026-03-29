import { useState, useEffect } from "react";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { createSanityClient, getImageUrlBuilder } from "~/lib/sanity.server";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { PageHeader } from "~/components/layout/page-header";
import { HighlightBox } from "~/components/highlight-box";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { Calendar, MapPin, Users, Clock, ExternalLink, Mail, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { cs } from "date-fns/locale";
import { PortableText } from "@portabletext/react";
import type { Course } from "~/lib/sanity.server";

function formatDuration(minutes: number): string {
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);
  const mins = minutes % 60;
  const parts: string[] = [];
  if (days > 0) {
    parts.push(`${days} ${days === 1 ? 'den' : days >= 2 && days <= 4 ? 'dny' : 'dní'}`);
  }
  if (hours > 0) {
    parts.push(`${hours} ${hours === 1 ? 'hodina' : hours >= 2 && hours <= 4 ? 'hodiny' : 'hodin'}`);
  }
  if (mins > 0 && days === 0) {
    parts.push(`${mins} ${mins === 1 ? 'minuta' : mins >= 2 && mins <= 4 ? 'minuty' : 'minut'}`);
  }
  return parts.join(' ') || `${minutes} minut`;
}

function safeFormatDate(value: string | undefined | null, fmt: string): string {
  if (!value) return "Datum neuvedeno";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "Neplatné datum";
  return format(d, fmt, { locale: cs });
}

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const { user, supabase, headers } = await requireAuth(request, context);

  const sanity = createSanityClient(context);
  const course = await sanity.fetch<Course>(
    `*[_type == "course" && slug.current == $slug][0]{
      ...,
      lecturers[]->
    }`,
    { slug: params.slug }
  );

  if (!course) {
    throw new Response("Kurz nenalezen", { status: 404 });
  }

  const imageBuilder = getImageUrlBuilder(context);
  const courseImage = course.image ? imageBuilder.image(course.image).width(800).url() : null;
  const lecturerPhotos = (course.lecturers || []).map((l) =>
    l.photo ? imageBuilder.image(l.photo).width(200).url() : null
  );

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", course._id)
    .eq("status", "enrolled");

  const enrolledTerms = new Set((enrollments || []).map((e: { term_index: number }) => e.term_index));

  // Count all enrolled users per term for capacity tracking
  const { data: allEnrollments } = await supabase
    .from("enrollments")
    .select("term_index")
    .eq("course_id", course._id)
    .eq("status", "enrolled");

  const enrolledCountByTerm: Record<number, number> = {};
  for (const e of allEnrollments || []) {
    enrolledCountByTerm[e.term_index] = (enrolledCountByTerm[e.term_index] || 0) + 1;
  }

  return json({ course, courseImage, lecturerPhotos, userId: user.id, enrolledTerms: [...enrolledTerms], enrolledCountByTerm }, { headers });
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const { user, supabase, headers } = await requireAuth(request, context);

  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const termIndex = parseInt(formData.get("termIndex") as string);
  const courseId = formData.get("courseId") as string;

  if (intent === "enroll") {
    // Server-side capacity check
    const sanity = createSanityClient(context);
    const course = await sanity.fetch<Course>(
      `*[_type == "course" && _id == $courseId][0]{ dates }`,
      { courseId }
    );
    const termCapacity = course?.dates?.[termIndex]?.capacity;
    if (termCapacity) {
      const { count } = await supabase
        .from("enrollments")
        .select("*", { count: "exact", head: true })
        .eq("course_id", courseId)
        .eq("term_index", termIndex)
        .eq("status", "enrolled");
      if ((count || 0) >= termCapacity) {
        return json({ error: "Kapacita termínu je již plná" }, { status: 400, headers });
      }
    }
  }

  if (intent === "cancel") {
    const { error } = await supabase
      .from("enrollments")
      .update({ status: "cancelled" })
      .eq("user_id", user.id)
      .eq("course_id", courseId)
      .eq("term_index", termIndex)
      .eq("status", "enrolled");

    if (error) {
      return json({ error: error.message }, { status: 400, headers });
    }
  } else {
    const { error } = await supabase
      .from("enrollments")
      .upsert(
        {
          user_id: user.id,
          course_id: courseId,
          term_index: termIndex,
          status: "enrolled",
          enrolled_at: new Date().toISOString(),
        },
        { onConflict: "user_id,course_id,term_index" }
      );

    if (error) {
      return json({ error: error.message }, { status: 400, headers });
    }
  }

  return json({ success: true }, { headers });
}

function TermAction({ courseId, courseTitle, termIndex, dateStart, location, isEnrolled, isFull }: {
  courseId: string;
  courseTitle: string;
  termIndex: number;
  dateStart: string;
  location: string;
  isEnrolled: boolean;
  isFull: boolean;
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
        {isEnrolled ? (
          <Button variant="outline" className="w-full mt-3">
            Odhlásit se
          </Button>
        ) : (
          <Button variant="primary" className={`w-full mt-3 ${isFull ? "cursor-not-allowed opacity-50" : ""}`} disabled={isFull}>
            {isFull ? "Obsazeno" : "Přihlásit se"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEnrolled ? "Odhlásit se z kurzu" : "Přihlásit se na kurz"}</DialogTitle>
          <DialogDescription>
            {isEnrolled
              ? "Opravdu se chcete odhlásit z tohoto termínu?"
              : "Potvrzením se přihlásíte na vybraný termín kurzu"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <p><span className="text-muted-foreground">Kurz:</span> <span className="font-semibold">{courseTitle}</span></p>
            <p><span className="text-muted-foreground">Termín:</span> <span className="font-medium">{safeFormatDate(dateStart, "d. MMMM yyyy")}</span></p>
            {location && <p><span className="text-muted-foreground">Místo:</span> <span className="font-medium">{location}</span></p>}
          </div>
          {fetcher.data?.error && (
            <p className="text-sm text-destructive">{fetcher.data.error}</p>
          )}
          <fetcher.Form method="post">
            <input type="hidden" name="intent" value={isEnrolled ? "cancel" : "enroll"} />
            <input type="hidden" name="courseId" value={courseId} />
            <input type="hidden" name="termIndex" value={termIndex} />
            <Button
              type="submit"
              variant={isEnrolled ? "destructive" : "primary"}
              size="xl"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? (isEnrolled ? "Odhlašuji..." : "Přihlašuji...")
                : (isEnrolled ? "Potvrdit odhlášení" : "Potvrdit přihlášku")}
            </Button>
          </fetcher.Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const sectionLabels: Record<string, { label: string; href: string }> = {
  novacek: { label: "Nováček", href: "/vzdelavani/novacek" },
  rust: { label: "Osobní růst", href: "/vzdelavani/rust" },
  tymy: { label: "Pro týmy", href: "/vzdelavani/tymy" },
  cesty: { label: "Vzdělávací cesty", href: "/vzdelavani/cesty" },
};

function HeroBreadcrumb({ section, title }: { section: { label: string; href: string } | null; title: string }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild className="text-white/60 hover:text-white/90 transition-colors">
            <Link to="/vzdelavani">Vzdělávání</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {section && (
          <>
            <BreadcrumbSeparator className="text-white/40" />
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-white/60 hover:text-white/90 transition-colors">
                <Link to={section.href}>{section.label}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
        <BreadcrumbSeparator className="text-white/50 hidden sm:block" />
        <BreadcrumbItem className="hidden sm:inline-flex">
          <BreadcrumbPage className="text-white/80 font-medium">{title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function LecturersSection({ lecturers, photos }: { lecturers: Course["lecturers"]; photos: (string | null)[] }) {
  if (!lecturers || lecturers.length === 0) return null;
  const multiple = lecturers.length > 1;
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      {lecturers.map((lecturer, idx) => (
        <HighlightBox
          key={lecturer._id}
          className={multiple
            ? "basis-full md:basis-[calc(50%-0.5rem)] flex flex-col gap-3 items-center text-center"
            : "flex-1 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center sm:items-start text-center sm:text-left"
          }
        >
          {photos[idx] ? (
            <img src={photos[idx]!} alt={lecturer.name} className="rounded-full w-16 h-16 object-cover ring-2 ring-brand-light shrink-0" />
          ) : (
            <div className="rounded-full w-16 h-16 bg-brand-light flex items-center justify-center text-brand-primary font-bold text-xl ring-2 ring-brand-light shrink-0">
              {lecturer.name[0]}
            </div>
          )}
          <div>
            <p className="font-[family-name:var(--font-poppins)] font-bold text-foreground">{lecturer.name}</p>
            {lecturer.bio && (
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{lecturer.bio}</p>
            )}
            {lecturer.email && (
              <a href={`mailto:${lecturer.email}`} className="text-brand-primary text-sm mt-2 inline-flex items-center gap-1">
                <Mail size={14} />
                {lecturer.email}
              </a>
            )}
          </div>
        </HighlightBox>
      ))}
    </div>
  );
}

function PriceDisplay({ price }: { price?: number | string }) {
  if (price == null) return null;
  const numericPrice = typeof price === "string" ? NaN : price;
  const isFree = numericPrice === 0 || (typeof price === "string" && price.toLowerCase() === "zdarma");
  return (
    <div className={`font-[family-name:var(--font-poppins)] font-extrabold text-3xl mt-1 mb-4 ${isFree ? "text-brand-primary" : "text-foreground"}`}>
      {isFree ? "Zdarma" : typeof price === "number" ? `${price} Kč` : String(price)}
    </div>
  );
}

export default function KurzDetail() {
  const { course, courseImage, lecturerPhotos, enrolledTerms, enrolledCountByTerm } = useLoaderData<typeof loader>();
  const enrolledSet = new Set(enrolledTerms);
  const section = course.section ? sectionLabels[course.section] : null;

  const heroBreadcrumb = <HeroBreadcrumb section={section} title={course.title} />;

  if (course.is_external) {
    return (
      <>
        <PageHeader
          fullWidth
          title={course.title}
          description={course.highlight}
          imageUrl={courseImage || "/images/hero-classroom.jpg"}
          breadcrumb={heroBreadcrumb}
          badges={["Externí kurz", ...(course.tags || [])]}
          className="-mt-6 mb-0"
        />

        <div className="container mx-auto max-w-7xl py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">

              {course.description && course.description.length > 0 && (
                <div className="text-base leading-7 text-foreground/80 space-y-4">
                  <PortableText value={course.description} />
                </div>
              )}

              {course.target_audience && (
                <div className="mt-6">
                  <h3 className="font-[family-name:var(--font-poppins)] font-bold text-lg mb-2">Pro koho je kurz určen</h3>
                  <p className="text-foreground/80">{course.target_audience}</p>
                </div>
              )}

              <LecturersSection lecturers={course.lecturers} photos={lecturerPhotos} />
            </div>

            <div>
              <Card className="sticky top-24 shadow-lg p-6">
                <PriceDisplay price={course.price} />
                <Separator className="my-4" />
                <Button variant="primary" size="xl" className="w-full" asChild>
                  <a href={course.external_url} target="_blank" rel="noopener noreferrer">
                    Přejít na přihlášení
                    <ExternalLink className="w-5 h-5 ml-2" />
                  </a>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        fullWidth
        title={course.title}
        description={course.highlight}
        imageUrl={courseImage || "/images/hero-classroom.jpg"}
        breadcrumb={heroBreadcrumb}
        badges={["Interní kurz", ...(course.tags || [])]}
        className="-mt-6 mb-0"
      />

      <div className="container mx-auto max-w-7xl py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 pb-0 md:pb-[100px]">

            {course.description && course.description.length > 0 && (
              <div className="text-base leading-7 text-foreground/80 space-y-4">
                <PortableText value={course.description} />
              </div>
            )}

            {course.target_audience && (
              <div className="mt-6">
                <h3 className="font-[family-name:var(--font-poppins)] font-bold text-lg mb-2">Pro koho je kurz určen</h3>
                <p className="text-foreground/80">{course.target_audience}</p>
              </div>
            )}

            {course.benefits && course.benefits.length > 0 && (
              <div className="mt-6">
                <h3 className="font-[family-name:var(--font-poppins)] font-bold text-lg mb-3">Co získáte</h3>
                <ul className="space-y-2 mt-3">
                  {course.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-base text-foreground/80">
                      <CheckCircle2 className="text-brand-primary mt-1 shrink-0" size={16} />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course.materials && course.materials.length > 0 && (
              <div className="mt-6">
                <h3 className="font-[family-name:var(--font-poppins)] font-bold text-lg mb-3">Materiály</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {course.materials.map((material, idx) => (
                    <Button key={idx} variant="outline" size="sm" asChild>
                      <a href={material.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-1" />
                        {material.label}
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <LecturersSection lecturers={course.lecturers} photos={lecturerPhotos} />
          </div>

          {/* Right column — sticky sidebar */}
          <div>
            <Card className="sticky top-24 shadow-lg p-6">
              {course.duration_minutes && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{formatDuration(course.duration_minutes)}</span>
                </div>
              )}

              <PriceDisplay price={course.price} />

              <Separator className="my-4" />

              {course.dates && course.dates.length > 0 && (
                <>
                  <p className="font-[family-name:var(--font-poppins)] font-semibold text-base mb-3">Dostupné termíny</p>
                  {course.dates.map((date, idx) => (
                    <div
                      key={idx}
                      className={`rounded-xl border p-4 mb-3 space-y-2 ${
                        enrolledSet.has(idx)
                          ? "border-brand-primary bg-brand-light/20"
                          : "border-border"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground flex items-center gap-1.5">
                          <Calendar className="text-brand-primary" size={14} />
                          {safeFormatDate(date.date_start, "d. MMMM yyyy")}
                        </span>
                        {enrolledSet.has(idx) && (
                          <Badge variant="brand-accent" size="sm">Přihlášen</Badge>
                        )}
                      </div>
                      {date.location && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <MapPin className="text-brand-muted" size={14} />
                          {date.location}
                        </div>
                      )}
                      {date.capacity != null && (
                        (() => {
                          const enrolled = enrolledCountByTerm[idx] || 0;
                          const remaining = date.capacity - enrolled;
                          return (
                            <div className={`text-sm flex items-center gap-1.5 ${remaining === 0 ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                              <Users className={remaining === 0 ? "text-destructive" : "text-brand-muted"} size={14} />
                              {remaining === 0 ? "Obsazeno" : `${remaining} z ${date.capacity} volných míst`}
                            </div>
                          );
                        })()
                      )}
                      {date.note && (
                        <Badge variant="brand" size="sm">{date.note}</Badge>
                      )}
                      <TermAction
                        courseId={course._id}
                        courseTitle={course.title}
                        termIndex={idx}
                        dateStart={date.date_start}
                        location={date.location}
                        isEnrolled={enrolledSet.has(idx)}
                        isFull={date.capacity != null && (date.capacity - (enrolledCountByTerm[idx] || 0)) <= 0}
                      />
                    </div>
                  ))}
                </>
              )}

              {(course.contact_name || course.contact_email) && (
                <>
                  <Separator className="my-4" />
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Kontakt</p>
                  {course.contact_name && (
                    <p className="font-semibold text-foreground">{course.contact_name}</p>
                  )}
                  {course.contact_email && (
                    <a href={`mailto:${course.contact_email}`} className="text-brand-primary text-sm flex items-center gap-1.5 mt-1">
                      <Mail size={14} />
                      {course.contact_email}
                    </a>
                  )}
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
