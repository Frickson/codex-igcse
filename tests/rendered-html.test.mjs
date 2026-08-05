import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("exports the complete interactive Chapter 4 lesson", async () => {
  const [html, source] = await Promise.all([
    readFile(new URL("out/chapter-4/index.html", root), "utf8"),
    readFile(new URL("app/chapter-4/page.tsx", root), "utf8"),
  ]);
  assert.match(html, /Field Notes/);
  assert.match(html, /Electricity &amp; Magnetism|Electricity & Magnetism/);
  assert.match(html, /Cambridge IGCSE Physics 0625/);
  assert.match(html, /Interactive field lab/);
  assert.match(source, /Electromagnet circuit/);
  assert.match(source, /indicator bulb/);
  assert.match(source, /across coil/);
  assert.match(html, /Circuit builder/);
  assert.match(html, /Electrostatics laboratory/i);
  assert.match(html, /Electric-field mapper/i);
  assert.match(html, /Meter challenge/i);
  assert.match(html, /Current–voltage practical/i);
  assert.match(html, /Circuit-symbol builder/i);
  assert.match(html, /Potential divider/i);
  assert.match(html, /Transformer calculator/);
  assert.match(html, /Drag-and-drop circuit/);
  assert.match(html, /Drag-to-induce lab/);
  assert.match(html, /Let the hands explain the direction/);
  assert.match(html, /LEFT HAND/);
  assert.match(html, /RIGHT HAND/);
  assert.match(html, /Field \+ current/);
  assert.match(html, /Field \+ motion/);
  assert.match(html, /Fuse drop challenge/);
  assert.match(html, /Past-paper patterns/);
  assert.match(html, /Final checkpoint/);
  assert.doesNotMatch(html, /Digital electronics|Logic gates/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("Fleming film autoplays physically consistent left- and right-hand direction stories", async () => {
  const [source, page, css] = await Promise.all([
    readFile(new URL("app/chapter-4/labs/FlemingRulesLab.tsx", root), "utf8"),
    readFile(new URL("app/chapter-4/page.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);
  assert.match(page, /<FlemingRulesLab \/>/);
  assert.match(source, /setInterval\(\(\) => setStep\(\(value\) => \(value \+ 1\) % 8\), 2400\)/);
  assert.match(source, /First finger follows the field/);
  assert.match(source, /Second finger follows conventional current/);
  assert.match(source, /Thumb follows the conductor’s motion/);
  assert.match(source, /induced conventional current/);
  assert.match(source, /Field is defined N → S/);
  assert.match(source, /const resultOut = !reverse/);
  assert.match(source, /prefers-reduced-motion: reduce/);
  assert.match(source, /onPointerDown=\{beginDrag\}/);
  assert.match(source, /onPointerMove=\{moveDrag\}/);
  assert.match(source, /onKeyDown=\{rotateWithKeyboard\}/);
  assert.match(source, /Drag to inspect in 3D/);
  assert.match(source, /Press Home to reset/);
  assert.match(source, /fleming-left-real\.png/);
  assert.match(source, /fleming-right-real\.png/);
  assert.match(source, /className="real-hand-photo"/);
  assert.match(css, /@keyframes flemingDigitPulse/);
  assert.match(css, /\.fleming-film/);
  assert.match(css, /\.real-hand-model/);
  assert.match(css, /\.real-hand-photo/);
  assert.match(css, /perspective:760px/);
  assert.match(css, /rotateX\(var\(--hand-rx\)\) rotateY\(var\(--hand-ry\)\)/);
  assert.match(css, /touch-action:none/);
  assert.match(css, /@media \(max-width:650px\)[^{]*\{[^}]*\.fleming-rule-tabs/s);
  await access(new URL("public/images/fleming-left-real.png", root));
  await access(new URL("public/images/fleming-right-real.png", root));
});

test("includes GitHub Pages and social assets", async () => {
  await access(new URL("out/.nojekyll", root));
  await access(new URL("out/og.png", root));
  const html = await readFile(new URL("out/index.html", root), "utf8");
  assert.match(html, /og:image/);
  assert.match(html, /twitter:card/);
});

test("home page is a Field Notes landing with all six chapter routes", async () => {
  const html = await readFile(new URL("out/index.html", root), "utf8");
  assert.match(html, /Field Notes/);
  assert.match(html, /Start with Chapter 1/);
  assert.match(html, /Browse all chapters/);
  for (let chapter = 1; chapter <= 6; chapter += 1) {
    assert.match(html, new RegExp(`chapter-${chapter}/`));
  }
  assert.doesNotMatch(html, /Begin the fieldwork/);
  assert.doesNotMatch(html, /Coming soon/);
});

test("exports the separate generator and motor laboratory page", async () => {
  const [mainHtml, labsHtml, labsSource] = await Promise.all([
    readFile(new URL("out/chapter-4/index.html", root), "utf8"),
    readFile(new URL("out/electromagnetic-labs/index.html", root), "utf8"),
    readFile(new URL("app/electromagnetic-labs/page.tsx", root), "utf8"),
  ]);
  assert.match(mainHtml, /Open advanced labs/);
  assert.match(mainHtml, /electromagnetic-labs\//);
  assert.match(mainHtml, /Generator &amp; Motor Labs/);
  assert.match(mainHtml, /advanced-labs-button/);
  assert.match(labsHtml, /Match coil position to the e\.m\.f\. waveform/);
  assert.match(labsHtml, /Predict the force, then run the motor/);
  assert.match(labsHtml, /slip rings/);
  assert.match(labsHtml, /split-ring commutator/);
  assert.match(labsHtml, /Return to the complete Chapter 4 lesson/);
  assert.match(labsHtml, /chapter-4\/#effects/);
  assert.match(labsSource, /currentReversed !== fieldReversed/);
});

test("paper attraction requires a charged rod near the paper", async () => {
  const [source, css] = await Promise.all([
    readFile(new URL("app/chapter-4/page.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);
  assert.match(source, /const attracted = nearPaper && charge > 0/);
  assert.match(source, /Electrons are moving from the cloth onto the rod/);
  assert.match(source, /className=\"electron-transfer\"/);
  assert.match(source, /data-attracted=\{attracted\}/);
  assert.match(css, /\.attracting \.paper-bits i/);
  assert.match(css, /@keyframes electron-flight/);
  assert.match(css, /\.static-stage\.rubbing \.cloth/);
  assert.doesNotMatch(css, /\.testing \.paper-bits i/);
});

test("electric-field mapper uses direct dragging and correct model boundaries", async () => {
  const [source, css] = await Promise.all([
    readFile(new URL("app/chapter-4/page.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);
  assert.match(source, /onPointerDown=\{startDrag\}/);
  assert.match(source, /onKeyDown=\{nudgeCharge\}/);
  assert.match(source, /E = 0 inside a charged conductor/);
  assert.match(source, /end effects are not examined/);
  assert.match(source, /sourceSign === -1/);
  assert.match(css, /marker-end: url\(#electric-field-arrow\)/);
  assert.doesNotMatch(source, /Horizontal position/);
  assert.doesNotMatch(source, /Vertical position/);
});

test("circuit-symbol builder supports challenges and removal controls", async () => {
  const source = await readFile(new URL("app/chapter-4/page.tsx", root), "utf8");
  assert.match(source, /Temperature indicator/);
  assert.match(source, /Light-level indicator/);
  assert.match(source, /Protected LED/);
  assert.match(source, /onDrop=\{\(event\) => drop\(event, slot\)\}/);
  assert.match(source, /Tap any placed symbol to remove it individually/);
  assert.match(source, />Remove all</);
});

test("UI polish keeps every lesson destination reachable and improves control accessibility", async () => {
  const [html, source, css] = await Promise.all([
    readFile(new URL("out/chapter-4/index.html", root), "utf8"),
    readFile(new URL("app/chapter-4/page.tsx", root), "utf8"),
    readFile(new URL("app/globals.css", root), "utf8"),
  ]);
  assert.match(html, /<summary>More<\/summary>/);
  assert.match(html, /href="#practice"/);
  assert.match(html, /href="#mindmap"/);
  assert.match(html, /href="#quiz"/);
  assert.match(source, /aria-controls="chapter-contents"/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /mobile-menu-backdrop/);
  assert.match(source, /aria-pressed=\{mode === "bar"\}/);
  assert.match(source, /aria-pressed=\{layout === "series"\}/);
  assert.match(css, /button:focus-visible/);
  assert.match(css, /input\[type="range"\][^{]*\{[^}]*height: 44px/s);
  assert.match(css, /\.home-hero \{ min-height: 610px/);
  assert.match(css, /\.chapter-hero \{ min-height: 640px/);
});
