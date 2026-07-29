"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent, type KeyboardEvent, type PointerEvent } from "react";

type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
  why: string;
};

const sections = [
  ["overview", "Syllabus map"],
  ["magnetism", "Magnetism"],
  ["circuits", "Circuits"],
  ["effects", "Electromagnetic effects"],
  ["safety", "Safety"],
  ["practice", "Exam practice"],
  ["mindmap", "Mind map"],
  ["quiz", "Checkpoint"],
];

const quizQuestions: QuizQuestion[] = [
  {
    question: "Which statement describes conventional current?",
    options: [
      "The direction positive charge would move",
      "The direction electrons move",
      "A flow from low potential to high potential",
      "A flow that exists only in metals",
    ],
    answer: 0,
    why: "Conventional current is defined in the direction a positive charge would move. In a metal, electrons drift in the opposite direction.",
  },
  {
    question: "Two 6.0 Ω resistors are connected in parallel. What is their combined resistance?",
    options: ["12 Ω", "6.0 Ω", "3.0 Ω", "1.5 Ω"],
    answer: 2,
    why: "For two equal resistors in parallel, the combined resistance is half one resistance: 6.0 ÷ 2 = 3.0 Ω.",
  },
  {
    question: "How can the force on a current-carrying wire in a magnetic field be reversed?",
    options: [
      "Increase the current",
      "Reverse the current",
      "Use a stronger magnet",
      "Add a soft-iron core",
    ],
    answer: 1,
    why: "Reversing either the current or the magnetic field reverses the force. Increasing either only increases the force.",
  },
  {
    question: "A transformer has 200 primary turns and 50 secondary turns. The input is 240 V. What is the output?",
    options: ["960 V", "240 V", "60 V", "15 V"],
    answer: 2,
    why: "Vs / Vp = Ns / Np, so Vs = 240 × 50 / 200 = 60 V.",
  },
  {
    question: "Why is a fuse connected in the live wire?",
    options: [
      "To reduce the supply voltage",
      "To disconnect the appliance from the high-potential supply",
      "To increase the resistance of the appliance",
      "To make the earth wire carry current",
    ],
    answer: 1,
    why: "If excessive current melts the fuse, the live connection is broken and the appliance is isolated from the high-potential supply.",
  },
  {
    question: "Which change increases the induced e.m.f. in a coil?",
    options: [
      "Move the magnet more slowly",
      "Use fewer turns",
      "Keep the magnet stationary",
      "Move a stronger magnet faster",
    ],
    answer: 3,
    why: "A greater rate of change of magnetic flux linkage produces a larger induced e.m.f.",
  },
];

const examQuestions = [
  {
    tag: "Pattern 01 · calculation",
    marks: 4,
    question:
      "A 12 V supply is connected to a 4.0 Ω resistor in series with a 2.0 Ω resistor. Calculate (a) the current and (b) the potential difference across the 4.0 Ω resistor.",
    scheme: [
      "Total resistance = 4.0 + 2.0 = 6.0 Ω [1]",
      "Current I = V/R = 12/6.0 = 2.0 A [1]",
      "Potential difference V = IR [1]",
      "V = 2.0 × 4.0 = 8.0 V [1]",
    ],
  },
  {
    tag: "Pattern 02 · explain",
    marks: 3,
    question:
      "Explain why adding another lamp in parallel makes the total current from an ideal supply increase.",
    scheme: [
      "Adding a parallel branch decreases the combined resistance [1].",
      "The supply potential difference remains constant [1].",
      "Using I = V/R, a smaller total resistance gives a larger total current [1].",
    ],
  },
  {
    tag: "Pattern 03 · safety",
    marks: 4,
    question:
      "A metal-cased kettle develops a fault in which the live wire touches the case. Explain how the earth wire and fuse protect the user.",
    scheme: [
      "The earth wire provides a low-resistance path to ground [1].",
      "A large current flows through the earth wire [1].",
      "The fuse melts / circuit breaker opens [1].",
      "The live supply is disconnected, so the case does not remain live [1].",
    ],
  },
  {
    tag: "Pattern 04 · electromagnetism",
    marks: 4,
    question:
      "State two changes that make an electromagnet stronger and explain why soft iron is used for its core rather than steel.",
    scheme: [
      "Increase the current [1].",
      "Increase turns per unit length / number of turns [1].",
      "Soft iron magnetises strongly when current flows [1].",
      "It demagnetises readily when current is switched off [1].",
    ],
  },
  {
    tag: "Pattern 05 · transformer",
    marks: 4,
    question:
      "An ideal transformer changes 12 V to 240 V. The primary has 100 turns and carries 2.0 A. Calculate (a) the secondary turns and (b) the secondary current.",
    scheme: [
      "Ns/Np = Vs/Vp = 240/12 = 20 [1]",
      "Ns = 20 × 100 = 2000 turns [1]",
      "For an ideal transformer, VpIp = VsIs [1]",
      "Is = (12 × 2.0)/240 = 0.10 A [1]",
    ],
  },
];

function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? (window.scrollY / height) * 100 : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return progress;
}

function FieldLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mode, setMode] = useState<"bar" | "coil">("bar");
  const [currentSetting, setCurrentSetting] = useState(2);
  const [turns, setTurns] = useState(5);
  const [circuitClosed, setCircuitClosed] = useState(true);
  const current = circuitClosed ? currentSetting : 0;
  const coilVoltage = current * 3;
  const strength = Math.round((current * turns) / 2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      const box = canvas.getBoundingClientRect();
      canvas.width = box.width * devicePixelRatio;
      canvas.height = box.height * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
      draw();
    };
    const arrow = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(-5, -4);
      ctx.lineTo(2, 0);
      ctx.lineTo(-5, 4);
      ctx.stroke();
      ctx.restore();
    };
    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#f4f7f6";
      ctx.fillRect(0, 0, w, h);
      const cx = w / 2;
      const cy = h / 2;
      if (mode === "bar") {
        ctx.fillStyle = "#cf5d45";
        ctx.fillRect(cx - 90, cy - 28, 90, 56);
        ctx.fillStyle = "#23455f";
        ctx.fillRect(cx, cy - 28, 90, 56);
        ctx.fillStyle = "white";
        ctx.font = "700 18px sans-serif";
        ctx.fillText("N", cx - 52, cy + 7);
        ctx.fillText("S", cx + 38, cy + 7);
      } else {
        ctx.fillStyle = current > 0 ? "#23455f" : "#8c999e";
        ctx.roundRect(cx - 85, cy - 24, 170, 48, 12);
        ctx.fill();
        ctx.strokeStyle = "#df8c38";
        ctx.lineWidth = 5;
        for (let i = 0; i < turns; i++) {
          const x = cx - 72 + (144 / Math.max(1, turns - 1)) * i;
          ctx.beginPath();
          ctx.ellipse(x, cy, 10, 42, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = "white";
        ctx.font = "700 16px sans-serif";
        if (current > 0) {
          ctx.fillText("S", cx - 72, cy + 6);
          ctx.fillText("N", cx + 61, cy + 6);
        } else {
          ctx.fillText("OFF", cx - 17, cy + 6);
        }
      }
      const alpha = mode === "bar" ? 0.58 : current > 0 ? Math.min(0.25 + strength / 45, 0.95) : 0.08;
      ctx.strokeStyle = `rgba(28, 139, 116, ${alpha})`;
      ctx.lineWidth = mode === "bar" ? 2 : current > 0 ? 1.5 + strength / 14 : 1;
      [-1, -0.72, -0.45, 0.45, 0.72, 1].forEach((curve, index) => {
        const upper = curve < 0;
        const spread = Math.abs(curve) * 95;
        ctx.beginPath();
        ctx.moveTo(cx - 88, cy + (upper ? -5 : 5));
        ctx.bezierCurveTo(
          cx - 70,
          cy + (upper ? -spread : spread),
          cx + 70,
          cy + (upper ? -spread : spread),
          cx + 88,
          cy + (upper ? -5 : 5),
        );
        ctx.stroke();
        arrow(cx, cy + (upper ? -spread * 0.75 : spread * 0.75), upper ? 0 : Math.PI);
        if (index < 2) {
          ctx.beginPath();
          ctx.moveTo(cx + 88, cy + (upper ? 6 : -6));
          ctx.bezierCurveTo(
            cx + 45,
            cy + (upper ? spread * 0.45 : -spread * 0.45),
            cx - 45,
            cy + (upper ? spread * 0.45 : -spread * 0.45),
            cx - 88,
            cy + (upper ? 6 : -6),
          );
          ctx.stroke();
        }
      });
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [mode, current, turns, strength]);

  return (
    <div className="lab-shell">
      <div className="lab-header">
        <div>
          <span className="mini-label">Interactive field lab</span>
          <h3>See what field lines are telling you</h3>
        </div>
        <div className="segmented" aria-label="Choose magnet type">
          <button className={mode === "bar" ? "active" : ""} onClick={() => setMode("bar")}>Bar magnet</button>
          <button className={mode === "coil" ? "active" : ""} onClick={() => setMode("coil")}>Electromagnet</button>
        </div>
      </div>
      <canvas ref={canvasRef} className="field-canvas" aria-label="Animated magnetic field model" />
      {mode === "coil" ? (
        <div className="electromagnet-controls">
          <div className="em-sliders">
            <label>
              Current setting <strong>{currentSetting.toFixed(1)} A</strong>
              <input type="range" min="0.5" max="4" step="0.5" value={currentSetting} onChange={(e) => setCurrentSetting(+e.target.value)} />
            </label>
            <label>
              Coil turns <strong>{turns}</strong>
              <input type="range" min="3" max="10" value={turns} onChange={(e) => setTurns(+e.target.value)} />
            </label>
          </div>
          <div className={`em-circuit-board ${circuitClosed ? "closed" : "open"}`}>
            <span className="em-board-label">Electromagnet circuit</span>
            <div className="em-battery"><b>{(currentSetting * 3).toFixed(1)} V</b><span>supply</span></div>
            <div className="em-circuit-wire" />
            <button className="em-switch" onClick={() => setCircuitClosed(!circuitClosed)} aria-pressed={circuitClosed}>
              <i /><b>{circuitClosed ? "CLOSED" : "OPEN"}</b><span>switch</span>
            </button>
            <div className="em-coil-symbol"><i /><i /><i /><span>coil</span></div>
            <div className="em-indicator-bulb" style={{ "--brightness": current / 4 } as React.CSSProperties}>
              <i /><b>{current > 0 ? "ON" : "OFF"}</b><span>indicator bulb</span>
            </div>
            <div className="em-voltmeter"><b>{coilVoltage.toFixed(1)}</b><span>V</span><small>across coil</small></div>
          </div>
          <div className="em-live-readouts">
            <div><span>Actual current</span><b>{current.toFixed(1)} A</b></div>
            <div className="em-strength-readout"><span>Relative field strength</span><b>{strength}</b><i><em style={{ width: `${Math.min(strength * 4, 100)}%` }} /></i></div>
            <p>{circuitClosed ? "Increase current: the bulb brightens, the voltmeter rises and the magnetic field strengthens." : "The open switch breaks the circuit: no current, no bulb and no electromagnet field."}</p>
          </div>
        </div>
      ) : (
        <p className="lab-note"><b>Read the pattern:</b> outside the magnet, arrows point N → S. Closer spacing means a stronger field.</p>
      )}
    </div>
  );
}

