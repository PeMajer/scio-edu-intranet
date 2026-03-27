# ScioEdu Intranet

Interní vzdělávací portál pro zaměstnance ScioPolis (ScioŠkol). Dva hlavní pilíře:

1. **Vzdělávání** — katalog interních kurzů (pro nováčky, osobní rozvoj, týmy), zápis, detail kurzu s lektorem
2. **Koncepce** — podcasty, metodické balíčky, koncepční dokumenty (ve výstavbě)

Přihlášení přes Google OAuth, omezeno na doménu `@scioskola.cz`.

## Stack

| Vrstva | Technologie |
|--------|------------|
| Framework | Remix 2.x + TypeScript |
| Runtime | Cloudflare Workers (Edge) |
| Databáze | Supabase (PostgreSQL + Auth) |
| CMS | Sanity.io |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Kalendář | Google Calendar API |

## Rychlý start

```bash
npm install
cp .env.example .env   # vyplň credentials (viz doc/setup.md)
npm run dev
```

## Příkazy

```bash
npm run dev        # Remix dev server + Wrangler
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # TypeScript check
npm run deploy     # Build + deploy na Cloudflare Pages
```

## Externí služby

| Služba | Účel |
|--------|------|
| [Supabase](https://supabase.com/dashboard) | Auth + PostgreSQL |
| [Sanity.io](https://sanity.io/manage) | CMS (kurzy, lektoři, sekce) |
| [Cloudflare](https://dash.cloudflare.com) | Deploy (Workers/Pages) |
| [Google Calendar](https://console.cloud.google.com) | Kalendář událostí |

## Dokumentace

| Dokument | Popis |
|----------|-------|
| [Setup](./doc/setup.md) | Založení účtů, env variables, lokální vývoj |
| [Architektura](./doc/architecture.md) | Stack, struktura složek, databáze, design systém |
| [Konvence](./doc/conventions.md) | Kódové konvence — Remix, TypeScript, Tailwind, shadcn/ui |
| [Projektový plán](./doc/project-plan.md) | Požadavky, struktura webu, content model |
| [Testování](./doc/testing.md) | Lint, TypeScript check, build, časté chyby |
