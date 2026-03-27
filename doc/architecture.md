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
├── routes/                    # Remix file-based routing
│   ├── _index.tsx             # Login stránka
│   ├── auth.callback.tsx      # OAuth callback
│   ├── portal._index.tsx      # Hlavní rozcestník
│   ├── vzdelavani._index.tsx  # Vzdělávání landing
│   ├── vzdelavani.novacek.tsx # Kurzy pro nováčky
│   ├── vzdelavani.rust.tsx    # Kurzy osobního rozvoje
│   ├── vzdelavani.tymy.tsx    # Týmové kurzy
│   ├── vzdelavani.kurz.$slug.tsx # Detail kurzu + zápis
│   ├── koncepce.tsx           # Koncepce sekce
│   ├── kalendar.tsx           # Google Calendar embed
│   ├── moje-kurzy.tsx         # Moje zápisy
│   └── admin.tsx              # Admin panel
├── components/
│   └── ui/                   # shadcn/ui komponenty
├── lib/
│   ├── supabase.server.ts    # Supabase client + session helpers
│   ├── sanity.server.ts      # Sanity client + GROQ queries
│   ├── types.ts              # TypeScript typy (Course, Enrollment, Profile…)
│   └── cn.ts                 # clsx + tailwind-merge helper
└── tailwind.css              # Globální styly + CSS variables

sanity/
└── schema.ts                 # Schéma: course, lecturer, sectionPage

supabase/
└── migrations/               # SQL migrace
```

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