function CircuitLab() {
  const [layout, setLayout] = useState<"series" | "parallel">("series");
  const [voltage, setVoltage] = useState(12);
  const [resistance, setResistance] = useState(6);
  const totalResistance = layout === "series" ? resistance * 2 : resistance / 2;
  const totalCurrent = voltage / totalResistance;
  const branchCurrent = layout === "parallel" ? voltage / resistance : totalCurrent;
  const brightness = Math.min(1, layout === "series" ? totalCurrent / 1.5 : branchCurrent / 1.5);

  return (
    <div className="lab-shell circuit-lab">
      <div className="lab-header">
        <div>
          <span className="mini-label">Circuit builder</span>
          <h3>What changes in series and parallel?</h3>
        </div>
        <div className="segmented" aria-label="Choose circuit layout">
          <button className={layout === "series" ? "active" : ""} onClick={() => setLayout("series")}>Series</button>
          <button className={layout === "parallel" ? "active" : ""} onClick={() => setLayout("parallel")}>Parallel</button>
        </div>
      </div>
      <div className={`circuit-stage ${layout}`}>
        <div className="battery"><span>+</span><i /><span>−</span></div>
        <div className="wire-path path-one" />
        <div className="wire-path path-two" />
        <div className="bulb bulb-one" style={{ "--glow": brightness } as React.CSSProperties}><i /></div>
        <div className="bulb bulb-two" style={{ "--glow": brightness } as React.CSSProperties}><i /></div>
        <div className="electron-stream one" />
        <div className="electron-stream two" />
      </div>
      <div className="controls-grid">
        <label>
          Supply voltage <strong>{voltage} V</strong>
          <input type="range" min="3" max="18" step="3" value={voltage} onChange={(e) => setVoltage(+e.target.value)} />
        </label>
        <label>
          Each lamp resistance <strong>{resistance} Ω</strong>
          <input type="range" min="2" max="12" step="2" value={resistance} onChange={(e) => setResistance(+e.target.value)} />
        </label>
        <div className="readout-stack">
          <span>Combined R <b>{totalResistance.toFixed(1)} Ω</b></span>
          <span>Total current <b>{totalCurrent.toFixed(2)} A</b></span>
        </div>
      </div>
      <p className="lab-note">
        {layout === "series"
          ? "In series: current is the same everywhere; potential difference is shared; resistances add."
          : "In parallel: potential difference is the same across each branch; current splits; combined resistance falls."}
      </p>
    </div>
  );
}

function CircuitAssemblyLab() {
  const parts = [
    { id: "cell", label: "Cell", symbol: "+ | −" },
    { id: "switch", label: "Switch", symbol: "— / —" },
    { id: "lamp", label: "Lamp", symbol: "⊗" },
  ] as const;
  const [slots, setSlots] = useState<(typeof parts[number]["id"] | null)[]>([null, null, null]);
  const [selected, setSelected] = useState<typeof parts[number]["id"] | null>(null);
  const [closed, setClosed] = useState(false);
  const complete = parts.every((part) => slots.includes(part.id));
  const lit = complete && closed;

  const placePart = (part: typeof parts[number]["id"], index: number) => {
    setSlots((old) => old.map((value, slotIndex) => slotIndex === index ? part : value === part ? null : value));
    setSelected(null);
  };
  const startDrag = (event: DragEvent<HTMLButtonElement>, part: typeof parts[number]["id"]) => {
    event.dataTransfer.setData("text/plain", part);
    event.dataTransfer.effectAllowed = "move";
  };
  const dropPart = (event: DragEvent<HTMLButtonElement>, index: number) => {
    event.preventDefault();
    const part = event.dataTransfer.getData("text/plain") as typeof parts[number]["id"];
    if (parts.some((candidate) => candidate.id === part)) placePart(part, index);
  };

  return (
    <div className="lab-shell assembly-lab">
      <div className="lab-header">
        <div>
          <span className="mini-label">Drag-and-drop circuit</span>
          <h3>Complete the loop, then close the switch</h3>
        </div>
        <span className={`status-pill ${lit ? "up" : ""}`}>{lit ? "Current flowing" : complete ? "Switch is open" : "Circuit incomplete"}</span>
      </div>
      <p className="drag-instruction">Drag each component into an empty socket. On touch screens, tap a component and then tap a socket.</p>
      <div className="component-tray" aria-label="Circuit components">
        {parts.map((part) => (
          <button
            key={part.id}
            draggable
            onDragStart={(event) => startDrag(event, part.id)}
            onClick={() => setSelected(part.id)}
            className={selected === part.id ? "selected" : ""}
            aria-pressed={selected === part.id}
          >
            <b>{part.symbol}</b><span>{part.label}</span><small>drag me</small>
          </button>
        ))}
      </div>
      <div className={`assembly-board ${lit ? "powered" : ""}`}>
        <div className="assembly-wire" />
        {slots.map((partId, index) => {
          const part = parts.find((candidate) => candidate.id === partId);
          return (
            <button
              key={index}
              className={`drop-socket ${part ? "filled" : ""}`}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => dropPart(event, index)}
              onClick={() => selected ? placePart(selected, index) : part && setSlots((old) => old.map((value, i) => i === index ? null : value))}
              aria-label={part ? `${part.label} in socket ${index + 1}; click to remove` : `Empty circuit socket ${index + 1}`}
            >
              {part ? <><b>{part.symbol}</b><span>{part.label}</span></> : <><b>+</b><span>drop here</span></>}
            </button>
          );
        })}
        <div className={`assembly-bulb ${lit ? "on" : ""}`}><i /><span>{lit ? "LIGHT" : "OFF"}</span></div>
      </div>
      <div className="assembly-footer">
        <button disabled={!complete} onClick={() => setClosed(!closed)}>{closed ? "Open switch" : "Close switch"}</button>
        <button className="secondary-action" onClick={() => { setSlots([null, null, null]); setClosed(false); }}>Reset components</button>
        <p>{lit ? "A complete, closed conducting path allows charge to flow." : complete ? "All components are connected, but an open switch breaks the path." : "Current cannot flow until the circuit is a complete loop."}</p>
      </div>
    </div>
  );
}

