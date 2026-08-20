# Security Policy

## Supported versions

Security fixes are made for the latest version published to npm.

| Version            | Supported |
| ------------------ | --------- |
| Latest npm release | Yes       |
| Older releases     | No        |

Users should update before reporting a problem that may already be fixed.

## Reporting a vulnerability

Do not disclose suspected vulnerabilities in a public issue, discussion, or
pull request.

Use [GitHub private vulnerability reporting](https://github.com/jakeryderv/pi-artifacts/security/advisories/new)
to submit a report. If the private reporting form is unavailable, open a public
issue containing no sensitive details and ask the maintainer to establish a
private reporting channel.

Include, when possible:

- the affected package version and environment,
- the relevant artifact stack or command,
- reproduction steps or a minimal artifact bundle,
- the impact and required attacker capabilities,
- any suggested mitigation.

Reports will be acknowledged and evaluated as promptly as practical. Please
allow time for investigation and a coordinated fix before publishing details.

## Security model

Pi packages execute with the user's system permissions, so installing the
package is a trust decision. The artifact content, preview server, filesystem,
and export boundaries are documented in
[`docs/security.md`](docs/security.md).
