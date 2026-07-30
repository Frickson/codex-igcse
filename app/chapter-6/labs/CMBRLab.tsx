"use client";

import { useState } from "react";

/**
 * 6.2.3.5–6 Supplement — CMBR everywhere; stretched into microwave band by expansion.
 */
export default function CMBRLab() {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="lab-shell space">
      <div className="lab-header">
        <div><span className="mini-label">6.2.3 · Supplement · CMBR</span><h3>Why is the sky filled with microwaves?</h3></div>
        <div className="big-reading"><span>CMBR</span><strong>{expanded ? "Microwave now" : "Hotter earlier"}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="space-stage" role="img" aria-label="Cosmic microwave background filling space">
          <svg viewBox="0 0 340 240">
            <rect width={340} height={240} fill={expanded ? "#1a2a36" : "#5a2a20"} />
            {Array.from({ length: 60 }, (_, i) => (
              <circle
                key={i}
                cx={(i * 47) % 340}
                cy={(i * 73) % 240}
                r={expanded ? 1.5 : 2.5}
                fill={expanded ? "#c4d2cd" : "#e8b339"}
                opacity={0.7}
              />
            ))}
            <text x={170} y={220} textAnchor="middle" fontSize={12} fill="#f7faf8" fontWeight={700}>
              {expanded ? "Observed everywhere around us (microwaves)" : "Early hot radiation (shorter wavelengths)"}
            </text>
          </svg>
        </div>
        <div className="side">
          <div className="chip-row">
            <button type="button" className={!expanded ? "correct" : ""} onClick={() => setExpanded(false)}>Early Universe</button>
            <button type="button" className={expanded ? "correct" : ""} onClick={() => setExpanded(true)}>Today</button>
          </div>
          <p className="explain" style={{ marginTop: 10 }}>
            Cosmic microwave background radiation (CMBR) is detected from <strong>all directions</strong>.
            It was produced early in the Universe and has been stretched into the microwave region as space expanded —
            key Supplement evidence alongside redshift for the Big Bang picture.
          </p>
        </div>
      </div>
    </div>
  );
}
