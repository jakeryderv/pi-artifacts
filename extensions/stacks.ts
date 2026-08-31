import type { ArtifactStack } from "./types.ts";

/**
 * The artifact stacks this package understands, and the entry file each one
 * scaffolds and renders from.
 *
 * Deliberately data-only and free of runtime imports. The store needs to know
 * which stacks exist and what their entry file is called, but not how to render
 * one — `renderer-registry.ts` binds these stacks to the markdown/HTML
 * renderers, and pulls in prettier, KaTeX and markdownlint to do it. Keeping the
 * table here means reading or listing a bundle never loads a renderer.
 */
export const ARTIFACT_ENTRY_FILES = Object.freeze({
  markdown: "index.md",
  html: "index.html",
} satisfies Record<ArtifactStack, string>);

export function isRegisteredArtifactStack(
  stack: string,
): stack is ArtifactStack {
  return Object.hasOwn(ARTIFACT_ENTRY_FILES, stack);
}

export function entryFileForStack(stack: ArtifactStack): string {
  return ARTIFACT_ENTRY_FILES[stack];
}
