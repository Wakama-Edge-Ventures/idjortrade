# IdjorTrade — Design System MASTER
> Direction : **SENTINEL 90% + AURORA 10%** | Stack : Next.js 15, Tailwind CSS v4, shadcn/ui
> Audience : Traders professionnels, fintech institutionnel Afrique de l'Ouest
> Mis à jour : 2026-04-07

---

## Philosophie

**SENTINEL** est la base : densité information maximale, lisibilité chirurgicale, respect du trader. Fond navy profond, surfaces sobres, zéro ornement superflu.

**AURORA** est l'inflexion (10% maximum) : l'or pour les éléments premium uniquement (tier PRO, focus ring, CTA principal), glass sur les cartes de plans tarifaires.

> Règle absolue : Si un élément rappelle une app crypto générée par IA, un jeu vidéo ou du neon, il est éliminé.

---

## 1. Color Tokens

### Surfaces
| Token CSS | Valeur | Usage |
|-----------|--------|-------|
| `--surface` | `#060D1A` | Fond principal OLED profond |
| `--surface-low` | `#0A1221` | Sidebar, header, fond secondaire |
| `--surface-mid` | `#0F1A2E` | Cartes secondaires, inputs |
| `--surface-high` | `#162238` | Cartes primaires, modales |
| `--surface-highest` | `#1E2E46` | Hover states, éléments selected |
| `--surface-glass` | `rgba(22,34,56,0.72)` | **AURORA** — glass tier PRO/ELITE uniquement |

### Textes
| Token CSS | Valeur | Usage |
|-----------|--------|-------|
| `--text-primary` | `#EDF0F7` | Titres, valeurs importantes |
| `--text-secondary` | `#8E9AB5` | Labels, descriptions |
| `--text-tertiary` | `#5A6A85` | Metadata, timestamps, disabled |
| `--text-on-gold` | `#0F1A2E` | Texte sur fond gold |

### Signaux de marché
| Token CSS | Valeur | Usage |
|-----------|--------|-------|
| `--bullish` | `#22C55E` | Signal BUY, valeur positive |
| `--bullish-muted` | `rgba(34,197,94,0.12)` | Fond badge BUY |
| `--bearish` | `#F43F5E` | Signal SELL, valeur négative |
| `--bearish-muted` | `rgba(244,63,94,0.12)` | Fond badge SELL |
| `--neutral` | `#64748B` | Signal HOLD, neutre |
| `--neutral-muted` | `rgba(100,116,139,0.12)` | Fond badge HOLD |

### Or institutionnel — AURORA (usage restreint < 10%)
| Token CSS | Valeur | Usage |
|-----------|--------|-------|
| `--gold` | `#C9A84C` | Accent premium : focus, PRO badge, CTA hover |
| `--gold-muted` | `rgba(201,168,76,0.15)` | Fond hover éléments gold |
| `--gold-border` | `rgba(201,168,76,0.35)` | Bordure tier PRO/ELITE |

### Bordures & Interactifs
| Token CSS | Valeur | Usage |
|-----------|--------|-------|
| `--border` | `rgba(255,255,255,0.07)` | Bordures cartes standard |
| `--border-hover` | `rgba(255,255,255,0.13)` | Bordures au hover |
| `--border-focus` | `#C9A84C` | Focus ring — AURORA |

### Sémantiques
| Token CSS | Valeur | Usage |
|-----------|--------|-------|
| `--info` | `#3B82F6` | Information neutre |
| `--warning` | `#F59E0B` | Avertissement |

---

## 2. Typographie

### Principe absolu
> **JetBrains Mono est réservé aux données chiffrées uniquement** :
> prix live, PnL, % de variation, tickers Binance, volumes, timestamps précis.
> Tout le reste (headings, labels, navigation, boutons, body) utilise **Inter**.

### Stack
| Rôle | Police | Weights |
|------|--------|---------|
| UI complet | **Inter** | 400, 500, 600, 700 |
| Données chiffrées | **JetBrains Mono** | 500, 700 |

