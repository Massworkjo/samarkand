# samarqandsweets.com

Marketing site for **شركة سمرقند للسكاكر وتوزيع الشوكولاتة** (Samarqand Candy & Chocolate
Distribution) — Amman, Jordan. Static, no build step, served by GitHub Pages at
`www.samarqandsweets.com` (see `CNAME`).

```
index.html   the whole site — markup, tokens, styles and behaviour
assets/      logo + catalogue product photography
samarqand-catalog.pdf
```

Open `index.html` over HTTP to preview (`python -m http.server 5178`); opening it from `file://`
will not load the assets.

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

## Things that will bite you

- **Arabic + numbers.** Phone numbers, years and stat figures use `.num` / `.tel`
  (`direction:ltr; unicode-bidi:isolate; tabular-nums`). Without the isolation, bidi reorders them.
- **No flag emoji.** Windows ships no flag glyphs, so `🇯🇴` renders as the letters `JO`. The
  country flags are inline SVG `<symbol>`s in the sprite at the top of `<body>`.
- **The conveyor is direction-aware.** The track is anchored to the inline-start edge, so it
  animates `-50%` in LTR and `+50%` in RTL (`belt` / `belt-rtl`). One direction for both leaves the
  strip empty in Arabic. Spacing uses a margin on each figure, not flex `gap`, so the two halves
  are exactly equal and the loop does not jump.
- **Reveal-on-scroll is progressive enhancement.** `[data-reveal]` is only hidden under `.js`,
  which an inline `<head>` script adds, and a 2.5s timer reveals anything the IntersectionObserver
  missed. Remove either and a backgrounded tab or a script error can leave the page blank.
- **Copy lives in `I18N`**, not in the markup — the Arabic in the HTML is only the pre-JS fallback.
  Edit both, or edit `I18N` and mirror it.
- `7+` countries counts **exports**; Jordan is the domestic market and is not one of them.
