# ScioEdu — Plán krok za krokem (Ty vs. Agent)

> **Legenda:**
> - 🟢 **TY** — musíš udělat sám (přístupy k účtům, klikání v dashboardech)
> - 🔵 **AGENT** — udělá za tebe (veškerý kód)

---

## Fáze 0 — Příprava účtů a služeb

> ⏱️ Celá Fáze 0 zabere cca 45–60 minut. Potřebuješ: prohlížeč, přístup k e-mailu `@scioskola.cz` a heslo manager (ideálně 1Password, Bitwarden nebo alespoň bezpečný poznámkový blok).

### 🟢 Krok 1 — Vytvoř GitHub repozitář

1. Jdi na **github.com/new** (musíš být přihlášený)

2. Vyplň formulář:
   - **Repository name:** `scio-edu-intranet`
   - **Description:** `Interní vzdělávací portál pro zaměstnance ScioPolis. Remix + Supabase + Sanity.io + Cloudflare Workers.`
   - **Visibility:** Private (firemní projekt, nechceš veřejný kód)
   - **Initialize this repository with:** zaškrtni „Add a README file"
   - **Add .gitignore:** vyber šablonu `Node`
   - **Choose a license:** vyber `MIT License`
     > 💡 MIT je nejběžnější licence pro interní projekty — jednoduché, žádná omezení. Pokud firma vyžaduje jinou (např. proprietary), změň později. Pro interní intranet na licenci nezáleží tolik, ale je best practice ji mít.

3. Klikni **Create repository**

4. Nastav branch protection na `main`:
   - Jdi do repozitáře → **Settings** (horní menu) → **Branches** (levý panel)
   - Klikni **Add branch protection rule**
   - Branch name pattern: `main`
   - Zaškrtni:
     - ✅ Require a pull request before merging
     - ✅ Require approvals → nastav na **1**
   - Klikni **Create**
   - > 💡 Tohle znamená, že nikdo (ani ty) nepushne přímo na main — vždy přes pull request. CI/CD pak deployuje automaticky po merge. Pokud jsi na projektu sám a chceš to jednodušší, tento krok můžeš přeskočit a pushovat přímo.

5. **Zapiš si** (budeš potřebovat v kroku 6 a 9):
   - URL repozitáře: `https://github.com/[tvuj-username]/scio-edu-intranet`

---

### 🟢 Krok 2 — Založ Supabase projekt

1. Jdi na **supabase.com** → klikni **Start your project** (nebo **Dashboard** pokud už máš účet)
   - Přihlas se přes GitHub (nejrychlejší — rovnou se propojí)

