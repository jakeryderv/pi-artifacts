# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/2.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.11.0] - 2026-08-31

### Added

- Add GitHub issue forms, a pull request template, Dependabot configuration,
  and a custom social preview asset for a more complete project presence.
- Add npm version, CI status, and license badges to the README.

### Changed

- Create GitHub Releases from curated changelog sections after successful npm
  publishes.
- Limit the regular CI workflow to branch and pull request events so release
  tags do not run the same preflight twice.
- Decouple the artifact store from Pi and from the renderers. Every
  `extensions/store.ts` function now takes an explicit `root`; `artifactsRoot()`
  moved to `extensions/artifact-root.ts`, and the artifact stack table moved to
  `extensions/stacks.ts`. Reading or listing a bundle no longer loads
  `@earendil-works/pi-coding-agent`, prettier, KaTeX or markdownlint.
- Stop autolinking bare domains in rendered Markdown. markdown-it 15 disables
  linkify-it's fuzzy matching by default, so text such as `example.com` now
  renders literally instead of becoming a link. Explicit `[text](url)` links,
  `<https://autolinks>`, and e-mail addresses are unaffected, and URLs adjacent
  to CJK text no longer swallow the following characters.

## [0.10.0] - 2026-08-20

### Added

- Add `npm run dev` to load the working copy in Pi from an automatically cleaned
  temporary directory.
- Add package-owned Markdown and HTML showcases with an `/artifacts-demo`
  gallery that stays separate from the user artifact store.

### Changed

- Split contributor guidance, security policy and architecture, and release
  history into dedicated documents while streamlining the package README.

### Fixed

- Render display-math blocks containing common backslash-prefixed KaTeX
  commands instead of leaving their delimiters visible.

## [0.9.2] - 2026-08-20

### Security

- Resolve the real artifact store, bundle, and entry paths before validation or
  rendering, rejecting entry-file and bundle-directory symlink escapes.
- Raise the Mermaid minimum above vulnerable 11.16.0 releases and refresh the
  locked Mermaid, DOMPurify, and brace-expansion dependency paths.

## [0.9.1] - 2026-07-25

### Changed

- Flatten the original monorepo into a single-package repository without
  changing the npm package identity.
- Publish tag-triggered releases through npm trusted publishing with provenance.

### Fixed

- Correct the package repository and homepage metadata after the repository
  move.

## [0.9.0] - 2026-07-15

### Added

- Add `export_artifact` and viewer download actions for portable single-file
  HTML exports from both artifact stacks.
- Embed package runtime styles and scripts, KaTeX fonts, icons, referenced
  images, artifact-local JSON feeds, and other bundle assets.

### Security

- Add a standalone CSP, grant nonces only to embedded package runtime scripts,
  disable network connections, and remove authored executable hooks from
  exports.

## [0.8.1] - 2026-07-15

### Fixed

- Parse Markdown math only from text tokens so code and ambiguous currency
  remain literal.
- Use independent atomic temporary files for concurrent manifest updates.

### Security

- Reject artifact IDs outside the generated single-segment format.
- Raise the minimum `markdown-it` version to the patched 14.3 release line.

## [0.8.0] - 2026-07-15

### Added

- Add declarative grid, card, metric, chart, table, and data-source components
  for HTML artifacts.
- Add artifact-local JSON snapshot feeds with dotted field selection.

### Changed

- Centralize stack entry filenames, validation, and page rendering in a typed
  renderer registry.
- Improve Chromium app-window liveness, launch-failure, shutdown, and temporary
  profile handling.

### Security

- Protect viewer pages, Server-Sent Events, artifacts, and assets with a random
  per-server capability path.
- Confine component feeds to the active bundle's `assets/` directory.

## [0.7.0] - 2026-07-15

### Added

- Add session, workspace, and all-artifact scopes to the viewer and
  `list_artifacts`.

## [0.6.0] - 2026-07-15

### Added

- Render Mermaid diagrams in both artifact stacks.
- Add syntax highlighting, footnotes, bulk deletion, and `/artifacts-clean`.

### Changed

- Write manifests atomically to prevent truncated shared-store state.

## [0.5.0] - 2026-06-27

### Added

- Add persistent viewer and artifact toolbars, gallery search and filters, and
  render-status badges.
- Store the latest render outcome and finding codes in artifact manifests.

### Security

- Reject artifact JavaScript files and warn about authored executable HTML.

## [0.4.0] - 2026-06-27

### Added

- Add persistent `/viewer-mode` and `/viewer-auto` settings.
- Reuse an open viewer window when a new artifact renders.

## [0.3.0] - 2026-06-27

### Added

- Add the session-reactive viewer with Server-Sent Events for render, delete,
  and navigation updates.

## [0.2.0] - 2026-06-27

### Added

- Add the HTML artifact stack with Prettier, HTMLHint, Pico CSS, declarative
  Chart.js specifications, icons, and the shared runtime namespace.

### Security

- Apply a strict preview CSP and keep authored HTML JavaScript outside the
  supported capability model.

## [0.1.0] - 2026-06-25

### Added

- Add the Markdown artifact core loop: scaffold, validate, render, list, and
  delete tools; durable bundles; a localhost preview server; `/viewer`; and the
  artifact-authoring skill.

[Unreleased]: https://github.com/jakeryderv/pi-artifacts/compare/v0.11.0...HEAD
[0.11.0]: https://github.com/jakeryderv/pi-artifacts/compare/v0.10.0...v0.11.0
[0.10.0]: https://github.com/jakeryderv/pi-artifacts/compare/v0.9.2...v0.10.0
[0.9.2]: https://github.com/jakeryderv/pi-artifacts/compare/v0.9.1...v0.9.2
[0.9.1]: https://github.com/jakeryderv/pi-artifacts/compare/pi-artifacts-v0.9.0...v0.9.1
[0.9.0]: https://github.com/jakeryderv/pi-artifacts/compare/pi-artifacts-v0.8.1...pi-artifacts-v0.9.0
[0.8.1]: https://github.com/jakeryderv/pi-artifacts/compare/pi-artifacts-v0.8.0...pi-artifacts-v0.8.1
[0.8.0]: https://github.com/jakeryderv/pi-artifacts/compare/9f6be16...pi-artifacts-v0.8.0
[0.7.0]: https://github.com/jakeryderv/pi-artifacts/commit/9f6be16
[0.6.0]: https://github.com/jakeryderv/pi-artifacts/commit/fc9b33c
[0.5.0]: https://github.com/jakeryderv/pi-artifacts/compare/pi-artifacts-v0.4.0...pi-artifacts-v0.5.0
[0.4.0]: https://github.com/jakeryderv/pi-artifacts/compare/pi-artifacts-v0.3.0...pi-artifacts-v0.4.0
[0.3.0]: https://github.com/jakeryderv/pi-artifacts/compare/pi-artifacts-v0.2.0...pi-artifacts-v0.3.0
[0.2.0]: https://github.com/jakeryderv/pi-artifacts/compare/pi-artifacts-v0.1.0...pi-artifacts-v0.2.0
[0.1.0]: https://github.com/jakeryderv/pi-artifacts/releases/tag/pi-artifacts-v0.1.0
