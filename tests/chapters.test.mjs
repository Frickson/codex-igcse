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
  assert.match(html, /href="\.\.\/chapter-3\/"/);
  assert.match(html, /href="\.\.\/chapter-4\/"/);
  assert.match(html, /href="\.\.\/chapter-5\/"/);
  assert.match(html, /href="\.\.\/chapter-6\/"/);
  assert.doesNotMatch(html, /Coming soon/);
  assert.doesNotMatch(html, /<nav[^>]+aria-label="Chapters"/);
  assert.doesNotMatch(html, /href="\/chapter-5/);
});

test("directory carries its own metadata", async () => {
  const html = await read("out/chapters/index.html");
  assert.match(html, /og:image/);
  assert.match(html, /Chapter directory|IGCSE Physics chapters/);
});

test("every chapter uses the Andrew Academy predict-cause-explain rhythm", async () => {
  for (let chapter = 1; chapter <= 6; chapter += 1) {
    const html = await read(`out/chapter-${chapter}/index.html`);
    assert.match(html, /THINK FIRST/, `Chapter ${chapter} should ask for a prediction`);
    assert.match(html, /WHAT CHANGES\?/, `Chapter ${chapter} should visualise the causal change`);
    assert.match(html, /CAMBRIDGE EXAM FOCUS|ANDREW&#x27;S TIP|COMMON MISTAKE|REAL LIFE CONNECTION/, `Chapter ${chapter} should include a signature teaching box`);
  }
});

test("Chapter 4 lesson nav links previous to Chapter 3 and next to Chapter 5", async () => {
  const html = await read("out/chapter-4/index.html");
  assert.match(html, /Chapter navigation/);
  assert.match(html, /Previous/);
  assert.match(html, /Waves/);
  assert.match(html, /Next/);
  assert.match(html, /Nuclear physics/);
  assert.match(html, /href="\.\.\/chapters\/"/);
  assert.match(html, /href="\.\.\/chapter-3\/"/);
  assert.match(html, /href="\.\.\/chapter-5\/"/);
});

test("Chapter 2 nav links previous to Chapter 1 and next to Chapter 3", async () => {
  const html = await read("out/chapter-2/index.html");
  assert.match(html, /Chapter navigation/);
  assert.match(html, /Previous/);
  assert.match(html, /Motion, forces/);
  assert.match(html, /Next/);
  assert.match(html, /Waves/);            // Chapter 3 now follows Chapter 2
  assert.match(html, /href="\.\.\/chapter-1\/"/);
  assert.match(html, /href="\.\.\/chapter-3\/"/);
});

test("Chapter 5 has previous-chapter nav pointing back to Chapter 4 and next to Chapter 6", async () => {
  const html = await read("out/chapter-5/index.html");
  assert.match(html, /Chapter navigation/);
  assert.match(html, /Previous/);
  assert.match(html, /Electricity &(amp;)? magnetism/);
  assert.match(html, /Next/);
  assert.match(html, /Space physics/);
  assert.match(html, /href="\.\.\/chapters\/"/);
  assert.match(html, /href="\.\.\/chapter-4\/"/);
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
