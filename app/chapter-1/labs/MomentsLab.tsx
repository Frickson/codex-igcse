"use client";

import { useState } from "react";

/**
 * 1.5.6 — the turning effect of a force and the principle of moments.
 * moment = force × perpendicular distance from the pivot. The beam is
 * balanced only when the total anticlockwise moment equals the total
 * clockwise moment; the tilt shown is driven by the actual net moment.
 */
const W = 420, H = 240, cx = W / 2, pivotY = 150, beamHalf = 170;

export default function MomentsLab() {
  const [wL, setWL] = useState(4);   // N, left load
  const [dL, setDL] = useState(3);   // m from pivot
  const [wR, setWR] = useState(6);   // N, right load
  const [dR, setDR] = useState(2);   // m from pivot

  const mL = wL * dL;  // anticlockwise
  const mR = wR * dR;  // clockwise
  const net = mR - mL; // + tips right (clockwise)
  const balanced = Math.abs(net) < 0.5;
  const tilt = Math.max(-14, Math.min(14, net * 0.9)); // degrees, clamped

  const dist2px = (d: number) => (d / 4) * beamHalf; // 4 m maps to beam half-length
  const rad = (tilt * Math.PI) / 180;
  const endL = { x: cx - beamHalf * Math.cos(rad), y: pivotY + beamHalf * Math.sin(rad) };
  const endR = { x: cx + beamHalf * Math.cos(rad), y: pivotY - beamHalf * Math.sin(rad) };
  const ptOn = (side: -1 | 1, d: number) => ({ x: cx + side * dist2px(d) * Math.cos(rad), y: pivotY - side * dist2px(d) * Math.sin(rad) });
  const pL = ptOn(-1, dL), pR = ptOn(1, dR);

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">1.5.6 · moments</span><h3>Balance the beam</h3></div>
        <div className="big-reading"><span>{balanced ? "Balanced" : net > 0 ? "Tips right" : "Tips left"}</span><strong>{balanced ? "0" : Math.abs(net).toFixed(0)} N·m</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label={`A beam with ${wL} newtons at ${dL} metres left and ${wR} newtons at ${dR} metres right of the pivot`}>
          <svg viewBox={`0 0 ${W} ${H}`}>
            <polygon points={`${cx},${pivotY} ${cx - 16},${pivotY + 40} ${cx + 16},${pivotY + 40}`} fill="#8b97a8" />
            <line x1={endL.x} y1={endL.y} x2={endR.x} y2={endR.y} stroke="#173d54" strokeWidth={7} strokeLinecap="round" />
            {/* left load */}
            <line x1={pL.x} y1={pL.y} x2={pL.x} y2={pL.y + 12 + wL * 5} stroke="#1c8b74" strokeWidth={2} />
            <rect x={pL.x - 12} y={pL.y + 12 + wL * 5} width={24} height={18} rx={3} fill="#1c8b74" />
            <text x={pL.x} y={pL.y + 12 + wL * 5 + 32} fill="#146653" fontSize={11} textAnchor="middle">{wL} N</text>
            {/* right load */}
            <line x1={pR.x} y1={pR.y} x2={pR.x} y2={pR.y + 12 + wR * 5} stroke="#df8c38" strokeWidth={2} />
            <rect x={pR.x - 12} y={pR.y + 12 + wR * 5} width={24} height={18} rx={3} fill="#df8c38" />
            <text x={pR.x} y={pR.y + 12 + wR * 5 + 32} fill="#a85f17" fontSize={11} textAnchor="middle">{wR} N</text>
          </svg>
        </div>
        <div className="side">
          <div className="inline-controls">
            <label className="num-field">Left load (N)<input type="number" min={0} max={10} value={wL} onChange={(e) => setWL(Math.max(0, Math.min(10, +e.target.value)))} /></label>
            <label className="num-field">Left dist (m)<input type="number" min={0} max={4} value={dL} onChange={(e) => setDL(Math.max(0, Math.min(4, +e.target.value)))} /></label>
          </div>
          <div className="inline-controls">
            <label className="num-field">Right load (N)<input type="number" min={0} max={10} value={wR} onChange={(e) => setWR(Math.max(0, Math.min(10, +e.target.value)))} /></label>
            <label className="num-field">Right dist (m)<input type="number" min={0} max={4} value={dR} onChange={(e) => setDR(Math.max(0, Math.min(4, +e.target.value)))} /></label>
          </div>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Anticlockwise moment (left)</th><td className="num">{mL.toFixed(0)} N·m</td></tr>
              <tr><th>Clockwise moment (right)</th><td className="num">{mR.toFixed(0)} N·m</td></tr>
            </tbody>
          </table>
          <p className={balanced ? "field-note" : "field-note zero"} aria-live="polite">{balanced
            ? `Balanced: the anticlockwise moment (${wL}×${dL} = ${mL} N·m) equals the clockwise moment (${wR}×${dR} = ${mR} N·m), so the beam stays level.`
            : `Not balanced: the moments differ by ${Math.abs(net)} N·m, so the beam turns ${net > 0 ? "clockwise (right side down)" : "anticlockwise (left side down)"}. Adjust a load or distance until the two moments match.`}</p>
        </div>
      </div>
      <p className="lab-note">The moment of a force is force × perpendicular distance from the pivot. By the principle of moments, a body in equilibrium has total clockwise moment = total anticlockwise moment about any pivot.</p>
    </div>
  );
}