function InductionDragLab() {
  const stageRef = useRef<HTMLDivElement>(null);
  const previousX = useRef(18);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [magnetX, setMagnetX] = useState(18);
  const [dragging, setDragging] = useState(false);
  const [brightness, setBrightness] = useState(0);
  const [direction, setDirection] = useState<"towards" | "away" | "still">("still");
  const [turns, setTurns] = useState(5);

  const moveMagnet = (next: number) => {
    const clamped = Math.max(7, Math.min(88, next));
    const delta = clamped - previousX.current;
    const proximity = Math.max(0, 1 - Math.abs(clamped - 68) / 32);
    const induced = Math.min(1, Math.abs(delta) * proximity * (turns / 5) * 0.3);
    setMagnetX(clamped);
    setBrightness(induced);
    setDirection(Math.abs(delta) < 0.08 ? "still" : delta > 0 ? "towards" : "away");
    previousX.current = clamped;
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
    fadeTimer.current = setTimeout(() => { setBrightness(0); setDirection("still"); }, 180);
  };
  const pointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (!dragging || !stageRef.current) return;
    const box = stageRef.current.getBoundingClientRect();
    moveMagnet(((event.clientX - box.left) / box.width) * 100);
  };
  const keyboardMove = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      moveMagnet(magnetX + (event.key === "ArrowRight" ? 5 : -5));
    }
  };

  useEffect(() => () => {
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
  }, []);

  return (
    <div className="lab-shell induction-drag-lab">
      <div className="lab-header">
        <div>
          <span className="mini-label">Drag-to-induce lab</span>
          <h3>Move the magnet. Watch the bulb.</h3>
        </div>
        <div className="induction-reading"><span>Induced current</span><b>{direction === "still" ? "0" : direction === "towards" ? "→" : "←"}</b></div>
      </div>
      <p className="drag-instruction">Drag the magnet quickly into and out of the coil. Hold it still inside the coil and observe what happens.</p>
      <div className="induction-stage" ref={stageRef}>
        <div className="motion-track"><span>move magnet</span><i>↔</i></div>
        <button
          className={`drag-magnet ${dragging ? "dragging" : ""}`}
          style={{ left: `${magnetX}%` }}
          onPointerDown={(event) => { setDragging(true); event.currentTarget.setPointerCapture(event.pointerId); }}
          onPointerMove={pointerMove}
          onPointerUp={(event) => { setDragging(false); event.currentTarget.releasePointerCapture(event.pointerId); }}
          onPointerCancel={() => setDragging(false)}
          onKeyDown={keyboardMove}
          aria-label="Draggable bar magnet. Use left and right arrow keys to move it."
        >
          <span>N</span><span>S</span>
        </button>
        <div className="induction-coil" style={{ "--turn-count": turns } as React.CSSProperties}>
          {Array.from({ length: turns }, (_, index) => <i key={index} style={{ left: `${index * (52 / Math.max(1, turns - 1))}%` }} />)}
          <span>COIL</span>
        </div>
        <div className="induction-wire" />
        <div className="induction-bulb" style={{ "--brightness": brightness } as React.CSSProperties}><i /><b>{brightness > .12 ? "ON" : "OFF"}</b></div>
      </div>
      <div className="induction-controls">
        <label>Coil turns <strong>{turns}</strong><input type="range" min="3" max="9" value={turns} onChange={(event) => setTurns(+event.target.value)} /></label>
        <div><span>Brightness</span><i><b style={{ width: `${brightness * 100}%` }} /></i></div>
        <p><b>{direction === "still" ? "No change in flux → no induced e.m.f." : direction === "towards" ? "Flux is increasing: current flows one way." : "Flux is decreasing: current reverses."}</b></p>
      </div>
    </div>
  );
}

