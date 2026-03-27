import { json, redirect, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, Form, useNavigation } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { createSanityClient, getImageUrlBuilder } from "~/lib/sanity.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "~/components/ui/dialog";
import { Calendar, MapPin, Users, Clock, ExternalLink, Mail, Tag } from "lucide-react";
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

export default function KurzDetail() {
  const { course, courseImage, lecturerPhoto } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  if (course.is_external) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Badge variant="outline" className="mb-3">Externí kurz</Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                {course.highlight && (
                  <p className="text-lg text-[#687A7C]">{course.highlight}</p>
                )}
                {course.tags && course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {course.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {courseImage && (
              <img src={courseImage} alt={course.title} className="w-full h-64 object-cover rounded-lg" />
            )}

            {course.description && course.description.length > 0 && (
              <div className="prose prose-gray max-w-none">
                <PortableText value={course.description} />
              </div>
            )}

            {course.target_audience && (
              <div>
                <h3 className="font-semibold mb-2">Pro koho je kurz určen</h3>
                <p className="text-[#687A7C]">{course.target_audience}</p>
              </div>
            )}

            {course.lecturer && (
              <div>
                <h3 className="font-semibold mb-3">Lektor</h3>
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16">
                    {lecturerPhoto && <AvatarImage src={lecturerPhoto} />}
                    <AvatarFallback>{course.lecturer.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{course.lecturer.name}</p>
                    {course.lecturer.bio && (
                      <p className="text-sm text-[#687A7C] mt-1">{course.lecturer.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4 border-t">
              <Button variant="accent" size="lg" className="w-full" asChild>
                <a href={course.external_url} target="_blank" rel="noopener noreferrer">
                  Přejít na přihlášení
                  <ExternalLink className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-3">Interní kurz</Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
              {course.highlight && (
                <p className="text-lg text-[#687A7C]">{course.highlight}</p>
              )}
              {course.tags && course.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {course.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {courseImage && (
                <img src={courseImage} alt={course.title} className="w-full h-80 object-cover rounded-lg" />
              )}

              {course.description && course.description.length > 0 && (
                <div className="prose prose-gray max-w-none">
                  <PortableText value={course.description} />
                </div>
              )}

              {course.target_audience && (
                <div>
                  <h3 className="font-semibold mb-2">Pro koho je kurz určen</h3>
                  <p className="text-[#687A7C]">{course.target_audience}</p>
                </div>
              )}

              {course.benefits && course.benefits.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Co získáte</h3>
                  <ul className="list-disc list-inside space-y-1 text-[#687A7C]">
                    {course.benefits.map((benefit, idx) => (
                      <li key={idx}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {course.materials && course.materials.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Materiály</h3>
                  <div className="space-y-2">
                    {course.materials.map((material, idx) => (
                      <a
                        key={idx}
                        href={material.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-[#1DA2AC] hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {material.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {course.lecturer && (
            <Card>
              <CardHeader>
                <CardTitle>Lektor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="w-20 h-20">
                    {lecturerPhoto && <AvatarImage src={lecturerPhoto} />}
                    <AvatarFallback className="text-lg">{course.lecturer.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{course.lecturer.name}</h3>
                    {course.lecturer.bio && (
                      <p className="text-[#687A7C] mt-2">{course.lecturer.bio}</p>
                    )}
                    {course.lecturer.email && (
                      <a href={`mailto:${course.lecturer.email}`} className="flex items-center gap-2 text-[#1DA2AC] mt-3 text-sm">
                        <Mail className="w-4 h-4" />
                        {course.lecturer.email}
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informace o kurzu</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {course.duration_minutes && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-5 h-5 text-[#687A7C]" />
                  <span>{Math.floor(course.duration_minutes / 60)}h {course.duration_minutes % 60}min</span>
                </div>
              )}
              {course.price !== undefined && (
                <div className="text-2xl font-bold text-[#1DA2AC]">
                  {course.price === 0 ? "Zdarma" : `${course.price} Kč`}
                </div>
              )}
            </CardContent>
          </Card>

          {course.dates && course.dates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Dostupné termíny</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {course.dates.map((date, idx) => (
                  <Dialog key={idx}>
                    <DialogTrigger asChild>
                      <button className="w-full text-left p-4 rounded-lg border hover:border-[#1DA2AC] hover:bg-[#BADEDF]/10 transition-all">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-[#687A7C]" />
                            <span>{format(new Date(date.date_start), "d. MMMM yyyy", { locale: cs })}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[#687A7C]">
                            <MapPin className="w-4 h-4" />
                            <span>{date.location}</span>
                          </div>
                          {date.capacity && (
                            <div className="flex items-center gap-2 text-sm text-[#687A7C]">
                              <Users className="w-4 h-4" />
                              <span>Kapacita: {date.capacity}</span>
                            </div>
                          )}
                        </div>
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
                        <div className="p-4 bg-[#F5F7F8] rounded-lg space-y-2">
                          <p className="font-semibold">{course.title}</p>
                          <div className="text-sm text-[#687A7C] space-y-1">
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
              </CardContent>
            </Card>
          )}

          {(course.contact_name || course.contact_email) && (
            <Card>
              <CardHeader>
                <CardTitle>Kontakt</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {course.contact_name && (
                  <p className="font-semibold">{course.contact_name}</p>
                )}
                {course.contact_email && (
                  <a href={`mailto:${course.contact_email}`} className="flex items-center gap-2 text-[#1DA2AC] text-sm">
                    <Mail className="w-4 h-4" />
                    {course.contact_email}
                  </a>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
