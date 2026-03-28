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

### Známé CSS gotchas

**Globální border-color (`*` selektor) — KRITICKÉ:**
V `tailwind.css` je `* { border-color: hsl(var(--border)); }`. Tento selektor přebíjí Tailwind třídy `border-transparent`, `border-brand-*` a arbitrary values `border-[var(--x)]` na komponentách, protože se aplikuje na všechny elementy s `border`.

Postižené případy (ověřeno v praxi):
- `border-transparent` → zobrazí šedý border
- `border-brand-accent` → zobrazí šedý border
- `border-brand-primary` → zobrazí šedý border
- `border-[var(--color-scioedu-accent)]` → zobrazí šedý border
- `border-border/30` (opacity modifier) → nefunguje, zůstane plný border

**Jediné spolehlivé řešení: inline `style={{ borderColor: '...' }}`**

Kde jsme museli použít inline style:
- `Button` outline varianta → `style={{ borderColor: 'var(--color-scioedu-primary)' }}`
- `HighlightBox` → `style={{ borderColor: 'var(--color-scioedu-accent)' }}`
- `Header` aktivní nav link → `style={{ borderBottomColor: 'var(--color-scioedu-accent)' }}`
- `Header` neaktivní nav link → `style={{ borderBottomColor: 'transparent' }}`
- Kalendář buňky → `style={{ borderColor: isSelected ? 'var(--color-scioedu-primary)' : 'rgba(226,232,240,0.6)' }}`

**Pravidlo:** Při přidávání borderu s custom barvou VŽDY použij inline style. Tailwind třídy pro border-color v tomto projektu NEFUNGUJÍ kvůli globálnímu `*` selektoru.

**Brand utility třídy (`@utility`):**
Custom utility třídy (`bg-brand-primary`, `text-brand-primary` atd.) jsou definované v `tailwind.css` pomocí `@utility`. Fungují spolehlivě pro `background-color` a `color`. Pro `border-color` viz výše — NEFUNGUJÍ.

**Opacity modifiers na custom `@utility` třídách:**
`bg-brand-light/40` NEFUNGUJE — `@utility` třídy nepodporují Tailwind opacity modifier `/xx`. Řešení: vytvořit dedikovanou utility (např. `@utility bg-brand-light-hover`) s `color-mix()` v CSS.

## Design systém — brand komponenty

### Button (`app/components/ui/button.tsx`)

Přepsaná shadcn Button s brand variantami. Všechny buttony: `rounded-xl`, Poppins font, `cursor-pointer`.

| Varianta | Použití | Styl |
|---|---|---|
| `primary` | Hlavní CTA (Přihlásit se, Prohlédnout kurzy) | žlutá `bg-brand-accent`, hover `#e8a50f` |
| `default` | Sekundární akce | teal `bg-brand-primary`, hover `#189aa4` |
| `outline` | Terciární (Odhlásit se, Celý kalendář) | teal border + text, hover light fill |
| `destructive` | Destruktivní akce (Potvrdit odhlášení) | červená |
| `ghost` | Ikonová tlačítka, navigace | průhledný, hover light fill |

| Velikost | Rozměry |
|---|---|
| `default` | `h-10 px-4 text-sm` |
| `xl` | `h-12 px-6 text-base` |
| `sm` | `h-8 px-3 text-xs` |
| `icon` | `h-9 w-9` |

**Pozor:** Outline varianta používá inline `style={{ borderColor }}` — viz CSS gotchas výše.
**Pozor:** Hover barvy jsou přesný hex (`#e8a50f`, `#189aa4`), nikdy opacity mix — `hover:bg-brand-accent/80` produkuje olivovou.

### Badge (`app/components/ui/badge.tsx`)

Rozšířená shadcn Badge s brand variantami a velikostmi. Brand varianty NEMAJÍ `border` třídu (kvůli globálnímu `*` selektoru).

| Varianta | Použití | Styl |
|---|---|---|
| `brand` | Informační štítek (poznámka termínu) | `bg-brand-light text-brand-primary` |
| `brand-accent` | Výrazný štítek (hero tagy, Přihlášen) | `bg-brand-accent text-black font-bold` |
| `brand-success` | Úspěšný stav | `bg-brand-light text-brand-primary font-bold` |

| Velikost | Tvar |
|---|---|
| `default` | `px-2.5 py-0.5 rounded-md` |
| `sm` | `px-2 py-0.5 rounded-full` |
| `md` | `px-3 py-1 rounded-full` |

### PageHeader (`app/components/layout/page-header.tsx`)

Full-width hero banner s viewport breakout (`w-screen left-1/2 -translate-x-1/2`).

Props: `title`, `description?`, `imageUrl?`, `fullWidth?`, `breadcrumb?`, `badges?`, `preTitle?`, `actions?`, `className?`

- `fullWidth`: rounded-none, min-h-[380px], gradient overlay (silnější na mobilu)
- `breadcrumb`: React node vykreslený uvnitř hero (bílé barvy)
- `badges`: string[] zobrazené pod description jako žluté pills
- Vnitřní obsah: `container mx-auto max-w-7xl` (zarovnán s layoutem)

Použití na všech stránkách: `className="-mt-6 mb-8"` pro negaci container paddingu.

### HighlightBox (`app/components/highlight-box.tsx`)

Zvýrazněný box se žlutým pruhem vlevo a jemným gradient pozadím. Border-color přes inline style.

Použití: CTA banner (dashboard), lektor karta (kurz detail), info box (koncepce).

### CourseCard (`app/components/course-card.tsx`)

Univerzální overlay karta s fotkou, teal gradientem a textem. Jedna komponenta pro všechny karty.

Props: `title`, `slug?`, `href?`, `highlight?`, `price?`, `icon?`, `imageUrl?`, `height?`

Použití: dashboard quicklinks, vzdělávání kategorie, kurzy na podstránkách (novacek, rust).

### EventList (`app/components/event-list.tsx`)

Seznam událostí s datum chipem (`bg-brand-light-pale`). Sdílená napříč 3 místy.

Props: `events: CalendarEvent[]`, `limit?: number`

Použití: dashboard sidebar (limit=3), kalendář sidebar (limit=8), kalendář selected day (bez limitu).

### Header (`app/components/layout/header.tsx`)

- **Desktop:** sticky nav s Poppins fontem, aktivní link = žlutý `border-bottom` (inline style), dropdown `rounded-2xl shadow-xl`
- **Mobil:** custom full-screen overlay (bez shadcn Sheet), animace zleva, aktivní link = žlutý `border-left` (inline style), profil sticky dole

### Kalendář — mobilní zobrazení

Na mobilu (`md:hidden`) se místo klikatelného gridu zobrazuje `EventList` se všemi událostmi měsíce. Na desktopu (`hidden md:block`) zůstává interaktivní grid.

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
