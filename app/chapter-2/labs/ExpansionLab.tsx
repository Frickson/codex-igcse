"use client";

import { useState } from "react";

/**
 * 2.2.1 — thermal expansion. Relative expansion order is gas ≫ liquid > solid
 * at the same temperature rise (Supplement particle explanation). Everyday
 * consequences are listed for the chosen material class.
 */
type Kind = "solid" | "liquid" | "gas";

const EXPAND: Record<Kind, { factor: number; label: string; why: string; uses: string }> = {
  solid: {
    factor: 1,
    label: "Solid (e.g. metal rod)",
    why: "Particles vibrate harder but stay bonded in a lattice, so average spacing rises only a little.",
    uses: "Expansion gaps in bridges and railway rails; bimetallic strips in thermostats.",
  },
  liquid: {
    factor: 3.2,
    label: "Liquid (e.g. in a thermometer)",
    why: "Particles are close but can rearrange, so the same temperature rise opens more space than in a solid.",
    uses: "Liquid-in-glass thermometers; overflowing car coolant if the expansion tank is missing.",
  },
  gas: {
    factor: 12,
    label: "Gas (constant pressure)",
    why: "Particles are far apart with weak attractions, so heating at constant pressure expands the sample most.",
    uses: "Hot-air balloons rise; sealed cans can bulge or burst if left in strong sun.",
  },
};

export default function ExpansionLab() {
  const [kind, setKind] = useState<Kind>("solid");
  const [dT, setDT] = useState(40); // °C rise
  const meta = EXPAND[kind];
  const growth = meta.factor * (dT / 40); // normalised visual growth
  const base = 120;
  const len = base + growth * 14;

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">2.2.1 · thermal expansion</span><h3>Same temperature rise — which expands most?</h3></div>
        <div className="big-reading"><span>Relative expansion</span><strong>×{meta.factor.toFixed(1)}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label={`${meta.label} expanding with temperature`}>
          <svg viewBox="0 0 340 240">
            <text x={24} y={28} fill="#60737c" fontSize={12}>Before (cool)</text>
            <rect x={24} y={40} width={base} height={36} rx={6} fill="#8b97a8" />
            <text x={24} y={110} fill="#60737c" fontSize={12}>After (+{dT} °C)</text>
            <rect x={24} y={122} width={len} height={36} rx={6} fill="#df8c38" />
            <line x1={24 + base} y1={36} x2={24 + base} y2={170} stroke="#c4d2cd" strokeDasharray="4 3" />
            <text x={24 + len + 8} y={146} fill="#102a38" fontSize={13} fontWeight={700}>ΔL</text>
            <text x={170} y={210} fill="#60737c" fontSize={12} textAnchor="middle">
              Order at constant pressure: gas ≫ liquid &gt; solid
            </text>
          </svg>
        </div>
        <div className="side">
          <div className="chip-row" role="group" aria-label="Material class">
            {(["solid", "liquid", "gas"] as Kind[]).map((k) => (
              <button key={k} className={kind === k ? "active" : ""} onClick={() => setKind(k)}>{EXPAND[k].label.split(" ")[0]}</button>
            ))}
          </div>
          <label className="num-field wide">Temperature rise (°C)
            <input type="range" min={0} max={100} value={dT} onChange={(e) => setDT(+e.target.value)} />
          </label>
          <p className="field-note" aria-live="polite">{meta.why}</p>
          <p className="field-note"><b>Everyday:</b> {meta.uses}</p>
        </div>
      </div>
      <p className="lab-note">Qualitative model only — bar length scales with a fixed relative factor for each state, matching the syllabus order of magnitudes, not measured expansivities.</p>
    </div>
  );
}
