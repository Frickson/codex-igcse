"use client";

import { useEffect, useState, type CSSProperties } from "react";

function GeneratorWaveformLab() {
  const [angle, setAngle] = useState(0);
  const [speed, setSpeed] = useState(2);
  const [turns, setTurns] = useState(3);
  const [field, setField] = useState(2);
  const [playing, setPlaying] = useState(false);
  const amplitude = speed * turns * field * 0.4;
  const emf = amplitude * Math.sin(angle * Math.PI / 180);
  const graphPoints = Array.from({ length: 73 }, (_, index) => {
    const theta = index * 5;
    return `${theta / 3.6},${50 - Math.sin(theta * Math.PI / 180) * 38}`;
  }).join(" ");

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setAngle((value) => (value + speed * 2) % 360), 50);
    return () => window.clearInterval(timer);
  }, [playing, speed]);

  return (
    <div className="lab-shell generator-wave-lab">
      <div className="lab-header">
        <div><span className="mini-label">4.5.2 · a.c. generator</span><h3>Match coil position to the e.m.f. waveform</h3></div>
        <div className="big-reading"><span>Instantaneous e.m.f.</span><strong>{emf >= 0 ? "+" : ""}{emf.toFixed(1)} V</strong></div>
      </div>
      <div className="generator-workbench">
        <div className="generator-stage">
          <div className="generator-pole north">N</div>
          <div className="generator-coil" style={{ transform: `rotateY(${angle}deg)` }}><i /><b>coil</b></div>
          <div className="generator-pole south">S</div>
          <div className="slip-rings"><i /><i /><b>slip rings</b></div>
          <div className="brushes"><i /><i /><b>brushes</b></div>
          <span className="angle-readout">coil normal: {Math.round(angle)}°</span>
        </div>
        <div className="wave-panel">
          <svg viewBox="0 0 100 100" role="img" aria-label="Alternating e.m.f. graph synchronized with generator coil">
            <path className="wave-axis" d="M 3 50 L 98 50 M 3 8 L 3 92" />
            <polyline points={graphPoints} />
            <line className="wave-guide" x1={angle / 3.6} y1="8" x2={angle / 3.6} y2="92" />
            <circle cx={angle / 3.6} cy={50 - Math.sin(angle * Math.PI / 180) * 38} r="2.8" />
            <text x="4" y="10">e.m.f.</text><text x="88" y="47">angle</text>
            <text x="1" y="97">0°</text><text x="25" y="97">90°</text><text x="48" y="97">180°</text><text x="73" y="97">270°</text>
          </svg>
          <p>{Math.abs(emf) < amplitude * 0.08 ? "Zero e.m.f.: flux linkage is momentarily changing least rapidly." : Math.abs(emf) > amplitude * 0.92 ? "Peak e.m.f.: the coil is cutting field lines at the greatest rate." : "The e.m.f. changes continuously as the coil rotates."}</p>
        </div>
      </div>
      <div className="generator-controls">
        <label>Coil position <strong>{Math.round(angle)}°</strong><input type="range" min="0" max="360" value={angle} onChange={(event) => { setAngle(+event.target.value); setPlaying(false); }} /></label>
        <label>Rotation speed <strong>Level {speed}</strong><input type="range" min="1" max="5" value={speed} onChange={(event) => setSpeed(+event.target.value)} /></label>
        <label>Coil turns <strong>Level {turns}</strong><input type="range" min="1" max="5" value={turns} onChange={(event) => setTurns(+event.target.value)} /></label>
        <label>Field strength <strong>Level {field}</strong><input type="range" min="1" max="5" value={field} onChange={(event) => setField(+event.target.value)} /></label>
        <button className="action-button" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause rotation" : "Run generator"}</button>
      </div>
      <p className="lab-note">Slip rings keep each end of the rotating coil connected to the same brush. The induced e.m.f. therefore reverses every half-turn. Greater speed, more turns or a stronger field increases the peak e.m.f.</p>
    </div>
  );
}

