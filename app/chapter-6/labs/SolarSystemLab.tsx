"use client";

import { useRef, useState } from "react";

/**
 * 6.1.2.1–6.1.2.2 — Solar System order via drag-and-drop (also tap-to-place
 * and keyboard). Planets are shown as distinctive icons, not name chips.
 */
const ORDER = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"] as const;
type Planet = (typeof ORDER)[number];

const META: Record<Planet, { rocky: boolean; size: number; fill: string; ring?: boolean; bands?: boolean }> = {
  Mercury: { rocky: true, size: 18, fill: "#9aa3ad" },
  Venus: { rocky: true, size: 24, fill: "#d4b483" },
  Earth: { rocky: true, size: 26, fill: "#3d8f7a" },
  Mars: { rocky: true, size: 22, fill: "#c45c3e" },
  Jupiter: { rocky: false, size: 40, fill: "#d4924a", bands: true },
  Saturn: { rocky: false, size: 36, fill: "#e0c070", ring: true },
  Uranus: { rocky: false, size: 30, fill: "#6bb7c9" },
  Neptune: { rocky: false, size: 30, fill: "#3a6fbf" },
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function PlanetIcon({ name, selected }: { name: Planet; selected?: boolean }) {
  const m = META[name];
  const s = m.size;
  const box = m.ring ? s + 18 : s + 8;
  return (
    <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`} aria-hidden="true">
      {m.ring && (
        <ellipse
          cx={box / 2}
          cy={box / 2}
          rx={s / 2 + 7}
          ry={s / 5}
          fill="none"
          stroke="#c4a35a"
          strokeWidth={2.5}
          transform={`rotate(-18 ${box / 2} ${box / 2})`}
        />
      )}
      <circle
        cx={box / 2}
        cy={box / 2}
        r={s / 2}
        fill={m.fill}
        stroke={selected ? "#173d54" : "#fff"}
        strokeWidth={selected ? 2.5 : 1.5}
      />
      {m.bands && (
        <>
          <path d={`M${box / 2 - s / 2 + 2} ${box / 2 - 4} Q ${box / 2} ${box / 2 - 8}, ${box / 2 + s / 2 - 2} ${box / 2 - 3}`} fill="none" stroke="#a86b2d" strokeWidth={2} opacity={0.7} />
          <path d={`M${box / 2 - s / 2 + 2} ${box / 2 + 4} Q ${box / 2} ${box / 2 + 1}, ${box / 2 + s / 2 - 2} ${box / 2 + 5}`} fill="none" stroke="#f0d0a0" strokeWidth={2} opacity={0.6} />
        </>
      )}
      {name === "Earth" && (
        <path d={`M${box / 2 - 4} ${box / 2 - 2} q 4 -5 8 0 q -2 6 -8 4 z`} fill="#2f6b9a" opacity={0.85} />
      )}
    </svg>
  );
}

export default function SolarSystemLab() {
  const [slots, setSlots] = useState<(Planet | null)[]>(Array(8).fill(null));
  const [pool, setPool] = useState<Planet[]>(() => shuffle([...ORDER]));
  const [picked, setPicked] = useState<Planet | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [showNames, setShowNames] = useState(false);
  const dragName = useRef<Planet | null>(null);

  const place = (name: Planet, index: number) => {
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
    setPicked(null);
    setDragOver(null);
  };

  const remove = (index: number) => {
    setSlots((prev) => {
      const next = [...prev];
      const name = next[index];
      next[index] = null;
      if (name) setPool((p) => [...p, name]);
      return next;
    });
    setPicked(null);
  };

  const onPoolActivate = (name: Planet) => {
    setPicked((cur) => (cur === name ? null : name));
  };

  const onSlotActivate = (index: number) => {
    if (picked) {
      place(picked, index);
      return;
    }
    if (slots[index]) remove(index);
  };

  const filled = slots.every(Boolean);
  const correct = filled && slots.every((n, i) => n === ORDER[i]);
  const reset = () => {
    setSlots(Array(8).fill(null));
    setPool(shuffle([...ORDER]));
    setPicked(null);
    setDragOver(null);
  };

  return (
    <div className="lab-shell space">
      <div className="lab-header">
        <div><span className="mini-label">6.1.2 · Solar System</span><h3>Build the planetary order</h3></div>
        <div className="big-reading"><span>Order from Sun</span><strong>{correct ? "Correct" : filled ? "Check again" : `${slots.filter(Boolean).length}/8`}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="space-stage planet-stage" aria-label="Eight orbital slots from the Sun outward">
          <div className="planet-board">
            <div className="planet-sun" aria-hidden="true">
              <svg width={36} height={36} viewBox="0 0 36 36"><circle cx={18} cy={18} r={14} fill="#e8b339" /><circle cx={18} cy={18} r={14} fill="#fff" opacity={0.15} /></svg>
              <span>Sun</span>
            </div>
            {slots.map((name, i) => (
              <div
                key={i}
                className={`orbit-slot planet-drop${dragOver === i ? " over" : ""}${picked ? " primed" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={name ? `Orbit ${i + 1}: ${name}. Activate to remove.` : `Orbit ${i + 1}: empty. Drop or place a planet here.`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
                onDragLeave={() => setDragOver((d) => (d === i ? null : d))}
                onDrop={(e) => {
                  e.preventDefault();
                  const n = (e.dataTransfer.getData("text/planet") || dragName.current) as Planet | null;
                  if (n && ORDER.includes(n)) place(n, i);
                  dragName.current = null;
                }}
                onClick={() => onSlotActivate(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSlotActivate(i);
                  }
                }}
              >
                <span className="orbit-index">Orbit {i + 1}</span>
                {name ? (
                  <div className="planet-token placed">
                    <PlanetIcon name={name} />
                    {(showNames || correct) && <small>{name}</small>}
                  </div>
                ) : (
                  <span className="drop-hint">{picked ? "Tap to place" : "Drop here"}</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="side">
          <p className="explain" style={{ marginBottom: 8 }}>
            Drag a planet onto an orbit, or tap a planet then tap a slot. Outer icons are larger gas giants; inner ones are smaller and rockier.
          </p>
          <div className="planet-pool" role="group" aria-label="Planets still to place">
            {pool.map((p) => (
              <button
                key={p}
                type="button"
                className={`planet-token${picked === p ? " selected" : ""}`}
                draggable
                aria-label={`${p}, ${META[p].rocky ? "rocky" : "gaseous"} planet`}
                title={p}
                onDragStart={(e) => {
                  dragName.current = p;
                  e.dataTransfer.setData("text/planet", p);
                  e.dataTransfer.effectAllowed = "move";
                  setPicked(p);
                }}
                onDragEnd={() => { dragName.current = null; setDragOver(null); }}
                onClick={() => onPoolActivate(p)}
              >
                <PlanetIcon name={p} selected={picked === p} />
                {showNames && <small>{p}</small>}
              </button>
            ))}
          </div>
          <div className="chip-row" style={{ marginTop: 10 }}>
            <button type="button" className={showNames ? "correct" : ""} onClick={() => setShowNames((v) => !v)}>
              {showNames ? "Hide names" : "Show names"}
            </button>
            <button type="button" className="reset-button" onClick={reset}>Shuffle &amp; reset</button>
          </div>
          <p className="explain" style={{ marginTop: 10 }}>
            Mnemonic (optional): <strong>My Very Educated Mother Just Served Us Noodles</strong>.
            The Solar System also includes dwarf planets, asteroids, moons, comets and other natural satellites.
          </p>
          <p className="explain" style={{ marginTop: 8 }}>
            Inner four are <strong>rocky and smaller</strong>; outer four are <strong>gaseous and large</strong> —
            accretion near the Sun left rock/metal solids, while farther out ices and gases built giants.
          </p>
          {correct && <p className="explain" style={{ marginTop: 8, color: "#146653" }}>Order matches the syllabus list from the Sun outward. Names reveal automatically when correct.</p>}
        </div>
      </div>
    </div>
  );
}
