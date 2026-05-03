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
│   │   ├── header.tsx        # Sticky header s navigací + user dropdown + custom mobilní full-screen menu
│   │   ├── footer.tsx        # Footer s logem a copyright
│   │   ├── page-header.tsx   # Full-width hero banner s breadcrumb, badges, preTitle props
│   │   └── section-header.tsx # Nadpis sekce s ikonou (sidebar karty)
│   ├── ui/                   # shadcn/ui komponenty (button, card, badge, avatar, dialog, dropdown-menu, separator, breadcrumb)
│   ├── course-card.tsx       # Univerzální overlay karta (kurzy i kategorie) s icon, href, height props
│   ├── event-list.tsx        # Seznam událostí s datum chipem (dashboard, kalendář sidebar, selected day)
│   ├── highlight-box.tsx     # Zvýrazněný box se žlutým pruhem vlevo (CTA, lektor, info)
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
└── schemas/                  # Sanity schémata: tag, course, lecturer, sectionPage, blockContent

supabase/
└── migrations/               # SQL migrace
```

### Authenticated layout route

Všechny chráněné stránky jsou children `_authenticated.tsx` (pathless layout route). URL se nemění — prefix `_authenticated.` je jen routing convention. Layout poskytuje:
- `<Header>` se sticky navigací, user dropdown, custom full-screen mobilní menu (bez Sheet)
- `<main>` s container wrapperem (`container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl`)
- `<Footer>`

Child loadery si ponechávají vlastní `requireAuth` (Remix pouští loadery paralelně).

## Databázové schéma (Supabase)

- `profiles` — uživatelské profily (id, email, role: `user` | `admin`, `birth_date`, `birth_place`)
  - `birth_date` / `birth_place` — používá se pro tisk certifikátů; uživatel je doplní v dialogu při první přihlášce nebo přes `/profil`
- `enrollments` — zápisy na kurzy (user_id, course_id, term_index, enrolled_at, status: `enrolled` | `completed` | `cancelled`)
- RLS: uživatelé vidí jen vlastní záznamy; admins mají plný přístup (CRUD)

## Sanity schéma

- `tag` — štítek (title + slug) — referencovaný z kurzů
- `course` — kurz s rich-text poli (`highlight: highlightContent`, `description: blockContent`, `target_audience: blockContent`, `how_it_works: blockContent`), `status: 'open' | 'preparing'`, dates s alternativním `date_start_text`
- `lecturer` — profil lektora
- `sectionPage` — konfigurace sekce (novacek, rust, tymy, koncepce)
- `blockContent` — sdílený rich-text typ (bloky, obrázky, odkazy)
- `highlightContent` — restricted rich-text (jen tučné a kurzíva, žádné bloky/obrázky) — používá se pro krátké hero/card popisky
- Studio konfigurace je v `scioedu/` (deploy: `cd scioedu && npx sanity deploy`)

## Design systém — barvy

| Token | Hex | CSS variable | Tailwind utility | Použití |
|---|---|---|---|---|
| primary | `#1DA2AC` | `--color-scioedu-primary` | `bg-brand-primary`, `text-brand-primary` | Teal — navigace, linky, ikony |
| accent | `#FCB813` | `--color-scioedu-accent` | `bg-brand-accent`, `text-brand-accent` | Žlutá — CTA buttony, aktivní nav, hero badges |
| muted | `#687A7C` | `--color-scioedu-muted` | `text-brand-muted` | Grey-blue — sekundární text |
| light | `#BADEDF` | `--color-scioedu-light` | `bg-brand-light` | Light turquoise — badge pozadí, hover stavy |
| light-pale | — | color-mix 30% | `bg-brand-light-pale` | Velmi jemná teal — datum chipy, ikona pozadí |
| light-hover | — | color-mix 40% | `bg-brand-light-hover` | Jemná teal — hover stavy outline buttonů |
| background | `#F5F7F8` | `--color-scioedu-bg` | — | Stránkové pozadí |

HSL varianty (shadcn kompatibilní) jsou v `@theme` bloku. Brand raw hex varianty jsou v `:root` bloku.
Custom `@utility` třídy v `tailwind.css` mapují raw hex na Tailwind classes.

**Důležité:** Brand utility třídy fungují pro `background-color` a `color`, ale NE pro `border-color` — viz `doc/conventions.md` sekce CSS gotchas.

## Klíčové příkazy

```bash
npm run dev      # Remix dev server + Wrangler Pages
npm run build    # Production build
npm run lint     # ESLint
npm run typecheck # TypeScript kontrola
npm run deploy   # Build + deploy na Cloudflare Pages
```
