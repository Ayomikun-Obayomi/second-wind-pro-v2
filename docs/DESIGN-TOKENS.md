# Design Tokens

All tokens are defined in `css/tokens.css` as CSS custom properties on `:root`. Consume via `var(--token-name)` — never use raw hex values in component styles.

---

## Color tokens

### Surfaces

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0d0e1a` | Page background, default canvas |
| `--bg-deep` | `#080912` | Deepest surface (footer, marquee strip) |
| `--bg-mid` | `#15172a` | Hero gradient mid-tone |
| `--surface` | `#1a1d2e` | Default card surface |
| `--surface-2` | `#232539` | Secondary surface |
| `--surface-sub` | `#15172a` | Modal stat cells, nested panels |

### Borders

| Token | Value | Usage |
|---|---|---|
| `--line` | `rgba(196, 181, 253, 0.16)` | Default dividers, card borders |
| `--line-strong` | `rgba(196, 181, 253, 0.40)` | Emphasized borders, tag pills |

### Purple system

| Token | Value | Usage |
|---|---|---|
| `--purple` | `#b89dff` | Primary CTA fills, active tabs |
| `--purple-bright` | `#d4c5ff` | Accent text, italic display words, partner CTA fill |
| `--purple-deep` | `#6d28d9` | Decorative gradients only |
| `--purple-glow` | `rgba(184, 157, 255, 0.45)` | Glow effects |

### Text

| Token | Value | Usage |
|---|---|---|
| `--cream` | `#f4efe6` | Primary text, headings, ghost button borders |
| `--muted` | `#c4bbd1` | Body copy, secondary text |
| `--muted-2` | `#9890a3` | Tertiary text, captions |
| `--on-purple` | `#1a0a2e` | Text on purple or cream button fills |

### Semantic

| Token | Value | Usage |
|---|---|---|
| `--success` | `#86efac` | Positive indicators |
| `--danger` | `#fca5a5` | Live badges, risk states |
| `--focus` | `#ffd166` | `:focus-visible` outline |

---

## Typography

| Token | Stack / Value |
|---|---|
| `--font-sans` | `'Geist', system-ui, sans-serif` |
| `--font-mono` | `'Geist Mono', ui-monospace, monospace` |
| `--t-xs` | `11px` — mono labels, eyebrows |
| `--t-sm` | `13px` — nav links, section/partner CTAs, small body |
| `--t-base` | `15px` — body copy |
| `--t-display` | `clamp(46px, 8vw, 72px)` — hero headline |

**Conventions:** Form labels / eyebrows use `--font-mono`, uppercase, wide letter-spacing. Section CTAs (`.btn-outline`) use `--btn-font` → `--font-sans` (Geist), sentence case, padding `--btn-padding-*` → `14px` / `26px`. Partner buttons share section primary size/colors (`--t-sm`, `--btn-radius`) with compact padding (`--partner-btn-padding-*` → `9px` / `16px`) and Geist sans labels. Headlines use `--font-sans` (bold). Display italics use `--purple-bright`.

---

## Spacing

| Token | Value |
|---|---|
| `--s-1` | `4px` |
| `--s-2` | `8px` |
| `--s-3` | `12px` |
| `--s-4` | `16px` |
| `--s-5` | `22px` |
| `--s-6` | `32px` |
| `--s-7` | `48px` |
| `--s-8` | `64px` |
| `--s-9` | `100px` |

---

## Radius

| Token | Value | Usage |
|---|---|---|
| `--radius-sm` | `4px` | Tags, small chips, **section CTAs** (`.btn-outline`) |
| `--radius-md` | `8px` | Modal cells, inputs |
| `--radius-lg` | `12px` | Cards |
| `--radius-pill` | `100px` | Sport filter tabs |
| `--nested-r-inner` | `4px` (`--radius-sm`) | Inner radius in concentric nested corners |
| `--nested-r-pad-y` | `8px` (`--s-2`) | Vertical padding between inner child and outer card |
| `--nested-r-outer` | `12px` (`--radius-lg`) | Outer card radius when corner-nested |

> **Nested corners:** Inner (the current border radii) + Padding (vertical) = outer the final border radii of the card. See `.cursor/rules/nested-border-radius.mdc`.

> **Section CTAs** (`.btn-outline`, `.btn-outline.btn-primary`), Partner CTAs, and Nav CTA use **`--btn-radius`** → `var(--radius-sm)` (4px).

---

## Motion

| Token | Value | Usage |
|---|---|---|
| `--dur-fast` | `200ms` | Hover color shifts (buttons, links) |
| `--dur-slow` | `450ms` | Arrow nudge on secondary hover |
| `--ease-out` | `cubic-bezier(0.2, 0.7, 0.2, 1)` | Default easing |

---

## Buttons (section CTAs)

Tokens: `--btn-font`, `--btn-padding-y` (`14px`), `--btn-padding-x` (`26px`), `--btn-gap`, `--btn-letter-spacing`, `--btn-radius` (`var(--radius-sm)` / 4px).

| Token | Maps to | Role |
|---|---|---|
| `--btn-font` | `--font-sans` (`Geist`) | Label font for `.btn-outline`, `.partner-btn`, and partner CTAs — **not** Geist Mono |
| `--btn-padding-y` / `-x` | `14px` / `26px` | Padding for section CTAs (`.btn-outline` / `.btn-primary`) |
| `--btn-secondary-border` | `--line-strong` | Secondary default outline |
| `--btn-secondary-text` | `--cream` | Secondary default label + arrow |
| `--btn-secondary-hover-border` | `--purple` | Secondary hover outline (lilac) |
| `--btn-secondary-hover-text` | `--purple` | Secondary hover label + arrow |
| `--btn-primary-bg` | `--purple` | Primary fill |
| `--btn-primary-text` | `--on-purple` | Primary label |
| `--btn-primary-hover-bg` | `--purple-bright` | Primary hover fill |
| `--btn-focus-ring` | `--focus` | Gold `:focus-visible` ring |

