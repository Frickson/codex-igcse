import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const page = (p) => readFile(new URL(p, root), "utf8");

test("exports the Chapter 3 waves lesson", async () => {
  const html = await page("out/chapter-3/index.html");
  assert.match(html, /Field Notes/);
  assert.match(html, /Cambridge IGCSE Physics 0625/);
  assert.match(html, /3 Waves/);
  // one lab heading per subtopic 3.1–3.4
  assert.match(html, /Read a wave, then compute its speed/);   // 3.1 v = fλ
  assert.match(html, /Spreading through a gap/);               // 3.1 diffraction
  assert.match(html, /Angle in = angle out/);                  // 3.2.1 reflection
  assert.match(html, /n = sin i \/ sin r/);                    // 3.2.2 refraction & TIR
  assert.match(html, /Where does the image form\?/);           // 3.2.3 lens
  assert.match(html, /Splitting white light into a spectrum/); // 3.2.4 dispersion
  assert.match(html, /electromagnetic spectrum/i);             // 3.3 spectrum
  assert.match(html, /Read a sound on an oscilloscope/);       // 3.4 pitch/loudness
  assert.match(html, /Same sound, different medium/);          // 3.4 speed vs medium
  // assessment scaffolding
  assert.match(html, /reveal the mark points/i);
  assert.match(html, /Final checkpoint|Ten questions/);
  assert.match(html, /Rebuild each branch from memory/);
});

test("Chapter 3 route carries social + metadata and relative links only", async () => {
  const html = await page("out/chapter-3/index.html");
  assert.match(html, /og:image/);
  assert.match(html, /twitter:card/);
  // back-links must be relative so they survive the GitHub Pages basePath
  assert.match(html, /href="\.\.\/chapters\/"/);
  assert.match(html, /href="\.\.\/chapter-2\/"/); // previous chapter
  assert.doesNotMatch(html, /href="\/chapter-3/);
  // the hero must NOT carry the redundant "All chapters" redirect button
  assert.doesNotMatch(html, /advanced-labs-button/);
});

test("chapters directory lists Chapter 3", async () => {
  const html = await page("out/chapters/index.html");
  assert.match(html, /chapter-3\//);
  assert.match(html, /Waves/);
});

test("wave speed is honest: v = fλ drives both the readout and the animation", async () => {
  const src = await page("app/chapter-3/labs/WaveAnatomyLab.tsx");
  assert.match(src, /const speed = freq \* wavelength;/);            // v = fλ
  assert.match(src, /const omega = 2 \* Math\.PI \* freq;/);          // phase speed ω/k = fλ
});

test("diffraction spread depends on λ/gap, not a button press", async () => {
  const src = await page("app/chapter-3/labs/DiffractionLab.tsx");
  assert.match(src, /const ratio = wavelength \/ gap;/);
  assert.match(src, /Math\.asin\(Math\.min\(1, ratio\)\)/);           // clamped half-angle
});

test("reflection is honest: angle of reflection equals angle of incidence", async () => {
  const src = await page("app/chapter-3/labs/ReflectionLab.tsx");
  assert.match(src, /Angle of incidence<\/th><td className="num">\{angle\}°/);
  assert.match(src, /Angle of reflection<\/th><td className="num">\{angle\}°/);
});

test("refraction is honest: Snell both ways, with a real critical angle and TIR", async () => {
  const src = await page("app/chapter-3/labs/RefractionLab.tsx");
  assert.match(src, /sinR = Math\.sin\(i\) \/ n;/);                   // air → glass
  assert.match(src, /sinR = n \* Math\.sin\(i\);/);                   // glass → air
  assert.match(src, /if \(sinR > 1\) \{ tir = true;/);               // TIR beyond critical angle
  assert.match(src, /Math\.asin\(1 \/ n\)/);                          // c = sin⁻¹(1/n)
});

test("lens image is located by the lens equation d = uf/(u−f)", async () => {
  const src = await page("app/chapter-3/labs/LensLab.tsx");
  assert.match(src, /\(u \* f\) \/ \(u - f\)/);
  assert.match(src, /const m = Math\.abs\(d\) \/ u;/);                // magnification |v|/u
  assert.match(src, /const real = d > 0;/);                          // real vs virtual from sign
});

test("dispersion is honest: Snell at both faces, violet index exceeds red", async () => {
  const src = await page("app/chapter-3/labs/DispersionLab.tsx");
  assert.match(src, /\(\(i \+ i2 - a\) \* 180\) \/ Math\.PI/);        // deviation δ = i₁ + i₂ − A
  assert.match(src, /if \(s > 1\) return null;/);                    // TIR at second face
  assert.match(src, /name: "red", n: 1\.513/);
  assert.match(src, /name: "violet", n: 1\.532/);                    // violet index > red index
});

test("EM spectrum uses a fixed vacuum speed with λ = c/f", async () => {
  const src = await page("app/chapter-3/labs/SpectrumLab.tsx");
  assert.match(src, /const C = 3e8;/);
  assert.match(src, /const lambda = C \/ f;/);                        // c = fλ
});

test("sound: pitch/loudness independent, λ in air from v = fλ, audible range flagged", async () => {
  const src = await page("app/chapter-3/labs/SoundLab.tsx");
  assert.match(src, /const lambda = V_AIR \/ freq;/);                 // λ = v/f
  assert.match(src, /const infrasound = freq < 20;/);
  assert.match(src, /const ultrasound = freq > 20000;/);
});

test("sound needs a medium: position = v·t, arrival = d/v, vacuum never carries it", async () => {
  const src = await page("app/chapter-3/labs/SoundMediumLab.tsx");
  assert.match(src, /const travelled = Math\.min\(dist, m\.v \* t\);/); // distance = speed × time
  assert.match(src, /dist \/ m\.v/);                                    // arrival time = d / v
  assert.match(src, /name: "Vacuum \(none\)", v: 0/);                   // vacuum: no sound
});

test("checkpoint persists to the waves progress key", async () => {
  const src = await page("app/chapter-3/page.tsx");
  assert.match(src, /igcse-waves-progress/);
});

test("checkpoint write is guarded so it does not clobber saved answers on mount", async () => {
  const src = await page("app/chapter-3/page.tsx");
  assert.match(src, /hydrated\.current = true;/);
  assert.match(src, /if \(!hydrated\.current\) return;/);
});
