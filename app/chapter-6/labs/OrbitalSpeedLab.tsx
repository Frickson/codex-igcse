"use client";

import { useState } from "react";

/**
 * 6.1.1.4 Supplement — average orbital speed v = 2πr / T.
 * Inputs in SI; zero/invalid when r ≤ 0 or T ≤ 0.
 */
export default function OrbitalSpeedLab() {
  const [rKm, setRKm] = useState(1.5e8); // Earth–Sun ~ AU in km
  const [tDays, setTDays] = useState(365);
  const r = rKm * 1000; // m
  const T = tDays * 24 * 3600; // s
  const valid = r > 0 && T > 0;
  const v = valid ? (2 * Math.PI * r) / T : NaN; // m/s

  const presets = [
    { name: "Earth around Sun", rKm: 1.5e8, tDays: 365 },
    { name: "Moon around Earth", rKm: 3.84e5, tDays: 27.3 },
    { name: "ISS (LEO approx.)", rKm: 6.8e3, tDays: 0.064 },
  ];

  const reset = () => { setRKm(1.5e8); setTDays(365); };

  return (
    <div className="lab-shell space">
      <div className="lab-header">
        <div><span className="mini-label">6.1.1 · Supplement · orbital speed</span><h3>Average orbital speed v = 2πr / T</h3></div>
        <div className="big-reading">
          <span>v</span>
          <strong>{valid ? `${(v / 1000).toExponential(2)} km/s` : "—"}</strong>
        </div>
      </div>
      <div className="lab-grid">
        <div className="space-stage compact" role="img" aria-label="Orbital speed calculator using circumference over period">
          <svg viewBox="0 0 340 200">
            <rect width={340} height={200} fill="#eef3f0" />
            <ellipse cx={170} cy={100} rx={110} ry={55} fill="none" stroke="#1c8b74" strokeWidth={2} strokeDasharray="6 4" />
            <circle cx={170} cy={100} r={14} fill="#e8b339" />
            <circle cx={280} cy={100} r={10} fill="#3d8f7a" />
            <text x={170} y={175} textAnchor="middle" fontSize={13} fill="#5a6a72">
              circumference 2πr ÷ period T
            </text>
          </svg>
        </div>
        <div className="side">
          <div className="inline-controls">
            <label className="num-field wide">Average orbital radius r (km)
              <input type="number" value={rKm} onChange={(e) => setRKm(+e.target.value)} />
            </label>
            <label className="num-field wide">Orbital period T (days)
              <input type="number" value={tDays} onChange={(e) => setTDays(+e.target.value)} />
            </label>
          </div>
          <div className="inline-controls" style={{ marginTop: 8, flexWrap: "wrap" }}>
            {presets.map((p) => (
              <button key={p.name} type="button" onClick={() => { setRKm(p.rKm); setTDays(p.tDays); }}>{p.name}</button>
            ))}
            <button type="button" className="reset-button" onClick={reset}>Reset</button>
          </div>
          {!valid && (
            <p className="explain" style={{ color: "var(--coral, #cf5d45)" }}>
              Invalid: radius and period must both be greater than zero. Average orbital speed is undefined for r ≤ 0 or T ≤ 0.
            </p>
          )}
          {valid && (
            <p className="explain">
              Working: v = 2πr / T = 2π × ({r.toExponential(2)} m) / ({T.toExponential(2)} s)
              = <strong>{v.toExponential(3)} m/s</strong> ≈ <strong>{(v / 1000).toFixed(2)} km/s</strong>.
            </p>
          )}
          <p className="explain" style={{ marginTop: 8 }}>
            This is the <em>average</em> speed around a circular (or average-radius) orbit — distance in one period divided by the period.
          </p>
        </div>
      </div>
    </div>
  );
}
