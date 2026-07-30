"use client";

import { useState } from "react";

/**
 * 2.2.2 — specific heat capacity. ΔE = m c Δθ is computed from the inputs;
 * a zero mass or zero Δθ makes energy transfer 0 / undefined respectively
 * for "needed energy", and materials show different c values.
 */
const MATERIALS: { name: string; c: number }[] = [
  { name: "Water", c: 4200 },
  { name: "Aluminium", c: 900 },
  { name: "Copper", c: 390 },
  { name: "Glass", c: 840 },
  { name: "Olive oil", c: 1970 },
];

export default function SpecificHeatLab() {
  const [mi, setMi] = useState(0);
  const [mass, setMass] = useState(0.5); // kg
  const [dTheta, setDTheta] = useState(20); // °C or K difference
  const mat = MATERIALS[mi];
  const valid = mass > 0;
  const energy = valid ? mass * mat.c * dTheta : 0;

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">2.2.2 · specific heat capacity</span><h3>How much energy to raise the temperature?</h3></div>
        <div className="big-reading"><span>Energy needed</span><strong>{valid ? `${(energy / 1000).toFixed(1)} kJ` : "—"}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label="Heating a sample of chosen material">
          <svg viewBox="0 0 340 260">
            <rect x={110} y={40} width={120} height={140} rx={8} fill="#dcefe8" stroke="#1c8b74" strokeWidth={2} />
            <rect x={120} y={160 - Math.min(110, dTheta * 2.2)} width={100} height={Math.min(110, dTheta * 2.2)} rx={4} fill="#df8c38" opacity={0.85} />
            <text x={170} y={110} fill="#102a38" fontSize={14} textAnchor="middle" fontWeight={700}>{mat.name}</text>
            <text x={170} y={130} fill="#146653" fontSize={12} textAnchor="middle">c = {mat.c} J/(kg °C)</text>
            {/* heater */}
            <rect x={130} y={200} width={80} height={18} rx={4} fill="#cf5d45" />
            <text x={170} y={248} fill="#60737c" fontSize={12} textAnchor="middle">heater supplies ΔE</text>
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Material
            <select value={mi} onChange={(e) => setMi(+e.target.value)}>
              {MATERIALS.map((m, i) => <option key={m.name} value={i}>{m.name} (c = {m.c})</option>)}
            </select>
          </label>
          <div className="inline-controls">
            <label className="num-field">Mass (kg)
              <input type="number" min={0} step={0.1} value={mass} onChange={(e) => setMass(Math.max(0, +e.target.value))} />
            </label>
            <label className="num-field">Δθ (°C)
              <input type="number" min={0} step={1} value={dTheta} onChange={(e) => setDTheta(Math.max(0, +e.target.value))} />
            </label>
          </div>
          {valid ? (
            <>
              <p className="eqn-line" style={{ fontSize: 17 }} aria-live="polite">
                ΔE = m c Δθ = {mass} × {mat.c} × {dTheta} = <b>{energy.toFixed(0)} J</b>
              </p>
              <p className="field-note" aria-live="polite">
                A temperature rise increases the object&apos;s internal energy. Supplement: that means a rise in the average kinetic energy of its particles. Specific heat capacity c is the energy per kilogram per °C.
              </p>
            </>
          ) : (
            <p className="field-note zero" aria-live="polite">Mass is zero — there is no sample to heat. Enter a mass greater than 0.</p>
          )}
          <p className="field-note">
            Measuring c (idea): heat a known mass with a measured electrical energy (or flame + temp rise), then rearrange c = ΔE / (m Δθ).
          </p>
        </div>
      </div>
      <p className="lab-note">Energy is computed from ΔE = m c Δθ using the selected material&apos;s c. Water&apos;s large c explains why it stores a lot of thermal energy for a modest temperature rise.</p>
    </div>
  );
}
