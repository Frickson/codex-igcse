"use client";

import { useState } from "react";

/**
 * 6.1.1.2 — Earth orbits the Sun ≈365 days; axial tilt → seasons.
 * Qualitative model: season follows which hemisphere leans toward the Sun.
 */
type Season = "nh-summer" | "nh-winter" | "equinox";

const META: Record<Season, { title: string; nh: string; sh: string; why: string; angle: number }> = {
  "nh-summer": {
    title: "Northern summer",
    nh: "Tilted toward the Sun — longer days, more direct sunlight",
    sh: "Tilted away — shorter days, less direct sunlight",
    why: "The Northern Hemisphere leans toward the Sun along Earth's orbit.",
    angle: -28,
  },
  "nh-winter": {
    title: "Northern winter",
    nh: "Tilted away — shorter days, less direct sunlight",
    sh: "Tilted toward the Sun — longer days, more direct sunlight",
    why: "Half an orbit later, the same tilt points the North away from the Sun.",
    angle: 28,
  },
  equinox: {
    title: "Equinox",
    nh: "Neither pole strongly favored — day ≈ night",
    sh: "Neither pole strongly favored — day ≈ night",
    why: "Axis tilt is sideways to the Sun–Earth line, so both hemispheres get similar illumination.",
    angle: 0,
  },
};

export default function SeasonsLab() {
  const [season, setSeason] = useState<Season>("nh-summer");
  const meta = META[season];
  const cx = 200, cy = 150, orbitR = 90;

  // Place Earth on orbit: summer left of Sun, winter right, equinox top
  const earthPos = season === "nh-summer" ? { x: cx - orbitR, y: cy }
    : season === "nh-winter" ? { x: cx + orbitR, y: cy }
    : { x: cx, y: cy - orbitR };

  const reset = () => setSeason("nh-summer");

  return (
    <div className="lab-shell space">
      <div className="lab-header">
        <div><span className="mini-label">6.1.1 · seasons</span><h3>Tilt and orbit — why seasons change</h3></div>
        <div className="big-reading"><span>Season</span><strong>{meta.title}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="space-stage" role="img" aria-label={`${meta.title}. ${meta.why}`}>
          <svg viewBox="0 0 340 300">
            <rect width={340} height={300} fill="#e8eef2" />
            <ellipse cx={cx} cy={cy} rx={orbitR} ry={orbitR * 0.55} fill="none" stroke="#c4d2cd" strokeWidth={2} strokeDasharray="5 4" />
            <circle cx={cx} cy={cy} r={20} fill="#e8b339" />
            <text x={cx} y={cy + 36} textAnchor="middle" fontSize={11} fill="#5a6a72" fontWeight={700}>Sun</text>
            <g transform={`translate(${earthPos.x} ${earthPos.y})`}>
              <circle r={22} fill="#3d8f7a" stroke="#1c5c4e" strokeWidth={2} />
              <line
                x1={Math.sin((meta.angle * Math.PI) / 180) * -28}
                y1={Math.cos((meta.angle * Math.PI) / 180) * -28}
                x2={Math.sin((meta.angle * Math.PI) / 180) * 28}
                y2={Math.cos((meta.angle * Math.PI) / 180) * 28}
                stroke="#cf5d45"
                strokeWidth={2.5}
              />
              <text x={0} y={-34} textAnchor="middle" fontSize={10} fill="#cf5d45" fontWeight={800}>axis</text>
              <text x={0} y={40} textAnchor="middle" fontSize={10} fill="#1c5c4e" fontWeight={700}>Earth</text>
            </g>
            <text x={170} y={285} textAnchor="middle" fontSize={12} fill="#5a6a72">{meta.why}</text>
          </svg>
        </div>
        <div className="side">
          <div className="inline-controls">
            {([
              ["nh-summer", "N summer"],
              ["equinox", "Equinox"],
              ["nh-winter", "N winter"],
            ] as const).map(([id, label]) => (
              <button key={id} type="button" className={season === id ? "correct" : ""} onClick={() => setSeason(id)}>{label}</button>
            ))}
            <button type="button" className="reset-button" onClick={reset}>Reset</button>
          </div>
          <p className="explain"><strong>North:</strong> {meta.nh}</p>
          <p className="explain"><strong>South:</strong> {meta.sh}</p>
          <p className="explain" style={{ marginTop: 8 }}>
            Earth orbits the Sun once in about <strong>365 days</strong>. Seasons are <em>not</em> mainly because Earth is closer or farther —
            they come from the <strong>tilted axis</strong> changing which hemisphere leans toward the Sun.
          </p>
        </div>
      </div>
    </div>
  );
}
