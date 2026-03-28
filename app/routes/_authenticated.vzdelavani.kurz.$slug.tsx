import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Form, useNavigation, Link } from "@remix-run/react";
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
  const { user, headers } = await requireAuth(request, context);

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

  return json({ course, courseImage, lecturerPhoto, userId: user.id }, { headers });
}

export async function action({ request, params, context }: ActionFunctionArgs) {
  const { user, supabase, headers } = await requireAuth(request, context);

  const formData = await request.formData();
  const termIndex = parseInt(formData.get("termIndex") as string);
  const courseId = formData.get("courseId") as string;

  try {
    await supabase.from("enrollments").insert({
      user_id: user.id,
      course_id: courseId,
      term_index: termIndex,
      status: "enrolled",
    });

    return redirect("/moje-kurzy", { headers });
  } catch (error: any) {
    return json({ error: error.message }, { status: 400, headers });
  }
}

const sectionLabels: Record<string, { label: string; href: string }> = {
  novacek: { label: "Nováček", href: "/vzdelavani/novacek" },
  rust: { label: "Osobní růst", href: "/vzdelavani/rust" },
  tymy: { label: "Pro týmy", href: "/vzdelavani/tymy" },
  cesty: { label: "Vzdělávací cesty", href: "/vzdelavani/cesty" },
};

export default function KurzDetail() {
  const { course, courseImage, lecturerPhoto } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
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
                {course.price === 0 ? "Zdarma" : `${course.price} Kč`}
              </div>
            )}

            <Separator className="my-4" />

            {course.dates && course.dates.length > 0 && (
              <div className="bg-brand-light-pale rounded-xl p-4 space-y-3">
                <p className="font-[family-name:var(--font-poppins)] font-bold text-sm mb-2">Dostupné termíny</p>
                {course.dates.map((date, idx) => (
                  <Dialog key={idx}>
                    <DialogTrigger asChild>
                      <button className="w-full text-left space-y-1.5 hover:opacity-80 transition-opacity">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="text-brand-primary shrink-0" size={14} />
                          <span>{format(new Date(date.date_start), "d. MMMM yyyy", { locale: cs })}</span>
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
                        {idx < course.dates!.length - 1 && <Separator className="mt-3" />}
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Přihlásit se na kurz</DialogTitle>
                        <DialogDescription>
                          Potvrzením se přihlásíte na vybraný termín kurzu
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="p-4 bg-muted rounded-lg space-y-2">
                          <p className="font-semibold">{course.title}</p>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <p>Termín: {format(new Date(date.date_start), "d. MMMM yyyy", { locale: cs })}</p>
                            <p>Místo: {date.location}</p>
                            {date.note && <p className="italic">{date.note}</p>}
                          </div>
                        </div>
                        <Form method="post">
                          <input type="hidden" name="courseId" value={course._id} />
                          <input type="hidden" name="termIndex" value={idx} />
                          <Button
                            type="submit"
                            variant="accent"
                            size="lg"
                            className="w-full"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Přihlašuji..." : "Potvrdit přihlášku"}
                          </Button>
                        </Form>
                      </div>
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            )}

            <Button className="w-full mt-5 bg-brand-accent hover:opacity-90 text-black font-bold rounded-xl py-3 text-base font-[family-name:var(--font-poppins)]">
              Přihlásit se
            </Button>

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
