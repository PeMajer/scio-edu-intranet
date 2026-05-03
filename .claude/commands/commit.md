# Commit

Proveď pre-commit kontroly a commitni všechny změny. Argument: volitelná commit message.

## Postup

### 1. Zjisti rozsah změn

```bash
git status
git diff --stat HEAD
```

Pokud nejsou žádné změny, vypiš to a skonči.

### 2. Spusť /review

Proveď kompletní review podle `.claude/commands/review.md` (kroky 2–7: ESLint, TypeScript, build, kvalita kódu, bezpečnost, dokumentace).

Pokud **cokoliv selhalo** → STOP, nespouštěj commit, vypiš co je špatně.

### 3. Commit

Pokud všechny kontroly prošly:

1. Zjisti poslední commity pro styl commit messages: `git log --oneline -5`
2. Stagni všechny změněné soubory: `git add <soubory>` (ne `git add -A`, vypisuj konkrétní soubory). **Nikdy nestaguj** `.env`, `.env.*`, žádné tokeny ani `sanity-backup-*.tar.gz`.
3. Zpracuj `$ARGUMENTS`:
   - Pokud obsahuje `--skip-ci` nebo `--no-ci` → přidej `[ci skip]` na konec commit message (před Co-Authored-By). Odstraň flag z textu argumentu.
   - **Bez tohoto flagu NIKDY nepřidávej `[ci skip]`** — ani když ho mají předchozí commity v historii.
   - Zbytek argumentu (pokud existuje) použij jako commit message.
   - Pokud není žádná message → vygeneruj ji z diffu — anglicky, stručně, ve stylu předchozích commitů (ale bez `[ci skip]`). Preferuj prefix typu `feat:`, `fix:`, `chore:`, `docs:`, `refactor:` podle povahy změny.
4. Commitni — **`git add` a `git commit` vždy jako dvě oddělená Bash volání** (nikdy je nespojuj `&&`):

```bash
git add <soubory>
```

```bash
git commit -m "$(cat <<'EOF'
<message>

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

— nebo, pokud `--skip-ci` / `--no-ci`:

```bash
git commit -m "$(cat <<'EOF'
<message> [ci skip]

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

5. Po commitu **vždy zobraz výstup** uživateli — `git status` a `git log -1 --stat`, ať vidí co se stalo.

## Bezpečnostní pravidla

- **Nikdy `--no-verify`** — pokud pre-commit hook selže, oprav příčinu, nepřeskakuj kontrolu.
- **Nikdy nepřepisuj cizí commity** — pokud je `git commit` neúspěšný kvůli hooku, vytvoř NOVÝ commit po opravě (ne `--amend`, ten by změnil předchozí commit někoho jiného).
- **Nikdy nepushuj automaticky** — `git push` provede uživatel sám, nebo přes PR workflow.
- Nikdy necommituj na `main` — ověř `git branch --show-current`, pokud je `main`, vypiš to a požádej o vytvoření feature branche.
