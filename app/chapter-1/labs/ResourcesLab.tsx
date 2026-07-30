"use client";

import { useState } from "react";

/**
 * 1.7.3 — energy resources. A reference explorer: pick a resource and
 * read whether it is renewable, whether it is reliable, whether it
 * ultimately derives from the Sun, and whether it releases CO₂ while
 * generating. The facts are fixed syllabus content, not a live model,
 * so this is a labelled retrieval tool rather than a simulator.
 */
type Resource = {
  name: string;
  renewable: boolean;
  reliable: boolean;
  fromSun: boolean;
  co2: boolean;
  how: string;
};

const RESOURCES: Resource[] = [
  { name: "Fossil fuels", renewable: false, reliable: true, fromSun: true, co2: true, how: "Coal, oil and gas are burned to heat water; the steam drives turbines and generators. Chemical store (originally the Sun's energy captured long ago) → thermal → kinetic → electrical." },
  { name: "Nuclear", renewable: false, reliable: true, fromSun: false, co2: false, how: "Fission of uranium heats water to steam that drives turbines. High output and no CO₂ in use, but radioactive waste and not from the Sun." },
  { name: "Biofuel", renewable: true, reliable: true, fromSun: true, co2: true, how: "Plant or animal matter is burned or fermented. Renewable because crops regrow, and the CO₂ released was recently absorbed by the plants." },
  { name: "Hydroelectric", renewable: true, reliable: true, fromSun: true, co2: false, how: "Water stored behind a dam falls through turbines: gravitational store → kinetic → electrical. The Sun drives the water cycle that refills the reservoir." },
  { name: "Wind", renewable: true, reliable: false, fromSun: true, co2: false, how: "Moving air turns turbine blades: kinetic → electrical. The Sun causes the pressure differences that make wind, but it stops when the wind drops." },
  { name: "Solar (photovoltaic)", renewable: true, reliable: false, fromSun: true, co2: false, how: "Photocells convert light directly to electricity. No CO₂, but no output at night or under heavy cloud." },
  { name: "Tidal", renewable: true, reliable: true, fromSun: false, co2: false, how: "Water flowing with the tides turns turbines. Predictable and reliable, but driven by the Moon's gravity, not the Sun." },
  { name: "Geothermal", renewable: true, reliable: true, fromSun: false, co2: false, how: "Heat from radioactive decay inside the Earth boils water to steam. Reliable and low-carbon, but only practical in certain locations — and not from the Sun." },
];

function Yes({ v, yes, no }: { v: boolean; yes: string; no: string }) {
  return <td className="num" style={{ color: v ? "#146653" : "#a85f17", fontWeight: 800 }}>{v ? yes : no}</td>;
}

export default function ResourcesLab() {
  const [i, setI] = useState(3);
  const r = RESOURCES[i];

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">1.7.3 · energy resources</span><h3>Where the electricity comes from</h3></div>
        <div className="big-reading"><span>Type</span><strong style={{ fontSize: 18 }}>{r.renewable ? "Renewable" : "Non-renewable"}</strong></div>
      </div>
      <div className="chip-row" role="group" aria-label="Energy resource">
        {RESOURCES.map((res, idx) => (
          <button key={res.name} className={idx === i ? "active" : ""} aria-pressed={idx === i} onClick={() => setI(idx)}>{res.name}</button>
        ))}
      </div>
      <div className="lab-grid">
        <div className="side">
          <table className="data-table">
            <tbody>
              <tr><th>Renewable?</th><Yes v={r.renewable} yes="Yes — will not run out" no="No — finite" /></tr>
              <tr><th>Reliable?</th><Yes v={r.reliable} yes="Yes — output on demand" no="No — intermittent" /></tr>
              <tr><th>Energy from the Sun?</th><Yes v={r.fromSun} yes="Yes" no="No" /></tr>
              <tr><th>Releases CO₂ in use?</th><Yes v={!r.co2} yes="No" no="Yes" /></tr>
            </tbody>
          </table>
        </div>
        <div className="side">
          <p className="field-note" aria-live="polite">{r.how}</p>
        </div>
      </div>
      <p className="lab-note">Most large-scale generation boils water to steam that turns a turbine and generator; the exceptions are solar cells (direct) and hydroelectric, wind and tidal (moving water or air turns the turbine directly). Renewable resources will not run out; reliability is separate — the Sun, wind and tides differ in how dependable they are.</p>
    </div>
  );
}
