# V2 Assets

### Icons (Untitled UI Line)
- **Registry:** `js/icons.js` — `SW_ICONS.render('plane')` / `data-sw-icon="plane"`
- **Docs:** `docs/ICONS.md`
- **Source:** [Untitled UI Icons (Figma Community)](https://www.figma.com/design/dgtN3K2YZRXDt0uodzWxEO/%E2%9D%96-Untitled-UI-Icons-%E2%80%93-1-100--essential-Figma-icons--Community-?node-id=1007-11868)
- **Static exports:** `assets/icons/` (optional SVG mirrors)

### Brand logo
- **File:** `logo-white.png` — white wordmark for nav and footer (300×132)

The site references `assets/hero.mp4` which doesn't exist yet — the CSS gradient fallback runs underneath so the hero never looks broken.

## What to source before production

### Hero video (priority 1)
- **File:** `hero.mp4` (+ `hero.webm` for smaller fallback, `hero-poster.jpg` for slow connections)
- **Content:** Athlete-representation focused. Training intensity, locker room ambient, contract signing moments. Avoid recognizable faces unless rights cleared.
- **Specs:** 1920×1080 minimum, 15–25s seamless loop, muted, H.264 MP4 + WebM

### Athlete photography
- **Files:** `assets/portraits/athletes/{slug}.jpg` (demo placeholders — replace before production)
- **Agents / founder:** `assets/portraits/agents/{id}.jpg`
- **Regenerate:** `node scripts/download-portraits.mjs --force`
- **Sources (demo):** Curated Pexels/Unsplash — athletes use sports imagery; agents use professional headshots
- **Specs (production):** 800×1000 minimum (4:5 aspect), editorial / action style, consistent color grade

### School logos
- **Files:** `schools/texas.svg`, `ohio-state.svg`, `duke.svg`, etc.
- **Note:** Licensing may apply — university marks need clearance

### Favicons + OG image
- `favicon.svg`, `apple-touch-icon.png` (180×180), `og-image.jpg` (1200×630)

### Fonts (optional self-host)
Currently loaded from Google Fonts. For better performance, download Geist + Geist Mono from https://vercel.com/font and serve locally.

## Update the JS data when assets land

Real implementation pulls from a CMS instead of the hardcoded `ATHLETES` object in `js/main.js`. The structure is:

```js
{
  'athlete-slug': {
    name: 'Full Name',
    position: 'Pos · Class of YYYY',
    photo: 'ML',              // or 'photos/marcus-lane.jpg' once real
    basketball: false,        // sport flag for the gradient class
    agent: 'Agent Name',
    stats: [['3,847', 'Pass yds'], ...],
    from: { name, logo, color },  // transfer source (optional)
    to:   { name, logo, color },  // transfer dest (optional)
    signed: 'Month Day, YYYY'
  }
}
```