function FuseDropLab() {
  const challenges = [
    { appliance: "Desk lamp", power: 460, current: 2, correct: 3 },
    { appliance: "Kettle", power: 920, current: 4, correct: 5 },
    { appliance: "Heater", power: 2300, current: 10, correct: 13 },
  ];
  const fuses = [3, 5, 13];
  const [challenge, setChallenge] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [dropped, setDropped] = useState<number | null>(null);
  const item = challenges[challenge];
  const correct = dropped === item.correct;

  const startDrag = (event: DragEvent<HTMLButtonElement>, rating: number) => {
    event.dataTransfer.setData("text/plain", String(rating));
    event.dataTransfer.effectAllowed = "copy";
  };
  const acceptFuse = (rating: number) => {
    if (fuses.includes(rating)) {
      setDropped(rating);
      setSelected(null);
    }
  };

  return (
    <div className="lab-shell fuse-lab">
      <div className="lab-header">
        <div><span className="mini-label">Fuse drop challenge</span><h3>Choose the smallest safe fuse</h3></div>
        <div className="challenge-tabs">{challenges.map((_, index) => <button key={index} className={challenge === index ? "active" : ""} onClick={() => { setChallenge(index); setDropped(null); }}>0{index + 1}</button>)}</div>
      </div>
      <p className="drag-instruction">At 230 V, the {item.appliance.toLowerCase()} uses {item.power} W, so its normal current is {item.power} ÷ 230 = <b>{item.current} A</b>. Drag the best fuse into the plug.</p>
      <div className="fuse-workbench">
        <div className="fuse-tray">
          {fuses.map((rating) => (
            <button key={rating} draggable onDragStart={(event) => startDrag(event, rating)} onClick={() => setSelected(rating)} className={selected === rating ? "selected" : ""}>
              <i /><b>{rating} A</b><span>FUSE</span>
            </button>
          ))}
        </div>
        <button
          className={`plug-drop ${dropped ? correct ? "correct" : "wrong" : ""}`}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => { event.preventDefault(); acceptFuse(+event.dataTransfer.getData("text/plain")); }}
          onClick={() => selected && acceptFuse(selected)}
        >
          <span>{item.appliance}</span>
          <i>{dropped ? `${dropped} A` : "drop fuse here"}</i>
          <b>230 V · {item.power} W</b>
        </button>
      </div>
      <div className={`fuse-feedback ${dropped ? correct ? "correct" : "wrong" : ""}`}>
        {!dropped ? "Pick a fuse rated just above the normal operating current." : correct ? `Correct: ${item.correct} A is the smallest rating above ${item.current} A.` : dropped < item.current ? `${dropped} A is too low and may melt during normal use.` : `${dropped} A is higher than necessary, so it gives poorer protection than the ${item.correct} A fuse.`}
      </div>
    </div>
  );
}

function MotorGeneratorLab() {
  const [mode, setMode] = useState<"motor" | "generator">("motor");
  const [level, setLevel] = useState(3);
  const [reversed, setReversed] = useState(false);
  const reading = mode === "motor" ? `${level * 180} rpm` : `${(level * 1.8).toFixed(1)} V`;
  return (
    <div className="lab-shell motor-lab">
      <div className="lab-header">
        <div>
          <span className="mini-label">Energy transfer lab</span>
          <h3>Motor or generator?</h3>
        </div>
        <div className="segmented">
          <button className={mode === "motor" ? "active" : ""} onClick={() => setMode("motor")}>Motor</button>
          <button className={mode === "generator" ? "active" : ""} onClick={() => setMode("generator")}>Generator</button>
        </div>
      </div>
      <div className="motor-stage">
        <div className="pole north">N</div>
        <div className="coil-wrap" style={{ "--speed": `${1.8 / level}s`, "--direction": reversed ? "reverse" : "normal" } as React.CSSProperties}>
          <div className="coil" />
          <div className="shaft" />
        </div>
        <div className="pole south">S</div>
        <div className={`energy-flow ${reversed ? "reverse" : ""}`}>
          <span>{mode === "motor" ? "electrical" : "kinetic"}</span><i>→</i><span>{mode === "motor" ? "kinetic" : "electrical"}</span>
        </div>
      </div>
      <div className="controls-grid">
        <label>
          {mode === "motor" ? "Current" : "Rotation speed"} <strong>Level {level}</strong>
          <input type="range" min="1" max="5" value={level} onChange={(e) => setLevel(+e.target.value)} />
        </label>
        <button className="action-button" onClick={() => setReversed(!reversed)}>Reverse {mode === "motor" ? "current" : "rotation"}</button>
        <div className="big-reading"><span>{mode === "motor" ? "Coil speed" : "Induced e.m.f."}</span><strong>{reading}</strong></div>
      </div>
      <p className="lab-note">
        {mode === "motor"
          ? "The motor effect: a current-carrying conductor in a magnetic field experiences a force. Reverse current → reverse force."
          : "Electromagnetic induction: changing magnetic flux through a conductor induces an e.m.f. Faster change → larger e.m.f."}
      </p>
    </div>
  );
}

