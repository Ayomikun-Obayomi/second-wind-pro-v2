# Overnight queue

Agent: pick the **first unchecked** item per run. Keep items small (one pillar, one section, or one CSS fix).

## Services & market viz

- [ ] Athlete Representation (`svc-vis-0`): align to Ramp desk — hero, queue row, deal pane, one-line status
- [ ] Lifestyle (`svc-vis-3`): verify concierge row order (travel → concierge → schedule); tighten copy
- [ ] Technology (`svc-vis-4`): add sparkline or index chip above alloc if it clarifies trend without animation
- [ ] Wealth (`svc-vis-5`): shorten any wrapping status `strong` text; verify all stage tabs update alloc labels
- [ ] School Earnings (`svc-vis-2`): school row amounts align with alloc bars on every offer click

## Layout & responsive

- [ ] Services stack @ 1600×832: nav + visual vertical alignment audit
- [ ] Services stack @ 390×844: accordion tab labels, visual aspect ratio, scroll-into-view on tab
- [ ] Roster carousel: touch scroll and dot sync on mobile

## Craft & a11y

- [ ] Pass: no raw hex in `css/style.css` outside tokens
- [ ] Pass: focus-visible on all interactive `.mkt` tabs and ledger rows
- [ ] Pass: `prefers-reduced-motion` disables services parallax and section reveals

## Copy

- [ ] Performance panel status lines stay one line on all three tabs
- [ ] Technology feed row amounts right-align with tabular nums
