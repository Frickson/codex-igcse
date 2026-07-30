"use client";

import { useState } from "react";

/**
 * 1.7.1 — conservation of energy along a ramp: gravitational store ↔
 * kinetic store. KE gained equals GPE lost (frictionless); with friction
 * some transfers to the internal/thermal store. Every bar is computed
 * from the position and mass, and the three stores always sum to the
 * starting GPE.
 */
const g = 9.8;

export default function EnergyStoresLab() {
  const [mass, setMass] = useState(2);   // kg
  const [h0, setH0] = useState(5);       // start height (m)
  const [f, setF] = useState(0.4);       // fraction down the ramp (0 top .. 1 bottom)
  const [friction, setFriction] = useState(false);

  const total = mass * g * h0;                 // total energy budget
  const height = h0 * (1 - f);                 // current height
  const gpe = mass * g * height;
  const lossFrac = friction ? 0.35 : 0;        // fraction of transferred energy → thermal
  const transferred = total - gpe;             // GPE already lost
  const thermal = transferred * lossFrac;
  const ke = transferred - thermal;
  const v = Math.sqrt(Math.max(0, (2 * ke) / mass));

  const bar = (val: number) => `${(val / total) * 100}%`;

  // ramp geometry
  const W = 360, H = 300;
  const topX = 60, topY = 60, botX = 300, botY = 240;
  const ballX = topX + (botX - topX) * f;
  const ballY = topY + (botY - topY) * f;

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">1.7.1 · energy stores &amp; conservation</span><h3>Energy is transferred, not lost</h3></div>
        <div className="big-reading"><span>Speed here</span><strong>{v.toFixed(1)} m/s</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label={`A ${mass} kilogram ball part-way down a ramp from ${h0} metres`}>
          <svg viewBox={`0 0 ${W} ${H}`}>
            <line x1={topX} y1={topY} x2={botX} y2={botY} stroke="#173d54" strokeWidth={3} />
            <line x1={botX} y1={botY} x2={W - 10} y2={botY} stroke="#173d54" strokeWidth={3} />
            <line x1={topX} y1={topY} x2={topX} y2={botY} stroke="#c4d2cd" strokeDasharray="4 3" />
            <text x={topX - 6} y={(topY + botY) / 2} fill="#60737c" fontSize={11} textAnchor="end">{h0} m</text>
            <circle cx={ballX} cy={ballY - 12} r={12} fill="#1c8b74" />
            <text x={ballX} y={ballY - 26} fill="#146653" fontSize={11} textAnchor="middle">{mass} kg</text>
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Mass (kg) <strong style={{ float: "right", color: "var(--navy)" }}>{mass}</strong>
            <input type="range" min={1} max={6} value={mass} onChange={(e) => setMass(+e.target.value)} /></label>
          <label className="num-field wide">Start height (m) <strong style={{ float: "right", color: "var(--navy)" }}>{h0}</strong>
            <input type="range" min={1} max={10} value={h0} onChange={(e) => setH0(+e.target.value)} /></label>
          <label className="num-field wide">Position down ramp <strong style={{ float: "right", color: "var(--navy)" }}>{(f * 100).toFixed(0)}%</strong>
            <input type="range" min={0} max={100} value={f * 100} onChange={(e) => setF(+e.target.value / 100)} /></label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--navy)", fontWeight: 700 }}>
            <input type="checkbox" checked={friction} onChange={(e) => setFriction(e.target.checked)} /> Include friction
          </label>
          <div style={{ display: "grid", gap: 6, margin: "6px 0" }} aria-hidden="true">
            <div style={{ fontSize: 11, fontWeight: 800, color: "#146653" }}>Gravitational store: {gpe.toFixed(0)} J</div>
            <div style={{ height: 12, background: "#e4ece8", borderRadius: 6 }}><i style={{ display: "block", height: "100%", width: bar(gpe), background: "#1c8b74", borderRadius: 6 }} /></div>
            <div style={{ fontSize: 11, fontWeight: 800, color: "#173d54" }}>Kinetic store: {ke.toFixed(0)} J</div>
            <div style={{ height: 12, background: "#e4ece8", borderRadius: 6 }}><i style={{ display: "block", height: "100%", width: bar(ke), background: "#173d54", borderRadius: 6 }} /></div>
            {friction && <>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#a85f17" }}>Thermal store (friction): {thermal.toFixed(0)} J</div>
              <div style={{ height: 12, background: "#e4ece8", borderRadius: 6 }}><i style={{ display: "block", height: "100%", width: bar(thermal), background: "#df8c38", borderRadius: 6 }} /></div>
            </>}
          </div>
          <p className="field-note" aria-live="polite">Total energy stays {total.toFixed(0)} J. As the ball descends, the gravitational store falls and the {friction ? "kinetic and thermal stores" : "kinetic store"} rise{friction ? "" : "s"} to match — {friction ? "friction transfers some energy to the surroundings as heat, so the ball is slower than the frictionless case, but no energy vanishes." : "KE gained = GPE lost, so at the bottom ½mv² = mgh."}</p>
        </div>
      </div>
      <p className="lab-note">Energy is stored kinetically, gravitationally, elastically, chemically, electrostatically, nuclearly and internally (thermally), and is transferred between stores by forces, heating, waves or electric current. By the principle of conservation of energy the total is always constant.</p>
    </div>
  );
}
