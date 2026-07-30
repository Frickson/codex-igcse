"use client";

import { useMemo, useState } from "react";

/**
 * 6.1.2.3–6.1.2.10 — gravity of Sun keeps planets in orbit; g and orbital speed
 * fall with distance; elliptical orbits faster when closer (energy conserved).
 */
export default function OrbitGravityLab() {
  const [au, setAu] = useState(1); // distance in AU (circular case)
  const [ecc, setEcc] = useState(0); // 0 = circle, up to 0.6 for teaching ellipse
  const [massScale, setMassScale] = useState(1); // relative central mass (Sun = 1)

  // Qualitative: g ∝ M / r², orbital speed for circular ≈ ∝ √(M/r)
  const gRel = useMemo(() => (massScale <= 0 || au <= 0 ? 0 : massScale / (au * au)), [au, massScale]);
  const vCirc = useMemo(() => (massScale <= 0 || au <= 0 ? 0 : Math.sqrt(massScale / au)), [au, massScale]);

  // Ellipse: perihelion closer, faster; aphelion farther, slower
  const peri = Math.max(0.2, au * (1 - ecc));
  const aph = au * (1 + ecc);
  const vPeri = Math.sqrt(massScale / Math.max(peri, 0.05));
  const vAph = Math.sqrt(massScale / Math.max(aph, 0.05));

  const cx = 170, cy = 150;
  const rx = 40 + au * 40;
  const ry = rx * (1 - ecc * 0.45);

  const reset = () => { setAu(1); setEcc(0); setMassScale(1); };
  const invalid = au <= 0 || massScale <= 0;

  return (
    <div className="lab-shell space">
      <div className="lab-header">
        <div><span className="mini-label">6.1.2 · gravity &amp; orbits</span><h3>What force keeps a planet in orbit?</h3></div>
        <div className="big-reading"><span>Relative orbital speed</span><strong>{invalid ? "—" : vCirc.toFixed(2)}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="space-stage" role="img" aria-label="Planet orbiting the Sun; gravity provides the inward force">
          <svg viewBox="0 0 340 300">
            <rect width={340} height={300} fill="#e8eef2" />
            <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#1c8b74" strokeWidth={2} strokeDasharray={ecc > 0.05 ? "6 4" : undefined} />
            {/* Sun offset from centre when eccentric */}
            <circle cx={cx + ecc * rx * 0.55} cy={cy} r={12 + massScale * 6} fill="#e8b339" />
            <text x={cx + ecc * rx * 0.55} y={cy + 28} textAnchor="middle" fontSize={11} fill="#5a6a72" fontWeight={700}>Sun</text>
            <circle cx={cx + rx} cy={cy} r={9} fill="#3d8f7a" />
            <text x={cx + rx} y={cy + 24} textAnchor="middle" fontSize={10} fill="#1c5c4e" fontWeight={700}>planet</text>
            <text x={170} y={285} textAnchor="middle" fontSize={12} fill="#5a6a72">
              {ecc < 0.05 ? "≈ circular — Sun near centre" : "Elliptical — Sun not at the geometric centre"}
            </text>
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Mean distance (AU)
            <input type="range" min={0.4} max={5} step={0.1} value={au} onChange={(e) => setAu(+e.target.value)} />
          </label>
          <label className="num-field wide">Eccentricity (0 = circle)
            <input type="range" min={0} max={0.6} step={0.05} value={ecc} onChange={(e) => setEcc(+e.target.value)} />
          </label>
          <label className="num-field wide">Central mass (Sun = 1)
            <input type="range" min={0} max={2} step={0.1} value={massScale} onChange={(e) => setMassScale(+e.target.value)} />
          </label>
          <button type="button" className="reset-button" onClick={reset}>Reset</button>
          {invalid ? (
            <p className="explain" style={{ color: "#cf5d45" }}>Zero mass or zero distance — no sensible orbit. The Sun holds most Solar System mass, so planets orbit the Sun.</p>
          ) : (
            <>
              <p className="explain">
                Relative field strength g ∝ M/r² ≈ <strong>{gRel.toFixed(2)}</strong>.
                Both field strength and typical orbital speed <strong>decrease</strong> as you move farther from the Sun.
              </p>
              <p className="explain" style={{ marginTop: 8 }}>
                Gravity of the Sun provides the inward force that keeps the planet in orbit.
                {ecc > 0.05 && (
                  <> Supplement: closer (perihelion {peri.toFixed(2)} AU) the planet moves faster (rel. {vPeri.toFixed(2)}); farther (aphelion {aph.toFixed(2)} AU) slower (rel. {vAph.toFixed(2)}) — kinetic ↔ gravitational potential energy trade-off.</>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
