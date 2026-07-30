import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (p) => readFile(new URL(p, root), "utf8");

test("chapter directory page lists every chapter with relative links", async () => {
  const html = await read("out/chapters/index.html");
  assert.match(html, /chapter directory/i);
  assert.match(html, /Motion, forces/);
  assert.match(html, /Thermal physics/);
  assert.match(html, /Electricity &(amp;)? magnetism|Electricity & magnetism/);
  assert.match(html, /Nuclear physics/);
  assert.match(html, /Space physics/);
  assert.match(html, /href="\.\.\/"/);
  assert.match(html, /href="\.\.\/chapter-1\/"/);
  assert.match(html, /href="\.\.\/chapter-2\/"/);
  assert.match(html, /href="\.\.\/chapter-5\/"/);
  assert.match(html, /href="\.\.\/chapter-6\/"/);
  assert.doesNotMatch(html, /href="\/chapter-5/);
});

test("directory carries its own metadata", async () => {
  const html = await read("out/chapters/index.html");
  assert.match(html, /og:image/);
  assert.match(html, /Chapter directory|IGCSE Physics chapters/);
});

test("home page chapter nav links previous to Chapter 2 and next to Chapter 5", async () => {
  const html = await read("out/index.html");
  assert.match(html, /Chapter navigation/);
  assert.match(html, /Previous/);
  assert.match(html, /Thermal physics/);
  assert.match(html, /Next/);
  assert.match(html, /Nuclear physics/);
  assert.match(html, /href="chapters\/"/);
  assert.match(html, /href="chapter-2\/"/);
  assert.match(html, /href="chapter-5\/"/);
});

test("Chapter 2 nav links previous to Chapter 1 and next to Chapter 4", async () => {
  const html = await read("out/chapter-2/index.html");
  assert.match(html, /Chapter navigation/);
  assert.match(html, /Previous/);
  assert.match(html, /Motion, forces/);
  assert.match(html, /Next/);
  assert.match(html, /Electricity &(amp;)? magnetism/);
  assert.match(html, /href="\.\.\/chapter-1\/"/);
  assert.match(html, /href="\.\.\/"/);
});

test("Chapter 5 has previous-chapter nav pointing back to Chapter 4 and next to Chapter 6", async () => {
  const html = await read("out/chapter-5/index.html");
  assert.match(html, /Chapter navigation/);
  assert.match(html, /Previous/);
  assert.match(html, /Electricity &(amp;)? magnetism/);
  assert.match(html, /Next/);
  assert.match(html, /Space physics/);
  assert.match(html, /href="\.\.\/chapters\/"/);
  assert.match(html, /href="\.\.\/"/);
  assert.match(html, /href="\.\.\/chapter-6\/"/);
});

test("Chapter 6 has previous-chapter nav pointing back to Chapter 5", async () => {
  const html = await read("out/chapter-6/index.html");
  assert.match(html, /Chapter navigation/);
  assert.match(html, /Previous/);
  assert.match(html, /Nuclear physics/);
  assert.match(html, /href="\.\.\/chapter-5\/"/);
  assert.match(html, /href="\.\.\/chapters\/"/);
});
