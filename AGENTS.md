# Heisenbug design

Source of the tokens, themes, icon pack, brand files, `DESIGN.md` and the long UI standards. Publishes `@heisenbughq/design`. Public repo; code MIT; brand files are not licensed for reuse (`BRAND-USE.md`).

## Hard rules
- Tokens change only here. Other repos receive them by package update and `pnpm design:sync`.
- Any colour change must pass the contrast script (text 4.5:1, status colours 4.5:1, UI borders 3:1) in both themes. Run `pnpm check`.
- The icon set is closed (Lucide v1.66.0, 67 icons). Adding one needs its Lucide name and a reason in the pull request, and a manifest update.
- Status shapes are drawn here; six exist; a seventh needs a design change.
- Run `npx @google/design.md lint DESIGN.md` (pinned) in CI.
- Text rules: no emojis and no em dashes anywhere. SVG files only in `brand/`, `icons/` and generated outputs; nothing hand-edited.
- Logo geometry and clear-space rules are in `brand/BRAND.md`; do not alter the SVGs by hand, regenerate them.
