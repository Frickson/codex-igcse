"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import leftHandPhoto from "../../../public/images/fleming-left-real.png";
import rightHandPhoto from "../../../public/images/fleming-right-real.png";

type Rule = "left" | "right";

const LEFT_STEPS = [
  { label: "FIELD", title: "First finger follows the field", copy: "Point from the magnet’s north pole to its south pole. In this scene, the magnetic field is left → right." },
  { label: "CURRENT", title: "Second finger follows conventional current", copy: "Point the second finger down the wire. Use conventional current, not electron flow." },
  { label: "FORCE", title: "The thumb reveals the force", copy: "With field right and current down, the thumb points out of the page: ⊙. The conductor is pushed towards you." },
  { label: "REVERSE", title: "Reverse one input — force reverses", copy: "Current now points up while the field stays right, so the force flips into the page: ⊗." },
] as const;

const RIGHT_STEPS = [
  { label: "FIELD", title: "First finger follows the field", copy: "Again, point from N to S. The magnetic field is left → right." },
  { label: "MOTION", title: "Thumb follows the conductor’s motion", copy: "The conductor is moved downward across the magnetic field. Motion must cut field lines." },
  { label: "INDUCED CURRENT", title: "The second finger reveals induced current", copy: "Field right and motion down give induced conventional current out of the page: ⊙." },
  { label: "REVERSE", title: "Reverse motion — induced current reverses", copy: "Move the conductor upward instead and the induced conventional current flips into the page: ⊗." },
] as const;

