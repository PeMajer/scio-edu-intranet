import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { requireAdmin } from "~/lib/supabase.server";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { PageHeader } from "~/components/layout/page-header";
import type { EnrollmentWithProfile } from "~/lib/types";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { supabase, headers } = await requireAdmin(request, context);

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      *,
      profile:profiles(*)
    `)
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

export default function Admin() {
  const { enrollments } = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeader
        title="Administrace"
        description={`Přehled všech přihlášek (${enrollments.length})`}
      />

      <Card>
        <CardHeader>
          <CardTitle>Všechny přihlášky</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Uživatel</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Email</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Kurz ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Termín</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Datum přihlášení</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((enrollment: any) => (
                  <tr key={enrollment.id} className="border-b last:border-0 hover:bg-muted">
                    <td className="py-3 px-4 text-sm">{enrollment.profile?.full_name || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{enrollment.profile?.id || 'N/A'}</td>
                    <td className="py-3 px-4 text-sm font-mono text-xs">{enrollment.course_id}</td>
                    <td className="py-3 px-4 text-sm">#{enrollment.term_index + 1}</td>
                    <td className="py-3 px-4 text-sm">{new Date(enrollment.enrolled_at).toLocaleDateString("cs-CZ")}</td>
                    <td className="py-3 px-4 text-sm">
                      <Badge variant={statusColors[enrollment.status as keyof typeof statusColors]}>
                        {statusLabels[enrollment.status as keyof typeof statusLabels]}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {enrollments.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      Zatím nejsou žádné přihlášky
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