function MotorForceLab() {
  const [currentReversed, setCurrentReversed] = useState(false);
  const [fieldReversed, setFieldReversed] = useState(false);
  const [current, setCurrent] = useState(3);
  const [turns, setTurns] = useState(3);
  const [field, setField] = useState(3);
  const [prediction, setPrediction] = useState<"out" | "in" | null>(null);
  const forceOut = currentReversed !== fieldReversed;
  const force = current * turns * field;
  const correct = prediction === (forceOut ? "out" : "in");
  const resetPrediction = () => setPrediction(null);

  return (
    <div className="lab-shell motor-force-lab">
      <div className="lab-header">
        <div><span className="mini-label">4.5.4–4.5.5 · motor effect</span><h3>Predict the force, then run the motor</h3></div>
        <span className="status-pill">Fleming&apos;s left-hand rule</span>
      </div>
      <div className="motor-force-workbench">
        <div className={`force-stage ${forceOut ? "force-out" : "force-in"}`}>
          <div className="force-pole left"><b>{fieldReversed ? "S" : "N"}</b><span>field</span></div>
          <div className="force-wire"><i>{currentReversed ? "↓" : "↑"}</i><span>current</span></div>
          <div className="force-result"><b>{forceOut ? "⊙" : "⊗"}</b><span>{forceOut ? "force out of page" : "force into page"}</span></div>
          <div className="force-pole right"><b>{fieldReversed ? "N" : "S"}</b><span>field</span></div>
        </div>
        <div className="motor-model">
          <div className="motor-coil-model" style={{ "--motor-speed": `${Math.max(.55, 3.3 - force / 18)}s` } as CSSProperties}><i /><b /></div>
          <div className="split-ring"><i /><i /><b>split-ring commutator</b></div>
          <div className="motor-brushes"><i /><i /><b>brushes</b></div>
          <p>The split ring reverses current every half-turn, keeping the turning effect in the same rotational direction.</p>
        </div>
      </div>
      <div className="force-controls">
        <button onClick={() => { setCurrentReversed((value) => !value); resetPrediction(); }}>Reverse current</button>
        <button onClick={() => { setFieldReversed((value) => !value); resetPrediction(); }}>Reverse field</button>
        <label>Current <strong>{current} A</strong><input type="range" min="1" max="5" value={current} onChange={(event) => setCurrent(+event.target.value)} /></label>
        <label>Coil turns <strong>Level {turns}</strong><input type="range" min="1" max="5" value={turns} onChange={(event) => setTurns(+event.target.value)} /></label>
        <label>Field strength <strong>Level {field}</strong><input type="range" min="1" max="5" value={field} onChange={(event) => setField(+event.target.value)} /></label>
      </div>
      <div className="force-prediction">
        <span>Predict the force on the shown wire:</span>
        <button className={prediction === "out" ? "selected" : ""} onClick={() => setPrediction("out")}>Out of page ⊙</button>
        <button className={prediction === "in" ? "selected" : ""} onClick={() => setPrediction("in")}>Into page ⊗</button>
        <p className={prediction ? correct ? "correct-text" : "wrong-text" : ""}>{prediction ? correct ? "Correct. Reverse either current or field and the force reverses; reverse both and it stays the same." : "Not yet. Point the left-hand first finger with the field and second finger with conventional current." : "Choose a direction before reading the diagram's force symbol."}</p>
      </div>
    </div>
  );
}

export default function ElectromagneticLabsPage() {
  return (
    <main className="advanced-labs-page">
      <header className="labs-topbar">
        <a href="../" className="brand"><i>Φ</i><span>Field Notes<small>IGCSE Physics · Advanced labs</small></span></a>
        <nav><a href="#generator">Generator lab</a><a href="#motor">Motor lab</a><a href="../chapter-4/#effects">← Main lesson</a></nav>
      </header>

      <section className="labs-hero">
        <div>
          <span className="eyebrow">Cambridge IGCSE Physics 0625 · 4.5 Electromagnetic effects</span>
          <h1>Generator & motor<br /><em>interactive laboratories</em></h1>
          <p>Scrub through a complete generator cycle, connect coil position to the a.c. waveform, then predict motor-force direction before changing the current or magnetic field.</p>
          <a className="primary-button" href="#generator">Start the generator lab <span>↓</span></a>
        </div>
        <div className="labs-hero-mark"><span>G</span><i>↔</i><span>M</span><b>kinetic ↔ electrical</b></div>
      </section>

      <section className="advanced-lab-section" id="generator">
        <div className="section-heading">
          <span className="section-number">01</span>
          <div><span className="eyebrow">Generator investigation</span><h2>Position explains the waveform.</h2><p>Watch the graph marker travel with the rotating coil. Pause and scrub to compare zeros, peaks and reversals.</p></div>
        </div>
        <GeneratorWaveformLab />
        <div className="advanced-prompts">
          <article><span>Predict</span><p>At which coil positions is the magnitude of the induced e.m.f. greatest?</p></article>
          <article><span>Change</span><p>Double the speed, turns or field strength separately. What happens to peak e.m.f.?</p></article>
          <article><span>Explain</span><p>Why does the output reverse every half-turn even though the coil keeps rotating one way?</p></article>
        </div>
      </section>

      <section className="advanced-lab-section motor-section" id="motor">
        <div className="section-heading">
          <span className="section-number">02</span>
          <div><span className="eyebrow">Motor investigation</span><h2>Field × current gives force.</h2><p>Apply Fleming&apos;s left-hand rule, test your prediction, and investigate the factors that increase the turning effect.</p></div>
        </div>
        <MotorForceLab />
        <div className="advanced-prompts">
          <article><span>Reverse one</span><p>Reverse only the current or only the field. Confirm that the force reverses.</p></article>
          <article><span>Reverse both</span><p>Reverse current and field together. Explain why the force direction is unchanged.</p></article>
          <article><span>Increase</span><p>Increase current, coil turns and field strength. Relate each change to the turning effect.</p></article>
        </div>
      </section>

      <footer>
        <div><i>Φ</i><b>Field Notes</b><span>Advanced electromagnetic-effects laboratories</span></div>
        <p><a href="../chapter-4/#effects">Return to the complete Chapter 4 lesson</a></p>
      </footer>
    </main>
  );
}
