"use client";

import { useState } from "react";

/**
 * 2.1.1–2.1.2 — states of matter. Particle diagrams are drawn from the
 * chosen state (arrangement + motion), not from a decorative preset.
 * Change-of-state labels follow the syllabus (no sublimation).
 */
type State = "solid" | "liquid" | "gas";

const META: Record<State, { title: string; arrange: string; motion: string; spacing: string }> = {
  solid: {
    title: "Solid",
    arrange: "Regular lattice — each particle vibrates about a fixed position.",
    motion: "Vibration only; strong forces hold neighbours in place.",
    spacing: "Closest packing; almost no empty space between particles.",
  },
  liquid: {
    title: "Liquid",
    arrange: "Close together but disordered — particles can slide past each other.",
    motion: "Particles move about while staying in contact with neighbours.",
    spacing: "Similar spacing to a solid; takes the shape of the container.",
  },
  gas: {
    title: "Gas",
    arrange: "Far apart and random — no fixed neighbours.",
    motion: "Fast, free motion in all directions; frequent collisions.",
    spacing: "Much larger average separation than solid or liquid.",
  },
};

function particlePoints(state: State): { x: number; y: number; vx: number; vy: number }[] {
  if (state === "solid") {
    const pts = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 5; c++) {
        pts.push({ x: 70 + c * 36, y: 70 + r * 36, vx: 0, vy: 0 });
      }
    }
    return pts;
  }
  if (state === "liquid") {
    return [
      [80, 150], [115, 168], [150, 145], [185, 170], [220, 148],
      [95, 195], [130, 210], [165, 190], [200, 205], [235, 188],
      [110, 235], [145, 248], [180, 230], [215, 245],
    ].map(([x, y], i) => ({ x, y, vx: (i % 3) - 1, vy: (i % 2) ? 0.6 : -0.4 }));
  }
  return [
    [55, 55], [140, 70], [230, 50], [90, 120], [180, 130],
    [270, 110], [60, 200], [150, 190], [250, 210], [110, 260],
    [200, 250], [280, 270],
  ].map(([x, y], i) => ({ x, y, vx: ((i * 3) % 5) - 2, vy: ((i * 5) % 7) - 3 }));
}

export default function StatesOfMatterLab() {
  const [state, setState] = useState<State>("solid");
  const meta = META[state];
  const pts = particlePoints(state);

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">2.1.1–2.1.2 · states of matter</span><h3>Same particles — which state?</h3></div>
        <div className="big-reading"><span>State</span><strong>{meta.title}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label={`Particle diagram of a ${meta.title.toLowerCase()}`}>
          <svg viewBox="0 0 340 300">
            <rect x={30} y={30} width={280} height={250} rx={8} fill="#f7faf8" stroke="#c4d2cd" strokeWidth={2} />
            {pts.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r={state === "gas" ? 7 : 10} fill="#1c8b74" opacity={0.9}>
                  {state !== "solid" && (
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values={`0 0; ${p.vx * 4} ${p.vy * 4}; 0 0`}
                      dur={state === "gas" ? "1.2s" : "2.4s"}
                      repeatCount="indefinite"
                    />
                  )}
                  {state === "solid" && (
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0 0; 1.5 -1.5; 0 0; -1.5 1.5; 0 0"
                      dur="1.1s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
              </g>
            ))}
            <text x={170} y={22} fill="#60737c" fontSize={12} textAnchor="middle">{meta.title} particle diagram</text>
          </svg>
        </div>
        <div className="side">
          <div className="chip-row" role="group" aria-label="Choose a state of matter">
            {(["solid", "liquid", "gas"] as State[]).map((s) => (
              <button key={s} className={state === s ? "active" : ""} onClick={() => setState(s)}>{META[s].title}</button>
            ))}
          </div>
          <table className="data-table">
            <tbody>
              <tr><th>Arrangement</th><td>{meta.arrange}</td></tr>
              <tr><th>Motion</th><td>{meta.motion}</td></tr>
              <tr><th>Spacing</th><td>{meta.spacing}</td></tr>
            </tbody>
          </table>
          <p className="field-note" aria-live="polite">
            Changes of state (syllabus): melting ⇄ freezing, boiling/evaporation ⇄ condensation.
            Solid ↔ gas transfers are not required.
          </p>
        </div>
      </div>
      <p className="lab-note">The diagram is rebuilt from the selected state&apos;s arrangement and motion rules. Forces and distances between particles (Supplement) decide whether a sample holds a shape, flows, or fills a container.</p>
    </div>
  );
}
