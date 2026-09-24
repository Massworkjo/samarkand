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

## The event feature

The site changes itself around the shows Samarqand attends — and shows **nothing else**. The
full calendar list (filters, month groups, past shows) was removed on 2026-09-24 at the owner's
request ("not the nicest"); the data stays in `events.json` because the featured-show logic reads
it. `events.json` is the only input:

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
Riyadh show opens at Riyadh midnight, not the visitor's. When nothing qualifies, the header
bar, hero pill, the "وين تلاقونا" section and its nav links all hide. Preview any date with
`?now=YYYY-MM-DD` (e.g. `/?now=2026-09-28` shows live mode; `/?now=2026-12-01` shows the
site with no show).

Dates in `events.json` come from organiser sites; the `source_url` on each entry is where to
re-check. Do not guess dates — mark them `unverified` or leave them `null`.

## Brand

Colours and personality follow **`قايد لاين سمرقند`** (July 2026), the current brand guideline in
Google Drive under *05 - Brand, Design and Marketing*. An older 2024 guideline in the same folder
specifies a chocolate/gold palette and is **superseded** — do not design from it.

The guideline forbids altering the primary colours, so the seven fills in `:root` are exactly the
approved values and **nothing else is used as a surface colour**. Three rules follow from that:

1. **Text is one ink, `#1F2D2B`.** Every brand colour is too light to be text on cream or white
   (none reaches 3:1, even at headline size), and darker "same-hue" shades read as muddy — the
   owner rejected them on 2026-09-23. `--muted` (`#465755`) is allowed only on cream, white, mint
   and yellow; sections on the stronger fills reset it to ink via `[data-bg]`.
2. **Brand colours become type only on the dark footer**, where each one passes ≥5:1 on ink.
3. **The page background is the palette.** `body` paints `--page`; every block with `data-bg`
   hands its colour to the page when it crosses the middle of the viewport, and the two fixed
   colour fields (`.blobs`) take the previous and next block's colours. Add a section by giving
   it `data-bg="<token>"` — never a `background` of its own.

Typography follows the guideline's own weight: Almarai 300/400 for text, Baloo Bhaijaan 2 at
**500** for Arabic display (600 nowhere), Jost 300 tracked caps for Latin names and numbers (the
Stylus BT feel). Bold is reserved for nothing; hierarchy comes from size and space.

`assets/pattern.webp` is the logo pattern from the guideline, cut to its 288×276 repeat with the
white made transparent; it drifts behind the hero and footer. The brush-stroke section labels are
the `#brush` symbol filled with a brand colour.

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
- The export-countries stat counts `MK_NOW` **minus Jordan** (domestic). Moving a country from
  `MK_SOON` to `MK_NOW` means updating the stat and the schema.org `areaServed` too.
- Choco Break leads the brand story because it is the company's #1 seller (owner, 2026-09-24).
