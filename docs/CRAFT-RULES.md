# Craft Rules — Second Wind Pro V2

The design system codified. Every numerical decision is explicit, every rule is grounded in observable practice from landing-page references (Vercel, Linear, Wasserman, Aimé Leon Dore), and every color/font combination is verified for WCAG 2.2 AA accessibility.

If a future change would violate one of these rules, change the rule first — don't ship the violation.

---

## R01 — Typography

**Font family:** Geist Sans for everything, Geist Mono for labels/numbers/data.

### Type scale

| Token | Size | Weight | Tracking | Role |
|---|---|---|---|---|
| `--t-xs` | 11px | 500 | .18em | Mono labels only, uppercase |
| `--t-sm` | 13px | 400 | 0 | Captions, helper text (prose minimum) |
| `--t-base` | 15px | 400 | 0 | Body copy default |
| `--t-md` | 17px | 600 | -.012em | Card titles, athlete names |
| `--t-lg` | 22px | 600 | -.018em | Subsection headlines |
| `--t-xl` | 30px | 600 | -.025em | Section H2 |
| `--t-display` | clamp(46px, 8vw, 72px) | 600 | -.035em | Hero H1 |

### Rules

- **T-01.** No real italic in this system. Italic emphasis inside headlines is color-only via `<em>` styled with `color: var(--purple-bright)` and `font-style: normal`.
- **T-02.** Mono labels follow format `NN — Section Label`. Em-dash with single space each side. Two-digit number.
- **T-03.** Numeric values inside body text or stats use Geist Mono, not Geist Sans (e.g., `3,847 yds`, `$847,500`). Improves alignment and reads as "data."
- **T-04.** Weights used: 400 (regular), 500 (medium), 600 (bold). Never 700+ unless explicitly required.
- **T-05.** Minimum readable size: 11px for mono uppercase labels, 13px for any prose.

---

## R02 — Color usage

