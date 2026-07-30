"use client";

import { useMemo, useState } from "react";

/**
 * 6.2.2.1–6.2.2.2 — light-year as a distance; 1 ly = 9.5 × 10¹⁵ m.
 * Galaxies; Sun in Milky Way; other stars much farther.
 */
const LY_M = 9.5e15;

export default function LightYearLab() {
  const [ly, setLy] = useState(4.24); // Proxima approx
  const metres = useMemo(() => ly * LY_M, [ly]);
  const valid = ly >= 0;

  const presets = [
    { name: "Proxima Centauri", ly: 4.24 },
    { name: "Sirius", ly: 8.6 },
    { name: "Milky Way radius (order)", ly: 50000 },
    { name: "Milky Way diameter ≈", ly: 100000 },
  ];

  const reset = () => setLy(4.24);

  return (
    <div className="lab-shell space">
      <div className="lab-header">
        <div><span className="mini-label">6.2.2 · light-years</span><h3>Measure distance in light-years</h3></div>
        <div className="big-reading"><span>Distance</span><strong>{valid ? `${ly.toLocaleString()} ly` : "—"}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="space-stage compact" role="img" aria-label="Light-year distance converter">
          <svg viewBox="0 0 340 180">
            <rect width={340} height={180} fill="#eef3f0" />
            <text x={170} y={70} textAnchor="middle" fontSize={18} fontWeight={800} fill="#173d54">1 ly = 9.5×10¹⁵ m</text>
            <text x={170} y={110} textAnchor="middle" fontSize={13} fill="#5a6a72">distance light travels in one year in vacuum</text>
            <text x={170} y={145} textAnchor="middle" fontSize={12} fill="#1c8b74" fontWeight={700}>
              {valid ? `${metres.toExponential(2)} m` : "enter ly ≥ 0"}
            </text>
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Distance (light-years)
            <input type="range" min={0} max={120000} step={0.01} value={Math.min(ly, 120000)} onChange={(e) => setLy(+e.target.value)} />
          </label>
          <label className="num-field">ly
            <input type="number" min={0} step={0.01} value={ly} onChange={(e) => setLy(Math.max(0, +e.target.value || 0))} />
          </label>
          <div className="chip-row" style={{ marginTop: 8 }}>
            {presets.map((p) => (
              <button key={p.name} type="button" onClick={() => setLy(p.ly)}>{p.name}</button>
            ))}
            <button type="button" className="reset-button" onClick={reset}>Reset</button>
          </div>
          <p className="explain" style={{ marginTop: 8 }}>
            A light-year is a <strong>distance</strong>, not a time. The Sun is one star in the Milky Way galaxy;
            other stars are much farther away than Solar System scales (AU).
            The Milky Way is about <strong>100 000 ly</strong> across.
          </p>
        </div>
      </div>
    </div>
  );
}
