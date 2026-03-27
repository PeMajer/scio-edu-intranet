# Architektura — ScioEdu Intranet

## Stack

| Vrstva | Tech | Poznámka |
|---|---|---|
| Framework | Remix 2.x | Cloudflare Pages adapter |
| Runtime | Cloudflare Workers | Edge, bez Node.js |
| Databáze | Supabase (PostgreSQL) | RLS na všech tabulkách |
| CMS | Sanity.io | Kurzy, lektoři, sekce |
| Stylování | Tailwind CSS v4 + shadcn/ui | HSL CSS variables, CSS-first `@theme` v `app/tailwind.css` |
| Auth | Supabase Auth + Google OAuth | Omezeno na `@scioskola.cz` |
| Deploy | Cloudflare Pages | `npm run deploy` |

## Kritická omezení

- **Cloudflare Workers runtime** — žádný Node.js. Žádné `fs`, `path`, native Node moduly.
- **Server utilities musí být `.server.ts`** — Remix tree-shaking; `supabase.server.ts`, `sanity.server.ts` se nesmí importovat v client kódu.
- **Autentizace**: Google OAuth callback → Supabase session → cookie. Doménová restrikce `@scioskola.cz` je vynucena v `auth.callback.tsx`.

## Struktura složek

```
app/
├── routes/                              # Remix file-based routing
│   ├── _index.tsx                       # Login stránka (veřejná)
│   ├── auth.callback.tsx                # OAuth callback
│   ├── auth.logout.tsx                  # Logout action
│   ├── _authenticated.tsx               # Layout route — header, footer, container (pathless)
│   ├── _authenticated.portal._index.tsx # Hlavní rozcestník (dashboard)
│   ├── _authenticated.vzdelavani._index.tsx    # Vzdělávání landing
│   ├── _authenticated.vzdelavani.novacek.tsx   # Kurzy pro nováčky
│   ├── _authenticated.vzdelavani.rust.tsx      # Kurzy osobního rozvoje
│   ├── _authenticated.vzdelavani.tymy.tsx      # Týmové kurzy
│   ├── _authenticated.vzdelavani.kurz.$slug.tsx # Detail kurzu + zápis
│   ├── _authenticated.koncepce.tsx      # Koncepce sekce
│   ├── _authenticated.kalendar.tsx      # Google Calendar
│   ├── _authenticated.moje-kurzy.tsx    # Moje zápisy
│   └── _authenticated.admin.tsx         # Admin panel
├── components/
│   ├── layout/               # Layout komponenty
│   │   ├── header.tsx        # Sticky header s navigací + user dropdown + mobile Sheet
│   │   ├── footer.tsx        # Footer s logem a copyright
│   │   ├── page-header.tsx   # Hlavička stránky (h1 + popis + breadcrumbs + volitelný hero banner)
│   │   └── section-header.tsx # Nadpis sekce s ikonou (sidebar karty)
│   ├── ui/                   # shadcn/ui komponenty (button, card, badge, avatar, dialog, sheet, dropdown-menu, separator, breadcrumb)
│   ├── course-card.tsx       # Karta kurzu s obrázkem
│   └── logo.tsx              # Logo komponenta (PNG s CSS filter variantami)
├── lib/
│   ├── supabase.server.ts    # Supabase client + session helpers
│   ├── sanity.server.ts      # Sanity client + GROQ queries + image URL builder
│   ├── types.ts              # TypeScript typy (Course, Enrollment, Profile…)
│   └── cn.ts                 # clsx + tailwind-merge helper
└── tailwind.css              # Globální styly + CSS variables

public/
└── images/                   # Statické obrázky (logo, hero fotky)

sanity/
└── schemas/                  # Sanity schémata: course, lecturer, sectionPage, blockContent

supabase/
└── migrations/               # SQL migrace
```

### Authenticated layout route

Všechny chráněné stránky jsou children `_authenticated.tsx` (pathless layout route). URL se nemění — prefix `_authenticated.` je jen routing convention. Layout poskytuje:
- `<Header>` se sticky navigací, user dropdown, mobile Sheet menu
- `<main>` s container wrapperem (`container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl`)
- `<Footer>`

Child loadery si ponechávají vlastní `requireAuth` (Remix pouští loadery paralelně).

## Databázové schéma (Supabase)

- `profiles` — uživatelské profily (id, email, role: `user` | `admin`)
- `enrollments` — zápisy na kurzy (user_id, course_id, term, created_at)
- RLS: uživatelé vidí jen vlastní záznamy; admins mají plný přístup

## Sanity schéma

- `course` — kurz s datem, cenou, lektory, slotem pro termíny
- `lecturer` — profil lektora
- `sectionPage` — konfigurace sekce (novacek, rust, tymy, koncepce)

## Design systém — barvy

| Token | Hex | Použití |
|---|---|---|
| primary | `#1DA2AC` | Turquoise — primární akce, headings |
| accent | `#FCB813` | Mustard yellow — CTA, důrazy |
| muted | `#687A7C` | Grey-blue — sekundární text |
| light | `#BADEDF` | Light turquoise — pozadí karet |
| background | `#F5F7F8` | Stránkové pozadí |

Barvy jsou v `app/tailwind.css` v `@theme` bloku jako HSL CSS variables (`hsl(var(--primary))`). Vyžaduje Node.js >= 22 (viz `.nvmrc`).

## Klíčové příkazy

```bash
npm run dev      # Remix dev server + Wrangler Pages
npm run build    # Production build
npm run lint     # ESLint
npm run typecheck # TypeScript kontrola
npm run deploy   # Build + deploy na Cloudflare Pages
```