### Import
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
```

### Échelle
| Classe | Taille | Line-height | Usage |
|--------|--------|-------------|-------|
| `text-[11px]` | 11px | 1.4 | Metadata, timestamps, badges |
| `text-sm` | 13px | 1.5 | Labels secondaires, table cells |
| `text-[15px]` | 15px | 1.6 | Body principal |
| `text-lg` | 17px | 1.5 | Sous-titres, labels importants |
| `text-xl` | 20px | 1.4 | Titres de sections |
| `text-2xl` | 24px | 1.3 | Titres de pages |
| `text-3xl` | 30px | 1.2 | Hero stats, KPI principaux |

### Anti-patterns typographiques INTERDITS
- Syne, Orbitron, Exo 2, toute police display agressive
- JetBrains Mono sur labels, boutons, titres, descriptions
- `font-weight < 400` pour du texte de contenu
- `letter-spacing > 0.05em` (sauf headers en uppercase à 11px max)

---

## 3. Effets & Élévation

### Ombres (fonctionnelles, pas décoratives)
```css
--shadow-sm: 0 1px 3px rgba(0,0,0,0.4)
--shadow-md: 0 4px 12px rgba(0,0,0,0.5)
--shadow-lg: 0 8px 24px rgba(0,0,0,0.6)
```

### Glass AURORA (éléments premium uniquement)
```css
/* Tier PRO, ELITE, modale confirmation premium */
backdrop-filter: blur(16px) saturate(1.2);
background: var(--surface-glass);
border: 1px solid var(--gold-border);
```

### Transitions
```
Micro-interactions  : 150ms ease-out
Hover (color, border, opacity) : 200ms ease-out
Card hover          : translateY(-1px), 200ms (subtil — PAS -4px)
Modales / drawers   : 250ms ease-out (opacity + translateY)
Prix ticker update  : opacity flash 200ms — PAS de glow
```

### BANNI — Jamais dans IdjorTrade
```css
/* Neon crypto */
box-shadow: 0 0 20px rgba(0,255,136,...);
box-shadow: 0 0 10px rgba(0,255,136,...);
color: #00FF88;

/* Dot pattern crypto */
background-image: radial-gradient(rgba(...) 1px, transparent 1px);

