# samarqandsweets.com

Marketing site for **شركة سمرقند للسكاكر وتوزيع الشوكولاتة** (Samarqand Candy & Chocolate
Distribution) — Amman, Jordan. Static, no build step, served by GitHub Pages at
`www.samarqandsweets.com` (see `CNAME`).

```
index.html          the whole site — markup, tokens, styles and behaviour
events.json         the trade-show calendar (edit this to change what the site says)
assets/events.js    pure event logic (status, featured show, ordering, .ics) — no DOM
assets/ig/          Instagram post artwork, WebP, three widths; _colors.json = sampled colours
assets/             logo + catalogue product photography
tests/events.test.mjs
samarqand-catalog.pdf
```

Preview over HTTP (`python -m http.server 5178`); opening from `file://` blocks the module script
and the `events.json` fetch. Run `node tests/events.test.mjs` before pushing — it exits non-zero
on any failure.

## The event calendar

The site changes itself around the shows Samarqand attends. `events.json` is the only input:

| field | meaning |
|---|---|
| `start`, `end` | ISO dates, inclusive, in the event's own `timezone` (`null` both for TBA) |
| `attending` | **only `true` when Samarqand is really exhibiting.** This is what promotes an event to the header bar, the hero pill and the featured card. Never set it for "interesting" shows. |
| `booth` | stand number, shown only when set |
| `accent` | one of `teal orange coral yellow mint pink` — the featured card takes that brand fill |
| `confidence` | `verified` (checked on the organiser's site) or `unverified` (badge shown) |
| `hours_ar` / `hours_en` | optional opening-hours line |

Behaviour: a **live** attended show wins; otherwise the soonest attended show opening within
45 days gets a countdown. "Live" is decided on the calendar day in the event's time zone, so a
Riyadh show opens at Riyadh midnight, not the visitor's. Past shows drop into a collapsed
"معارض سابقة" list. Preview any date with `?now=YYYY-MM-DD`
(e.g. `/?now=2026-09-28` shows live mode for the Saudi Food Show).

Dates in `events.json` come from organiser sites; the `source_url` on each entry is where to
re-check. Do not guess dates — mark them `unverified` or leave them `null`.

## Brand

Colours and personality follow **`قايد لاين سمرقند`** (July 2026), the current brand guideline in
Google Drive under *05 - Brand, Design and Marketing*. An older 2024 guideline in the same folder
specifies a chocolate/gold palette and is **superseded** — do not design from it.

The guideline forbids altering the primary colours, so every brand fill in `:root` is exactly the
approved value. Because those fills are light and saturated, **white text fails WCAG AA on all of
them**; the site therefore puts ink `#3A2E2A` on brand fills, and where a brand colour has to carry
text it uses a darker shade of the *same* hue (`--orange-text`, `--teal-text`, `--teal-solid`,
`--orange-deep`, `--wa-solid`). Each of those carries its measured contrast ratio in a comment.
Keep that arrangement when editing: change a fill and the text on it needs re-checking.

The brand-story section colours (`--bg` on each `.sp` panel) are sampled from the Instagram post
borders and lightened in the same hue until ink reaches ≥4.6:1. They are not brand tokens.

## Things that will bite you

- **Arabic + numbers.** Phone numbers, years and stat figures use `.num` / `.tel`
  (`direction:ltr; unicode-bidi:isolate; tabular-nums`). Without the isolation, bidi reorders them.
  Dates are formatted with `ar-u-nu-latn` so digits stay Western.
- **No flag emoji.** Windows ships no flag glyphs, so `🇯🇴` renders as the letters `JO`. The
  country flags are inline SVG `<symbol>`s in the sprite at the top of `<body>`; add a symbol
  *and* the code to `FLAGGED` when a new country appears in `events.json`.
- **Hero motion is direction-aware.** Cards drift *outward*, which is `+x` for the inline-end
  side in RTL and the reverse in LTR; `--dir` flips per `dir` and every transform multiplies by it.
  Scroll-driven animation is inside `@supports (animation-timeline: scroll())` — browsers without
  it get the static composition, not a broken one.
- **The brand story uses two layouts.** ≥900px: sticky image stack + one background that morphs
  per panel (IntersectionObserver with a `-45%` root margin picks the panel in the middle of the
  viewport). <900px: each panel is its own colour band with its own image, no sticky.
- **Reveal-on-scroll is progressive enhancement.** `[data-reveal]` is only hidden under `.js`,
  which an inline `<head>` script adds, and a 2.5s timer reveals anything the IntersectionObserver
  missed. Remove either and a backgrounded tab or a script error can leave the page blank.
- **Copy lives in `I18N`**, not in the markup — the Arabic in the HTML is only the pre-JS fallback.
  Edit both, or edit `I18N` and mirror it.
- `7+` countries counts **exports**; Jordan is the domestic market and is not one of them.
