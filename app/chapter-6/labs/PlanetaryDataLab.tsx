"use client";

import { useState } from "react";

/**
 * 6.1.2.8 Supplement — analyse planetary data (distance, period, density, T, g).
 * Teaching table with simplified representative values.
 */
type PlanetRow = {
  name: string;
  au: number;
  years: number;
  density: number; // g/cm³
  temp: number; // K approx mean
  g: number; // N/kg at surface
  type: "rocky" | "gaseous";
};

const DATA: PlanetRow[] = [
  { name: "Mercury", au: 0.39, years: 0.24, density: 5.4, temp: 440, g: 3.7, type: "rocky" },
  { name: "Venus", au: 0.72, years: 0.62, density: 5.2, temp: 737, g: 8.9, type: "rocky" },
  { name: "Earth", au: 1.00, years: 1.00, density: 5.5, temp: 288, g: 9.8, type: "rocky" },
  { name: "Mars", au: 1.52, years: 1.88, density: 3.9, temp: 210, g: 3.7, type: "rocky" },
  { name: "Jupiter", au: 5.20, years: 11.9, density: 1.3, temp: 165, g: 24.8, type: "gaseous" },
  { name: "Saturn", au: 9.58, years: 29.5, density: 0.7, temp: 134, g: 10.4, type: "gaseous" },
  { name: "Uranus", au: 19.2, years: 84, density: 1.3, temp: 76, g: 8.7, type: "gaseous" },
  { name: "Neptune", au: 30.1, years: 165, density: 1.6, temp: 72, g: 11.2, type: "gaseous" },
];

type SortKey = "au" | "years" | "density" | "temp" | "g";

export default function PlanetaryDataLab() {
  const [sort, setSort] = useState<SortKey>("au");
  const [focus, setFocus] = useState("Earth");
  const sorted = [...DATA].sort((a, b) => a[sort] - b[sort]);
  const selected = DATA.find((p) => p.name === focus) ?? DATA[2];
  const earth = DATA[2];

  const insight = (() => {
    if (sort === "au" || sort === "years") {
      return "Orbital period rises with distance from the Sun — farther planets take longer to complete one orbit.";
    }
    if (sort === "density") {
      return "Inner rocky planets have higher densities; gas giants are much less dense (Saturn even floats on water in this simplified table).";
    }
    if (sort === "temp") {
      return "Mean surface/cloud-top temperature generally falls with distance, but Venus is an extreme greenhouse outlier.";
    }
    return "Surface g depends mainly on the planet's mass (and radius). Jupiter's huge mass gives the largest g here.";
  })();

  const reset = () => { setSort("au"); setFocus("Earth"); };

  return (
    <div className="lab-shell space">
      <div className="lab-header">
        <div><span className="mini-label">6.1.2 · Supplement · planetary data</span><h3>Read the planetary data table</h3></div>
        <div className="big-reading"><span>Focus</span><strong>{selected.name}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="space-stage tall" style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, background: "#fff" }}>
            <thead>
              <tr style={{ textAlign: "left", borderBottom: "2px solid var(--line)" }}>
                <th style={{ padding: 8 }}>Planet</th>
                <th style={{ padding: 8 }}>AU</th>
                <th style={{ padding: 8 }}>Period / y</th>
                <th style={{ padding: 8 }}>Density</th>
                <th style={{ padding: 8 }}>T / K</th>
                <th style={{ padding: 8 }}>g / N kg⁻¹</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => (
                <tr
                  key={p.name}
                  onClick={() => setFocus(p.name)}
                  style={{
                    background: p.name === focus ? "#e7f3ef" : undefined,
                    cursor: "pointer",
                    borderBottom: "1px solid var(--line)",
                  }}
                >
                  <td style={{ padding: 8, fontWeight: 700 }}>{p.name} <small style={{ color: p.type === "rocky" ? "#cf5d45" : "#2b6cb0" }}>{p.type}</small></td>
                  <td style={{ padding: 8 }}>{p.au}</td>
                  <td style={{ padding: 8 }}>{p.years}</td>
                  <td style={{ padding: 8 }}>{p.density}</td>
                  <td style={{ padding: 8 }}>{p.temp}</td>
                  <td style={{ padding: 8 }}>{p.g}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="side">
          <div className="inline-controls" style={{ flexWrap: "wrap" }}>
            <label className="num-field">Sort by
              <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                <option value="au">Orbital distance</option>
                <option value="years">Orbital duration</option>
                <option value="density">Density</option>
                <option value="temp">Surface temperature</option>
                <option value="g">Surface g</option>
              </select>
            </label>
            <button type="button" className="reset-button" onClick={reset}>Reset</button>
          </div>
          <p className="explain" style={{ marginTop: 8 }}>{insight}</p>
          <p className="explain" style={{ marginTop: 8 }}>
            <strong>{selected.name}</strong> vs Earth: distance {selected.au}× AU,
            period {selected.years}× years, density {selected.density} vs {earth.density} g/cm³,
            g = {selected.g} N/kg (Earth {earth.g} N/kg).
          </p>
          <p className="explain" style={{ marginTop: 8 }}>
            Values are simplified teaching data for pattern recognition — not a precision ephemeris.
          </p>
        </div>
      </div>
    </div>
  );
}
