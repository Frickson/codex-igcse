"use client";

import { useEffect, useMemo, useRef, useState, type DragEvent, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent } from "react";
import ChapterNav from "../ChapterNav";
import AcademyMoment from "../AcademyMoment";
import FlemingRulesLab from "./labs/FlemingRulesLab";

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
          <button className={mode === "bar" ? "active" : ""} aria-pressed={mode === "bar"} onClick={() => setMode("bar")}>Bar magnet</button>
          <button className={mode === "coil" ? "active" : ""} aria-pressed={mode === "coil"} onClick={() => setMode("coil")}>Electromagnet</button>
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

function ElectrostaticLab() {
  const [material, setMaterial] = useState<"insulator" | "conductor">("insulator");
  const [rubs, setRubs] = useState(0);
  const [nearPaper, setNearPaper] = useState(false);
  const [rubbing, setRubbing] = useState(false);
  const charge = material === "insulator" ? Math.min(rubs, 6) : 0;
  const attracted = nearPaper && charge > 0;

  const rubWithCloth = () => {
    if (rubbing) return;
    setNearPaper(false);
    setRubbing(true);
    setRubs((value) => Math.min(6, value + 1));
    window.setTimeout(() => setRubbing(false), 900);
  };

  return (
    <div className="lab-shell electrostatic-lab">
      <div className="lab-header">
        <div><span className="mini-label">4.2.1 · electrostatics laboratory</span><h3>Transfer electrons, then test the charge</h3></div>
        <div className="segmented" aria-label="Choose rod material">
          <button className={material === "insulator" ? "active" : ""} aria-pressed={material === "insulator"} onClick={() => { setMaterial("insulator"); setRubs(0); }}>Plastic</button>
          <button className={material === "conductor" ? "active" : ""} aria-pressed={material === "conductor"} onClick={() => { setMaterial("conductor"); setRubs(0); }}>Metal in hand</button>
        </div>
      </div>
      <div className={`static-stage ${nearPaper ? "testing" : ""} ${attracted ? "attracting" : ""} ${rubbing ? "rubbing" : ""}`} data-charge={charge} data-attracted={attracted}>
        <div className="cloth"><span>cloth</span><i /></div>
        {rubbing && <div className="electron-transfer" aria-label="Electrons transferring from the cloth to the rod">{Array.from({ length: 3 }, (_, index) => <i key={index}>−</i>)}</div>}
        <div className={`charged-rod ${charge ? "charged" : ""}`}>
          {Array.from({ length: charge }, (_, index) => <i key={index}>−</i>)}
          <b>{material === "insulator" ? "plastic rod" : "metal rod"}</b>
        </div>
        <div className="paper-bits">{Array.from({ length: 6 }, (_, index) => <i key={index} />)}<span>paper</span></div>
      </div>
      <div className="lab-action-row">
        <button onClick={rubWithCloth} disabled={rubbing}>{rubbing ? "Transferring electrons…" : "Rub with cloth"}</button>
        <button onClick={() => setNearPaper((value) => !value)}>{nearPaper ? "Move rod away" : "Move near paper"}</button>
        <button className="secondary-action" onClick={() => { setRubs(0); setNearPaper(false); }}>Reset</button>
      </div>
      <p className="lab-note" aria-live="polite">
        {rubbing ? "Electrons are moving from the cloth onto the rod…" : null}
        {!rubbing && " "}
        {material === "conductor"
          ? rubs > 0
            ? "Rubbing can transfer electrons, but the metal is held in your hand, so the charge immediately flows through your body to Earth. The rod stays neutral and the paper stays still."
            : nearPaper
              ? "The neutral metal rod is close to the paper, but there is no electrostatic attraction because it has not retained any charge."
              : "The metal is held in your hand. Try rubbing it, then observe why it cannot retain charge."
          : charge === 0
            ? nearPaper
              ? "The neutral plastic rod is close to the paper, but the paper stays still. Rub the rod first to transfer electrons."
              : "Rub the plastic rod. Charging by friction transfers electrons; positive charge does not move between the solids."
            : nearPaper
              ? "The charged rod polarises the neutral paper, producing attraction. The rod gained electrons and is negatively charged."
              : `${charge} excess-electron markers are trapped on the insulating rod. Move it near the paper to detect the charge.`}
      </p>
    </div>
  );
}

