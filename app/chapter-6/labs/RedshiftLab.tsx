"use client";

import { useMemo, useState } from "react";

/**
 * 6.2.3.2–4 — redshift as increase in observed wavelength; evidence of expansion.
 */
export default function RedshiftLab() {
  const [emit, setEmit] = useState(500); // nm
  const [vFrac, setVFrac] = useState(0.05); // v/c qualitative (non-relativistic teaching scale)
  const observed = useMemo(() => emit * (1 + vFrac), [emit, vFrac]);
  const z = (observed - emit) / emit;

  const reset = () => { setEmit(500); setVFrac(0.05); };

  return (
    <div className="lab-shell space">
      <div className="lab-header">
        <div><span className="mini-label">6.2.3 · redshift</span><h3>Stretch the wavelength — watch redshift</h3></div>
        <div className="big-reading"><span>z = Δλ/λ</span><strong>{z.toFixed(3)}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="space-stage" role="img" aria-label={`Emitted ${emit} nm, observed ${observed.toFixed(0)} nm`}>
          <svg viewBox="0 0 340 240">
            <rect width={340} height={240} fill="#eef3f0" />
            <text x={20} y={36} fontSize={12} fill="#5a6a72" fontWeight={700}>Emitted</text>
            <path d={`M20 70 Q ${20 + emit / 8} 40, ${40 + emit / 4} 70 T ${80 + emit / 2} 70`} fill="none" stroke="#2b6cb0" strokeWidth={2} />
            <text x={20} y={120} fontSize={12} fill="#5a6a72" fontWeight={700}>Observed (receding)</text>
            <path d={`M20 160 Q ${20 + observed / 8} 130, ${40 + observed / 4} 160 T ${80 + observed / 2} 160`} fill="none" stroke="#cf5d45" strokeWidth={2} />
            <text x={170} y={210} textAnchor="middle" fontSize={12} fill="#173d54">
              λ_obs = {observed.toFixed(0)} nm &gt; λ_emit = {emit} nm
            </text>
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Emitted wavelength (nm)
            <input type="range" min={400} max={700} value={emit} onChange={(e) => setEmit(+e.target.value)} />
          </label>
          <label className="num-field wide">Recession (teaching v/c)
            <input type="range" min={0} max={0.3} step={0.01} value={vFrac} onChange={(e) => setVFrac(+e.target.value)} />
          </label>
          <button type="button" className="reset-button" onClick={reset}>Reset</button>
          <p className="explain" style={{ marginTop: 10 }}>
            Redshift means the observed wavelength is <strong>longer</strong> than emitted.
            Light from distant galaxies appears redshifted compared with the same lines on Earth —
            evidence the Universe is expanding (Big Bang support).
          </p>
          {vFrac === 0 && <p className="explain">Zero recession → no redshift (z = 0). Wavelength unchanged.</p>}
        </div>
      </div>
    </div>
  );
}
