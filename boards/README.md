# Mockup boards

Visual references for the UI. The source is the "Heisenbug logo options" design canvas (a Claude artifact). This folder holds exports of the boards, so coding agents can look at them. The canvas files themselves need the canvas runtime and do not render outside it, so only images are kept here.

Layout: `png/<board file name>.png`, for example `png/AF-SplitDark.png`. Phone boards are 390 px wide, most other boards 960 px, the split views and docs desktop 1280 px. The landing page AN came out of the PDF as three letter-size parts (816 px wide), read them in order.

Everything on the boards is placeholder content (the sample app is "Lumen Notes"). Tokens, sizes and rules come from `DESIGN.md` and `docs/ui-standards.md`; if a board and those documents disagree, the documents win.

## Boards in use

| Board | File | Shows | Used by |
| --- | --- | --- | --- |
| AA | `AA-PaletteAudit` | Contrast checks for the palette | Reference |
| AE | `AE-SplitLight` | Issue list and thread, split view, light | M1 app shell, M2 issues |
| AF | `AF-SplitDark` | Same, dark | M1, M2 |
| AU | `AU-SplitPhone` | Same, phone, dark | M1, M2 |
| AG | `AG-Navigation` | Navigation models, command palette, rules | M1 app shell |
| AI | `AI-ObservationsLight` | Observations on an issue, light | M2 issue detail, M5 |
| AJ | `AJ-ObservationsDark` | Same, dark | M2, M5 |
| AV | `AV-ObservationsPhone` | Same, phone, dark | M2, M5 |
| AK | `AK-Observations` | The observations idea and proposals (Break on is not confirmed) | M5 |
| AL | `AL-Markdown` | Markdown standard and rendering | M1 markdown package, M2 comments |
| AM | `AM-Motion` | Motion catalogue, normal and reduced motion | M1 |
| AS | `AS-SixthShape` | Six status shapes and the closing reasons | M2 |
| AT | `AT-Prompts` | Copy as prompt, setup prompts, MCP connect, safety rules | M5 |
| AN | `AN-LandingDark-1`, `-2`, `-3` | Landing page, desktop, dark only (one long page, exported as three consecutive parts) | M6 |
| AP | `AP-LandingPhone` | Landing page, phone | M6 |
| AQ | `AQ-DocsDesktop` | Docs site, desktop | M2 docs |
| AR | `AR-DocsPhone` | Docs site, phone | M2 docs |
| W | `W-Final` | Final logo | Reference |
| Z | `Z-Usage` | Logo usage and Powered by | Reference |

## Superseded, do not build from

A to T (logo explorations), U, V, X, Y (logo decisions, recorded in `brand/BRAND.md`), AB, AC, AD (early direction explorations, not responsive), AH (icons and status shapes v1, replaced by the icon pack v1.1 and board AS).

## Export

The PNGs were cut from the canvas PDF export (Export, then "All artboards (.pdf)") at 96 dpi. To refresh a board, export again and replace its PNG; keep the file name. The PDF itself is large and is not kept in the repo.
