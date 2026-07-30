"use client";

import { useMemo, useState } from "react";

/**
 * 6.1.2.4 — light travel time between Solar System objects.
 * t = d / c with c = 3.00 × 10⁸ m/s. Zero distance → zero time; negative blocked.
 */
const C = 3e8; // m/s
const AU_M = 1.496e11;

const ROUTES: { name: string; au: number }[] = [
  { name: "Sun → Earth", au: 1 },
  { name: "Sun → Mars (avg)", au: 1.52 },
  { name: "Sun → Jupiter (avg)", au: 5.2 },
  { name: "Earth → Moon", au: 0.00257 },
];

export default function LightTravelLab() {
  const [au, setAu] = useState(1);
  const distanceM = au * AU_M;
  const valid = au >= 0;
  const seconds = useMemo(() => (valid ? distanceM / C : NaN), [distanceM, valid]);

  const format = (s: number) => {
    if (!Number.isFinite(s)) return "—";
    if (s < 60) return `${s.toFixed(1)} s`;
    if (s < 3600) return `${(s / 60).toFixed(1)} min`;
    return `${(s / 3600).toFixed(2)} h`;
  };

  const reset = () => setAu(1);

  return (
    <div className="lab-shell space">
      <div className="lab-header">
        <div><span className="mini-label">6.1.2 · light travel</span><h3>How long does sunlight take?</h3></div>
        <div className="big-reading"><span>Travel time</span><strong>{format(seconds)}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="space-stage compact" role="img" aria-label={`Light travel time across ${au} AU`}>
          <svg viewBox="0 0 340 200">
            <rect width={340} height={200} fill="#eef3f0" />
            <circle cx={40} cy={100} r={18} fill="#e8b339" />
            <circle cx={40 + Math.min(260, 40 + au * 40)} cy={100} r={10} fill="#3d8f7a" />
            <line x1={58} y1={100} x2={40 + Math.min(260, 40 + au * 40) - 12} y2={100} stroke="#df8c38" strokeWidth={2} strokeDasharray="6 4" />
            <text x={170} y={160} textAnchor="middle" fontSize={12} fill="#5a6a72">t = d / c · c = 3.00×10⁸ m/s</text>
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Distance (AU)
            <input type="range" min={0} max={30} step={0.01} value={au} onChange={(e) => setAu(+e.target.value)} />
          </label>
          <label className="num-field">AU
            <input type="number" min={0} step={0.01} value={au} onChange={(e) => setAu(Math.max(0, +e.target.value || 0))} />
          </label>
          <div className="chip-row" style={{ marginTop: 8 }}>
            {ROUTES.map((r) => (
              <button key={r.name} type="button" onClick={() => setAu(r.au)}>{r.name}</button>
            ))}
            <button type="button" className="reset-button" onClick={reset}>Reset</button>
          </div>
          {!valid ? (
            <p className="explain" style={{ color: "#cf5d45" }}>Distance cannot be negative.</p>
          ) : au === 0 ? (
            <p className="explain">Zero distance → travel time is 0. Light has nowhere to go.</p>
          ) : (
            <p className="explain">
              d = {au} AU = {distanceM.toExponential(3)} m.
              t = d/c = {seconds.toExponential(3)} s ≈ <strong>{format(seconds)}</strong>.
              Sunlight to Earth is about 8 minutes.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