function ElectricFieldLab() {
  const [mode, setMode] = useState<"point" | "sphere" | "plates">("point");
  const [sourceSign, setSourceSign] = useState<1 | -1>(1);
  const [x, setX] = useState(72);
  const [y, setY] = useState(35);
  const [dragging, setDragging] = useState(false);
  const [stageSize, setStageSize] = useState({ width: 600, height: 330 });
  const stageRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const rect = stage.getBoundingClientRect();
      setStageSize({ width: rect.width, height: rect.height });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const dx = x - 50;
  const dy = y - 50;
  const dxPixels = dx * stageSize.width / 100;
  const dyPixels = dy * stageSize.height / 100;
  const distanceFromCentre = Math.hypot(dxPixels, dyPixels);
  const onPointCharge = mode === "point" && distanceFromCentre <= 31;
  const insideSphere = mode === "sphere" && distanceFromCentre < 55;
  const betweenPlates = mode === "plates"
    && x * stageSize.width / 100 > stageSize.width * 0.1 + 42
    && x * stageSize.width / 100 < stageSize.width * 0.9 - 42
    && y >= 9
    && y <= 91;
  const hasFieldDirection = mode === "point" ? !onPointCharge : mode === "sphere" ? !insideSphere : betweenPlates;
  const radialAngle = Math.atan2(dyPixels, dxPixels) * 180 / Math.PI;
  const angle = mode === "plates" ? 0 : radialAngle + (sourceSign === -1 ? 180 : 0);
  const fieldLabel = mode === "point"
    ? onPointCharge
      ? "The field is not defined at the position of the source charge. Drag the test charge away from it."
      : `The positive test charge is pushed ${sourceSign === 1 ? "away from" : "towards"} the ${sourceSign === 1 ? "positive" : "negative"} point charge.`
    : mode === "sphere"
      ? insideSphere
        ? "E = 0 inside a charged conductor in electrostatic equilibrium, so there is no force arrow."
        : `Outside the conducting sphere, the field is radial and points ${sourceSign === 1 ? "away from" : "towards"} it.`
      : betweenPlates
        ? "Between the plates, the uniform field points from the positive plate to the negative plate."
        : "Outside the region between the plates, this IGCSE model does not show a field: end effects are not examined.";

  const moveCharge = (clientX: number, clientY: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    setX(Math.max(4, Math.min(96, (clientX - rect.left) / rect.width * 100)));
    setY(Math.max(6, Math.min(94, (clientY - rect.top) / rect.height * 100)));
  };
  const startDrag = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    draggingRef.current = true;
    setDragging(true);
    moveCharge(event.clientX, event.clientY);
  };
  const dragCharge = (event: PointerEvent<HTMLButtonElement>) => {
    if (draggingRef.current) moveCharge(event.clientX, event.clientY);
  };
  const stopDrag = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    draggingRef.current = false;
    setDragging(false);
  };
  const nudgeCharge = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const step = event.shiftKey ? 5 : 2;
    if (event.key === "ArrowLeft") setX((value) => Math.max(4, value - step));
    else if (event.key === "ArrowRight") setX((value) => Math.min(96, value + step));
    else if (event.key === "ArrowUp") setY((value) => Math.max(6, value - step));
    else if (event.key === "ArrowDown") setY((value) => Math.min(94, value + step));
    else return;
    event.preventDefault();
  };
  const chooseMode = (nextMode: "point" | "sphere" | "plates") => {
    setMode(nextMode);
    setX(nextMode === "plates" ? 50 : 72);
    setY(nextMode === "plates" ? 30 : 35);
  };

  return (
    <div className="lab-shell electric-field-lab">
      <div className="lab-header">
        <div><span className="mini-label">4.2.1 · electric-field mapper · Supplement</span><h3>Drag the positive test charge through the field</h3></div>
        <div className="segmented" aria-label="Choose electric field">
          <button className={mode === "point" ? "active" : ""} aria-pressed={mode === "point"} onClick={() => chooseMode("point")}>Point charge</button>
          <button className={mode === "sphere" ? "active" : ""} aria-pressed={mode === "sphere"} onClick={() => chooseMode("sphere")}>Sphere</button>
          <button className={mode === "plates" ? "active" : ""} aria-pressed={mode === "plates"} onClick={() => chooseMode("plates")}>Plates</button>
        </div>
      </div>
      {mode !== "plates" && (
        <div className="charge-sign-controls" aria-label="Choose source charge">
          <span>Source charge</span>
          <button className={sourceSign === 1 ? "active" : ""} aria-pressed={sourceSign === 1} onClick={() => setSourceSign(1)}>Positive +</button>
          <button className={sourceSign === -1 ? "active" : ""} aria-pressed={sourceSign === -1} onClick={() => setSourceSign(-1)}>Negative −</button>
        </div>
      )}
      <div ref={stageRef} className={`electric-field-stage ${mode}`}>
        <div className="field-source">{mode === "plates" ? <><i>+</i><i>−</i></> : <b>{sourceSign === 1 ? "+" : "−"}</b>}</div>
        <svg viewBox="0 0 100 60" aria-hidden="true">
          <defs>
            <marker id="electric-field-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" />
            </marker>
          </defs>
          {mode === "plates"
            ? [10, 20, 30, 40, 50].map((line) => <path key={line} d={`M 18 ${line} L 82 ${line}`} />)
            : [0, 45, 90, 135, 180, 225, 270, 315].map((degree) => {
                const radians = degree * Math.PI / 180;
                const inner = mode === "sphere" ? 13 : 8;
                const start = `${50 + Math.cos(radians) * inner} ${30 + Math.sin(radians) * inner}`;
                const end = `${50 + Math.cos(radians) * 30} ${30 + Math.sin(radians) * 24}`;
                return <path key={degree} d={sourceSign === 1 ? `M ${start} L ${end}` : `M ${end} L ${start}`} />;
              })}
        </svg>
        <span className="field-drag-hint">Drag + or use arrow keys</span>
        <button
          type="button"
          className={`test-charge ${dragging ? "dragging" : ""} ${hasFieldDirection ? "" : "no-field"}`}
          style={{ left: `${x}%`, top: `${y}%` }}
          aria-label="Positive test charge. Drag it around the field, or use the arrow keys."
          onPointerDown={startDrag}
          onPointerMove={dragCharge}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onKeyDown={nudgeCharge}
        >
          <b>+</b><i style={{ transform: `rotate(${angle}deg)` }}>→</i>
        </button>
      </div>
      <div className={`field-readout ${hasFieldDirection ? "" : "zero-field"}`} aria-live="polite">
        <p><b>{hasFieldDirection ? "Force direction:" : "Model boundary:"}</b> {fieldLabel}</p>
        <small>Electric-field direction is defined as the direction of force on a positive test charge.</small>
      </div>
    </div>
  );
}

