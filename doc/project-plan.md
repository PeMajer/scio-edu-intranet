# SCIO EDU — Aktualizovaný projektový plán (v2)

---

## 1. Souhrn změn oproti původnímu plánu

Původní dokument popisoval jednoduchý katalog kurzů s přihlašováním. Požadavky zadavatele jsou výrazně širší. Níže přehled klíčových odchylek:

| Oblast | Původní plán | Požadavek zadavatele | Dopad |
|---|---|---|---|
| Doména pro OAuth | `@scio.cz` | `@scioskola.cz` | Změna konfigurace Auth |
| Struktura webu | Ploché — dashboard + kurzy | Dvě hlavní sekce: **Vzdělávání** + **Koncepce** (koncepce zatím placeholder) | Zásadní přepracování navigace a routingu |
| Kategorie kurzů | 4 jednoduché tagy (soft-skills, hard-skills, onboarding, leadership) | Hierarchická struktura: 4 podkategorie → podsekce → kurzy | Nový content model, vnořená navigace |
| Veřejná stránka | Jen login | Login s brandem ScioEdu a krátkým kontextem (ne plná landing page) | Drobná úprava login stránky |
| Kalendář | react-big-calendar (standalone) | Napojení na Google Calendar | Integrace Google Calendar API |
| Materiály | Vše v Sanity | Některé z Google Disku | Integrace Google Drive / embed |
| Externí odkazy | Žádné | Prolinky na scioedu.cz, Pedagogické maximum atd. | Podpora externích URL v content modelu |
| Detail kurzu | Základní (název, popis, lektor, datum) | Rozšířený: pro koho, co získá, cena, foto lektora, medailonek, kontakt na organizátory | Rozšíření Sanity schématu |
| Skryté sekce | Nepodporováno | Vzdělávací cesty — připravit prostor, zatím skrýt | Visibility flag v obsahu |
| Sekce Koncepce | Neexistuje | Připravit prostor, budovat později — podcasty, metodické balíčky, koncepční dokumenty | Placeholder stránky + budoucí content model |

---

## 2. Popis projektu (aktualizovaný)

Intranet **ScioEdu** je interní webový portál pro zaměstnance ScioPolis (především ScioŠkol). Má dva hlavní cíle:

1. **Vzdělávání** (primární) — ucelená nabídka interních kurzů produkovaných ScioEdu. Cílem je efektivně propagovat a „prodat" kurzy zaměstnancům.
2. **Koncepce** (sekundární) — místo, kde pracovník ScioPolis nalezne informace ke koncepci ScioŠkol (podcasty, metodické balíčky, koncepční dokumenty).

Obě sekce jsou navzájem propojené cross-linky. Přístup po přihlášení přes Google účet `jmeno.prijmeni@scioskola.cz`.

---

## 3. Tech Stack

| Vrstva | Technologie | Poznámka |
|---|---|---|
| Framework | **Remix** | Nativní Cloudflare Workers podpora |
| Jazyk | TypeScript (strict) | |
| Stylování | Tailwind CSS v4 | CSS-based config |
| Komponenty | shadcn/ui | Karty, dialogy, tabulky, badge, tabs |
| Auth | Supabase Auth | Google OAuth, omezení na `@scioskola.cz` |
| Databáze | Supabase (PostgreSQL) | Uživatelé, přihlášky, profily |
| CMS | Sanity.io | Obsah kurzů, stránky sekcí, kategorie |
| Kalendář | **Google Calendar API** | Embed nebo API napojení na firemní kalendář |
| Soubory | **Google Drive embed/API** | Materiály sdílené přes Google Disk |
| Deploy | Cloudflare Workers | Edge runtime |
| Verzování | GitHub | CI/CD deploy při push na `main` |

### Změna: Kalendář

Původní plán počítal s react-big-calendar jako standalone komponentou plněnou daty ze Sanity. Zadavatel chce **napojení na Google Calendar prostředí**. Dvě možné realizace:

- **Varianta A — Google Calendar embed** (jednodušší): iframe s embeddovaným Google Calendar. Výhoda: nulová údržba, automatická synchronizace. Nevýhoda: omezený vzhled, nelze stylovat.
- **Varianta B — Google Calendar API + vlastní UI** (lepší UX): Použít Google Calendar API k načtení událostí a zobrazit je ve vlastní komponentě (react-big-calendar nebo FullCalendar). Výhoda: plná kontrola nad designem. Nevýhoda: potřeba API klíčů, OAuth scope pro calendar.readonly.

**Doporučení:** Začít variantou A (embed) a přejít na variantu B ve druhé iteraci, pokud bude potřeba lepší integrace do designu.

---

## 4. Struktura webu

### 4.1 Nepřihlášený uživatel

