<p align="center"><picture>
  <source media="(prefers-color-scheme: dark)" srcset="brand/readme/heisenbug-lockup-dark.svg">
  <img alt="heisenbug" src="brand/readme/heisenbug-lockup-light.svg" height="40">
</picture></p>

**Some bugs only happen to some people. Find out who.**

Heisenbug is a public place to report bugs, confirm them on your own device and follow the fixes, for apps that are not open source. This repository is the single source for how Heisenbug looks: design tokens, themes, the icon pack, brand files, `DESIGN.md` and the UI standards. It is published as `@heisenbughq/design`.

**Status:** pre-release. `@heisenbughq/design` builds theme CSS and Tailwind v4 mappings from the front matter in `DESIGN.md`, checks contrast and document drift, ships the icon pack, and ships document sync and check commands for consumers.

Use Node 26.13.0 and pnpm 12.16.1. Run `pnpm install --frozen-lockfile`, then `pnpm check`. `pnpm build` writes `dist/tokens.css` and `dist/theme.css`; load both for Tailwind v4, or just `tokens.css` for plain CSS. Set `data-theme="dark"` or `data-theme="light"` on the root element. Fonts use system fallbacks until the font files are added.

`pnpm contrast` prints every required ratio in both themes. `pnpm lint:design` runs Google's design linter pinned at 0.4.0. `pnpm drift` checks the Colors table against the token source. `pnpm guards` checks tracked text and SVG locations; these rules duplicate `platform/tools/guards` for now. `pnpm icons` checks that the icon pack matches its manifest (67 icons, 6 status glyphs), that every SVG parses, and that no SVG hard-codes a colour.

Icons: import `@heisenbughq/design/icons/<name>.svg`, `@heisenbughq/design/status/status-<id>.svg`, `@heisenbughq/design/icons/sprite.svg` or `@heisenbughq/design/icons/manifest.json`; `@heisenbughq/design/icons/icon.mjs` renders an icon at 16, 20 or 24 px from Node. Every SVG uses `currentColor`; colour status glyphs with the `--hb-color-status-*` variables from `tokens.css`.

Consumers can wire `design:sync` to `heisenbug-design-sync` and `design:check` to `heisenbug-design-check`. Run the former from the consumer root to refresh committed `DESIGN.md` and `docs/ui-standards.md` copies with their source marker; the latter fails when either copy drifts. Consumer adoption follows later. Releases are staged on npm by CI and approved by the owner: see `docs/publishing.md`.

## Contents

- `DESIGN.md`: short, agent-facing design rules and tokens
- `docs/ui-standards.md`: the full UI standards
- `icons/`: the icon pack (Lucide v1.66.0, 67 icons) and the six status glyphs, with `manifest.json`
- `docs/publishing.md`: how releases are staged on npm and approved
- `brand/BRAND.md`: logo, wordmark, colours, tagline, Powered by, trademark notes
- `brand/svg`, `brand/png`, `brand/favicon`: the brand pack (v1)
- `BRAND-USE.md`: how the brand files may be used

## License

Code and tokens are MIT (`LICENSE`). Files in `brand/` are not licensed for reuse (see `BRAND-USE.md`). Third-party notices: `THIRD-PARTY-NOTICES.md`.
