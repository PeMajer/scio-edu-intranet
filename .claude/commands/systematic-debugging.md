# Systematický debugging

Použij po 3+ neúspěšných pokusech o opravu. Spusť přes `/systematic-debugging`.

## Fáze 1 — Investigace root cause

- Co se změnilo? (`git log --oneline -10`, `git diff`)
- Reprodukuj chybu deterministicky
- Přečti **celou** chybovou hlášku — ne jen první řádek
- Identifikuj vrstvu kde chyba vzniká:
  - Route loader/action?
  - Komponenta?
  - Supabase query/RLS?
  - Sanity GROQ query?
  - Cloudflare Workers runtime limit?

## Fáze 2 — Pattern analysis

- Najdi fungující příklad podobného kódu v projektu
- Porovnej s nefungujícím kódem
- Identifikuj konkrétní rozdíl

## Fáze 3 — Hypotéza a verifikace

- Formuluj: "Problém je v X, protože Y"
- Udělej JEDNU minimální změnu
- Otestuj výsledek (`npm run build`, `npm run typecheck`)

## Fáze 4 — Stop pravidlo

Po dalších 3 neúspěšných pokusech → **ZASTAV SE**

Nekontinuuj v opravách. Místo toho:
1. Zreviduj všechny předpoklady — jsou správné?
2. Je test/kontrola správně nastavená?
3. Přečti relevantní dokumentaci (Remix docs, Supabase docs)
4. Zeptej se uživatele — možná chybí kontext
