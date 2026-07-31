import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("exports the Chapter 6 space-physics lesson", async () => {
  const html = await readFile(new URL("out/chapter-6/index.html", root), "utf8");
  assert.match(html, /Field Notes/);
  assert.match(html, /Cambridge IGCSE Physics 0625/);
  assert.match(html, /Space physics/i);
  assert.match(html, /Two scales, one gravitational story/);
  assert.match(html, /Spin the Earth — when is it day/);
  assert.match(html, /Tilt and orbit — why seasons change/);
  assert.match(html, /Walk the Moon around Earth/);
  assert.match(html, /Average orbital speed/);
  assert.match(html, /Build the planetary order/);
  assert.match(html, /Drag each planet into the diagram|Place|Orbit 1/);
  assert.match(html, /Show names/);
  assert.match(html, /What force keeps a planet in orbit/);
  assert.match(html, /How long does sunlight take/);
  assert.match(html, /Read the planetary data table/);
  assert.match(html, /What kind of star is the Sun/);
  assert.match(html, /Measure distance in light-years/);
  assert.match(html, /Follow a star from nebula to remnant/);
  assert.match(html, /Stretch the wavelength — watch redshift/);
  assert.match(html, /Why is the sky filled with microwaves/);
  assert.match(html, /H₀ = v\/d and the age estimate|H0 = v\/d and the age estimate/);
  assert.match(html, /reveal the mark points/i);
  assert.match(html, /Final checkpoint|Ten questions/);
});

test("Chapter 6 route carries social + metadata and relative links only", async () => {
  const html = await readFile(new URL("out/chapter-6/index.html", root), "utf8");
  assert.match(html, /og:image/);
  assert.match(html, /twitter:card/);
  assert.match(html, /href="\.\.\/chapters\/"/);
  assert.match(html, /href="\.\.\/chapter-5\/"/);
  assert.doesNotMatch(html, /href="\/chapter-6/);
});

test("directory and Chapter 5 link toward Chapter 6", async () => {
  const dir = await readFile(new URL("out/chapters/index.html", root), "utf8");
  assert.match(dir, /Space physics/);
  assert.match(dir, /chapter-6\//);

  const ch5 = await readFile(new URL("out/chapter-5/index.html", root), "utf8");
  assert.match(ch5, /Space physics|chapter-6/);
});

test("orbital speed and Hubble models compute from inputs", async () => {
  const orbital = await readFile(new URL("app/chapter-6/labs/OrbitalSpeedLab.tsx", root), "utf8");
  assert.match(orbital, /2 \* Math\.PI \* r\) \/ T/);
  assert.match(orbital, /valid = r > 0 && T > 0/);

  const light = await readFile(new URL("app/chapter-6/labs/LightTravelLab.tsx", root), "utf8");
  assert.match(light, /distanceM \/ C/);

  const hubble = await readFile(new URL("app/chapter-6/labs/HubbleLab.tsx", root), "utf8");
  assert.match(hubble, /2\.2e-18/);
  assert.match(hubble, /1 \/ Huse/);

  const solar = await readFile(new URL("app/chapter-6/labs/SolarSystemLab.tsx", root), "utf8");
  assert.match(solar, /draggable/);
  assert.match(solar, /onDrop/);
  assert.match(solar, /PlanetIcon/);
  assert.match(solar, /text\/planet/);
  assert.match(solar, /solar-orbits/);
  assert.match(solar, /illustrative, not to scale/);
  assert.match(solar, /aria-live="polite"/);

  const page = await readFile(new URL("app/chapter-6/page.tsx", root), "utf8");
  assert.match(page, /igcse-space-progress/);
});


test("Chapter 6 Solar System controls share one aligned button row", async () => {
  const css = await readFile(new URL("app/globals.css", root), "utf8");
  assert.match(css, /\.space \.chip-row \{ align-items: center; \}/);
  assert.match(css, /\.space \.chip-row \.reset-button \{ margin: 0; \}/);
  assert.match(css, /\.space \.explain \{/);
  assert.match(css, /\.space \.inline-controls button \{/);
  assert.doesNotMatch(css, /\\n$/);
});
