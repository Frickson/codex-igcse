"use client";

import { useMemo, useState } from "react";

/**
 * 2.3.1 — conduction. Relative conduction rank drives how far/how fast the
 * "heat" colour travels along a rod. Metals (free electrons + lattice
 * vibration) outpace wood/plastic; gases are poorest.
 */
const RODS: { name: string; rank: number; note: string }[] = [
  { name: "Copper", rank: 1, note: "Excellent metal conductor: lattice vibrations plus free (delocalised) electrons carry energy quickly." },
  { name: "Iron", rank: 0.55, note: "Still a metal conductor, but slower than copper — many solids sit between 'good metal' and 'insulator'." },
  { name: "Glass", rank: 0.18, note: "Non-metal solid: mainly lattice vibrations, no free electrons, so conduction is poorer." },
  { name: "Wood", rank: 0.08, note: "Thermal insulator — used for saucepan handles so heat does not reach your hand quickly." },
  { name: "Air (gas)", rank: 0.03, note: "Particles are far apart, so energy transfer by collision is slow — gases (and most liquids) are poor conductors." },
];

export default function ConductionLab() {
  const [ri, setRi] = useState(0);
  const [heat, setHeat] = useState(true);
  const rod = RODS[ri];
  const front = useMemo(() => (heat ? Math.min(1, 0.15 + rod.rank * 0.85) : 0.05), [heat, rod.rank]);

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">2.3.1 · conduction</span><h3>Which rod carries heat to the far end?</h3></div>
        <div className="big-reading"><span>Relative conductivity</span><strong>{(rod.rank * 100).toFixed(0)}%</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label={`${rod.name} rod being heated at one end`}>
          <svg viewBox="0 0 340 200">
            <defs>
              <linearGradient id="heatGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#cf5d45" />
                <stop offset={`${front * 100}%`} stopColor="#df8c38" />
                <stop offset={`${front * 100}%`} stopColor="#c4d2cd" />
                <stop offset="100%" stopColor="#eef3f0" />
              </linearGradient>
            </defs>
            <rect x={40} y={70} width={260} height={36} rx={8} fill="url(#heatGrad)" stroke="#173d54" strokeWidth={1.5} />
            <circle cx={40} cy={88} r={22} fill={heat ? "#cf5d45" : "#8b97a8"} />
            <text x={40} y={92} fill="#fff" fontSize={11} textAnchor="middle" fontWeight={700}>hot</text>
            <circle cx={300} cy={88} r={14} fill={front > 0.7 ? "#df8c38" : "#eef3f0"} stroke="#173d54" />
            <text x={170} y={150} fill="#102a38" fontSize={14} textAnchor="middle" fontWeight={700}>{rod.name}</text>
            <text x={170} y={172} fill="#60737c" fontSize={12} textAnchor="middle">Classic demo: wax melts sooner on the better conductor</text>
          </svg>
        </div>
        <div className="side">
          <div className="chip-row" role="group" aria-label="Choose a rod material">
            {RODS.map((r, i) => (
              <button key={r.name} className={ri === i ? "active" : ""} onClick={() => setRi(i)}>{r.name}</button>
            ))}
          </div>
          <div className="chip-row">
            <button className={heat ? "active" : ""} onClick={() => setHeat(true)}>Heater on</button>
            <button className={!heat ? "active" : ""} onClick={() => setHeat(false)}>Heater off</button>
          </div>
          <p className="field-note" aria-live="polite">{rod.note}</p>
        </div>
      </div>
      <p className="lab-note">How far the warm colour travels is driven by the material&apos;s relative rank — metals with free electrons lead; trapped air explains why foam and clothing insulate.</p>
    </div>
  );
}
