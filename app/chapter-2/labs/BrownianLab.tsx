"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 2.1.2 — Brownian motion. A large "smoke" particle jitters because many
 * invisible fast fluid molecules collide with it from random directions.
 * Turning collisions off freezes the path — showing the cause is collisions,
 * not an intrinsic wobble of the smoke particle.
 */
type Pt = { x: number; y: number };

export default function BrownianLab() {
  const [running, setRunning] = useState(true);
  const [trail, setTrail] = useState<Pt[]>([{ x: 170, y: 130 }]);
  const pos = useRef<Pt>({ x: 170, y: 130 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!running) return;
    let frame = 0;
    const id = window.setInterval(() => {
      // Random kicks model random molecular collisions (qualitative).
      const dx = (Math.random() - 0.5) * 16;
      const dy = (Math.random() - 0.5) * 16;
      pos.current = {
        x: Math.min(310, Math.max(30, pos.current.x + dx)),
        y: Math.min(230, Math.max(30, pos.current.y + dy)),
      };
      setTrail((t) => [...t.slice(-80), { ...pos.current }]);
      frame++;
      if (frame > 400) frame = 0;
    }, 80);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 340, 260);
    ctx.fillStyle = "#eef3f0";
    ctx.fillRect(0, 0, 340, 260);
    // faint fluid molecules (not to scale)
    ctx.fillStyle = "rgba(28,139,116,0.18)";
    for (let i = 0; i < 40; i++) {
      const x = (i * 47) % 340;
      const y = (i * 73) % 260;
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
    if (trail.length > 1) {
      ctx.strokeStyle = "#df8c38";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      trail.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
    }
    const p = trail[trail.length - 1] ?? pos.current;
    ctx.fillStyle = "#cf5d45";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#60737c";
    ctx.font = "12px sans-serif";
    ctx.fillText("microscopic particle (e.g. smoke)", 12, 18);
    ctx.fillText("fluid molecules (much smaller, faster)", 12, 248);
  }, [trail]);

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">2.1.2 · Brownian motion</span><h3>Why does the smoke particle jitter?</h3></div>
        <div className="big-reading"><span>Collisions</span><strong>{running ? "on" : "off"}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage compact" role="img" aria-label="Brownian motion trail of a microscopic particle">
          <canvas ref={canvasRef} width={340} height={260} style={{ width: "100%", height: "auto", borderRadius: 12 }} />
        </div>
        <div className="side">
          <div className="chip-row" role="group" aria-label="Control collisions">
            <button className={running ? "active" : ""} onClick={() => setRunning(true)}>Collisions on</button>
            <button className={!running ? "active" : ""} onClick={() => setRunning(false)}>Collisions off</button>
            <button onClick={() => { pos.current = { x: 170, y: 130 }; setTrail([{ x: 170, y: 130 }]); }}>Reset path</button>
          </div>
          <p className="field-note" aria-live="polite">
            {running
              ? "Random collisions with fast fluid molecules push the larger microscopic particle in changing directions — Brownian motion. This is evidence for the kinetic particle model."
              : "With collisions off, the particle stops. The wobble is not built into the smoke particle; it is caused by unseen molecular impacts."}
          </p>
          <p className="field-note">
            Supplement wording: use atoms/molecules for the fluid particles, and microscopic particles for the visible speck in suspension.
          </p>
        </div>
      </div>
      <p className="lab-note">Turning collisions off freezes the trail so students see the cause (random molecular hits) rather than a free-running animation.</p>
    </div>
  );
}
