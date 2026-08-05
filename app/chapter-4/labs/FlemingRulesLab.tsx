"use client";

import { useEffect, useState } from "react";

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

function HandDiagram({ rule, localStep }: { rule: Rule; localStep: number }) {
  const reverse = localStep === 3;
  const fieldActive = localStep === 0;
  const inputActive = localStep === 1 || reverse;
  const resultActive = localStep === 2 || reverse;
  const secondRole = rule === "left" ? "CURRENT" : "INDUCED CURRENT";
  const thumbRole = rule === "left" ? "FORCE / MOTION" : "MOTION";

  return (
    <div className={`fleming-hand-card ${rule}`}>
      <span className="hand-badge">{rule === "left" ? "LEFT HAND · MOTOR" : "RIGHT HAND · GENERATOR"}</span>
      <svg viewBox="0 0 380 300" role="img" aria-label={`${rule === "left" ? "Left" : "Right"} hand showing field, ${rule === "left" ? "current and force" : "motion and induced current"}`}>
        <g className={`hand-anatomy ${rule}`} aria-hidden="true">
          <path className="hand-index-finger" d="M159 96 L307 96 Q327 96 327 114 Q327 132 307 132 L159 132 Z" />
          <path className={rule === "left" ? "hand-thumb" : "hand-second-finger"} d="M141 153 C119 153 101 143 85 124 C74 111 60 106 50 115 C39 125 45 141 57 151 L112 197 Z" />
          <path className="hand-palm" d="M113 164 Q125 143 153 140 L199 140 Q231 140 244 166 L261 202 Q269 220 258 238 L242 266 L114 266 L104 216 Q99 184 113 164 Z" />
          <path className={rule === "left" ? "hand-middle-finger" : "hand-thumb-down"} d={rule === "left" ? "M147 151 Q147 136 165 136 Q183 136 183 151 L183 238 Q183 258 165 258 Q147 258 147 238 Z" : "M142 163 Q142 145 166 145 Q190 145 190 163 L190 214 Q190 237 166 237 Q142 237 142 214 Z"} />
          <path className="hand-wrist" d="M121 258 L234 258 L241 294 L116 294 Z" />
          <path className="hand-nail depth-nail" d="M48 120 Q58 110 69 119 Q77 127 68 137 Q58 145 49 137 Q41 130 48 120 Z" />
          <path className="hand-nail index-nail" d="M294 102 Q315 101 316 113 Q315 125 294 125 Z" />
          <path className="hand-nail vertical-nail" d="M154 226 Q165 218 176 226 L176 244 Q165 252 154 244 Z" />
          <path className="hand-crease" d="M126 201 Q163 178 217 195 M193 216 Q224 216 243 204 M119 226 Q152 212 178 218" />
          <path className="hand-folded-fingers" d="M207 149 Q231 158 236 181 Q217 174 200 180 M219 184 Q245 191 248 213 Q225 205 205 213" />
        </g>

        <g className={`hand-digit field ${fieldActive ? "active" : ""}`}>
          <path d="M174 114 L309 114" />
          <path className="arrow-tip" d="M309 114 L292 104 M309 114 L292 124" />
          <text x="205" y="70">FIRST FINGER</text>
          <text x="205" y="84">FIELD · B · N → S</text>
        </g>

        {rule === "left" ? (
          <>
            <g className={`hand-digit input ${inputActive ? "active" : ""} ${reverse ? "reversed" : ""}`}>
              <path d={reverse ? "M165 243 L165 153" : "M165 153 L165 243"} />
              <path className="arrow-tip" d={reverse ? "M165 153 L155 171 M165 153 L175 171" : "M165 243 L155 225 M165 243 L175 225"} />
              <text x="187" y="249">SECOND FINGER</text>
              <text x="187" y="263">CURRENT · I</text>
            </g>
            <g className={`hand-depth result ${resultActive ? "active" : ""} ${reverse ? "into" : "out"}`}>
              <path className="thumb-guide" d="M118 166 L73 128" />
              <circle cx="50" cy="75" r="23" />
              <text x="50" y="83">{reverse ? "×" : "•"}</text>
              <text className="depth-label" x="82" y="68">THUMB</text>
              <text className="depth-label" x="82" y="82">FORCE · F</text>
              <text className="depth-note" x="82" y="96">{reverse ? "into page" : "out of page"}</text>
            </g>
          </>
        ) : (
          <>
            <g className={`hand-digit input ${inputActive ? "active" : ""} ${reverse ? "reversed" : ""}`}>
              <path d={reverse ? "M166 225 L166 161" : "M166 161 L166 225"} />
              <path className="arrow-tip" d={reverse ? "M166 161 L156 179 M166 161 L176 179" : "M166 225 L156 207 M166 225 L176 207"} />
              <text x="198" y="224">THUMB</text>
              <text x="198" y="238">MOTION · v</text>
            </g>
            <g className={`hand-depth result ${resultActive ? "active" : ""} ${reverse ? "into" : "out"}`}>
              <path className="thumb-guide" d="M118 166 L73 128" />
              <circle cx="50" cy="75" r="23" />
              <text x="50" y="83">{reverse ? "×" : "•"}</text>
              <text className="depth-label" x="82" y="68">SECOND FINGER</text>
              <text className="depth-label" x="82" y="82">INDUCED I</text>
              <text className="depth-note" x="82" y="96">{reverse ? "into page" : "out of page"}</text>
            </g>
          </>
        )}
      </svg>
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
        <HandDiagram rule={rule} localStep={localStep} />
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
