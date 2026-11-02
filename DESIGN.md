---
name: Heisenbug
description: Public bug tracking for apps that are not open source. Neutral, dense, developer-facing. Dark by default.
colors:
  ground-dark: "#1F2125"
  raised-dark: "#25282D"
  selected-dark: "#2D3137"
  hairline-dark: "#353A41"
  control-border-dark: "#7E8590"
  text-dark: "#ECEEF0"
  text-2-dark: "#B4BAC3"
  text-3-dark: "#9BA2AC"
  red-text-dark: "#FF6B63"
  primary-button-dark: "#ECEEF0"
  primary-button-label-dark: "#1F2125"
  ground-light: "#F4F5F7"
  raised-light: "#ECEEF1"
  selected-light: "#E2E5E9"
  hairline-light: "#D3D7DD"
  control-border-light: "#767B84"
  text-light: "#1F2125"
  text-2-light: "#444A53"
  text-3-light: "#59606A"
  red-text-light: "#B71C27"
  primary-button-light: "#1F2125"
  primary-button-label-light: "#F4F5F7"
  status-open-dark: "#F85149"
  status-in-progress-dark: "#E3B341"
  status-fixed-dark: "#56D364"
  status-neutral-dark: "#9BA2AC"
  status-open-light: "#CF222E"
  status-in-progress-light: "#8A5300"
  status-fixed-light: "#1D6B3A"
  status-neutral-light: "#59606A"
  badge-muted-dark: "#9AA1AB"
  badge-muted-light: "#5B616B"
typography:
  ui:
    fontFamily: Geist
    fontWeight: 400
  ui-strong:
    fontFamily: Geist
    fontWeight: 600
  data:
    fontFamily: Spline Sans Mono
    fontWeight: 400
  wordmark:
    fontFamily: Spline Sans Mono
    fontWeight: 500
    letterSpacing: -0.02em
components:
  button-primary-dark:
    backgroundColor: "{colors.primary-button-dark}"
    textColor: "{colors.primary-button-label-dark}"
  button-primary-light:
    backgroundColor: "{colors.primary-button-light}"
    textColor: "{colors.primary-button-label-light}"
---

# Heisenbug design

Agent-facing summary of the locked UI standards. The long form is `docs/ui-standards.md` and the brand rules are in `brand/BRAND.md`, both in the `heisenbug-design` repository. If this file and the long form disagree, the long form wins and this file is wrong: fix it.

Status of this file: written from the project docs on 2026-10-31. The DESIGN.md format is an alpha open specification from Google Labs and the section names and token keys below follow secondary descriptions, not the spec text. Run `npx @google/design.md lint DESIGN.md` (pin the version in `package.json`) and fix whatever it reports before relying on it. Not yet specified anywhere in the project docs, and therefore not invented here: a corner-radius scale and a spacing scale. Extract them from boards AE, AI and AN in the mockup canvas into `rounded` and `spacing` tokens before building shared components.

## Overview

Heisenbug is a public place to report bugs, confirm them on your own device and follow the fixes, for apps that are not open source. The interface is neutral and dense: type, hairlines and space do the work; there is no colour accent in the chrome. Red appears only for the open-bug state and the breakpoint dot in the logo. Dark is the default for every first-time visitor.

Tagline, written exactly: "Some bugs only happen to some people. Find out who." Plain descriptor: "Public bug tracking for apps that are not open source." "It's not just you." is microcopy for small moments (near Same here, on a search match, on report confirmation), never a headline.

Never write the bare name Traceway in public text; write traceway.dev. In running text write Heisenbug with a capital; the logo itself is lowercase.

## Colors

Two themes, tokens as CSS variables under `:root[data-theme="dark"]` and `:root[data-theme="light"]`, with `color-scheme` set to match. No blue anywhere in the interface chrome.

| Role | Dark | Light |
| --- | --- | --- |
| Ground | `#1F2125` | `#F4F5F7` |
| Raised | `#25282D` | `#ECEEF1` |
| Selected | `#2D3137` | `#E2E5E9` |
| Hairline | `#353A41` | `#D3D7DD` |
| Control border | `#7E8590` | `#767B84` |
| Text | `#ECEEF0` | `#1F2125` |
| Text 2 | `#B4BAC3` | `#444A53` |
| Text 3 | `#9BA2AC` | `#59606A` |
| Red text | `#FF6B63` | `#B71C27` |
| Primary button / label | `#ECEEF0` / `#1F2125` | `#1F2125` / `#F4F5F7` |

