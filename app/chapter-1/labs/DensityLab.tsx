"use client";

import { useState } from "react";

/**
 * 1.4 — density ρ = m/V and floating. Density is computed from the actual
 * mass and volume; whether the block floats is decided by comparing its
 * density with the fluid's, not by a toggle. A zero volume makes density
 * undefined and is reported as invalid.
 */
const FLUIDS: { name: string; rho: number }[] = [
  { name: "Water", rho: 1000 },
  { name: "Seawater", rho: 1025 },
  { name: "Cooking oil", rho: 920 },
  { name: "Mercury", rho: 13600 },
];
const PRESETS: { name: string; rho: number }[] = [
  { name: "Cork", rho: 240 },
  { name: "Ice", rho: 917 },
  { name: "Oak wood", rho: 700 },
  { name: "Aluminium", rho: 2700 },
  { name: "Iron", rho: 7870 },
];

export default function DensityLab() {
  const [mass, setMass] = useState(600);   // g
  const [vol, setVol] = useState(250);     // cm³
  const [fi, setFi] = useState(0);
  const fluid = FLUIDS[fi];
  const valid = vol > 0;
  const rho = valid ? (mass / vol) * 1000 : 0;   // kg/m³  (g/cm³ ×1000)
  const floats = rho < fluid.rho;
  const submerged = valid ? Math.min(1, rho / fluid.rho) : 0;   // fraction below the surface when floating

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">1.4 · density</span><h3>Does it float? Compare the densities</h3></div>
        <div className="big-reading"><span>Density</span><strong>{valid ? rho.toFixed(0) : "—"} kg/m³</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label={`A block of density ${rho.toFixed(0)} in ${fluid.name} of density ${fluid.rho}`}>
          <svg viewBox="0 0 340 260">
            {/* fluid tank */}
            <rect x={40} y={90} width={260} height={150} rx={6} fill="#dcefe8" />
            <line x1={40} y1={90} x2={300} y2={90} stroke="#1c8b74" strokeWidth={2} />
            <text x={294} y={110} fill="#146653" fontSize={12} textAnchor="end">{fluid.name} · {fluid.rho} kg/m³</text>
            {/* block: sits with fraction `submerged` below the line if it floats, else on the bottom */}
            {valid && (() => {
              const bw = 84, bh = 60;
              const bx = 128;
              const by = floats ? 90 - bh * (1 - submerged) : 240 - bh - 4;
              return (
                <g>
                  <rect x={bx} y={by} width={bw} height={bh} rx={4} fill="#df8c38" stroke="#a85f17" strokeWidth={1.5} />
                  <text x={bx + bw / 2} y={by + bh / 2 + 4} fill="#fff" fontSize={12} textAnchor="middle" fontWeight={700}>{rho.toFixed(0)}</text>
                </g>
              );
            })()}
          </svg>
        </div>
        <div className="side">
          <div className="inline-controls">
            <label className="num-field">Mass (g)
              <input type="number" min={0} value={mass} onChange={(e) => setMass(Math.max(0, +e.target.value))} />
            </label>
            <label className="num-field">Volume (cm³)
              <input type="number" min={0} value={vol} onChange={(e) => setVol(Math.max(0, +e.target.value))} />
            </label>
          </div>
          <div className="chip-row" role="group" aria-label="Load a material preset">
            {PRESETS.map((p) => (
              <button key={p.name} onClick={() => { setVol(200); setMass(Math.round((p.rho / 1000) * 200)); }}>{p.name}</button>
            ))}
          </div>
          <label className="num-field wide">Fluid
            <select value={fi} onChange={(e) => setFi(+e.target.value)}>
              {FLUIDS.map((f, i) => <option key={f.name} value={i}>{f.name} ({f.rho} kg/m³)</option>)}
            </select>
          </label>
          {valid ? (
            <>
              <p className="eqn-line" style={{ fontSize: 18 }} aria-live="polite">ρ = m/V = {mass}/{vol} = <b>{(rho / 1000).toFixed(2)} g/cm³</b></p>
              <p className="field-note" aria-live="polite">{floats
                ? `The block (${rho.toFixed(0)} kg/m³) is less dense than the ${fluid.name.toLowerCase()} (${fluid.rho} kg/m³), so it floats — about ${(submerged * 100).toFixed(0)}% sits below the surface.`
                : `The block (${rho.toFixed(0)} kg/m³) is denser than the ${fluid.name.toLowerCase()} (${fluid.rho} kg/m³), so it sinks to the bottom.`}</p>
            </>
          ) : (
            <p className="field-note zero" aria-live="polite">Volume is zero, so density m/V is undefined — you cannot divide by a zero volume. Enter a real volume.</p>
          )}
        </div>
      </div>
      <p className="lab-note">Density is mass per unit volume, ρ = m/V (1 g/cm³ = 1000 kg/m³). An object floats in a fluid when its density is less than the fluid&apos;s, and sinks when it is greater — the reason ice floats on water but iron does not.</p>
    </div>
  );
}
