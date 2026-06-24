# Icon System

Second Wind uses **Untitled UI Line icons** (24×24, 2px stroke) from the [Untitled UI Icons community file](https://www.figma.com/design/dgtN3K2YZRXDt0uodzWxEO/%E2%9D%96-Untitled-UI-Icons-%E2%80%93-1-100--essential-Figma-icons--Community-?node-id=1007-11868).

## Source

| Property | Value |
|---|---|
| Library | Untitled UI Icons – essential (Community) |
| Style | Line icons (`Line icons` page) |
| Canvas | 24×24 |
| Stroke | 2px, round caps/joins |
| License | Untitled UI free icon license — verify before production |

## Code usage

Icons are registered in `js/icons.js` and hydrated from `data-sw-icon` attributes:

```html
<span class="mkt-ico" data-sw-icon="plane" aria-hidden="true"></span>
```

Optional attributes:

- `data-sw-icon-size` — pixel size (default `20`)
- `data-sw-icon-class` — extra class on the `<svg>`

Programmatic render:

```js
document.querySelector('.slot').innerHTML = SW_ICONS.render('sun', { size: 16 });
SW_ICONS.hydrate(mountRoot); // re-run after injecting templates
```

## Available icons (v1)

| Token | Figma component | Node ID | Used for |
|---|---|---|---|
| `plane` | plane | 1007:11868 | Travel, flights |
| `sun` | sun | 1007:12001 | Recovery, wellness |
| `camera` | camera-01 | 1007:10924 | Brand shoots, photography |
| `announcement` | announcement-01 | 1007:10331 | Media day, press |
| `microphone` | microphone-01 | 1007:10703 | Interviews, audio |
| `video` | video-recorder | 1007:10883 | Media, content |
| `car` | car-01 | 1007:11764 | Ground transport |
| `building` | building-01 | 1007:9771 | Hotel, venue |
| `luggage` | luggage-01 | 1007:11815 | Wardrobe, packing |
| `user` | user-01 | — | Get started · tailored |
| `users` | users-01 | — | Get started · agent-matched |
| `message-chat-circle` | message-chat-circle | — | Get started · no pressure |
| `line-chart-up` | line-chart-up-01 | — | Get started · long game |

## CSS rules

- Icons inherit color via `currentColor` — parent sets `color`.
- Default display size in marketing cards: **20px** inside `.mkt-ico` (28px in `.mkt-sched-icon`).
- Do not hardcode stroke colors in SVG markup.

```css
.sw-icon,
.mkt-ico svg {
  display: block;
  width: 100%;
  height: 100%;
}
```

## Adding more icons

1. Open the Figma file → **Line icons** page.
2. Find the component (e.g. `chart-line`).
3. Export via Plugin API or copy paths into `js/icons.js` `RAW` + `META`.
4. Mirror the SVG into `assets/icons/<name>.svg` if you need a static asset.
5. Document the mapping in the table above.

## Lifestyle concierge mapping

| UI slot | Icon token |
|---|---|
| Travel chip | `plane` |
| Car logistics | `car` |
| Hotel logistics | `building` |
| Wardrobe logistics | `luggage` |
| Concierge · Travel | `plane` |
| Concierge · Media | `video` |
| Concierge · Brand | `camera` |
| Concierge · Recovery | `sun` |
| Schedule · Media day | `announcement` |
| Schedule · Campaign shoot | `camera` |
| Schedule · Recovery | `sun` |
| Schedule · Return travel | `plane` |