function HandDiagram({ rule, localStep, onInteract }: { rule: Rule; localStep: number; onInteract: () => void }) {
  const [rotation, setRotation] = useState({ x: -7, y: rule === "left" ? -10 : 10 });
  const drag = useRef<{ pointerId: number; x: number; y: number; startX: number; startY: number } | null>(null);
  const reverse = localStep === 3;
  const fieldActive = localStep === 0;
  const inputActive = localStep === 1 || reverse;
  const resultActive = localStep === 2 || reverse;
  const secondRole = rule === "left" ? "CURRENT" : "INDUCED CURRENT";
  const thumbRole = rule === "left" ? "FORCE / MOTION" : "MOTION";

  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
  const resetRotation = () => setRotation({ x: -7, y: rule === "left" ? -10 : 10 });
  const beginDrag = (event: PointerEvent<HTMLDivElement>) => {
    drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, startX: rotation.x, startY: rotation.y };
    event.currentTarget.setPointerCapture(event.pointerId);
    onInteract();
  };
  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.pointerId !== event.pointerId) return;
    setRotation({
      x: clamp(drag.current.startX - (event.clientY - drag.current.y) * 0.22, -24, 24),
      y: clamp(drag.current.startY + (event.clientX - drag.current.x) * 0.28, -38, 38),
    });
  };
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.pointerId === event.pointerId) drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };
  const rotateWithKeyboard = (event: KeyboardEvent<HTMLDivElement>) => {
    const moves: Partial<Record<string, { x: number; y: number }>> = {
      ArrowUp: { x: 4, y: 0 }, ArrowDown: { x: -4, y: 0 }, ArrowLeft: { x: 0, y: -5 }, ArrowRight: { x: 0, y: 5 },
    };
    if (event.key === "Home") {
      event.preventDefault();
      resetRotation();
      onInteract();
      return;
    }
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    setRotation((value) => ({ x: clamp(value.x + move.x, -24, 24), y: clamp(value.y + move.y, -38, 38) }));
    onInteract();
  };

  return (
    <div className={`fleming-hand-card ${rule}`}>
      <div className="hand-card-heading">
        <span className="hand-badge">{rule === "left" ? "LEFT HAND · MOTOR" : "RIGHT HAND · GENERATOR"}</span>
        <button type="button" className="hand-reset" onClick={() => { resetRotation(); onInteract(); }}>Reset view</button>
      </div>
      <div
        className="hand-drag-stage"
        role="img"
        tabIndex={0}
        aria-label={`${rule === "left" ? "Left" : "Right"} hand 3D model showing field, ${rule === "left" ? "current and force" : "motion and induced current"}. Drag to tilt, or use arrow keys. Press Home to reset.`}
        onPointerDown={beginDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={rotateWithKeyboard}
      >
        <div
          className="real-hand-model"
          style={{ "--hand-rx": `${rotation.x}deg`, "--hand-ry": `${rotation.y}deg` } as CSSProperties}
        >
          <Image className="real-hand-photo" src={rule === "left" ? leftHandPhoto : rightHandPhoto} alt="" aria-hidden="true" priority />
          <svg className="real-hand-overlay" viewBox="0 0 100 100" aria-hidden="true">
            <g className={`hand-digit field ${fieldActive ? "active" : ""}`}>
              <path d="M48 31 L89 31" />
              <path className="arrow-tip" d="M89 31 L84 27 M89 31 L84 35" />
              <text x="59" y="18">FIRST FINGER</text>
              <text x="59" y="22">FIELD · B</text>
            </g>
            <g className={`hand-digit input ${inputActive ? "active" : ""} ${reverse ? "reversed" : ""}`}>
              {rule === "left" ? (
                <><path d={reverse ? "M45 84 L45 58" : "M45 58 L45 84"} /><path className="arrow-tip" d={reverse ? "M45 58 L41 64 M45 58 L49 64" : "M45 84 L41 78 M45 84 L49 78"} /><text x="51" y="77">SECOND FINGER</text><text x="51" y="81">CURRENT · I</text></>
              ) : (
                <><path d={reverse ? "M56 83 L56 59" : "M56 59 L56 83"} /><path className="arrow-tip" d={reverse ? "M56 59 L52 65 M56 59 L60 65" : "M56 83 L52 77 M56 83 L60 77"} /><text x="63" y="75">THUMB</text><text x="63" y="79">MOTION · v</text></>
              )}
            </g>
            <g className={`hand-depth result ${resultActive ? "active" : ""} ${reverse ? "into" : "out"}`}>
              <path className="thumb-guide" d={rule === "left" ? "M30 40 L47 48" : "M31 39 L52 43"} />
              <circle cx="22" cy="35" r="8" />
              <text x="22" y="38">{reverse ? "×" : "•"}</text>
              <text className="depth-label" x="6" y="52">{rule === "left" ? "THUMB · FORCE" : "SECOND · CURRENT"}</text>
              <text className="depth-note" x="6" y="56">{reverse ? "into page" : "out of page"}</text>
            </g>
          </svg>
        </div>
        <span className="hand-drag-hint"><b>↔</b> Drag to inspect in 3D</span>
      </div>
      <div className="hand-key" aria-hidden="true">
        <span><i className="field" /> First = FIELD</span>
        <span><i className="input" /> {rule === "left" ? `Second = ${secondRole}` : `Thumb = ${thumbRole}`}</span>
        <span><i className="result" /> {rule === "left" ? `Thumb = ${thumbRole}` : `Second = ${secondRole}`}</span>
      </div>
    </div>
  );
}

function DirectionScene({ rule, localStep }: { rule: Rule; localStep: number }) {
  const reverse = localStep === 3;
  const showInput = localStep >= 1;
  const showResult = localStep >= 2;
  const resultOut = !reverse;

  return (
    <div className={`fleming-scene ${rule} step-${localStep}`}>
      <div className="scene-magnet north"><b>N</b><span>north</span></div>
      <div className="scene-field" aria-label="Magnetic field from north to south"><i /><i /><i /><b>magnetic field B</b></div>
      <div className="scene-magnet south"><b>S</b><span>south</span></div>
      <div className={`scene-wire ${showResult ? "reacting" : ""} ${resultOut ? "out" : "into"}`}>
        <i />
        <span>conductor</span>
      </div>
      {showInput && (
        <div className={`scene-input ${reverse ? "up" : "down"}`}>
          <b>{reverse ? "↑" : "↓"}</b>
          <span>{rule === "left" ? "conventional current I" : "motion v"}</span>
        </div>
      )}
      {showResult && (
        <div className={`scene-result ${resultOut ? "out" : "into"}`} aria-live="polite">
          <b>{resultOut ? "⊙" : "⊗"}</b>
          <span>{rule === "left" ? "force" : "induced current"}<small>{resultOut ? "out of page" : "into page"}</small></span>
        </div>
      )}
      <div className="depth-reminder"><b>⊙</b> arrow towards you <span>·</span> <b>⊗</b> arrow away from you</div>
    </div>
  );
}

