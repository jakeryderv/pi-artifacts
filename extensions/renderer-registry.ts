import { renderHtmlPage } from "./html.ts";
import { renderMarkdownPage } from "./markdown.ts";
import { ARTIFACT_ENTRY_FILES, isRegisteredArtifactStack } from "./stacks.ts";
import type { ArtifactStack, RenderArtifactDetails } from "./types.ts";
import { validateHtmlArtifact } from "./validation/html.ts";
import { validateMarkdownArtifact } from "./validation/markdown.ts";
import type { ArtifactPageChrome } from "./viewer-ui.ts";

export interface ArtifactRenderer {
  stack: ArtifactStack;
  entryFile: string;
  validate: (
    entryPath: string,
  ) => Promise<Pick<RenderArtifactDetails, "warnings" | "errors">>;
  render: (
    source: string,
    title: string,
    artifact?: string | ArtifactPageChrome,
  ) => string;
}

/** Built-in renderer registry: the single dispatch point for artifact stacks. */
const ARTIFACT_RENDERERS = Object.freeze({
  markdown: {
    stack: "markdown",
    entryFile: ARTIFACT_ENTRY_FILES.markdown,
    validate: validateMarkdownArtifact,
    render: renderMarkdownPage,
  },
  html: {
    stack: "html",
    entryFile: ARTIFACT_ENTRY_FILES.html,
    validate: validateHtmlArtifact,
    render: renderHtmlPage,
  },
} satisfies Record<ArtifactStack, ArtifactRenderer>);

export function getArtifactRenderer(stack: string): ArtifactRenderer {
  if (!isRegisteredArtifactStack(stack)) {
    throw new Error(`Unsupported artifact stack: ${stack}`);
  }
  return ARTIFACT_RENDERERS[stack];
}