2. Klikni **New project** a vyplň:
   - **Organization:** vyber existující nebo vytvoř novou (např. „ScioPolis")
   - **Name:** `scio-edu`
   - **Database Password:** klikni na **Generate a password** a **okamžitě ho ulož** do heslo manageru. Toto heslo už nikde znovu neuvidíš, a budeš ho potřebovat, pokud se budeš připojovat k databázi přímo (např. přes pgAdmin nebo Supabase CLI).
   - **Region:** `Central EU (Frankfurt)` — nejbližší k ČR, nejnižší latence
   - **Pricing Plan:** Free (pro začátek stačí — 50 000 MAU, 500 MB databáze)

3. Klikni **Create new project** a počkej 1–2 minuty než se projekt vytvoří.

4. Zkopíruj credentials — jdi do **Settings** (ozubené kolečko vlevo dole):

   **Project URL:**
   - Klikni na **General** (pod CONFIGURATION v levém menu)
   - Najdi **Project URL** — vypadá jako `https://abcdefghij.supabase.co` — zapiš si ho → to je tvůj `SUPABASE_URL`

   **API klíče:**
   - Klikni na **API Keys** (v levém menu pod CONFIGURATION)
   - Uvidíš záložku **Publishable and secret API keys** — to je ta správná
   - Použij klíče z hlavní záložky:

   | Na stránce | Začíná na | Kam uložit | Popis |
   |---|---|---|---|
   | **Publishable key** | `sb_publishable_...` | `SUPABASE_ANON_KEY` | Veřejný klíč — bezpečný pro frontend (pokud máš RLS) |
   | **Secret key** | `sb_secret_...` | `SUPABASE_SERVICE_ROLE_KEY` | Tajný klíč — klikni na ikonu 👁️ pro zobrazení, pak na 📋 pro kopírování |

   > ⚠️ **Secret key je tajný!** Má plný přístup k databázi, obchází RLS. Nikdy ho nedávej do frontendu, do gitu, ani do `.env` souboru který commitneš. Pouze do serverových proměnných (Cloudflare Workers secrets, GitHub secrets).

5. Povol Google OAuth provider:
   - V levém menu klikni na **Authentication** → záložka **Providers**
   - Najdi **Google** a klikni na něj
   - Přepni na **Enabled**
   - Políčka Client ID a Client Secret zatím nech prázdná — vyplníš v kroku 3
   - Klikni **Save**

6. Nastav redirect URLs:
   - Authentication → **URL Configuration**
   - Do **Redirect URLs** přidej tyto dvě adresy (klikni **Add URL** pro každou):
     ```
     http://localhost:3000/auth/callback
     ```
     ```
     https://intranet.scioedu.cz/auth/callback
     ```
   - První je pro lokální vývoj, druhá pro produkci
   > 💡 Omezení na doménu `@scioskola.cz` se řeší v kódu (Remix loader), ne v Supabase. Supabase povolí přihlášení přes jakýkoli Google účet — kód pak ověří doménu a nepovoleného uživatele odhlásí.

---

### 🟢 Krok 3 — Nastav Google OAuth v Google Cloud Console

> ⚠️ **Předpoklad:** Musíš být přihlášen Google účtem, který je správcem Google Workspace organizace `@scioskola.cz` (nebo mít oprávnění vytvářet projekty v Google Cloud Console pro tuto organizaci).

1. Otevři **console.cloud.google.com**

2. Vytvoř nový projekt:
   - Klikni na rozbalovací menu projektů (vlevo nahoře, vedle „Google Cloud")
   - Klikni **New Project**
   - **Project name:** `ScioEdu Intranet`
   - **Organization:** vyber `scioskola.cz` (pokud je k dispozici)
   - **Location:** vyber organizaci `scioskola.cz`
   - Klikni **Create** a počkej pár sekund
   - Přepni se do nového projektu (notifikace nahoře nebo dropdown)

3. Nastav OAuth consent screen:
   - Levé menu → **APIs & Services** → **OAuth consent screen**
   - User Type: vyber **Internal**
     > 💡 „Internal" znamená, že se budou moct přihlásit pouze uživatelé z organizace `@scioskola.cz`. To je přesně co chceme. Pokud tuto možnost nevidíš, tvůj účet nemá Google Workspace — budeš muset zvolit „External" a doménu omezit v kódu.
   - Klikni **Create**
   - Vyplň formulář:
     - **App name:** `ScioEdu`
     - **User support email:** tvůj e-mail (např. `admin@scioskola.cz`)
     - **App logo:** (volitelné) — nahraj ScioEdu logo (tyrkysová varianta, PNG)
     - **App domain** — Homepage: `https://intranet.scioedu.cz`
     - **Authorized domains:** přidej `scioskola.cz` a `supabase.co`
     - **Developer contact email:** tvůj e-mail
   - Klikni **Save and Continue**
   - Na stránce **Scopes** klikni **Add or remove scopes** a zaškrtni:
     - `openid`
     - `email`
     - `profile`
   - Klikni **Update** → **Save and Continue** → **Back to Dashboard**

4. Vytvoř OAuth credentials:
   - Levé menu → **APIs & Services** → **Credentials**
   - Klikni **+ Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - **Name:** `ScioEdu Intranet`
   - **Authorized JavaScript origins:** (zatím nech prázdné)
   - **Authorized redirect URIs** — klikni **Add URI** a přidej:
     ```
     https://[tvuj-supabase-id].supabase.co/auth/v1/callback
     ```
     > ⚠️ Nahraď `[tvuj-supabase-id]` skutečným ID z kroku 2 (to z Project URL). Např. pokud tvůj Supabase URL je `https://abcdefghij.supabase.co`, pak redirect URI je `https://abcdefghij.supabase.co/auth/v1/callback`.
   - Klikni **Create**

5. Zkopíruj Client ID a Client Secret:
   - V dialogu po vytvoření se zobrazí oba — **zkopíruj oba do heslo manageru**
   - Client ID vypadá jako: `123456789-abc.apps.googleusercontent.com`
   - Client Secret vypadá jako: `GOCSPX-xxxxxxxxxxxx`

6. Vlož do Supabase:
   - Zpátky na **supabase.com** → tvůj projekt → **Authentication** → **Providers** → **Google**
   - Vlož **Client ID** a **Client Secret**
   - Klikni **Save**

7. **Kontrola:** Teď máš propojené: Google Cloud Console ↔ Supabase. Přihlášení přes Google bude fungovat.

---

### 🟢 Krok 4 — Založ Sanity projekt

1. Jdi na **sanity.io/get-started** (nebo **sanity.io** → Sign up / Log in)
   - Přihlas se přes **Google** (nejrychlejší) nebo GitHub

2. Vytvoř nový projekt:
   - Klikni **Create new project**
   - **Project name:** `ScioEdu`
   - **Dataset:** ponech výchozí `production`
   - **Plan:** Free (Community) — 3 uživatelé, 500k API requestů/měsíc
   - Vyber **Start with an empty project** (schémata dodá agent)
   - Klikni **Create**

3. Zapiš si Project ID:
   - Na stránce projektu v **sanity.io/manage** najdeš **Project ID** — krátký kód jako `abc123xy`
   - Zapiš ho — budeš potřebovat v env proměnných

4. Vygeneruj API token:
   - V sanity.io/manage → tvůj projekt → záložka **API** → sekce **Tokens**
   - Klikni **Add API token**
   - **Token name:** `Frontend read`
   - **Permissions:** vyber **Viewer** (read-only — frontend nepotřebuje zapisovat)
   - Klikni **Save**
   - **Token se zobrazí jen jednou** — okamžitě ho zkopíruj a ulož do heslo manageru
   > 💡 Pokud token ztratíš, nevadí — smaž ho a vygeneruj nový. Jen budeš muset aktualizovat env proměnné.

5. Nastav CORS origins (povolení pro frontend):
   - V sanity.io/manage → tvůj projekt → záložka **API** → sekce **CORS Origins**
   - Klikni **Add CORS origin** a přidej:
     - `http://localhost:3000` (pro lokální vývoj) — zaškrtni **Allow credentials**
     - `https://intranet.scioedu.cz` (produkce) — zaškrtni **Allow credentials**
   > Bez tohoto kroku Sanity API bude blokovat requesty z tvého webu (CORS error v konzoli prohlížeče).

6. (Volitelné) Přidej další uživatele Sanity Studia:
   - V sanity.io/manage → tvůj projekt → záložka **Members**
   - Klikni **Invite member** a zadej e-mail osoby, která bude spravovat obsah kurzů
   - Free tier: max 3 uživatelé. Pokud potřebuješ víc, viz poznámka o cenách v projektovém plánu.

---

### 🟢 Krok 5 — Nastav Cloudflare Workers

1. Založ účet na **cloudflare.com** (pokud ještě nemáš):
   - Klikni **Sign Up** → vyplň e-mail a heslo
   - Potvrď e-mail
   - Na stránce „Add your website" klikni **Skip** (nepotřebuješ přidávat doménu teď — Workers fungují i bez ní)
   - Free plan stačí

2. Zapiš si Account ID:
   - Po přihlášení klikni na **Workers & Pages** v levém menu
   - V pravém panelu najdeš **Account ID** — vypadá jako `abc123def456...` (32 znaků)
   - Zapiš ho

3. Vygeneruj API token pro CI/CD:
   - Klikni na profilovou ikonku vpravo nahoře → **My Profile**
   - V levém menu klikni na **API Tokens**
   - Klikni **Create Token**
   - Najdi šablonu **Edit Cloudflare Workers** a klikni **Use template**
   - Account Resources: vyber **Include** → tvůj účet
   - Zone Resources: **Include** → **All zones** (nebo pokud máš vlastní doménu, vyber jen tu)
   - Klikni **Continue to summary** → **Create Token**
   - **Token se zobrazí jen jednou** — okamžitě zkopíruj a ulož
   > ⚠️ Pokud token ztratíš, musíš ho smazat a vytvořit nový. Doporučuji ho rovnou přidat jako GitHub secret (krok 6).

4. (Volitelné) Vlastní doména:
   - Doména bude `intranet.scioedu.cz` — DNS záznam se nastaví po prvním úspěšném deploy (krok 16b). Teď to přeskoč.

---

### 🟢 Krok 6 — Přidej secrets do GitHub repozitáře

Teď máš všechny hodnoty z kroků 2–5. Přidáš je jako encrypted secrets v GitHub — CI/CD workflow je bude používat pro deploy, a ty je nikdy nedáš do kódu.

1. Jdi do tvého repozitáře na GitHub → **Settings** → levý panel **Secrets and variables** → **Actions**

2. Klikni **New repository secret** a přidej postupně tyto:

| Name | Odkud vzít hodnotu | Příklad |
|---|---|---|
| `SUPABASE_URL` | Krok 2, Settings → General → Project URL | `https://abcdefghij.supabase.co` |
| `SUPABASE_ANON_KEY` | Krok 2, Settings → API Keys → Publishable key (`sb_publishable_...`) | `sb_publishable_7UZm...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Krok 2, Settings → API Keys → Secret key (`sb_secret_...`) | `sb_secret_XxyDf...` |
| `SANITY_PROJECT_ID` | Krok 4, sanity.io/manage → Project ID | `abc123xy` |
| `SANITY_DATASET` | Vždy stejné | `production` |
| `SANITY_API_TOKEN` | Krok 4, vygenerovaný Viewer token | `sk...` |
| `CLOUDFLARE_API_TOKEN` | Krok 5, vygenerovaný token | `abc123...` |
| `CLOUDFLARE_ACCOUNT_ID` | Krok 5, Workers dashboard | `abc123def456...` |
| `PUBLIC_SITE_URL` | Produkční URL intranetu | `https://intranet.scioedu.cz` |

> 💡 `PUBLIC_SITE_URL` nastav rovnou na finální doménu `https://intranet.scioedu.cz`. Lokálně se použije `http://localhost:3000` z `.env` souboru.

3. **Ověření:** Na stránce Secrets bys měl vidět 9 položek. Hodnoty nejdou zpětně zobrazit — pouze přepsat (Update).

> 💡 Agent vygeneruje i `.env.example` soubor (bez skutečných hodnot) — ten commitneš do gitu jako šablonu. Skutečný `.env` soubor pro lokální vývoj si vytvoříš v kroku 9 a **nikdy ho necommitneš** (bude v `.gitignore`).

---

## Fáze 1 — Generování projektu (agent)

### 🔵 Krok 7 — Vygeneruj celý projekt přes Bolt.new

Použij prompt z části **17** tvého dokumentu (`SCIO_EDU_PLAN_v2.md`).

**Postup:**
1. Otevři **bolt.new**
2. Vlož celý prompt
3. Bolt vygeneruje projekt — nech ho doběhnout
4. Zkontroluj, že výstup obsahuje správnou strukturu složek (viz sekce 9 projektového plánu)
5. Exportuj projekt do GitHub repozitáře z kroku 1

### 🔵 Krok 8 — Co agent vygeneruje

- Remix app (routing, loadery, actions)
- Všechny stránky a komponenty
- Tailwind v4 design tokeny dle brand manuálu (`globals.css`)
- Sanity schémata (`course.ts`, `lecturer.ts`, `sectionPage.ts`, `blockContent.ts`)
- Sanity Studio konfigurace (`sanity.config.ts`)
- Supabase migrace (`supabase/migrations/001_init.sql`)
- CI/CD GitHub Actions workflow (`.github/workflows/deploy.yml`)
- Šablona env souboru (`.env.example`)
- Seed data — 8–10 ukázkových kurzů v češtině

---

## Fáze 2 — Lokální spuštění a napojení

### 🟢 Krok 9 — Stáhni kód a nainstaluj dependencies

**Předpoklady — ověř, že máš nainstalované:**

```bash
node -v    # Potřebuješ Node.js 18 nebo novější (zobrazí např. v18.17.0)
npm -v     # npm se instaluje s Node.js (zobrazí např. 9.6.7)
git -v     # Potřebuješ Git (zobrazí např. git version 2.39.0)
```

Pokud něco chybí:
- **Node.js:** stáhni z **nodejs.org** → LTS verze (zelené tlačítko)
- **Git:** stáhni z **git-scm.com** (Windows) nebo `brew install git` (Mac)

**Stáhni kód:**

```bash
# Nahraď [tvuj-username] svým GitHub uživatelským jménem nebo organizací
git clone https://github.com/[tvuj-username]/scio-edu-intranet.git
cd scio-edu-intranet
npm install
```

> ⏱️ `npm install` může trvat 1–3 minuty — stahuje všechny knihovny.

**Vytvoř `.env` soubor:**

```bash
cp .env.example .env
```

Otevři `.env` v libovolném textovém editoru (VS Code, Notepad++, nano...) a vyplň skutečné hodnoty — stejné jako v GitHub Secrets z kroku 6:

```env
SUPABASE_URL=https://abcdefghij.supabase.co
SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
SANITY_PROJECT_ID=abc123xy
SANITY_DATASET=production
SANITY_API_TOKEN=sk...
GOOGLE_CALENDAR_EMBED_URL=             # Vyplníš v kroku 12
PUBLIC_SITE_URL=http://localhost:3000   # Pro lokální vývoj
```

> ⚠️ **Soubor `.env` nikdy necommituj do gitu!** Agent ho přidá do `.gitignore` automaticky. Pro jistotu ověř: `cat .gitignore | grep .env` by měl vrátit `.env`.

---

### 🟢 Krok 10 — Spusť Supabase migrace (databázové tabulky)

1. Otevři **supabase.com** → tvůj projekt `scio-edu` → klikni na **SQL Editor** v levém menu

2. V projektu najdi soubor `supabase/migrations/001_init.sql` — otevři ho v textovém editoru, **zkopíruj celý obsah**

3. V SQL Editoru vlož zkopírovaný SQL a klikni **Run** (zelené tlačítko nebo Ctrl+Enter)

4. Co migrace vytvoří:
   - Tabulka **`profiles`** — jméno, oddělení, škola, role (employee/admin)
   - Tabulka **`enrollments`** — přihlášky na kurzy s termínem
   - **RLS policies** — uživatel vidí jen svá data, admin vidí vše
   - **Trigger `on_auth_user_created`** — automaticky vytvoří profil, když se nový uživatel přihlásí

5. Ověření — v levém menu klikni na **Table Editor** a měl bys vidět:
   - Tabulku `profiles` (zatím prázdná — naplní se po prvním přihlášení)
   - Tabulku `enrollments` (prázdná)
   - Pokud tabulky nevidíš, migrace selhala — zkontroluj chybovou hlášku v SQL Editoru

6. **Nastav sebe jako admina** — vrať se do SQL Editoru a spusť:
   ```sql
   -- ⚠️ Tohle spusť AŽ PO svém prvním přihlášení na webu (krok 11).
   -- Před přihlášením tabulka profiles bude prázdná a příkaz nic neudělá.
   UPDATE profiles SET role = 'admin'
   WHERE id = (
     SELECT id FROM auth.users
     WHERE email = 'tvuj.email@scioskola.cz'
   );
   ```
   > Nahraď `tvuj.email@scioskola.cz` svým skutečným e-mailem. Tento krok spusť až po kroku 11, kdy se poprvé přihlásíš.

---

### 🟢 Krok 11 — Spusť lokální dev server a otestuj přihlášení

```bash
npm run dev
```

Otevři prohlížeč na **http://localhost:3000** — měla by se zobrazit přihlašovací stránka ScioEdu s logem a tlačítkem „Přihlásit se přes Google".

**Test přihlášení:**
1. Klikni na „Přihlásit se přes Google"
2. Vyber svůj `@scioskola.cz` účet
3. Google tě přesměruje zpátky → měl bys vidět `/portal` (hlavní rozcestí)
4. V pravém horním rohu by měl být tvůj avatar a jméno

**Pokud přihlášení nefunguje — checklist problémů:**

| Příznak | Příčina | Řešení |
|---|---|---|
| „Error 400: redirect_uri_mismatch" | Redirect URI v Google Console neodpovídá | Ověř, že v Google Cloud Console máš `https://[supabase-id].supabase.co/auth/v1/callback` |
| Přihlášení se zacyklí (login → Google → login) | Špatný Supabase URL/klíč v `.env` | Zkontroluj `SUPABASE_URL` a `SUPABASE_ANON_KEY` (nově začíná `sb_publishable_...`) |
| „Přístup povolen pouze zaměstnancům ScioPolis" | Přihlásil ses účtem s jinou doménou | Použij `@scioskola.cz` účet |
| Bílá stránka / 500 error | Chyba v kódu | Podívej se do terminálu kde běží `npm run dev` na error hlášku |
| „Invalid API key" v konzoli | Špatný Sanity token | Ověř `SANITY_PROJECT_ID` a `SANITY_API_TOKEN` v `.env` |

**Po úspěšném přihlášení** se vrať ke kroku 10, bod 6 a nastav se jako admin.

---

## Fáze 3 — Obsah a Sanity Studio

### 🟢 Krok 12 — Získej Google Calendar embed URL

> 💡 Pokud zadavatel **už má** sdílený kalendář ScioEdu akcí, přeskoč bod 1 a rovnou zjisti embed URL (bod 3).

1. **Vytvoř nový sdílený kalendář** (pokud ještě neexistuje):
   - Otevři **calendar.google.com** (přihlášený jako `@scioskola.cz`)
   - V levém panelu klikni na **+** vedle „Další kalendáře" → **Vytvořit nový kalendář**
   - **Název:** `ScioEdu — vzdělávací akce`
   - **Popis:** `Kalendář školení a kurzů organizovaných ScioEdu`
   - **Časové pásmo:** `(GMT+01:00) Středoevropský čas — Praha`
   - Klikni **Vytvořit kalendář**

2. **Nastav sdílení** (aby embed fungoval):
   - V levém panelu najdi nový kalendář → klikni na tři tečky **⋮** → **Nastavení a sdílení**
   - Sekce **Oprávnění přístupu k akcím**:
     - Zaškrtni **Zpřístupnit veřejnosti**
     - Oprávnění: **Zobrazit všechny podrobnosti o události**
   > ⚠️ Bez veřejného sdílení embed iframe nebude fungovat (zobrazí prázdný kalendář). V kalendáři budou jen názvy a časy kurzů, žádné citlivé údaje.

3. **Zkopíruj embed URL:**
   - Na stejné stránce nastavení scrollni dolů k sekci **Integrovat kalendář**
   - Najdi **Vložit kód** — bude tam iframe HTML. Z něj potřebuješ jen URL z atributu `src`:
     ```
     https://calendar.google.com/calendar/embed?src=abc123%40group.calendar.google.com&ctz=Europe%2FPrague
     ```
   - Zkopíruj tuto URL

4. **Vlož do `.env`:**
   ```
   GOOGLE_CALENDAR_EMBED_URL=https://calendar.google.com/calendar/embed?src=abc123%40group.calendar.google.com&ctz=Europe%2FPrague
   ```

5. **Přidej testovací událost:**
   - V Google Calendar klikni na datum → vytvoř událost v kalendáři „ScioEdu — vzdělávací akce"
   - Název: `Testovací kurz — Akademie pro nováčky`
   - Datum: jakýkoli budoucí
   - Ověř, že se zobrazuje na stránce `/kalendar` v intranetu (po restartu dev serveru)

---

### 🟢 Krok 13 — Vlož první obsah do Sanity Studia

**Spusť Sanity Studio lokálně:**

```bash
# V kořenovém adresáři projektu (nebo v podadresáři sanity/, záleží na struktuře od agenta)
npx sanity dev
```

Otevře se na **http://localhost:3333**. Přihlas se svým Sanity účtem (stejný, s kterým jsi založil projekt v kroku 4).

> ⏱️ Prvních 5–10 minut věnuj orientaci v rozhraní. Vlevo uvidíš typy dokumentů: Kurz, Lektor, Stránka sekce.

**A) Přidej lektory (začni odtud — kurzy na ně budou odkazovat):**

Klikni na **Lektor** → **Create new** a vyplň pro každého lektora:

| Pole | Co vyplnit | Příklad |
|---|---|---|
| Jméno a příjmení | Celé jméno | `Jana Nováková` |
| Slug | Klikni **Generate** (vytvoří se automaticky z jména) | `jana-novakova` |
| Foto | Nahraj portrétní fotku (ideálně 400×400 px, JPG) | — |
| Krátký medailonek | 2–3 věty o lektorovi | `Lektorka s 10letou praxí v oblasti...` |
| E-mail | Kontaktní e-mail | `jana.novakova@scioskola.cz` |

> Přidej aspoň 2–3 lektory, aby bylo na koho odkazovat z kurzů.

**B) Uprav vzorové kurzy (agent vygeneruje 8–10 ukázkových):**

