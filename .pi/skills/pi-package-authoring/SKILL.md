---
name: pi-package-authoring
description: Author, review, or maintain Pi coding-agent packages in this repo. Use when creating package resources, editing package.json pi manifests, adding extensions/skills/prompts/themes, changing npm publish contents, or preparing package preflight checks.
---

# Pi Package Authoring

Use this skill for package work in `pi-artifacts`.

## Core repo rules

- This repo is a single package: the root `package.json` is the published
  manifest for `@jakeryderv/pi-artifacts`. It is not private and has no
  `workspaces`.
- The package needs:
  - `keywords: ["pi-package"]`
  - a `pi` manifest, unless conventional discovery is intentional
  - a tight `files` list
  - docs under `docs/` (settled) and `docs/notes/` (exploratory)
- Only `README.md` ships by default. Internal `docs/` and `test/` are
  git-tracked but excluded from npm tarballs unless intentionally added to
  `files`.

## Dependency rules

- Pi core imports go in package `peerDependencies` with `"*"`:
  - `@earendil-works/pi-coding-agent`
  - `@earendil-works/pi-ai`
  - `@earendil-works/pi-agent-core`
  - `@earendil-works/pi-tui`
  - `typebox`
- Runtime imports go in `dependencies`, never `devDependencies` — installs run
  `npm install --omit=dev`.
- Repo-only tooling (`markdownlint-cli2`, `typescript`) stays in
  `devDependencies`. Pi core packages and `typebox` appear in both
  `peerDependencies` (`"*"`) and `devDependencies` (concrete version).
- Do not bundle Pi core packages.

## Extension rules

- Do not start sockets, servers, watchers, timers, or other background work in
  the extension factory.
- Start session-scoped resources in `session_start`, or lazily on first use.
- Tear resources down in an idempotent `session_shutdown` handler.
- Derive `~/.pi/...` paths with `CONFIG_DIR_NAME`:
  `join(os.homedir(), CONFIG_DIR_NAME, ...)`.
- Keep `index.ts` focused on Pi wiring; split store, manifest, server, and
  validation logic into small modules.

## Local project `.pi/` rules

- Keep `.pi/settings.json` for external, reviewed catalog packages only.
- Do not add this repo's own package (`.`) to `.pi/settings.json`.
- Test the local package with `pi -e /absolute/path/to/pi-artifacts`.
- Do not edit generated `.pi/npm/` or `.pi/git/` contents.

## Preflight before publish or handoff

Run from the repo root:

```bash
npm run typecheck
npm test
npm run format:check
npm run lint:md
npm run lint:deps
npm run pack:check -- --json
```

Confirm only expected runtime resources ship: `extensions/`, `skills/`,
`README.md`, `LICENSE`. Docs, tests, and root config files should remain
excluded unless intentionally changed.

## README/package files check

Because `files` excludes `docs/`, `README.md` links must not point to relative
`docs/...` paths that will be broken on npm. Use GitHub URLs or include `docs/`
intentionally.

## Release procedure

Releases are tag-triggered, never published from a laptop:

1. Bump `version` in the root `package.json` and update the README's
   "What's new" section.
2. Commit, push `main`, and confirm the `ci` workflow is green.
3. Push a matching `v<version>` tag. `.github/workflows/release.yml` re-runs the
   preflight and publishes over npm trusted publishing (OIDC), which also
   attaches a provenance attestation.

The workflow fails if the tag and `package.json` version disagree. Tags from the
monorepo era use the older `pi-artifacts-v*` form; new tags are `v*`.