Status colours (all at least 4.8:1 on their ground): open red, in progress amber, fixed green, and one neutral grey shared by Duplicate, Waiting and Not planned. Muted text for the Powered by badge: `#9AA1AB` on dark, `#5B616B` on light; if that falls under 4.5:1 on the host surface, use the one-colour badge. Do not use `#6B727F` for text (2.94:1 on `#272B30`). The logo dot is `#F85149` on dark and `#CF222E` on light. Logo files never contain blue.

Theme behaviour: the marketing landing page is dark only with no switch. In the app and docs the choices are Dark (default), Light and System, stored in the cookie `hb-theme` (`dark`, `light`, `system`; one year) so the server renders the right theme on the first response; for `system` a tiny inline script in `<head>` sets `data-theme` before first paint. System is something the user picks, never the default. The SDK reporter follows the host app's theme. Link-preview images are dark.

Both themes must pass the same contrast checks.

## Typography

- Interface text: Geist (400 and 600). Data, code, issue numbers and the wordmark: Spline Sans Mono. Both are SIL Open Font License; self-host the files, never load from a third-party CDN. Inter and JetBrains Mono are no longer used anywhere.
- Landing headline is the tagline: first sentence in the main text colour, "Find out who." in the muted colour, 36 to 72 px (a step smaller than a usual hero because the line is long).
- SDK reporter: inherits the host app's font (`font-family: inherit` on the web; the app's `Theme` text styles in Flutter), falls back to the platform default (`system-ui`), never bundles Geist. A `fontFamily` option overrides. Layout must tolerate any font: no fixed-width text boxes, no clipping. The Powered by badge keeps the wordmark font because it is an image.
- Wordmark: `heisenbug`, lowercase, Spline Sans Mono Medium, letter-spacing -0.02em, no dot after the word, ever.

## Layout

- Mobile first. Every screen is designed at 390 px first, then checked at about 768 px and 1280 px. No horizontal page scroll at any width. Touch targets 44 px on phone, 24 px minimum anywhere. Tables collapse to stacked rows. Code blocks and tables scroll inside their own box. Forms and the thread reply box stay reachable above the on-screen keyboard. Nothing relies on hover.
- Navigation (app and public pages): one slim 48 px top bar (lockup, app switcher, section tabs, jump button with the command palette, notifications, Report a bug); a 28 px bottom status bar on desktop; thread actions and the reply box docked at the bottom of the thread pane. Developer dashboard: left sidebar. Phone: a bottom bar with five items and a raised Report. SDK reporter sheet: no navigation. Same order everywhere, current page marked, the palette never the only route, no hover-only menus, skip link first.
- Docs: left navigation with the current page marked by a bar and weight (not colour alone), a reading column of about 68 characters, an On this page rail that collapses under 1180 px; navigation behind a menu button under 860 px. Code blocks have a language label and a Copy button; framework tabs (Web, Tauri, Flutter) persist; each page has Copy as Markdown and Copy as prompt.
- Landing page: top bar, hero, one framed sample issue, four statements with one small visual each, the six status shapes with a word beside each, one closing call to action, footer. No feature grids, no lists in the body, no gradients, no invented numbers or logos.

## Elevation and depth

None. No shadows as decoration, no cards that lift on hover, no gradients. Depth is expressed with the raised and selected grounds and hairlines.

## Shapes

- Status shapes (our own, 14 px grid, rendered at 14, 16 or 20 px, **always with a text label nearby**): `open` filled disc, red; `in-progress` ring with the left half filled, amber; `fixed` ring with a check, green; `duplicate` ring with a slash, grey; `pending` dashed ring, grey, label "Waiting"; `notplanned` ring with a level bar, grey, label "Not planned". Same ring and 1.6 stroke for Duplicate and Not planned, told apart by direction and by the label. A seventh state needs a design change. In dense phone lists the label rule is an open decision (short word on the row, legend, or long press); every shape has an accessible name regardless.
- Issues close three ways, each with a required detail: Fixed (the release), Duplicate (the original issue), Not planned (a short reason).
- Brand mark: the R1 mark with the breakpoint dot. Filled red dot means an open bug; hollow means resolved or loading (product states). Use the simplified favicon mark below 32 px. Minimum lockup 12 px font size, minimum mark 16 px, clear space equal to the wordmark cap height on every side. Plain-text form of the mark: `//.`

