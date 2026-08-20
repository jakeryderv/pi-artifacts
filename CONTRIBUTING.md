# Contributing

Thanks for helping improve `@jakeryderv/pi-artifacts`. This repository contains
one publishable Pi package; the repository root is the package root.

## Before you start

- Use Node.js 24 and npm 11 to match CI and the release workflow.
- Review [`SECURITY.md`](SECURITY.md) before reporting a vulnerability. Do not
  put sensitive security details in a public issue.
- For substantial product or API changes, open an issue first so the direction
  can be agreed before implementation work begins.

## Set up the repository

```bash
git clone https://github.com/jakeryderv/pi-artifacts.git
cd pi-artifacts
npm ci
```

The main package surfaces are:

- `extensions/` — extension entry point, tools, commands, validation, viewer,
  storage, export, and package-owned browser runtime assets.
- `skills/artifacts-authoring/` — instructions Pi loads when authoring
  artifacts.
- `test/` — Node test runner coverage for the extension internals and local
  preview server.
- `demos/` — package-owned Markdown and HTML showcase bundles served read-only
  by `/artifacts-demo`.
- `docs/` — settled API, roadmap, security, and design documentation.
- `docs/notes/` — exploratory or historical design notes.

## Develop and test

Run the same checks as CI before submitting a pull request:

```bash
npm run typecheck
npm test
npm run format:check
npm run lint:md
npm run lint:deps
npm run pack:check -- --json
```

The server tests bind to `127.0.0.1`; run them in an environment that permits a
localhost listener.

To exercise the complete package for one Pi run without changing persistent Pi
settings:

```bash
npm run dev
```

The launcher resolves the repository path, runs Pi from a temporary directory,
and removes that directory when Pi exits. Pass additional Pi arguments after
`--`, for example `npm run dev -- --model <provider/model>`. Restart Pi after
source changes because `-e` does not hot reload. Do not add this repository to
its own `.pi/settings.json`; that file is reserved for external catalog packages
used by the project.

## Package conventions

- Ship TypeScript source directly. The package has no build step, and
  `tsconfig.json` is typecheck-only.
- Put imports needed while the extension runs in `dependencies`. Keep
  repository-only tooling in `devDependencies`.
- Declare imported Pi core packages and `typebox` as wildcard peer dependencies
  and concrete development dependencies. Pi supplies the peers at runtime.
- Do not start sockets, servers, watchers, or timers in the extension factory.
  Start session resources lazily or during `session_start`, and close them in an
  idempotent `session_shutdown` handler.
- Derive Pi configuration paths with `CONFIG_DIR_NAME`; do not hardcode `.pi`.
- Preserve the package's content-only artifact model and the security boundaries
  described in [`docs/security.md`](docs/security.md).
- Keep the npm `files` list narrow. `npm run pack:check` should contain only
  runtime resources, package demos, `README.md`, and `LICENSE` in addition to
  the automatic package manifest.

More packaging rationale lives in
[`docs/notes/packaging.md`](docs/notes/packaging.md).

## Tests and documentation

- Add focused regression coverage for behavior changes and bug fixes.
- Keep one cleanly validating package demo for every registered artifact stack;
  update demos when user-visible rendering capabilities change.
- Update [`docs/api.md`](docs/api.md) when a tool, command, manifest, or runtime
  contract changes.
- Update [`docs/security.md`](docs/security.md) when a trust boundary or
  enforcement mechanism changes.
- Add notable user-facing changes under `Unreleased` in
  [`CHANGELOG.md`](CHANGELOG.md). Do not copy raw commit subjects into the
  changelog.
- Put settled documentation in `docs/` and exploratory material in
  `docs/notes/`. Root-level community and release documents are deliberate
  exceptions.

## Pull requests

Keep pull requests focused and explain:

- what changed and why,
- any user-visible or compatibility impact,
- the tests or manual checks performed,
- any security or packaging implications.

Do not include unrelated formatting or dependency churn. A pull request should
leave the full CI command set passing.

## Releases

Releases are maintainer-only and tag-triggered:

1. Move the relevant `Unreleased` changelog entries into a dated version.
2. Bump the same version in `package.json` and `package-lock.json`.
3. Run the complete preflight from a clean `npm ci` install.
4. Commit the release and create an annotated `v<version>` tag.
5. Push the commit, then the tag.

`.github/workflows/release.yml` verifies the tag/version match, repeats the full
preflight, and publishes through npm trusted publishing with provenance. Do not
run `npm publish` from a development machine.
