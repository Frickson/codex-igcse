"use client";

import { useState } from "react";

/**
 * 1.1 — Determining an average value for a small distance / short time
 * by measuring multiples. A fixed reading error sits on the TOTAL, so
 * dividing by the number of items shrinks its effect per item. The
 * per-unit value and its percentage error are computed from the model,
 * not chosen by a button.
 */
type Mode = "time" | "length";
const MODES: Record<Mode, { label: string; unit: string; single: string; trueVal: number; err: number; errLabel: string; nLabel: string; item: string }> = {
  time: { label: "Time one swing of a pendulum", unit: "s", single: "period T", trueVal: 0.80, err: 0.30, errLabel: "reaction time ≈ 0.30 s on the total", nLabel: "swings timed", item: "swing" },
  length: { label: "Measure the thickness of one sheet", unit: "mm", single: "thickness", trueVal: 0.10, err: 0.5, errLabel: "ruler reads to ±0.5 mm on the stack", nLabel: "sheets stacked", item: "sheet" },
};

export default function MeasurementLab() {
  const [mode, setMode] = useState<Mode>("time");
  const [n, setN] = useState(1);
  const m = MODES[mode];
  const total = n * m.trueVal + m.err;          // what the instrument reads
  const perUnit = total / n;                     // measured single value
  const pctError = (m.err / (n * m.trueVal)) * 100;
  const fmt = (v: number) => (mode === "time" ? v.toFixed(3) : v.toFixed(3));

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">1.1 · averaging repeats</span><h3>Why measure many, then divide?</h3></div>
        <div className="big-reading"><span>Measured {m.single}</span><strong>{fmt(perUnit)} {m.unit}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label={`Measuring ${n} ${m.item}s together to find one ${m.single}`}>
          <svg viewBox="0 0 360 300">
            {mode === "time" ? (
              <>
                <line x1={180} y1={30} x2={180} y2={30} stroke="#8b97a8" />
                <line x1={180} y1={30} x2={120} y2={190} stroke="#173d54" strokeWidth={2} />
                <circle cx={120} cy={190} r={16} fill="#1c8b74" />
                <line x1={180} y1={30} x2={240} y2={190} stroke="#c4d2cd" strokeWidth={1.5} strokeDasharray="4 4" />
                <circle cx={240} cy={190} r={16} fill="#c4d2cd" />
                <path d="M120 190 A 80 80 0 0 1 240 190" fill="none" stroke="#df8c38" strokeWidth={1.5} strokeDasharray="3 3" />
                <text x={180} y={240} fill="#60737c" fontSize={13} textAnchor="middle">timing {n} full swing{n === 1 ? "" : "s"}</text>
                <text x={180} y={262} fill="#102a38" fontSize={13} textAnchor="middle" fontWeight={700}>stopwatch: {total.toFixed(2)} s</text>
              </>
            ) : (
              <>
                {Array.from({ length: Math.min(n, 40) }, (_, i) => (
                  <rect key={i} x={110} y={210 - i * Math.min(4, 160 / Math.max(n, 1))} width={140} height={Math.min(4, 160 / Math.max(n, 1))} fill={i % 2 ? "#1c8b74" : "#173d54"} />
                ))}
                <line x1={90} y1={210} x2={90} y2={210 - Math.min(n, 40) * Math.min(4, 160 / Math.max(n, 1))} stroke="#df8c38" strokeWidth={2} />
                <text x={180} y={250} fill="#60737c" fontSize={13} textAnchor="middle">stack of {n} sheet{n === 1 ? "" : "s"}</text>
                <text x={180} y={272} fill="#102a38" fontSize={13} textAnchor="middle" fontWeight={700}>ruler: {total.toFixed(1)} mm</text>
              </>
            )}
          </svg>
        </div>
        <div className="side">
          <div className="rad-select" role="group" aria-label="What to measure">
            <button className={mode === "time" ? "active" : ""} onClick={() => { setMode("time"); }}>Pendulum</button>
            <button className={mode === "length" ? "active" : ""} onClick={() => { setMode("length"); }}>Paper stack</button>
          </div>
          <label className="num-field wide">{m.nLabel} <strong style={{ float: "right", color: "var(--navy)" }}>{n}</strong>
            <input type="range" min={1} max={40} value={n} onChange={(e) => setN(+e.target.value)} />
          </label>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Instrument reads (total)</th><td className="num">{fmt(total)} {m.unit}</td></tr>
              <tr><th>Divide by {n}</th><td className="num">{fmt(perUnit)} {m.unit}</td></tr>
              <tr><th>True value</th><td className="num">{fmt(m.trueVal)} {m.unit}</td></tr>
              <tr><th>Error per {m.item}</th><td className="num">{pctError.toFixed(1)}%</td></tr>
            </tbody>
          </table>
          <p className="field-note" aria-live="polite">The {m.errLabel} stays the same however many you measure. Spread over {n} {m.item}{n === 1 ? "" : "s"} the error per {m.item} is only {pctError.toFixed(1)}%, so the measured {m.single} ({fmt(perUnit)} {m.unit}) is much closer to the true {fmt(m.trueVal)} {m.unit}.</p>
        </div>
      </div>
      <p className="lab-note">To measure a very small distance or a short time, measure many together and divide. The fixed reading error is shared out, so a single value becomes far more reliable.</p>
    </div>
  );
}
