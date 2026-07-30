"use client";

import { useMemo, useState } from "react";

/**
 * 2.2.3 — evaporation. Rate rises with temperature, surface area and air
 * movement. Cooling follows because more-energetic particles escape, lowering
 * the average KE of those left. Distinct from boiling (Supplement).
 */
export default function EvaporationLab() {
  const [temp, setTemp] = useState(30);
  const [area, setArea] = useState(50); // %
  const [draught, setDraught] = useState(false);
  const [lid, setLid] = useState(false);

  const rate = useMemo(() => {
    if (lid) return 0.05;
    const tFactor = Math.max(0.15, temp / 40);
    const aFactor = area / 50;
    const dFactor = draught ? 1.8 : 1;
    return tFactor * aFactor * dFactor;
  }, [temp, area, draught, lid]);

  const cooling = Math.min(18, rate * 6);
  const liquidTemp = Math.max(5, temp - cooling);

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">2.2.3 · evaporation</span><h3>Which changes make a puddle disappear faster?</h3></div>
        <div className="big-reading"><span>Relative rate</span><strong>×{rate.toFixed(2)}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label="Liquid surface with evaporating particles">
          <svg viewBox="0 0 340 260">
            <rect x={40} y={140} width={260} height={80} rx={6} fill="#9ec9bc" />
            {/* surface width scales with area */}
            <rect x={40 + (260 - 260 * (area / 100)) / 2} y={140} width={260 * (area / 100)} height={10} fill="#1c8b74" opacity={0.5} />
            {Array.from({ length: Math.round(3 + rate * 5) }, (_, i) => {
              const x = 70 + i * 40;
              return (
                <circle key={i} cx={x} cy={130} r={5} fill="#df8c38">
                  <animate attributeName="cy" values="130;40" dur={`${Math.max(0.6, 2.4 / rate)}s`} repeatCount="indefinite" begin={`${i * 0.2}s`} />
                  <animate attributeName="opacity" values="1;0" dur={`${Math.max(0.6, 2.4 / rate)}s`} repeatCount="indefinite" begin={`${i * 0.2}s`} />
                </circle>
              );
            })}
            {draught && !lid && (
              <path d="M50 90 H290" stroke="#8b97a8" strokeWidth={2} strokeDasharray="6 4">
                <animate attributeName="stroke-dashoffset" values="0;20" dur="0.8s" repeatCount="indefinite" />
              </path>
            )}
            {lid && <rect x={50} y={100} width={240} height={12} rx={2} fill="#173d54" />}
            <text x={170} y={248} fill="#102a38" fontSize={13} textAnchor="middle" fontWeight={700}>
              Liquid cools toward ~{liquidTemp.toFixed(0)} °C
            </text>
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Liquid temperature (°C)
            <input type="range" min={5} max={80} value={temp} onChange={(e) => setTemp(+e.target.value)} />
          </label>
          <label className="num-field wide">Surface area
            <input type="range" min={20} max={100} value={area} onChange={(e) => setArea(+e.target.value)} />
          </label>
          <div className="chip-row" role="group" aria-label="Air movement and lid">
            <button className={draught ? "active" : ""} onClick={() => setDraught((v) => !v)}>Air movement {draught ? "on" : "off"}</button>
            <button className={lid ? "active" : ""} onClick={() => setLid((v) => !v)}>{lid ? "Lid on" : "Lid off"}</button>
          </div>
          <p className="field-note" aria-live="polite">
            Evaporation: more-energetic particles escape from the surface. The particles left behind have lower average KE, so the liquid cools — and can cool an object in contact with it.
          </p>
          <p className="field-note">
            <b>Boiling vs evaporation (Supplement):</b> boiling happens throughout the liquid at a fixed boiling point with bubbling; evaporation happens at the surface at any temperature and is faster with higher T, larger area and moving air.
          </p>
        </div>
      </div>
      <p className="lab-note">The escape rate is computed from temperature, surface area and draught. A lid suppresses net evaporation — useful for the &quot;why cover a hot drink&quot; discussion.</p>
    </div>
  );
}
