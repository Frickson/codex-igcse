import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (p) => readFile(new URL(p, root), "utf8");

test("chapter directory page lists every chapter with relative links", async () => {
  const html = await read("out/chapters/index.html");
  assert.match(html, /chapter directory/i);
  assert.match(html, /Electricity &(amp;)? magnetism|Electricity & magnetism/);
  assert.match(html, /Nuclear physics/);
  // links from /chapters/ back to the root and to chapter-5 are relative
  assert.match(html, /href="\.\.\/"/);
  assert.match(html, /href="\.\.\/chapter-5\/"/);
  // no absolute paths that break under basePath
  assert.doesNotMatch(html, /href="\/chapter-5/);
});

test("directory carries its own metadata", async () => {
  const html = await read("out/chapters/index.html");
  assert.match(html, /og:image/);
  assert.match(html, /Chapter directory|IGCSE Physics chapters/);
});

test("home page has next-chapter nav pointing to Chapter 5 and the directory", async () => {
  const html = await read("out/index.html");
  assert.match(html, /Chapter navigation/);
  assert.match(html, /Next/);          // home is first chapter, so it shows a Next
  assert.match(html, /Nuclear physics/); // next chapter title
  assert.match(html, /href="chapters\/"/);
  assert.match(html, /href="chapter-5\/"/);
});

test("Chapter 5 has previous-chapter nav pointing back to Chapter 4 and the directory", async () => {
  const html = await read("out/chapter-5/index.html");
  assert.match(html, /Chapter navigation/);
  assert.match(html, /Previous/);
  assert.match(html, /Electricity &(amp;)? magnetism/); // previous chapter title
  assert.match(html, /href="\.\.\/chapters\/"/);
  assert.match(html, /href="\.\.\/"/);
});
