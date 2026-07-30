"use client";

import { useMemo, useState } from "react";

/**
 * 6.2.3.7–11 Supplement — H₀ = v/d; age estimate ≈ 1/H₀;
 * syllabus estimate H₀ ≈ 2.2 × 10⁻¹⁸ s⁻¹.
 */
const H0_SYLLABUS = 2.2e-18; // s⁻¹

export default function HubbleLab() {
  const [v, setV] = useState(3e5); // m/s recessional (example)
  const [d, setD] = useState(1.36e24); // m (~144 Mly order teaching pick so H~syllabus)
  const [useSyllabusH, setUseSyllabusH] = useState(true);

  const valid = v > 0 && d > 0;
  const H = useMemo(() => (valid ? v / d : NaN), [v, d, valid]);
  const Huse = useSyllabusH ? H0_SYLLABUS : H;
  const age = Number.isFinite(Huse) && Huse > 0 ? 1 / Huse : NaN;
  const ageYears = age / (365.25 * 24 * 3600);

  const reset = () => { setV(3e5); setD(1.36e24); setUseSyllabusH(true); };

  // Fit d so H matches syllabus for current v
  const matchSyllabus = () => {
    setUseSyllabusH(true);
    setD(v / H0_SYLLABUS);
  };

  return (
    <div className="lab-shell space">
      <div className="lab-header">
        <div><span className="mini-label">6.2.3 · Supplement · Hubble</span><h3>H₀ = v/d and the age estimate</h3></div>
        <div className="big-reading"><span>Age ≈ 1/H₀</span><strong>{Number.isFinite(ageYears) ? `${(ageYears / 1e9).toFixed(1)} Gy` : "—"}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="space-stage compact" role="img" aria-label="Hubble relation v equals H0 times d">
          <svg viewBox="0 0 340 200">
            <rect width={340} height={200} fill="#eef3f0" />
            <text x={170} y={60} textAnchor="middle" fontSize={20} fontWeight={800} fill="#173d54">H₀ = v / d</text>
            <text x={170} y={100} textAnchor="middle" fontSize={13} fill="#5a6a72">syllabus estimate ≈ 2.2×10⁻¹⁸ s⁻¹</text>
            <text x={170} y={140} textAnchor="middle" fontSize={13} fill="#1c8b74" fontWeight={700}>
              Your H = {valid ? H.toExponential(2) : "—"} s⁻¹
            </text>
            <text x={170} y={170} textAnchor="middle" fontSize={12} fill="#5a6a72">
              Age estimate 1/H₀ → everything once closer together
            </text>
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Recessional speed v (m/s)
            <input type="number" min={0} value={v} onChange={(e) => setV(Math.max(0, +e.target.value || 0))} />
          </label>
          <label className="num-field wide">Distance d (m)
            <input type="number" min={0} value={d} onChange={(e) => setD(Math.max(0, +e.target.value || 0))} />
          </label>
          <div className="chip-row" style={{ marginTop: 8 }}>
            <button type="button" className={useSyllabusH ? "correct" : ""} onClick={() => setUseSyllabusH(true)}>Use syllabus H₀</button>
            <button type="button" className={!useSyllabusH ? "correct" : ""} onClick={() => setUseSyllabusH(false)}>Use v/d from inputs</button>
            <button type="button" onClick={matchSyllabus}>Set d so H = syllabus</button>
            <button type="button" className="reset-button" onClick={reset}>Reset</button>
          </div>
          {!valid ? (
            <p className="explain" style={{ color: "#cf5d45" }}>Need v &gt; 0 and d &gt; 0. Distance can come from supernova brightness (syllabus idea).</p>
          ) : (
            <p className="explain">
              Age ≈ 1/H₀ = {age.toExponential(3)} s ≈ <strong>{(ageYears / 1e9).toFixed(2)} billion years</strong> (order-of-magnitude teaching estimate).
              If galaxies recede faster when farther away, winding the clock back suggests matter was once much closer — consistent with a hot dense beginning.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
