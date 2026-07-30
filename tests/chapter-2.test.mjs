import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("exports the Chapter 2 thermal-physics lesson", async () => {
  const html = await readFile(new URL("out/chapter-2/index.html", root), "utf8");
  assert.match(html, /Field Notes/);
  assert.match(html, /Cambridge IGCSE Physics 0625/);
  assert.match(html, /Thermal physics/i);
  assert.match(html, /Three ideas, one thermal toolkit/);
  assert.match(html, /Same particles — which state/);
  assert.match(html, /Heat the sample — what happens to the particles/);
  assert.match(html, /Why does the smoke particle jitter/);
  assert.match(html, /Change T or V — watch the collisions/);
  assert.match(html, /Same temperature rise — which expands most/);
  assert.match(html, /How much energy to raise the temperature/);
  assert.match(html, /Where does the energy go on the flat parts/);
  assert.match(html, /Which changes make a puddle disappear faster/);
  assert.match(html, /Which rod carries heat to the far end/);
  assert.match(html, /Watch density drive a current/);
  assert.match(html, /Surface, temperature and energy balance/);
  assert.match(html, /reveal the mark points/i);
  assert.match(html, /Final checkpoint|Ten questions/);
});

test("Chapter 2 route carries social + metadata and relative links only", async () => {
  const html = await readFile(new URL("out/chapter-2/index.html", root), "utf8");
  assert.match(html, /og:image/);
  assert.match(html, /twitter:card/);
  assert.match(html, /href="\.\.\/chapter-3\/"/); // next chapter is now Chapter 3 (Waves)
  assert.match(html, /href="\.\.\/chapters\/"/);
  assert.doesNotMatch(html, /href="\/chapter-2/);
});

test("directory lists Chapter 2, and the home page reaches it via the directory", async () => {
  // Chapter 3 now sits between Chapter 2 and the home page (Chapter 4), so the
  // home nav links to Chapter 3, not Chapter 2 — Chapter 2 is reached through
  // the chapter directory, which still lists it.
  const home = await readFile(new URL("out/index.html", root), "utf8");
  assert.match(home, /href="chapters\/"/);

  const dir = await readFile(new URL("out/chapters/index.html", root), "utf8");
  assert.match(dir, /chapter-2\//);
  assert.match(dir, /Thermal physics/);
});

test("particle / gas / SHC models compute from real inputs", async () => {
  const gas = await readFile(new URL("app/chapter-2/labs/GasPressureLab.tsx", root), "utf8");
  assert.match(gas, /P0 \* \(T \/ T0\)/);
  assert.match(gas, /P0 \* \(V0 \/ volume\)/);
  assert.match(gas, /invalidT/);

  const temp = await readFile(new URL("app/chapter-2/labs/ParticleTempLab.tsx", root), "utf8");
  assert.match(temp, /celsius \+ 273/);
  assert.match(temp, /atAbsoluteZero/);

  const shc = await readFile(new URL("app/chapter-2/labs/SpecificHeatLab.tsx", root), "utf8");
  assert.match(shc, /mass \* mat\.c \* dTheta/);
  assert.match(shc, /const valid = mass > 0/);

  const page = await readFile(new URL("app/chapter-2/page.tsx", root), "utf8");
  assert.match(page, /igcse-thermal-progress/);
});

test("radiation balance and evaporation rate depend on controls", async () => {
  const rad = await readFile(new URL("app/chapter-2/labs/RadiationLab.tsx", root), "utf8");
  assert.match(rad, /s\.emit \* area \* Math\.pow\(T \/ 350, 4\)/);
  assert.match(rad, /absorbed - emitted/);

  const evap = await readFile(new URL("app/chapter-2/labs/EvaporationLab.tsx", root), "utf8");
  assert.match(evap, /tFactor \* aFactor \* dFactor/);
  assert.match(evap, /if \(lid\) return 0\.05/);
});