Klikni na **Kurz** — uvidíš předvyplněné ukázkové kurzy. Projdi je a uprav:

| Pole | Co zkontrolovat / vyplnit |
|---|---|
| Název kurzu | Skutečný název (např. „Celoroční vzdělávání pro nové průvodce") |
| Slug | Klikni **Generate** pokud je prázdný |
| Krátký highlight | 1–2 věty: o čem kurz je. Zobrazuje se na kartě kurzu. |
| Podrobný popis | Delší text — co se bude probírat, jak kurz probíhá |
| Pro koho je určen | Např. „Pro nové průvodce v prvním roce na ScioŠkole" |
| Co účastník získá | Klikni **Add item** a přidej 3–5 bodů (každý jako samostatný řetězec) |
| Sekce | Vyber z rozbalovačky: `novacek` / `rust` / `tymy` |
| Podsekce | Vyber odpovídající: `kurzy-novacek` / `sciocile` / `remeslo` / atd. |
| Termíny | Klikni **Add item** → vyplň datum začátku, konce, místo, kapacitu |
| Délka (minuty) | Např. `90` nebo `480` (celodenní) |
| Cena | Např. `zdarma` nebo `hradí zaměstnavatel` |
| Lektor | Klikni a vyber lektora z kroku A |
| Kontaktní osoba | Jméno organizátora |
| Kontaktní e-mail | E-mail organizátora |
| Obrázek kurzu | Nahraj obrázek (ideálně 16:9, min. 800×450 px) |
| Materiály | (volitelné) Přidej odkazy na Google Drive soubory |
| Externí odkaz | Vyplň jen u externích kurzů (Pedagogické maximum apod.) |
| Publikováno | ✅ Zaškrtni (jinak se kurz nezobrazí) |
| Externí kurz | Zaškrtni jen u kurzů, které vedou na jiný web (scioedu.cz) |

> 💡 **Minimální požadavky:** Pro funkční zobrazení potřebuje každý kurz: název, slug, highlight, alespoň jednu sekci, alespoň jeden termín, a `is_published = true`.

**C) Vytvoř stránky sekcí (`sectionPage`):**