All ratios verified against `--bg` (#0d0e1a).

### Contrast table

| Token | Hex | Ratio | WCAG | Allowed roles |
|---|---|---|---|---|
| `--cream` | #f4efe6 | 16.8:1 | AAA | Primary text |
| `--purple` | #b89dff | 8.5:1 | AAA | CTA fills, badges. **Never body text.** |
| `--purple-bright` | #d4c5ff | 12.1:1 | AAA | Emphasis words, eyebrow labels |
| `--muted` | #c4bbd1 | 10.4:1 | AAA | Secondary text, paragraphs |
| `--muted-2` | #9890a3 | 6.3:1 | AA | Tertiary text (≥12px only) |
| `--success` | #86efac | 12.6:1 | AAA | "In", "Stable", "Signed" |
| `--danger` | #fca5a5 | 8.4:1 | AAA | "Out", "Portal Risk" |
| `--focus` | #ffd166 | 13.3:1 | AAA | Keyboard focus ring |

### Rules

- **C-01.** Text on any purple fill must use `--on-purple`, never `--bg`. Maintains 8.3:1 contrast against the purple regardless of where the fill appears.
- **C-02.** Semantic colors (success/danger/warning) are reserved for state and direction (In/Out/Need/Risk). Never decorative.
- **C-03.** Borders use `rgba(196,181,253,.16)` default (`--line`) and `.40` on hover (`--line-strong`). Cards never get a purple-glow shadow — borders only.
- **C-04.** No raw hex values in `style.css`. Always reference tokens. New colors must be added to `tokens.css` first.

---

## R03 — Spacing rhythm

Base unit: 4px. Scale uses tokens `--s-1` through `--s-9`.

| Token | Value | Common use |
|---|---|---|
| `--s-1` | 4px | Inner gaps (icon ↔ label) |
| `--s-2` | 8px | Bento grid gap, badge padding-x |
| `--s-3` | 12px | Stack gaps |
| `--s-4` | 16px | Card inner padding |
| `--s-5` | 22px | Section padding-inline mobile |
| `--s-6` | 32px | Section padding-inline desktop |
| `--s-7` | 48px | Section padding-block mobile |
| `--s-8` | 64px | Section padding-block desktop |
| `--s-9` | 100px | Hero padding-block, large transitions |

### Rules

- **S-01.** All margin/padding values are tokens from `--s-1` through `--s-9`. No arbitrary pixel values in component CSS.
- **S-02.** Click targets minimum 44×44px for mobile accessibility — applies to buttons, tabs, badges with click behavior.
- **S-03.** Section eyebrow → headline gap: `--s-3` (12px). Headline → body content: `--s-5` (22px). Body content → next section: `--s-8` (64px).

---

## R04 — Motion

### Durations

| Token | Duration | Use |
|---|---|---|
| `--dur-instant` | 100ms | Opacity, color (instant) |
| `--dur-fast` | 200ms | Border, background (button hover) |
| `--dur-mid` | 300ms | Transform on cards (lift) |
| `--dur-slow` | 450ms | Page section reveal on scroll |
| `--dur-hero` | 700ms | Hero entrance only |

### Easings

| Token | Curve | Use |
|---|---|---|
| `--ease-out` | cubic-bezier(.2,.7,.2,1) | Default — hover, click |
| `--ease-spring` | cubic-bezier(.16,1,.3,1) | Entrances (springy) |

### Rules

- **M-01.** Hover transform maximum: `translateY(-2px)` or `scale(1.02)`. No larger moves.
- **M-02.** Reveal pattern: fade-up via IntersectionObserver — opacity 0→1, translateY 16px→0, 450ms, ease-out. Trigger when section is 15% in view.
- **M-03.** Modal opens with `display:flex` instant, no entrance animation. Snappy is correct here — animation delays interaction.
- **M-04.** Every animation gated by `@media (prefers-reduced-motion: reduce)`. Marquee pauses. Transform transitions become opacity-only.
- **M-05.** Never animate text content (no character-by-character typewriter). Never animate the nav or primary CTAs (delays interaction).

---

## R05 — Component patterns

### Card
- bg: `--surface`
- border: 1px solid `--line`
- radius: 8–10px (`--radius-md`)
- padding: `--s-4`
- hover: border → `--line-strong`

### Button (primary)
- bg: `--purple`
- text: `--on-purple`
- padding: 13px `--s-5`
- letter-spacing: .18em
- text-transform: uppercase
- radius: 0 (squared)
- font: Geist Mono 11px medium

### Button (outline)
- transparent bg
- 1px border `--cream`
- otherwise same as primary

### Badge
- mono 9px, .18em tracking
- padding: 5px 10px
- radius: 4px (`--radius-sm`)
- variants: committed (purple fill), portal (outline), signed (green fill)

### Tab (pill — used in roster)
- radius: 100px (`--radius-pill`)
- padding: 8px 16px
- font: Geist sans 12px medium
- active: `--purple` fill, `--on-purple` text
- inactive: transparent, `--muted` text, `--line-strong` border
- `.count` inline on the same line as the label (`white-space: nowrap` on `.tab`)

### Tab (horizontal underline — used in brand)
- font: Geist sans 13px medium
- padding: 12px 0
- right margin: 28px between tabs
- active: `--purple-bright` color, 2px `--purple` underline below
- inactive: `--muted-2` color, no underline

### Modal
- backdrop: `rgba(8,9,18,.7)` with 4px blur
- container: `--surface`, 1px `--line-strong`, 12px radius, 480-560px max width
- padding: `--s-6`
- close: × in 28px circle, top-right
- dismiss: backdrop click, × button, Escape key

### Connector arrows (transfer wire)
- CSS triangle: 7px point, 5px transparent border for height
- Line: 14-16px width, 1.5px height
- Color: `--danger` for "out" (red, leftward), `--success` for "in" (green, rightward)
- Caption: mono 8px, .22em tracking, uppercase, matching color
- Caption positioned directly under arrow

### Rules

- **P-01.** Cards always have a 1px border. Never use a shadow as the primary depth cue on dark mode — borders read cleaner.
- **P-02.** Primary buttons are squared (radius 0). Secondary nav and tab elements are pill (radius 100px). Don't mix.
- **P-03.** Roster card hierarchy: photo → name → position/year → View Stats link → Partner With Athlete button. Stats live in modal, not on the card.
- **P-04.** Transfer wire row: 50px photo · 120-140px identity column · 1fr flow with dual arrows · auto badge. School names sit flat (no boxes). Clicking the row opens the same modal as roster "View Stats" with the addition of the Movement section + Signed date.

---

## R06 — Content rules

- **W-01.** Primary CTA is always **Get Started**. Secondary verbs allowed: **View Roster**, **Speak With an Agent**, **Contact Us**, **Launch Campaign**. Never: Apply, Learn More, Click Here.
- **W-02.** Headlines: sentence case, one emphasis word in `--purple-bright` via `<em>`, period for declarative sentences. Example: *The modern athlete's **NIL** agency.*
- **W-03.** Eyebrow format: `NN — Section Label`. Two-digit number, em-dash, label in title case.
- **W-04.** Numbers: currency uses full digits with commas (`$847,500`, not `$847K`) unless space-constrained. Percentages always one decimal (`18.4%`).
- **W-05.** Athlete card always shows: name, position · class/year. Stats live in modal. No exceptions.
- **W-06.** Transfer wire badges: "Committed" (HS → college signing), "Portal Move" (transfer), "Signed" (pro contract or major signing).

---

## Reference grounding

Each section above is informed by observable practice from these references:

| Reference | What we borrowed |
|---|---|
| **Vercel** | Geist weight assignments, bento with purpose-built visuals, motion timing constants, hover transform ceiling |
| **Linear** | Restrained transitions (.2–.3s), border-only depth on dark mode |
| **Wasserman** | Latest signings as a wire/strip on home, athlete grid with hover reveals |
| **Aimé Leon Dore** | Restraint — generous negative space, no decorative italic, large gutters |
| **The Players' Tribune** | Athlete-first framing (people, not products) |
| **Athletes First** | Roster-as-centerpiece composition |

Full Phase 01 references and Phase 02 pattern extraction are in the chat record from the design pass. If you want them documented in the repo, they can be added as `REFERENCES.md`.

---

## Open questions for stakeholder review

These weren't resolved in the design pass and are flagged for the C-stakeholders before extending:

1. **Refero P04 (Brand pitch proof)** — Should each segmented brand offering show one stat ("$2.4M activated", "180 events / yr") + partner logos in the right panel? Currently it shows a decorative glyph. Deferred.
2. **Roster card "View Stats" copy** — Currently underlined link. Stakeholders may prefer a chevron, an icon button, or stats-inline. The card slot has room either way.
3. **Hero video content direction** — Brief was "athlete-representation focused." Specific shot list deferred to production.
