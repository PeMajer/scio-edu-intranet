# Hooks

## pre-commit-check.sh

Automatický hook spouštěný před každým `git commit` (konfigurace v `settings.json`).

### Co kontroluje

1. **ESLint** — lint na všech staged `.ts/.tsx/.js/.jsx` souborech
2. **TypeScript** — `tsc --noEmit` kompilační kontrola
3. **Secrets** — blokuje commit `.env` souborů a `wrangler.toml`

### Chování

- Exit `0` = vše OK, commit pokračuje
- Exit `2` = chyba, commit blokován — Claude musí chyby opravit

### Důležité

Output hooku je interní (není automaticky zobrazen uživateli). Claude musí po každém commitu explicitně sdělit výsledek.
