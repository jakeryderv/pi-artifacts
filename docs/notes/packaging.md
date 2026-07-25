# Pi Packages — Reference Notes

Conceptual outline for building and publishing packages for the Pi coding agent. No code/commands — just the model to reason from.

> **History:** this repo started as a `packages/*` monorepo (`pi-packages`) and was flattened to one repo per package while `pi-artifacts` was still the only package. See [Repo strategy](#repo-strategy-the-chosen-approach) for why.

## The catalog & discovery

- `pi.dev/packages` is an **index of npm packages**, not a separate registry.
- A package appears there by being **published to npm** with the **`pi-package` keyword**. That keyword is the only gate.
- Git-installed packages work fine for personal/team use but **won't show in the catalog** (the gallery scans npm only).
- One npm package = one catalog entry. The catalog indexes per-package, not per-repo.

## What a Pi package is

- Just a normal **npm package** with a **`pi` manifest** added (a `pi` key in `package.json`) pointing at resource directories.
- Bundles any mix of four resource types: **extensions** (TypeScript that adds tools/commands/events/UI), **skills** (on-demand markdown instructions), **prompt templates** (markdown that becomes slash commands), **themes** (color JSON).
- If no manifest is present, Pi **auto-discovers** from conventional directories named for each resource type.
- **No build step** — Pi loads TypeScript directly (via jiti), so packages ship source, not compiled output.

## Dependency model

- **Pi core packages** → declared as **peer dependencies** (wildcard range), never bundled. Pi provides them at runtime.
- **Third-party runtime deps** → normal dependencies. Pi installs them automatically on package install.
- **Runtime deps must be in `dependencies`, never `devDependencies`.** Package installs run `npm install --omit=dev`, so `devDependencies` are not present at runtime. Anything an extension imports when it runs (validation/format/lint libs, runtime libs) belongs in `dependencies`. Tooling used only to lint the repo's own sources stays in `devDependencies` — a separate concern.
- **Depending on another Pi package** is the exception → must be bundled (`dependencies` + `bundledDependencies`), not peered.
- The "files" list controls what actually ships in the npm tarball: resource dirs + README only (internal `docs/` stay out of the tarball).

## Repo strategy (the chosen approach)

- **One repo per publishable package.** The repo root _is_ the package: root `package.json` is the published manifest (not `private`, no `workspaces`), resource directories sit at the top level, and the root `README.md` is both the GitHub landing page and the npm page.
- Each package is its **own npm package** → its **own catalog entry** → independently installable and versioned.
- Why this over alternatives:
  - **vs. one giant package**: users can install just the piece they want; each is independently discoverable. Use a single package only when the pieces are meaningless apart (e.g. an extension plus the skill that drives it).
  - **vs. a `packages/*` monorepo**: the headline monorepo win is workspace-linked internal deps — and Pi rules that out. A Pi package depending on another Pi package **must be bundled** (see the dependency model above), not peered or workspace-linked, so cross-package sharing requires real publishing either way. That leaves shared config as the only benefit, which is a template-repo problem, not a monorepo problem. Against it: a monorepo gives a landing README about the repo rather than the package, ambiguous tags (`pi-artifacts@0.9.0` vs `v0.9.0`), CI that runs everything on every push, and a fuzzier source-review surface for a package type users are told to review before installing.
- **Publishing is unaffected by repo layout.** The npm scope belongs to the account, not the repo; package name, version history, `pi update`, and catalog indexing all key on the npm package name. Only `repository`/`bugs`/`homepage` metadata reference the repo.

### Repo setup defaults

- Keep the root `package.json` publishable: `pi-package` keyword, `pi` manifest, tight `files` list, `publishConfig.access: "public"` for scoped names.
- Put runtime dependencies in `dependencies`; keep repo-only tooling in `devDependencies`. Pi core packages and `typebox` go in **both** `peerDependencies` (`"*"`) and `devDependencies` (concrete version), so local development resolves the same imports the published package gets at runtime.
- Give the package a tight `files` list from the start: resource directories (`extensions`, `skills`, `prompts`, `themes`) plus README/LICENSE and any assets needed at runtime/catalog time.
- Add `pi.image` or `pi.video` later when there is a meaningful preview for the catalog.
- For package #2, copy the config set (`biome.json`, `knip.json`, `tsconfig.json`, `.markdownlint-cli2.yaml`, `.editorconfig`, `.github/workflows/ci.yml`) from this repo, or extract a template repo once the duplication actually bites.

### Formatter config (`biome.json`) — why it exists

The repo's own formatter is **Prettier** (2-space, per `.editorconfig`); biome is
**not** a project dependency. But the pi-lens editor agent runs a biome-based
auto-format on files it writes, and biome's default indentation is **tabs** —
which silently re-tabs edited files and then fails `prettier --check` right
before publish (it bit 0.2.0 and 0.3.0). The root `biome.json` pins biome to
`indentStyle: space`, `indentWidth: 2`, so the agent's auto-format agrees with
Prettier. Biome discovers it by walking up from each edited file, so one
root file covers the whole repo. It is repo-root only (not in the package's
`files`), so it never ships in a tarball. Verified empirically: with the config,
`biome format` reports "No fixes applied" on Prettier-clean files; without it,
biome re-tabs them.

### Extension conventions (cross-cutting)

Conventions that apply to every extension-bearing package in this repo, verified against the Pi docs:

- **No background work in the extension factory.** Pi may run the factory in invocations that never start a session, so do not start sockets/servers/file-watchers/timers there. Start session-scoped resources in `session_start` (or lazily on first use) and tear them down in an **idempotent `session_shutdown`** handler.
- **Rebrand-safe paths.** Pi's config dir name is configurable (`CONFIG_DIR_NAME`, default `.pi`; forks rename it). Derive any `~/.pi/...` path as `join(os.homedir(), CONFIG_DIR_NAME, ...)` instead of hardcoding `.pi`. `CONFIG_DIR_NAME` is exported from `@earendil-works/pi-coding-agent`.
- **Peer imports.** Importing any Pi core package (`@earendil-works/pi-coding-agent`, `pi-ai`, `pi-agent-core`, `pi-tui`) or `typebox` → declare it in `peerDependencies` with `"*"`. Pi provides these at runtime; declare only the ones actually imported.

### Naming

- **Repo**: one per package, named for the package → `pi-artifacts` on GitHub.
- **Packages**: scoped under the GitHub/npm username → `@jakeryderv/pi-*`.
- **First package**: `@jakeryderv/pi-artifacts`.
- The npm identity is what appears in install commands and catalog entries — the repo name is just a human label.

## Lifecycle

- **Develop**: run Pi with the working copy loaded live; edit and re-run. Optionally install locally into a real project to test the installed shape.
- **Publish**: bump version, publish each package to npm independently (scoped packages need public access, especially on first publish).
- **Update (user side)**: Pi compares installed vs latest npm version and pulls latest on update. Pinned-version installs are never auto-updated — so cut real semver bumps for changes to propagate.
- **Release automation**: a conventional-commits → auto-changelog → version-bump → auto-publish flow is simpler per-repo than per-package-in-a-monorepo (tags are unambiguous, one version per repo). Worth setting up once release cadence picks up.

## Sources of truth & caveats

- **Build against the official docs/examples** for correctness: the Pi docs site, the packages spec doc, and the maintainers' extension examples folder. The _conventions_ there are authoritative.
- The popular **`pi-package-template`** is **community-published (by s1m0n38), not official**. It's a convenient scaffold, not a blessed reference — and its CI/release scaffolding is the genuinely reusable part. Review third-party source before relying on it.
- **Package scope naming — two distinct scopes, don't conflate them**:
  - **Your publish scope** stays **`@jakeryderv/pi-*`**. This is the npm identity that appears in install commands and catalog entries. It is unaffected by anything Pi does with its own scope.
  - **Pi's core import scope** is **`@earendil-works/*`** — relevant _only_ as the `peerDependencies` import names you declare (e.g. `@earendil-works/pi-coding-agent`). The note that "the project moved to `@earendil-works/*`" refers to **Pi's** packages, not yours. Match this scope only for the peer-dep imports the installed Pi CLI exposes; older material may reference the previous names.

## Security framing

- Pi packages run with **full system access** — extensions execute arbitrary code, and skills can instruct the model to run anything. There's no built-in permission sandbox.
- Users are told to review source before installing, so a clean public repo, clear README, and honest description help adoption.
