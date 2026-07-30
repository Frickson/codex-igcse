"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 6.1.1.1 — Earth rotates on a tilted axis ≈24 h → day/night and apparent
 * daily Sun motion. Hour angle drives which hemisphere is lit.
 */
export default function DayNightLab() {
  const [hour, setHour] = useState(6); // 0–24 local solar time at marked site
  const [playing, setPlaying] = useState(false);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) return;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      setHour((h) => (h + dt * 2) % 24); // 2 h per real second
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [playing]);

  const angle = (hour / 24) * Math.PI * 2 - Math.PI / 2; // 6h = sunrise facing Sun
  const cx = 170, cy = 150, R = 52;
  const siteX = cx + R * Math.cos(angle);
  const siteY = cy + R * Math.sin(angle);
  const sunlit = Math.cos(angle) > -0.05; // facing +x toward Sun
  const label = sunlit
    ? hour < 12 ? "Morning / day — site faces the Sun" : "Afternoon / day — site still sunlit"
    : "Night — site is on the dark side of Earth";

  const reset = () => { setPlaying(false); setHour(6); };

  return (
    <div className="lab-shell space">
      <div className="lab-header">
        <div><span className="mini-label">6.1.1 · day &amp; night</span><h3>Spin the Earth — when is it day?</h3></div>
        <div className="big-reading"><span>Local solar time</span><strong>{hour.toFixed(1)} h</strong></div>
      </div>
      <div className="lab-grid">
        <div className="space-stage" role="img" aria-label={`Earth viewed from above the poles. Site at ${hour.toFixed(1)} hours is ${sunlit ? "in daylight" : "in night"}.`}>
          <svg viewBox="0 0 340 300">
            <rect x={0} y={0} width={340} height={300} fill="#e8eef2" />
            {/* Sun to the right */}
            <circle cx={300} cy={150} r={22} fill="#e8b339" />
            <text x={300} y={186} textAnchor="middle" fontSize={11} fill="#5a6a72" fontWeight={700}>Sun</text>
            {/* Sunlight wedge hint */}
            <defs>
              <linearGradient id="daygrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#1a2a36" stopOpacity={0.55} />
                <stop offset="50%" stopColor="#1a2a36" stopOpacity={0.55} />
                <stop offset="50%" stopColor="#f7faf8" stopOpacity={0} />
                <stop offset="100%" stopColor="#f7faf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <circle cx={cx} cy={cy} r={R} fill="#3d8f7a" stroke="#1c5c4e" strokeWidth={2} />
            <circle cx={cx} cy={cy} r={R} fill="url(#daygrad)" />
            {/* Axis tilt hint (qualitative) */}
            <line x1={cx - 8} y1={cy - R - 18} x2={cx + 8} y2={cy + R + 18} stroke="#cf5d45" strokeWidth={2} strokeDasharray="4 3" />
            <text x={cx + 18} y={cy - R - 10} fontSize={10} fill="#cf5d45" fontWeight={700}>tilted axis</text>
            {/* Observer site */}
            <circle cx={siteX} cy={siteY} r={7} fill="#cf5d45" className="drag-handle" />
            <text x={siteX} y={siteY - 12} textAnchor="middle" fontSize={10} fill="#cf5d45" fontWeight={800}>you</text>
            <text x={170} y={280} textAnchor="middle" fontSize={12} fill="#5a6a72">{label}</text>
          </svg>
        </div>
        <div className="side">
          <div className="inline-controls">
            <label className="num-field wide">Hour of day (0–24)
              <input type="range" min={0} max={24} step={0.1} value={hour} onChange={(e) => { setPlaying(false); setHour(+e.target.value); }} />
            </label>
            <label className="num-field">Hour
              <input type="number" min={0} max={24} step={0.1} value={Number(hour.toFixed(1))} onChange={(e) => { setPlaying(false); setHour(Math.min(24, Math.max(0, +e.target.value || 0))); }} />
            </label>
          </div>
          <div className="inline-controls" style={{ marginTop: 10 }}>
            <button type="button" onClick={() => setPlaying((p) => !p)}>{playing ? "Pause" : "Play rotation"}</button>
            <button type="button" className="reset-button" onClick={reset}>Reset</button>
          </div>
          <p className="explain">
            Earth rotates once in about <strong>24 hours</strong> on a tilted axis. The half facing the Sun is in daylight;
            the other half is in night. From the ground, the Sun appears to rise, climb and set because <em>we</em> are turning.
          </p>
          <p className="explain" style={{ marginTop: 8 }}>
            Zero / boundary: at the terminator (dawn/dusk) the site is on the day–night boundary — neither fully day nor night.
          </p>
        </div>
      </div>
    </div>
  );
}
