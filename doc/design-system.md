# Design System — ScioEdu Intranet

Single source of truth pro vizuální konzistenci. Všechny barvy, typografie a spacing jsou definované v `app/tailwind.css` jako CSS custom properties.

---

## Barvy

Vždy používej sémantické Tailwind třídy. **Nikdy** hardcodované hex hodnoty.

| Účel | Tailwind class | CSS proměnná | Hex | Kdy použít |
|------|----------------|-------------|-----|------------|
| Primární akce, linky, ikony | `bg-primary` / `text-primary` | `--primary` | #1DA2AC (tyrkys) | Tlačítka, aktivní stavy, linky |
| CTA, důraz, zvýraznění | `bg-secondary` / `text-secondary-foreground` | `--secondary` | #FCB813 (hořčičná) | Call-to-action, upozornění |
| Sekundární text, ikony | `text-muted-foreground` | `--muted-foreground` | ~#687A7C (šedomodrá) | Popisky, podtitulky |
| Jemné pozadí, highlight | `bg-accent` / `text-accent-foreground` | `--accent` | #BADEDF (jemný tyrkys) | Pozadí karet, badge, hover |
| Pozadí stránky | `bg-background` | `--background` | #F5F7F8 | Layout pozadí (automaticky) |
| Text hlavní | `text-foreground` | `--foreground` | ~#1A1A33 | Nadpisy, hlavní text |
| Karty | `bg-card` | `--card` | #FFFFFF | Pozadí Card komponent |
| Destruktivní akce | `bg-destructive` | `--destructive` | červená | Smazání, chyby |
| Okraje | `border-border` | `--border` | světle šedá | Výchozí border |

### Opacity varianty

Pro jemnější odstíny: `bg-primary/10`, `bg-accent/30`, `bg-secondary/90` atd.

---

## Typografie

Fonty jsou importované z Google Fonts a nastavené v CSS:

| Účel | Font | CSS proměnná | Tailwind |
|------|------|-------------|----------|
| Nadpisy (h1–h6) | Poppins | `--font-poppins` | Automaticky přes CSS `h1-h6` rule |
| Tělo textu | Montserrat | `--font-montserrat` | `font-body` na `<body>` |
| Štítky, drobný text | Roboto | `--font-roboto` | `.font-label` class |

### Hierarchie nadpisů

**Pravidlo: Jeden `h1` na stránku, vždy přes `<PageHeader>` komponentu.**

| Úroveň | Tailwind classes | Použití |
|--------|-----------------|---------|
| h1 | `text-3xl font-bold text-foreground` | Hlavní nadpis stránky (PageHeader) |
| h2 | `text-2xl font-semibold` | Sekce na stránce |
| h3 | `text-xl font-semibold` | Podsekce, Card titulky (CardTitle) |
| h4 | `text-lg font-medium` | Menší sekce |
| Body | `text-base` (Montserrat) | Běžný text |
| Small | `text-sm text-muted-foreground` | Popisky, metadata |
| Label | `text-sm font-label` (Roboto) | Formulářové štítky, badge text |

---

## Spacing & Layout

### Container

Layout route (`_authenticated.tsx`) automaticky poskytuje:
```
container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl
```

**Nepoužívat** vlastní container wrapper v route komponentách.

### Mezery

| Kontext | Class | Pixely |
|---------|-------|--------|
| Mezi sekcemi na stránce | `space-y-8` | 32px |
| Uvnitř sekce | `space-y-4` | 16px |
| Grid gap | `gap-6` | 24px |
| Card padding | `p-6` (výchozí z Card) | 24px |
| PageHeader pod sebou | `mb-8` (automaticky) | 32px |

### Grid

```
grid gap-6 md:grid-cols-2 lg:grid-cols-3  // 3-sloupcový responsive
grid gap-6 lg:grid-cols-2                  // 2-sloupcový responsive
```

---

## Layout komponenty

### `<PageHeader>`
Povinná komponenta pro každou stránku. Zajišťuje konzistentní h1 velikost.

```tsx
import { PageHeader } from "~/components/layout/page-header";

<PageHeader
  title="Název stránky"
  description="Volitelný podtitulek"
  breadcrumbs={[
    { label: "Vzdělávání", href: "/vzdelavani" },
    { label: "Aktuální stránka" }, // poslední bez href
  ]}
  actions={<Button>Volitelná akce</Button>}
/>
```

### `<Header>` a `<Footer>`
Automaticky renderovány layout routou. Neimportovat ručně v route komponentách.

### Navigace
- Desktop: horizontální menu v headeru
- Mobile (< 768px): Sheet drawer (hamburger menu)
- Aktivní stav: `text-primary bg-primary/10`

---

## UI komponenty (shadcn/ui)

### Button varianty

| Varianta | Kdy použít |
|----------|------------|
| `default` | Primární akce (bg-primary) |
| `accent` | CTA, výzva k akci (bg-secondary/hořčičná) |
| `outline` | Sekundární akce |
| `ghost` | Subtilní akce, navigace v kartách |
| `link` | Textový odkaz se stylem tlačítka |
| `destructive` | Smazání, zrušení |
| `secondary` | Méně důležitá akce (bg-muted) |

### Badge varianty

| Varianta | Kdy použít |
|----------|------------|
| `default` | Výchozí stav, aktivní (tyrkys) |
| `secondary` | Informativní (jemný tyrkys) |
| `accent` | Zvýrazněný (hořčičná) |
| `destructive` | Zrušeno, chyba |
| `outline` | Neutrální, tag |

### Card pattern

```tsx
<Card>
  <CardHeader>
    <CardTitle>Titulek</CardTitle>
    <CardDescription>Popis</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Obsah */}
  </CardContent>
</Card>
```

---

## Ikony

Knihovna: `lucide-react`

| Kontext | Velikost |
|---------|----------|
| V textu / badge | `size={16}` nebo `h-4 w-4` |
| Standalone (v kartě, tlačítku) | `size={20}` nebo `h-5 w-5` |
| Velká ikona (feature card) | `size={24}` nebo `h-6 w-6` |

---

## Responsivita

| Breakpoint | Tailwind prefix | Použití |
|-----------|-----------------|---------|
| < 640px | (výchozí) | Mobile — 1 sloupec, hamburger menu |
| 640px+ | `sm:` | Větší mobile |
| 768px+ | `md:` | Tablet — 2 sloupce, desktop nav |
| 1024px+ | `lg:` | Desktop — 3 sloupce, plný layout |

Mobile-first přístup: píšeme mobilní styl jako výchozí, větší obrazovky přidáváme prefixem.

---

## Anti-patterns (NEPOUŽÍVAT)

| Zakázáno | Správně |
|----------|---------|
| `bg-[#1DA2AC]` (hardcoded hex) | `bg-primary` |
| `text-gray-900` (raw Tailwind gray) | `text-foreground` |
| Raw `<h1>` v route | `<PageHeader title="...">` |
| Vlastní `container mx-auto` v route | Layout route to poskytuje |
| `style={{ color: '#1DA2AC' }}` | Tailwind class |
| Ruční `font-family` | CSS proměnné / Tailwind base styles |
| `<a href="/cesta">` (interní link) | `<Link to="/cesta">` (Remix) |