Klikni na **Stránka sekce** → **Create new** a vytvoř 4 záznamy:

| section_key | Název sekce | Úvodní text (příklad) | Viditelná |
|---|---|---|---|
| `novacek` | Jsem ve ScioPolis nováček | „Vítej v ScioPolis! Tady najdeš vše, co potřebuješ na začátku své cesty..." | ✅ Ano |
| `rust` | Vzdělávání a růst pro každého | „Nabídka kurzů a rozvojových programů pro všechny pracovníky ScioPolis..." | ✅ Ano |
| `tymy` | Rozvoj pro týmy a kvadriády | „Vzdělávací programy určené pro celé týmy a průvodcovny..." | ✅ Ano |
| `koncepce` | Koncepce ScioŠkol | „Sekce se připravuje — ale už teď tu najdete materiály ke koncepci ScioŠkol..." | ✅ Ano |

**Pro sekci Koncepce navíc** vyplň pole **Materiály a odkazy** (`resources[]`):
- Klikni **Add item** pro každý existující materiál, např.:
  - Label: `Koncepční dokument ScioPolis 2024`, URL: `https://drive.google.com/...`, Typ: `google-drive`
  - Label: `Podcast ScioEdu`, URL: `https://...`, Typ: `podcast`

> 💡 Sekci `cesty` (Vzdělávací cesty) **nemusíš vytvářet** — je skrytá v navigaci a bude se budovat později.

