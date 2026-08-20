import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const scratchDir = mkdtempSync(join(tmpdir(), "pi-artifacts-"));

console.log(`Starting Pi from temporary directory: ${scratchDir}`);

let exitSignal;

try {
  const result = spawnSync("pi", ["-e", repoRoot, ...process.argv.slice(2)], {
    cwd: scratchDir,
    stdio: "inherit",
  });

  if (result.error) {
    console.error(`Unable to start Pi: ${result.error.message}`);
    process.exitCode = 1;
  } else if (result.signal) {
    exitSignal = result.signal;
  } else {
    process.exitCode = result.status ?? 1;
  }
} finally {
  rmSync(scratchDir, { force: true, recursive: true });
}

if (exitSignal) {
  process.kill(process.pid, exitSignal);
}
