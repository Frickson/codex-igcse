"use client";

import { useRef, useState } from "react";

/**
 * 1.1 (Supplement) — combining two perpendicular vectors.
 * The resultant magnitude and direction are computed from the actual
 * components by Pythagoras and atan2 — never from where a button was
 * pressed. When both components are zero the direction is undefined, so
 * no resultant arrow is drawn.
 */
const W = 380, H = 300, ox = 60, oy = H - 50, scale = 6; // px per unit (N)

export default function VectorLab() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [fx, setFx] = useState(30);   // east component (N)
  const [fy, setFy] = useState(40);   // north component (N)
  const [dragging, setDragging] = useState(false);

  const mag = Math.hypot(fx, fy);
  const angle = mag === 0 ? null : (Math.atan2(fy, fx) * 180) / Math.PI; // above the east axis
  const angleFromNorth = angle === null ? null : 90 - angle;

  const headX = ox + fx * scale;
  const headY = oy - fy * scale;

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  const setFromClient = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const px = ((clientX - r.left) / r.width) * W;
    const py = ((clientY - r.top) / r.height) * H;
    setFx(clamp(Math.round((px - ox) / scale), 0, 45));
    setFy(clamp(Math.round((oy - py) / scale), 0, 38));
  };

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">1.1 · vectors · Supplement</span><h3>Combine two forces at right angles</h3></div>
        <div className="big-reading"><span>Resultant</span><strong>{mag.toFixed(1)} N</strong></div>
      </div>
      <div className="lab-method">
        <span><b>1 · Draw</b> the two components head-to-tail at 90°.</span>
        <span><b>2 · Join</b> the start to the final point: this is the resultant.</span>
        <span><b>3 · Calculate</b> its magnitude and state the angle from a named direction.</span>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label={`Two perpendicular forces of ${fx} newtons east and ${fy} newtons north and their resultant`}>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            onPointerMove={(e) => { if (dragging) { e.preventDefault(); setFromClient(e.clientX, e.clientY); } }}
            onPointerUp={() => setDragging(false)}
            onPointerLeave={() => setDragging(false)}
            style={{ touchAction: "none" }}
          >
            <defs>
              <marker id="vArrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 z" fill="#173d54" /></marker>
              <marker id="vArrowC" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 z" fill="#8b97a8" /></marker>
            </defs>
            {/* axes */}
            <line x1={ox} y1={oy} x2={W - 12} y2={oy} stroke="#c4d2cd" />
            <line x1={ox} y1={oy} x2={ox} y2={12} stroke="#c4d2cd" />
            <text x={W - 16} y={oy + 18} fill="#8b97a8" fontSize={11} textAnchor="end">east component Fₓ</text>
            <text x={ox - 6} y={20} fill="#8b97a8" fontSize={11} textAnchor="end">north Fᵧ</text>
            {/* components */}
            {fx > 0 && <line x1={ox} y1={oy} x2={headX} y2={oy} stroke="#8b97a8" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#vArrowC)" />}
            {fy > 0 && <line x1={headX} y1={oy} x2={headX} y2={headY} stroke="#8b97a8" strokeWidth={2} strokeDasharray="5 4" markerEnd="url(#vArrowC)" />}
            {/* resultant */}
            {mag > 0 && <line x1={ox} y1={oy} x2={headX} y2={headY} stroke="#173d54" strokeWidth={3} markerEnd="url(#vArrow)" />}
            {/* draggable head */}
            <circle
              className="drag-handle"
              cx={headX} cy={headY} r={11}
              fill={dragging ? "#df8c38" : "#1c8b74"} stroke="white" strokeWidth={2}
              onPointerDown={(e) => { (e.target as Element).setPointerCapture(e.pointerId); setDragging(true); }}
              role="slider"
              aria-label="Drag to set the two force components"
              aria-valuetext={`${fx} newtons east, ${fy} newtons north`}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") { setFx((v) => Math.min(45, v + 1)); e.preventDefault(); }
                if (e.key === "ArrowLeft") { setFx((v) => Math.max(0, v - 1)); e.preventDefault(); }
                if (e.key === "ArrowUp") { setFy((v) => Math.min(38, v + 1)); e.preventDefault(); }
                if (e.key === "ArrowDown") { setFy((v) => Math.max(0, v - 1)); e.preventDefault(); }
              }}
            />
          </svg>
        </div>
        <div className="side">
          <div className="inline-controls">
            <label className="num-field">East F<sub>x</sub> (N)
              <input type="number" min={0} max={45} value={fx} onChange={(e) => setFx(Math.max(0, Math.min(45, +e.target.value)))} />
            </label>
            <label className="num-field">North F<sub>y</sub> (N)
              <input type="number" min={0} max={38} value={fy} onChange={(e) => setFy(Math.max(0, Math.min(38, +e.target.value)))} />
            </label>
          </div>
          {mag > 0 ? (
            <>
              <div className="vector-working" aria-live="polite">
                <p><span>Magnitude · Pythagoras</span><b>R = √(Fₓ² + Fᵧ²) = √({fx}² + {fy}²) = {mag.toFixed(1)} N</b></p>
                <p><span>Angle · TOA</span><b>{fx === 0 ? "Fₓ = 0, so the resultant is due north: θ = 90.0° from east" : `tan θ = Fᵧ ÷ Fₓ = ${fy} ÷ ${fx} → θ = ${angle!.toFixed(1)}°`}</b></p>
                <small>Check with SOH: sin θ = Fᵧ/R · Check with CAH: cos θ = Fₓ/R</small>
              </div>
              <table className="data-table">
                <tbody>
                  <tr><th>Magnitude √(Fₓ² + Fᵧ²)</th><td className="num">{mag.toFixed(1)} N</td></tr>
                  <tr><th>Direction from east</th><td className="num">{angle!.toFixed(1)}° north of east</td></tr>
                  <tr><th>Equivalent direction from north</th><td className="num">{angleFromNorth!.toFixed(1)}° east of north</td></tr>
                </tbody>
              </table>
            </>
          ) : (
            <p className="field-note zero" aria-live="polite">Both components are zero, so the resultant has zero magnitude and no defined direction — there is no arrow to draw.</p>
          )}
          <p className="field-note">The angle must include a reference direction. “53.1°” alone is incomplete; “53.1° north of east” and “36.9° east of north” describe the same resultant from different starting axes.</p>
        </div>
      </div>
      <p className="lab-note">Drag the green head (or use the arrow keys / number boxes). The resultant is always computed from the real components, so it lengthens and turns exactly as they change.</p>
    </div>
  );
}