---

## Fáze 4 — Deploy na produkci

### 🟢 Krok 14 — Nastav env proměnné v Cloudflare

1. Jdi na **dash.cloudflare.com** → **Workers & Pages** v levém menu

2. Pokud ještě nemáš worker:
   - CI/CD z kroku 16 ho vytvoří automaticky při prvním deploy
   - **Alternativa:** Můžeš ho vytvořit ručně: klikni **Create** → **Create Worker** → pojmenuj ho `scio-edu-intranet` → **Deploy** (vytvoří prázdný worker, CI/CD ho pak přepíše)

3. Klikni na worker `scio-edu-intranet` → záložka **Settings** → **Variables and Secrets**

4. Klikni **Add** a přidej proměnné. Pro každou vyber správný typ:

| Name | Type | Hodnota |
|---|---|---|
| `SUPABASE_URL` | **Text** | `https://abcdefghij.supabase.co` |
| `SUPABASE_ANON_KEY` | **Secret** | tvůj Publishable key (`sb_publishable_...`) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | tvůj Secret key (`sb_secret_...`) |
| `SANITY_PROJECT_ID` | **Text** | `abc123xy` |
| `SANITY_DATASET` | **Text** | `production` |
| `SANITY_API_TOKEN` | **Secret** | tvůj Sanity token |
| `PUBLIC_SITE_URL` | **Text** | `https://intranet.scioedu.cz` |
| `GOOGLE_CALENDAR_EMBED_URL` | **Text** | embed URL z kroku 12 |