```
/                       → Přihlašovací stránka (veřejná)
                          - Logo a branding ScioEdu
                          - Tlačítko „Přihlásit se přes Google"
                          - Krátký kontext: co na intranetu zaměstnanec najde
                          - Případně pár základních info / odkazů ze scioedu.cz
                          (ne plnohodnotná landing page, jen aby stránka nebyla prázdná)
/auth/callback          → OAuth callback (Supabase)
```

### 4.2 Přihlášený uživatel — hlavní rozcestí

```
/portal                 → Hlavní stránka (rozcestí)
                          - Dva hlavní směry: Vzdělávání + Koncepce
                          - Vizuálně atraktivní, důraz na Vzdělávání a značku ScioEdu
                          - Krátký kontext: „co na webu najdete"
                          - Kalendář nadcházejících akcí (widget/odkaz)
```

### 4.3 Sekce Vzdělávání

```
/programy                             → Rozcestí vzdělávání (4 podkategorie)

/programy/novacek                     → 1. Jsem ve ScioPolis nováček
  ├── /programy/novacek/kurzy         →    Kurzy pro nováčky
  │     - Celoroční vzdělávání pro nové průvodce
  │     - Akademie pro nováčky ve ScioPolis
  │     - [prolink] Pedagogické maximum (ext. scioedu.cz)
  │     - [prolink] Asistentské maximum (ext. scioedu.cz)
  │     - Tlačítko: „nic tu pro tebe není → Vzdělávání a růst pro každého"
  └── /programy/novacek/informace     →    Hledám informace
        - Krátký úvod
        - [prolink] na sekci Koncepce (podcasty, balíčky, dokumenty)

/programy/rust                        → 2. Vzdělávání a růst pro každého
  ├── /programy/rust/sciocile         →    Kurzy na ScioCíle
  │     - 8 expertních kurzů (s detailními podstránkami)
  │     - Kurz didaktiky odolnosti (+ později další)
  ├── /programy/rust/remeslo          →    Řemeslo průvodce
  │     - Sledování pokroku žáků
  │     - Učím s AI
  │     - [prolink] Didaktiky → Kurzy na ScioCíle
  │     - [prolink] Akademie moderního učitele (ext.)
  └── /programy/rust/osobni-rozvoj    →    Osobní rozvoj
        - Placeholder (zatím žádný kurz)
        - [prolink] Asistentské maximum, Pedagogické maximum (ext.)
  + Všude prolink „Hledám informace" → sekce Koncepce

/programy/tymy                        → 3. Rozvoj pro týmy a kvadriády
  - Kompetenční vzdělávání do průvodcoven
  - Děti se speciálně vzdělávacími potřebami
  - Kurzy na míru pro týmy a kvadriády

/programy/cesty                       → 4. Vzdělávací cesty [SKRYTÁ]
  - Připravit prostor v systému
  - Strukturace: ScioCíl → Výchozí dokumenty → Didaktika → Kurzy
  - Nezobrazovat v navigaci (visibility flag)
```

### 4.4 Sekce Koncepce (aktivní placeholder)

```
/koncepce                               → Připravený prostor
  - Úvodní text: „Sekce se připravuje — ale už teď tu najdete..."
  - Odkazy na existující materiály z Google Drive (pokud jsou k dispozici)
  - Kategorie připravené pro budoucí obsah: Podcasty, Metodické balíčky, Koncepční dokumenty
  - Obsah spravovaný přes Sanity (sectionPage s section_key='koncepce' + pole resources[])
```

> ℹ️ Prolinky „Hledám informace" z podsekcí Vzdělávání vedou sem. I jako placeholder by stránka měla nabídnout aspoň pár reálných odkazů (Google Drive dokumenty, existující podcasty), aby návštěvník neodešel naprázdno. Správce doplní přes Sanity Studio.

### 4.5 Detail kurzu

```
/programy/kurz/[slug]                 → Detail jednoho kurzu
  - Název kurzu
  - O čem kurz je (krátký highlight)
  - Pro koho je určen
  - Co účastník získá / co si odnese
  - Termíny (může jich být víc), čas, cena, místo konání
  - Tlačítko „Přihlásit se na kurz" (s potvrzovacím dialogem + výběr termínu)
  - Lektor: foto, krátký medailonek
  - Fotografie z kurzu — masonry galerie (CSS columns) s lightboxem
  - Napsali o kurzu — reference účastníků (plain text)
  - Kontakt na organizátory
```

**Interní kurz vs. externí kurz:**
- `is_external = false` → plný detail s přihlášením přes intranet
- `is_external = true` → zkrácený detail (highlight, pro koho, lektor) + výrazné CTA tlačítko „Přejít na přihlášení →" odkazující na `external_url`. Žádné interní přihlášení, žádný zápis do enrollments.

**Breadcrumbs:** Jedna sdílená route `/programy/kurz/$slug`. Breadcrumbs se sestavují z dat kurzu v Sanity (pole `section` a `subsection`), nikoliv z URL. Loader kurzu vrátí i data o nadřazené sekci, komponenta `Breadcrumbs.tsx` je vykreslí (např. Vzdělávání > Růst > ScioCíle > Název kurzu). Uživatel se kliknutím na breadcrumb vrátí do správné kategorie.

