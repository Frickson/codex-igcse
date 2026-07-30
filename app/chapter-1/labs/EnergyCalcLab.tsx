"use client";

import { useState } from "react";

/**
 * 1.7.2–1.7.3 — a motor lifting a load ties together work, power and
 * efficiency. Useful work out = mgΔh; the input energy is set by the
 * student and must be at least the useful output, so efficiency =
 * useful/input never exceeds 100%. Power out = useful/time. Every
 * figure is computed from the inputs, and the wasted-energy bar makes
 * the "where did the rest go?" question explicit.
 */
const g = 9.8;

export default function EnergyCalcLab() {
  const [mass, setMass] = useState(20);   // kg lifted
  const [h, setH] = useState(3);          // height (m)
  const [t, setT] = useState(4);          // time (s)
  const [input, setInput] = useState(900); // input energy (J)

  const useful = mass * g * h;                     // useful work out
  const clampedInput = Math.max(input, Math.ceil(useful)); // cannot be less than useful
  const wasted = clampedInput - useful;
  const efficiency = (useful / clampedInput) * 100;
  const powerOut = useful / t;
  const powerIn = clampedInput / t;
  const usefulPct = (useful / clampedInput) * 100;

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">1.7.2–1.7.3 · work, power &amp; efficiency</span><h3>A motor lifting a load</h3></div>
        <div className="big-reading"><span>Efficiency</span><strong>{efficiency.toFixed(0)}%</strong></div>
      </div>
      <div className="lab-grid">
        <div className="side">
          <label className="num-field wide">Load mass (kg) <strong style={{ float: "right", color: "var(--navy)" }}>{mass}</strong>
            <input type="range" min={5} max={50} value={mass} onChange={(e) => setMass(+e.target.value)} /></label>
          <label className="num-field wide">Height raised (m) <strong style={{ float: "right", color: "var(--navy)" }}>{h}</strong>
            <input type="range" min={1} max={10} value={h} onChange={(e) => setH(+e.target.value)} /></label>
          <label className="num-field wide">Time taken (s) <strong style={{ float: "right", color: "var(--navy)" }}>{t}</strong>
            <input type="range" min={1} max={12} value={t} onChange={(e) => setT(+e.target.value)} /></label>
          <label className="num-field wide">Electrical energy supplied (J) <strong style={{ float: "right", color: "var(--navy)" }}>{clampedInput}</strong>
            <input type="range" min={100} max={3000} step={50} value={input} onChange={(e) => setInput(+e.target.value)} /></label>
          {clampedInput > input && <p className="field-note zero">Input cannot be less than the useful work ({useful.toFixed(0)} J) — a machine can never output more energy than it takes in. Clamped up to {clampedInput} J.</p>}
        </div>
        <div className="side">
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Useful work out (W = mgΔh)</th><td className="num">{useful.toFixed(0)} J</td></tr>
              <tr><th>Energy wasted (heat, sound)</th><td className="num">{wasted.toFixed(0)} J</td></tr>
              <tr><th>Power output (W ÷ t)</th><td className="num">{powerOut.toFixed(0)} W</td></tr>
              <tr><th>Power input</th><td className="num">{powerIn.toFixed(0)} W</td></tr>
              <tr><th>Efficiency (useful ÷ input)</th><td className="num">{efficiency.toFixed(0)}%</td></tr>
            </tbody>
          </table>
          <div style={{ margin: "10px 0" }} aria-hidden="true">
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--navy)", marginBottom: 4 }}>Energy flow (input = {clampedInput} J)</div>
            <div style={{ display: "flex", height: 20, borderRadius: 6, overflow: "hidden", background: "#e4ece8" }}>
              <i style={{ width: `${usefulPct}%`, background: "#1c8b74" }} title="useful" />
              <i style={{ width: `${100 - usefulPct}%`, background: "#df8c38" }} title="wasted" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#60737c", marginTop: 3 }}>
              <span>useful {useful.toFixed(0)} J</span><span>wasted {wasted.toFixed(0)} J</span>
            </div>
          </div>
          <p className="field-note" aria-live="polite">Work done = energy transferred, W = Fd (here F = mg lifting the load). Power is the work done each second, P = W/t. Efficiency = useful energy out ÷ total energy in × 100%; the {wasted.toFixed(0)} J not lifting the load is transferred to the surroundings, mostly as heat.</p>
        </div>
      </div>
      <p className="lab-note">Work done by a force is W = Fd (F in the direction of motion). Power P = W/t is the rate of transferring energy, measured in watts. Efficiency = useful output ÷ total input; no real machine reaches 100% because some energy always spreads to less useful stores.</p>
    </div>
  );
}
