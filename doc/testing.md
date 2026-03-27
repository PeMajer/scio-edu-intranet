# Testování — ScioEdu Intranet

## Lint

```bash
npm run lint          # ESLint — všechny soubory
npx eslint [soubor]   # ESLint — konkrétní soubor
```

## TypeScript

```bash
npm run typecheck     # tsc --noEmit
```

## Build

```bash
npm run build         # Production build (Remix + Cloudflare)
```

Build ověřuje:
- Kompilaci TypeScriptu
- Remix route validaci
- Cloudflare Workers kompatibilitu (žádné Node.js moduly)

## Před commitem

Vždy spusť obě kontroly:
```bash
npm run lint && npm run typecheck
```

Alternativně použij `/review` pro kompletní pre-commit review.

## Časté chyby

### "Module not found" v buildu
- Zkontroluj jestli neimportuješ `.server.ts` soubor v klientské komponentě
- Cloudflare Workers nemají přístup k Node.js modulům (`fs`, `path`, `crypto` atd.)

### TypeScript "any" chyby
- Projekt zakazuje `any` — použij správný typ z `app/lib/types.ts`
- Pro neznámé typy z externích API použij `unknown` + type guard

### Supabase typy
- Po změně DB schématu regeneruj typy dle Supabase dokumentace
