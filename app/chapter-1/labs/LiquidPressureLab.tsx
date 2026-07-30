"use client";

import { useState } from "react";

/**
 * 1.8.2 (Supplement) — pressure in a liquid, p = ρgΔh. The pressure at
 * the probe depends only on depth, density and g — never on the width
 * of the tank. The arrow lengths on the wall grow linearly with depth
 * because the model evaluates ρgh at each level, and the probe read-out
 * is ρg times the chosen depth.
 */
const g = 9.8;

export default function LiquidPressureLab() {
  const [depth, setDepth] = useState(1.5);   // m below surface
  const [density, setDensity] = useState(1000); // kg/m³

  const pressure = density * g * depth; // Pa (pressure due to the liquid column)

  const W = 360, H = 300, surfaceY = 50, bottomY = 270, maxDepth = 3;
  const probeY = surfaceY + (depth / maxDepth) * (bottomY - surfaceY);
  // arrows at several depths, length ∝ ρg·depth
  const levels = [0.5, 1, 1.5, 2, 2.5, 3].filter((d) => d <= maxDepth);
  const maxP = density * g * maxDepth;

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">1.8.2 · pressure in a liquid · Supplement</span><h3>Deeper and denser means more pressure</h3></div>
        <div className="big-reading"><span>Pressure at probe</span><strong>{(pressure / 1000).toFixed(1)} kPa</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage tall" role="img" aria-label={`A probe ${depth} metres deep in a liquid of density ${density} kilograms per cubic metre`}>
          <svg viewBox={`0 0 ${W} ${H}`}>
            <rect x={70} y={surfaceY} width={W - 140} height={bottomY - surfaceY} fill="#bfe0ee" stroke="#173d54" strokeWidth={2} />
            <text x={W / 2} y={surfaceY - 8} fill="#60737c" fontSize={11} textAnchor="middle">surface</text>
            {levels.map((d) => {
              const y = surfaceY + (d / maxDepth) * (bottomY - surfaceY);
              const len = ((density * g * d) / maxP) * 46;
              return <g key={d}>
                <line x1={70} y1={y} x2={70 + len} y2={y} stroke="#146653" strokeWidth={2} markerEnd="url(#ar)" />
              </g>;
            })}
            <defs><marker id="ar" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#146653" /></marker></defs>
            <line x1={70} y1={probeY} x2={W - 70} y2={probeY} stroke="#cf5d45" strokeDasharray="4 3" />
            <circle cx={W / 2} cy={probeY} r={6} fill="#cf5d45" />
            <text x={W / 2 + 10} y={probeY - 6} fill="#cf5d45" fontSize={11}>probe · {depth} m</text>
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Depth below surface (m) <strong style={{ float: "right", color: "var(--navy)" }}>{depth.toFixed(1)}</strong>
            <input type="range" min={0} max={3} step={0.1} value={depth} onChange={(e) => setDepth(+e.target.value)} /></label>
          <label className="num-field wide">Liquid density (kg/m³) <strong style={{ float: "right", color: "var(--navy)" }}>{density}</strong>
            <input type="range" min={800} max={1400} step={50} value={density} onChange={(e) => setDensity(+e.target.value)} /></label>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Depth Δh</th><td className="num">{depth.toFixed(1)} m</td></tr>
              <tr><th>Density ρ</th><td className="num">{density} kg/m³</td></tr>
              <tr><th>p = ρgΔh</th><td className="num">{pressure.toFixed(0)} Pa</td></tr>
            </tbody>
          </table>
          <p className={depth === 0 ? "field-note zero" : "field-note"} aria-live="polite">{depth === 0
            ? "At the surface Δh = 0, so the pressure due to the liquid is zero — only the atmosphere pushes here."
            : `The pressure comes from the weight of liquid above: p = ρgΔh = ${density} × ${g} × ${depth.toFixed(1)} = ${pressure.toFixed(0)} Pa. It grows with depth and density, and does not depend on the width or shape of the container.`}</p>
        </div>
      </div>
      <p className="lab-note">In a liquid the pressure increases with depth and density: the change in pressure is p = ρgΔh. It acts equally in all directions at a given depth and is independent of the container&apos;s cross-section — which is why a dam is built thickest at its base.</p>
    </div>
  );
}