## Iconography

Lucide v1.66.0 (ISC), pinned, a **closed set of 67 icons** (pack `heisenbug-icons-v1.1`; names in its `manifest.json`). 24 px grid, rendered only at 16, 20 or 24 px, 1.5 px rendered stroke at every size (viewBox stroke 2.25, 1.8, 1.5), outline only, round caps and joins, `currentColor` in neutral text colours (red only for the open-bug dot). A text label sits next to the icon by default; icon-only buttons need an aria-label, a tooltip and a 36 px (desktop) or 44 px (phone) hit area; decorative icons are `aria-hidden`. Call-to-action links use `chevron-right`, external links `external-link`, Copy as prompt `message-square`. Add an icon only by its Lucide name in a pull request with a reason. Not icons: the brand mark, status shapes, emoji, flags. No emoji anywhere in code or UI.

## Motion

CSS only, no animation library. Durations 80, 140 and 200 ms. Easings `cubic-bezier(.2,0,0,1)` arriving and `cubic-bezier(.4,0,1,1)` leaving. Travel 4 or 8 px. Reduced motion sets travel to zero (fades stay) and stops loops and flashes. Nothing animates that is not in the motion catalogue (board AM). Never: parallax, scroll-triggered reveals, hover lift on cards, bounce or spring, count-up numbers, animated gradients, route transitions. The navigation progress bar idea is kept.

## Components

- Primary button: see the two `button-primary` tokens above (inverted ground, high contrast). Secondary controls use the control-border colour and hairlines, not fills.
- Same here: the vote on issues; carries version and device (automatic from the SDK, optional on the web); one per account per issue; can be withdrawn. Can't reproduce is evidence, needs a version and device, and is never subtracted from the count. Default sort is Most observed. Feature requests and replies keep plain up and down votes.
- Copy as prompt: on every issue; shows a preview of exactly what will be copied; variants explain, write a failing test, suggest a fix.
- Trace attached: a neutral badge plus a "Has trace" filter. It is not a quality score; typed reports are never ranked down.
- Powered by: on by default in the reporter footer, hosted pages, notification emails, the docs footer and once per CLI run; `branding: 'badge' | 'text' | 'none'`, hiding it is free. Link `https://heisenbughq.com/?ref=powered-by`, tap area at least 24 px tall, accessible name "Powered by Heisenbug". Never over content, in OS notifications or during a crash capture.
- `//.` easter egg: render-time only, never in stored text, code, URLs or link targets; token and limits are in `BRAND.md`.
- Markdown: raw Markdown is the stored form; no raw HTML, no images (use the uploader), links only http, https and mailto, external links get `rel="nofollow ugc noopener noreferrer"`; surface limits are in board AL and `packages/markdown`.

## Accessibility rules learned from the board checks

The lockup inside a link that already has a text label is `aria-hidden`; a lockup on its own is labelled "Heisenbug". Scrollable code blocks are focusable (`tabindex="0"`) and named. Links to other pages (such as the framework switch in docs) are a `nav` with `aria-current="page"`, not a tablist; real tabs use `role="tab"` and `aria-selected`. Heading levels never skip. Controls are at least 44 px in both directions on phone, including segmented controls. Every screen must pass axe-core (WCAG 2 A and AA, 2.1 A and AA) at 390 and 1280 px, a Tab-key walk with visible focus, and the touch-target scan, in both themes. Real screen reader and real device checks are still open.

## Do's and Don'ts

Do
- Use tokens, never raw hex values, in components.
- Keep status shapes together with their word.
- Test every screen at 390 px first, in both themes.
- Respect reduced motion.
- Treat all user-written text as untrusted when rendering, and in generated prompts and MCP output.

Don't
- Add blue, gradients, shadows as decoration, emoji, or new icons outside the closed set.
- Add a dot after the wordmark, recolour the logo dot, stretch or rotate the logo, or place it on a busy photo without a dark scrim.
- Use the generic icon set as a landing-page feature.
- Add hover-only interactions or horizontal page scroll.
- Make any claim in copy that the launch scope does not ship.
- Add any AI model call to the platform (product rule: Copy as prompt, setup prompts, `llms.txt` and the read-only MCP server only assemble stored text).
