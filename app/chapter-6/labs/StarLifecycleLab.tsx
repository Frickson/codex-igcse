"use client";

import { useState } from "react";

/**
 * 6.2.2.3 — stellar life cycle paths for low/medium vs high mass stars.
 */
type Mass = "low" | "high";

const STAGES: Record<Mass, { id: string; title: string; note: string }[]> = {
  low: [
    { id: "nebula", title: "Nebula", note: "Cloud of gas and dust collapses under gravity." },
    { id: "proto", title: "Protostar", note: "Heating as gravitational energy converts; fusion not yet stable." },
    { id: "stable", title: "Stable star (main sequence)", note: "Fusion of hydrogen → helium balances gravity." },
    { id: "giant", title: "Red giant", note: "Outer layers expand after core hydrogen dwindles." },
    { id: "wd", title: "White dwarf (+ planetary nebula)", note: "Outer layers shed; hot dense core left as white dwarf." },
  ],
  high: [
    { id: "nebula", title: "Nebula", note: "Cloud of gas and dust collapses under gravity." },
    { id: "proto", title: "Protostar", note: "More massive collapse → hotter, shorter-lived path." },
    { id: "stable", title: "Stable massive star", note: "Fuses hydrogen → helium; much more luminous." },
    { id: "sg", title: "Red supergiant", note: "Huge expansion; heavier fusion stages in the core." },
    { id: "sn", title: "Supernova", note: "Catastrophic explosion; recycles elements into space." },
    { id: "rem", title: "Neutron star or black hole", note: "Core remnant: neutron star, or black hole if massive enough." },
  ],
};

export default function StarLifecycleLab() {
  const [mass, setMass] = useState<Mass>("low");
  const [step, setStep] = useState(0);
  const stages = STAGES[mass];
  const stage = stages[Math.min(step, stages.length - 1)];

  const reset = () => { setMass("low"); setStep(0); };

  return (
    <div className="lab-shell space">
      <div className="lab-header">
        <div><span className="mini-label">6.2.2 · life cycle</span><h3>Follow a star from nebula to remnant</h3></div>
        <div className="big-reading"><span>Stage</span><strong>{stage.title}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="space-stage" role="img" aria-label={`${mass} mass star at stage ${stage.title}`}>
          <svg viewBox="0 0 340 260">
            <rect width={340} height={260} fill="#e8eef2" />
            {stages.map((s, i) => {
              const x = 30 + i * (280 / Math.max(1, stages.length - 1));
              const active = i === step;
              return (
                <g key={s.id}>
                  {i < stages.length - 1 && (
                    <line x1={x} y1={120} x2={30 + (i + 1) * (280 / Math.max(1, stages.length - 1))} y2={120} stroke="#c4d2cd" strokeWidth={2} />
                  )}
                  <circle cx={x} cy={120} r={active ? 16 : 10} fill={active ? "#1c8b74" : "#8b97a8"} />
                  <text x={x} y={160} textAnchor="middle" fontSize={9} fill="#5a6a72" fontWeight={active ? 800 : 600}>
                    {s.title.split(" ")[0]}
                  </text>
                </g>
              );
            })}
            <text x={170} y={220} textAnchor="middle" fontSize={13} fill="#173d54" fontWeight={700}>{stage.note}</text>
          </svg>
        </div>
        <div className="side">
          <div className="chip-row">
            <button type="button" className={mass === "low" ? "correct" : ""} onClick={() => { setMass("low"); setStep(0); }}>Low / medium mass (like Sun)</button>
            <button type="button" className={mass === "high" ? "correct" : ""} onClick={() => { setMass("high"); setStep(0); }}>High mass</button>
          </div>
          <div className="chip-row" style={{ marginTop: 8 }}>
            <button type="button" disabled={step <= 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>← Prev</button>
            <button type="button" disabled={step >= stages.length - 1} onClick={() => setStep((s) => Math.min(stages.length - 1, s + 1))}>Next →</button>
            <button type="button" className="reset-button" onClick={reset}>Reset</button>
          </div>
          <p className="explain" style={{ marginTop: 10 }}>
            Both paths start in a nebula. After the stable period, mass decides the end:
            Sun-like stars → red giant → white dwarf; massive stars → red supergiant → supernova → neutron star or black hole.
            Supernovae recycle heavier elements into new nebulae.
          </p>
        </div>
      </div>
    </div>
  );
}
