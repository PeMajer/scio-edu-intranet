# ScioEdu Intranet — Dokumentace

Interní vzdělávací portál pro zaměstnance ScioPolis. Remix + Supabase + Sanity.io + Cloudflare Workers.

---

## Přehled dokumentů

| Dokument | Popis |
|----------|-------|
| [architecture.md](./architecture.md) | Stack, struktura složek, databáze, design systém |
| [conventions.md](./conventions.md) | Konvence kódu — Remix, TypeScript, Tailwind, shadcn/ui |
| [testing.md](./testing.md) | Lint, TypeScript check, build, časté chyby |
| [project-plan.md](./project-plan.md) | Projektový plán v2 — požadavky, struktura webu, schémata |
| [setup.md](./setup.md) | Setup krok za krokem — účty, služby, lokální vývoj |

---

## Quick reference

```bash
npm run dev        # Remix dev server + Wrangler
npm run build      # Production build
npm run lint       # ESLint
npm run typecheck  # TypeScript check
npm run deploy     # Build + deploy na Cloudflare Pages
```

### Služby

| Služba | Účel | Dashboard |
|--------|------|-----------|
| Supabase | Auth + PostgreSQL | supabase.com/dashboard |
| Sanity.io | CMS (kurzy, lektoři, sekce) | sanity.io/manage |
| Cloudflare | Deploy (Workers/Pages) | dash.cloudflare.com |
| Google Calendar | Kalendář událostí | console.cloud.google.com |
