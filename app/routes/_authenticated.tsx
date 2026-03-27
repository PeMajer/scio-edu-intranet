import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Outlet, useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { Header } from "~/components/layout/header";
import { Footer } from "~/components/layout/footer";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { user, supabase, headers } = await requireAuth(request, context);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return json({ user, profile }, { headers });
}

export default function AuthenticatedLayout() {
  const { user, profile } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} profile={profile} />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
