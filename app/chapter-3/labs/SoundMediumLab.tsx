"use client";

import { useState } from "react";

/**
 * 3.4 — sound needs a medium, and travels fastest in solids, slower in
 * liquids, slowest in gases. Each pulse's position is computed as
 * distance = speed × time (clamped at the far wall), and the arrival
 * time is t = distance / speed — so the ordering steel < water < air
 * falls out of the real speeds. A vacuum has no particles to carry the
 * vibration, so its pulse never moves: sound cannot travel through it.
 */
const MEDIA = [
  { name: "Steel (solid)", v: 5000, hex: "#2d7d9a" },
  { name: "Water (liquid)", v: 1500, hex: "#2f8f6f" },
  { name: "Air (gas)", v: 340, hex: "#df8c38" },
  { name: "Vacuum (none)", v: 0, hex: "#9a9a9a" },
];
const TRACK = 520; // px representing the full distance

export default function SoundMediumLab() {
  const [dist, setDist] = useState(1000); // metres
  const [t, setT] = useState(0.3);        // elapsed time (s)

  return (
    <div className="lab-shell waves">
      <div className="lab-header">
        <div><span className="mini-label">3.4 · speed of sound</span><h3>Same sound, different medium</h3></div>
        <div className="big-reading"><span>Elapsed time</span><strong>{t.toFixed(2)} s</strong></div>
      </div>
      <div className="lab-grid">
        <div className="waves-stage tall" style={{ background: "#f4f7f5" }}>
          <svg viewBox={`0 0 620 300`}>
            {MEDIA.map((m, i) => {
              const y = 40 + i * 62;
              const travelled = Math.min(dist, m.v * t);          // metres covered so far
              const px = 50 + (travelled / dist) * TRACK;
              const arrived = m.v > 0 && m.v * t >= dist;
              return (
                <g key={m.name}>
                  <text x={50} y={y - 12} fontSize={12} fill="#173d54">{m.name} · {m.v > 0 ? `${m.v} m/s` : "no sound"}</text>
                  <line x1={50} y1={y} x2={50 + TRACK} y2={y} stroke="#d5e0dc" strokeWidth={6} strokeLinecap="round" />
                  {/* far wall */}
                  <line x1={50 + TRACK} y1={y - 10} x2={50 + TRACK} y2={y + 10} stroke="#173d54" strokeWidth={2} />
                  {m.v > 0 && <circle cx={px} cy={y} r={7} fill={m.hex} />}
                  {arrived && <text x={50 + TRACK - 6} y={y - 12} fontSize={11} fill="#1c8b74" textAnchor="end">arrived</text>}
                </g>
              );
            })}
            <text x={50} y={292} fontSize={11} fill="#6b8f86">start</text>
            <text x={50 + TRACK} y={292} fontSize={11} fill="#6b8f86" textAnchor="end">{dist} m</text>
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Distance (m) <strong style={{ float: "right", color: "var(--navy)" }}>{dist}</strong>
            <input type="range" min={200} max={2000} step={100} value={dist} onChange={(e) => setDist(+e.target.value)} aria-label="Distance" /></label>
          <label className="num-field wide">Elapsed time (s) <strong style={{ float: "right", color: "var(--navy)" }}>{t.toFixed(2)}</strong>
            <input type="range" min={0} max={3} step={0.02} value={t} onChange={(e) => setT(+e.target.value)} aria-label="Elapsed time" /></label>
          <table className="data-table" aria-live="polite">
            <tbody>
              {MEDIA.map((m) => (
                <tr key={m.name}><th>{m.name}</th><td className="num">{m.v > 0 ? `${(dist / m.v).toFixed(2)} s` : "never"}</td></tr>
              ))}
            </tbody>
          </table>
          <p className="field-note zero" aria-live="polite">Sound is a mechanical wave: it needs particles to pass the vibration along. In a vacuum there are none, so the pulse never leaves the start — <strong>sound cannot travel through a vacuum</strong>.</p>
        </div>
      </div>
      <p className="lab-note">Arrival time is distance ÷ speed. Because particles are closest together in solids and furthest apart in gases, sound travels fastest in steel, slower in water and slowest in air — and not at all through a vacuum.</p>
    </div>
  );
}