function MeterPlacementLab() {
  const meters = [{ id: "ammeter", label: "A", name: "ammeter" }, { id: "voltmeter", label: "V", name: "voltmeter" }] as const;
  type MeterId = typeof meters[number]["id"];
  const [seriesMeter, setSeriesMeter] = useState<MeterId | null>(null);
  const [parallelMeter, setParallelMeter] = useState<MeterId | null>(null);
  const [selected, setSelected] = useState<MeterId | null>(null);
  const correct = seriesMeter === "ammeter" && parallelMeter === "voltmeter";

  const place = (meter: MeterId, slot: "series" | "parallel") => {
    if (slot === "series") {
      setSeriesMeter(meter);
      if (parallelMeter === meter) setParallelMeter(null);
    } else {
      setParallelMeter(meter);
      if (seriesMeter === meter) setSeriesMeter(null);
    }
    setSelected(null);
  };
  const drop = (event: DragEvent<HTMLButtonElement>, slot: "series" | "parallel") => {
    event.preventDefault();
    const meter = event.dataTransfer.getData("text/plain") as MeterId;
    if (meters.some((candidate) => candidate.id === meter)) place(meter, slot);
  };

  return (
    <div className="lab-shell meter-lab">
      <div className="lab-header">
        <div><span className="mini-label">4.2.2–4.2.3 · meter challenge</span><h3>Measure current and potential difference correctly</h3></div>
        <span className={`status-pill ${correct ? "up" : ""}`}>{correct ? "Circuit ready" : "Place both meters"}</span>
      </div>
      <div className="meter-tray">
        {meters.map((meter) => <button key={meter.id} draggable onDragStart={(event) => event.dataTransfer.setData("text/plain", meter.id)} onClick={() => setSelected(meter.id)} className={selected === meter.id ? "selected" : ""} aria-pressed={selected === meter.id}><b>{meter.label}</b><span>{meter.name}</span></button>)}
      </div>
      <div className="meter-circuit">
        <div className="meter-wire" />
        <div className="meter-lamp">⊗<span>lamp</span></div>
        <button onDragOver={(event) => event.preventDefault()} onDrop={(event) => drop(event, "series")} onClick={() => selected && place(selected, "series")} className="meter-slot series-slot">
          {seriesMeter ? <><b>{seriesMeter === "ammeter" ? "A" : "V"}</b><span>in series</span></> : <><b>?</b><span>series position</span></>}
        </button>
        <button onDragOver={(event) => event.preventDefault()} onDrop={(event) => drop(event, "parallel")} onClick={() => selected && place(selected, "parallel")} className="meter-slot parallel-slot">
          {parallelMeter ? <><b>{parallelMeter === "ammeter" ? "A" : "V"}</b><span>across lamp</span></> : <><b>?</b><span>parallel position</span></>}
        </button>
      </div>
      <p className={`lab-note ${seriesMeter && parallelMeter ? correct ? "success-note" : "error-note" : ""}`}>
        {!seriesMeter || !parallelMeter ? "Drag or tap each meter, then place one in each position." : correct ? "Correct: an ammeter measures charge flow in series; a voltmeter measures p.d. across a component in parallel." : "Try again: a voltmeter has very high resistance, while an ammeter must carry the circuit current."}
      </p>
    </div>
  );
}

