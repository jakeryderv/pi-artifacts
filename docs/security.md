# Security Architecture

This document describes the trust boundaries and enforcement mechanisms in
`@jakeryderv/pi-artifacts`. Vulnerability-reporting instructions and supported
versions live in the repository-level [`SECURITY.md`](../SECURITY.md).

## Trust model

Pi packages execute with the user's system permissions. The package itself is
trusted code and is not sandboxed by Pi; users should review package source and
dependencies before installation.

Artifact content is less trusted. Markdown, HTML, JSON feeds, and assets may be
authored by an agent, so the package treats bundles as content rather than as
applications. The design aims to prevent authored content from becoming an
arbitrary local-code or network-execution surface.

## Artifact storage

Artifacts are stored beneath the rebrand-safe Pi configuration directory at
`join(os.homedir(), CONFIG_DIR_NAME, "artifacts")`. Each bundle has one generated
slug ID and contains a manifest, one stack-specific entry file, optional assets,
and generated exports.

Store operations:

- accept only one generated artifact ID segment,
- reject lexical path traversal,
- resolve the real store, bundle, and entry paths before loading,
- reject bundle-directory or entry-file symlinks that escape their boundary,
- write manifests and exports through unique temporary files followed by an
  atomic rename.

Artifact asset serving and standalone export also compare real paths so symlinks
cannot escape the active bundle.

## Preview server

The preview server starts only when `/viewer`, `/artifacts-demo`, or a successful
render needs it. It closes during session shutdown and:

- binds to `127.0.0.1` on an ephemeral port,
- permits only `GET` and `HEAD`,
- requires a random 256-bit capability path for gallery pages, Server-Sent
  Events, artifact pages, exports, and artifact assets,
- applies no-store, no-referrer, MIME-sniffing, and same-origin resource
  headers,
- sends a restrictive Content Security Policy on every response,
- rejects artifact JavaScript files and path traversal.

The capability URL is a bearer secret. It reduces exposure to unrelated local
processes scanning localhost ports, but it is not a substitute for operating
system account isolation. A process that can read the user's terminal output,
browser state, or process memory may be able to recover it.

The stable `/runtime` namespace is intentionally outside the capability path.
It serves only immutable package-owned static resources and never artifact or
user data.

Package demos are also immutable package-owned content, but remain behind the
capability path under a dedicated `/demos` namespace. They are resolved from the
installed package, never copied into the artifact store, and cannot collide with
or shadow user artifact IDs. Demo asset serving uses the same real-path
containment and executable-file restrictions as user bundles.

## Authored HTML and runtime JavaScript

HTML artifacts are declarative content. The baseline preview CSP includes
`script-src 'self'`, while executable package code is served only from the
package-owned `/runtime` namespace.

Validation warns about authored executable features, including:

- inline executable `<script>` elements,
- authored `<script src>` elements,
- inline `on*` event handlers,
- `javascript:` URLs.

Artifact `.js` files are not served. JSON script blocks used for declarative
Chart.js specifications are data rather than executable authored code.

HTML fragments receive the curated Pico CSS, Chart.js, Mermaid, component,
feed, icon, and live-viewer runtime. Full authored HTML documents opt out of the
shared shell and injected runtime, but they remain subject to the preview
server's response headers and CSP.

Inline styles are allowed because authored visualizations need them. CSS can
therefore control presentation within an artifact page; the design does not
attempt to make hostile HTML visually trustworthy.

## Markdown and data feeds

Markdown is rendered server-side. Raw authored JavaScript does not become a
runtime capability. Mermaid diagrams are hydrated by package-owned runtime code
under the same preview CSP.

`<pi-data-source>` accepts only JSON beneath the current bundle's `assets/`
directory. Remote, absolute, root-relative, encoded, traversal, and
cross-artifact sources are rejected. Feed-derived metrics and table cells are
inserted with DOM `textContent`, not interpreted as HTML.

## Standalone exports

Standalone HTML exports embed required package styles, scripts, fonts, icons,
artifact-local JSON, and referenced assets. Export generation:

- confines every referenced asset to the real artifact bundle,
- removes authored executable scripts and event handlers,
- neutralizes `javascript:` URLs,
- assigns a random nonce only to embedded package-owned runtime scripts,
- injects a restrictive meta CSP with network connections disabled.

The export is designed to remain useful as one offline file. As with any HTML
received from another party, users should avoid weakening browser protections
when opening an untrusted export.

## Security maintenance

Runtime dependencies are locked, and maintainers review current audit results
during dependency and security maintenance. The tag-triggered release workflow
performs a clean install, runs the complete test and packaging preflight, and
publishes through npm trusted publishing with a provenance attestation.

Security changes should include focused regression tests and a user-facing
entry in [`CHANGELOG.md`](../CHANGELOG.md).
