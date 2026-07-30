"use client";

import { useState } from "react";

/**
 * 3.3 — the electromagnetic spectrum. A log-frequency slider sweeps the
 * seven regions in order. The wavelength shown is computed from the
 * selected frequency with c = fλ (c = 3.0×10⁸ m/s in a vacuum, the same
 * for every region), so moving the slider changes f and λ together in
 * the physically correct inverse way.
 */
const C = 3e8; // speed of light in vacuum (m/s)

type Band = { name: string; fMin: number; fMax: number; hex: string; uses: string; danger: string };
const BANDS: Band[] = [
  { name: "Radio", fMin: 1e4, fMax: 3e9, hex: "#8a6fd0", uses: "Broadcasting radio and television; long-range communication.", danger: "No significant harm at normal intensities." },
  { name: "Microwave", fMin: 3e9, fMax: 3e11, hex: "#5f7fd0", uses: "Satellite and mobile-phone communication; cooking (heating water in food).", danger: "Internal heating of body tissue." },
  { name: "Infrared", fMin: 3e11, fMax: 4.3e14, hex: "#d0642f", uses: "Thermal imaging, remote controls, short-range data links, grills and heaters.", danger: "Skin burns." },
  { name: "Visible", fMin: 4.3e14, fMax: 7.5e14, hex: "#2fa84f", uses: "Vision, photography, illumination, optical fibres.", danger: "Very intense light (e.g. lasers) can damage the retina." },
  { name: "Ultraviolet", fMin: 7.5e14, fMax: 3e16, hex: "#7b3fbf", uses: "Security marking and detecting forged notes; sterilising water; fluorescent lamps.", danger: "Skin cancer and eye damage." },
  { name: "X-ray", fMin: 3e16, fMax: 3e19, hex: "#2d7d9a", uses: "Medical imaging of bones; airport security scanners.", danger: "Mutation of cells, causing cancer." },
  { name: "Gamma", fMin: 3e19, fMax: 1e24, hex: "#c0392b", uses: "Sterilising equipment and food; treating and detecting cancer.", danger: "Mutation of cells, causing cancer." },
];

const LOG_MIN = 4, LOG_MAX = 24; // slider spans 10^4 to 10^24 Hz

function fmt(x: number, unit: string) {
  const e = x.toExponential(1).replace("e+", "×10^").replace("e-", "×10^-");
  return `${e} ${unit}`;
}

export default function SpectrumLab() {
  const [logF, setLogF] = useState(14.7); // green-ish visible light by default
  const f = Math.pow(10, logF);
  const lambda = C / f; // c = fλ  ⇒  λ = c/f
  const band = BANDS.find((b) => f >= b.fMin && f < b.fMax) ?? BANDS[BANDS.length - 1];

  const pos = ((logF - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100;

  return (
    <div className="lab-shell waves">
      <div className="lab-header">
        <div><span className="mini-label">3.3 · electromagnetic spectrum</span><h3>{band.name} · c = fλ</h3></div>
        <div className="big-reading"><span>Speed in vacuum</span><strong>3.0×10⁸ m/s</strong></div>
      </div>
      <div className="lab-grid">
        <div className="waves-stage compact" style={{ background: "transparent", padding: 0 }}>
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", height: 46, borderRadius: 10, overflow: "hidden", border: "1px solid #d5e0dc" }}>
              {BANDS.map((b) => (
                <div key={b.name} title={b.name} style={{ flex: 1, background: b.hex, opacity: b.name === band.name ? 1 : 0.4, display: "grid", placeItems: "center" }}>
                  <span style={{ fontSize: 9, color: "#fff", fontWeight: 700, letterSpacing: ".02em", textShadow: "0 1px 2px rgba(0,0,0,.3)" }}>{b.name}</span>
                </div>
              ))}
            </div>
            <div style={{ position: "relative", height: 16 }}>
              <div style={{ position: "absolute", left: `calc(${pos}% - 6px)`, top: 0, width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: "9px solid var(--navy)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#6b8f86", marginTop: 2 }}>
              <span>◀ lower frequency · longer wavelength</span><span>higher frequency · shorter wavelength ▶</span>
            </div>
          </div>
        </div>
        <div className="side">
          <label className="num-field wide">Frequency (log₁₀ f) <strong style={{ float: "right", color: "var(--navy)" }}>{fmt(f, "Hz")}</strong>
            <input type="range" min={LOG_MIN} max={LOG_MAX} step={0.05} value={logF} onChange={(e) => setLogF(+e.target.value)} aria-label="Frequency on a logarithmic scale" /></label>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Region</th><td className="num">{band.name}</td></tr>
              <tr><th>Frequency f</th><td className="num">{fmt(f, "Hz")}</td></tr>
              <tr><th>Wavelength λ = c/f</th><td className="num">{fmt(lambda, "m")}</td></tr>
            </tbody>
          </table>
          <p className="field-note" aria-live="polite"><strong>Uses:</strong> {band.uses}</p>
          <p className="field-note zero" aria-live="polite"><strong>Danger:</strong> {band.danger}</p>
        </div>
      </div>
      <p className="lab-note">Order (increasing frequency): radio, microwave, infrared, visible, ultraviolet, X-ray, gamma. All are transverse waves that travel at 3.0×10⁸ m/s in a vacuum; they differ only in frequency and wavelength, which is what sets each region&apos;s uses and dangers. As frequency rises, wavelength falls — because their product c is fixed.</p>
    </div>
  );
}
