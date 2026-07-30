"use client";

import { useRef, useState } from "react";

/**
 * 3.2.1 — reflection at a plane mirror. The angle of incidence is
 * dragged (or typed) and the reflected ray is computed to make the
 * angle of reflection equal to it, both measured from the normal. A
 * virtual image is drawn as far behind the mirror as the object is in
 * front, on the normal through the point of incidence.
 */
const W = 620, H = 300, mx = 310, cy = 150; // mirror is the vertical line x = mx; point of incidence at (mx, cy)

export default function ReflectionLab() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [angle, setAngle] = useState(35); // angle of incidence from the normal (deg)

  const rad = (angle * Math.PI) / 180;
  const rayLen = 150;
  // normal is horizontal (the mirror is vertical). Incident ray comes from upper-left toward (mx,cy).
  const inc = { x: mx - rayLen * Math.sin(rad), y: cy - rayLen * Math.cos(rad) };
  const ref = { x: mx - rayLen * Math.sin(rad), y: cy + rayLen * Math.cos(rad) };
  // object on the incident side, its virtual image mirrored across x = mx
  const obj = { x: mx - 90, y: cy - 60 };
  const img = { x: mx + 90, y: cy - 60 };

  const setFromPointer = (clientX: number, clientY: number) => {
    const svg = svgRef.current; if (!svg) return;
    const r = svg.getBoundingClientRect();
    const px = ((clientX - r.left) / r.width) * W;
    const py = ((clientY - r.top) / r.height) * H;
    // angle of the vector from incidence point to pointer, measured from the normal (horizontal, pointing left)
    const dx = mx - px, dy = cy - py;
    let a = (Math.atan2(Math.abs(dx), Math.abs(dy)) * 180) / Math.PI;
    a = Math.max(0, Math.min(89, a));
    setAngle(Math.round(a));
  };

  return (
    <div className="lab-shell waves">
      <div className="lab-header">
        <div><span className="mini-label">3.2.1 · law of reflection</span><h3>Angle in = angle out</h3></div>
        <div className="big-reading"><span>i = r</span><strong>{angle}° = {angle}°</strong></div>
      </div>
      <div className="lab-grid">
        <div className="waves-stage tall">
          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`}
            onPointerMove={(e) => { if (e.buttons === 1) setFromPointer(e.clientX, e.clientY); }}
            onPointerDown={(e) => setFromPointer(e.clientX, e.clientY)}>
            {/* mirror + hatching */}
            <line x1={mx} y1={20} x2={mx} y2={H - 20} stroke="#173d54" strokeWidth={3} />
            {Array.from({ length: 14 }, (_, i) => 26 + i * 18).map((y) => (
              <line key={y} x1={mx} y1={y} x2={mx + 12} y2={y + 12} stroke="#8aa6a0" strokeWidth={1.5} />
            ))}
            {/* normal */}
            <line x1={mx - 170} y1={cy} x2={mx} y2={cy} stroke="#c4d2cd" strokeDasharray="5 4" />
            <text x={mx - 168} y={cy - 6} fontSize={12} fill="#6b8f86">normal</text>
            {/* incident ray */}
            <line x1={inc.x} y1={inc.y} x2={mx} y2={cy} stroke="#df8c38" strokeWidth={2.5} markerEnd="url(#arrowO)" />
            {/* reflected ray */}
            <line x1={mx} y1={cy} x2={ref.x} y2={ref.y} stroke="#1c8b74" strokeWidth={2.5} markerEnd="url(#arrowG)" />
            {/* virtual image construction */}
            <circle cx={obj.x} cy={obj.y} r={6} fill="#173d54" />
            <text x={obj.x - 4} y={obj.y - 10} fontSize={12} fill="#173d54">object</text>
            <circle cx={img.x} cy={img.y} r={6} fill="none" stroke="#9bb0c9" strokeDasharray="3 3" />
            <text x={img.x - 6} y={img.y - 10} fontSize={12} fill="#7f93ad">image</text>
            <line x1={obj.x} y1={obj.y} x2={img.x} y2={img.y} stroke="#dbe4e0" strokeDasharray="3 3" />
            {/* angle arcs */}
            <text x={mx - 40} y={cy - 40} fontSize={13} fill="#a85f17">i</text>
            <text x={mx - 40} y={cy + 48} fontSize={13} fill="#1c8b74">r</text>
            <defs>
              <marker id="arrowO" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#df8c38" /></marker>
              <marker id="arrowG" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#1c8b74" /></marker>
            </defs>
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Angle of incidence (°) <strong style={{ float: "right", color: "var(--navy)" }}>{angle}</strong>
            <input type="range" min={0} max={89} value={angle} onChange={(e) => setAngle(+e.target.value)} aria-label="Angle of incidence" /></label>
          <table className="data-table">
            <tbody>
              <tr><th>Angle of incidence</th><td className="num">{angle}°</td></tr>
              <tr><th>Angle of reflection</th><td className="num">{angle}°</td></tr>
            </tbody>
          </table>
          <p className="field-note" aria-live="polite">Both angles are measured between the ray and the <em>normal</em> (the dashed line at 90° to the mirror), never from the mirror surface. The reflected angle always equals the incident angle.</p>
          <p className="field-note zero">The image in a plane mirror is <strong>upright</strong>, the <strong>same size</strong> as the object, as far <strong>behind</strong> the mirror as the object is in front, <strong>virtual</strong>, and <strong>laterally inverted</strong> (left–right swapped).</p>
        </div>
      </div>
      <p className="lab-note">Drag in the stage or use the slider to change the angle of incidence. A plane mirror obeys the law of reflection: the incident ray, the reflected ray and the normal all lie in one plane, and the angle of incidence equals the angle of reflection.</p>
    </div>
  );
}
