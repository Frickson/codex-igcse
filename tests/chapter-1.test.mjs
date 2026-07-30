import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("exports the Chapter 1 motion, forces & energy lesson", async () => {
  const html = await readFile(new URL("out/chapter-1/index.html", root), "utf8");
  assert.match(html, /Field Notes/);
  assert.match(html, /Cambridge IGCSE Physics 0625/);
  assert.match(html, /Motion, forces &amp; energy/);
  // one lab heading per subtopic 1.1–1.8
  assert.match(html, /Why measure many, then divide\?/);        // 1.1 measurement
  assert.match(html, /Combine two forces at right angles/);      // 1.1 vectors
  assert.match(html, /Read speed, acceleration and distance from a graph/); // 1.2
  assert.match(html, /What happens to a falling body\?/);        // 1.2 free fall
  assert.match(html, /Does it float\? Compare the densities/);   // 1.3–1.4
  assert.match(html, /Turn a resultant force into acceleration/);// 1.5 F = ma
  assert.match(html, /Load a spring/);                           // 1.5 Hooke
  assert.match(html, /Balance the beam/);                        // 1.5 moments
  assert.match(html, /Tilt the block — will it topple\?/);       // 1.5 stability
  assert.match(html, /Why does a circling object need a force\?/);// 1.5 circular
  assert.match(html, /Collisions conserve momentum/);            // 1.6 momentum
  assert.match(html, /Energy is transferred, not lost/);         // 1.7 stores
  assert.match(html, /A motor lifting a load/);                  // 1.7 work/power
  assert.match(html, /Where the electricity comes from/);        // 1.7 resources
  assert.match(html, /Same force, different area/);              // 1.8 pressure
  assert.match(html, /Deeper and denser means more pressure/);   // 1.8 liquid pressure
  // assessment scaffolding
  assert.match(html, /reveal the mark points/i);
  assert.match(html, /Final checkpoint|Ten questions/);
  assert.match(html, /Rebuild each branch from memory/);
});

test("Chapter 1 route carries social + metadata and relative links only", async () => {
  const html = await readFile(new URL("out/chapter-1/index.html", root), "utf8");
  assert.match(html, /og:image/);
  assert.match(html, /twitter:card/);
  // back-links must be relative so they survive the GitHub Pages basePath
  assert.match(html, /href="\.\.\/chapters\/"/);
  assert.match(html, /href="\.\.\/chapter-2\/"/); // next chapter after Ch1
  assert.doesNotMatch(html, /href="\/chapter-1/);
});

test("chapters directory lists Chapter 1", async () => {
  const html = await readFile(new URL("out/chapters/index.html", root), "utf8");
  assert.match(html, /chapter-1\//);
  assert.match(html, /Motion, forces &amp; energy/);
});

test("free fall is honest: a = (mg − drag)/m, terminal velocity when drag = mg", async () => {
  const source = await readFile(new URL("app/chapter-1/labs/FreeFallLab.tsx", root), "utf8");
  assert.match(source, /Math\.sqrt\(\(mass \* g\) \/ c\)/);  // v_t = √(mg/c)
  assert.match(source, /if \(!drag\) return g \* t;/);        // no drag → a = g
});

test("density decides floating: ρ = m/V compared with the fluid", async () => {
  const source = await readFile(new URL("app/chapter-1/labs/DensityLab.tsx", root), "utf8");
  assert.match(source, /const floats = rho < fluid\.rho;/);   // float iff less dense than fluid
});

test("momentum is conserved: total after equals total before", async () => {
  const source = await readFile(new URL("app/chapter-1/labs/MomentumLab.tsx", root), "utf8");
  assert.match(source, /\(m1 \* u1 \+ m2 \* u2\) \/ \(m1 \+ m2\)/); // stick: common velocity from conservation
  assert.match(source, /const pBefore = m1 \* u1 \+ m2 \* u2;/);
  assert.match(source, /const pAfter = m1 \* v1 \+ m2 \* v2;/);
});

test("energy models are honest: total conserved, efficiency never exceeds 100%", async () => {
  const stores = await readFile(new URL("app/chapter-1/labs/EnergyStoresLab.tsx", root), "utf8");
  assert.match(stores, /const total = mass \* g \* h0;/);              // fixed energy budget
  const calc = await readFile(new URL("app/chapter-1/labs/EnergyCalcLab.tsx", root), "utf8");
  assert.match(calc, /Math\.max\(input, Math\.ceil\(useful\)\)/);     // input can never be below useful output
});

test("pressure models compute p = F/A and p = ρgΔh", async () => {
  const p = await readFile(new URL("app/chapter-1/labs/PressureLab.tsx", root), "utf8");
  assert.match(p, /const pressure = force \/ area;/);
  const lp = await readFile(new URL("app/chapter-1/labs/LiquidPressureLab.tsx", root), "utf8");
  assert.match(lp, /const pressure = density \* g \* depth;/);
});

test("checkpoint persists to the motion progress key", async () => {
  const source = await readFile(new URL("app/chapter-1/page.tsx", root), "utf8");
  assert.match(source, /igcse-motion-progress/);
});

test("checkpoint write is guarded so it does not clobber saved answers on mount", async () => {
  // Regression: the deferred (rAF) read must set `hydrated` before the write
  // effect runs, otherwise the empty initial state overwrites localStorage.
  const source = await readFile(new URL("app/chapter-1/page.tsx", root), "utf8");
  assert.match(source, /hydrated\.current = true;/);
  assert.match(source, /if \(!hydrated\.current\) return;/);
});