**Focus (all buttons):** `2px solid var(--btn-focus-ring)`, `3px` offset — distinct from purple hover. Focus does not apply hover fill.

### `.btn-outline` — secondary (soft outline)

- Default: transparent fill; `var(--btn-secondary-border)` outline; `var(--btn-secondary-text)` label and arrow
- Hover: stays transparent; outline and label shift to lilac (`var(--btn-secondary-hover-border)` / `var(--btn-secondary-hover-text)`); arrow nudges up-right
- Examples: **Launch Campaign**, **Speak With an Agent**

```html
<a href="#" class="btn-outline">
  <span class="btn-label">Launch Campaign</span>
  <svg class="arrow" viewBox="0 0 14 14" aria-hidden="true">...</svg>
</a>
```

### `.btn-outline.btn-primary` — primary (solid lilac)

- Default: `var(--btn-primary-bg)` fill, `var(--btn-primary-text)` label, matching border, `--btn-radius`
- Hover: `var(--btn-primary-hover-bg)` fill
- Examples: **View Roster**, **Get Started**, **Contact Us**

```html
<a href="#roster" class="btn-outline btn-primary">
  <span class="btn-label">View Roster</span>
  <svg class="arrow" viewBox="0 0 14 14" aria-hidden="true">...</svg>
</a>
```

### Nav CTA (`.nav-cta`)

Header **Get Started** — same primary color family (`--btn-primary-*`) and type (`--btn-font`, `--t-sm`, sentence case), but **compact padding** (`--partner-btn-padding-*` → `9px` / `16px`) so the header stays dense. In-page / section **Get Started** uses `.btn-outline.btn-primary` at `--btn-padding-*` (`14px` / `26px`).

### Partner CTA (`.partner-btn`)

Roster / meet-the-athletes **Partner with this athlete** / **Read more** (and athlete profile magazine CTA) share **section primary color**; padding stays compact and is **not** aliased to section `--btn-padding-*`.

| Token | Maps to | Role |
|---|---|---|
| `--partner-btn-bg` | `--btn-primary-bg` → `--purple` | Default fill |
| `--partner-btn-text` | `--btn-primary-text` → `--on-purple` | Default / hover label |
| `--partner-btn-hover-bg` | `--btn-primary-hover-bg` → `--purple-bright` | Hover fill |
| `--partner-btn-hover-text` | `--btn-primary-text` → `--on-purple` | Hover label |
| `--partner-btn-font` | `--btn-font` → `--font-sans` (`Geist`) | Proportional sans — **not** mono |
| `--partner-btn-font-size` | `--t-sm` (`13px`) | Same as section CTAs |
| `--partner-btn-font-weight` | `--fw-medium` (`500`) | Medium |
| `--partner-btn-letter-spacing` | `0.02em` | Title-case tracking |
| `--partner-btn-radius` | `--btn-radius` → `--radius-sm` (`4px`) | Same as section CTAs / nested cards |
| `--partner-btn-padding-y` / `-x` | `9px` / `16px` | Explicit compact padding (not aliased to `--btn-padding-*`) |

**States:** Default = lilac (`--purple`); hover = bright lilac (`--purple-bright`); text stays `--on-purple`. Same as `.btn-outline.btn-primary`. Focus: `2px solid var(--btn-focus-ring)` with `3px` offset. **Casing:** Partner / Read more stay `text-transform: uppercase`; section primaries stay sentence case.

---

## Icons

Untitled UI **Line icons** (24×24, `currentColor`, 2px stroke). Full registry, Figma node IDs, and usage: **`docs/ICONS.md`**.

| Token | Role |
|---|---|
| `plane` | Travel / flights |
| `sun` | Recovery / wellness |
| `camera` | Brand shoots |
| `announcement` | Media / press |
| `video` | Content / media |
| `car` | Ground transport |
| `building` | Hotel / venue |
| `luggage` | Wardrobe / packing |

---

## Layout

| Token | Value |
|---|---|
| `--container` | `1400px` |
| `--gutter` | `40px` |
| `--gutter-mobile` | `22px` |

---

## Form inputs

Used on `contact-us.html` and any future inquiry forms. Spec mirrors CRAFT **R05 Card** + **Tab pill**.

| Element | Tokens / pattern |
|---|---|
| Label (`.form-label`) | `--font-mono`, `--t-xs`, `0.18em` letter-spacing, uppercase, `--muted-2`, `--fw-medium` |
| Hint / error | `--t-sm`; hint `--muted-2`, error `--danger` |
| Text field (`.form-input`) | `--font-sans`, `--t-base`, `--cream`; bg `--bg-mid`; border `--line`; radius `--radius-md`; padding `--s-3` `--s-4` |
| Focus | border `--purple-bright`; ring `0 0 0 3px var(--purple-glow)` |
| Sport multi-select | Native checkboxes + visible **`.tab`** pill (same as roster `.tab` / `.tab.active`) |
| Form card | Same as Card: `--surface`, `1px solid var(--line)`, `--radius-md`, padding `--s-5`–`--s-6` |
