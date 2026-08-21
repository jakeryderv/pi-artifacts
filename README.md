# @jakeryderv/pi-artifacts

[![npm version](https://img.shields.io/npm/v/%40jakeryderv%2Fpi-artifacts?logo=npm&color=cb3837)](https://www.npmjs.com/package/@jakeryderv/pi-artifacts)
[![CI](https://github.com/jakeryderv/pi-artifacts/actions/workflows/ci.yml/badge.svg)](https://github.com/jakeryderv/pi-artifacts/actions/workflows/ci.yml)
[![MIT license](https://img.shields.io/npm/l/%40jakeryderv%2Fpi-artifacts?color=2563eb)](LICENSE)

Rich visualization artifacts for the [Pi coding agent](https://pi.dev/).
Scaffold, validate, preview, manage, and export portable Markdown documents and
declarative HTML dashboards from a Pi session.

The package includes a live localhost viewer, a content-only HTML component
runtime, artifact-local JSON feeds, Chart.js and Mermaid rendering, and portable
single-file HTML export. See the
[changelog](https://github.com/jakeryderv/pi-artifacts/blob/main/CHANGELOG.md)
for release history.

## Install

```bash
pi install npm:@jakeryderv/pi-artifacts
```

Try it for one run without changing Pi settings:

```bash
pi -e npm:@jakeryderv/pi-artifacts
```

## Quickstart

Ask Pi to create and render an artifact:

```text
Create a markdown artifact titled "Demo Report" with a heading, a short note callout, a task list, and a small table. Then render it.
```

Or create an HTML dashboard:

```text
Create an html artifact titled "Q4 Dashboard" with a summary section and a bar chart of quarterly revenue. Then render it.
```

Pi scaffolds a bundle, authors its entry file, validates it, and returns a
localhost preview URL. Run `/viewer` to open the live artifact gallery, or
`/artifacts-demo` to explore the package-owned Markdown and HTML showcases.

## Capabilities

### Artifact stacks

- **Markdown:** Prettier, markdownlint, strict KaTeX math, task lists,
  GitHub-style alerts, footnotes, syntax highlighting, and Mermaid diagrams.
- **HTML:** Prettier, HTMLHint, Pico CSS, declarative components, artifact-local
  JSON feeds, Chart.js, Mermaid, and icons—with no authored JavaScript or build
  step.
- **Standalone export:** one self-contained HTML file with required runtime
  resources and bundle assets embedded for offline use.

### Tools

| Tool                | Purpose                                                  |
| ------------------- | -------------------------------------------------------- |
| `scaffold_artifact` | Create an empty Markdown or HTML bundle to author into.  |
| `render_artifact`   | Validate, normalize, and preview a bundle.               |
| `export_artifact`   | Write a portable single-file HTML export.                |
| `list_artifacts`    | List bundles by session, workspace, or across the store. |
| `delete_artifact`   | Delete one bundle and its files.                         |
| `delete_artifacts`  | Bulk-delete bundles by ID and/or age.                    |

### Commands

| Command                            | Purpose                                              |
| ---------------------------------- | ---------------------------------------------------- |
| `/viewer`                          | Open the searchable, live-updating artifact gallery. |
| `/artifacts-demo [markdown\|html]` | Open the read-only package demo gallery or one demo. |
| `/viewer-mode app\|browser\|off`   | Choose and persist how the viewer opens.             |
| `/viewer-auto on\|off`             | Control whether successful renders auto-show.        |
| `/artifacts-clean [days]`          | Inspect store size or delete older artifacts.        |

The included `artifacts-authoring` skill teaches Pi the bundle workflow and
portable authoring conventions.

## Storage

Artifacts are content-only bundles stored under `~/.pi/artifacts/<id>/` by
default, using Pi's configured directory name rather than a hardcoded `.pi`.
Each bundle contains `manifest.json`, one entry file, `assets/`, and optional
generated `exports/`. Provenance metadata records the originating session and
workspace.

## Security

Pi packages execute with the user's system permissions, so review source before
installation. Artifact previews bind only to localhost and use capability URLs,
filesystem containment, restrictive Content Security Policies, and a
package-owned runtime boundary. Read the
[security architecture](https://github.com/jakeryderv/pi-artifacts/blob/main/docs/security.md)
and [reporting policy](https://github.com/jakeryderv/pi-artifacts/blob/main/SECURITY.md)
for details.

## Documentation

- [API contract](https://github.com/jakeryderv/pi-artifacts/blob/main/docs/api.md)
- [Roadmap](https://github.com/jakeryderv/pi-artifacts/blob/main/docs/roadmap.md)
- [Security architecture](https://github.com/jakeryderv/pi-artifacts/blob/main/docs/security.md)
- [Changelog](https://github.com/jakeryderv/pi-artifacts/blob/main/CHANGELOG.md)
- [Contributing](https://github.com/jakeryderv/pi-artifacts/blob/main/CONTRIBUTING.md)

## License

[MIT](LICENSE)
