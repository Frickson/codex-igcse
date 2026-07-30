"use client";

import { useState } from "react";

/**
 * 6.1.2.1–6.1.2.2 — Solar System contents and rocky-inner vs gaseous-outer pattern
 * via the accretion model narrative. Students reorder the eight planets.
 */
const ORDER = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"] as const;
const ROCKY = new Set(["Mercury", "Venus", "Earth", "Mars"]);

export default function SolarSystemLab() {
  const [slots, setSlots] = useState<(string | null)[]>(Array(8).fill(null));
  const [pool, setPool] = useState<string[]>(() => [...ORDER].sort(() => Math.random() - 0.5));

  const place = (name: string, index: number) => {
    setSlots((prev) => {
      const next = [...prev];
      const existing = next[index];
      next[index] = name;
      setPool((p) => {
        let q = p.filter((x) => x !== name);
        if (existing) q = [...q, existing];
        return q;
      });
      return next;
    });
  };

  const remove = (index: number) => {
    setSlots((prev) => {
      const next = [...prev];
      const name = next[index];
      next[index] = null;
      if (name) setPool((p) => [...p, name]);
      return next;
    });
  };

  const filled = slots.every(Boolean);
  const correct = filled && slots.every((n, i) => n === ORDER[i]);
  const reset = () => {
    setSlots(Array(8).fill(null));
    setPool([...ORDER].sort(() => Math.random() - 0.5));
  };

  return (
    <div className="lab-shell space">
      <div className="lab-header">
        <div><span className="mini-label">6.1.2 · Solar System</span><h3>Build the planetary order</h3></div>
        <div className="big-reading"><span>Order from Sun</span><strong>{correct ? "Correct" : filled ? "Check again" : `${slots.filter(Boolean).length}/8`}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="space-stage tall" role="list" aria-label="Eight orbital slots from the Sun outward">
          <div style={{ width: "100%", padding: 12 }}>
            <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 800, color: "#e8b339" }}>☀ Sun</p>
            {slots.map((name, i) => (
              <div key={i} className="orbit-slot" style={{ marginBottom: 8 }} role="listitem">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#5a6a72" }}>Orbit {i + 1}</span>
                  {name ? (
                    <button type="button" className="planet-chip" onClick={() => remove(i)} aria-label={`Remove ${name}`}>
                      {name} · {ROCKY.has(name) ? "rocky" : "gaseous"} ×
                    </button>
                  ) : (
                    <span style={{ fontSize: 12, color: "#8b97a8" }}>Drop a planet</span>
                  )}
                </div>
                {!name && pool.length > 0 && (
                  <div className="chip-row" style={{ marginTop: 6 }}>
                    {pool.map((p) => (
                      <button key={p} type="button" className="planet-chip" onClick={() => place(p, i)}>{p}</button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="side">
          <div className="chip-row" role="group" aria-label="Planets still to place">
            {pool.map((p) => <button key={p} type="button" className="planet-chip" onClick={() => {
              const idx = slots.findIndex((s) => s === null);
              if (idx >= 0) place(p, idx);
            }}>{p}</button>)}
          </div>
          <button type="button" className="reset-button" onClick={reset} style={{ marginTop: 10 }}>Shuffle &amp; reset</button>
          <p className="explain" style={{ marginTop: 10 }}>
            Remember: <strong>My Very Educated Mother Just Served Us Noodles</strong> — Mercury → Neptune.
            Also include dwarf planets/asteroids (e.g. belt), moons, comets and natural satellites as Solar System members.
          </p>
          <p className="explain" style={{ marginTop: 8 }}>
            Inner four are <strong>rocky and smaller</strong>; outer four are <strong>gaseous and large</strong>.
            Accretion: gravity pulled a collapsing cloud into a disc; near the Sun only rock/metal stayed solid enough to build terrestrial planets.
          </p>
          {correct && <p className="explain" style={{ marginTop: 8, color: "#146653" }}>Order matches the syllabus list from the Sun outward.</p>}
        </div>
      </div>
    </div>
  );
}
