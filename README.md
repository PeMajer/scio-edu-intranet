# ScioEdu Intranet

Interní vzdělávací portál pro zaměstnance ScioPolis (ScioŠkol). Přihlášení přes Google OAuth (`@scioskola.cz`).

## Stack

- **Framework:** Remix 2.x + TypeScript
- **Runtime:** Cloudflare Workers (Edge)
- **Databáze:** Supabase (PostgreSQL + Auth)
- **CMS:** Sanity.io
- **Styling:** Tailwind CSS v3 + shadcn/ui
- **Kalendář:** Google Calendar API

## Spuštění

```bash
npm install
cp .env.example .env   # vyplň credentials
npm run dev
```

## Příkazy

```bash
npm run dev        # Dev server
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # TypeScript check
npm run deploy     # Deploy na Cloudflare Pages
```

## Dokumentace

Viz [doc/](./doc/README.md) — architektura, konvence, testování, projektový plán, setup.
