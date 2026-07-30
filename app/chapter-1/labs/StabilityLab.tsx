"use client";

import { useState } from "react";

/**
 * 1.5.7 — centre of gravity and stability. As the block is tilted, the
 * vertical line of action of its weight moves. While that line falls
 * inside the base the weight provides a restoring moment and the block
 * settles back; once it passes the pivoting edge the block topples. The
 * verdict is computed by comparing the tilt with the toppling angle set
 * by the block's own width and height.
 */
const W = 360, H = 320;

export default function StabilityLab() {
  const [tilt, setTilt] = useState(10);      // degrees
  const [bw, setBw] = useState(90);          // block width (px)
  const [bh, setBh] = useState(150);         // block height (px)

  // toppling angle: when the CoG's vertical passes the base edge, i.e. tan θ = (w/2)/(h/2)
  const toppleAngle = (Math.atan((bw / 2) / (bh / 2)) * 180) / Math.PI;
  const toppled = tilt > toppleAngle;

  const baseX = 180, baseY = 250;
  const rad = (tilt * Math.PI) / 180;
  // pivot at the bottom-right corner of the base
  const px = baseX + bw / 2, py = baseY;
  // corners relative to pivot, before rotation (block sits with base from -bw..0 in x, up by bh)
  const corners = [
    { x: -bw, y: 0 }, { x: 0, y: 0 }, { x: 0, y: -bh }, { x: -bw, y: -bh },
  ].map((c) => ({
    x: px + (c.x * Math.cos(rad) - c.y * Math.sin(rad)),
    y: py + (c.x * Math.sin(rad) + c.y * Math.cos(rad)),
  }));
  // centre of gravity (centre of block)
  const cg = { x: -bw / 2, y: -bh / 2 };
  const cgP = { x: px + (cg.x * Math.cos(rad) - cg.y * Math.sin(rad)), y: py + (cg.x * Math.sin(rad) + cg.y * Math.cos(rad)) };

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">1.5.7 · centre of gravity &amp; stability</span><h3>Tilt the block — will it topple?</h3></div>
        <div className="big-reading"><span>{toppled ? "Topples" : "Returns"}</span><strong>{tilt}°</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label={`A block ${bw} wide and ${bh} tall tilted ${tilt} degrees`}>
          <svg viewBox={`0 0 ${W} ${H}`}>
            <line x1={20} y1={baseY} x2={W - 20} y2={baseY} stroke="#c4d2cd" strokeWidth={2} />
            <polygon points={corners.map((c) => `${c.x},${c.y}`).join(" ")} fill={toppled ? "#f0cdb0" : "#dcefe8"} stroke={toppled ? "#cf5d45" : "#1c8b74"} strokeWidth={2} />
            {/* weight line from CoG straight down */}
            <line x1={cgP.x} y1={cgP.y} x2={cgP.x} y2={baseY + 30} stroke="#173d54" strokeWidth={1.5} strokeDasharray="4 3" />
            <circle cx={cgP.x} cy={cgP.y} r={5} fill="#173d54" />
            <text x={cgP.x + 8} y={cgP.y - 6} fill="#173d54" fontSize={11}>centre of gravity</text>
            {/* pivot edge */}
            <circle cx={px} cy={py} r={4} fill="#cf5d45" />
            <text x={px + 6} y={py + 16} fill="#cf5d45" fontSize={11}>pivot edge</text>
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Tilt angle (°) <strong style={{ float: "right", color: "var(--navy)" }}>{tilt}</strong>
            <input type="range" min={0} max={45} value={tilt} onChange={(e) => setTilt(+e.target.value)} /></label>
          <label className="num-field wide">Base width <strong style={{ float: "right", color: "var(--navy)" }}>{bw}</strong>
            <input type="range" min={40} max={150} value={bw} onChange={(e) => setBw(+e.target.value)} /></label>
          <label className="num-field wide">Height <strong style={{ float: "right", color: "var(--navy)" }}>{bh}</strong>
            <input type="range" min={80} max={220} value={bh} onChange={(e) => setBh(+e.target.value)} /></label>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Toppling angle</th><td className="num">{toppleAngle.toFixed(0)}°</td></tr>
              <tr><th>Current tilt</th><td className="num">{tilt}°</td></tr>
            </tbody>
          </table>
          <p className={toppled ? "field-note zero" : "field-note"} aria-live="polite">{toppled
            ? `The weight's line of action has passed the pivot edge, so its moment now turns the block further over — it topples. A wider base and lower centre of gravity would raise the ${toppleAngle.toFixed(0)}° toppling angle.`
            : `The line of action of the weight still falls inside the base, so its moment about the pivot edge rotates the block back — it is stable and returns. It will topple once the tilt passes ${toppleAngle.toFixed(0)}°.`}</p>
        </div>
      </div>
      <p className="lab-note">An object topples when the vertical line through its centre of gravity falls outside its base. A lower centre of gravity and a wider base make an object more stable, because it must be tilted further before that happens.</p>
    </div>
  );
}
