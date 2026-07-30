"use client";

import { useState } from "react";

/**
 * 1.8.1 — pressure p = F/A. The same brick is rested on a different
 * face, changing the contact area while the force (its weight) is
 * fixed unless the student changes it. The pressure and the depth it
 * sinks into soft sand are both computed from p = F/A, so a small area
 * really does give a large pressure.
 */
export default function PressureLab() {
  const [force, setForce] = useState(30);   // N (weight resting on the surface)
  const [face, setFace] = useState<"large" | "medium" | "small">("large");

  const areas = { large: 0.06, medium: 0.02, small: 0.005 }; // m²
  const labels = { large: "flat face (0.06 m²)", medium: "side (0.02 m²)", small: "end (0.005 m²)" };
  const area = areas[face];
  const pressure = force / area; // Pa

  // sink depth grows with pressure (qualitative, clamped)
  const sink = Math.min(70, (pressure / 6000) * 70);
  const W = 360, H = 260, sandY = 150;
  const blockW = face === "large" ? 150 : face === "medium" ? 90 : 40;
  const blockH = face === "large" ? 40 : face === "medium" ? 70 : 150;

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">1.8.1 · pressure</span><h3>Same force, different area</h3></div>
        <div className="big-reading"><span>Pressure</span><strong>{pressure >= 1000 ? `${(pressure / 1000).toFixed(1)} kPa` : `${pressure.toFixed(0)} Pa`}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label={`A ${force} newton block on its ${face} face pressing into sand`}>
          <svg viewBox={`0 0 ${W} ${H}`}>
            <rect x={0} y={sandY} width={W} height={H - sandY} fill="#e7dcc4" />
            <rect x={0} y={sandY + sink} width={W} height={H - sandY - sink} fill="#d9cba6" />
            <rect x={W / 2 - blockW / 2} y={sandY + sink - blockH} width={blockW} height={blockH} rx={3} fill="#173d54" />
            <text x={W / 2} y={sandY + sink - blockH / 2 + 4} fill="#fff" fontSize={12} textAnchor="middle">{force} N</text>
            <line x1={W / 2 - blockW / 2} y1={sandY + sink + 14} x2={W / 2 + blockW / 2} y2={sandY + sink + 14} stroke="#a85f17" strokeWidth={2} />
            <text x={W / 2} y={sandY + sink + 30} fill="#a85f17" fontSize={11} textAnchor="middle">contact area</text>
          </svg>
        </div>
        <div className="side">
          <div className="rad-select" role="group" aria-label="Which face rests on the sand">
            <button className={face === "large" ? "active" : ""} onClick={() => setFace("large")}>Flat</button>
            <button className={face === "medium" ? "active" : ""} onClick={() => setFace("medium")}>Side</button>
            <button className={face === "small" ? "active" : ""} onClick={() => setFace("small")}>End</button>
          </div>
          <label className="num-field wide">Weight resting (N) <strong style={{ float: "right", color: "var(--navy)" }}>{force}</strong>
            <input type="range" min={5} max={100} value={force} onChange={(e) => setForce(+e.target.value)} /></label>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Force (weight)</th><td className="num">{force} N</td></tr>
              <tr><th>Contact area</th><td className="num">{labels[face]}</td></tr>
              <tr><th>Pressure p = F/A</th><td className="num">{pressure.toFixed(0)} Pa</td></tr>
            </tbody>
          </table>
          <p className="field-note" aria-live="polite">The weight is the same on every face, but resting on the {face === "small" ? "end concentrates it on just 0.005 m², so the pressure is high and it sinks deep" : face === "medium" ? "side spreads it over 0.02 m², giving a moderate pressure" : "flat face spreads it over 0.06 m², so the pressure is low and it barely sinks"}. Pressure = force ÷ area, so smaller area → larger pressure.</p>
        </div>
      </div>
      <p className="lab-note">Pressure p = F/A is the force acting per unit area, in pascals (1 Pa = 1 N/m²). A fixed force gives a large pressure over a small area (a knife edge, a drawing pin) and a small pressure over a large area (snowshoes, wide tyres).</p>
    </div>
  );
}
