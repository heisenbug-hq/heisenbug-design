# Brand identity

2026-10-31, moved into the repository 2026-11-02. Final logo decisions for Heisenbug. The visual boards are in the "Heisenbug logo options" canvas (boards U to Z are the final stretch) and the SVG and PNG set is in this folder (`svg/`, `png/`, `favicon/`, from `heisenbug-brand-v1`). The rename and transition history is in the private `heisenbug-internal` repository (`history/rebranding.md`).

## Decisions

- **Mark:** R1. Four slanted slabs at about 31 degrees (slope 0.6, slab 13, height 70, pair offset 32, wall 5.5): a hollow top-left half, a solid bottom-left half, a solid top-right half and a hollow bottom-right half. Aspect 1.24.
- **Breakpoint dot:** part of the mark, in its bottom-right corner. Filled red means an open bug; hollow means resolved or loading (product states, not a logo variant). The dot is r 8.0 in the 100 viewBox, centred at (84, 75.8). Simplified favicon version: solid halves, r 8.6, centre (83.4, 75.2).
- **Wordmark:** `heisenbug`, lowercase, Spline Sans Mono Medium (500), letter-spacing -0.02em. **No dot after the word**, anywhere.
- **Lockup:** mark at 1.25x the wordmark's cap height, centred on the cap height, 0.50 em gap between mark and word. Symbol before the word, so the dot sits just ahead of the text like a breakpoint in a code gutter.
- **Colours:** default is neutral. Dark ground `#1F2125` with a white mark; light ground `#F4F5F7` with a `#1F2125` mark. Dot `#F85149` on dark, `#CF222E` on light. One-colour versions use `#111418` or `#FFFFFF` for mark and dot. Blue is an accent only and never appears in a logo file.
- **Product UI font is Geist** (decided 2026-10-31, replacing Inter). Spline Sans Mono is for the wordmark, data and code. All fonts are SIL Open Font License; the wordmark is outlined in the SVGs. See `docs/ui-standards.md` for fonts and the Dark, Light and System theme choice (dark by default).
- **Why R1 and not R2:** same design with a 4 degree steeper slant and about 25% thicker slabs. R1's slab weight (0.159 of mark height) is closer to a text face's stem-to-cap ratio than R2's 0.199, and R1 is squarer. (The ratio was measured against Inter's 0.175; Geist was not measured.)
- **Why Spline Sans Mono:** a monospace says developer without the symbol having to. Chakra Petch was rejected because its angled cuts repeat the mark's motif and compete with it. Inter was rejected as too common.

## Tagline (decided 2026-10-31)

**Some bugs only happen to some people. Find out who.**