function IVGraphLab() {
  const [component, setComponent] = useState<"resistor" | "lamp" | "diode">("resistor");
  const [voltage, setVoltage] = useState(3);
  const currentFor = (v: number) => component === "resistor" ? v / 3 : component === "lamp" ? Math.sign(v) * Math.sqrt(Math.abs(v)) * 0.65 : v > 0.7 ? (v - 0.7) * 0.72 : v < 0 ? -0.03 : 0;
  const current = currentFor(voltage);
  const points = Array.from({ length: 49 }, (_, index) => {
    const v = -6 + index * 0.25;
    const i = currentFor(v);
    return `${50 + v * 6.6},${50 - i * 14}`;
  }).join(" ");

  return (
    <div className="lab-shell iv-lab">
      <div className="lab-header">
        <div><span className="mini-label">4.2.4 · current–voltage practical · Supplement</span><h3>Trace an I–V characteristic</h3></div>
        <div className="segmented" aria-label="Choose component">
          <button className={component === "resistor" ? "active" : ""} aria-pressed={component === "resistor"} onClick={() => setComponent("resistor")}>Resistor</button>
          <button className={component === "lamp" ? "active" : ""} aria-pressed={component === "lamp"} onClick={() => setComponent("lamp")}>Lamp</button>
          <button className={component === "diode" ? "active" : ""} aria-pressed={component === "diode"} onClick={() => setComponent("diode")}>Diode</button>
        </div>
      </div>
      <div className="iv-workbench">
        <svg viewBox="0 0 100 100" role="img" aria-label={`Current-voltage graph for a ${component}`}>
          <path className="axis" d="M 8 50 L 94 50 M 50 8 L 50 92" />
          <text x="91" y="47">V</text><text x="53" y="12">I</text>
          <polyline points={points} />
          <circle cx={50 + voltage * 6.6} cy={50 - current * 14} r="2.6" />
        </svg>
        <div>
          <label>Supply p.d. <strong>{voltage.toFixed(1)} V</strong><input type="range" min="-6" max="6" step="0.5" value={voltage} onChange={(event) => setVoltage(+event.target.value)} /></label>
          <div className="iv-readings"><span>Voltmeter <b>{voltage.toFixed(1)} V</b></span><span>Ammeter <b>{current.toFixed(2)} A</b></span></div>
          <p>{component === "resistor" ? "Straight line through the origin: resistance is constant." : component === "lamp" ? "The filament heats as current increases, so resistance increases and the graph becomes less steep." : "The diode conducts significantly in the forward direction only after its threshold."}</p>
        </div>
      </div>
    </div>
  );
}

