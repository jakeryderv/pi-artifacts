import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { ArtifactManifest, ArtifactStack } from "./types.ts";

export interface ArtifactDemo {
  id: ArtifactStack;
  title: string;
  description: string;
  path: string;
  entryPath: string;
  manifest: ArtifactManifest;
}

const demosRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "demos");
const demoTimestamp = "2026-08-20T00:00:00.000Z";

const demoDefinitions = {
  markdown: {
    title: "Markdown Artifact Showcase",
    description:
      "Portable report features including alerts, tasks, tables, math, highlighted code, Mermaid, footnotes, and local assets.",
    entry: "index.md",
  },
  html: {
    title: "HTML Artifact Showcase",
    description:
      "Declarative dashboard features including metrics, cards, Chart.js, Mermaid, icons, tables, and an artifact-local JSON feed.",
    entry: "index.html",
  },
} satisfies Record<
  ArtifactStack,
  { title: string; description: string; entry: string }
>;

const demos = Object.freeze(
  Object.fromEntries(
    Object.entries(demoDefinitions).map(([id, definition]) => {
      const stack = id as ArtifactStack;
      const path = join(demosRoot, stack);
      return [
        stack,
        {
          id: stack,
          title: definition.title,
          description: definition.description,
          path,
          entryPath: join(path, definition.entry),
          manifest: {
            id: stack,
            title: definition.title,
            stack,
            entry: definition.entry,
            created: demoTimestamp,
            updated: demoTimestamp,
            cwd: "package:demos",
          },
        },
      ];
    }),
  ) as Record<ArtifactStack, ArtifactDemo>,
);

export function listArtifactDemos(): ArtifactDemo[] {
  return Object.values(demos);
}

export function getArtifactDemo(id: string): ArtifactDemo | undefined {
  return Object.hasOwn(demos, id) ? demos[id as ArtifactStack] : undefined;
}
