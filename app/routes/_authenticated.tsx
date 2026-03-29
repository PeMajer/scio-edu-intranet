import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Outlet, useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { createSanityClient } from "~/lib/sanity.server";
import { Header } from "~/components/layout/header";
import { Footer } from "~/components/layout/footer";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { user, supabase, headers } = await requireAuth(request, context);

  const sanity = createSanityClient(context);

  const [{ data: profile }, sections] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    sanity.fetch<string[]>(
      `array::unique(*[_type == "course" && is_published == true].section)`
    ),
  ]);

  return json({ user, profile, sections }, { headers });
}

export default function AuthenticatedLayout() {
  const { user, profile, sections } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header user={user} profile={profile} educationSections={sections} />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
