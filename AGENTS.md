# Heisenbug design

Source of the tokens, themes, icon pack, brand files, `DESIGN.md` and the long UI standards. Publishes `@heisenbughq/design`. Public repo; code MIT; brand files are not licensed for reuse (`BRAND-USE.md`).

## Hard rules
- Tokens change only here. Other repos receive them by package update and `pnpm design:sync`.
- Any colour change must pass the contrast script (text 4.5:1, status colours 4.5:1 on ground and 3:1 on raised and selected (shapes only, never text), UI borders 3:1) in both themes. Run `pnpm check`.
- The icon set is closed (Lucide v1.66.0, 67 icons). Adding one needs its Lucide name and a reason in the pull request, and a manifest update.
- Status shapes are drawn here; six exist; a seventh needs a design change.
- Run `npx @google/design.md lint DESIGN.md` (pinned) in CI.
- Text rules: no emojis and no em dashes anywhere. SVG files only in `brand/`, `icons/` and generated outputs; nothing hand-edited.
- Logo geometry and clear-space rules are in `brand/BRAND.md`; do not alter the SVGs by hand, regenerate them.

## Git and pull requests
- Commit at each passing checkpoint and push your feature branch (`type/short-description`). One task, one branch, one pull request.
- Every commit message is exactly one line, a Conventional Commit subject: `type(scope): subject`. No body, no trailers, no `Co-Authored-By`, no tool or session lines.
- Open the pull request with `gh pr create`. The title is one line, a Conventional Commit subject. The description is written like release notes: a short bulleted list of what changed and what is new, in plain user-facing wording. No instructions for the reviewer, no testing notes, no checklist, no list of what you did not do, no generated-by footer.
- Never push to `main` and never force push. Never merge a pull request unless the owner asks you to in this session; then merge only the pull request named, with a squash merge, and never with admin rights or by skipping checks.
- Local hooks in .githooks enforce the commit format and block pushes to main; never bypass them with --no-verify. In a fresh clone run: git config core.hooksPath .githooks
