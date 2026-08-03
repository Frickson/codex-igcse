"use client";

import { useState } from "react";

/**
 * 1.1 — Determining an average value for a small distance / short time
 * by measuring multiples. The absolute instrument/timing uncertainty sits
 * on the total, so dividing by the number of items shrinks the uncertainty
 * per item. This is deliberately distinguished from systematic error.
 */
type Mode = "time" | "length";
const MODES: Record<Mode, { label: string; unit: string; single: string; trueVal: number; err: number; errLabel: string; nLabel: string; item: string }> = {
  time: { label: "Time one swing of a pendulum", unit: "s", single: "period T", trueVal: 0.80, err: 0.30, errLabel: "reaction time ≈ 0.30 s on the total", nLabel: "swings timed", item: "swing" },
  length: { label: "Measure the thickness of one sheet", unit: "mm", single: "thickness", trueVal: 0.10, err: 0.5, errLabel: "ruler reads to ±0.5 mm on the stack", nLabel: "sheets stacked", item: "sheet" },
};

export default function MeasurementLab() {
  const [mode, setMode] = useState<Mode>("time");
  const [n, setN] = useState(10);
  const m = MODES[mode];
  const total = n * m.trueVal;
  const perUnit = total / n;
  const perUnitUncertainty = m.err / n;
  const pctUncertainty = total > 0 ? (m.err / total) * 100 : 0;
  const fmt = (v: number) => v.toFixed(mode === "time" ? 3 : 3);
  const stackHeight = Math.max(4, Math.min(160, n * 4));

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
                <rect x={132} y={224} width={96} height={28} rx={14} fill="#fffdf8" stroke="#d8dedb" />
                <text x={180} y={243} fill="#173d54" fontSize={12} textAnchor="middle" fontWeight={800}>{n} complete swing{n === 1 ? "" : "s"}</text>
                <text x={180} y={274} fill="#102a38" fontSize={13} textAnchor="middle" fontWeight={700}>total time: {total.toFixed(2)} s</text>
              </>
            ) : (
              <>
                <line x1={76} y1={48} x2={76} y2={220} stroke="#173d54" strokeWidth={3} />
                {Array.from({ length: 17 }, (_, i) => {
                  const y = 220 - i * 10;
                  const major = i % 4 === 0;
                  return <g key={i}>
                    <line x1={76} y1={y} x2={major ? 96 : 88} y2={y} stroke="#173d54" strokeWidth={major ? 2 : 1} />
                    {major && <text x={68} y={y + 4} fill="#60737c" fontSize={10} textAnchor="end">{i / 4}</text>}
                  </g>;
                })}
                <text x={55} y={42} fill="#60737c" fontSize={10}>mm</text>
                {Array.from({ length: n }, (_, i) => (
                  <rect key={i} x={108} y={216 - i * 4} width={132} height={4} fill={i % 2 ? "#1c8b74" : "#173d54"} opacity={0.94} />
                ))}
                <line x1={258} y1={220} x2={258} y2={220 - stackHeight} stroke="#df8c38" strokeWidth={2.5} />
                <line x1={250} y1={220} x2={266} y2={220} stroke="#df8c38" strokeWidth={2.5} />
                <line x1={250} y1={220 - stackHeight} x2={266} y2={220 - stackHeight} stroke="#df8c38" strokeWidth={2.5} />
                <text x={274} y={220 - stackHeight / 2 + 4} fill="#a85f17" fontSize={11} fontWeight={800}>{total.toFixed(1)} mm total</text>
                <text x={180} y={252} fill="#60737c" fontSize={13} textAnchor="middle">stack of {n} sheet{n === 1 ? "" : "s"}</text>
                <text x={180} y={273} fill="#60737c" fontSize={10} textAnchor="middle">drawing enlarged; ruler scale is the reading model</text>
              </>
            )}
          </svg>
        </div>
        <div className="side">
          <div className="rad-select" role="group" aria-label="What to measure">
            <button className={mode === "time" ? "active" : ""} onClick={() => { setMode("time"); setN(10); }}>Pendulum</button>
            <button className={mode === "length" ? "active" : ""} onClick={() => { setMode("length"); setN(20); }}>Paper stack</button>
          </div>
          <label className="num-field wide">{m.nLabel} <strong style={{ float: "right", color: "var(--navy)" }}>{n}</strong>
            <input type="range" min={1} max={40} value={n} onChange={(e) => setN(+e.target.value)} />
          </label>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Measured total</th><td className="num">{fmt(total)} {m.unit}</td></tr>
              <tr><th>Uncertainty on total</th><td className="num">±{fmt(m.err)} {m.unit}</td></tr>
              <tr><th>Average: total ÷ {n}</th><td className="num">{fmt(perUnit)} {m.unit}</td></tr>
              <tr><th>Uncertainty per {m.item}</th><td className="num">±{fmt(perUnitUncertainty)} {m.unit}</td></tr>
              <tr><th>Percentage uncertainty</th><td className="num">{pctUncertainty.toFixed(1)}%</td></tr>
            </tbody>
          </table>
          <p className="field-note" aria-live="polite">The {m.errLabel} applies to the whole measurement. Spread over {n} {m.item}{n === 1 ? "" : "s"}, the uncertainty in one {m.item} is ±{fmt(perUnitUncertainty)} {m.unit} ({pctUncertainty.toFixed(1)}%).</p>
        </div>
      </div>
      <p className="lab-note"><strong>What this improves:</strong> measuring a larger total reduces the percentage effect of ruler resolution or start/stop reaction time. It does not correct a zero error or another systematic error.</p>
    </div>
  );
}
