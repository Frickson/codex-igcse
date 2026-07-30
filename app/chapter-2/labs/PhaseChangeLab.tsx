"use client";

import { useMemo, useState } from "react";

/**
 * 2.2.3 — melting and boiling. A heating-curve model for water: temperature
 * rises in solid/liquid/gas regions but stays flat while energy goes into
 * changing state at 0 °C and 100 °C (standard atmospheric pressure).
 */
type Phase = "ice" | "melt" | "water" | "boil" | "steam";

function phaseAt(energy: number): { phase: Phase; temp: number; label: string } {
  // Arbitrary energy units along a teaching curve.
  // 0–20: heat ice −20→0; 20–50: melt at 0; 50–100: heat water 0→100;
  // 100–160: boil at 100; 160+: heat steam.
  if (energy < 20) return { phase: "ice", temp: -20 + energy, label: "Heating ice (solid)" };
  if (energy < 50) return { phase: "melt", temp: 0, label: "Melting at 0 °C — temperature steady" };
  if (energy < 100) return { phase: "water", temp: ((energy - 50) / 50) * 100, label: "Heating liquid water" };
  if (energy < 160) return { phase: "boil", temp: 100, label: "Boiling at 100 °C — temperature steady" };
  return { phase: "steam", temp: 100 + (energy - 160) * 0.5, label: "Heating steam (gas)" };
}

export default function PhaseChangeLab() {
  const [energy, setEnergy] = useState(70);
  const { phase, temp, label } = useMemo(() => phaseAt(energy), [energy]);

  const curve = useMemo(() => {
    const pts: { e: number; t: number }[] = [];
    for (let e = 0; e <= 200; e += 2) {
      pts.push({ e, t: phaseAt(e).temp });
    }
    return pts;
  }, []);

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">2.2.3 · melting &amp; boiling</span><h3>Where does the energy go on the flat parts?</h3></div>
        <div className="big-reading"><span>Temperature</span><strong>{temp.toFixed(0)} °C</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label="Heating curve for water">
          <svg viewBox="0 0 340 260">
            <line x1={40} y1={220} x2={320} y2={220} stroke="#c4d2cd" />
            <line x1={40} y1={220} x2={40} y2={30} stroke="#c4d2cd" />
            <text x={180} y={248} fill="#60737c" fontSize={11} textAnchor="middle">energy supplied →</text>
            <text x={16} y={30} fill="#60737c" fontSize={11} transform="rotate(-90 16 120)">θ / °C</text>
            <path
              d={curve.map((p, i) => {
                const x = 40 + (p.e / 200) * 280;
                const y = 220 - ((p.t + 20) / 160) * 180;
                return `${i === 0 ? "M" : "L"}${x} ${y}`;
              }).join(" ")}
              fill="none"
              stroke="#1c8b74"
              strokeWidth={2.5}
            />
            {/* mark 0 and 100 */}
            <line x1={40} y1={220 - (20 / 160) * 180} x2={320} y2={220 - (20 / 160) * 180} stroke="#c4d2cd" strokeDasharray="3 3" />
            <line x1={40} y1={220 - (120 / 160) * 180} x2={320} y2={220 - (120 / 160) * 180} stroke="#c4d2cd" strokeDasharray="3 3" />
            <text x={324} y={220 - (20 / 160) * 180 + 4} fill="#60737c" fontSize={10}>0</text>
            <text x={318} y={220 - (120 / 160) * 180 + 4} fill="#60737c" fontSize={10}>100</text>
            {(() => {
              const x = 40 + (energy / 200) * 280;
              const y = 220 - ((temp + 20) / 160) * 180;
              return <circle cx={x} cy={y} r={6} fill="#cf5d45" />;
            })()}
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Energy supplied (relative)
            <input type="range" min={0} max={200} value={energy} onChange={(e) => setEnergy(+e.target.value)} />
          </label>
          <div className="chip-row" role="group" aria-label="Jump to a stage">
            <button onClick={() => setEnergy(10)}>Ice</button>
            <button onClick={() => setEnergy(35)}>Melting</button>
            <button onClick={() => setEnergy(75)}>Water</button>
            <button onClick={() => setEnergy(130)}>Boiling</button>
            <button onClick={() => setEnergy(180)}>Steam</button>
          </div>
          <p className="eqn-line" style={{ fontSize: 18 }} aria-live="polite">{label}</p>
          <p className="field-note" aria-live="polite">
            {phase === "melt" || phase === "boil"
              ? "Energy is still being supplied, but temperature stays constant while particle attractions are overcome (melting) or particles escape to the gas (boiling)."
              : phase === "ice" || phase === "water" || phase === "steam"
                ? "In a single state, supplied energy raises the average kinetic energy of particles, so temperature rises."
                : ""}
          </p>
          <p className="field-note">Water at standard atmospheric pressure: melting point 0 °C, boiling point 100 °C. Condensation and solidification reverse these changes as particles lose energy and attractions re-form.</p>
        </div>
      </div>
      <p className="lab-note">The marker position on the heating curve is computed from the energy slider. Flat segments are phase changes at constant temperature — a core exam idea.</p>
    </div>
  );
}