### 4.6 Doplňkové stránky

```
/kalendar                               → Kalendář akcí (Google Calendar)
/moje-kurzy                             → Moje přihlášené/absolvované kurzy
/profil                                 → Profil uživatele (datum/místo narození pro certifikáty)
```

---

## 5. Autentizace & Zabezpečení

- Přihlášení **pouze přes Google OAuth** („Přihlásit se přes Google")
- Po přihlášení ověření e-mailové domény — povoleno pouze `@scioskola.cz`
- Neoprávněná doména → redirect na přihlašovací stránku s chybou: „Přístup povolen pouze zaměstnancům ScioPolis"
- Všechny stránky pod `/portal`, `/programy`, `/koncepce`, `/kalendar`, `/moje-kurzy` chráněny přes Remix loader (server-side redirect)
- Veřejně přístupné: `/` (přihlášení), `/auth/callback`
- Session: 7 dní (Supabase default), automatické obnovení

---

## 6. Rozdělení zodpovědnosti dat

```
Sanity.io        →  obsah kurzů, texty sekcí, kategorie, lektoři, stránky Koncepce (později)
Supabase         →  uživatelé, profily, přihlášky na kurzy (enrollments)
Google Calendar  →  kalendář akcí a školení
Google Drive     →  sdílené materiály a dokumenty (embed nebo odkaz)
Cloudflare       →  hosting, edge runtime
```

---

## 7. Sanity schéma (aktualizované)

### 7.1 Kurz (course)

```typescript
// sanity/schemas/course.ts
export default {
  name: 'course',
  title: 'Kurz',
  type: 'document',
  fields: [
    // Základní info
    { name: 'title', title: 'Název kurzu', type: 'string', validation: Rule => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'highlight', title: 'Krátký highlight', type: 'text',
      description: 'O čem kurz je — krátký popis pro kartu a přehled (1–2 věty)' },
    { name: 'description', title: 'Podrobný popis', type: 'blockContent' },

    // Cílová skupina a přínos
    { name: 'target_audience', title: 'Pro koho je určen', type: 'text' },
    { name: 'benefits', title: 'Co účastník získá / co si odnese', type: 'array',
      of: [{ type: 'string' }] },

    // Zařazení
    { name: 'section', title: 'Sekce', type: 'string',
      options: { list: ['novacek', 'rust', 'tymy', 'cesty'] },
      description: 'Hlavní kategorie vzdělávání' },
    { name: 'subsection', title: 'Podsekce', type: 'string',
      options: { list: ['sciocile', 'remeslo', 'osobni-rozvoj', 'kurzy-novacek', 'informace'] },
      description: 'Podsekce v rámci kategorie (volitelné)' },
    { name: 'tags', title: 'Štítky', type: 'array', of: [{ type: 'string' }],
      options: { list: [
        { title: 'Expertní kurz', value: 'expertni' },
        { title: 'Didaktika', value: 'didaktika' },
        { title: 'AI', value: 'ai' },
        { title: 'SVP', value: 'svp' },
        { title: 'Na míru', value: 'na-miru' },
      ] } },

    // Termíny — pole termínů (kurz může běžet víckrát)
    { name: 'dates', title: 'Termíny', type: 'array',
      of: [{
        type: 'object',
        name: 'courseTerm',
        fields: [
          { name: 'date_start', title: 'Začátek', type: 'datetime' },
          { name: 'date_end', title: 'Konec', type: 'datetime' },
          { name: 'location', title: 'Místo konání', type: 'string' },
          { name: 'capacity', title: 'Kapacita', type: 'number' },
          { name: 'note', title: 'Poznámka k termínu', type: 'string',
            description: 'Např. "online", "náhradní termín"' },
        ],
        preview: {
          select: { title: 'date_start', subtitle: 'location' }
        }
      }],
      description: 'Jeden kurz může mít více termínů. Uživatel si při přihlášení vybere konkrétní termín.' },

    // Logistika (sdílené pro všechny termíny)
    { name: 'duration_minutes', title: 'Délka (minuty)', type: 'number' },
    { name: 'price', title: 'Cena', type: 'number',
      description: 'Cena v Kč (0 = zdarma). Frontend formátuje jako "Zdarma" / "1 200 Kč"' },

    // Lektoři (pole referencí — kurz může mít více lektorů)
    { name: 'lecturers', title: 'Lektoři', type: 'array', of: [{ type: 'reference', to: [{ type: 'lecturer' }] }] },

    // Kontakt
    { name: 'contact_name', title: 'Kontaktní osoba', type: 'string' },
    { name: 'contact_email', title: 'Kontaktní e-mail', type: 'string' },

    // Média a materiály
    { name: 'image', title: 'Obrázek kurzu', type: 'image',
      options: { hotspot: true } },
    { name: 'materials', title: 'Materiály', type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Název', type: 'string' },
          { name: 'url', title: 'Odkaz (Google Drive, web...)', type: 'url' },
        ]
      }],
      description: 'Odkazy na materiály z Google Drive nebo jiné zdroje' },

    // Externí odkaz (pokud kurz žije jinde)
    { name: 'external_url', title: 'Externí odkaz', type: 'url',
      description: 'Pokud kurz vede na externí web (scioedu.cz apod.)' },

    // Viditelnost a typ
    { name: 'is_published', title: 'Publikováno', type: 'boolean', initialValue: true },
    { name: 'is_external', title: 'Externí kurz', type: 'boolean', initialValue: false,
      description: 'Pouze odkaz na jiný web — zobrazí zkrácený detail s tlačítkem "Přejít na přihlášení"' },
  ]
}
```

### 7.2 Lektor (nové schéma)

```typescript
// sanity/schemas/lecturer.ts
export default {
  name: 'lecturer',
  title: 'Lektor',
  type: 'document',
  fields: [
    { name: 'name', title: 'Jméno a příjmení', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' } },
    { name: 'photo', title: 'Foto', type: 'image', options: { hotspot: true } },
    { name: 'bio', title: 'Krátký medailonek', type: 'text' },
    { name: 'email', title: 'E-mail', type: 'string' },
  ]
}
```

### 7.3 Stránka sekce (nové schéma)

```typescript
// sanity/schemas/sectionPage.ts
export default {
  name: 'sectionPage',
  title: 'Stránka sekce',
  type: 'document',
  fields: [
    { name: 'title', title: 'Název sekce', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'intro_text', title: 'Úvodní text', type: 'blockContent' },
    { name: 'section_key', title: 'Klíč sekce', type: 'string',
      options: { list: ['novacek', 'rust', 'tymy', 'cesty', 'koncepce'] } },
    { name: 'resources', title: 'Materiály a odkazy', type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'label', title: 'Název', type: 'string' },
          { name: 'url', title: 'Odkaz', type: 'url' },
          { name: 'type', title: 'Typ', type: 'string',
            options: { list: ['google-drive', 'external-web', 'internal-link', 'podcast'] } },
        ]
      }],
      description: 'Odkazy na Google Drive dokumenty, podcasty, externí weby apod.' },
    { name: 'is_visible', title: 'Viditelná', type: 'boolean', initialValue: true },
    { name: 'order', title: 'Pořadí', type: 'number' },
  ]
}
```

### 7.4 Block Content (sdílený typ)

```typescript
// sanity/schemas/blockContent.ts
export default {
  name: 'blockContent',
  title: 'Obsah',
  type: 'array',
  of: [
    { type: 'block',
      marks: {
        annotations: [
          { name: 'link', type: 'object',
            fields: [
              { name: 'href', type: 'url' },
              { name: 'isExternal', type: 'boolean', initialValue: false },
            ] }
        ]
      }
    },
    { type: 'image', options: { hotspot: true } },
  ]
}
```

---

## 8. Databázová struktura (Supabase — aktualizovaná)

```sql
-- Uživatelé (spravováno Supabase Auth)
auth.users (id, email, created_at)

-- Profily zaměstnanců
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  department TEXT,
  school TEXT,                -- Název ScioŠkoly (volitelné)
  avatar_url TEXT,
  role TEXT DEFAULT 'employee'  -- 'employee' | 'admin'
);

-- Přihlášky na kurzy
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  course_id TEXT NOT NULL,       -- Sanity document ID
  term_index INT NOT NULL DEFAULT 0, -- index termínu v poli dates[] v Sanity (0 = první termín)
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'registered',  -- 'registered' | 'attended' | 'cancelled'
  UNIQUE(user_id, course_id, term_index)  -- jeden uživatel = jedna přihláška na konkrétní termín kurzu
);

-- RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Uživatel vidí a edituje jen svůj profil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Uživatel vidí a spravuje jen své přihlášky
CREATE POLICY "Users can view own enrollments"
  ON enrollments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own enrollments"
  ON enrollments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own enrollments"
  ON enrollments FOR UPDATE USING (auth.uid() = user_id);

-- Admin vidí vše
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can view all enrollments"
  ON enrollments FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
```

---

## 9. Struktura projektu (aktualizovaná)

```
scio-edu/
├── CLAUDE.md
├── remix.config.ts
├── tsconfig.json
│
├── sanity/
│   ├── sanity.config.ts
│   └── schemas/
│       ├── course.ts
│       ├── lecturer.ts
│       ├── sectionPage.ts
│       └── blockContent.ts
│
├── app/
│   ├── root.tsx
│   ├── globals.css                       # Tailwind v4 + design tokens
│   │
│   ├── routes/
│   │   ├── _index.tsx                    # Přihlašovací stránka (veřejná, s brandem ScioEdu)
│   │   ├── auth.callback.tsx             # Supabase OAuth callback
│   │   │
│   │   ├── (portal)/
│   │   │   ├── _layout.tsx              # Sidebar + header (přihlášení)
│   │   │   ├── portal._index.tsx        # Hlavní rozcestí (Vzdělávání / Koncepce)
│   │   │   │
│   │   │   ├── vzdelavani._index.tsx    # Rozcestí 4 podkategorií
│   │   │   ├── vzdelavani.novacek.tsx   # Jsem ve ScioPolis nováček
│   │   │   ├── vzdelavani.novacek.kurzy.tsx
│   │   │   ├── vzdelavani.novacek.informace.tsx
│   │   │   ├── vzdelavani.rust.tsx      # Vzdělávání a růst pro každého
│   │   │   ├── vzdelavani.rust.sciocile.tsx
│   │   │   ├── vzdelavani.rust.remeslo.tsx
│   │   │   ├── vzdelavani.rust.osobni-rozvoj.tsx
│   │   │   ├── vzdelavani.tymy.tsx      # Rozvoj pro týmy a kvadriády
│   │   │   ├── vzdelavani.cesty.tsx     # Vzdělávací cesty (skrytá)
│   │   │   ├── vzdelavani.kurz.$slug.tsx  # Detail kurzu (sdílený)
│   │   │   │
│   │   │   ├── koncepce._index.tsx      # Placeholder — připraveno
│   │   │   │
│   │   │   ├── kalendar.tsx             # Kalendář akcí (Google Calendar)
│   │   │   ├── moje-kurzy.tsx           # Přihlášené kurzy uživatele
│   │   │   └── admin.tsx                # Přehled přihlášek (pouze role=admin)
│   │
│   ├── components/
│   │   ├── ui/                          # shadcn/ui
│   │   ├── CourseCard.tsx               # Karta kurzu (rozšířená)
│   │   ├── LecturerCard.tsx             # Karta lektora (foto + bio)
│   │   ├── CategoryGrid.tsx             # Mřížka podkategorií
│   │   ├── SectionHero.tsx              # Úvodní blok sekce (nadpis + popis)
│   │   ├── CalendarEmbed.tsx            # Google Calendar embed/wrapper
│   │   ├── ExternalLink.tsx             # Odkaz na externí web (s ikonou)
│   │   ├── Sidebar.tsx                  # Boční navigace (hierarchická)
│   │   ├── UserMenu.tsx                 # Avatar + odhlášení
│   │   └── Breadcrumbs.tsx              # Drobečková navigace
│   │
│   └── lib/
│       ├── supabase/
│       │   ├── client.ts
│       │   └── server.ts
│       ├── sanity/
│       │   ├── client.ts
│       │   └── queries.ts               # GROQ dotazy (rozšířené)
│       ├── google/
│       │   └── calendar.ts              # Google Calendar API helper
│       └── utils.ts
│
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## 10. Stránky & Funkce (aktualizované)

| Stránka | URL | Přístup | Popis |
|---|---|---|---|
| Přihlášení | `/` | Veřejná | Login s brandem ScioEdu + krátký kontext |
| Rozcestí | `/portal` | Chráněná | Vzdělávání vs. Koncepce, kalendář widget |
| Vzdělávání | `/programy` | Chráněná | Přehled 4 podkategorií |
| Nováček | `/programy/novacek` | Chráněná | Kurzy a info pro nováčky |
| Růst | `/programy/rust` | Chráněná | ScioCíle, Řemeslo, Osobní rozvoj |
| Týmy | `/programy/tymy` | Chráněná | Kurzy pro týmy a kvadriády |
| Cesty | `/programy/cesty` | Skrytá | Připraveno, nezobrazeno v navigaci |
| Detail kurzu | `/programy/kurz/[slug]` | Chráněná | Kompletní info + přihlášení (interní) nebo odkaz ven (externí) |
| Koncepce | `/koncepce` | Chráněná | Aktivní placeholder s existujícími materiály |
| Kalendář | `/kalendar` | Chráněná | Google Calendar akcí |
| Moje kurzy | `/moje-kurzy` | Chráněná | Přihlášené a absolvované kurzy |
| Admin přihlášek | `/admin` | Admin only | Přehled přihlášek, odhlašování uživatelů, CSV export filtrovaných dat (viditelné sloupce, UTF-8 BOM), statistiky (loader ověří `role = 'admin'`). Stav tabulky (řazení, filtry, sloupce) se ukládá do localStorage. |
| Sanity Studio | Sanity cloud | Pouze admin | Správa obsahu |

---

## 11. Design (dle brand manuálu ScioEdu)

### Brand identita

**Logo:** Infinity symbol + „scioedu" (malými písmeny). Varianty: tyrkysová (primární), černá, šedá, bílá (na tmavém pozadí). Logo má horizontální i vertikální verzi.

### Barevná paleta

| Název | HEX | Použití |
|---|---|---|
| **Tyrkys** | `#1DA2AC` | Primární barva — logo, sidebar, header, aktivní prvky, linky |
| **Hořčičná** | `#FCB813` | Akcent / CTA — tlačítka „Přihlásit se", důležité akce, notifikace |
| **Šedomodrá** | `#687A7C` | Sekundární text, ikony, neaktivní prvky, bordery |
| **Jemný tyrkys** | `#BADEDF` | Pozadí karet, hover stavy, badge backgrounds, light accent |
| Bílá | `#FFFFFF` | Hlavní pozadí obsahu |
| Světle šedá | `#F5F7F8` | Pozadí stránky / sekcí |
| Černá | `#1A1A1A` | Primární text |

### Typografie

| Účel | Font | Fallback (Google Docs) | Poznámka |
|---|---|---|---|
| Nadpisy (h1–h3) | **Waffle** (bold) | **Poppins** (bold) | Na webu použít Poppins (Google Fonts, volně dostupný). Waffle je komerční font — pokud není licence, Poppins je schválená náhrada. |
| Tělo textu | **Montserrat** | Montserrat | Google Fonts, bez omezení |
| Drobný text, labels | **Roboto** | Roboto | Google Fonts, bez omezení |

### Design principy
- Čistý, moderní, přátelský vzhled v duchu ScioEdu brandu
- Tyrkysová jako dominantní barva (sidebar, header, aktivní stavy)
- Hořčičná pro CTA tlačítka a zvýraznění — výrazný kontrast k tyrkysové
- Bílé/světle šedé pozadí, hodně prostoru
- Velká čitelná typografie (Poppins nadpisy, Montserrat text)
- Kartičkový layout pro kurzy i kategorie
- **Vizuálně jasné oddělení** sekcí Vzdělávání a Koncepce na rozcestí
- Logo ScioEdu v tyrkysové na bílém headeru, bílé na tyrkysovém sidebaru
- Plně responzivní (mobil + desktop)
- Český jazyk v celém UI

### CSS design tokens (Tailwind v4)

```css
/* globals.css — design tokens dle brand manuálu */
@theme {
  --color-primary: #1DA2AC;        /* Tyrkys */
  --color-primary-light: #BADEDF;  /* Jemný tyrkys */
  --color-accent: #FCB813;         /* Hořčičná */
  --color-muted: #687A7C;          /* Šedomodrá */
  --color-bg: #F5F7F8;             /* Pozadí stránky */
  --color-surface: #FFFFFF;        /* Pozadí karet */
  --color-text: #1A1A1A;           /* Primární text */
  --color-text-muted: #687A7C;     /* Sekundární text */

  --font-heading: 'Poppins', sans-serif;
  --font-body: 'Montserrat', sans-serif;
  --font-small: 'Roboto', sans-serif;
}
```

### Navigace
- **Sidebar** (kolapsibilní na mobilu): tyrkysové pozadí, bílý text/ikony, aktivní položka se zvýrazněním (hořčičná nebo světlejší tyrkys). Položky: Rozcestí → Vzdělávání (s vnořenými podsekcemi) → Koncepce → Kalendář → Moje kurzy
- **Header**: Bílé pozadí, logo ScioEdu v tyrkysové, breadcrumbs, avatar s dropdown (profil, odhlášení)
- **Breadcrumbs**: Vždy viditelné, reflektují hierarchii (Vzdělávání > Růst > ScioCíle > Název kurzu)

### Komponenty
- `CourseCard` — obrázek, název, highlight, kategorie badge (jemný tyrkys pozadí), datum, místo, cena, CTA (hořčičné tlačítko)
- `CategoryCard` — vizuální karta pro podkategorie (ikona, název, krátký popis, tyrkysový hover)
- `LecturerCard` — foto, jméno, medailonek
- `SectionHero` — nadpis sekce (Poppins bold) + úvodní text (Montserrat)
- `ExternalLink` — odkaz na scioedu.cz s ikonou externího odkazu
- shadcn/ui: Card, Badge, Button, Dialog, Avatar, Tabs, Tooltip — přestylované na ScioEdu barvy

---

## 12. Google integrace

### 12.1 Google Calendar
- Firemní kalendář s akcemi a školeními
- Fáze 1: Embed přes iframe (`<iframe src="https://calendar.google.com/calendar/embed?src=...">`)
- Fáze 2 (volitelná): Google Calendar API → vlastní UI s filtrováním

### 12.2 Google Drive
- Některé materiály (PDF, dokumenty) budou sdíleny přes Google Drive
- Implementace: odkaz na soubor nebo embed přes Google Drive viewer
- V Sanity: pole `materials[]` u kurzů a `resources[]` u stránek sekcí (sectionPage) — oba obsahují `{label, url}`
- Žádné přímé stahování/ukládání souborů na server — vše jako odkazy

---

## 13. Env proměnné

```env
# Supabase
SUPABASE_URL=https://[projekt-id].supabase.co
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...  # pouze pro server-side operace

# Sanity
SANITY_PROJECT_ID=...
SANITY_DATASET=production
SANITY_API_TOKEN=...           # read token pro frontend

# Google (pokud Calendar API varianta B)
GOOGLE_CALENDAR_ID=...
GOOGLE_API_KEY=...             # nebo Service Account credentials

# Obecné
PUBLIC_SITE_URL=https://edu.scioskola.cz  # nebo jiná doména
```

---

## 14. Náklady

| Služba | Plán | Cena |
|---|---|---|
| Cloudflare Workers | Free | $0/měsíc |
| Supabase | Free (50k MAU, 500MB) | $0/měsíc |
| Sanity.io | Free (3 admini, 500k req/měsíc) | $0/měsíc |
| GitHub | Free | $0/měsíc |
| Google Workspace | Již placeno ScioPolis | $0 navíc |
| Vlastní doména | Volitelné | ~$10/rok |
| **Celkem** | | **$0/měsíc** |

> ⚠️ **Sanity free tier omezení:** Max 3 uživatelé se přístupem do Sanity Studia. Pokud bude obsah spravovat víc než 3 lidé (např. organizátoři kurzů + admin vzdělávání + správce Koncepce), bude nutný upgrade na Team plán ($15/uživatel/měsíc). Pro začátek stačí, aby přístupy měli jen 2–3 klíčoví správci a ostatní posílali podklady e-mailem.

---

## 15. Fáze realizace (doporučené)

### Fáze 1 — MVP (6–8 týdnů)
- Autentizace (`@scioskola.cz`)
- Přihlašovací stránka s brandem ScioEdu
- Hlavní rozcestí (Vzdělávání / Koncepce placeholder s existujícími materiály)
- Sekce Vzdělávání: navigace, kategorie, podkategorie
- Detail kurzu (kompletní — interní i externí varianta)
- Přihlašování na kurzy s výběrem termínu (Supabase enrollments)
- Moje kurzy
- Admin — přehled přihlášek (jednoduchá tabulka s filtrem, export CSV)
- Google Calendar embed
- Nasazení na Cloudflare Workers + CI/CD
- Naplnění Sanity ukázkovými kurzy (8–10 kurzů)

### Fáze 2 — Rozšíření (3–5 týdnů)
- Sekce Koncepce (plný obsah od zadavatele)
- Vzdělávací cesty (odkrytí sekce, naplnění obsahem)
- Google Calendar API + vlastní UI (pokud embed nestačí)
- E-mailové notifikace (potvrzení přihlášky, připomínka před termínem)
- Admin rozšíření — statistiky, kapacita termínů, docházka

### Fáze 3 — Optimalizace
- Fulltextové vyhledávání kurzů
- Hodnocení/feedback ke kurzům
- Pokročilé filtrování a doporučení
- Analytics (návštěvnost, oblíbenost kurzů, konverzní poměr přihlášek)

---

## 16. Otevřené otázky pro zadavatele

1. **Doména intranetu** — bude vlastní (např. `edu.scioskola.cz`) nebo pod jinou adresou?
2. **Google Calendar** — existuje sdílený firemní kalendář s akcemi? Nebo se bude vytvářet nový?
3. **Přihlašování na kurzy** — probíhá čistě přes intranet, nebo se u některých kurzů přihlašuje externě (scioedu.cz)?
4. **Kapacita a cena** — jsou všechny kurzy zdarma pro zaměstnance, nebo některé placené?
5. **Koncepce — obsah** — kdy se počítá s dodáním podkladů pro sekci Koncepce?
6. **Vzdělávací cesty** — existuje alespoň hrubý seznam ScioCílů pro přípravu struktury?
7. **Oprávnění** — mají všichni zaměstnanci vidět vše, nebo existují sekce omezené na určité role/školy?
8. ~~**Branding** — máme k dispozici logo ScioEdu, brandbook nebo alespoň barevnou paletu?~~ ✅ Dodán brand manuál (logo, barvy, fonty)
9. **Materiály z Google Drive** — budou přístupné všem přihlášeným, nebo jen přihlášeným na konkrétní kurz?
10. **Analytika** — chce zadavatel sledovat, kolik lidí se přihlásilo, kdo dokončil kurz, oblíbenost kurzů?

---

## 17. Aktualizovaný prompt pro Bolt.new / AI generátor

> ⚠️ Prompt níže je aktualizovaný oproti originálu a reflektuje skutečné požadavky zadavatele.

```
Build an internal company intranet called "ScioEdu" for the ScioPolis organization.

**Tech Stack:**
- Remix (NOT Next.js) with Cloudflare Workers
- TypeScript strict mode
- Tailwind CSS v4 (CSS-based config)
- shadcn/ui components
- Supabase Auth with Google OAuth (restrict to @scioskola.cz)
- Sanity.io for content management
- Google Calendar embed for calendar view
- Deploy target: Cloudflare Workers

**Public pages (unauthenticated):**
- Login page at `/` — ScioEdu logo and branding, "Sign in with Google" button, short contextual text about what employees will find on the intranet (not a full landing page, just enough so the page isn't empty). Optionally a few links/info from scioedu.cz.
- After OAuth callback, verify email domain is @scioskola.cz. Reject others with: "Přístup povolen pouze zaměstnancům ScioPolis"

**Authenticated pages:**
1. `/portal` — Main hub with two visually distinct sections: "Vzdělávání" (primary, larger, more prominent) and "Koncepce" (secondary, active placeholder with intro text and links to existing Google Drive materials managed via Sanity). Include upcoming events widget.

2. `/programy` — Education section landing with 4 category cards:
   - "Jsem ve ScioPolis nováček" → `/programy/novacek`
   - "Vzdělávání a růst pro každého" → `/programy/rust`
   - "Rozvoj pro týmy a kvadriády" → `/programy/tymy`
   - "Vzdělávací cesty" → `/programy/cesty` (HIDDEN, not shown in nav)

3. Each category page has sub-sections with course listings and cross-links:
   - novacek: kurzy (internal courses + external links to scioedu.cz), informace (link to Koncepce)
   - rust: 3 sub-categories (Kurzy na ScioCíle, Řemeslo průvodce, Osobní rozvoj) with individual courses
   - tymy: 3 courses listed directly
   - cesty: hidden placeholder structured as ScioCíl → Documents → Didaktika → Kurzy

4. `/programy/kurz/$slug` — Course detail page. Two variants based on is_external flag:
   - Internal course (is_external=false): title, highlight, target audience, benefits list, multiple terms (dates/location/capacity picker), price, duration, enroll button (Dialog with term selection), lecturer cards (photo + bio, multiple lecturers supported), organizer contact, materials (Google Drive links)
   - External course (is_external=true): shortened detail with highlight, target audience, lecturers, and prominent CTA button "Přejít na přihlášení →" linking to external_url. No internal enrollment.
   - Breadcrumbs built from Sanity data (section + subsection fields), not from URL path

5. `/koncepce` — Active placeholder ("Sekce se připravuje — ale už teď tu najdete...") with links to existing resources from sectionPage.resources[], categorized as podcasts/methodological packages/conceptual documents

6. `/kalendar` — Google Calendar embed showing upcoming training events
7. `/moje-kurzy` — User's enrolled courses with status badges and selected term info
8. `/admin` — Admin-only page (check role='admin' in loader): table of all enrollments across courses, filter by course/status/date, CSV export

**Sanity schemas:**
- course: title, slug, highlight, description (block content), target_audience, benefits[], section, subsection, tags[], dates[] (array of {date_start, date_end, location, capacity, note}), duration_minutes, price, lecturers (array of references), contact_name, contact_email, image, materials[] ({label, url}), external_url, is_published, is_external
- lecturer: name, slug, photo, bio, email
- sectionPage: title, slug, intro_text (block content), section_key, resources[] ({label, url, type}), is_visible, order
- Seed with 8-10 sample courses in Czech across all categories

**Supabase tables:**
- profiles: id (ref auth.users), full_name, department, school, avatar_url, role
- enrollments: id, user_id, course_id (Sanity ID), term_index (int, index into dates[]), enrolled_at, status, UNIQUE(user_id, course_id, term_index)
- RLS policies: users see/manage own data; admins (role='admin') see all

**Layout:**
- Collapsible sidebar: Portal, Vzdělávání (with nested sub-items), Koncepce, Kalendář, Moje kurzy (+ Admin link if role=admin)
- Header: ScioEdu logo, breadcrumbs, user avatar dropdown
- Breadcrumbs built from course/section data, reflecting full hierarchy

**Design (per ScioEdu brand manual):**
- Brand colors: Primary #1DA2AC (turquoise), Accent #FCB813 (mustard/yellow for CTA buttons), Muted #687A7C (grey-blue), Light #BADEDF (light turquoise for backgrounds/badges)
- Fonts: Poppins (bold, headings), Montserrat (body text), Roboto (small text/labels) — all from Google Fonts
- Logo: ScioEdu infinity symbol in turquoise on white, white on turquoise background
- Sidebar: turquoise background with white text/icons, active item highlighted
- Header: white background, turquoise ScioEdu logo, breadcrumbs
- CTA buttons in mustard yellow (#FCB813) for high contrast against turquoise
- White/light gray backgrounds (#F5F7F8), generous whitespace
- Card-based layouts with light turquoise badge backgrounds
- Category cards with icons for the 4 main education sections
- Course cards with image, category badge, highlight, nearest date, location, price
- External course cards visually distinguished (e.g. subtle "externí" badge, different CTA text)
- Fully responsive, Czech language throughout
- ScioEdu branding prominent on login page and portal header
```