> 💡 Proměnné označené jako **Secret** jsou zašifrované a nejdou zpětně zobrazit. **Text** proměnné jsou viditelné — pro non-sensitive hodnoty je to OK.

5. Klikni **Save and deploy**

---

### 🔵 Krok 15 — CI/CD workflow (GitHub Actions)

Agent vygeneruje `.github/workflows/deploy.yml` — automatický deploy při push na `main`. Nemusíš nic dělat.

**Jak workflow funguje:**
1. Při každém push/merge na `main` se spustí GitHub Action
2. Nainstaluje dependencies (`npm ci`)
3. Buildne Remix app (`npm run build`)
4. Deployne na Cloudflare Workers pomocí `wrangler`
5. Použije secrets z kroku 6 pro autentizaci

---

### 🟢 Krok 16 — Pushni kód na GitHub a ověř deploy

**Pokud máš branch protection (krok 1, bod 4):**

```bash
git checkout -b initial-setup
git add .
git commit -m "feat: initial ScioEdu intranet setup"
git push origin initial-setup
```

Pak na GitHub vytvoř **Pull Request**: `initial-setup` → `main`, zkontroluj, a klikni **Merge**.

**Pokud NEMÁŠ branch protection (jednodušší varianta):**

```bash
git add .
git commit -m "feat: initial ScioEdu intranet setup"
git push origin main
```

