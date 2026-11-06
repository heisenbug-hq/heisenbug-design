Heisenbug icons v1.1.0 (adds the menu icon and the not-planned status glyph) (2026-10-31)

Contents
  icons/            67 Lucide icons (v1.66.0, ISC licence), 24 px grid, currentColor
  status/           the six status glyphs: open, in-progress, fixed, duplicate, not-planned, pending
  sprite.svg        all of the above as <symbol id="hb-NAME"> and <symbol id="hb-status-ID">
  icon.mjs          helper that renders an icon at 16, 20 or 24 px with the standard stroke
  manifest.json     names by group and the rules, machine readable
  LICENSE-lucide.txt

Colours
  The pack shipped a tokens/status-colors.css file. It duplicated the status colours in the
  DESIGN.md front matter (same values, different variable names), so it was removed: DESIGN.md is
  the only token source. Colour the glyphs with the variables in @heisenbughq/design/tokens.css:
  --hb-color-status-open, --hb-color-status-in-progress, --hb-color-status-fixed and
  --hb-color-status-neutral (Duplicate, Not planned and Waiting). manifest.json names the variable
  for each glyph.

The rules
  1. One set: Lucide, pinned at v1.66.0. No other icon sets, no hand-drawn icons.
  2. Render at 16, 20 or 24 px only. Stroke is 1.5 rendered px at every size, so the stroke-width
     attribute in the viewBox is 1.5 * 24 / size (2.25, 1.8, 1.5). The SVG files in icons/ are at 24 px.
  3. Outline only, round caps and joins, currentColor, neutral text colours. Red is reserved for the open-bug dot.
  4. Text label next to the icon by default. Icon-only buttons need an aria-label and a tooltip, and a
     36 px (desktop) or 44 px (phone) hit area. Decorative icons are aria-hidden.
  5. The set is closed. A new icon is added by its Lucide name, in a pull request, with the reason.
  6. Status glyphs are a separate family of exactly six shapes. Always show a text label nearby.
  7. Never use the brand mark, emoji or flags as icons.

Flutter: the same names and numbers apply. A Flutter port of the set was not checked.