function ComponentBoardLab() {
  const components = [
    { id: "cell", symbol: "— | ‖ —", name: "Cell", behavior: "Provides e.m.f. and transfers energy to the circuit." },
    { id: "resistor", symbol: "— ▭ —", name: "Resistor", behavior: "Limits current; it protects an LED from excessive current." },
    { id: "ldr", symbol: "↘ (▭)", name: "LDR", behavior: "Its resistance decreases as light intensity increases." },
    { id: "ntc", symbol: "ϑ (▭)", name: "NTC thermistor", behavior: "Its resistance decreases as temperature increases." },
    { id: "lamp", symbol: "— ⊗ —", name: "Lamp", behavior: "Transfers electrical energy by heating and light." },
    { id: "switch", symbol: "— / —", name: "Open switch", behavior: "Breaks the conducting path, so there is no current." },
    { id: "led", symbol: "— ▷| ⇗", name: "LED", behavior: "Emits light when forward biased; it is a diode." },
  ] as const;
  type ComponentId = typeof components[number]["id"];
  const challenges = [
    {
      id: "temperature",
      label: "Temperature indicator",
      task: "Build a series circuit whose lamp becomes brighter as the NTC thermistor gets warmer.",
      expected: { source: "cell", control: "ntc", output: "lamp" },
      explanation: "Correct. Warming the NTC thermistor lowers its resistance. Total resistance falls, so current increases and the series lamp becomes brighter.",
    },
    {
      id: "light",
      label: "Light-level indicator",
      task: "Build a series circuit whose lamp becomes brighter when more light reaches the LDR.",
      expected: { source: "cell", control: "ldr", output: "lamp" },
      explanation: "Correct. More light lowers the LDR resistance. Total resistance falls, so current and lamp brightness increase.",
    },
    {
      id: "led",
      label: "Protected LED",
      task: "Build a forward-biased LED circuit with a component that limits the current.",
      expected: { source: "cell", control: "resistor", output: "led" },
      explanation: "Correct. The cell supplies energy, the series resistor limits current and the forward-biased LED emits light.",
    },
  ] as const satisfies ReadonlyArray<{
    id: string;
    label: string;
    task: string;
    expected: Record<"source" | "control" | "output", ComponentId>;
    explanation: string;
  }>;
  type SlotId = keyof typeof challenges[number]["expected"];
  type ChallengeId = typeof challenges[number]["id"];
  const slotLabels: Record<SlotId, string> = { source: "Energy source", control: "Series control", output: "Output" };
  const [challengeId, setChallengeId] = useState<ChallengeId>("temperature");
  const [slots, setSlots] = useState<Record<SlotId, ComponentId | null>>({ source: null, control: null, output: null });
  const [selected, setSelected] = useState<ComponentId | null>(null);
  const challenge = challenges.find((item) => item.id === challengeId) ?? challenges[0];
  const complete = Object.values(slots).every(Boolean);
  const correct = complete && (Object.keys(slots) as SlotId[]).every((slot) => slots[slot] === challenge.expected[slot]);
  const hasComponents = Object.values(slots).some(Boolean);
  const place = (id: ComponentId, slot: SlotId) => {
    setSlots((old) => {
      const moved = Object.fromEntries(
        (Object.entries(old) as [SlotId, ComponentId | null][]).map(([key, value]) => [key, value === id ? null : value]),
      ) as Record<SlotId, ComponentId | null>;
      return { ...moved, [slot]: id };
    });
    setSelected(null);
  };
  const remove = (slot: SlotId) => setSlots((old) => ({ ...old, [slot]: null }));
  const clearBoard = () => {
    setSlots({ source: null, control: null, output: null });
    setSelected(null);
  };
  const chooseChallenge = (id: ChallengeId) => {
    setChallengeId(id);
    clearBoard();
  };
  const drop = (event: DragEvent<HTMLButtonElement>, slot: SlotId) => {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain") as ComponentId;
    if (components.some((item) => item.id === id)) place(id, slot);
  };
  const feedback = !complete
    ? "Complete all three gaps to make one unbroken series loop. Drag a symbol, or tap it and then tap a gap."
    : correct
      ? challenge.explanation
      : `Not yet. For this challenge use: ${(["source", "control", "output"] as SlotId[]).map((slot) => components.find((item) => item.id === challenge.expected[slot])?.name).join(" → ")}.`;

  return (
    <div className="lab-shell component-board-lab">
      <div className="lab-header">
        <div><span className="mini-label">4.3.1 · circuit-symbol builder</span><h3>Build a complete circuit for the challenge</h3></div>
        <span className={`status-pill ${correct ? "up" : ""}`}>{correct ? "Circuit correct" : complete ? "Check the symbols" : "Build the loop"}</span>
      </div>
      <div className="segmented symbol-challenges" aria-label="Choose circuit challenge">
        {challenges.map((item) => <button key={item.id} className={challengeId === item.id ? "active" : ""} aria-pressed={challengeId === item.id} onClick={() => chooseChallenge(item.id)}>{item.label}</button>)}
      </div>
      <p className="symbol-task"><b>Challenge:</b> {challenge.task}</p>
      <div className="symbol-tray">
        {components.map((item) => {
          const used = Object.values(slots).includes(item.id);
          return (
            <button
              key={item.id}
              draggable
              onDragStart={(event) => event.dataTransfer.setData("text/plain", item.id)}
              onClick={() => setSelected(item.id)}
              className={`${selected === item.id ? "selected" : ""} ${used ? "used" : ""}`}
              aria-pressed={selected === item.id}
            >
              <b>{item.symbol}</b><span>{item.name}</span><small>{item.behavior}</small>
            </button>
          );
        })}
      </div>
      <div className={`circuit-symbol-loop ${correct ? "complete" : ""}`}>
        <div className="design-slots">
        {(["source", "control", "output"] as SlotId[]).map((slot) => {
          const item = components.find((candidate) => candidate.id === slots[slot]);
          const expected = item?.id === challenge.expected[slot];
          return (
            <button
              key={slot}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => drop(event, slot)}
              onClick={() => selected ? place(selected, slot) : item && remove(slot)}
              className={`${item ? "filled" : ""} ${complete && !expected ? "incorrect" : ""}`}
              aria-label={item ? `${slotLabels[slot]}: ${item.name}. Tap to remove or select another symbol to replace it.` : `${slotLabels[slot]}: empty. Select or drag a symbol here.`}
            >
              <span>{slotLabels[slot]}</span>
              <b>{item ? item.symbol : "+"}</b>
              <small>{item ? `${item.name} · tap to remove` : "Drop or tap to place"}</small>
            </button>
          );
        })}
        </div>
        <div className="circuit-flow" aria-hidden="true"><span>conventional current</span><b>→</b></div>
      </div>
      <div className="symbol-board-actions">
        <button className="secondary-action" onClick={clearBoard} disabled={!hasComponents}>Remove all</button>
        <span>Tap any placed symbol to remove it individually.</span>
      </div>
      <p className={`lab-note ${complete ? correct ? "success-note" : "error-note" : ""}`}>{feedback}</p>
    </div>
  );
}

