"use client";

import { useState } from "react";

/**
 * 1.5.2 — load–extension for a spring. Below the limit of proportionality
 * extension is proportional to load (Hooke's law, F = kx); beyond it the
 * spring extends more for each extra newton and the line curves. Extension
 * is computed from the load through that model, and the limit is marked.
 */
const W = 380, H = 340;
const k = 25;              // spring constant, N/m
const Flimit = 8;          // limit of proportionality, N
const xLimit = Flimit / k; // extension at the limit, m

function extensionFor(F: number) {
  if (F <= Flimit) return F / k;
  return xLimit + (F - Flimit) / (k * 0.45); // softer beyond the limit
}

export default function HookeLab() {
  const [load, setLoad] = useState(5);
  const x = extensionFor(load);
  const proportional = load <= Flimit;

  // graph maps
  const gx0 = 60, gy0 = H - 50, gw = W - 90, gh = H - 90;
  const xMax = extensionFor(12), fMax = 12;
  const GX = (xx: number) => gx0 + gw * xx / xMax;
  const GY = (f: number) => gy0 - gh * f / fMax;

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">1.5.2 · Hooke&apos;s law · Supplement</span><h3>Load a spring — where does it stop being proportional?</h3></div>
        <div className="big-reading"><span>Extension</span><strong>{(x * 100).toFixed(1)} cm</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label={`Force–extension graph; current load ${load} newtons gives ${(x * 100).toFixed(1)} centimetres of extension`}>
          <svg viewBox={`0 0 ${W} ${H}`}>
            <line x1={gx0} y1={30} x2={gx0} y2={gy0} stroke="#c4d2cd" />
            <line x1={gx0} y1={gy0} x2={W - 20} y2={gy0} stroke="#c4d2cd" />
            <text x={20} y={26} fill="#60737c" fontSize={12}>load (N)</text>
            <text x={W - 20} y={gy0 + 24} fill="#60737c" fontSize={12} textAnchor="end">extension</text>
            {/* proportional (straight) part */}
            <line x1={GX(0)} y1={GY(0)} x2={GX(xLimit)} y2={GY(Flimit)} stroke="#1c8b74" strokeWidth={2.6} />
            {/* beyond-limit (curved) part */}
            <path d={`M${GX(xLimit)} ${GY(Flimit)} ${Array.from({ length: 20 }, (_, i) => { const f = Flimit + (fMax - Flimit) * (i + 1) / 20; return `L${GX(extensionFor(f))} ${GY(f)}`; }).join(" ")}`} fill="none" stroke="#df8c38" strokeWidth={2.6} />
            {/* limit marker */}
            <circle cx={GX(xLimit)} cy={GY(Flimit)} r={4} fill="#cf5d45" />
            <text x={GX(xLimit) + 6} y={GY(Flimit) - 6} fill="#cf5d45" fontSize={11}>limit of proportionality</text>
            {/* current point */}
            <line x1={GX(x)} y1={gy0} x2={GX(x)} y2={GY(load)} stroke="#8b97a8" strokeDasharray="3 3" />
            <line x1={gx0} y1={GY(load)} x2={GX(x)} y2={GY(load)} stroke="#8b97a8" strokeDasharray="3 3" />
            <circle cx={GX(x)} cy={GY(load)} r={5} fill="#173d54" />
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Load (N) <strong style={{ float: "right", color: "var(--navy)" }}>{load}</strong>
            <input type="range" min={0} max={12} value={load} onChange={(e) => setLoad(+e.target.value)} /></label>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Load F</th><td className="num">{load} N</td></tr>
              <tr><th>Extension x</th><td className="num">{(x * 100).toFixed(1)} cm</td></tr>
              <tr><th>Spring constant k = F/x</th><td className="num">{proportional && x > 0 ? k.toFixed(0) : "—"} N/m</td></tr>
            </tbody>
          </table>
          {proportional ? (
            <p className="field-note" aria-live="polite">Below the limit, extension ∝ load: doubling the load doubles the extension. Here F = kx with k = {k} N/m, so {load} N gives {(x * 100).toFixed(1)} cm.</p>
          ) : (
            <p className="field-note zero" aria-live="polite">Past the limit of proportionality (about {Flimit} N) the spring extends more for each extra newton, so F = kx no longer holds and k is no longer constant.</p>
          )}
        </div>
      </div>
      <p className="lab-note">A spring undergoes elastic deformation and returns to shape — until it is loaded past its limit of proportionality. Up to that limit the extension is directly proportional to the load, and the gradient of the load–extension line is the spring constant k.</p>
    </div>
  );
}
