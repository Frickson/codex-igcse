"use client";

import { useMemo, useState } from "react";

/**
 * 2.3.3 — radiation. Emission/absorption factors from surface colour and
 * texture; net power from area and surface temperature. Balance: equal in
 * and out → constant temperature.
 */
type Surface = { name: string; emit: number; absorb: number };

const SURFACES: Surface[] = [
  { name: "Dull black", emit: 1, absorb: 1 },
  { name: "Shiny black", emit: 0.85, absorb: 0.9 },
  { name: "Dull white", emit: 0.45, absorb: 0.4 },
  { name: "Shiny silver", emit: 0.15, absorb: 0.12 },
];

export default function RadiationLab() {
  const [si, setSi] = useState(0);
  const [tempC, setTempC] = useState(80);
  const [area, setArea] = useState(1); // relative
  const [incoming, setIncoming] = useState(40); // relative power absorbed if perfect absorber
  const s = SURFACES[si];

  const T = tempC + 273;
  // Qualitative: emission ∝ e * A * T^4 (Stefan–Boltzmann idea, teaching scale)
  const emitted = useMemo(() => s.emit * area * Math.pow(T / 350, 4) * 50, [s.emit, area, T]);
  const absorbed = incoming * s.absorb;
  const net = absorbed - emitted;
  const balance =
    Math.abs(net) < 3 ? "roughly constant temperature" :
    net > 0 ? "warming (absorbs more than it emits)" :
    "cooling (emits more than it absorbs)";

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">2.3.3 · radiation</span><h3>Surface, temperature and energy balance</h3></div>
        <div className="big-reading"><span>Net power (rel.)</span><strong>{net > 0 ? "+" : ""}{net.toFixed(0)}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label="Object exchanging infrared radiation">
          <svg viewBox="0 0 340 260">
            <rect x={110} y={80} width={120} height={90} rx={10}
              fill={si === 0 || si === 1 ? "#1a1a1a" : si === 2 ? "#f4f1ea" : "#c0c6cc"}
              stroke="#173d54" strokeWidth={2} />
            <text x={170} y={130} fill={si <= 1 ? "#eee" : "#102a38"} fontSize={12} textAnchor="middle">{s.name}</text>
            {/* outgoing rays */}
            {Array.from({ length: Math.max(1, Math.round(s.emit * 5)) }, (_, i) => {
              const a = -60 + i * 30;
              const rad = (a * Math.PI) / 180;
              const x2 = 170 + Math.cos(rad) * (50 + emitted * 0.4);
              const y2 = 125 + Math.sin(rad) * (40 + emitted * 0.25);
              return <line key={`o${i}`} x1={170} y1={125} x2={x2} y2={y2} stroke="#cf5d45" strokeWidth={2} opacity={0.7} />;
            })}
            {/* incoming */}
            {Array.from({ length: Math.max(1, Math.round(s.absorb * 4)) }, (_, i) => (
              <line key={`i${i}`} x1={40} y1={50 + i * 25} x2={110} y2={90 + i * 15} stroke="#1c8b74" strokeWidth={2} opacity={0.6} />
            ))}
            <text x={170} y={220} fill="#102a38" fontSize={13} textAnchor="middle" fontWeight={700}>{balance}</text>
            <text x={170} y={242} fill="#60737c" fontSize={11} textAnchor="middle">IR · no medium required</text>
          </svg>
        </div>
        <div className="side">
          <div className="chip-row" role="group" aria-label="Surface">
            {SURFACES.map((surf, i) => (
              <button key={surf.name} className={si === i ? "active" : ""} onClick={() => setSi(i)}>{surf.name}</button>
            ))}
          </div>
          <label className="num-field wide">Surface temperature (°C)
            <input type="range" min={-20} max={200} value={tempC} onChange={(e) => setTempC(+e.target.value)} />
          </label>
          <label className="num-field wide">Surface area (relative)
            <input type="range" min={0.4} max={2} step={0.1} value={area} onChange={(e) => setArea(+e.target.value)} />
          </label>
          <label className="num-field wide">Incoming radiation (relative)
            <input type="range" min={0} max={100} value={incoming} onChange={(e) => setIncoming(+e.target.value)} />
          </label>
          <table className="data-table">
            <tbody>
              <tr><th>Emitted (rel.)</th><td className="num">{emitted.toFixed(0)}</td></tr>
              <tr><th>Absorbed (rel.)</th><td className="num">{absorbed.toFixed(0)}</td></tr>
            </tbody>
          </table>
          <p className="field-note" aria-live="polite">
            Dull black surfaces are the best emitters and absorbers; shiny silver is poor at both and a good reflector. All objects emit infrared; radiation needs no medium.
          </p>
          <p className="field-note">
            Earth stays temperate when incoming solar radiation balances radiation emitted from the surface — change either side and the temperature shifts.
          </p>
        </div>
      </div>
      <p className="lab-note">Emission scales with emissivity × area × T⁴ (teaching scale). Net = absorbed − emitted decides warming, cooling or steady temperature.</p>
    </div>
  );
}
