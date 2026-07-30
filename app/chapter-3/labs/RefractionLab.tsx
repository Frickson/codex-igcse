"use client";

import { useState } from "react";

/**
 * 3.2.2 — refraction and total internal reflection. Glass fills the
 * lower half, air the upper half; the boundary is horizontal at y = cy
 * and the normal is vertical. The ray can start in air (going down) or
 * in glass (going up).
 *
 *  - air → glass:  n = sin i / sin r  ⇒  sin r = sin i / n  (always refracts, bends toward normal)
 *  - glass → air:  sin r = n · sin i   ⇒  total internal reflection when n·sin i > 1,
 *                  i.e. when i exceeds the critical angle c = arcsin(1/n).
 */
const W = 620, H = 320, cx = 310, cy = 160, rayLen = 150;

export default function RefractionLab() {
  const [angle, setAngle] = useState(30);          // angle of incidence from the normal (deg)
  const [n, setN] = useState(1.5);                 // refractive index of the glass
  const [fromAir, setFromAir] = useState(true);    // ray starts in air (true) or glass (false)

  const i = (angle * Math.PI) / 180;
  const critical = Math.asin(1 / n) * 180 / Math.PI; // critical angle (only meaningful glass→air)

  // compute refraction / TIR
  let sinR: number, tir = false;
  if (fromAir) sinR = Math.sin(i) / n;             // ≤ sin i, so r ≤ i (bends toward normal)
  else {
    sinR = n * Math.sin(i);
    if (sinR > 1) { tir = true; sinR = 0; }
  }
  const r = tir ? 0 : Math.asin(Math.min(1, Math.max(-1, sinR)));
  const rDeg = tir ? null : (r * 180) / Math.PI;

  // geometry: incidence point at (cx, cy). Incident ray sits on the source side.
  const srcSign = fromAir ? -1 : 1;                // -1: source above (air), +1: source below (glass)
  const inc = { x: cx - rayLen * Math.sin(i), y: cy + srcSign * rayLen * Math.cos(i) };
  // refracted ray continues on the far side (opposite sign)
  const refr = { x: cx + rayLen * Math.sin(r), y: cy - srcSign * rayLen * Math.cos(r) };
  // internally reflected ray (always drawn faintly; the main ray when TIR)
  const reflx = { x: cx + rayLen * Math.sin(i), y: cy + srcSign * rayLen * Math.cos(i) };

  return (
    <div className="lab-shell waves">
      <div className="lab-header">
        <div><span className="mini-label">3.2.2 · refraction &amp; TIR</span><h3>n = sin i / sin r</h3></div>
        <div className="big-reading"><span>{tir ? "Total internal reflection" : "Angle of refraction"}</span><strong>{tir ? "TIR" : `${rDeg!.toFixed(0)}°`}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="waves-stage tall">
          <svg viewBox={`0 0 ${W} ${H}`}>
            {/* media */}
            <rect x={0} y={0} width={W} height={cy} fill="#eaf3f7" />
            <rect x={0} y={cy} width={W} height={H - cy} fill="#cfe0d9" />
            <text x={12} y={22} fontSize={12} fill="#6b8f86">air (n = 1.0)</text>
            <text x={12} y={H - 12} fontSize={12} fill="#3f6b60">glass (n = {n.toFixed(2)})</text>
            {/* boundary + normal */}
            <line x1={0} y1={cy} x2={W} y2={cy} stroke="#173d54" strokeWidth={2} />
            <line x1={cx} y1={30} x2={cx} y2={H - 30} stroke="#c4d2cd" strokeDasharray="5 4" />
            <text x={cx + 6} y={40} fontSize={12} fill="#6b8f86">normal</text>
            {/* incident ray */}
            <line x1={inc.x} y1={inc.y} x2={cx} y2={cy} stroke="#df8c38" strokeWidth={2.5} markerEnd="url(#aO)" />
            {/* refracted ray (hidden during TIR) */}
            {!tir && <line x1={cx} y1={cy} x2={refr.x} y2={refr.y} stroke="#1c8b74" strokeWidth={2.5} markerEnd="url(#aG)" />}
            {/* internally reflected ray — faint unless it is the only outgoing ray */}
            <line x1={cx} y1={cy} x2={reflx.x} y2={reflx.y} stroke={tir ? "#c0392b" : "#c4d2cd"} strokeWidth={tir ? 2.5 : 1.5} strokeDasharray={tir ? "0" : "4 3"} markerEnd={tir ? "url(#aR)" : undefined} />
            <circle cx={cx} cy={cy} r={3} fill="#173d54" />
            <defs>
              <marker id="aO" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#df8c38" /></marker>
              <marker id="aG" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1c8b74" /></marker>
              <marker id="aR" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#c0392b" /></marker>
            </defs>
          </svg>
        </div>
        <div className="side">
          <div className="rad-select" role="group" aria-label="Ray direction">
            <button className={fromAir ? "active" : ""} onClick={() => setFromAir(true)}>Air → glass</button>
            <button className={!fromAir ? "active" : ""} onClick={() => setFromAir(false)}>Glass → air</button>
          </div>
          <label className="num-field wide">Angle of incidence (°) <strong style={{ float: "right", color: "var(--navy)" }}>{angle}</strong>
            <input type="range" min={0} max={89} value={angle} onChange={(e) => setAngle(+e.target.value)} /></label>
          <label className="num-field wide">Refractive index n <strong style={{ float: "right", color: "var(--navy)" }}>{n.toFixed(2)}</strong>
            <input type="range" min={1.3} max={2} step={0.05} value={n} onChange={(e) => setN(+e.target.value)} /></label>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Angle of incidence i</th><td className="num">{angle}°</td></tr>
              <tr><th>Angle of refraction r</th><td className="num">{tir ? "—" : `${rDeg!.toFixed(0)}°`}</td></tr>
              <tr><th>Critical angle c = sin⁻¹(1/n)</th><td className="num">{critical.toFixed(0)}°</td></tr>
            </tbody>
          </table>
          <p className={tir ? "field-note zero" : "field-note"} aria-live="polite">{
            fromAir
              ? `Going into the denser glass the ray slows and bends toward the normal, so r (${rDeg!.toFixed(0)}°) is less than i (${angle}°). n = sin i / sin r = ${(Math.sin(i) / Math.sin(r || 1e-9)).toFixed(2)}.`
              : tir
                ? `i = ${angle}° exceeds the critical angle c = ${critical.toFixed(0)}°, so no light escapes — all of it is totally internally reflected back into the glass.`
                : `Leaving the glass the ray speeds up and bends away from the normal, so r (${rDeg!.toFixed(0)}°) is greater than i (${angle}°). At i = c = ${critical.toFixed(0)}° the refracted ray would graze the surface; beyond that you get total internal reflection.`
          }</p>
        </div>
      </div>
      <p className="lab-note">Switch to “Glass → air” and raise the angle past the critical angle to see total internal reflection — the effect that traps light inside optical fibres. The critical angle is found from n = 1 / sin c.</p>
    </div>
  );
}
