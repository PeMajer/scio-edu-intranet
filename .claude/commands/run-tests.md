# Spuštění testů

Spusť relevantní kontroly pro modifikované soubory přes `/run-tests`.

## Kroky

### 1. Detekce změněných souborů
```bash
git diff --name-only HEAD
git diff --name-only --cached
```

### 2. ESLint
Pokud jsou změněné `.ts/.tsx/.js/.jsx` soubory:
```bash
npx eslint [soubory]
```

### 3. TypeScript
Vždy spusť:
```bash
npm run typecheck
```

### 4. Build
Vždy spusť:
```bash
npm run build
```

### 5. Report
```
## Test výsledky

| Kontrola | Stav | Detail |
|----------|------|--------|
| ESLint | ✅ / ❌ | [počet chyb/varování] |
| TypeScript | ✅ / ❌ | [počet chyb] |
| Build | ✅ / ❌ | [výstup] |
```

Pokud něco selhalo, nabídni opravu.
