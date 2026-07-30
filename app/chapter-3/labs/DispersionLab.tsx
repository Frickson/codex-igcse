"use client";

import { useState } from "react";

/**
 * 3.2.4 — dispersion by a prism. Each colour has a slightly different
 * refractive index in the glass (violet highest, red lowest), so each
 * is refracted through a different total deviation. For an equilateral
 * prism (apex angle A = 60°) and angle of incidence i₁, the deviation
 * of each colour is computed honestly by applying Snell's law at both
 * faces:
 *
 *   r₁ = asin(sin i₁ / n),  r₂ = A − r₁,  i₂ = asin(n·sin r₂),
 *   deviation δ = i₁ + i₂ − A
 *
 * The angular spread between red and violet (the true dispersion) is
 * only ~1–2°, so the fan drawn on screen is exaggerated for visibility;
 * the readout shows the real computed values.
 */
const A = 60;                 // apex angle (deg)
const EXAG = 9;               // visual exaggeration of the colour fan
const W = 620, H = 300;
const apex = { x: 300, y: 70 }, bl = { x: 210, y: 225 }, br = { x: 390, y: 225 };
const entry = { x: (apex.x + bl.x) / 2, y: (apex.y + bl.y) / 2 };
const exit = { x: (apex.x + br.x) / 2, y: (apex.y + br.y) / 2 };

const COLOURS = [
  { name: "red", n: 1.513, hex: "#e23b2e" },
  { name: "orange", n: 1.514, hex: "#ef8a2b" },
  { name: "yellow", n: 1.517, hex: "#f4c430" },
  { name: "green", n: 1.519, hex: "#2fa84f" },
  { name: "blue", n: 1.528, hex: "#2f6fd0" },
  { name: "violet", n: 1.532, hex: "#7b3fbf" },
];

function deviation(iDeg: number, n: number): number | null {
  const i = (iDeg * Math.PI) / 180, a = (A * Math.PI) / 180;
  const r1 = Math.asin(Math.sin(i) / n);
  const r2 = a - r1;
  const s = n * Math.sin(r2);
  if (s > 1) return null; // total internal reflection at the second face — no emergence
  const i2 = Math.asin(s);
  return ((i + i2 - a) * 180) / Math.PI;
}

export default function DispersionLab() {
  const [inc, setInc] = useState(45); // angle of incidence at the first face (deg)

  const devs = COLOURS.map((c) => ({ ...c, d: deviation(inc, c.n) }));
  const emerges = devs.filter((c) => c.d !== null);
  const dRed = devs[0].d, dViolet = devs[devs.length - 1].d;
  const dispersion = dRed !== null && dViolet !== null ? dViolet - dRed : null;
  const allTIR = emerges.length === 0;
  const dMin = emerges.length ? Math.min(...emerges.map((c) => c.d as number)) : 0;

  // emergent fan: base direction points down-right from the exit face
  const rayLen = 150, baseDeg = 22;
  const rays = emerges.map((c) => {
    const ang = ((baseDeg + ((c.d as number) - dMin) * EXAG) * Math.PI) / 180;
    return { ...c, end: { x: exit.x + rayLen * Math.cos(ang), y: exit.y + rayLen * Math.sin(ang) } };
  });

  return (
    <div className="lab-shell waves">
      <div className="lab-header">
        <div><span className="mini-label">3.2.4 · dispersion</span><h3>Splitting white light into a spectrum</h3></div>
        <div className="big-reading"><span>Red → violet spread</span><strong>{dispersion !== null ? `${dispersion.toFixed(1)}°` : "—"}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="waves-stage tall">
          <svg viewBox={`0 0 ${W} ${H}`}>
            {/* prism */}
            <polygon points={`${apex.x},${apex.y} ${bl.x},${bl.y} ${br.x},${br.y}`} fill="#dbe8ee" stroke="#2d7d9a" strokeWidth={2} />
            {/* incident white ray */}
            <line x1={40} y1={entry.y - 30} x2={entry.x} y2={entry.y} stroke="#c9ccce" strokeWidth={4} />
            <line x1={40} y1={entry.y - 30} x2={entry.x} y2={entry.y} stroke="#ffffff" strokeWidth={1.6} />
            <text x={44} y={entry.y - 36} fontSize={11} fill="#6b8f86">white light</text>
            {/* internal ray (schematic, single path) */}
            {!allTIR && <line x1={entry.x} y1={entry.y} x2={exit.x} y2={exit.y} stroke="#b9c6c2" strokeWidth={2} />}
            {/* emergent spectrum */}
            {rays.map((c) => (
              <line key={c.name} x1={exit.x} y1={exit.y} x2={c.end.x} y2={c.end.y} stroke={c.hex} strokeWidth={2.5} />
            ))}
            {allTIR && <text x={exit.x - 40} y={exit.y + 30} fontSize={12} fill="#c0392b">total internal reflection</text>}
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Angle of incidence (°) <strong style={{ float: "right", color: "var(--navy)" }}>{inc}</strong>
            <input type="range" min={25} max={70} value={inc} onChange={(e) => setInc(+e.target.value)} aria-label="Angle of incidence at first face" /></label>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Deviation of red (n = 1.513)</th><td className="num">{dRed !== null ? `${dRed.toFixed(1)}°` : "TIR"}</td></tr>
              <tr><th>Deviation of violet (n = 1.532)</th><td className="num">{dViolet !== null ? `${dViolet.toFixed(1)}°` : "TIR"}</td></tr>
              <tr><th>Angular dispersion</th><td className="num">{dispersion !== null ? `${dispersion.toFixed(1)}°` : "—"}</td></tr>
            </tbody>
          </table>
          <p className="field-note" aria-live="polite">Violet has the largest refractive index in the glass, so it slows most and is deviated most; red has the smallest index and is deviated least. That difference is what fans white light into the ordered spectrum red → orange → yellow → green → blue → violet.</p>
          <p className="field-note zero">The true red–violet spread here is only about {dispersion !== null ? dispersion.toFixed(1) : "1–2"}°, so the coloured fan on the left is exaggerated to make the ordering visible — the numbers in the table are the exact computed deviations.</p>
        </div>
      </div>
      <p className="lab-note">White light is a mixture of all visible colours. A prism refracts each colour by a slightly different amount because each travels at a slightly different speed in glass — this splitting is called dispersion.</p>
    </div>
  );
}