/* Animations gamification */
animation: glitch, scanlines, pulse-neon;
```

---

## 4. Composants — Tokens par état

### Cartes de données (Signal, Analyse, Marché)
| État | Background | Border | Shadow |
|------|-----------|--------|--------|
| Default | `surface-high` | `border` | `shadow-sm` |
| Hover | `surface-highest` | `border-hover` | `shadow-md` |
| BUY selected | `surface-highest` | `bullish` (opacity 30%) | `shadow-md` |
| SELL selected | `surface-highest` | `bearish` (opacity 30%) | `shadow-md` |
| Disabled | `surface-mid` à 50% | `border` à 50% | aucun |

### Boutons
| Variant | Background | Texte | Hover | Focus |
|---------|-----------|-------|-------|-------|
| Primary | `bullish` | white | `bullish` 90% | ring `gold` |
| Secondary | `surface-high` | `text-primary` | `surface-highest` | ring `gold` |
| Ghost | transparent | `text-secondary` | `surface-mid` | ring `gold` |
| Danger | `bearish-muted` | `bearish` | bearish 20% | ring `bearish` |
| Gold/PRO | `gold-muted` | `gold` | `gold-muted` x2 | ring `gold` |

### Badges de signal
| Badge | Background | Texte | Border | Fonte |
|-------|-----------|-------|--------|-------|
| BUY | `bullish-muted` | `bullish` | `bullish` 20% | `font-data` |
| SELL | `bearish-muted` | `bearish` | `bearish` 20% | `font-data` |
| HOLD | `neutral-muted` | `neutral` | `neutral` 20% | Inter |

### Inputs (RiskForm, formulaires)
| État | Border | Background | Ring |
|------|--------|-----------|------|
| Default | `border` | `surface-mid` | aucun |
| Focus | `gold` (AURORA) | `surface-high` | gold 2px, offset 2px |
| Error | `bearish` | `bearish-muted` | bearish 1px |
| Disabled | `border` 30% | `surface-low` | aucun |

### Plans tarifaires
| Tier | Style | Bordure | Badge |
|------|-------|---------|-------|
| FREE | SENTINEL standard | `border` | — |
| PRO | AURORA glass | `gold-border` | "Populaire" gold |
| ELITE | AURORA glass opaque | `gold-border` épaisse | "Exclusif" gold |

### Ticker / Prix live Binance
```
Police      : JetBrains Mono (font-data) — toujours
Positif     : text bullish, transition color 300ms
Négatif     : text bearish, transition color 300ms
Stable      : text-primary
Animation   : flash opacity 0→1 sur update (200ms) — PAS de glow
```

### Tableau de signaux
```
Headers     : text-tertiary, 11px, uppercase, tracking-[0.08em], weight 500
Rows        : text-sm (13px), séparateur border 1px entre lignes
Hover row   : surface-highest background
Données num : font-data (JetBrains Mono) — prix, %, volumes
Données txt : Inter — noms d'actifs, directions, dates lisibles
```

---

## 5. Layout & Espacement

### Conteneur
```
max-width   : 1440px
padding-x   : 24px (mobile) / 32px (tablet) / 48px (desktop)
colonnes    : 12
gap         : 16px
```

### Densité SENTINEL
```
Card padding compact  : 16px
Card padding standard : 20px
Card padding spacieux : 24px
Gap entre KPIs        : 12px
Gap rows tableau      : 8px
Sidebar width         : 240px (desktop) / drawer (mobile)
Header height         : 56px
```

### Z-index
```
10  — cartes, contenus
20  — dropdowns, tooltips
30  — modales, drawers
40  — overlays backdrop
50  — notifications toast
```

---

## 6. Mode Clair (optionnel)

```css
[data-theme="light"] {
  --surface:         #F8FAFC;
  --surface-low:     #F1F5F9;
  --surface-mid:     #E9EEF6;
  --surface-high:    #FFFFFF;
  --surface-highest: #F0F4FA;
  --text-primary:    #0F172A;
  --text-secondary:  #475569;
  --text-tertiary:   #94A3B8;
  --border:          rgba(0,0,0,0.08);
  --border-hover:    rgba(0,0,0,0.14);
  /* bullish, bearish, gold : identiques aux deux modes */
}
```

---

## 7. Anti-patterns Globaux

| Interdit | Raison | Alternative |
|----------|--------|-------------|
| `#00FF88` neon vert | Crypto générique IA | `#22C55E` vert naturel |
| `glow-green`, `glow-amber` | Esthétique gaming | `shadow-md` sobre |
| `circuit-bg` dot pattern | Cliché crypto/tech | Fond uni `--surface` |
| Syne, Orbitron, Exo 2 | Display agressif | Inter |
| JetBrains Mono sur labels/titres | Lisibilité réduite | Inter |
| `translateY(-4px)` hover | Trop dramatique | `translateY(-1px)` |
| Glow coloré sur border hover | Neon = crypto | `border-hover` opacité |
| Animations > 300ms | Frustrant en trading | Max 300ms |
| > 3 couleurs accent par page | Bruit visuel | surface + bullish + bearish + gold (AURORA only) |
| Gradients arc-en-ciel / iridescent | Crypto NFT | Gradients navy linéaires subtils |
| Emojis comme icônes | Non professionnel | Lucide Icons SVG uniquement |

---

## 8. Checklist Pré-livraison

- [ ] Aucun `#00FF88` ou neon dans le code
- [ ] `font-data` uniquement sur prix, %, PnL, tickers — jamais sur labels
- [ ] Glass AURORA uniquement sur plans PRO/ELITE et modales premium
- [ ] Or (`--gold`) < 10% de la surface visuelle par page
- [ ] Tous éléments cliquables : `cursor-pointer`
- [ ] Focus ring gold visible (`outline-offset: 2px`)
- [ ] Contraste ≥ 4.5:1 WCAG AA — vérifier `text-secondary` sur `surface-high`
- [ ] `prefers-reduced-motion` respecté
- [ ] Responsive : 375px / 768px / 1024px / 1440px
- [ ] Aucun emoji (Lucide uniquement)
- [ ] Transitions ≤ 300ms
