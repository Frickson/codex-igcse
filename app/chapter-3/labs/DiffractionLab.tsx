"use client";

import { useState } from "react";

/**
 * 3.1 — diffraction: waves spread as they pass through a gap. The
 * amount of spreading is set by how the wavelength compares with the
 * gap width. The half-angle of the emerging cone is computed as
 * θ = arcsin(min(1, λ/gap)); when the gap is comparable to (or smaller
 * than) the wavelength the wave spreads into a near-semicircle, and
 * when the gap is much wider the wave passes almost straight through.
 */
const W = 620, H = 260, bx = 280, cy = H / 2, scale = 26;

export default function DiffractionLab() {
  const [wavelength, setWavelength] = useState(2); // m
  const [gap, setGap] = useState(2);               // m

  const ratio = wavelength / gap;
  const theta = Math.asin(Math.min(1, ratio));     // half-angle of spreading (rad)
  const thetaDeg = (theta * 180) / Math.PI;
  const strong = ratio >= 0.8;

  const wlPx = wavelength * scale;
  const gapPx = gap * scale;

  // incoming plane wavefronts (vertical), spaced by λ, to the left of the barrier
  const incoming: number[] = [];
  for (let x = bx - wlPx; x > 6; x -= wlPx) incoming.push(x);

  // emerging wavefronts: arcs centred on the gap, radius = m·λ, within ±θ
  const arcs: string[] = [];
  for (let r = wlPx; r < W - bx; r += wlPx) {
    const p1 = { x: bx + r * Math.cos(theta), y: cy - r * Math.sin(theta) };
    const p2 = { x: bx + r * Math.cos(theta), y: cy + r * Math.sin(theta) };
    arcs.push(`M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${r.toFixed(1)} ${r.toFixed(1)} 0 0 1 ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`);
  }

  const coneLen = W - bx - 6;

  return (
    <div className="lab-shell waves">
      <div className="lab-header">
        <div><span className="mini-label">3.1 · diffraction</span><h3>Spreading through a gap</h3></div>
        <div className="big-reading"><span>Spread half-angle</span><strong>{thetaDeg.toFixed(0)}°</strong></div>
      </div>
      <div className="lab-grid">
        <div className="waves-stage" role="img" aria-label={`Plane waves of wavelength ${wavelength} metres passing through a gap of ${gap} metres and spreading by ${thetaDeg.toFixed(0)} degrees`}>
          <svg viewBox={`0 0 ${W} ${H}`}>
            {incoming.map((x, idx) => <line key={idx} x1={x} y1={20} x2={x} y2={H - 20} stroke="#7fb0c9" strokeWidth={2} />)}
            {/* barrier with a gap */}
            <rect x={bx - 4} y={0} width={8} height={cy - gapPx / 2} fill="#173d54" />
            <rect x={bx - 4} y={cy + gapPx / 2} width={8} height={H - (cy + gapPx / 2)} fill="#173d54" />
            {/* cone edges (geometric guide) */}
            <line x1={bx} y1={cy} x2={bx + coneLen * Math.cos(theta)} y2={cy - coneLen * Math.sin(theta)} stroke="#c4d2cd" strokeDasharray="4 3" />
            <line x1={bx} y1={cy} x2={bx + coneLen * Math.cos(theta)} y2={cy + coneLen * Math.sin(theta)} stroke="#c4d2cd" strokeDasharray="4 3" />
            {arcs.map((d, idx) => <path key={idx} d={d} fill="none" stroke="#1c8b74" strokeWidth={2} />)}
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Wavelength (m) <strong style={{ float: "right", color: "var(--navy)" }}>{wavelength}</strong>
            <input type="range" min={1} max={6} step={1} value={wavelength} onChange={(e) => setWavelength(+e.target.value)} /></label>
          <label className="num-field wide">Gap width (m) <strong style={{ float: "right", color: "var(--navy)" }}>{gap}</strong>
            <input type="range" min={1} max={6} step={1} value={gap} onChange={(e) => setGap(+e.target.value)} /></label>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Wavelength ÷ gap</th><td className="num">{ratio.toFixed(2)}</td></tr>
              <tr><th>Spread half-angle</th><td className="num">{thetaDeg.toFixed(0)}°</td></tr>
            </tbody>
          </table>
          <p className={strong ? "field-note zero" : "field-note"} aria-live="polite">{strong
            ? `The gap is about the size of the wavelength (λ/gap = ${ratio.toFixed(2)}), so the waves spread out strongly — almost a semicircle beyond the gap.`
            : `The gap is much wider than the wavelength (λ/gap = ${ratio.toFixed(2)}), so the waves pass through nearly straight, spreading only a little at the edges. Narrow the gap or lengthen the wavelength to increase the diffraction.`}</p>
        </div>
      </div>
      <p className="lab-note">Diffraction is the spreading of a wave as it passes an edge or through a gap. The narrower the gap compared with the wavelength, the greater the spreading — which is why long-wavelength radio waves bend around hills but short-wavelength light casts sharp shadows.</p>
    </div>
  );
}
