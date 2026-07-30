"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 1.2 / 1.5.4 — free fall vs fall with air resistance.
 * Acceleration a = (mg − drag)/m, with drag = c·v² acting upward. Without
 * air resistance drag = 0 so a = g (constant). With it, drag grows with
 * speed until drag = mg, the resultant force is zero and the object falls
 * at constant terminal velocity v_t = √(mg/c). The curve is integrated
 * step-by-step from that rule.
 */
const W = 620, H = 380, g = 9.8;
const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function FreeFallLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const [mass, setMass] = useState(80);   // kg (skydiver)
  const [drag, setDrag] = useState(false);
  const [c, setC] = useState(0.25);       // drag coefficient (kg/m)
  const [tNow, setTNow] = useState(0);

  const vTerm = drag ? Math.sqrt((mass * g) / c) : Infinity;
  const tmax = 20, vmax = drag ? Math.max(20, Math.ceil(vTerm / 10) * 10 + 10) : 120;

  // velocity at a given time, integrated from a = (mg - c v^2)/m
  const velAt = (t: number) => {
    if (!drag) return g * t;
    const dt = 0.02; let v = 0;
    for (let s = 0; s < t; s += dt) { const a = g - (c * v * v) / mass; v += a * dt; }
    return v;
  };

  const draw = (t: number) => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const padL = 56, padB = 44, padT = 24, padR = 16;
    const x0 = padL, y0 = H - padB, gw = W - padL - padR, gh = H - padB - padT;
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = "#c4d2cd"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x0, padT); ctx.lineTo(x0, y0); ctx.lineTo(W - padR, y0); ctx.stroke();
    ctx.fillStyle = "#60737c"; ctx.font = "12px sans-serif";
    ctx.fillText("speed (m/s)", 8, 16); ctx.fillText("time (s)", W - 60, y0 + 32);
    for (let gi = 0; gi <= 4; gi++) {
      const yy = y0 - gh * gi / 4;
      ctx.strokeStyle = "#e4ece8"; ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(W - padR, yy); ctx.stroke();
      ctx.fillStyle = "#60737c"; ctx.fillText(String(Math.round(vmax * gi / 4)), 8, yy + 4);
    }
    for (let gx = 0; gx <= tmax; gx += 5) { const xx = x0 + gw * gx / tmax; ctx.fillStyle = "#60737c"; ctx.fillText(String(gx), xx - 5, y0 + 18); }
    const X = (tt: number) => x0 + gw * tt / tmax;
    const Y = (v: number) => y0 - gh * Math.min(v, vmax) / vmax;

    // terminal-velocity guide
    if (drag && isFinite(vTerm)) {
      const yb = Y(vTerm); ctx.strokeStyle = "#df8c38"; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(W - padR, yb); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#a85f17"; ctx.fillText(`terminal ${vTerm.toFixed(0)} m/s`, x0 + 8, yb - 6);
    }
    // full curve
    ctx.strokeStyle = "#173d54"; ctx.lineWidth = 2.6; ctx.beginPath();
    const steps = 240;
    if (!drag) { ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(tmax), Y(g * tmax)); }
    else {
      const dt = tmax / steps; let v = 0;
      ctx.moveTo(X(0), Y(0));
      for (let i = 1; i <= steps; i++) { const a = g - (c * v * v) / mass; v += a * dt; ctx.lineTo(X(i * dt), Y(v)); }
    }
    ctx.stroke();
    // marker at current time
    const vN = velAt(t); const mx = X(t), my = Y(vN);
    ctx.strokeStyle = "#1c8b74"; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(mx, y0); ctx.lineTo(mx, my); ctx.lineTo(x0, my); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#1c8b74"; ctx.beginPath(); ctx.arc(mx, my, 4, 0, 7); ctx.fill();
  };

  // draw is intentionally omitted: it closes over the same state in the deps.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { draw(tNow); }, [mass, drag, c, tNow]);

  const play = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (prefersReduced()) { setTNow(tmax); return; }
    const start = performance.now(); const base = 0;
    const tick = (now: number) => {
      const t = base + (now - start) / 1000;
      if (t >= tmax) { setTNow(tmax); rafRef.current = null; return; }
      setTNow(t); rafRef.current = requestAnimationFrame(tick);
    };
    setTNow(0); rafRef.current = requestAnimationFrame(tick);
  };
  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); }, []);

  const vN = velAt(tNow);
  const weight = mass * g;
  const dragF = drag ? c * vN * vN : 0;
  const resultant = weight - dragF;
  const accel = resultant / mass;

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">1.2 · 1.5.4 · free fall &amp; terminal velocity</span><h3>What happens to a falling body?</h3></div>
        <div className="big-reading"><span>Speed now</span><strong>{vN.toFixed(1)} m/s</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage tall"><canvas ref={canvasRef} width={W} height={H} aria-label="Speed–time graph of a falling body" /></div>
        <div className="side">
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--navy)", fontWeight: 700 }}>
            <input type="checkbox" checked={drag} onChange={(e) => setDrag(e.target.checked)} /> Include air resistance
          </label>
          <label className="num-field wide">Mass (kg) <strong style={{ float: "right", color: "var(--navy)" }}>{mass}</strong>
            <input type="range" min={40} max={120} value={mass} onChange={(e) => setMass(+e.target.value)} /></label>
          <label className="num-field wide" style={{ opacity: drag ? 1 : 0.4 }}>Drag factor c (kg/m) <strong style={{ float: "right", color: "var(--navy)" }}>{c.toFixed(2)}</strong>
            <input type="range" min={5} max={60} value={Math.round(c * 100)} disabled={!drag} onChange={(e) => setC(+e.target.value / 100)} /></label>
          <label className="num-field wide">Time elapsed (s) <strong style={{ float: "right", color: "var(--navy)" }}>{tNow.toFixed(1)}</strong>
            <input type="range" min={0} max={tmax} step={0.1} value={tNow} onChange={(e) => setTNow(+e.target.value)} /></label>
          <div className="chip-row"><button onClick={play}>Drop &amp; play</button><button onClick={() => setTNow(0)}>Reset</button></div>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Weight (mg, down)</th><td className="num">{weight.toFixed(0)} N</td></tr>
              <tr><th>Air resistance (up)</th><td className="num">{dragF.toFixed(0)} N</td></tr>
              <tr><th>Resultant force</th><td className="num">{resultant.toFixed(0)} N</td></tr>
              <tr><th>Acceleration</th><td className="num">{accel.toFixed(2)} m/s²</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="field-note" aria-live="polite">{drag
        ? `With air resistance, drag grows with speed. When it balances the weight the resultant force is zero, acceleration becomes 0, and the body keeps falling at a constant terminal velocity of ${vTerm.toFixed(0)} m/s.`
        : "With no air resistance the only force is weight, so the resultant force is constant and the body accelerates steadily at g = 9.8 m/s² — the speed–time line is straight and never levels off."}</p>
      <p className="model-caption">Drag is modelled as proportional to speed² (a common approximation); values are illustrative, but the balance of forces and the approach to terminal velocity are physically faithful.</p>
    </div>
  );
}
