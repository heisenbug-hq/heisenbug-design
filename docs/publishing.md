# Publishing `@heisenbughq/design`

Releases are staged on npm by CI and go live only when the owner approves them on npm with two-factor authentication. No npm token is stored anywhere: CI proves who it is with GitHub's OpenID Connect (trusted publishing), and npm adds provenance automatically.

## How a release flows

1. Work lands on `main` through squash-merged pull requests with Conventional Commit titles.
2. release-please keeps one release pull request open (`chore: release X.Y.Z`) with the version bump and the changelog.
3. The owner merges the release pull request. release-please, running with the release GitHub App token, creates the tag `vX.Y.Z` and the GitHub release.
4. The tag starts `.github/workflows/publish.yml`. It checks that the tag equals `v` plus the `package.json` version, installs with the frozen lockfile, runs `pnpm check`, and runs `npm stage publish`. The version is now staged: it is not installable and not visible as a release.
5. The owner reviews the staged version and approves it with two-factor authentication. Only then is it published.

If the tag did not start the workflow, run it by hand on the tag: `gh workflow run publish.yml --repo heisenbug-hq/heisenbug-design --ref vX.Y.Z`. The workflow refuses any ref that is not a `v*` tag.

## One-time npm setup (owner)

Do this before merging the first release pull request (`0.1.0`). The package already exists on npm (the `0.0.1` placeholder), which trusted publishing requires.

1. On npmjs.com, open `@heisenbughq/design`, then Settings, then Trusted publisher, and choose GitHub Actions.
2. Enter:
   - Organization or user: `heisenbug-hq`
   - Repository: `heisenbug-design`
   - Workflow filename: `publish.yml`
   - Environment name: leave empty
   - Allowed actions: leave "npm publish" and "npm dist-tag" unticked. Staging is always allowed, so this makes the publisher stage-only: CI can stage a version but can never publish one directly.
3. Save. Then, in the same Settings page under Publishing access, choose "Require two-factor authentication and disallow tokens". Trusted publishing keeps working; any classic or granular token stops working for publishing.
4. On GitHub, protect `v*` tags in this repository with a tag ruleset, with the release GitHub App allowed to bypass it, so only the release process and the owner can create them.

Trusted publishing needs npm CLI 11.5.1 or later and Node 22.14.0 or later; staged publishing needs npm CLI 11.15.0 or later. The workflow uses Node from `.node-version` and npm 11.21.1. `repository.url` in `package.json` must stay `git+https://github.com/heisenbug-hq/heisenbug-design.git`, or npm rejects the publish.

## Approving a staged release (owner)

Use npm CLI 11.15.0 or later, signed in as the owner:

1. `npm stage list @heisenbughq/design` shows the staged versions and their stage ids.
2. `npm stage view <stage-id>` shows the details; `npm stage download <stage-id>` fetches the tarball to inspect its files.
3. `npm stage approve <stage-id>` publishes it. It asks for a one-time password.

## Rejecting a bad staged release (owner)

Run `npm stage reject <stage-id>`. It asks for a one-time password and removes the staged version permanently; nothing was published, so no user saw it.

Then fix the problem on `main` with a normal `fix` pull request. release-please opens a new release pull request with the next version; merge it to stage that version. Release the fix as the next version rather than moving or re-using the rejected tag.

A staged release also cannot change its dist-tag once staged; to change the tag, reject it and stage again.
