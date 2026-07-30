"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 1.5.5 (Supplement) — motion in a circle at constant speed.
 * The speed is constant but the velocity (direction) changes continually,
 * so there is an acceleration and a resultant force directed to the centre.
 * The required force F = mv²/r is computed from the actual settings and
 * grows with mass and speed², and falls with radius. Qualitative model.
 */
const W = 360, H = 320, cx = W / 2, cy = H / 2;
const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function CircularMotionLab() {
  const [speed, setSpeed] = useState(6);   // m/s
  const [radius, setRadius] = useState(4); // m
  const [mass, setMass] = useState(2);     // kg
  const [angle, setAngle] = useState(0);
  const rafRef = useRef<number | null>(null);

  const force = (mass * speed * speed) / radius; // N, centripetal

  useEffect(() => {
    if (prefersReduced()) return;
    const omega = speed / radius; // rad/s (v = ωr)
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      setAngle((a) => a + omega * dt);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [speed, radius]);

  const rPix = 60 + radius * 16;
  const bx = cx + rPix * Math.cos(angle);
  const by = cy + rPix * Math.sin(angle);
  // velocity is tangent (perpendicular to radius); force points to centre
  const tx = -Math.sin(angle), ty = Math.cos(angle);

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">1.5.5 · circular motion · Supplement</span><h3>Why does a circling object need a force?</h3></div>
        <div className="big-reading"><span>Force to centre</span><strong>{force.toFixed(0)} N</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label={`An object of mass ${mass} kilograms moving at ${speed} metres per second around a circle of radius ${radius} metres`}>
          <svg viewBox={`0 0 ${W} ${H}`}>
            <defs>
              <marker id="cVel" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#1c8b74" /></marker>
              <marker id="cForce" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#cf5d45" /></marker>
            </defs>
            <circle cx={cx} cy={cy} r={rPix} fill="none" stroke="#c4d2cd" strokeDasharray="4 4" />
            <circle cx={cx} cy={cy} r={4} fill="#8b97a8" />
            {/* force arrow: toward centre */}
            <line x1={bx} y1={by} x2={bx + (cx - bx) * 0.32} y2={by + (cy - by) * 0.32} stroke="#cf5d45" strokeWidth={3} markerEnd="url(#cForce)" />
            {/* velocity arrow: tangent */}
            <line x1={bx} y1={by} x2={bx + tx * 42} y2={by + ty * 42} stroke="#1c8b74" strokeWidth={3} markerEnd="url(#cVel)" />
            <circle cx={bx} cy={by} r={11} fill="#173d54" />
            <text x={cx} y={cy - rPix - 10} fill="#cf5d45" fontSize={11} textAnchor="middle">red = force to centre · green = velocity</text>
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Speed v (m/s) <strong style={{ float: "right", color: "var(--navy)" }}>{speed}</strong>
            <input type="range" min={1} max={12} value={speed} onChange={(e) => setSpeed(+e.target.value)} /></label>
          <label className="num-field wide">Radius r (m) <strong style={{ float: "right", color: "var(--navy)" }}>{radius}</strong>
            <input type="range" min={2} max={8} value={radius} onChange={(e) => setRadius(+e.target.value)} /></label>
          <label className="num-field wide">Mass m (kg) <strong style={{ float: "right", color: "var(--navy)" }}>{mass}</strong>
            <input type="range" min={1} max={6} value={mass} onChange={(e) => setMass(+e.target.value)} /></label>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Required force (∝ mv²/r)</th><td className="num">{force.toFixed(0)} N</td></tr>
            </tbody>
          </table>
          <p className="field-note" aria-live="polite">The speed stays the same, but the velocity keeps changing direction, so the object accelerates toward the centre. That needs a resultant force pointing to the centre. It grows with mass and with speed² (faster needs much more force), and shrinks with a larger radius.</p>
        </div>
      </div>
      <p className="model-caption">Qualitative model: the arrows and the force trend are faithful, but the numbers are illustrative rather than to scale.</p>
    </div>
  );
}