- Written exactly like that, with the capital H in running text and no trailing slogan. On the dark link-preview card the second sentence ("Find out who.") is set in the muted text colour.
- **Plain-words descriptor,** used beside it where one line is not enough: "Public bug tracking for apps that are not open source." Used as the landing page's eyebrow line.
- **The landing page headline is the tagline** (decided 2026-10-31, replacing "Report it once. See who else hit it."). First sentence in the main text colour, "Find out who." muted, set a step smaller than a usual hero (36 to 72 px) because it is long. The eyebrow descriptor and the sub line stay and carry the plain explanation.
- **Where it goes:** README opening (under the lockup), link-preview image (`og-image-tagline-1200x630.png`, used by the real site once it is live; the holding page keeps its own preview text), the site's meta description, social bios, package store descriptions where there is room.
- **Meta description (146 characters):** "Some bugs only happen to some people. Find out who. Heisenbug is a public place to report bugs and follow fixes for apps that are not open source."
- **"It's not just you."** is not the tagline. It is microcopy for small moments: near the Same here button (the landing page's "Say you hit it too." row opens with it), when a search finds a matching issue, and on report confirmation messages. "Works on my machine" was considered as a headline and is kept for the closing section or a 404 page.
- **README opening template** for every repository:
  ```
  <p align="center"><picture>
    <source media="(prefers-color-scheme: dark)" srcset=".github/assets/heisenbug-lockup-dark.svg">
    <img alt="heisenbug" src=".github/assets/heisenbug-lockup-light.svg" height="40">
  </picture></p>

  **Some bugs only happen to some people. Find out who.**

  Heisenbug is a public place to report bugs, confirm them on your own device and follow the fixes, for apps that are not open source. This repository is <what this repo is, one line>.
  ```
  Replace the last sentence per repository. Keep the first two paragraphs identical everywhere.

## Sizes and rules

- Minimum lockup: 12 px font size. Minimum mark: 16 px; below 32 px use the simplified favicon mark (solid halves, bigger dot).
- Clear space on every side equals the wordmark's cap height.
- Do not add a dot after the word, recolour the dot (except to match a one-colour version), stretch, rotate, or place on a busy photo without a dark scrim.
- In running text write "Heisenbug" with a capital. The logo itself is lowercase.
- **Naming the old project.** Public text never uses the bare name "Traceway" (tracewayapp.com is another company). Write **traceway.dev**, for example "formerly traceway.dev" in footers.
- Plain-text form of the mark: `//.`. Plain-text lockup: `//. heisenbug`.

## Which asset where

| Context | Asset |
| --- | --- |
| Web app header, 480 px and wider | lockup, about 20 px font size, links home |
| Narrow and mobile headers | mark alone, about 24 px tall |
| Browser tab | `favicon.svg` (adapts to light and dark) plus `favicon.ico` (16/32/48 tile) and `apple-touch-icon.png` (180) |
| PWA, Android, iOS, macOS icon | `app-icon-dark` (1024 master, mark inside the central 60%) |
| GitHub, npm, Discord, X, Mastodon avatar | `avatar-dark` (512, survives a circle crop; the PNG in this pack is `png/avatar-dark-400.png`) |
| Link previews | `og-image` 1200 x 630 |
| README and docs header | lockup dark and light via a picture element with prefers-color-scheme |
| Footers and emails | lockup at 12 to 14 px; emails on a dark band `#1F2125` using the dark `@2x` PNG |
| CLI, logs, plain text | `//.` and `//. heisenbug` |
| Print, stamps, embroidery | one-colour black or white; keep the gap at 0.50 em or more |

## Powered by (SDKs, widgets, hosted pages)

- **Forms:** visual badge (`powered-by-heisenbug-dark.svg` and `-light.svg`); a text line where an image is not possible (Powered by, then the mark, then `heisenbug`); plain text `Powered by //. heisenbug`. In a sentence: "Powered by Heisenbug".
- **Type and colour:** "Powered by" in the host or UI font, the word in the wordmark. 12 px minimum. Muted text `#9AA1AB` on dark (about 5.5:1) or `#5B616B` on light, the word at full strength. If the muted text would fall under 4.5:1 on the host surface, switch to a one-colour badge.
- **Placement:** footer of the reporter sheet, hosted public pages, notification emails, docs footer, and the CLI banner once per run. Not over content, not in OS notifications, not during a crash capture.
- **Link:** `https://heisenbughq.com/?ref=powered-by`. Tap area at least 24 px tall. Accessible name "Powered by Heisenbug".
- **Config:** one option, `branding: 'badge' | 'text' | 'none'`, default `badge`.
- **Hiding it is free (decided 2026-10-31).** `branding: 'none'` is an optional setting available on the free plan and stays free; the badge is on by default and the project relies on developers' goodwill. This replaces the earlier idea of making badge removal a paid feature.

## The `//.` easter egg

Typing `//.` in any user text (posts, comments, report descriptions, bios; the same applies to titles in list views) shows the mark in its place. `//.` is the mark in plain text: two slashes and the dot.

- **Token rule:** `//.` alone, preceded by the start of text, whitespace, or an opening bracket or quote, and followed by the end of text, whitespace, or closing punctuation. Never inside a word, a URL, code, a link target, or after a backslash.
- Reference pattern for text nodes: `/(^|[\s(\[{"'\u201C\u2018])\/\/\.(?=$|[\s)\]},;:!?"'\u201D\u2019])/g`, replacing with `$1` plus the glyph.
- **Render time only.** Stored text, the API, search, exports, copy and paste and notification emails all keep `//.`. Run it as a markdown or rehype plugin on text nodes so inline code, fenced code and link targets are skipped automatically.
- **Glyph:** the `hb-mark-inline` symbol (solid halves, bigger dot) at about 1.0 em high, `currentColor` for the slabs and the red dot from the theme, with the hidden text `//.` kept inside so find-in-page, copy and screen readers still work.
- **Limits:** a switch under Appearance (on by default), at most 20 per post, the editor preview shows it while the input keeps the raw text. A single hover pulse is optional and must respect reduced motion.
- **Fires:** `fixed it //. thanks`, `(//.)`, `works now //.`. **Does not fire:** `http://.example`, `a//.b`, `//..`, `` `//.` ``, `[link](//.)`, `\//.`.

## Open items

- **Lookalike and trademark check** of the R1 mark by a human (the earlier HP lettermark concern was mitigated by slant, no circle and no bowls, but not formally cleared). Also covers the Heisenbug conference name overlap noted in the rebrand history.
- **Accent blue token.** The rebrand history lists `#3B82F6`; the value sampled from the SDK screenshot was `#4484F2`. The UI chrome now uses no blue, so this only matters if an accent is ever added. White text on `#4484F2` is about 3.6:1; near-black ink on it is about 5.2:1.
- **Muted text token:** `#6B727F` fails (2.94:1 on `#272B30`); use `#9BA2AC` or lighter (about 5.5:1).
- **Favicon check on real devices** (16 px on a standard-density screen) and a wordmark check in the real UI.

## Trademark and name checks (notes, 2026-10-31)

Not legal advice. Have an IP lawyer or agent look before any filing. These are the points to bring to them.

- **The name.** "Heisenbug" is already a standard term in computing for a bug that changes or disappears when you try to study it. For a bug-tracking service it describes the subject, so it may be treated as descriptive or only weakly distinctive, which can make it harder to register and to enforce. The Heisenbug testing conference is a separate, known overlap (accepted by the owner earlier). A clean search result is not approval.
- **Keyboard symbols and plain characters.** A bare punctuation mark or keyboard character is generally a weak mark. An EU court refused a plain exclamation mark (JOOP!) as lacking distinctive character, treating it as an eye-catching gimmick, and a letter or set of initials counts as generic ([Courthouse News](https://www.courthousenews.com/joop-cant-trademark-an-exclamation-point/), [LegalZoom](https://www.legalzoom.com/articles/trademark-a-symbol)). So the plain-text form `//.` is not something we could own on its own, and nobody should be stopped from using slashes.
- **Our logo is different.** The R1 mark (slanted slabs and the dot) is a custom drawing, so it can be registered as a figurative (logo) mark. That protects the exact design as filed, and registrability still depends on the goods and services and on whether it is confusingly similar to an existing mark for related goods.
- **Where to search.** India: the free IP India Trade Marks Registry public search (tmrsearch.ipindia.gov.in) offers a wordmark search (Start with, Contains, Match with), a phonetic search and a Vienna code search for logos, one class at a time ([guide](https://www.taxaj.com/learn/?p=508)). Also search the US (USPTO), the EU (EUIPO TMview) and the WIPO Global Brand Database. Check registered, objected, opposed and abandoned marks.
- **Likely classes** (confirm with the agent): 9 (downloadable software, the SDKs) and 42 (software as a service, the platform); ask whether forum and community features need another class.
- **Who files owns it.** If a company is formed later, plan to file in the right name or assign the mark.
