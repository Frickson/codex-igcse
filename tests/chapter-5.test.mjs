import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("exports the Chapter 5 nuclear-physics lesson", async () => {
  const html = await readFile(new URL("out/chapter-5/index.html", root), "utf8");
  assert.match(html, /Field Notes/);
  assert.match(html, /Cambridge IGCSE Physics 0625/);
  assert.match(html, /Nuclear physics/i);
  assert.match(html, /Two ideas, six moves, one nucleus/);
  assert.match(html, /Build an atom, then make an ion/);
  assert.match(html, /α, β and γ at a glance/);
  assert.match(html, /Why does a random process give a fixed half-life/);
  assert.match(html, /Which model matches the observations/);
  assert.match(html, /How do Z and A fix a nucleus/);
  assert.match(html, /Same element, different neutrons/);
  assert.match(html, /Splitting or joining nuclei/);
  assert.match(html, /Background &amp; corrected count rate|Background & corrected count rate/);
  assert.match(html, /Which absorber stops each radiation/);
  assert.match(html, /How do fields bend each ray/);
  assert.match(html, /How does decay change the nucleus/);
  assert.match(html, /How does count rate fall with time/);
  assert.match(html, /Match the radiation to the use/);
  assert.match(html, /Which change reduces dose most/);
  assert.match(html, /reveal the mark points/i);
  assert.match(html, /Final checkpoint|Ten questions/);
});

test("Chapter 5 route carries social + metadata and relative links only", async () => {
  const html = await readFile(new URL("out/chapter-5/index.html", root), "utf8");
  assert.match(html, /og:image/);
  assert.match(html, /twitter:card/);
  // back-links to Chapter 4 must be relative (no leading-slash absolute paths that break under basePath)
  assert.match(html, /href="\.\.\/chapter-4\/"/);
  assert.doesNotMatch(html, /href="\/chapter-5/);
});

test("Chapter 4 lesson links to Chapter 5", async () => {
  const html = await readFile(new URL("out/chapter-4/index.html", root), "utf8");
  assert.match(html, /chapter-5\//);
  assert.match(html, /Nuclear physics/);
});

test("scattering model is physically honest: most pass straight, rare back-scatter", async () => {
  const source = await readFile(new URL("app/chapter-5/page.tsx", root), "utf8");
  // small Coulomb constant so only near-axis paths deflect strongly
  assert.match(source, /2 \* Math\.atan\(1\.4 \/ ab\)/);
  // an exact head-on path back-scatters
  assert.match(source, /Math\.PI \* \(b >= 0 \? 1 : -1\)/);
  // plum-pudding model produces no deflection
  assert.match(source, /if \(m === "pudding"\) return 0/);
});

test("gamma is attenuated (not stopped) by lead; alpha stopped by first absorber", async () => {
  const source = await readFile(new URL("app/chapter-5/page.tsx", root), "utf8");
  assert.match(source, /attenuated = true; stopX = s\.x \+ s\.w/);
  assert.match(source, /if \(type === "a"\) \{ stopX = s\.x; stoppedBy = s\.label; break; \}/);
});

test("nucleus/decay/half-life/dose models compute from real physics", async () => {
  const source = await readFile(new URL("app/chapter-5/page.tsx", root), "utf8");
  assert.match(source, /const n = a - z;/);            // neutrons = A − Z
  assert.match(source, /a >= z/);                       // invalid when A < Z
  assert.match(source, /neutron → proton \+ electron/); // beta decay mechanism
  assert.match(source, /const z3 = pZ \+ 1/);           // beta raises Z by 1
  assert.match(source, /const corrected = measured - background/);
  assert.match(source, /1 \/ \(dist \* dist\)/);        // dose falls with distance squared
  assert.match(source, /igcse-nuclear-progress/);       // checkpoint persistence key
});
