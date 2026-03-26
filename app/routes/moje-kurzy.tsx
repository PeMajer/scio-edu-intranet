import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { BookOpen, Calendar, MapPin } from "lucide-react";
import type { Enrollment } from "~/lib/types";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { user, supabase, headers } = await requireAuth(request, context);

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", user.id)
    .order("enrolled_at", { ascending: false });

  return json({ enrollments: enrollments || [] }, { headers });
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
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Moje kurzy</h1>
        <p className="text-lg text-[#687A7C]">
          Přehled kurzů, do kterých jste přihlášeni
        </p>
      </div>

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-[#687A7C] mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Zatím nemáte žádné kurzy
              </h3>
              <p className="text-[#687A7C] mb-6">
                Přihlaste se do svého prvního kurzu a začněte se vzdělávat
              </p>
              <a
                href="/vzdelavani"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-[#FCB813] text-gray-900 hover:bg-[#FCB813]/90 h-10 px-8"
              >
                Prohlédnout kurzy
              </a>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {enrollments.map((enrollment: Enrollment) => (
            <Card key={enrollment.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2">
                      Kurz ID: {enrollment.course_id}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Přihlášeno: {new Date(enrollment.enrolled_at).toLocaleDateString("cs-CZ")}
                      </span>
                    </CardDescription>
                  </div>
                  <Badge variant={statusColors[enrollment.status]}>
                    {statusLabels[enrollment.status]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-[#687A7C]">
                  <p>Termín #{enrollment.term_index + 1}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
