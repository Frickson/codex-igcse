"use client";

import { useState } from "react";

/**
 * 6.1.1.3 — Moon orbits Earth ≈1 month → cycle of phases.
 * Phase fraction from elongation angle (Sun–Earth–Moon).
 */
const PHASES = [
  { name: "New Moon", tip: "Moon between Earth and Sun — dark face toward us" },
  { name: "Waxing crescent", tip: "Thin lit crescent growing after new" },
  { name: "First quarter", tip: "Half the near side lit — about a week after new" },
  { name: "Waxing gibbous", tip: "More than half lit, still growing" },
  { name: "Full Moon", tip: "Earth between Sun and Moon — whole near side lit" },
  { name: "Waning gibbous", tip: "Lit fraction shrinking after full" },
  { name: "Last quarter", tip: "Half lit on the other side — about three weeks after new" },
  { name: "Waning crescent", tip: "Thin crescent before new again" },
];

export default function MoonPhasesLab() {
  const [day, setDay] = useState(0); // 0–29.5 ≈ synodic month
  const period = 29.5;
  const frac = ((day % period) + period) % period / period;
  const phaseIndex = Math.min(7, Math.floor(frac * 8));
  const phase = PHASES[phaseIndex];
  const angle = frac * Math.PI * 2; // Moon position around Earth; 0 = new (toward Sun)

  const ecx = 160, ecy = 150, orbitR = 78;
  const mx = ecx + orbitR * Math.cos(angle - Math.PI); // new when Moon toward Sun (+x)
  const my = ecy + orbitR * Math.sin(angle - Math.PI);

  // Lit fraction facing Earth (qualitative): 0 at new, 1 at full
  const lit = (1 - Math.cos(angle)) / 2;

  const reset = () => setDay(0);

  return (
    <div className="lab-shell space">
      <div className="lab-header">
        <div><span className="mini-label">6.1.1 · Moon phases</span><h3>Walk the Moon around Earth</h3></div>
        <div className="big-reading"><span>Phase</span><strong>{phase.name}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="space-stage" role="img" aria-label={`${phase.name}. Day ${day.toFixed(1)} of the lunar month.`}>
          <svg viewBox="0 0 340 300">
            <rect width={340} height={300} fill="#e8eef2" />
            <circle cx={300} cy={150} r={18} fill="#e8b339" />
            <text x={300} y={182} textAnchor="middle" fontSize={11} fill="#5a6a72" fontWeight={700}>Sun</text>
            <circle cx={ecx} cy={ecy} r={orbitR} fill="none" stroke="#c4d2cd" strokeWidth={1.5} strokeDasharray="4 3" />
            <circle cx={ecx} cy={ecy} r={26} fill="#3d8f7a" stroke="#1c5c4e" strokeWidth={2} />
            <text x={ecx} y={ecy + 4} textAnchor="middle" fontSize={10} fill="#fff" fontWeight={700}>Earth</text>
            {/* Moon with lit side toward Sun (+x) */}
            <defs>
              <clipPath id="moonClip"><circle cx={mx} cy={my} r={14} /></clipPath>
            </defs>
            <circle cx={mx} cy={my} r={14} fill="#2a3540" />
            <circle cx={mx} cy={my} r={14} fill="#e8e4d8" clipPath="url(#moonClip)"
              style={{ clipPath: undefined }} />
            {/* Approximate terminator: shade left or right based on lit */}
            <circle cx={mx} cy={my} r={14} fill="#2a3540" opacity={1 - lit} />
            <circle cx={mx + (lit - 0.5) * 8} cy={my} r={14} fill="#e8e4d8" opacity={0.95} clipPath="url(#moonClip)" />
            <text x={mx} y={my + 28} textAnchor="middle" fontSize={10} fill="#5a6a72" fontWeight={700}>Moon</text>
            <text x={170} y={285} textAnchor="middle" fontSize={12} fill="#5a6a72">{phase.tip}</text>
          </svg>
        </div>
        <div className="side">
          <div className="inline-controls">
            <label className="num-field wide">Day in lunar month (~29.5 d)
              <input type="range" min={0} max={29.5} step={0.1} value={day} onChange={(e) => setDay(+e.target.value)} />
            </label>
            <label className="num-field">Day
              <input type="number" min={0} max={29.5} step={0.1} value={Number(day.toFixed(1))} onChange={(e) => setDay(Math.min(29.5, Math.max(0, +e.target.value || 0)))} />
            </label>
            <button type="button" className="reset-button" onClick={reset}>Reset</button>
          </div>
          <p className="explain">
            It takes about <strong>one month</strong> for the Moon to orbit Earth. We always see the same lunar face,
            but different fractions of the sunlit hemisphere — that is the cycle of phases.
          </p>
          <p className="explain" style={{ marginTop: 8 }}>
            Approximate lit fraction facing Earth: <strong>{(lit * 100).toFixed(0)}%</strong>. At day 0 (new) lit ≈ 0%; at day ~14.8 (full) lit ≈ 100%.
          </p>
        </div>
      </div>
    </div>
  );
}
