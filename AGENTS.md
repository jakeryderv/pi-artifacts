# pi-artifacts — Repo Guide

Single-package repo for `@jakeryderv/pi-artifacts`, a package for the Pi coding
agent. The repo root **is** the published package: `package.json` at the root
carries the `pi-package` keyword, the `pi` manifest, and a tight `files` list, so
the repo has exactly one npm identity and one catalog entry.

One package per repo is deliberate. Pi requires a package that depends on
another Pi package to **bundle** it (`dependencies` + `bundledDependencies`)
rather than peer it, so a workspace buys no runtime linkage — only coordination
overhead. Future `@jakeryderv/pi-*` packages get their own repos.

## Documentation placement

- **Settled docs in `docs/`, exploratory/thinking notes in `docs/notes/`.**
- Root community/release docs are deliberate exceptions: `CONTRIBUTING.md`,
  `SECURITY.md`, and `CHANGELOG.md`. GitHub surfaces the first two, and the
  changelog is the curated release record.
- **Only `README.md` ships to npm as documentation.** Root community docs and
  internal `docs/` stay git-tracked but out of the tarball; package-owned demo
  bundles in `demos/` deliberately ship as runtime resources.

## Package conventions

- Root `package.json` is the publishable manifest — it is **not** `private` and
  declares no `workspaces`.
- **Peer deps** `"*"` for Pi core imports (`@earendil-works/pi-*`) and `typebox`;
  declare only what is actually imported. Pi provides them at runtime. The same
  names also sit in `devDependencies` at a concrete version so local development
  resolves them.
- **Runtime deps go in `dependencies`** — package installs run
  `npm install --omit=dev`, so `devDependencies` are absent at runtime. Anything
  an extension imports when it runs belongs in `dependencies`. Repo-hygiene-only
  tooling (`markdownlint-cli2`, `typescript`) stays in `devDependencies`.
- **Extensions:** no background work (sockets/servers/watchers/timers) in the
  factory function. Start session-scoped resources in `session_start` (or lazily
  on first use); tear them down in an idempotent `session_shutdown`.
- **Rebrand-safe paths:** derive `~/.pi/...` as
  `join(os.homedir(), CONFIG_DIR_NAME, ...)`, never a hardcoded `.pi`.
  `CONFIG_DIR_NAME` is exported from `@earendil-works/pi-coding-agent`.
- **No build step:** ship `.ts` source (jiti loads it). `tsconfig` is
  typecheck-only (`noEmit`).

Full reasoning: [`docs/notes/packaging.md`](docs/notes/packaging.md).

## Dev & test workflow

- **Iterate** with `npm run dev`. The repository-only launcher resolves the
  package path, loads it with `pi -e` from a scratch temp dir, forwards arguments
  after `--`, and removes the temp dir when Pi exits. This is ephemeral (writes
  nothing persistent, no trust prompt) and loads your full global environment
  plus the package. No hot reload on `-e` — restart, or symlink the repo into
  `~/.pi/agent/extensions/` for `/reload`.
- **Never add this repo to its own `.pi/settings.json`.** That file is for
  external catalog packages only; the local package is tested via `-e`.
- **Before publishing:** `npm run typecheck`, `npm test`, `npm run lint:deps`,
  then `npm run pack:check` to confirm the tarball contains only `demos/`,
  `extensions/`, `skills/`, `README.md`, and `LICENSE` (no `docs/`, `test/`, or
  config files).
- `lint:deps` is knip: it fails on unreachable files, unused exports, and
  undeclared/unused dependencies. Browser runtime assets and extension entry
  points are declared as `entry` in `knip.json` — add new ones there rather than
  ignoring the finding.

## Publishing

- **Releases are tag-triggered.** Bump `version`, commit, then push a `v<version>`
  tag; `.github/workflows/release.yml` re-runs the full preflight and publishes.
  Do not `npm publish` from a laptop — the workflow is the only trusted publisher.
- Move notable `CHANGELOG.md` entries from `Unreleased` into the dated release
  before creating the release commit and tag.
- Auth is npm **trusted publishing** (OIDC, `id-token: write`), so there is no
  `NPM_TOKEN` secret and every release carries a provenance attestation. It
  depends on a one-time grant configured on npmjs.com (package → Settings →
  Trusted publisher → GitHub Actions, repo `jakeryderv/pi-artifacts`, workflow
  `release.yml`); without it the publish step fails with an auth error.
- The tag must match `package.json` `version` — the workflow fails the release if
  they diverge.
- Publishes with public access under `@jakeryderv/pi-artifacts`. Cut real semver
  bumps so `pi update` propagates changes to installs. The npm scope belongs to
  the account, not the repo — the package identity and version history are
  unaffected by repo moves or renames.

## Project `.pi/`

- `./.pi/settings.json` holds **external catalog packages** scoped to this repo.
  Review third-party source before adding — Pi packages run with full system
  access. Currently empty; lead candidate: **pi-committer** (conventional-commit
  - changelog automation, opt-in per project).
- Running pi in this repo prompts to `/trust` it once (to load `.pi/` resources).
  `defaultProjectTrust` is a global setting and does not belong in this file.
