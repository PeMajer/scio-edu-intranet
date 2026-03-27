# Ukončení session

Spusť na konci práce přes `/session-end`.

## Kroky

### 1. Stav repozitáře
- `git status` — necommitnuté změny?
- `git diff --stat` — co se změnilo?
- `git log --oneline main..HEAD` — commity na branchi

### 2. Necommitnuté změny
Pokud existují necommitnuté změny, nabídni:
- **Commit** — pokud jsou změny hotové a prošly lint+build
- **Stash** — pokud je práce rozpracovaná
- **Zahodit** — pouze pokud uživatel potvrdí

### 3. Branch — co dál
Nabídni uživateli 3 možnosti:
1. **Push + PR** — `git push -u origin [branch]` + `gh pr create`
2. **Ponechat branch** — práce pokračuje příště
3. **Zahodit branch** — pouze pokud uživatel potvrdí

### 4. Shrnutí
- Co bylo uděláno (stručně)
- Co zbývá (pokud něco)
- Důležité poznatky pro příště

### 5. Memory
Ulož do Claude memory cokoliv důležitého pro příští session:
- Ne kód ani git historii (to je v repu)
- Ano: rozhodnutí, kontext, motivace, blokery
