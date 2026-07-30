"use client";

import { useState } from "react";

/**
 * 2.3.2 — convection. Heating a fluid lowers its density so it rises; cooler
 * denser fluid sinks — a circulation. Turning the heater off stops the
 * density-driven loop in this qualitative model.
 */
export default function ConvectionLab() {
  const [heater, setHeater] = useState(true);
  const [fluid, setFluid] = useState<"air" | "water">("water");

  return (
    <div className="lab-shell motion">
      <div className="lab-header">
        <div><span className="mini-label">2.3.2 · convection</span><h3>Watch density drive a current</h3></div>
        <div className="big-reading"><span>Circulation</span><strong>{heater ? "on" : "off"}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="motion-stage" role="img" aria-label={`Convection in ${fluid}`}>
          <svg viewBox="0 0 340 280">
            <rect x={50} y={30} width={240} height={200} rx={8} fill="#dcefe8" stroke="#173d54" strokeWidth={2} />
            {/* heater at bottom left */}
            <rect x={70} y={200} width={50} height={16} rx={3} fill={heater ? "#cf5d45" : "#8b97a8"} />
            <text x={95} y={240} fill="#60737c" fontSize={11} textAnchor="middle">heater</text>
            {heater && (
              <>
                {/* rising warm fluid */}
                <path d="M95 195 C95 120, 95 80, 160 55" fill="none" stroke="#df8c38" strokeWidth={3} markerEnd="url(#arrow)">
                  <animate attributeName="stroke-dasharray" values="0 12;12 0" dur="1.2s" repeatCount="indefinite" />
                </path>
                <path d="M160 55 C220 55, 250 90, 250 140" fill="none" stroke="#1c8b74" strokeWidth={2.5}>
                  <animate attributeName="stroke-dashoffset" values="0;-24" dur="1.4s" repeatCount="indefinite" />
                </path>
                <path d="M250 140 C250 190, 180 195, 125 195" fill="none" stroke="#173d54" strokeWidth={2.5} strokeDasharray="6 4">
                  <animate attributeName="stroke-dashoffset" values="0;20" dur="1.6s" repeatCount="indefinite" />
                </path>
                <text x={120} y={100} fill="#a85f17" fontSize={12} fontWeight={700}>warm, less dense ↑</text>
                <text x={200} y={180} fill="#102a38" fontSize={12} fontWeight={700}>cool, denser ↓</text>
              </>
            )}
            {!heater && (
              <text x={170} y={130} fill="#60737c" fontSize={13} textAnchor="middle">No density difference → no convection current</text>
            )}
            <text x={170} y={268} fill="#102a38" fontSize={13} textAnchor="middle" fontWeight={700}>
              {fluid === "water" ? "Water tank / heater demo" : "Room air above a radiator"}
            </text>
          </svg>
        </div>
        <div className="side">
          <div className="chip-row" role="group" aria-label="Fluid">
            <button className={fluid === "water" ? "active" : ""} onClick={() => setFluid("water")}>Water</button>
            <button className={fluid === "air" ? "active" : ""} onClick={() => setFluid("air")}>Air</button>
          </div>
          <div className="chip-row">
            <button className={heater ? "active" : ""} onClick={() => setHeater(true)}>Heater on</button>
            <button className={!heater ? "active" : ""} onClick={() => setHeater(false)}>Heater off</button>
          </div>
          <p className="field-note" aria-live="polite">
            {heater
              ? `${fluid === "water" ? "Water" : "Air"} near the heater warms, expands and becomes less dense, so it rises. Cooler, denser fluid sinks to replace it — a convection current. This is the main transfer method in fluids.`
              : "Without heating there is no sustained density difference, so the circulation stops."}
          </p>
          <p className="field-note">Everyday: heating a room by convection from a radiator; kitchen pans also rely on convection in the liquid once conduction has heated the base.</p>
        </div>
      </div>
      <p className="lab-note">The loop is shown only while the heater creates a density difference — matching the syllabus explanation, not a decorative perpetual swirl.</p>
    </div>
  );
}