function TransformerLab() {
  const [primary, setPrimary] = useState(200);
  const [secondary, setSecondary] = useState(600);
  const [input, setInput] = useState(12);
  const output = (input * secondary) / primary;
  const ratio = secondary / primary;
  return (
    <div className="lab-shell transformer-lab">
      <div className="lab-header">
        <div>
          <span className="mini-label">Transformer calculator</span>
          <h3>Turns ratio controls voltage</h3>
        </div>
        <span className={`status-pill ${ratio > 1 ? "up" : ratio < 1 ? "down" : ""}`}>
          {ratio > 1 ? "Step-up" : ratio < 1 ? "Step-down" : "1 : 1"}
        </span>
      </div>
      <div className="transformer-visual">
        <div className="coil-bank primary"><b>{primary}</b><span>primary turns</span></div>
        <div className="core"><i /><i /></div>
        <div className="coil-bank secondary"><b>{secondary}</b><span>secondary turns</span></div>
      </div>
      <div className="controls-grid three">
        <label>Primary turns <strong>{primary}</strong><input type="range" min="100" max="800" step="100" value={primary} onChange={(e) => setPrimary(+e.target.value)} /></label>
        <label>Secondary turns <strong>{secondary}</strong><input type="range" min="100" max="800" step="100" value={secondary} onChange={(e) => setSecondary(+e.target.value)} /></label>
        <label>Input voltage <strong>{input} V</strong><input type="range" min="6" max="240" step="6" value={input} onChange={(e) => setInput(+e.target.value)} /></label>
      </div>
      <div className="formula-strip">
        <span>V<sub>s</sub> / V<sub>p</sub> = N<sub>s</sub> / N<sub>p</sub></span>
        <b>{output.toFixed(1)} V output</b>
        <span>ratio {ratio.toFixed(2)} : 1</span>
      </div>
    </div>
  );
}

function QuickCheck({ statement, answer, explanation }: { statement: string; answer: boolean; explanation: string }) {
  const [choice, setChoice] = useState<boolean | null>(null);
  return (
    <div className="quick-check">
      <p>{statement}</p>
      <div>
        <button className={choice === true ? (answer ? "correct" : "wrong") : ""} onClick={() => setChoice(true)}>True</button>
        <button className={choice === false ? (!answer ? "correct" : "wrong") : ""} onClick={() => setChoice(false)}>False</button>
      </div>
      {choice !== null && <small className={choice === answer ? "correct-text" : "wrong-text"}>{choice === answer ? "Correct. " : "Not quite. "}{explanation}</small>}
    </div>
  );
}

