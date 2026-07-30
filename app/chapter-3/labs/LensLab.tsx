"use client";

import { useRef, useState } from "react";

/**
 * 3.2.3 — thin converging lens. The image is located by tracing two
 * real principal rays and finding where they (or their backward
 * extensions) meet, which is mathematically identical to the lens
 * equation 1/v − 1/u = 1/f:
 *
 *   d = u·f / (u − f)      (d > 0 real, right of lens; d < 0 virtual, left)
 *   magnification m = |d| / u = |v| / u
 *
 * Object beyond F → real inverted image; object inside F → virtual,
 * upright, enlarged image (the magnifying-glass case); object at F →
 * rays emerge parallel and no image forms.
 */
const W = 620, H = 310, cx = 310, cy = 175, ho = 45, pxPerCm = 8;

export default function LensLab() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [uCm, setUCm] = useState(24); // object distance (cm)
  const [fCm, setFCm] = useState(12); // focal length (cm)

  const u = uCm * pxPerCm, f = fCm * pxPerCm;
  const ox = cx - u, oy = cy - ho;
  const atFocus = Math.abs(uCm - fCm) < 0.6;

  const d = atFocus ? Infinity : (u * f) / (u - f); // signed image distance (px)
  const real = d > 0;
  const vCm = d / pxPerCm;
  const m = Math.abs(d) / u;                          // magnification
  const imgH = (ho / u) * d;                          // signed image "height" offset from axis
  const P = { x: cx + d, y: cy + imgH };              // image tip

  // outgoing rays
  const F2 = { x: cx + f, y: cy };                    // far focus F'
  // ray A: parallel in, refracts through F'
  const aSlope = (F2.y - oy) / (F2.x - cx);           // from (cx,oy) toward F'
  const aEnd = { x: W - 6, y: oy + aSlope * (W - 6 - cx) };
  // ray B: straight through centre
  const bSlope = (cy - oy) / (cx - ox);
  const bEnd = { x: W - 6, y: oy + bSlope * (W - 6 - ox) };

  const clamp = (p: { x: number; y: number }) => ({ x: Math.max(8, Math.min(W - 8, p.x)), y: Math.max(8, Math.min(H - 8, p.y)) });
  const Pc = clamp(P);
  const offscreen = !atFocus && (P.x !== Pc.x || P.y !== Pc.y);

  const setFromPointer = (clientX: number) => {
    const svg = svgRef.current; if (!svg) return;
    const r = svg.getBoundingClientRect();
    const px = ((clientX - r.left) / r.width) * W;
    const newU = Math.round((cx - px) / pxPerCm);
    setUCm(Math.max(4, Math.min(36, newU)));
  };

  return (
    <div className="lab-shell waves">
      <div className="lab-header">
        <div><span className="mini-label">3.2.3 · converging lens</span><h3>Where does the image form?</h3></div>
        <div className="big-reading"><span>Image</span><strong>{atFocus ? "at infinity" : real ? "real" : "virtual"}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="waves-stage tall">
          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`}
            onPointerDown={(e) => setFromPointer(e.clientX)}
            onPointerMove={(e) => { if (e.buttons === 1) setFromPointer(e.clientX); }}>
            {/* principal axis */}
            <line x1={0} y1={cy} x2={W} y2={cy} stroke="#c4d2cd" />
            {/* lens */}
            <line x1={cx} y1={30} x2={cx} y2={H - 30} stroke="#2d7d9a" strokeWidth={3} />
            <path d={`M${cx} 30 l -7 12 M${cx} 30 l 7 12 M${cx} ${H - 30} l -7 -12 M${cx} ${H - 30} l 7 -12`} stroke="#2d7d9a" strokeWidth={2} fill="none" />
            {/* foci */}
            {[cx - f, cx + f].map((fx, i) => (<g key={i}><circle cx={fx} cy={cy} r={3} fill="#173d54" /><text x={fx - 4} y={cy + 18} fontSize={11} fill="#6b8f86">{i === 0 ? "F" : "F′"}</text></g>))}
            {[cx - 2 * f, cx + 2 * f].map((fx, i) => (<text key={i} x={fx - 6} y={cy + 18} fontSize={10} fill="#9bb0a9">2F{i ? "′" : ""}</text>))}
            {/* object arrow (draggable) */}
            <line x1={ox} y1={cy} x2={ox} y2={oy} stroke="#173d54" strokeWidth={2.5} markerEnd="url(#obj)" className="drag-handle" />
            <text x={ox - 26} y={oy - 4} fontSize={11} fill="#173d54">object</text>
            {!atFocus && (<>
              {/* incident + outgoing rays */}
              <line x1={ox} y1={oy} x2={cx} y2={oy} stroke="#df8c38" strokeWidth={2} />
              <line x1={cx} y1={oy} x2={aEnd.x} y2={aEnd.y} stroke="#df8c38" strokeWidth={2} />
              <line x1={ox} y1={oy} x2={bEnd.x} y2={bEnd.y} stroke="#1c8b74" strokeWidth={2} />
              {/* virtual image: dashed backward extensions */}
              {!real && (<>
                <line x1={cx} y1={oy} x2={Pc.x} y2={Pc.y} stroke="#df8c38" strokeWidth={1.3} strokeDasharray="4 3" />
                <line x1={cx} y1={cy} x2={Pc.x} y2={Pc.y} stroke="#1c8b74" strokeWidth={1.3} strokeDasharray="4 3" />
              </>)}
              {/* image arrow */}
              <line x1={Pc.x} y1={cy} x2={Pc.x} y2={Pc.y} stroke="#b0367a" strokeWidth={2.5} markerEnd="url(#img)" />
            </>)}
            <defs>
              <marker id="obj" markerWidth="9" markerHeight="9" refX="3" refY="6" orient="auto"><path d="M0,6 L3,0 L6,6 Z" fill="#173d54" /></marker>
              <marker id="img" markerWidth="9" markerHeight="9" refX="3" refY="6" orient="auto"><path d="M0,6 L3,0 L6,6 Z" fill="#b0367a" /></marker>
            </defs>
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Object distance u (cm) <strong style={{ float: "right", color: "var(--navy)" }}>{uCm}</strong>
            <input type="range" min={4} max={36} value={uCm} onChange={(e) => setUCm(+e.target.value)} aria-label="Object distance" /></label>
          <label className="num-field wide">Focal length f (cm) <strong style={{ float: "right", color: "var(--navy)" }}>{fCm}</strong>
            <input type="range" min={8} max={20} value={fCm} onChange={(e) => setFCm(+e.target.value)} aria-label="Focal length" /></label>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Image distance v</th><td className="num">{atFocus ? "∞" : `${vCm.toFixed(1)} cm`}</td></tr>
              <tr><th>Magnification m = v/u</th><td className="num">{atFocus ? "—" : `${m.toFixed(2)}×`}</td></tr>
              <tr><th>Nature</th><td className="num">{atFocus ? "none" : real ? "real, inverted" : "virtual, upright"}</td></tr>
            </tbody>
          </table>
          <p className={atFocus || !real ? "field-note zero" : "field-note"} aria-live="polite">{
            atFocus
              ? "The object is at the principal focus F, so the refracted rays emerge parallel and never meet — the image is at infinity and no sharp image forms."
              : real
                ? `The object is beyond F, so the two rays cross on the far side: a real, inverted image ${m < 1 ? "smaller than" : m > 1 ? "larger than" : "the same size as"} the object (m = ${m.toFixed(2)}), which could be caught on a screen.`
                : `The object is inside F, so the refracted rays diverge; tracing them back gives a virtual, upright, enlarged image (m = ${m.toFixed(2)}) on the same side — this is how a magnifying glass works.`
          }</p>
          {offscreen && <p className="field-note">The image is so large it extends beyond the diagram — the arrow is clipped to the frame, but the numbers above are exact.</p>}
        </div>
      </div>
      <p className="lab-note">Drag the object or use the sliders. Two rays fix the image: one arrives parallel to the axis and refracts through the far focus F′; the other passes straight through the centre of the lens. Where they meet is the image.</p>
    </div>
  );
}
