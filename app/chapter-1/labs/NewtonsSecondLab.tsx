"use client";

import { useState } from "react";

/**
 * 1.5.1 / 1.5.3 — resultant force and F = ma, with friction.
 * If the applied push does not exceed friction the forces are balanced,
 * the resultant is zero and the object stays still. Once it does, the
 * resultant = push − friction accelerates it at a = resultant/m. Every
 * value is derived from the two forces, not from a state toggle.
 */
const W = 420, H = 200;

export default function NewtonsSecondLab() {
  const [push, setPush] = useState(30);   // N
  const [mass, setMass] = useState(5);    // kg
  const [friction, setFriction] = useState(10); // N

  const moving = push > friction;
  const resultant = moving ? push - friction : 0;
  const accel = resultant / mass;
  const balanced = push <= friction;

  const cx = 150, cy = 120, bw = 70, bh = 46;
  const pushLen = Math.min(120, push * 3);
  const fricLen = Math.min(90, friction * 3);

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">1.5.1 · 1.5.3 · F = ma · Supplement</span><h3>Turn a resultant force into acceleration</h3></div>
        <div className="big-reading"><span>Acceleration</span><strong>{accel.toFixed(2)} m/s²</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label={`A ${mass} kilogram block pushed with ${push} newtons against ${friction} newtons of friction`}>
          <svg viewBox={`0 0 ${W} ${H}`}>
            <defs>
              <marker id="fArrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 z" fill="#1c8b74" /></marker>
              <marker id="frArrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 z" fill="#cf5d45" /></marker>
            </defs>
            <line x1={20} y1={cy + bh / 2} x2={W - 20} y2={cy + bh / 2} stroke="#c4d2cd" strokeWidth={2} />
            <rect x={cx - bw / 2} y={cy - bh / 2} width={bw} height={bh} rx={5} fill="#173d54" />
            <text x={cx} y={cy + 5} fill="#fff" fontSize={13} textAnchor="middle" fontWeight={700}>{mass} kg</text>
            {/* push (right) */}
            <line x1={cx + bw / 2} y1={cy} x2={cx + bw / 2 + pushLen} y2={cy} stroke="#1c8b74" strokeWidth={4} markerEnd="url(#fArrow)" />
            <text x={cx + bw / 2 + pushLen / 2} y={cy - 10} fill="#1c8b74" fontSize={12} textAnchor="middle">push {push} N</text>
            {/* friction (left) */}
            {friction > 0 && <>
              <line x1={cx - bw / 2} y1={cy} x2={cx - bw / 2 - fricLen} y2={cy} stroke="#cf5d45" strokeWidth={4} markerEnd="url(#frArrow)" />
              <text x={cx - bw / 2 - fricLen / 2} y={cy - 10} fill="#cf5d45" fontSize={12} textAnchor="middle">friction {friction} N</text>
            </>}
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Applied push (N) <strong style={{ float: "right", color: "var(--navy)" }}>{push}</strong>
            <input type="range" min={0} max={40} value={push} onChange={(e) => setPush(+e.target.value)} /></label>
          <label className="num-field wide">Mass (kg) <strong style={{ float: "right", color: "var(--navy)" }}>{mass}</strong>
            <input type="range" min={1} max={20} value={mass} onChange={(e) => setMass(+e.target.value)} /></label>
          <label className="num-field wide">Friction (N) <strong style={{ float: "right", color: "var(--navy)" }}>{friction}</strong>
            <input type="range" min={0} max={40} value={friction} onChange={(e) => setFriction(+e.target.value)} /></label>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Resultant force</th><td className="num">{resultant.toFixed(0)} N</td></tr>
              <tr><th>Acceleration a = F/m</th><td className="num">{accel.toFixed(2)} m/s²</td></tr>
            </tbody>
          </table>
          {balanced ? (
            <p className="field-note zero" aria-live="polite">The push does not exceed friction, so the forces are balanced: the resultant force is zero and the block does not accelerate (it stays at rest or moves at constant speed).</p>
          ) : (
            <p className="field-note" aria-live="polite">The resultant force is {push} − {friction} = {resultant} N. Dividing by the mass gives a = F/m = {resultant}/{mass} = {accel.toFixed(2)} m/s². More force, or less mass, means more acceleration.</p>
          )}
        </div>
      </div>
      <p className="lab-note">A resultant (unbalanced) force changes an object&apos;s motion; balanced forces do not. The acceleration is proportional to the resultant force and inversely proportional to the mass: F = ma.</p>
    </div>
  );
}
