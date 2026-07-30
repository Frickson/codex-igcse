"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 1.6.1 (Supplement) — momentum p = mv and its conservation.
 * The post-collision velocities are solved from conservation of momentum
 * (and, for a bounce, conservation of kinetic energy), so the total
 * momentum after always equals the total before. The animation replays
 * the very velocities that conservation demands.
 */
const W = 620, H = 220, groundY = 150;
const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function MomentumLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const [m1, setM1] = useState(2);
  const [u1, setU1] = useState(4);
  const [m2, setM2] = useState(3);
  const [u2, setU2] = useState(-1);
  const [type, setType] = useState<"stick" | "bounce">("stick");

  let v1: number, v2: number;
  if (type === "stick") { const v = (m1 * u1 + m2 * u2) / (m1 + m2); v1 = v; v2 = v; }
  else {
    v1 = ((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2);
    v2 = ((m2 - m1) * u2 + 2 * m1 * u1) / (m1 + m2);
  }
  const pBefore = m1 * u1 + m2 * u2;
  const pAfter = m1 * v1 + m2 * v2;

  const draw = (x1: number, x2: number, stuck: boolean) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = "#c4d2cd"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(W, groundY); ctx.stroke();
    const size1 = 30 + m1 * 6, size2 = 30 + m2 * 6;
    ctx.fillStyle = "#173d54"; ctx.fillRect(x1 - size1 / 2, groundY - size1, size1, size1);
    ctx.fillStyle = "#df8c38"; ctx.fillRect(x2 - size2 / 2, groundY - size2, size2, size2);
    ctx.fillStyle = "#fff"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
    ctx.fillText(`${m1}kg`, x1, groundY - size1 / 2 + 4);
    ctx.fillText(`${m2}kg`, x2, groundY - size2 / 2 + 4);
    ctx.textAlign = "left";
    void stuck;
  };

  const run = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const startX1 = 120, startX2 = 420;
    const scale = 12; // px per (m/s) per frame-second
    if (prefersReduced()) { draw(startX1 + u1 * 8, startX2 + u2 * 8, false); return; }
    let x1 = startX1, x2 = startX2, collided = false;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      if (!collided) {
        x1 += u1 * scale * dt; x2 += u2 * scale * dt;
        if (x2 - x1 <= (30 + m1 * 6) / 2 + (30 + m2 * 6) / 2) collided = true;
      } else {
        x1 += v1 * scale * dt; x2 += v2 * scale * dt;
      }
      draw(x1, x2, collided && type === "stick");
      if (x1 > -60 && x1 < W + 60 && x2 > -60 && x2 < W + 60) rafRef.current = requestAnimationFrame(tick);
      else rafRef.current = null;
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => { draw(120, 420, false); return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }; }, [m1, m2]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">1.6.1 · momentum · Supplement</span><h3>Collisions conserve momentum</h3></div>
        <div className="rad-select" role="group" aria-label="Collision type">
          <button className={type === "stick" ? "active" : ""} onClick={() => setType("stick")}>Stick together</button>
          <button className={type === "bounce" ? "active" : ""} onClick={() => setType("bounce")}>Bounce (elastic)</button>
        </div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" style={{ minHeight: 0 }}><canvas ref={canvasRef} width={W} height={H} aria-label="Two trolleys colliding on a track" /></div>
        <div className="side">
          <div className="inline-controls">
            <label className="num-field">Mass 1 (kg)<input type="number" min={1} max={8} value={m1} onChange={(e) => setM1(Math.max(1, Math.min(8, +e.target.value)))} /></label>
            <label className="num-field">u₁ (m/s)<input type="number" min={-6} max={6} value={u1} onChange={(e) => setU1(Math.max(-6, Math.min(6, +e.target.value)))} /></label>
          </div>
          <div className="inline-controls">
            <label className="num-field">Mass 2 (kg)<input type="number" min={1} max={8} value={m2} onChange={(e) => setM2(Math.max(1, Math.min(8, +e.target.value)))} /></label>
            <label className="num-field">u₂ (m/s)<input type="number" min={-6} max={6} value={u2} onChange={(e) => setU2(Math.max(-6, Math.min(6, +e.target.value)))} /></label>
          </div>
          <div className="chip-row"><button onClick={run}>Run collision</button></div>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Momentum before (m₁u₁ + m₂u₂)</th><td className="num">{pBefore.toFixed(1)} kg·m/s</td></tr>
              <tr><th>Velocity 1 after</th><td className="num">{v1.toFixed(2)} m/s</td></tr>
              <tr><th>Velocity 2 after</th><td className="num">{v2.toFixed(2)} m/s</td></tr>
              <tr><th>Momentum after</th><td className="num">{pAfter.toFixed(1)} kg·m/s</td></tr>
            </tbody>
          </table>
          <p className="field-note" aria-live="polite">Total momentum after ({pAfter.toFixed(1)} kg·m/s) equals total momentum before ({pBefore.toFixed(1)} kg·m/s). With no external force the momentum lost by one trolley is exactly gained by the other. Negative values just mean motion to the left.</p>
        </div>
      </div>
      <p className="lab-note">Momentum p = mv is mass in motion, a vector. In any collision or explosion with no external resultant force, total momentum is conserved. A resultant force equals the rate of change of momentum, F = Δ(mv)/t.</p>
    </div>
  );
}
