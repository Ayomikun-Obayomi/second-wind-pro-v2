# Second Wind Pro — V2

Marketing site for Second Wind Pro: athlete-first NIL representation, brand partnerships, and university consulting.

## Stack

- Static HTML/CSS/JS (no framework)
- Design tokens in `css/tokens.css`
- Page build script: `node scripts/build-pages.mjs`
- Deploy target: Netlify (`publish = "."`)

## Local development

```bash
# Rebuild inner pages from snippets after editing scripts/snippets/*
node scripts/build-pages.mjs

# Preferred: local server with pretty /athlete/:slug rewrites
npm run dev

# Also fine: plain static server (athlete links use athlete.html?athlete=…)
npx serve .
```

Athlete profile links use relative `athlete.html?athlete={slug}` so they work under Studio (`/playground/…`), plain static servers, and Netlify. Pretty `/athlete/:slug` URLs still resolve via `_redirects` (Netlify) or `npm run dev`.

## Pages

| Page | Source |
|------|--------|
| `index.html` | Landing (sections restored via build script) |
| `about.html` | `scripts/snippets/about-main.html` |
| `get-started.html` | `scripts/snippets/get-started-main.html` |
| `athlete.html` | `scripts/snippets/athlete-profile-main.html` + `js/athlete-magazine-data.js` |
| Other pages | Extracted from `index.html` sections in `scripts/build-pages.mjs` |

## V2 highlights

- Redesigned About, Get Started (3-step intake), and athlete magazine profiles
- Shared design system: `page-intro`, `section-head`, `brand-cards`, `agency` blocks
- Untitled UI icon paths in `js/icons.js`
