# Overnight log

Append-only. Each autonomous pass adds a dated entry.

## 2026-08-07 — Studio canvas notes (desktop Playground)

- Representation desk chrome: `4 active` → `3 active` (matches three queue rows).
- Homepage roster: featured partner set of **6** cards (300px original size) — not a denser 26-card strip. Full roster remains on Meet the Athletes.
- Partner CTA: restored original padding + “Partner with this Athlete” label.
- Roster dots/tab counts sync from live card list (6 dots for 6 players).
- Testimonials: removed Marcus tall photo; Marcus/Denise/Jordan use Priya quote+avatar pattern. Agents Jordan tall tile kept.
- Carousel scroll: dropped end-spacer / last-card-to-start void. Embla-style `trimSnaps` — last stop fills viewport from the right; dots = unique lead stops.
- Testimonials Agents: removed Jordan T tall photo; Agents matches Company 2-col + wide quote layout.
- Agent headshots: real photos for Luke (company About), Shane (LinkedIn profile), Tony (LinkedIn welcome post crop).
- Granola-inspired plain-English homepage headings + calmer product desks (border-first, more padding, human chrome labels).
- Restored original hero + Agency Statement copy; unified marketing desks as one product suite (Deals / Performance / School offers / Schedule / Insights / Wealth) with clearer chrome titles, shared Breakdown labels, and scannable metric copy.
- Restored original Leadership heading/desc and Join (“footer”) CTA copy.
- Homepage roster: “Show all” under carousel; mobile keeps filters + carousel controls on one row (desktop placement).
- Mobile roster: All + Football stay on one line (toolbar max-content; carousel dots lose min-width padding squeeze).
- Services marketing desks: Granola-style clarity pass — chrome titles match pillar nav, one-line intros, plainer metric/ledger copy, lifestyle simplified (no icon grid), wealth defaults to NIL portfolio.
- Services copy: Notion/Granola outcome voice; restored full pillar names (Athlete Representation, School Earnings Strategy, etc.); short benefit tab descs + product-window intros.
- Marketing desks: product-UI only (no in-window marketing intros); short chrome titles (Deals / Performance / Offers / Schedule / Insights / Wealth); Representation restored to clean split pane; lifestyle concierge row back.
- Marketing desks story pass: chrome/hero/ledger copy anyone can read (athlete/parent); Representation full-width story queue (no SaaS split pane); JS tab data + lifestyle pills stay plain English on click (`playground-mkt-desks-6`).
- Testimonials mobile: restore 1-col card stack — desktop no-photo 2-col `:has()` fallback was beating mobile `grid-template-columns: 1fr` after tall photo tiles were removed (`playground-testimonials-stack-1`).
- Homepage roster mobile: Show all moves into the top controls slot; carousel arrows/dots drop under the track; dots use token gap (`--s-2`) instead of cramped 5px (`playground-roster-mobile-controls-1`).
- Roster mobile Show all: match filter-pill padding/size (`8×16` / 12px, drop 44px min-height) so it sits level with All/Football (`playground-roster-showall-pad-1`).
- Lifestyle desk icons: bare glyphs in status pills (no 14px boxed `.mkt-ico` clipping 16px SVGs); schedule tiles render at 14px (`playground-mkt-lifestyle-icons-1`).
- Homepage roster mobile: restore filters + controls on one row, Show all under carousel; cards near full-bleed (`100vw − gutters − 28px` peek) so the track fits (`playground-roster-fit-1`).
- Homepage roster mobile: hide carousel dots (arrows + swipe only) so filters and nav aren’t crowded (`playground-roster-no-dots-1`).
- Marketing desks: Performance Ready/Work/Rest each highlight a green good day; Salahadin photo+name in Performance + School Earnings chrome; log-pill icons drop clipped 14px host so glyphs aren’t boxed (`playground-mkt-athlete-tone-2`).
- Marketing desks: Salahadin chrome photo on Wealth + Technology; tech hero labels name him (no vague “his”) (`playground-mkt-athlete-chrome-3`).
- Marketing desks: Agent fee ledger amt uses `--danger`; “Up …” deltas use `line-chart-up` icon (`playground-mkt-delta-neg-1`).
- Marketing desks: trend deltas use circular up/down arrow badges (green/red) matching fintech ref (`playground-mkt-trend-badge-1`).
- Leadership headshots: recrop Shane (face/shoulders, no glitch), Tony (more headroom, no welcome logo/banner), Luke recentered; cache `lead-heads-3`.
- Leadership headshots v9: Shane chest-up (no full-body/glitch); Tony logo-free hire crop; Luke padded headroom; `object-position: center 28%` so square cards don’t clip chins (`lead-heads-10`).
- Leadership headshots: clean square LI masters (no letterbox); no scale/translate; `object-position: center`; kill purple photo-gradient under loaded portraits (`lead-heads-li-10`).
- Leadership headshots: drop CSS inset (was purple frame); bake top headroom into Luke/Shane/Tony masters like other cut-off portraits (`lead-heads-li-11`).
- Leadership headshots: seamless top-extend headroom on LI masters (full-bleed, no zoom-out mattes); kill inset; cache `lead-heads-li-13`.
- Leadership headshots: feathered top-extend + `--bg` plate under loaded portraits (no purple leak); `lead-heads-li-15`.
- Leadership headshots: cut-off fix = slight zoom-out on soft self-backdrop + `--bg-deep` plate (no purple gradient / CSS inset); `lead-heads-li-18`.
- Leadership headshots: full-bleed LI masters + ~10% feathered top headroom (no side mattes / zoom-out purple); force `background-image:none` under loaded photos; `lead-heads-li-19`.

## 2026-06-08 — Tab pill parity (mobile = desktop visual)

- Split filter pills into `button.tab` (touch shell) + `.tab-pill` (fixed 8×16 visual). Mobile 44px hit area no longer stretches the pill.
- Updated leadership, roster, index, contact-us HTML; leadership roster links in JS.
