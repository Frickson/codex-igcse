"use client";

import { useState } from "react";

/**
 * 6.2.1 — Sun as medium star; mostly H & He; radiates IR/visible/UV;
 * Supplement: powered by nuclear fusion H → He.
 */
export default function SunStarLab() {
  const [showFusion, setShowFusion] = useState(true);
  const [band, setBand] = useState<"IR" | "visible" | "UV">("visible");

  return (
    <div className="lab-shell space">
      <div className="lab-header">
        <div><span className="mini-label">6.2.1 · the Sun</span><h3>What kind of star is the Sun?</h3></div>
        <div className="big-reading"><span>Class</span><strong>Medium star</strong></div>
      </div>
      <div className="lab-grid">
        <div className="space-stage" role="img" aria-label="Sun radiating infrared, visible and ultraviolet">
          <svg viewBox="0 0 340 260">
            <rect width={340} height={260} fill="#e8eef2" />
            <circle cx={170} cy={120} r={48} fill="#e8b339" />
            {showFusion && (
              <text x={170} y={124} textAnchor="middle" fontSize={12} fontWeight={800} fill="#7a4a00">H → He</text>
            )}
            <text x={170} y={190} textAnchor="middle" fontSize={12} fill="#5a6a72" fontWeight={700}>Mostly hydrogen &amp; helium</text>
            <foreignObject x={40} y={210} width={260} height={30}>
              <div className="spectrum-bar" />
            </foreignObject>
            <text x={50} y={250} fontSize={10} fill="#5a6a72">IR</text>
            <text x={155} y={250} fontSize={10} fill="#5a6a72">visible</text>
            <text x={270} y={250} fontSize={10} fill="#5a6a72">UV</text>
          </svg>
        </div>
        <div className="side">
          <div className="chip-row">
            {(["IR", "visible", "UV"] as const).map((b) => (
              <button key={b} type="button" className={band === b ? "correct" : ""} onClick={() => setBand(b)}>{b}</button>
            ))}
            <button type="button" onClick={() => setShowFusion((v) => !v)}>{showFusion ? "Hide fusion" : "Show fusion"}</button>
          </div>
          <p className="explain" style={{ marginTop: 10 }}>
            The Sun is a <strong>medium-sized</strong> star. It radiates mainly in infrared, visible and ultraviolet.
            Highlighted band: <strong>{band}</strong>
            {band === "IR" && " — felt as warmth."}
            {band === "visible" && " — what our eyes detect."}
            {band === "UV" && " — higher energy; atmosphere and suncream matter."}
          </p>
          <p className="explain" style={{ marginTop: 8 }}>
            Supplement: energy comes from <strong>nuclear fusion</strong> in the core — hydrogen nuclei join to form helium, releasing energy.
          </p>
        </div>
      </div>
    </div>
  );
}
