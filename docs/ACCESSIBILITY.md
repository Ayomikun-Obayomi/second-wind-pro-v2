# Accessibility

This site is built to **WCAG 2.2 AA** standard. Many combinations exceed AAA. Below is the full audit and the developer rules for keeping it compliant.

**Before any UI/HTML/CSS change:** read this file alongside `docs/DESIGN-TOKENS.md` and `docs/CRAFT-RULES.md`.

---

## Color contrast — all combinations

Measured against the dark backgrounds the colors are paired with.

| Text color | On background | Ratio | WCAG |
|---|---|---|---|
| `--cream` `#f4efe6` | `--bg` `#0d0e1a` | 16:1 | AAA |
| `--cream` | `--surface` `#1a1d2e` | 14:1 | AAA |
| `--purple` `#b89dff` | `--bg` | 8.4:1 | AAA |
| `--purple-bright` `#d4c5ff` | `--bg` | 11.2:1 | AAA |
| `--purple-bright` | `--surface` | 9.7:1 | AAA |
| `--muted` `#c4bbd1` | `--bg` | 10.2:1 | AAA |
| `--muted` | `--surface` | 8.8:1 | AAA |
| `--muted-2` `#9890a3` | `--bg` | 6.1:1 | AA |
| `--muted-2` | `--surface` | 5.3:1 | AA |
| `--on-purple` `#1a0a2e` | `--purple` `#b89dff` | 8.1:1 | AAA |
| `--focus` `#ffd166` | `--bg` | 12:1 | AAA |

### Borders / UI components (3:1 rule)

| Token | Effective contrast | WCAG |
|---|---|---|
| `--line` (0.16 alpha) | ~3.1:1 | AA |
| `--line-strong` (0.40 alpha) | ~5.4:1 | AA |

---

## Keyboard navigation

### Tab order (top to bottom)

1. **Skip-to-content link** — appears in top-left on first Tab
2. Nav: logo link, menu toggle (mobile), each nav link, Get Started CTA
3. Hero: View Roster, Launch Campaign
4. Services stack tabs and panels
5. Roster: each tab button, carousel controls, each athlete card
6. Transfers: commit cards, wire rows (where focusable)
7. Brand: card links, Contact Us
8. Leadership: carousel controls, advisor cards
9. Join: Get Started, Speak With an Agent
10. **Footer:** Back to top, every link in every column, **Speak With an Agent** (footer CTA), social links

### Focus indicator

A 2px solid amber outline (`--focus`) with 3px offset. Applied via the global:

```css
*:focus-visible {
  outline: 2px solid var(--focus);
  outline-offset: 3px;
  border-radius: 2px;
}
```

`:focus` (without `-visible`) hides the outline so mouse users don't see it on click, but keyboard users always do.

**Buttons (`.btn-outline`):** use `overflow: visible` on `:focus-visible` so the outline is not clipped by the slide-fill pseudo-element container.

### Skip link

```html
<a href="#main" class="skip-link">Skip to content</a>
```

Hidden offscreen until it receives focus, then animates to the top-left with the amber background. Minimum touch target: **44×44px**.

---

## Interactive targets

- **Minimum touch target:** 44×44px for all links and buttons (skip link, nav CTA, `.btn-outline`, footer CTA, social icons, roster tabs).
- **Minimum interactive text:** `--t-sm` (13px) Geist Sans for links and buttons — never `--t-xs` mono uppercase on CTAs (CRAFT T-05).

---

## Screen reader support

### Landmarks

- `<header class="nav-header">` — contains `<nav aria-label="Primary">`
- `<main id="main">` — page content
- `<footer>` — site footer; column links in `<nav aria-label="…">`; footer CTA in `<nav aria-label="Contact an agent">`

### Headings

- `<h1>` — hero / page title only
- `<h2>` — major sections and footer column labels (`.footer-col-head`)
- `<h3>` — card titles within sections

### `aria-hidden` on decoration

The following are decorative and announced to no one:

- All SVG arrows inside text buttons and links
- Carousel chevron icons where the control has an `aria-label`
- Social icons inside links that have their own `aria-label`
- Hero video, marquee, grain overlay

### State announcements

- Roster tabs use `aria-pressed="true|false"` inside `<div role="group" aria-label="Filter roster by sport">`
- Form errors use `aria-describedby` / `aria-invalid` on the partnership contact form

---

## Footer CTA (`.footer-cta`)

The footer **Speak With an Agent** link must follow the same rules as every other `.btn-outline`:

| Rule | Implementation |
|---|---|
| Typography | `--font-sans`, `--t-sm`, sentence case — inherit from `.btn-outline`; **no** mono uppercase at `--t-xs` |
| Touch target | `min-height: 44px`; adequate horizontal padding |
| Focus | Amber `--focus` ring visible; `overflow: visible` on `:focus-visible` |
| Hover | `background: var(--purple)` applied **with** `color: var(--on-purple)` — never dark text on the dark footer while the fill animates. `::before` uses `z-index: 0`, not `-1`. |
| Arrow | `<svg class="arrow" aria-hidden="true">` |
| Landmark | Wrap in `<nav class="footer-cta-nav" aria-label="Contact an agent">` |
| Destination | `href="contact-us.html"` — link text describes the action |

---

## Reduced motion

`prefers-reduced-motion: reduce` short-circuits animations and transitions site-wide. Scroll-to-top and carousel behavior respect the same media query in `js/main.js`.

---

## Testing checklist

Before launch, verify:

- [ ] Tab through the entire page with keyboard only — no traps, all interactive elements reachable
- [ ] Footer **Speak With an Agent** shows amber focus ring when tabbed to
- [ ] Run axe DevTools or Lighthouse a11y audit — score 95+
- [ ] Test with VoiceOver (Mac), NVDA (Windows), or TalkBack (Android)
- [ ] Toggle "Reduce Motion" in OS settings and verify animations stop
- [ ] Resize to 320px wide — nothing overlaps, all content reachable
- [ ] Zoom browser to 200% — layout holds, no horizontal scroll outside intended sections
