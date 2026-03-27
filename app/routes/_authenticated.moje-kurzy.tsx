import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { PageHeader } from "~/components/layout/page-header";
import { BookOpen, Calendar } from "lucide-react";
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
    <>
      <PageHeader title="Moje kurzy" description="Přehled vašich přihlášených kurzů" />

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Zatím nemáte žádné kurzy
              </h3>
              <p className="text-muted-foreground mb-6">
                Přihlaste se do svého prvního kurzu a začněte se vzdělávat
              </p>
              <Link
                to="/vzdelavani"
                className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-secondary text-foreground hover:bg-secondary/90 h-10 px-8"
              >
                Prohlédnout kurzy
              </Link>
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
                <div className="text-sm text-muted-foreground">
                  <p>Termín #{enrollment.term_index + 1}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