export default function FlemingRulesLab() {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(true);
  const rule: Rule = step < 4 ? "left" : "right";
  const localStep = step % 4;
  const steps = rule === "left" ? LEFT_STEPS : RIGHT_STEPS;
  const current = steps[localStep];

  useEffect(() => {
    if (!playing || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setStep((value) => (value + 1) % 8), 2400);
    return () => window.clearInterval(timer);
  }, [playing]);

  const selectRule = (nextRule: Rule) => {
    setStep(nextRule === "left" ? 0 : 4);
    setPlaying(true);
  };

  return (
    <div className="lab-shell fleming-lab">
      <div className="lab-header">
        <div>
          <span className="mini-label">4.5.1 &amp; 4.5.4 · direction rules · Supplement</span>
          <h3>Let the hands explain the direction</h3>
          <p className="fleming-intro">Watch one input at a time. The highlighted digit is the one you align before moving to the next step.</p>
        </div>
        <span className={`status-pill ${rule}`}>{rule === "left" ? "Motor effect" : "Generator effect"}</span>
      </div>

      <div className="fleming-rule-tabs" role="group" aria-label="Choose a Fleming rule">
        <button className={rule === "left" ? "active" : ""} aria-pressed={rule === "left"} onClick={() => selectRule("left")}><b>LEFT HAND</b><span>Field + current → force</span></button>
        <button className={rule === "right" ? "active" : ""} aria-pressed={rule === "right"} onClick={() => selectRule("right")}><b>RIGHT HAND</b><span>Field + motion → induced current</span></button>
      </div>

      <div className="fleming-film" data-rule={rule}>
        <div className="fleming-frame-copy">
          <span>{rule === "left" ? "FLEMING’S LEFT-HAND RULE" : "FLEMING’S RIGHT-HAND RULE"} · SHOT {localStep + 1}/4</span>
          <h4>{current.title}</h4>
          <p>{current.copy}</p>
          <div className="fleming-cause">
            <b>{rule === "left" ? "MOTOR" : "GENERATOR"}</b>
            <span>{rule === "left" ? "electrical input" : "motion input"}</span><i>→</i>
            <span>{rule === "left" ? "movement output" : "electrical output"}</span>
          </div>
        </div>
        <HandDiagram key={rule} rule={rule} localStep={localStep} onInteract={() => setPlaying(false)} />
        <DirectionScene rule={rule} localStep={localStep} />
      </div>

      <div className="fleming-timeline" aria-label="Animation progress">
        {steps.map((item, index) => <button key={item.label} className={localStep === index ? "active" : ""} aria-label={`Go to ${item.label} step`} aria-current={localStep === index ? "step" : undefined} onClick={() => { setStep((rule === "left" ? 0 : 4) + index); setPlaying(false); }}><i /><span>{item.label}</span></button>)}
      </div>

      <div className="fleming-controls">
        <button className="action-button" onClick={() => setPlaying((value) => !value)}>{playing ? "Pause explanation" : "Play explanation"}</button>
        <button onClick={() => { setStep((value) => (value + 1) % 8); setPlaying(false); }}>Next shot</button>
        <button onClick={() => { setStep(0); setPlaying(true); }}>Replay both rules</button>
      </div>

      <div className="fleming-compare">
        <article><span>L · LEFT</span><b>Motor effect</b><p>You already know <strong>field + conventional current</strong>. The thumb gives <strong>force / motion</strong>.</p></article>
        <article><span>R · RIGHT</span><b>Generator effect</b><p>You already know <strong>field + conductor motion</strong>. The second finger gives <strong>induced conventional current</strong>.</p></article>
        <article className="exam-trap"><span>EXAM TRAP</span><b>Do not mix input and output</b><p>Both rules give <strong>direction only</strong>. Electron flow is opposite to conventional current.</p></article>
      </div>
      <p className="model-caption">Qualitative direction model. Field is defined N → S. The current shown is conventional current. Reversing either one input reverses the output; reversing both inputs leaves the output direction unchanged.</p>
    </div>
  );
}
