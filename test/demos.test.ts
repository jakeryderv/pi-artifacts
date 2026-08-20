import assert from "node:assert/strict";
import { cp, mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test, { type TestContext } from "node:test";

import { getArtifactDemo, listArtifactDemos } from "../extensions/demos.ts";
import { getArtifactRenderer } from "../extensions/renderer-registry.ts";
import {
  BASELINE_CSP,
  createPreviewServerState,
} from "../extensions/server.ts";

test("every artifact stack has a clean, formatted package demo", async (t) => {
  const root = await makeTempRoot(t);
  const demos = listArtifactDemos();

  assert.deepEqual(demos.map((demo) => demo.id).sort(), ["html", "markdown"]);

  for (const demo of demos) {
    assert.equal(getArtifactDemo(demo.id), demo);
    const copyPath = join(root, demo.id);
    await cp(demo.path, copyPath, { recursive: true });
    const entryPath = join(copyPath, demo.manifest.entry);
    const before = await readFile(entryPath, "utf8");
    const validation = await getArtifactRenderer(demo.manifest.stack).validate(
      entryPath,
    );
    const after = await readFile(entryPath, "utf8");

    assert.deepEqual(validation.errors, [], `${demo.id} demo has errors`);
    assert.deepEqual(validation.warnings, [], `${demo.id} demo has warnings`);
    assert.equal(after, before, `${demo.id} demo is not formatted`);
  }

  assert.equal(getArtifactDemo("unknown"), undefined);
});

test("preview server serves demos outside the artifact store", async (t) => {
  const root = await makeTempRoot(t);
  const server = await createPreviewServerState(root);
  t.after(() => server.close());

  assert.ok(server.demosUrl);
  const galleryResponse = await fetch(server.demosUrl);
  const gallery = await galleryResponse.text();
  assert.equal(
    galleryResponse.headers.get("content-security-policy"),
    BASELINE_CSP,
  );
  assert.match(gallery, /Pi Artifacts Demos/);
  assert.match(gallery, /Markdown Artifact Showcase/);
  assert.match(gallery, /HTML Artifact Showcase/);
  assert.match(gallery, /Read-only showcases/);
  assert.match(gallery, /data-artifact-id="__package-demos__"/);

  const viewer = await (await fetch(server.viewerUrl!)).text();
  assert.doesNotMatch(viewer, /Markdown Artifact Showcase/);
  assert.doesNotMatch(viewer, /HTML Artifact Showcase/);

  const markdownUrl = server.demoUrl("markdown");
  assert.ok(markdownUrl);
  const markdown = await (await fetch(markdownUrl)).text();
  assert.match(markdown, /Project snapshot/);
  assert.match(markdown, /class="katex"/);
  assert.match(markdown, /class="katex-display"/);
  assert.match(markdown, /class="mermaid"/);
  assert.match(markdown, /← Demos/);
  assert.match(markdown, /Package demo/);
  assert.doesNotMatch(markdown, /← Gallery/);

  const markdownAsset = await fetch(`${markdownUrl}assets/lifecycle.svg`);
  assert.equal(markdownAsset.status, 200);
  assert.match(await markdownAsset.text(), /Artifact lifecycle/);

  const htmlUrl = server.demoUrl("html");
  assert.ok(htmlUrl);
  const html = await (await fetch(htmlUrl)).text();
  assert.match(html, /Portfolio summary/);
  assert.match(html, /<pi-data-source/);
  assert.match(html, /<pi-chart/);
  assert.match(html, /class="mermaid"/);

  const feed = await fetch(`${htmlUrl}assets/showcase.json`);
  assert.equal(feed.status, 200);
  const feedJson = (await feed.json()) as {
    summary: { artifacts: number };
  };
  assert.equal(feedJson.summary.artifacts, 126);

  const exported = await fetch(`${htmlUrl}export`);
  assert.equal(exported.status, 200);
  assert.match(
    exported.headers.get("content-disposition") ?? "",
    /filename="html\.html"/,
  );
  const exportedHtml = await exported.text();
  assert.match(exportedHtml, /data-pi-export-json=/);
  assert.match(exportedHtml, /<use href="#trending-up"/);
  assert.doesNotMatch(
    exportedHtml,
    /<(?:script|link)\b[^>]*(?:src|href)="\/runtime\//,
  );

  assert.equal(server.demoUrl("unknown"), undefined);
  const unknown = await fetch(`${server.demosUrl}/unknown/`);
  assert.equal(unknown.status, 404);
});

async function makeTempRoot(t: TestContext): Promise<string> {
  const root = await mkdtemp(join(tmpdir(), "pi-artifacts-demo-test-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  return root;
}
