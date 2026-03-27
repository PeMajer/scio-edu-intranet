import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { PageHeader } from "~/components/layout/page-header";
import { BookOpen, Calendar, GraduationCap } from "lucide-react";
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
      <PageHeader title="Moje kurzy" description="Přehled vašich přihlášených kurzů" imageUrl="/images/hero-discussion.jpg" />

      {enrollments.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border bg-card">
          {/* Empty state with visual */}
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
        <Card>
          <div className="p-5">
            <div className="space-y-0">
              {enrollments.map((enrollment: Enrollment, index: number) => (
                <div key={enrollment.id}>
                  {index > 0 && <Separator className="my-4" />}
                  <div className="flex items-start gap-4">
                    {/* Date pill */}
                    <div className="flex flex-col items-center shrink-0 w-12">
                      <Calendar className="w-4 h-4 text-muted-foreground mb-1" />
                      <span className="text-xs text-muted-foreground">
                        {new Date(enrollment.enrolled_at).toLocaleDateString("cs-CZ", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-foreground">
                            Kurz ID: {enrollment.course_id}
                          </p>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            Termín #{enrollment.term_index + 1}
                          </p>
                        </div>
                        <Badge variant={statusColors[enrollment.status]}>
                          {statusLabels[enrollment.status]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
