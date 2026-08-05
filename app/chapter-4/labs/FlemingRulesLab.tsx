"use client";

import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";

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
  const gradientId = `hand-skin-${rule}`;
  const highlightId = `hand-highlight-${rule}`;
  const shadowId = `hand-shadow-${rule}`;

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
        <svg
          viewBox="0 0 380 300"
          aria-hidden="true"
          style={{ "--hand-rx": `${rotation.x}deg`, "--hand-ry": `${rotation.y}deg` } as CSSProperties}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffe2c7" />
              <stop offset="0.48" stopColor="#eeb88e" />
              <stop offset="1" stopColor="#bd7851" />
            </linearGradient>
            <radialGradient id={highlightId} cx="35%" cy="24%" r="80%">
              <stop offset="0" stopColor="#ffe9d5" />
              <stop offset="0.62" stopColor="#efbd96" />
              <stop offset="1" stopColor="#cd8961" />
            </radialGradient>
            <filter id={shadowId} x="-30%" y="-30%" width="170%" height="180%">
              <feDropShadow dx="8" dy="13" stdDeviation="9" floodColor="#56351f" floodOpacity=".3" />
            </filter>
          </defs>
          <ellipse className="hand-ground-shadow" cx="180" cy="273" rx="108" ry="16" />
          <g className={`hand-anatomy ${rule}`} aria-hidden="true" filter={`url(#${shadowId})`}>
          <path className="hand-index-finger" d="M153 82 L306 82 Q329 82 329 102 Q329 122 306 122 L153 122 Q138 122 138 107 L138 97 Q138 82 153 82 Z" />
          <path className="hand-palm" d="M114 145 Q127 122 154 119 L201 119 Q234 120 248 148 L266 191 Q274 214 261 236 L244 263 L111 263 L101 211 Q96 172 114 145 Z" />
          <path className={rule === "left" ? "hand-middle-finger" : "hand-thumb-down"} d={rule === "left" ? "M144 139 Q144 121 165 121 Q186 121 186 139 L186 236 Q186 260 165 260 Q144 260 144 236 Z" : "M142 143 Q142 124 166 124 Q190 124 190 143 L190 224 Q190 249 166 249 Q142 249 142 224 Z"} />
          <path className={rule === "left" ? "hand-thumb hand-depth-digit" : "hand-second-finger hand-depth-digit"} d="M151 142 C132 137 117 126 107 113 C99 102 84 97 73 104 C60 113 62 131 75 140 L112 170 Q129 180 144 169 Q157 158 151 142 Z" />
          <ellipse className="hand-depth-pad" cx="78" cy="113" rx="18" ry="16" />
          <path className="hand-depth-pad-shine" d="M67 106 Q77 98 88 106" />
          <path className="hand-wrist" d="M119 255 L238 255 L246 294 L112 294 Z" />
          <path className="hand-nail index-nail" d="M294 89 Q317 88 318 101 Q317 115 294 115 Z" />
          <path className="hand-nail vertical-nail" d={rule === "left" ? "M153 228 Q165 219 177 228 L177 246 Q165 255 153 246 Z" : "M153 215 Q166 206 179 215 L179 232 Q166 242 153 232 Z"} />
          <path className="hand-crease" d="M119 191 Q160 164 218 183 M192 207 Q226 205 248 193 M115 220 Q150 201 179 208" />
          <path className="hand-folded-fingers" d="M205 130 Q236 142 240 172 Q218 163 197 169 M218 174 Q250 183 253 211 Q226 201 202 210" />
          <path className="hand-specular" d="M171 91 L296 91 M119 157 Q151 132 198 132 M125 265 L229 265" />
          </g>

        <g className={`hand-digit field ${fieldActive ? "active" : ""}`}>
          <path d="M169 102 L308 102" />
          <path className="arrow-tip" d="M308 102 L291 92 M308 102 L291 112" />
          <text x="202" y="54">FIRST FINGER</text>
          <text x="202" y="68">FIELD · B · N → S</text>
        </g>

        {rule === "left" ? (
          <>
            <g className={`hand-digit input ${inputActive ? "active" : ""} ${reverse ? "reversed" : ""}`}>
              <path d={reverse ? "M165 242 L165 139" : "M165 139 L165 242"} />
              <path className="arrow-tip" d={reverse ? "M165 139 L155 157 M165 139 L175 157" : "M165 242 L155 224 M165 242 L175 224"} />
              <text x="190" y="232">SECOND FINGER</text>
              <text x="190" y="246">CURRENT · I</text>
            </g>
            <g className={`hand-depth result ${resultActive ? "active" : ""} ${reverse ? "into" : "out"}`}>
              <path className="thumb-guide" d="M75 91 L78 102" />
              <circle cx="65" cy="58" r="23" />
              <text x="65" y="66">{reverse ? "×" : "•"}</text>
              <text className="depth-label" x="96" y="52">THUMB</text>
              <text className="depth-label" x="96" y="66">FORCE · F</text>
              <text className="depth-note" x="96" y="80">{reverse ? "into page" : "out of page"}</text>
            </g>
          </>
        ) : (
          <>
            <g className={`hand-digit input ${inputActive ? "active" : ""} ${reverse ? "reversed" : ""}`}>
              <path d={reverse ? "M166 232 L166 142" : "M166 142 L166 232"} />
              <path className="arrow-tip" d={reverse ? "M166 142 L156 160 M166 142 L176 160" : "M166 232 L156 214 M166 232 L176 214"} />
              <text x="196" y="218">THUMB</text>
              <text x="196" y="232">MOTION · v</text>
            </g>
            <g className={`hand-depth result ${resultActive ? "active" : ""} ${reverse ? "into" : "out"}`}>
              <path className="thumb-guide" d="M75 91 L78 102" />
              <circle cx="65" cy="58" r="23" />
              <text x="65" y="66">{reverse ? "×" : "•"}</text>
              <text className="depth-label" x="96" y="52">SECOND FINGER</text>
              <text className="depth-label" x="96" y="66">INDUCED I</text>
              <text className="depth-note" x="96" y="80">{reverse ? "into page" : "out of page"}</text>
            </g>
          </>
        )}
        </svg>
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