**Sleduj deploy:**
1. Na GitHub klikni na záložku **Actions**
2. Uvidíš běžící workflow „Deploy to Cloudflare Workers"
3. Klikni na něj → sleduj logy
4. ✅ Zelená fajfka = deploy úspěšný
5. ❌ Červený křížek = něco selhalo — klikni pro detail chyby

**Ověř produkci:**
1. Otevři **https://intranet.scioedu.cz** (nebo dočasnou Workers URL pokud doména ještě nesměruje — viz krok 16b)
2. Měla by se zobrazit přihlašovací stránka ScioEdu
3. Přihlas se a ověř:
   - ✅ Přihlášení funguje
   - ✅ Portal s rozcestím se zobrazuje
   - ✅ Kurzy ze Sanity se načítají
   - ✅ Kalendář embed se zobrazuje
   - ✅ Přihlášení na kurz funguje (zkus se přihlásit na testovací kurz)

**Pokud něco nefunguje na produkci ale lokálně ano:**
- Zkontroluj env proměnné v Cloudflare (krok 14) — nejčastější příčina
- Ověř, že Redirect URI v Google Cloud Console obsahuje i produkční URL (krok 3, bod 4)
- Ověř, že Sanity CORS origins obsahuje produkční URL (krok 4, bod 5)
- Zkontroluj logy: Cloudflare Dashboard → Workers → tvůj worker → **Logs** → **Begin log stream**

---

### 🟢 Krok 16b — Nastav vlastní doménu `intranet.scioedu.cz`

1. V Cloudflare Workers → tvůj worker → **Settings** → **Domains & Routes** → **Add** → **Custom domain**
2. Zadej: `intranet.scioedu.cz`
3. Cloudflare ti řekne, jaký DNS záznam přidat (typicky **CNAME** směřující na `scio-edu-intranet.[tvujname].workers.dev`)
4. V DNS správě domény `scioedu.cz` přidej požadovaný záznam:
   ```
   Typ:    CNAME
   Název:  intranet
   Cíl:    scio-edu-intranet.[tvujname].workers.dev
   TTL:    Auto
   ```
   > Kde přesně DNS záznam přidáš záleží na tom, kde je doména `scioedu.cz` spravovaná (Cloudflare, Wedos, Active24, Google Domains...). Pokud nevíš, zeptej se správce domény.
