import { useState, useEffect } from "react";
import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useFetcher, Link } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { createSanityClient, getImageUrlBuilder } from "~/lib/sanity.server";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
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

export async function loader({ request, params, context }: LoaderFunctionArgs) {
  const { user, supabase, headers } = await requireAuth(request, context);

  const sanity = createSanityClient(context);
  const course = await sanity.fetch<Course>(
    `*[_type == "course" && slug.current == $slug][0]{
      ...,
      lecturer->
    }`,
    { slug: params.slug }
  );

  if (!course) {
    throw new Response("Kurz nenalezen", { status: 404 });
  }

  const imageBuilder = getImageUrlBuilder(context);
  const courseImage = course.image ? imageBuilder.image(course.image).width(800).url() : null;
  const lecturerPhoto = course.lecturer?.photo ? imageBuilder.image(course.lecturer.photo).width(200).url() : null;

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", user.id)
    .eq("course_id", course._id)
    .eq("status", "enrolled");

  const enrolledTerms = new Set((enrollments || []).map((e: { term_index: number }) => e.term_index));

  return json({ course, courseImage, lecturerPhoto, userId: user.id, enrolledTerms: [...enrolledTerms] }, { headers });
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const { user, supabase, headers } = await requireAuth(request, context);

  const formData = await request.formData();
  const intent = formData.get("intent") as string;
  const termIndex = parseInt(formData.get("termIndex") as string);
  const courseId = formData.get("courseId") as string;

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

function TermAction({ courseId, courseTitle, termIndex, dateStart, location, isEnrolled }: {
  courseId: string;
  courseTitle: string;
  termIndex: number;
  dateStart: string;
  location: string;
  isEnrolled: boolean;
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
          <Button variant="outline" size="sm" className="w-full">
            Odhlásit se
          </Button>
        ) : (
          <Button className="w-full bg-brand-accent hover:opacity-90 text-black font-semibold rounded-lg text-sm" size="sm">
            Přihlásit se
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
            <p><span className="text-muted-foreground">Termín:</span> <span className="font-medium">{format(new Date(dateStart), "d. MMMM yyyy", { locale: cs })}</span></p>
            <p><span className="text-muted-foreground">Místo:</span> <span className="font-medium">{location}</span></p>
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
              variant={isEnrolled ? "destructive" : "accent"}
              size="lg"
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

export default function KurzDetail() {
  const { course, courseImage, lecturerPhoto, enrolledTerms } = useLoaderData<typeof loader>();
  const enrolledSet = new Set(enrolledTerms);
  const section = course.section ? sectionLabels[course.section] : null;

  if (course.is_external) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-8">
        <Breadcrumb className="text-sm mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/vzdelavani">Vzdělávání</Link></BreadcrumbLink>
            </BreadcrumbItem>
            {section && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink asChild><Link to={section.href}>{section.label}</Link></BreadcrumbLink>
                </BreadcrumbItem>
              </>
            )}
            <BreadcrumbSeparator className="hidden sm:block" />
            <BreadcrumbItem className="hidden sm:inline-flex"><BreadcrumbPage>{course.title}</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <h1 className="font-[family-name:var(--font-poppins)] font-extrabold text-3xl text-foreground tracking-tight mb-4">
              {course.title}
            </h1>

            <div className="flex flex-wrap gap-2">
              <Badge className="bg-brand-light text-brand-primary border-0 font-semibold">Externí kurz</Badge>
              {course.tags?.map((tag) => (
                <Badge key={tag} className="bg-brand-light text-brand-primary border-0 font-semibold">{tag}</Badge>
              ))}
            </div>

            {courseImage && (
              <img src={courseImage} alt={course.title} className="rounded-2xl overflow-hidden aspect-video object-cover w-full shadow-md my-6" />
            )}

            {course.highlight && (
              <p className="text-lg text-muted-foreground">{course.highlight}</p>
            )}

            {course.description && course.description.length > 0 && (
              <div className="text-base leading-7 space-y-4 text-foreground/80">
                <PortableText value={course.description} />
              </div>
            )}

            {course.target_audience && (
              <div>
                <h3 className="font-[family-name:var(--font-poppins)] font-bold mb-2">Pro koho je kurz určen</h3>
                <p className="text-foreground/80">{course.target_audience}</p>
              </div>
            )}

            {course.lecturer && (
              <div className="mt-8 bg-muted/40 rounded-2xl p-6 flex gap-4">
                {lecturerPhoto ? (
                  <img src={lecturerPhoto} alt={course.lecturer.name} className="rounded-full w-16 h-16 object-cover ring-2 ring-brand-light" />
                ) : (
                  <div className="rounded-full w-16 h-16 bg-brand-light flex items-center justify-center text-brand-primary font-bold text-xl ring-2 ring-brand-light">
                    {course.lecturer.name[0]}
                  </div>
                )}
                <div>
                  <p className="font-[family-name:var(--font-poppins)] font-bold">{course.lecturer.name}</p>
                  {course.lecturer.bio && (
                    <p className="text-sm text-muted-foreground mt-1">{course.lecturer.bio}</p>
                  )}
                  {course.lecturer.email && (
                    <a href={`mailto:${course.lecturer.email}`} className="text-brand-primary text-sm mt-2 inline-block">
                      {course.lecturer.email}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="sticky top-24 bg-card rounded-2xl border border-border shadow-lg p-6">
              <div className="font-[family-name:var(--font-poppins)] text-3xl font-extrabold text-brand-primary my-3">
                {course.price === 0 ? "Zdarma" : course.price ? `${course.price} Kč` : null}
              </div>
              <Separator className="my-4" />
              <Button className="w-full mt-5 bg-brand-accent hover:opacity-90 text-black font-bold rounded-xl py-3 text-base font-[family-name:var(--font-poppins)]" asChild>
                <a href={course.external_url} target="_blank" rel="noopener noreferrer">
                  Přejít na přihlášení
                  <ExternalLink className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <Breadcrumb className="text-sm mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild><Link to="/vzdelavani">Vzdělávání</Link></BreadcrumbLink>
          </BreadcrumbItem>
          {section && (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild><Link to={section.href}>{section.label}</Link></BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          <BreadcrumbSeparator className="hidden sm:block" />
          <BreadcrumbItem className="hidden sm:inline-flex"><BreadcrumbPage>{course.title}</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column */}
        <div className="lg:col-span-2">
          <h1 className="font-[family-name:var(--font-poppins)] font-extrabold text-3xl text-foreground tracking-tight mb-4">
            {course.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-brand-light text-brand-primary border-0 font-semibold">Interní kurz</Badge>
            {course.tags?.map((tag) => (
              <Badge key={tag} className="bg-brand-light text-brand-primary border-0 font-semibold">{tag}</Badge>
            ))}
          </div>

          {courseImage && (
            <img src={courseImage} alt={course.title} className="rounded-2xl overflow-hidden aspect-video object-cover w-full shadow-md my-6" />
          )}

          {course.highlight && (
            <p className="text-lg text-muted-foreground mb-4">{course.highlight}</p>
          )}

          {course.description && course.description.length > 0 && (
            <div className="text-base leading-7 space-y-4 text-foreground/80">
              <PortableText value={course.description} />
            </div>
          )}

          {course.target_audience && (
            <div className="mt-6">
              <h3 className="font-[family-name:var(--font-poppins)] font-bold mb-2">Pro koho je kurz určen</h3>
              <p className="text-foreground/80">{course.target_audience}</p>
            </div>
          )}

          {course.benefits && course.benefits.length > 0 && (
            <div className="mt-6">
              <h3 className="font-[family-name:var(--font-poppins)] font-bold mb-3">Co získáte</h3>
              <ul className="space-y-2">
                {course.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-foreground/80">
                    <CheckCircle2 className="text-brand-primary mt-0.5 shrink-0" size={18} />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {course.materials && course.materials.length > 0 && (
            <div className="mt-6">
              <h3 className="font-[family-name:var(--font-poppins)] font-bold mb-3">Materiály</h3>
              <div className="flex flex-wrap gap-2">
                {course.materials.map((material, idx) => (
                  <a
                    key={idx}
                    href={material.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-brand-light-pale border border-brand-light text-brand-primary px-3 py-2 rounded-lg text-sm hover:bg-brand-light transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {material.label}
                  </a>
                ))}
              </div>
            </div>
          )}

          {course.lecturer && (
            <div className="mt-8 bg-muted/40 rounded-2xl p-6 flex gap-4">
              {lecturerPhoto ? (
                <img src={lecturerPhoto} alt={course.lecturer.name} className="rounded-full w-16 h-16 object-cover ring-2 ring-brand-light" />
              ) : (
                <div className="rounded-full w-16 h-16 bg-brand-light flex items-center justify-center text-brand-primary font-bold text-xl ring-2 ring-brand-light">
                  {course.lecturer.name[0]}
                </div>
              )}
              <div>
                <p className="font-[family-name:var(--font-poppins)] font-bold">{course.lecturer.name}</p>
                {course.lecturer.bio && (
                  <p className="text-sm text-muted-foreground mt-1">{course.lecturer.bio}</p>
                )}
                {course.lecturer.email && (
                  <a href={`mailto:${course.lecturer.email}`} className="text-brand-primary text-sm mt-2 inline-block">
                    {course.lecturer.email}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right column — sticky sidebar */}
        <div>
          <div className="sticky top-24 bg-card rounded-2xl border border-border shadow-lg p-6">
            {course.duration_minutes && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Clock className="w-4 h-4" />
                <span>{Math.floor(course.duration_minutes / 60)}h {course.duration_minutes % 60}min</span>
              </div>
            )}

            {course.price !== undefined && (
              <div className="font-[family-name:var(--font-poppins)] text-3xl font-extrabold text-brand-primary my-3">
                {Number(course.price) === 0 || String(course.price).toLowerCase() === "zdarma"
                  ? "Zdarma"
                  : `${course.price} Kč`}
              </div>
            )}

            <Separator className="my-4" />

            {course.dates && course.dates.length > 0 && (
              <div className="bg-brand-light-pale rounded-xl p-4 space-y-3">
                <p className="font-[family-name:var(--font-poppins)] font-bold text-sm mb-2">Dostupné termíny</p>
                {course.dates.map((date, idx) => (
                  <div key={idx} className={`p-3 rounded-lg space-y-3 ${enrolledSet.has(idx) ? "bg-brand-light/30 ring-1 ring-brand-primary/20" : ""}`}>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="text-brand-primary shrink-0" size={14} />
                          <span>{format(new Date(date.date_start), "d. MMMM yyyy", { locale: cs })}</span>
                        </div>
                        {enrolledSet.has(idx) && (
                          <Badge className="bg-brand-light text-brand-primary border-0 font-semibold text-xs">Přihlášen</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="text-brand-primary shrink-0" size={14} />
                        <span>{date.location}</span>
                      </div>
                      {date.capacity && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Users className="text-brand-primary shrink-0" size={14} />
                          <span>Kapacita: {date.capacity}</span>
                        </div>
                      )}
                      {date.note && (
                        <p className="text-sm text-muted-foreground italic">{date.note}</p>
                      )}
                    </div>
                    <TermAction
                      courseId={course._id}
                      courseTitle={course.title}
                      termIndex={idx}
                      dateStart={date.date_start}
                      location={date.location}
                      isEnrolled={enrolledSet.has(idx)}
                    />
                  </div>
                ))}
              </div>
            )}

            {(course.contact_name || course.contact_email) && (
              <div className="border-t border-border mt-5 pt-5">
                {course.contact_name && (
                  <p className="font-semibold">{course.contact_name}</p>
                )}
                {course.contact_email && (
                  <a href={`mailto:${course.contact_email}`} className="text-brand-primary text-sm">
                    {course.contact_email}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
