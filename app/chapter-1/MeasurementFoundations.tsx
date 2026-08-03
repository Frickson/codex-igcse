"use client";

import { useState } from "react";

type Tool = "length" | "volume" | "time";

const tools: Record<Tool, { title: string; unit: string; question: string; options: string[]; rule: string }> = {
  length: {
    title: "Length",
    unit: "metre (m)",
    question: "How long, wide or thick is it?",
    options: ["Ruler / metre rule — ordinary lengths", "Tape — long or curved distances", "Calipers / micrometer — tiny lengths"],
    rule: "Start at zero. Look straight at the scale.",
  },
  volume: {
    title: "Volume",
    unit: "m³ or cm³",
    question: "How much space does it occupy?",
    options: ["Measuring cylinder — liquids", "Displacement — irregular solids", "l × w × h — regular blocks"],
    rule: "For water, read the bottom of the meniscus at eye level.",
  },
  time: {
    title: "Time",
    unit: "second (s)",
    question: "How long does the event last?",
    options: ["Clock — long intervals", "Stopwatch — short events", "Electronic timer — less reaction-time effect"],
    rule: "Use clear start and stop events. Repeat the timing.",
  },
};

const scalarExamples = ["distance", "speed", "time", "mass", "energy", "temperature"];
const vectorExamples = ["force", "weight", "velocity", "acceleration", "momentum", "field strength"];

export default function MeasurementFoundations() {
  const [tool, setTool] = useState<Tool>("length");
  const active = tools[tool];

  return (
    <div className="foundation-block academy-foundations">
      <div className="academy-opening">
        <div>
          <span className="mini-label">Big idea · before any formula</span>
          <h3>A number alone is <em>not</em> a measurement.</h3>
          <p>A useful measurement needs <mark>a value</mark>, <mark>a unit</mark> and a method we can trust.</p>
        </div>
        <div className="measurement-equation" aria-label="Measurement equals value plus unit">
          <span>5</span><i>+</i><span>m</span><i>=</i><strong>5 m</strong>
          <small>value</small><small /><small>unit</small><small /><small>measurement</small>
        </div>
      </div>

      <div className="think-first">
        <span>THINK FIRST</span>
        <p>A table is about 1.2 long. What is missing—and which instrument would you choose?</p>
        <small>Say your answer before opening the tool selector.</small>
      </div>

      <div className="instrument-explorer">
        <div className="instrument-tabs" role="tablist" aria-label="Physical quantity">
          {(Object.keys(tools) as Tool[]).map((key) => (
            <button key={key} role="tab" aria-selected={tool === key} className={tool === key ? "active" : ""} onClick={() => setTool(key)}>
              <span aria-hidden="true">{key === "length" ? "↔" : key === "volume" ? "▱" : "◷"}</span>{tools[key].title}
            </button>
          ))}
        </div>
        <div className={`instrument-stage ${tool}`} aria-live="polite">
          <div className="apparatus-visual" aria-hidden="true">
            {tool === "length" && <><div className="ruler-demo"><i /><i /><i /><i /><i /></div><div className="eye-line">eye ⟶ scale</div></>}
            {tool === "volume" && <><div className="cylinder-demo"><i /></div><div className="eye-line">eye ⟶ meniscus</div></>}
            {tool === "time" && <><div className="timer-demo"><b>00:08.40</b><i /></div><div className="reaction-pulse">start · stop</div></>}
          </div>
          <div className="instrument-copy">
            <span>{active.unit}</span>
            <h3>{active.question}</h3>
            <ul>{active.options.map((item) => <li key={item}>{item}</li>)}</ul>
            <p><b>READ IT RIGHT</b>{active.rule}</p>
          </div>
        </div>
      </div>

      <div className="measurement-habits" aria-label="Reliable measurement checklist">
        <span>01 <b>Choose</b> correct instrument</span>
        <span>02 <b>Check zero</b> before reading</span>
        <span>03 <b>Eye level</b> avoids parallax</span>
        <span>04 <b>Repeat</b> and compare</span>
      </div>

      <div className="error-compare">
        <article>
          <div className="error-target random" aria-hidden="true"><i /><i /><i /><i /><i /></div>
          <span>RANDOM ERROR</span>
          <h3>Readings scatter.</h3>
          <p>Reaction time or judging a scale varies each time.</p>
          <b>Repeat + mean → reduces the effect</b>
        </article>
        <article>
          <div className="error-target systematic" aria-hidden="true"><i /><i /><i /><i /><i /></div>
          <span>SYSTEMATIC ERROR</span>
          <h3>Every reading shifts.</h3>
          <p>A zero error pushes results in the same direction.</p>
          <b>Fix the instrument or method—not the average</b>
        </article>
      </div>

      <div className="academy-callout tip">
        <span>ANDREW&apos;S TIP</span>
        <p><strong>Very small distance or short time?</strong> Measure many together, then divide. One ruler uncertainty or start/stop delay is spread across a larger total.</p>
      </div>

      <div className="vector-prompt">
        <div><span>5 m</span><small>How far?</small></div>
        <b>vs</b>
        <div><span>5 m east</span><small>How far + which way?</small></div>
        <p><strong>Which answer can guide you to a destination?</strong> Direction changes the kind of quantity.</p>
      </div>

      <div className="quantity-compare">
        <article>
          <span>SCALAR</span><h3>Magnitude only</h3>
          <p>It answers <strong>“how much?”</strong></p>
          <div className="example-chips">{scalarExamples.map((item) => <small key={item}>{item}</small>)}</div>
        </article>
        <article>
          <span>VECTOR</span><h3>Magnitude + direction</h3>
          <p>It answers <strong>“how much, and which way?”</strong></p>
          <div className="example-chips">{vectorExamples.map((item) => <small key={item}>{item}</small>)}</div>
        </article>
      </div>
      <div className="academy-callout trap"><span>COMMON MISTAKE</span><p><strong>Distance ≠ displacement.</strong> Distance is total path length. Displacement is the straight-line change in position <em>with direction</em>.</p></div>
    </div>
  );
}