export default function Home() {
  const progress = useScrollProgress();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [menuOpen, setMenuOpen] = useState(false);
  const score = useMemo(
    () => quizQuestions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0),
    [answers],
  );

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const saved = localStorage.getItem("igcse-electricity-progress");
      if (saved) {
        try { setAnswers(JSON.parse(saved)); } catch { /* ignore malformed local data */ }
      }
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    if (Object.keys(answers).length) localStorage.setItem("igcse-electricity-progress", JSON.stringify(answers));
  }, [answers]);

  return (
    <main>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <header className="topbar">
        <a href="#top" className="brand"><i>Φ</i><span>Field Notes<small>IGCSE Physics · Chapter 4</small></span></a>
        <nav aria-label="Lesson sections">
          {sections.slice(0, 5).map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>Contents</button>
      </header>
      {menuOpen && (
        <div className="mobile-menu">
          {sections.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
        </div>
      )}

      <section className="hero" id="top">
        <div className="hero-copy">
          <span className="eyebrow">Cambridge IGCSE Physics 0625 · 2026–2028</span>
          <h1>Electricity is a flow.<br /><em>Magnetism gives it direction.</em></h1>
          <p>Chapter 4 rebuilt as a field guide: manipulate the models, explain the patterns, then answer like an examiner is marking.</p>
          <div className="hero-actions">
            <a href="#overview" className="primary-button">Begin the fieldwork <span>↓</span></a>
            <span className="time-note"><b>45–70 min</b> interactive lesson</span>
          </div>
        </div>
        <div className="hero-visual" aria-label="Animated electric and magnetic field illustration">
          <div className="orbital ring-one"><i /><i /><i /></div>
          <div className="orbital ring-two"><i /><i /></div>
          <div className="field-core"><span>N</span><b>Φ</b><span>S</span></div>
          <p>field + charge + motion</p>
        </div>
      </section>

      <section className="lesson-section intro-section" id="overview">
        <div className="section-heading">
          <span className="section-number">01</span>
          <div><span className="eyebrow">Route map</span><h2>Six ideas. One connected story.</h2><p>The current syllabus moves from fields to quantities, circuits, safety, digital electronics and electromagnetic effects.</p></div>
        </div>
        <div className="syllabus-grid">
          {[
            ["4.1", "Magnetism", "Fields, poles, induced magnetism, permanent and temporary magnets"],
            ["4.2", "Electrical quantities", "Charge, current, e.m.f., p.d., resistance and electrical energy"],
            ["4.3", "Circuits", "Symbols, series and parallel networks, I–V behaviour and potential dividers"],
            ["4.4", "Digital electronics", "Logic states, gates and truth tables (Supplement)"],
            ["4.5", "Electrical safety", "Hazards, insulation, earthing, fuses and circuit breakers"],
            ["4.6", "Electromagnetic effects", "Induction, a.c. generators, transformers and the motor effect"],
          ].map(([n, title, copy]) => (
            <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
        <div className="core-supplement">
          <div><b>CORE</b><span>Secure the physical story and standard calculations.</span></div>
          <div><b>SUPPLEMENT</b><span>Extend to field interactions, potential dividers, induction and transformer power.</span></div>
        </div>
      </section>

      <section className="lesson-section" id="magnetism">
        <div className="section-heading">
          <span className="section-number">02</span>
          <div><span className="eyebrow">4.1 · simple phenomena of magnetism</span><h2>A field is not a drawing. It is a region of force.</h2><p>Field lines are a model: their direction shows the force on a north pole; their spacing represents relative strength.</p></div>
        </div>
        <div className="concept-grid">
          <article><span className="concept-symbol">N ↔ S</span><h3>Unlike poles attract</h3><p>Like poles repel. Magnetic materials can be attracted without already being magnets.</p></article>
          <article><span className="concept-symbol">Fe</span><h3>Induced magnetism</h3><p>A magnetic material becomes magnetised in a field. Soft iron loses this magnetism readily; steel tends to retain it.</p></article>
          <article><span className="concept-symbol">→ B</span><h3>Direction matters</h3><p>At any point, the field direction is the direction of force on a north pole.</p></article>
        </div>
        <FieldLab />
        <div className="micro-checks">
          <QuickCheck statement="Magnetic field lines cross when two magnets interact." answer={false} explanation="A point cannot have two magnetic field directions, so field lines never cross." />
          <QuickCheck statement="A closer field-line pattern represents a stronger magnetic field." answer={true} explanation="Line density is used to represent relative field strength." />
        </div>
      </section>

      <section className="lesson-section dark-section" id="circuits">
        <div className="section-heading">
          <span className="section-number">03</span>
          <div><span className="eyebrow">4.2–4.3 · quantities and circuits</span><h2>Three questions unlock most circuit problems.</h2><p>What stays the same? What splits? What adds?</p></div>
        </div>
        <div className="formula-grid">
          <article><span>charge flow</span><b>I = Q / t</b><p>current = charge per unit time</p></article>
          <article><span>resistance</span><b>R = V / I</b><p>opposition to current</p></article>
          <article><span>electrical power</span><b>P = IV</b><p>energy transferred each second</p></article>
          <article><span>electrical energy</span><b>E = IVt</b><p>or E = Pt</p></article>
        </div>
        <CircuitLab />
        <CircuitAssemblyLab />
        <div className="examiner-lens">
          <span>EXAMINER’S LENS</span>
          <p><b>Never write “current is used up”.</b> Charge is conserved. Components transfer energy; the current entering a component equals the current leaving it in steady state.</p>
        </div>
        <div className="iv-cards">
          <article><div className="mini-graph ohmic"><i /></div><h3>Fixed resistor</h3><p>Straight line through the origin at constant temperature: current is proportional to p.d.</p></article>
          <article><div className="mini-graph filament"><i /></div><h3>Filament lamp</h3><p>As temperature rises, resistance increases; the graph becomes less steep.</p></article>
          <article><div className="mini-graph diode"><i /></div><h3>Diode</h3><p>Current passes mainly in one direction after the forward threshold is reached.</p></article>
        </div>
      </section>

      <section className="lesson-section" id="effects">
        <div className="section-heading">
          <span className="section-number">04</span>
          <div><span className="eyebrow">4.6 · electromagnetic effects</span><h2>One relationship, run in two directions.</h2><p>Current can produce motion; motion through a magnetic field can produce an e.m.f.</p></div>
        </div>
        <InductionDragLab />
        <MotorGeneratorLab />
        <div className="rules-grid">
          <article><span>01</span><h3>Motor effect</h3><p>Field + current → force. Use Fleming’s left-hand rule for field, current and force.</p></article>
          <article><span>02</span><h3>Induction</h3><p>Changing flux linkage → induced e.m.f. The induced effect opposes the change that produces it.</p></article>
          <article><span>03</span><h3>a.c. generator</h3><p>A rotating coil changes its flux linkage repeatedly, so the induced e.m.f. reverses every half-turn.</p></article>
        </div>
        <TransformerLab />
        <div className="examiner-lens light">
          <span>WHY HIGH VOLTAGE?</span>
          <p>For the same transmitted power, a higher voltage means a lower current. Since cable heating is proportional to <b>I²R</b>, a lower current greatly reduces energy loss.</p>
        </div>
      </section>

      <section className="lesson-section safety-section" id="safety">
        <div className="section-heading">
          <span className="section-number">05</span>
          <div><span className="eyebrow">4.4–4.5 · logic and safety</span><h2>Protection works by controlling the path.</h2><p>Electric shock needs current through the body. Good design prevents contact, provides a safer path, or disconnects the supply quickly.</p></div>
        </div>
        <div className="safety-flow">
          <article><span>fault</span><b>Live wire touches metal case</b></article>
          <i>→</i>
          <article><span>response</span><b>Large current flows to earth</b></article>
          <i>→</i>
          <article><span>protection</span><b>Fuse melts / breaker opens</b></article>
          <i>→</i>
          <article><span>result</span><b>Live supply is disconnected</b></article>
        </div>
        <div className="safety-grid">
          <article><b>Double insulation</b><p>Two layers of insulation; no exposed metal case. An earth wire is not required.</p></article>
          <article><b>Fuse</b><p>A thin wire melts when current exceeds its rating. It must be replaced after operating.</p></article>
          <article><b>Circuit breaker</b><p>An electromagnetic device opens the circuit and can be reset.</p></article>
          <article><b>Logic gates</b><p>AND needs both inputs high; OR needs at least one; NOT reverses the state. Supplement content.</p></article>
        </div>
        <FuseDropLab />
        <div className="micro-checks">
          <QuickCheck statement="The earth wire normally carries the operating current." answer={false} explanation="It normally carries no current; it provides a low-resistance path only during a fault." />
          <QuickCheck statement="A 5 A fuse is suitable for an appliance that normally draws 3.2 A." answer={true} explanation="Choose a rating just above the normal current, so normal operation is allowed but excessive current breaks the circuit." />
        </div>
      </section>

      <section className="lesson-section practice-section" id="practice">
        <div className="section-heading">
          <span className="section-number">06</span>
          <div><span className="eyebrow">Past-paper patterns · original questions</span><h2>Write for the mark scheme.</h2><p>These original questions mirror recurring Cambridge-style demands without reproducing copyrighted past-paper wording.</p></div>
        </div>
        <div className="exam-list">
          {examQuestions.map((item, index) => (
            <article className="exam-card" key={item.tag}>
              <div className="exam-meta"><span>{item.tag}</span><b>[{item.marks} marks]</b></div>
              <p>{item.question}</p>
              <textarea aria-label={`Answer for question ${index + 1}`} placeholder="Plan your answer here…" />
              <button onClick={() => setRevealed((old) => ({ ...old, [index]: !old[index] }))}>
                {revealed[index] ? "Hide mark points" : "Reveal mark points"}
              </button>
              {revealed[index] && <ol>{item.scheme.map((point) => <li key={point}>{point}</li>)}</ol>}
            </article>
          ))}
        </div>
        <div className="exam-strategy">
          <span>CALCULATE</span><b>formula → substitution → answer + unit</b>
          <span>EXPLAIN</span><b>cause → physics principle → consequence</b>
          <span>DESCRIBE</span><b>state the visible trend; do not explain unless asked</b>
        </div>
      </section>

      <section className="lesson-section mindmap-section" id="mindmap">
        <div className="section-heading">
          <span className="section-number">07</span>
          <div><span className="eyebrow">Retrieval map</span><h2>Zoom out. Rebuild the chapter.</h2><p>Start at the centre and explain each connection aloud without looking back.</p></div>
        </div>
        <div className="mindmap">
          <div className="mind-centre"><span>CHAPTER 4</span><b>Electricity<br />& Magnetism</b></div>
          <article className="branch b1"><span>Fields</span><p>poles · field lines · induced magnetism · electromagnets</p></article>
          <article className="branch b2"><span>Quantities</span><p>Q · I · V · R · P · E</p></article>
          <article className="branch b3"><span>Circuits</span><p>series · parallel · I–V graphs · potential dividers</p></article>
          <article className="branch b4"><span>Safety</span><p>insulation · earth · fuse · circuit breaker</p></article>
          <article className="branch b5"><span>Induction</span><p>flux change · generator · transformer · transmission</p></article>
          <article className="branch b6"><span>Motor effect</span><p>field + current → force · d.c. motor</p></article>
        </div>
      </section>

      <section className="lesson-section quiz-section" id="quiz">
        <div className="section-heading">
          <span className="section-number">08</span>
          <div><span className="eyebrow">Final checkpoint</span><h2>Can you switch from seeing to explaining?</h2><p>Your answers are saved on this device. Aim for 5/6 before moving on.</p></div>
        </div>
        <div className="score-card">
          <div><span>Current score</span><b>{score}<small>/6</small></b></div>
          <div className="score-track"><i style={{ width: `${(score / 6) * 100}%` }} /></div>
          <span>{score >= 5 ? "Exam-ready" : Object.keys(answers).length === 6 ? "Review the feedback, then retry." : "Complete all six questions."}</span>
        </div>
        <div className="quiz-list">
          {quizQuestions.map((question, index) => (
            <article key={question.question}>
              <span>Q{index + 1}</span>
              <h3>{question.question}</h3>
              <div className="quiz-options">
                {question.options.map((option, optionIndex) => {
                  const selected = answers[index] === optionIndex;
                  const answered = answers[index] !== undefined;
                  const state = selected ? (optionIndex === question.answer ? "correct" : "wrong") : answered && optionIndex === question.answer ? "correct ghost" : "";
                  return <button className={state} key={option} onClick={() => setAnswers((old) => ({ ...old, [index]: optionIndex }))}>{option}</button>;
                })}
              </div>
              {answers[index] !== undefined && <p className="quiz-why">{question.why}</p>}
            </article>
          ))}
        </div>
        <button className="reset-button" onClick={() => { setAnswers({}); localStorage.removeItem("igcse-electricity-progress"); }}>Reset checkpoint</button>
      </section>

      <footer>
        <div><i>Φ</i><b>Field Notes</b><span>Interactive teaching material for Cambridge IGCSE Physics 0625</span></div>
        <p>Aligned to the 2026–2028 syllabus. Independent educational resource; not endorsed by Cambridge International Education.</p>
      </footer>
    </main>
  );
}
