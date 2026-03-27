# Pre-commit review

Kompletní review před commitem. Spusť manuálně přes `/review`.

## Kroky

### 1. Scope — co se změnilo
- `git diff --stat` a `git diff --cached --stat`
- Identifikuj jaké oblasti kódu jsou dotčeny (routes, components, lib, sanity, supabase)

### 2. ESLint
- Najdi všechny modifikované `.ts/.tsx/.js/.jsx` soubory
- Spusť `npx eslint [soubory] --fix`
- Pokud zůstanou chyby → oprav manuálně

### 3. TypeScript
- Spusť `npm run typecheck`
- Všechny chyby musí být vyřešeny

### 4. Build
- Spusť `npm run build`
- Build musí projít bez chyb

### 5. Kvalita kódu
- Zkontroluj duplicity (je stejná logika na víc místech?)
- Pojmenování — jsou názvy srozumitelné a konzistentní?
- Nepoužívá se `any` v TypeScriptu?
- Barvy přes CSS variables (ne raw hex)?
- Server kód pouze v `.server.ts` souborech?

### 6. Bezpečnost
- Loader ověřuje session před vrácením dat?
- Action validuje input přes Zod?
- Žádné citlivé hodnoty v kódu (tokeny, klíče)?
- `.env` soubory nejsou ve staged změnách?

### 7. Dokumentace
Pokud změna zasahuje do některé z těchto oblastí, ověř že `doc/` odpovídá realitě:
- Nová/změněná route nebo stránka → `doc/project-plan.md` (struktura webu)
- Změna stacku, závislostí, infrastruktury → `doc/architecture.md`
- Nová/změněná UI komponenta, design token, barva → `doc/architecture.md` (design systém)
- Změna konvencí, vzorů, pravidel → `doc/conventions.md`
- Změna build/lint/test pipeline → `doc/testing.md`
- Nová env proměnná, služba, setup krok → `doc/setup.md`

Pokud doc neodpovídá → aktualizuj jako součást tohoto review.

### 8. Report
Výstup ve formátu:

```
## Review výsledek

| Kontrola | Stav |
|----------|------|
| ESLint | ✅ / ❌ |
| TypeScript | ✅ / ❌ |
| Build | ✅ / ❌ |
| Kvalita | ✅ / ⚠️ [poznámky] |
| Bezpečnost | ✅ / ❌ |
| Dokumentace | ✅ / ⚠️ [co aktualizovat] |

### Závěr
[READY TO COMMIT / NEEDS FIXES — seznam co opravit]
```
