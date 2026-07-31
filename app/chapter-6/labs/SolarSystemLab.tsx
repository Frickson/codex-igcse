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
  Earth: { rocky: true, size: 26, fill: "#347fc4" },
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
      {name === "Mercury" && (
        <>
          <circle cx={box / 2 - 3} cy={box / 2 - 2} r={2} fill="#717982" opacity={0.75} />
          <circle cx={box / 2 + 4} cy={box / 2 + 4} r={1.5} fill="#717982" opacity={0.65} />
        </>
      )}
      {name === "Venus" && (
        <path d={`M${box / 2 - 8} ${box / 2 + 1} Q ${box / 2} ${box / 2 - 5}, ${box / 2 + 8} ${box / 2}`} fill="none" stroke="#f3d59f" strokeWidth={2.5} opacity={0.8} />
      )}
      {name === "Earth" && (
        <>
          <path d={`M${box / 2 - 7} ${box / 2 - 3} q 4 -6 8 -1 q -1 5 -5 6 z`} fill="#62a56f" />
          <path d={`M${box / 2 + 2} ${box / 2 + 1} q 5 -2 6 3 q -4 5 -7 2 z`} fill="#62a56f" />
        </>
      )}
      {name === "Mars" && (
        <>
          <circle cx={box / 2 - 4} cy={box / 2 + 2} r={2} fill="#8d3d2e" opacity={0.65} />
          <path d={`M${box / 2 - 5} ${box / 2 - s / 2 + 3} q 5 -3 10 0`} fill="none" stroke="#f0c7b7" strokeWidth={2} />
        </>
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
      <div className="solar-system-layout">
        <div className="space-stage planet-stage" aria-label="Eight orbital slots from the Sun outward">
          <div className="planet-board">
            <div className="solar-orbits" aria-hidden="true">
              {ORDER.map((planet) => <i key={planet} />)}
            </div>
            <div className="planet-sun" aria-hidden="true">
              <svg width={126} height={126} viewBox="0 0 126 126">
                <defs>
                  <radialGradient id="sun-core">
                    <stop offset="0" stopColor="#fff5a8" />
                    <stop offset=".5" stopColor="#ffc43d" />
                    <stop offset="1" stopColor="#e66b18" />
                  </radialGradient>
                </defs>
                <circle cx={63} cy={63} r={56} fill="url(#sun-core)" />
                <circle cx={63} cy={63} r={59} fill="none" stroke="#ffb52e" strokeWidth={5} opacity={0.35} />
              </svg>
              <span>Sun</span>
            </div>
            <div className="solar-planet-row">
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
                  <span className="orbit-index">{i + 1}</span>
                  <span className="planet-position">
                    {name ? <PlanetIcon name={name} /> : <i className="empty-orbit" />}
                  </span>
                  <small>{name && (showNames || correct) ? name : picked ? "Place" : `Orbit ${i + 1}`}</small>
                </div>
              ))}
            </div>
            <span className="diagram-scale-note">Planet sizes and orbit spacing are illustrative, not to scale.</span>
          </div>
        </div>
        <div className="side">
          <p className="explain" style={{ marginBottom: 8 }}>
            Drag each planet into the diagram from the Sun outward. On touch screens, tap a planet and then tap its orbit. Keyboard users can select and place with Enter or Space.
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
          <span className="sr-only" aria-live="polite">
            {correct ? "Correct planetary order." : filled ? "All orbits filled. Check the order again." : `${slots.filter(Boolean).length} of 8 planets placed.`}
          </span>
        </div>
      </div>
    </div>
  );
}
