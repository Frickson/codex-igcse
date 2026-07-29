import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("exports the complete interactive lesson", async () => {
  const [html, source] = await Promise.all([
    readFile(new URL("out/index.html", root), "utf8"),
    readFile(new URL("app/page.tsx", root), "utf8"),
  ]);
  assert.match(html, /Field Notes/);
  assert.match(html, /Electricity &amp; Magnetism|Electricity & Magnetism/);
  assert.match(html, /Cambridge IGCSE Physics 0625/);
  assert.match(html, /Interactive field lab/);
  assert.match(source, /Electromagnet circuit/);
  assert.match(source, /indicator bulb/);
  assert.match(source, /across coil/);
  assert.match(html, /Circuit builder/);
  assert.match(html, /Transformer calculator/);
  assert.match(html, /Drag-and-drop circuit/);
  assert.match(html, /Drag-to-induce lab/);
  assert.match(html, /Fuse drop challenge/);
  assert.match(html, /Past-paper patterns/);
  assert.match(html, /Final checkpoint/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("includes GitHub Pages and social assets", async () => {
  await access(new URL("out/.nojekyll", root));
  await access(new URL("out/og.png", root));
  const html = await readFile(new URL("out/index.html", root), "utf8");
  assert.match(html, /og:image/);
  assert.match(html, /twitter:card/);
});
