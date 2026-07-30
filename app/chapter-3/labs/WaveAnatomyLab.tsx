"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 3.1 — the anatomy of a wave and v = fλ. The wave speed shown is
 * computed as frequency × wavelength, and the animation's phase speed
 * is driven by that same product (ω/k = fλ), so a faster-scrolling wave
 * really does mean a larger v. A toggle switches between a transverse
 * wave (particles move ⟂ to travel) and a longitudinal wave (particles
 * move along the travel direction, forming compressions and rarefactions).
 */
const W = 620, H = 220, mid = H / 2;
const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function WaveAnatomyLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const [freq, setFreq] = useState(2);        // Hz
  const [wavelength, setWavelength] = useState(3); // m
  const [amp, setAmp] = useState(50);         // px (display amplitude)
  const [kind, setKind] = useState<"transverse" | "longitudinal">("transverse");

  const speed = freq * wavelength; // v = fλ (m/s)

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const pxPerMetre = 80;
    const k = (2 * Math.PI) / (wavelength * pxPerMetre); // spatial angular frequency (per px)
    const omega = 2 * Math.PI * freq;                    // temporal angular frequency
    // phase velocity ω/k = freq * wavelength * pxPerMetre  → matches v = fλ

    const render = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      if (kind === "transverse") {
        // baseline
        ctx.strokeStyle = "#c4d2cd"; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, mid); ctx.lineTo(W, mid); ctx.stroke();
        // wave
        ctx.strokeStyle = "#1c8b74"; ctx.lineWidth = 2.5; ctx.beginPath();
        for (let x = 0; x <= W; x++) {
          const y = mid - amp * Math.sin(k * x - omega * t);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();
        // wavelength marker between two crests (crest where k x - ωt = π/2)
        const crestPhase = Math.PI / 2;
        const x1 = (crestPhase + omega * t) / k;
        const wlPx = wavelength * pxPerMetre;
        const cx1 = ((x1 % wlPx) + wlPx) % wlPx + wlPx; // a crest safely on-canvas
        ctx.strokeStyle = "#173d54"; ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(cx1, mid - amp - 12); ctx.lineTo(cx1 + wlPx, mid - amp - 12); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#173d54"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
        ctx.fillText("λ", cx1 + wlPx / 2, mid - amp - 16);
        // amplitude marker
        ctx.strokeStyle = "#df8c38"; ctx.beginPath(); ctx.moveTo(30, mid); ctx.lineTo(30, mid - amp); ctx.stroke();
        ctx.fillStyle = "#a85f17"; ctx.textAlign = "left"; ctx.fillText("amplitude", 36, mid - amp / 2);
      } else {
        // longitudinal: a row of particles displaced along x
        const N = 90, spacing = W / N;
        for (let i = 0; i < N; i++) {
          const x0 = i * spacing;
          const disp = (amp * 0.5) * Math.sin(k * x0 - omega * t);
          const x = x0 + disp;
          // density (compression) → darker/larger
          const comp = Math.cos(k * x0 - omega * t); // +1 at compression centre
          const r = 2.4 + 1.8 * Math.max(0, comp);
          ctx.fillStyle = comp > 0.4 ? "#173d54" : "#6b8f86";
          ctx.beginPath(); ctx.arc(x, mid, r, 0, Math.PI * 2); ctx.fill();
        }
        // label a compression and a rarefaction
        ctx.fillStyle = "#173d54"; ctx.font = "12px sans-serif"; ctx.textAlign = "center";
        const wlPx = wavelength * pxPerMetre;
        const compX = ((omega * t) / k) % wlPx;
        ctx.fillText("compression", ((compX % W) + W) % W, mid - 40);
        ctx.fillStyle = "#a85f17";
        ctx.fillText("rarefaction", ((compX + wlPx / 2) % W + W) % W, mid + 48);
      }
    };

    if (prefersReduced()) { render(0); return; }
    let start: number | null = null;
    const loop = (now: number) => {
      if (start === null) start = now;
      render((now - start) / 1000);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [freq, wavelength, amp, kind]);

  return (
    <div className="lab-shell waves">
      <div className="lab-header">
        <div><span className="mini-label">3.1 · wave properties · v = fλ</span><h3>Read a wave, then compute its speed</h3></div>
        <div className="rad-select" role="group" aria-label="Wave type">
          <button className={kind === "transverse" ? "active" : ""} onClick={() => setKind("transverse")}>Transverse</button>
          <button className={kind === "longitudinal" ? "active" : ""} onClick={() => setKind("longitudinal")}>Longitudinal</button>
        </div>
      </div>
      <div className="lab-grid">
        <div className="waves-stage" style={{ minHeight: 0 }}><canvas ref={canvasRef} width={W} height={H} aria-label={`Animated ${kind} wave, frequency ${freq} hertz, wavelength ${wavelength} metres`} /></div>
        <div className="side">
          <label className="num-field wide">Frequency (Hz) <strong style={{ float: "right", color: "var(--navy)" }}>{freq}</strong>
            <input type="range" min={1} max={5} step={1} value={freq} onChange={(e) => setFreq(+e.target.value)} /></label>
          <label className="num-field wide">Wavelength (m) <strong style={{ float: "right", color: "var(--navy)" }}>{wavelength}</strong>
            <input type="range" min={1} max={5} step={1} value={wavelength} onChange={(e) => setWavelength(+e.target.value)} /></label>
          <label className="num-field wide">Amplitude <strong style={{ float: "right", color: "var(--navy)" }}>{amp}</strong>
            <input type="range" min={10} max={80} value={amp} onChange={(e) => setAmp(+e.target.value)} /></label>
          <div className="big-reading" style={{ marginTop: 6 }}><span>Wave speed v = fλ</span><strong>{speed.toFixed(0)} m/s</strong></div>
          <p className="field-note" aria-live="polite">v = fλ = {freq} × {wavelength} = {speed} m/s. Amplitude sets how much energy the wave carries; it does not change the speed. {kind === "transverse" ? "In a transverse wave the particles vibrate at right angles to the direction the energy travels." : "In a longitudinal wave the particles vibrate along the direction of travel, bunching into compressions and spreading into rarefactions."}</p>
        </div>
      </div>
      <p className="lab-note">A wave transfers energy without transferring matter. Wavelength λ is the distance between adjacent points in phase (crest to crest), frequency f is the number of waves per second, and the two are linked to the wave speed by v = fλ.</p>
    </div>
  );
}
