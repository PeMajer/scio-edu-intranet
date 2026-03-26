import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { requireAuth } from "~/lib/supabase.server";
import { Card, CardContent } from "~/components/ui/card";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { headers } = await requireAuth(request, context);
  return json({}, { headers });
}

export default function Kalendar() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Kalendář</h1>
        <p className="text-lg text-[#687A7C]">
          Nadcházející školení a vzdělávací události
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="aspect-video bg-[#F5F7F8] rounded-lg flex items-center justify-center">
            <div className="text-center">
              <p className="text-[#687A7C] mb-4">
                Google Calendar embed - prosím vložte URL vašeho Google kalendáře
              </p>
              <p className="text-sm text-[#687A7C]">
                Zde se zobrazí veřejný Google kalendář s nadcházejícími událostmi
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