5. Počkej na propagaci (5 min až 24 hodin, obvykle do 30 minut)
6. Ověř: otevři `https://intranet.scioedu.cz` — měla by se zobrazit přihlašovací stránka

> 💡 Pokud jsi v předchozích krocích všude nastavil `intranet.scioedu.cz` (Supabase redirect URL, Sanity CORS, Google Cloud Console), vše by mělo rovnou fungovat. Pokud ne, zkontroluj body níže.

**Checklist — kde všude musí být `intranet.scioedu.cz`:**
- ✅ Supabase → Authentication → URL Configuration → Redirect URLs (krok 2, bod 6)
- ✅ Google Cloud Console → Credentials → Authorized redirect URIs: `https://intranet.scioedu.cz/auth/callback` (viz krok 3)
- ✅ Sanity → CORS Origins (krok 4, bod 5)
- ✅ Cloudflare Workers → env `PUBLIC_SITE_URL` (krok 14)
- ✅ GitHub Secrets → `PUBLIC_SITE_URL` (krok 6)

---

## Fáze 5 — Otevřené otázky pro zadavatele

### 🟢 Krok 17 — Zodpovědět otevřené otázky (ze sekce 16 projektového plánu)

Toto musíš zjistit od zadavatele **ideálně před Fází 1** (generování). Některé odpovědi ovlivní kód — pokud je nemáš předem, agent umí kód upravit i zpětně, ale je to víc práce.

| Otázka | Proč je důležitá | Výchozí předpoklad (pokud neodpovíš) |
|---|---|---|
| ~~**Vlastní doména**~~ | ~~Ovlivní DNS, SSL, redirect URI~~ | ✅ Rozhodnuto: `intranet.scioedu.cz` |
| **Google Calendar** — existuje sdílený firemní kalendář? | Jestli tvořit nový nebo napojit existující | Vytvoří se nový v kroku 12 |
| **Přihlašování na kurzy** — čistě přes intranet nebo i externě? | Ovlivní logiku enrollments a detail kurzu | Interní + externí (dle `is_external` flagu) |
| **Jsou kurzy zdarma nebo placené?** | Ovlivní zobrazení ceny a případně platební bránu | Zdarma / hradí zaměstnavatel (bez platební brány) |
| **Koncepce — kdy bude obsah?** | Jestli dělat plný obsah nebo jen placeholder | Aktivní placeholder s Google Drive odkazy |
| **Vzdělávací cesty — existuje seznam ScioCílů?** | Pro přípravu struktury skryté sekce | Sekce skrytá, bez obsahu |
| **Oprávnění** — vidí všichni vše? | Jestli implementovat role-based access pro sekce | Všichni zaměstnanci vidí vše, admin navíc přehled přihlášek |
| **Materiály z Google Drive** — pro všechny nebo jen přihlášené? | Ovlivní logiku zobrazování materiálů | Materiály vidí všichni přihlášení zaměstnanci |
| **Analytika** — chcete sledovat návštěvnost a oblíbenost? | Jestli integrovat analytics | Ne v MVP, případně ve Fázi 3 |

> 💡 Pokud zadavatel neodpoví, jdi s výchozími předpoklady — všechny se dají změnit později.

---

## Přehled — Co dělám já vs. agent

| Krok | Kdo | Popis | ⏱️ Odhad času |
|------|-----|-------|---------------|
| 1 | 🟢 Ty | GitHub repozitář (založení, branch protection) | 5 min |
| 2 | 🟢 Ty | Supabase projekt + Google OAuth provider | 10 min |
| 3 | 🟢 Ty | Google Cloud Console — OAuth credentials | 15 min |
| 4 | 🟢 Ty | Sanity projekt + API token + CORS | 10 min |
| 5 | 🟢 Ty | Cloudflare Workers účet + API token | 10 min |
| 6 | 🟢 Ty | GitHub Secrets (env proměnné) | 5 min |
| 7–8 | 🔵 Agent | Bolt.new — generování celého projektu | 15–30 min |
| 9 | 🟢 Ty | Klonování repo, npm install, .env soubor | 10 min |
| 10 | 🟢 Ty | Supabase SQL migrace + nastavení admina | 5 min |
| 11 | 🟢 Ty | Lokální test přihlášení | 10 min |
| 12 | 🟢 Ty | Google Calendar — vytvoření/nastavení, embed URL | 10 min |
| 13 | 🟢 Ty | Plnění Sanity Studia obsahem (lektoři, kurzy, sekce) | 60–120 min |
| 14 | 🟢 Ty | Cloudflare env proměnné | 5 min |
| 15 | 🔵 Agent | CI/CD workflow (automaticky) | 0 min |
| 16 | 🟢 Ty | Push na GitHub + ověření deploy | 10 min |
| 16b | 🟢 Ty | (Volitelné) Vlastní doména | 15 min |
| 17 | 🟢 Ty | Otevřené otázky pro zadavatele | záleží na zadavateli |
| | | **Celkem (bez obsahu a otázek)** | **~2.5–3.5 hodiny** |
