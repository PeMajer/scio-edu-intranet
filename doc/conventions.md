# Konvence — ScioEdu Intranet

## Remix — pravidla

### Loader vs Action

- `loader` — čte data (GET). Vždy ověř session přes Supabase před vrácením dat.
- `action` — mutuje data (POST/PUT/DELETE). Vždy validuj input přes Zod.
- Redirect neautentizovaných uživatelů v `loader`: `if (!user) return redirect("/")`

### Server-only kód

```ts
// ✅ Správně — server utility
import { getSupabaseClient } from "~/lib/supabase.server"

// ❌ Špatně — nikdy importovat .server soubory v klientských komponentách
```

Soubory `*.server.ts` se nikdy neimportují v komponentách bez `loader`/`action` kontextu.

## shadcn/ui — pravidla

- Komponenty jsou v `app/components/ui/`
- **Nepřidávat novou shadcn komponentu** pokud lze rozšířit existující volitelným propem
- Instalace nové komponenty: `npx shadcn@latest add [component]` (ne ručně kopírovat)
- Barvy vždy přes CSS variables (`bg-primary`, `text-muted-foreground`) — nikdy raw hex

## TypeScript

- Interface pro každý props objekt, žádné `any`
- Typy kurzů, zápisů, profilů jsou v `app/lib/types.ts` — přidávat tam, ne lokálně
- Server Component není v Remixu pojem — každá route je server+client; `loader` = server, JSX = client

## Tailwind v4

- Projekt používá Tailwind **v4** — CSS-first konfigurace v `app/tailwind.css` (`@theme` blok)
- Žádný `tailwind.config.js` — vše v CSS
- Barvy přes utility třídy: `bg-primary`, `text-foreground`, `border-border` atd.
- Nikdy raw hex v className ani style={{ }} — vždy přes Tailwind třídy nebo CSS variables
- Vyžaduje **Node.js >= 22** (viz `.nvmrc`)

## Autentizace

- Session ověření v každém loaderu co vrací citlivá data
- Doménová restrikce `@scioskola.cz` je pouze v `auth.callback.tsx` — nespoléhej na ni v dalších loaderech
- Role check pro admin routes: ověř `profile.role === "admin"` v loaderu

## Formuláře

- Formuláře přes `react-hook-form` + `@hookform/resolvers` + Zod schéma
- Validace na klientu i serveru (Zod na obou stranách)
- Chybové stavy zobrazovat přes `useActionData()`

## Zápisy na kurzy (enrollments)

- Logika zápisů je v `vzdelavani.kurz.$slug.tsx` — action handler
- Kapacita termínů je v Sanity (pole `terms[].capacity`)
- Aktuální počet zápisů per termín dotazuj ze Supabase

## Sanity queries

- GROQ queries patří do `app/lib/sanity.server.ts` — ne inline v route
- Vždy use typed výsledky (typy z `app/lib/types.ts`)

## Komentáře v kódu

- UI texty v **češtině** (jsou viditelné pro uživatele)
- Code comments v **angličtině**
- Commit messages v **angličtině**