function PotentialDividerLab() {
  const [input, setInput] = useState(12);
  const [r1, setR1] = useState(4);
  const [r2, setR2] = useState(8);
  const output = input * r2 / (r1 + r2);
  return (
    <div className="lab-shell divider-lab">
      <div className="lab-header">
        <div><span className="mini-label">4.3.3 · potential divider · Supplement</span><h3>Share the supply potential difference</h3></div>
        <div className="big-reading"><span>Output p.d.</span><strong>{output.toFixed(1)} V</strong></div>
      </div>
      <div className="divider-circuit">
        <div className="divider-source"><b>{input} V</b><span>input</span></div>
        <div className="divider-resistor top"><b>R₁</b><span>{r1} kΩ</span></div>
        <div className="divider-tap">V<sub>out</sub></div>
        <div className="divider-resistor bottom"><b>R₂</b><span>{r2} kΩ</span></div>
      </div>
      <div className="controls-grid three">
        <label>Input p.d. <strong>{input} V</strong><input type="range" min="3" max="15" step="3" value={input} onChange={(event) => setInput(+event.target.value)} /></label>
        <label>R₁ <strong>{r1} kΩ</strong><input type="range" min="1" max="12" value={r1} onChange={(event) => setR1(+event.target.value)} /></label>
        <label>R₂ <strong>{r2} kΩ</strong><input type="range" min="1" max="12" value={r2} onChange={(event) => setR2(+event.target.value)} /></label>
      </div>
      <div className="formula-strip"><span>R₁ / R₂ = V₁ / V₂</span><b>Vout is across R₂</b><span>{r2}/{r1 + r2} of input</span></div>
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
          <button className={layout === "series" ? "active" : ""} aria-pressed={layout === "series"} onClick={() => setLayout("series")}>Series</button>
          <button className={layout === "parallel" ? "active" : ""} aria-pressed={layout === "parallel"} onClick={() => setLayout("parallel")}>Parallel</button>
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
  const keyboardMove = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
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
        <div className="challenge-tabs" aria-label="Choose fuse challenge">{challenges.map((_, index) => <button key={index} className={challenge === index ? "active" : ""} aria-pressed={challenge === index} onClick={() => { setChallenge(index); setDropped(null); }}>0{index + 1}</button>)}</div>
      </div>
      <p className="drag-instruction">At 230 V, the {item.appliance.toLowerCase()} uses {item.power} W, so its normal current is {item.power} ÷ 230 = <b>{item.current} A</b>. Drag the best fuse into the plug.</p>
      <div className="fuse-workbench">
        <div className="fuse-tray">
          {fuses.map((rating) => (
            <button key={rating} draggable onDragStart={(event) => startDrag(event, rating)} onClick={() => setSelected(rating)} className={selected === rating ? "selected" : ""} aria-pressed={selected === rating}>
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
  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <main>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <header className="topbar">
        <a href="#top" className="brand"><i>Φ</i><span>Field Notes<small>IGCSE Physics · Chapter 4</small></span></a>
        <nav aria-label="Lesson sections">
          {sections.slice(0, 5).map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          <details className="desktop-more">
            <summary>More</summary>
            <div>
              {sections.slice(5).map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
              <a href="../chapters/">All chapters</a>
            </div>
          </details>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="chapter-contents">Contents</button>
      </header>
      {menuOpen && (
        <>
          <div className="mobile-menu-backdrop" aria-hidden="true" onClick={() => setMenuOpen(false)} />
          <nav className="mobile-menu" id="chapter-contents" aria-label="Chapter contents">
            {sections.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
            <a href="../chapters/" onClick={() => setMenuOpen(false)}>All chapters</a>
            <a href="../chapter-5/" onClick={() => setMenuOpen(false)}>Chapter 5 · Nuclear physics →</a>
          </nav>
        </>
      )}

      <section className="hero chapter-hero" id="top">
        <div className="hero-copy">
          <span className="eyebrow">Cambridge IGCSE Physics 0625 · 2026–2028</span>
          <h1>Electricity is a flow.<br /><em>Magnetism gives it direction.</em></h1>
          <p>Chapter 4 rebuilt as a field guide: manipulate the models, explain the patterns, then answer like an examiner is marking.</p>
          <div className="hero-actions">
            <a href="#overview" className="primary-button">Begin the fieldwork <span>↓</span></a>
            <a href="../electromagnetic-labs/" className="advanced-labs-button">Generator &amp; Motor Labs <span>→</span></a>
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
          <div><span className="eyebrow">Route map</span><h2>Five sections. One connected story.</h2><p>The official 2026–2028 syllabus moves from magnetism to electrical quantities, circuits, safety and electromagnetic effects.</p></div>
        </div>
        <div className="syllabus-grid">
          {[
            ["4.1", "Magnetism", "Fields, poles, induced magnetism, permanent and temporary magnets"],
            ["4.2", "Electrical quantities", "Electrostatics, current, e.m.f., p.d., resistance, energy and power"],
            ["4.3", "Circuits", "Symbols, series and parallel networks, I–V behaviour and potential dividers"],
            ["4.4", "Electrical safety", "Hazards, insulation, earthing, fuses and circuit breakers"],
            ["4.5", "Electromagnetic effects", "Induction, a.c. generators, transformers and the motor effect"],
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
        <AcademyMoment question="Why does a compass turn even though it is not touching the magnet?" from="A magnet creates a field" change="The compass north pole experiences a force" to="The needle aligns with field direction" steps={["A field is a region where a force can act.", "Direction is defined using a north pole.", "Closer field lines represent a stronger field."]} label="COMMON MISTAKE" note="Field lines are not physical strings. They are a model showing direction and relative strength." />
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
          <div><span className="eyebrow">4.2–4.3 · quantities and circuits</span><h2>Charge first. Then make it flow.</h2><p>Begin with electrostatics and fields, then measure current, p.d. and component behaviour in complete circuits.</p></div>
        </div>
        <AcademyMoment tone="amber" question="When a lamp lights, is electric current being used up inside it?" from="Charge flows around a complete circuit" change="The lamp transfers electrical energy" to="Same steady current leaves the component" steps={["Current is charge flow per second.", "Charge is conserved at the component.", "Energy—not current—is transferred to light and thermal stores."]} label="ANDREW'S TIP" note="Use the water-flow analogy only for current continuity. Do not say a battery stores current or a lamp consumes current." />
        <ElectrostaticLab />
        <ElectricFieldLab />
        <div className="formula-grid">
          <article><span>charge flow</span><b>I = Q / t</b><p>current = charge per unit time</p></article>
          <article><span>resistance</span><b>R = V / I</b><p>opposition to current</p></article>
          <article><span>electrical power</span><b>P = IV</b><p>energy transferred each second</p></article>
          <article><span>electrical energy</span><b>E = IVt</b><p>or E = Pt</p></article>
        </div>
        <MeterPlacementLab />
        <CircuitLab />
        <CircuitAssemblyLab />
        <div className="examiner-lens">
          <span>EXAMINER’S LENS</span>
          <p><b>Never write “current is used up”.</b> Charge is conserved. Components transfer energy; the current entering a component equals the current leaving it in steady state.</p>
        </div>
        <IVGraphLab />
        <ComponentBoardLab />
        <PotentialDividerLab />
      </section>

      <section className="lesson-section" id="effects">
        <div className="section-heading">
          <span className="section-number">04</span>
          <div><span className="eyebrow">4.5 · electromagnetic effects</span><h2>One relationship, run in two directions.</h2><p>Current can produce motion; motion through a magnetic field can produce an e.m.f.</p></div>
        </div>
        <AcademyMoment tone="coral" question="What must change before a generator can produce an induced e.m.f.?" from="A conductor and magnetic field" change="Flux linkage changes" to="An induced e.m.f. appears" steps={["Relative motion must cut field lines or change flux linkage.", "Faster change gives a larger induced e.m.f.", "Reversing motion or field reverses the induced direction."]} label="CAMBRIDGE EXAM FOCUS" note="A magnet merely sitting inside a coil produces no continuous e.m.f. The magnetic flux linkage must change." />
        <FlemingRulesLab />
        <InductionDragLab />
        <div className="advanced-labs-cta">
          <div><span className="mini-label">Separate practical page</span><h3>Explore the generator and motor in depth</h3><p>Synchronise a rotating coil with its a.c. waveform, predict motor-force direction and investigate the split-ring commutator.</p></div>
          <a href="../electromagnetic-labs/">Open advanced labs <span>→</span></a>
        </div>
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
          <div><span className="eyebrow">4.4 · electrical safety</span><h2>Protection works by controlling the path.</h2><p>Electric shock needs current through the body. Good design prevents contact, provides a safer path, or disconnects the supply quickly.</p></div>
        </div>
        <AcademyMoment tone="blue" question="Why must a fuse be placed in the live wire rather than the neutral wire?" from="A dangerous fault current" change="Fuse melts in the live path" to="Appliance disconnects from high potential" steps={["The live wire supplies the dangerous potential.", "A protective device must break that connection.", "Earthing provides a low-resistance fault path so protection operates quickly."]} label="COMMON MISTAKE" note="A fuse in the neutral wire could open while the appliance remains connected to live and therefore still dangerous." />
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
          <article><b>Live-wire switching</b><p>The switch and fuse belong in the live wire so opening either disconnects the appliance from the high-potential supply.</p></article>
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

      <ChapterNav current={4} prefix="../" />

      <footer>
        <div><i>Φ</i><b>Field Notes</b><span>Interactive teaching material for Cambridge IGCSE Physics 0625</span></div>
        <p>Aligned to the 2026–2028 syllabus. Independent educational resource; not endorsed by Cambridge International Education.</p>
      </footer>
    </main>
  );
}
