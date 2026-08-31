import { homedir } from "node:os";
import { join } from "node:path";

import { CONFIG_DIR_NAME } from "@earendil-works/pi-coding-agent";

/**
 * Where this Pi installation keeps its durable artifact store.
 *
 * This is the one place that answers "which directory?", and the only module
 * in the store path that imports from Pi. `store.ts` deliberately knows how to
 * read a bundle but not where bundles live: every store function takes an
 * explicit root, so it stays usable by callers that serve artifacts from their
 * own root outside the Pi process.
 *
 * Derived from `CONFIG_DIR_NAME` rather than a hardcoded `.pi` so it stays
 * correct under rebranded Pi distributions. Defaults to `~/.pi/artifacts/`.
 */
export function artifactsRoot(): string {
  return join(homedir(), CONFIG_DIR_NAME, "artifacts");
}
