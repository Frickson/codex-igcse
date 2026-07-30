"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 1.2 — speed–time graph of a three-phase journey.
 * Gradient of each phase = acceleration (Δv/Δt); area under the whole
 * graph = distance travelled. Both are computed exactly from the phase
 * values, and the distance–time view is their running integral.
 */
const W = 620, H = 380;

export default function MotionGraphLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [v1, setV1] = useState(20);   // cruise speed (m/s)
  const [t1, setT1] = useState(8);    // accelerate 0→v1 (s)
  const [t2, setT2] = useState(10);   // constant (s)
  const [t3, setT3] = useState(4);    // decelerate v1→0 (s)
  const [view, setView] = useState<"vt" | "dt">("vt");

  const tEnd = t1 + t2 + t3;
  const aUp = t1 > 0 ? v1 / t1 : 0;
  const aDown = t3 > 0 ? -v1 / t3 : 0;
  const dist = 0.5 * t1 * v1 + v1 * t2 + 0.5 * t3 * v1;   // area under speed–time graph

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const padL = 56, padB = 44, padT = 24, padR = 16;
    const x0 = padL, y0 = H - padB, gw = W - padL - padR, gh = H - padB - padT;
    const tmax = 30, vmax = 40;
    ctx.clearRect(0, 0, W, H);

    // axes
    ctx.strokeStyle = "#c4d2cd"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x0, padT); ctx.lineTo(x0, y0); ctx.lineTo(W - padR, y0); ctx.stroke();
    ctx.fillStyle = "#60737c"; ctx.font = "12px sans-serif";
    ctx.fillText(view === "vt" ? "speed (m/s)" : "distance (m)", 8, 16);
    ctx.fillText("time (s)", W - 60, y0 + 32);

    const ymax = view === "vt" ? vmax : Math.max(50, Math.ceil(dist / 50) * 50);
    for (let g = 0; g <= 4; g++) {
      const yy = y0 - gh * g / 4;
      ctx.strokeStyle = "#e4ece8"; ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(W - padR, yy); ctx.stroke();
      ctx.fillStyle = "#60737c"; ctx.fillText(String(Math.round(ymax * g / 4)), 8, yy + 4);
    }
    for (let gx = 0; gx <= tmax; gx += 5) { const xx = x0 + gw * gx / tmax; ctx.fillStyle = "#60737c"; ctx.fillText(String(gx), xx - 5, y0 + 18); }

    const X = (t: number) => x0 + gw * t / tmax;
    const Yv = (v: number) => y0 - gh * v / ymax;
    const Yd = (d: number) => y0 - gh * d / ymax;

    if (view === "vt") {
      // filled area = distance
      ctx.fillStyle = "rgba(28,139,116,.14)";
      ctx.beginPath(); ctx.moveTo(X(0), Yv(0)); ctx.lineTo(X(t1), Yv(v1)); ctx.lineTo(X(t1 + t2), Yv(v1)); ctx.lineTo(X(tEnd), Yv(0)); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#173d54"; ctx.lineWidth = 2.6;
      ctx.beginPath(); ctx.moveTo(X(0), Yv(0)); ctx.lineTo(X(t1), Yv(v1)); ctx.lineTo(X(t1 + t2), Yv(v1)); ctx.lineTo(X(tEnd), Yv(0)); ctx.stroke();
      ctx.fillStyle = "#1c8b74"; ctx.font = "11px sans-serif";
      ctx.fillText("area = distance", X(t1 + t2 / 2) - 34, Yv(v1 / 2));
    } else {
      // distance–time: integral of the speed profile (parabola, line, parabola)
      ctx.strokeStyle = "#173d54"; ctx.lineWidth = 2.6; ctx.beginPath();
      const steps = 240;
      for (let i = 0; i <= steps; i++) {
        const t = tEnd * i / steps;
        let d: number;
        if (t <= t1) d = 0.5 * aUp * t * t;
        else if (t <= t1 + t2) d = 0.5 * t1 * v1 + v1 * (t - t1);
        else { const tt = t - t1 - t2; d = 0.5 * t1 * v1 + v1 * t2 + (v1 * tt + 0.5 * aDown * tt * tt); }
        const px = X(t), py = Yd(d);
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  }, [v1, t1, t2, t3, view, tEnd, aUp, aDown, dist]);

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">1.2 · motion graphs</span><h3>Read speed, acceleration and distance from a graph</h3></div>
        <div className="rad-select" role="group" aria-label="Graph type">
          <button className={view === "vt" ? "active" : ""} onClick={() => setView("vt")}>Speed–time</button>
          <button className={view === "dt" ? "active" : ""} onClick={() => setView("dt")}>Distance–time</button>
        </div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage tall"><canvas ref={canvasRef} width={W} height={H} aria-label={`${view === "vt" ? "Speed" : "Distance"}–time graph of a journey lasting ${tEnd} seconds`} /></div>
        <div className="side">
          <label className="num-field wide">Cruise speed v (m/s) <strong style={{ float: "right", color: "var(--navy)" }}>{v1}</strong>
            <input type="range" min={0} max={40} value={v1} onChange={(e) => setV1(+e.target.value)} /></label>
          <label className="num-field wide">Speeding up t₁ (s) <strong style={{ float: "right", color: "var(--navy)" }}>{t1}</strong>
            <input type="range" min={0} max={14} value={t1} onChange={(e) => setT1(+e.target.value)} /></label>
          <label className="num-field wide">Constant t₂ (s) <strong style={{ float: "right", color: "var(--navy)" }}>{t2}</strong>
            <input type="range" min={0} max={16} value={t2} onChange={(e) => setT2(+e.target.value)} /></label>
          <label className="num-field wide">Slowing down t₃ (s) <strong style={{ float: "right", color: "var(--navy)" }}>{t3}</strong>
            <input type="range" min={0} max={14} value={t3} onChange={(e) => setT3(+e.target.value)} /></label>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Acceleration (phase 1) = v/t₁</th><td className="num">{aUp.toFixed(2)} m/s²</td></tr>
              <tr><th>Acceleration (phase 3)</th><td className="num">{aDown.toFixed(2)} m/s²</td></tr>
              <tr><th>Total distance = area</th><td className="num">{dist.toFixed(0)} m</td></tr>
            </tbody>
          </table>
          <p className="field-note" aria-live="polite">On a speed–time graph the <b>gradient</b> is acceleration ({aUp.toFixed(2)} m/s² while speeding up) and the <b>area</b> underneath is the distance ({dist.toFixed(0)} m). Phase 3&apos;s gradient is negative ({aDown.toFixed(2)} m/s²) — that is deceleration.</p>
        </div>
      </div>
      <p className="lab-note">Switch to the distance–time view: the same journey now curves upward where the object accelerates and runs straight where the speed is constant, because distance is the running total of the area under the speed–time graph.</p>
    </div>
  );
}
