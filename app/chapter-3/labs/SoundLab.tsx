"use client";

import { useState } from "react";

/**
 * 3.4 — pitch and loudness on an oscilloscope. Frequency sets the pitch
 * (drawn as the number of cycles across the screen) and amplitude sets
 * the loudness (drawn as the height of the trace). The wavelength shown
 * is the real value in air, computed from v = fλ with v = 340 m/s.
 * Frequencies below 20 Hz (infrasound) and above 20 kHz (ultrasound)
 * are flagged as outside the human audible range.
 */
const V_AIR = 340; // speed of sound in air (m/s)
const W = 620, H = 200, mid = H / 2;
const F_MIN = 20, F_MAX = 20000;

export default function SoundLab() {
  const [freq, setFreq] = useState(440); // Hz
  const [amp, setAmp] = useState(60);     // display amplitude (px)

  const lambda = V_AIR / freq; // v = fλ ⇒ λ = v/f
  const infrasound = freq < 20;
  const ultrasound = freq > 20000;
  const audible = !infrasound && !ultrasound;

  // number of cycles drawn scales with log-frequency (a pitch representation, not a timebase)
  const cycles = 1 + 8 * (Math.log10(freq) - Math.log10(F_MIN)) / (Math.log10(F_MAX) - Math.log10(F_MIN));
  const k = (2 * Math.PI * cycles) / W;
  const a = Math.min(amp, mid - 10);

  let path = `M 0 ${mid}`;
  for (let x = 1; x <= W; x += 2) path += ` L ${x} ${(mid - a * Math.sin(k * x)).toFixed(1)}`;

  return (
    <div className="lab-shell waves">
      <div className="lab-header">
        <div><span className="mini-label">3.4 · sound · pitch &amp; loudness</span><h3>Read a sound on an oscilloscope</h3></div>
        <div className="big-reading"><span>Wavelength in air</span><strong>{lambda < 0.01 ? `${(lambda * 1000).toFixed(1)} mm` : `${lambda.toFixed(2)} m`}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="waves-stage" style={{ minHeight: 0, background: "#0d2530" }}>
          <svg viewBox={`0 0 ${W} ${H}`}>
            <line x1={0} y1={mid} x2={W} y2={mid} stroke="#2f5563" />
            <path d={path} fill="none" stroke="#4fd1a5" strokeWidth={2.2} />
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Frequency — pitch (Hz) <strong style={{ float: "right", color: "var(--navy)" }}>{freq}</strong>
            <input type="range" min={20} max={20000} step={10} value={freq} onChange={(e) => setFreq(+e.target.value)} aria-label="Frequency (pitch)" /></label>
          <label className="num-field wide">Amplitude — loudness <strong style={{ float: "right", color: "var(--navy)" }}>{amp}</strong>
            <input type="range" min={5} max={90} value={amp} onChange={(e) => setAmp(+e.target.value)} aria-label="Amplitude (loudness)" /></label>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Frequency</th><td className="num">{freq} Hz</td></tr>
              <tr><th>Wavelength λ = v/f</th><td className="num">{lambda < 0.01 ? `${(lambda * 1000).toFixed(1)} mm` : `${lambda.toFixed(2)} m`}</td></tr>
              <tr><th>Pitch / loudness</th><td className="num">{freq < 500 ? "low" : freq > 4000 ? "high" : "mid"} / {amp < 30 ? "quiet" : amp > 65 ? "loud" : "medium"}</td></tr>
            </tbody>
          </table>
          <p className={audible ? "field-note" : "field-note zero"} aria-live="polite">{
            infrasound ? `At ${freq} Hz this is infrasound — below the ~20 Hz lower limit of human hearing.`
              : ultrasound ? `At ${freq} Hz this is ultrasound — above the ~20 kHz upper limit of human hearing (used in sonar and medical scans).`
              : `Higher frequency raises the pitch (more cycles on the screen); larger amplitude raises the loudness (a taller trace). The audible range for humans is about 20 Hz to 20 kHz.`
          }</p>
        </div>
      </div>
      <p className="lab-note">On an oscilloscope, pitch shows as how tightly packed the waves are (frequency) and loudness shows as the height of the trace (amplitude). Changing the loudness does not change the pitch, and vice-versa — they are independent properties of the sound.</p>
    </div>
  );
}
