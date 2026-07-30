"use client";

import { useMemo, useState } from "react";

/**
 * 2.1.3 — gas pressure. For a fixed mass:
 * - constant volume: higher T → higher p (more frequent / harder collisions)
 * - constant temperature: smaller V → higher p (more frequent collisions)
 * Supplement: pV = constant at fixed T; chart points are computed from that rule.
 */
type Mode = "temp" | "volume";

export default function GasPressureLab() {
  const [mode, setMode] = useState<Mode>("temp");
  const [tempC, setTempC] = useState(27); // ~300 K
  const [volume, setVolume] = useState(100); // arbitrary units
  const T0 = 300; // K reference
  const V0 = 100;
  const P0 = 100; // kPa reference

  const T = tempC + 273;
  const invalidT = T <= 0;

  // Qualitative Core model + Supplement pV=const when T fixed.
  // When varying T at fixed V: p ∝ T (absolute). When varying V at fixed T: p ∝ 1/V.
  const pressure = useMemo(() => {
    if (invalidT) return 0;
    if (mode === "temp") return P0 * (T / T0);
    return P0 * (V0 / volume);
  }, [mode, T, volume, invalidT]);

  const product = pressure * volume;

  // Graph points for pV = const at the current absolute temperature
  const curve = useMemo(() => {
    const k = P0 * V0; // at reference T; scale with T/T0 for display of isotherm family idea
    const scale = T / T0;
    return [40, 60, 80, 100, 120, 160, 200].map((v) => ({
      v,
      p: (k * scale) / v,
    }));
  }, [T]);

  const hitRate = invalidT ? 0 : Math.min(1, pressure / 220);

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">2.1.3 · gases &amp; pressure</span><h3>Change T or V — watch the collisions</h3></div>
        <div className="big-reading"><span>Pressure</span><strong>{invalidT ? "—" : `${pressure.toFixed(0)} kPa`}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label="Gas particles colliding with container walls">
          <svg viewBox="0 0 340 280">
            {/* container size scales with volume in volume mode */}
            {(() => {
              const w = mode === "volume" ? 120 + volume * 0.9 : 220;
              const h = mode === "volume" ? 100 + volume * 0.55 : 180;
              const x = (340 - w) / 2;
              const y = 40;
              const n = Math.max(4, Math.round(12 * (mode === "volume" ? V0 / volume : 1)));
              return (
                <g>
                  <rect x={x} y={y} width={w} height={h} rx={6} fill="#f7faf8" stroke="#173d54" strokeWidth={2.5} />
                  {Array.from({ length: n }, (_, i) => {
                    const px = x + 18 + (i * 47) % Math.max(20, w - 36);
                    const py = y + 18 + (i * 31) % Math.max(20, h - 36);
                    const amp = 6 + hitRate * 10;
                    return (
                      <circle key={i} cx={px} cy={py} r={7} fill="#1c8b74">
                        {!invalidT && (
                          <animateTransform
                            attributeName="transform"
                            type="translate"
                            values={`0 0; ${amp} ${-amp}; 0 0; ${-amp} ${amp * 0.7}; 0 0`}
                            dur={`${Math.max(0.35, 1.8 - hitRate * 1.3)}s`}
                            repeatCount="indefinite"
                          />
                        )}
                      </circle>
                    );
                  })}
                  <text x={170} y={y + h + 24} fill="#60737c" fontSize={12} textAnchor="middle">
                    {invalidT ? "No meaningful absolute temperature" : `Wall hits ≈ pressure (${(hitRate * 100).toFixed(0)}% of demo scale)`}
                  </text>
                </g>
              );
            })()}
          </svg>
        </div>
        <div className="side">
          <div className="chip-row" role="group" aria-label="Choose what to vary">
            <button className={mode === "temp" ? "active" : ""} onClick={() => setMode("temp")}>Vary temperature (const V)</button>
            <button className={mode === "volume" ? "active" : ""} onClick={() => setMode("volume")}>Vary volume (const T)</button>
          </div>
          {mode === "temp" ? (
            <label className="num-field wide">Temperature (°C)
              <input type="range" min={-273} max={227} value={tempC} onChange={(e) => setTempC(+e.target.value)} />
            </label>
          ) : (
            <label className="num-field wide">Volume (units)
              <input type="range" min={40} max={200} value={volume} onChange={(e) => setVolume(+e.target.value)} />
            </label>
          )}
          {invalidT ? (
            <p className="field-note zero" aria-live="polite">Absolute temperature is 0 K or below — the idealised proportional model does not apply. Raise θ above −273 °C.</p>
          ) : (
            <>
              <p className="eqn-line" style={{ fontSize: 18 }} aria-live="polite">
                {mode === "temp"
                  ? <>p ∝ T → p = {pressure.toFixed(0)} kPa at {T} K</>
                  : <>pV = {product.toFixed(0)} <span className="op">·</span> (const at fixed T)</>}
              </p>
              <p className="field-note" aria-live="polite">
                {mode === "temp"
                  ? "At constant volume, raising absolute temperature makes particles move faster, so they collide with the walls more often and harder — pressure rises."
                  : "At constant temperature, reducing volume packs the same particles into less space, so wall collisions become more frequent — pressure rises. Supplement: pV stays constant."}
              </p>
            </>
          )}
          {mode === "volume" && !invalidT && (
            <svg viewBox="0 0 280 120" role="img" aria-label="Pressure against volume at constant temperature" style={{ width: "100%", height: "auto" }}>
              <text x={140} y={14} fill="#60737c" fontSize={11} textAnchor="middle">p–V at constant T (Supplement)</text>
              <line x1={30} y1={100} x2={270} y2={100} stroke="#c4d2cd" />
              <line x1={30} y1={100} x2={30} y2={20} stroke="#c4d2cd" />
              <path
                d={curve.map((pt, i) => {
                  const x = 30 + (pt.v / 200) * 240;
                  const y = 100 - Math.min(75, (pt.p / 250) * 75);
                  return `${i === 0 ? "M" : "L"}${x} ${y}`;
                }).join(" ")}
                fill="none"
                stroke="#1c8b74"
                strokeWidth={2}
              />
              {(() => {
                const x = 30 + (volume / 200) * 240;
                const y = 100 - Math.min(75, (pressure / 250) * 75);
                return <circle cx={x} cy={y} r={5} fill="#cf5d45" />;
              })()}
              <text x={150} y={116} fill="#60737c" fontSize={10} textAnchor="middle">volume →</text>
            </svg>
          )}
        </div>
      </div>
      <p className="lab-note">Pressure is force per unit area from particle collisions with the surface. Core asks for the qualitative T and V effects; Supplement adds pV = constant for a fixed mass at constant temperature.</p>
    </div>
  );
}
