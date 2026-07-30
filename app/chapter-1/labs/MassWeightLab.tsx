"use client";

import { useState } from "react";

/**
 * 1.3 — mass vs weight. Mass (amount of matter, and inertia) is the same
 * everywhere; weight W = mg changes with the gravitational field strength
 * g of the location. Weight and g = W/m are computed from the chosen g,
 * not from a label. In deep space g = 0 so weight is 0 while mass — and
 * inertia — remain unchanged.
 */
const PLACES: { name: string; g: number }[] = [
  { name: "Earth", g: 9.8 },
  { name: "Moon", g: 1.6 },
  { name: "Mars", g: 3.7 },
  { name: "Jupiter (cloud tops)", g: 24.8 },
  { name: "Deep space", g: 0 },
];

export default function MassWeightLab() {
  const [mass, setMass] = useState(10);   // kg
  const [pi, setPi] = useState(0);
  const g = PLACES[pi].g;
  const weight = mass * g;
  // spring-balance stretch is proportional to weight (visual only)
  const stretch = Math.min(120, weight / 3);

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">1.3 · mass &amp; weight</span><h3>Move the object — what changes?</h3></div>
        <div className="big-reading"><span>Weight on {PLACES[pi].name}</span><strong>{weight.toFixed(1)} N</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label={`A ${mass} kilogram mass on a spring balance where g is ${g} newtons per kilogram`}>
          <svg viewBox="0 0 320 300">
            {/* balance (mass, unchanged) */}
            <text x={80} y={24} fill="#60737c" fontSize={12} textAnchor="middle">balance → mass</text>
            <rect x={40} y={210} width={80} height={16} rx={3} fill="#173d54" />
            <rect x={64} y={190} width={32} height={20} rx={3} fill="#1c8b74" />
            <text x={80} y={250} fill="#102a38" fontSize={13} textAnchor="middle" fontWeight={700}>{mass} kg</text>
            {/* spring balance (weight, changes with g) */}
            <text x={240} y={24} fill="#60737c" fontSize={12} textAnchor="middle">spring → weight</text>
            <line x1={240} y1={36} x2={240} y2={60} stroke="#8b97a8" strokeWidth={2} />
            <path d={`M240 60 ${Array.from({ length: 6 }, (_, i) => `L${232 + (i % 2) * 16} ${68 + i * (stretch / 6)}`).join(" ")} L240 ${68 + stretch}`} fill="none" stroke="#df8c38" strokeWidth={2} />
            <rect x={222} y={70 + stretch} width={36} height={26} rx={4} fill="#1c8b74" />
            <text x={240} y={120 + stretch} fill="#102a38" fontSize={13} textAnchor="middle" fontWeight={700}>{weight.toFixed(0)} N</text>
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Mass (kg) <strong style={{ float: "right", color: "var(--navy)" }}>{mass}</strong>
            <input type="range" min={1} max={50} value={mass} onChange={(e) => setMass(+e.target.value)} /></label>
          <label className="num-field wide">Location
            <select value={pi} onChange={(e) => setPi(+e.target.value)}>
              {PLACES.map((p, i) => <option key={p.name} value={i}>{p.name} (g = {p.g} N/kg)</option>)}
            </select>
          </label>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Mass (constant everywhere)</th><td className="num">{mass} kg</td></tr>
              <tr><th>Field strength g</th><td className="num">{g} N/kg</td></tr>
              <tr><th>Weight W = mg</th><td className="num">{weight.toFixed(1)} N</td></tr>
            </tbody>
          </table>
          {g === 0 ? (
            <p className="field-note zero" aria-live="polite">In deep space g = 0, so the weight is 0 N — the spring balance reads nothing. But the mass is still {mass} kg: it would take just as much force to accelerate it, because inertia depends on mass, not on gravity.</p>
          ) : (
            <p className="field-note" aria-live="polite">The balance still shows {mass} kg wherever you go — mass never changes. The spring balance changes because weight W = mg depends on g, which is {g} N/kg here.</p>
          )}
        </div>
      </div>
      <p className="lab-note">Mass is the amount of matter (measured in kg) and sets an object&apos;s inertia. Weight is the gravitational force on that mass (in N) and equals m × g. Gravitational field strength g = W/m is the weight per kilogram.</p>
    </div>
  );
}
