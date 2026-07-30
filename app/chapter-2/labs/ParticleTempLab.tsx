"use client";

import { useState } from "react";

/**
 * 2.1.2 / 2.1.3 — temperature, absolute zero, and °C ↔ K conversion.
 * Kelvin is computed as θ + 273; particle speed scales with absolute
 * temperature (qualitative). At 0 K the model shows least kinetic energy.
 */
export default function ParticleTempLab() {
  const [celsius, setCelsius] = useState(20);
  const kelvin = celsius + 273;
  const atAbsoluteZero = kelvin <= 0;
  // qualitative speed factor from absolute temperature (clamp for display)
  const speed = atAbsoluteZero ? 0 : Math.min(1, Math.max(0.05, kelvin / 373));

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">2.1.2 · temperature &amp; absolute zero</span><h3>Heat the sample — what happens to the particles?</h3></div>
        <div className="big-reading"><span>Absolute temperature</span><strong>{atAbsoluteZero ? "0 K" : `${kelvin} K`}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label={`Particles at ${celsius} degrees Celsius`}>
          <svg viewBox="0 0 340 260">
            <rect x={40} y={40} width={260} height={180} rx={8} fill="#eef3f0" stroke="#c4d2cd" strokeWidth={1.5} />
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
              const cx = 70 + (i % 4) * 55;
              const cy = 80 + Math.floor(i / 4) * 70;
              const amp = speed * 14;
              const dur = atAbsoluteZero ? "99s" : `${Math.max(0.4, 2.2 - speed * 1.6)}s`;
              return (
                <circle key={i} cx={cx} cy={cy} r={11} fill="#df8c38">
                  {!atAbsoluteZero && (
                    <animateTransform
                      attributeName="transform"
                      type="translate"
                      values={`0 0; ${amp} ${-amp * 0.6}; 0 0; ${-amp} ${amp * 0.5}; 0 0`}
                      dur={dur}
                      repeatCount="indefinite"
                    />
                  )}
                </circle>
              );
            })}
            <text x={170} y={248} fill="#60737c" fontSize={12} textAnchor="middle">
              {atAbsoluteZero ? "Absolute zero — least kinetic energy" : `Faster motion ≈ higher temperature`}
            </text>
          </svg>
        </div>
        <div className="side">
          <label className="num-field wide">Temperature (°C)
            <input
              type="range"
              min={-273}
              max={200}
              value={celsius}
              onChange={(e) => setCelsius(+e.target.value)}
              aria-valuetext={`${celsius} degrees Celsius`}
            />
          </label>
          <p className="eqn-line" aria-live="polite">
            T = θ + 273 = {celsius} + 273 = <b>{kelvin} K</b>
          </p>
          <div className="chip-row" role="group" aria-label="Temperature presets">
            <button onClick={() => setCelsius(-273)}>Absolute zero</button>
            <button onClick={() => setCelsius(0)}>Ice point</button>
            <button onClick={() => setCelsius(20)}>Room</button>
            <button onClick={() => setCelsius(100)}>Steam point</button>
          </div>
          <p className="field-note" aria-live="polite">
            {atAbsoluteZero
              ? "At −273 °C (0 K) particles have the least possible kinetic energy — absolute zero."
              : `A rise in temperature means a rise in the average kinetic energy of the particles. ${celsius} °C = ${kelvin} K.`}
          </p>
        </div>
      </div>
      <p className="lab-note">Convert with T (in K) = θ (in °C) + 273. The animation speed scales with absolute temperature so 0 K is visibly the least-energy state — a qualitative model, not a quantitative simulation.</p>
    </div>
  );
}
