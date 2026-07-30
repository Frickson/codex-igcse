"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

/* ---------- element data + helpers ---------- */
const SYM = ["", "H","He","Li","Be","B","C","N","O","F","Ne","Na","Mg","Al","Si","P","S","Cl","Ar","K","Ca",
  "Sc","Ti","V","Cr","Mn","Fe","Co","Ni","Cu","Zn","Ga","Ge","As","Se","Br","Kr","Rb","Sr","Y","Zr",
  "Nb","Mo","Tc","Ru","Rh","Pd","Ag","Cd","In","Sn","Sb","Te","I","Xe","Cs","Ba","La","Ce","Pr","Nd",
  "Pm","Sm","Eu","Gd","Tb","Dy","Ho","Er","Tm","Yb","Lu","Hf","Ta","W","Re","Os","Ir","Pt","Au","Hg",
  "Tl","Pb","Bi","Po","At","Rn","Fr","Ra","Ac","Th","Pa","U","Np","Pu","Am","Cm","Bk","Cf","Es","Fm"];
const NAME: Record<number, string> = { 1: "Hydrogen", 2: "Helium", 3: "Lithium", 6: "Carbon", 7: "Nitrogen",
  8: "Oxygen", 11: "Sodium", 27: "Cobalt", 28: "Nickel", 36: "Krypton", 38: "Strontium", 39: "Yttrium",
  56: "Barium", 82: "Lead", 86: "Radon", 88: "Radium", 90: "Thorium", 92: "Uranium", 95: "Americium" };
function elemName(z: number) { return NAME[z] || SYM[z] || "element"; }
const prefersReduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Nuclide({ a, z, sym }: { a: number | string; z: number | string; sym: string }) {
  return (
    <span className="nuclide">
      <span className="nuc-a">{a}</span>
      <span className="nuc-z">{z}</span>
      <span className="nuc-sym">{sym}</span>
    </span>
  );
}

/* ---------- scroll progress hook (shared convention) ---------- */
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

const sections: [string, string][] = [
  ["overview", "Route map"],
  ["atom", "The atom"],
  ["nucleus", "The nucleus"],
  ["radioactivity", "Radioactivity"],
  ["decay", "Decay & half-life"],
  ["safety", "Uses & safety"],
  ["practice", "Exam practice"],
  ["mindmap", "Mind map"],
  ["checkpoint", "Checkpoint"],
];

/* =====================================================================
   5.1.1 Atom & ion builder
   ===================================================================== */
function AtomBuilderLab() {
  const neutronsFor: Record<number, number> = { 3: 4, 6: 6, 8: 8, 11: 12 };
  const [protons, setProtons] = useState(6);
  const [electrons, setElectrons] = useState(6);
  const neutrons = neutronsFor[protons] ?? protons;
  const charge = protons - electrons;

  const shells = useMemo(() => {
    const caps = [2, 8, 8, 18];
    const out: number[] = [];
    let n = electrons;
    let i = 0;
    while (n > 0 && i < caps.length) { const k = Math.min(n, caps[i]); out.push(k); n -= k; i++; }
    if (n > 0 && out.length) out[out.length - 1] += n;
    return out;
  }, [electrons]);

  const W = 360, H = 320, cx = W / 2, cy = H / 2;
  const seq: ("p" | "n")[] = [];
  { let p = protons, nn = neutrons; while (p > 0 || nn > 0) { if (p > 0) { seq.push("p"); p--; } if (nn > 0) { seq.push("n"); nn--; } } }
  const tot = seq.length, cols = Math.max(1, Math.ceil(Math.sqrt(tot))), sp = 11;
  const offX = (cols - 1) * sp / 2, rowsN = Math.ceil(tot / cols), offY = (rowsN - 1) * sp / 2;

  const stateText = charge === 0
    ? "Neutral atom — protons and electrons balance, so the overall charge is 0."
    : charge > 0
      ? `Positive ion (${elemName(protons)} ${charge > 0 ? "+" + charge : charge}): it has lost ${Math.abs(electrons - protons)} electron(s).`
      : `Negative ion (${elemName(protons)} ${charge}): it has gained ${Math.abs(electrons - protons)} electron(s).`;

  return (
    <div className="lab-shell nuclear">
      <div className="lab-header">
        <div><span className="mini-label">5.1.1 · the atom</span><h3>Build an atom, then make an ion</h3></div>
        <div className="big-reading"><span>Overall charge</span><strong>{charge > 0 ? "+" : ""}{charge}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="nuclear-stage" role="img" aria-label="Atomic model: a nucleus of protons and neutrons surrounded by electron shells">
          <svg viewBox={`0 0 ${W} ${H}`}>
            {shells.map((count, r) => {
              const rad = 54 + r * 32;
              return (
                <g key={r}>
                  <circle cx={cx} cy={cy} r={rad} fill="none" stroke="#c4d2cd" strokeWidth={1} />
                  {Array.from({ length: count }, (_, e) => {
                    const ang = (e / count) * Math.PI * 2 + r * 0.5;
                    return <circle key={e} cx={cx + rad * Math.cos(ang)} cy={cy + rad * Math.sin(ang)} r={5} fill="#1c8b74"><title>electron −1</title></circle>;
                  })}
                </g>
              );
            })}
            {seq.map((kind, i) => {
              const col = i % cols, row = Math.floor(i / cols);
              const nx = cx + col * sp - offX, ny = cy + row * sp - offY;
              return <circle key={i} cx={nx} cy={ny} r={5.5} fill={kind === "p" ? "#cf5d45" : "#8b97a8"}><title>{kind === "p" ? "proton +1" : "neutron 0"}</title></circle>;
            })}
          </svg>
        </div>
        <div className="side">
          <div className="inline-controls">
            <label className="num-field">Element (fixed protons)
              <select value={protons} onChange={(e) => { const z = +e.target.value; setProtons(z); setElectrons(z); }}>
                <option value={3}>Lithium (Z=3)</option>
                <option value={6}>Carbon (Z=6)</option>
                <option value={8}>Oxygen (Z=8)</option>
                <option value={11}>Sodium (Z=11)</option>
              </select>
            </label>
          </div>
          <div className="chip-row" role="group" aria-label="Change electrons">
            <button onClick={() => setElectrons((v) => v + 1)}>+ electron</button>
            <button onClick={() => setElectrons((v) => Math.max(0, v - 1))} disabled={electrons <= 0}>− electron</button>
            <button onClick={() => setElectrons(protons)}>Reset (neutral)</button>
          </div>
          <table className="data-table">
            <tbody>
              <tr><th>Protons (+1 each)</th><td className="num">{protons}</td></tr>
              <tr><th>Neutrons (0)</th><td className="num">{neutrons}</td></tr>
              <tr><th>Electrons (−1 each)</th><td className="num">{electrons}</td></tr>
            </tbody>
          </table>
          <p className="field-note" aria-live="polite">{stateText}</p>
        </div>
      </div>
      <p className="lab-note">The charge is computed from the actual proton and electron counts, not from the button pressed. Losing electrons leaves a positive ion; gaining electrons gives a negative ion. The number of protons never changes, so the element stays the same.</p>
    </div>
  );
}

/* =====================================================================
   5.1.1 Rutherford alpha-scattering (canvas)
   ===================================================================== */
type ScatterParticle = { x: number; y: number; vx: number; vy: number; phase: "in" | "out"; theta: number; done: boolean };
function ScatteringLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const particlesRef = useRef<ScatterParticle[]>([]);
  const countsRef = useRef({ straight: 0, defl: 0, back: 0 });
  const [model, setModel] = useState<"nuclear" | "pudding">("nuclear");
  const [counts, setCounts] = useState({ straight: 0, defl: 0, back: 0 });
  const W = 640, H = 420, nx = W * 0.62, ny = H / 2;

  const deflect = (b: number, m: "nuclear" | "pudding") => {
    if (m === "pudding") return 0;
    const ab = Math.abs(b);
    if (ab < 0.8) return Math.PI * (b >= 0 ? 1 : -1);
    let theta = 2 * Math.atan(1.4 / ab);
    if (theta > Math.PI) theta = Math.PI;
    return b >= 0 ? theta : -theta;
  };

  const drawBase = (ctx: CanvasRenderingContext2D, m: "nuclear" | "pudding") => {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#60737c"; ctx.font = "13px sans-serif";
    ctx.fillText("α source", 6, ny - 10);
    ctx.strokeStyle = "#8b97a8"; ctx.beginPath(); ctx.moveTo(0, ny); ctx.lineTo(30, ny); ctx.stroke();
    if (m === "nuclear") {
      ctx.fillStyle = "#cf5d45"; ctx.beginPath(); ctx.arc(nx, ny, 8, 0, 7); ctx.fill();
      ctx.fillStyle = "#60737c"; ctx.fillText("tiny dense +nucleus", nx - 52, ny - 16);
    } else {
      ctx.fillStyle = "rgba(207,93,69,.16)"; ctx.beginPath(); ctx.arc(nx, ny, 62, 0, 7); ctx.fill();
      ctx.fillStyle = "#60737c"; ctx.fillText("spread-out + charge", nx - 52, ny - 72);
    }
  };

  const classify = (theta: number) => {
    const deg = Math.abs(theta) * 180 / Math.PI;
    if (deg > 90) countsRef.current.back++;
    else if (deg >= 10) countsRef.current.defl++;
    else countsRef.current.straight++;
  };

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    particlesRef.current = [];
    countsRef.current = { straight: 0, defl: 0, back: 0 };
    setCounts({ straight: 0, defl: 0, back: 0 });
    drawBase(ctx, model);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [model]);

  const fire = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    countsRef.current = { straight: 0, defl: 0, back: 0 };
    const N = 40, mid = Math.round(N / 2);
    const parts: ScatterParticle[] = [];
    for (let i = 0; i < N; i++) {
      let y0 = 24 + (H - 48) * (i + 0.5) / N;
      if (i === mid && model === "nuclear") y0 = ny;
      const b = y0 - ny;
      const theta = model === "pudding" ? 0 : deflect(b, model);
      parts.push({ x: 0, y: y0, vx: 3.4, vy: 0, phase: "in", theta, done: false });
    }
    particlesRef.current = parts;

    if (prefersReduced()) {
      drawBase(ctx, model);
      ctx.lineWidth = 1.4; ctx.strokeStyle = "rgba(28,139,116,.75)";
      parts.forEach((p) => {
        ctx.beginPath(); ctx.moveTo(0, p.y); ctx.lineTo(nx, p.y);
        ctx.lineTo(nx + 260 * Math.cos(p.theta), p.y + 260 * Math.sin(p.theta)); ctx.stroke();
        classify(p.theta);
      });
      setCounts({ ...countsRef.current });
      return;
    }

    const step = () => {
      drawBase(ctx, model);
      let moving = false;
      parts.forEach((p) => {
        if (p.done) return;
        moving = true;
        if (p.phase === "in") {
          p.x += p.vx;
          if (p.x >= nx) { p.phase = "out"; p.vx = 3.4 * Math.cos(p.theta); p.vy = 3.4 * Math.sin(p.theta); classify(p.theta); }
        } else {
          p.x += p.vx; p.y += p.vy;
          if (p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) p.done = true;
        }
        ctx.beginPath(); ctx.arc(p.x, p.y, 2.6, 0, 7); ctx.fillStyle = "#1c8b74"; ctx.fill();
      });
      setCounts({ ...countsRef.current });
      rafRef.current = moving ? requestAnimationFrame(step) : null;
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const explain = model === "nuclear"
    ? "Nuclear model: most particles miss the tiny nucleus and pass straight through (empty space). A few pass near the concentrated positive charge and deflect; a very few hit almost head-on and bounce back — evidence for a tiny, dense, positive nucleus."
    : "Plum-pudding model: positive charge is spread thinly, so there is nothing dense to repel the α-particles. This model predicts almost no deflection and no back-scatter — which is NOT what was observed, so it is rejected.";

  return (
    <div className="lab-shell nuclear">
      <div className="lab-header">
        <div><span className="mini-label">5.1.1 · α-scattering · Supplement</span><h3>Which model matches the observations?</h3></div>
        <div className="rad-select" role="group" aria-label="Choose atomic model">
          <button className={model === "nuclear" ? "active" : ""} onClick={() => setModel("nuclear")}>Nuclear</button>
          <button className={model === "pudding" ? "active" : ""} onClick={() => setModel("pudding")}>Plum-pudding</button>
        </div>
      </div>
      <div className="lab-grid">
        <div className="nuclear-stage tall">
          <canvas ref={canvasRef} width={W} height={H} aria-label="Alpha particles fired at a thin foil, deflecting according to the selected model" />
        </div>
        <div className="side">
          <div className="chip-row"><button onClick={fire}>Fire particles</button></div>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Passed nearly straight</th><td className="num">{counts.straight}</td></tr>
              <tr><th>Deflected (&gt;10°)</th><td className="num">{counts.defl}</td></tr>
              <tr><th>Bounced back (&gt;90°)</th><td className="num">{counts.back}</td></tr>
            </tbody>
          </table>
          <p className="field-note">{explain}</p>
        </div>
      </div>
      <p className="model-caption">Deflection depends on how close each particle&apos;s path passes to the concentrated charge — not on a random choice.</p>
    </div>
  );
}

/* =====================================================================
   5.1.2 Nuclide calculator
   ===================================================================== */
function NuclideLab() {
  const [z, setZ] = useState(6);
  const [a, setA] = useState(12);
  const valid = z >= 1 && z <= 100 && a >= z;
  const n = a - z;
  const sym = SYM[z] || "X";
  return (
    <div className="lab-shell nuclear">
      <div className="lab-header">
        <div><span className="mini-label">5.1.2 · nuclide notation</span><h3>How do Z and A fix a nucleus?</h3></div>
      </div>
      <div className="inline-controls">
        <label className="num-field">Proton number Z
          <input type="number" min={1} max={100} value={z} onChange={(e) => setZ(+e.target.value)} />
        </label>
        <label className="num-field">Nucleon number A
          <input type="number" min={1} max={250} value={a} onChange={(e) => setA(+e.target.value)} />
        </label>
        <button className="reset-button" style={{ margin: 0 }} onClick={() => { setZ(6); setA(12); }}>Reset</button>
      </div>
      {valid ? (
        <>
          <div className="eqn-line"><Nuclide a={a} z={z} sym={sym} /></div>
          <table className="data-table">
            <tbody>
              <tr><th>Element</th><td>{elemName(z)} ({sym})</td></tr>
              <tr><th>Protons</th><td className="num">{z}</td></tr>
              <tr><th>Neutrons = A − Z</th><td className="num">{n}</td></tr>
              <tr><th>Relative charge on nucleus <em>(Supplement)</em></th><td className="num">+{z}</td></tr>
              <tr><th>Relative mass of nucleus <em>(Supplement)</em></th><td className="num">{a}</td></tr>
            </tbody>
          </table>
        </>
      ) : (
        <p className="field-note zero" aria-live="polite">Invalid: the nucleon number A cannot be smaller than the proton number Z (that would need a negative number of neutrons).</p>
      )}
      <p className="lab-note">Proton number Z gives the relative nuclear charge (+Z); nucleon number A gives the relative nuclear mass. Number of neutrons is always A − Z.</p>
    </div>
  );
}

/* =====================================================================
   Isotope explorer
   ===================================================================== */
function IsotopeLab() {
  const maxN: Record<number, number> = { 1: 3, 6: 10, 92: 150 };
  const known: Record<string, string> = {
    "1-0": "protium", "1-1": "deuterium", "1-2": "tritium",
    "6-6": "carbon-12 (stable)", "6-7": "carbon-13 (stable)", "6-8": "carbon-14 (radioactive)",
    "92-143": "uranium-235", "92-146": "uranium-238",
  };
  const [z, setZ] = useState(6);
  const [n, setN] = useState(6);
  const a = z + n;
  const sym = SYM[z];
  const extra = known[`${z}-${n}`] ? ` — ${known[`${z}-${n}`]}` : "";
  return (
    <div className="lab-shell nuclear">
      <div className="lab-header">
        <div><span className="mini-label">5.1.2 · isotopes</span><h3>Same element, different neutrons</h3></div>
      </div>
      <div className="inline-controls">
        <label className="num-field">Element
          <select value={z} onChange={(e) => { const nz = +e.target.value; setZ(nz); setN(nz === 6 ? 6 : nz === 1 ? 1 : 146); }}>
            <option value={1}>Hydrogen (Z=1)</option>
            <option value={6}>Carbon (Z=6)</option>
            <option value={92}>Uranium (Z=92)</option>
          </select>
        </label>
        <label style={{ flex: 1, minWidth: 200, color: "var(--muted)", fontSize: 12, fontWeight: 800 }}>
          Neutrons <strong style={{ float: "right", color: "var(--navy)" }}>{n}</strong>
          <input type="range" min={0} max={maxN[z] ?? 20} value={n} onChange={(e) => setN(+e.target.value)} />
        </label>
      </div>
      <div className="eqn-line"><Nuclide a={a} z={z} sym={sym} /></div>
      <p className="field-note" aria-live="polite">This is {elemName(z)}-{a}{extra}. Proton number Z = {z} (unchanged, so it is still {elemName(z)}), with {n} neutron(s). Nucleon number A = {a}.</p>
      <p className="lab-note">Isotopes of an element share the same proton number Z but have different numbers of neutrons, so different nucleon numbers A. They behave the same chemically but differ in mass and stability.</p>
    </div>
  );
}

/* =====================================================================
   Fission / fusion
   ===================================================================== */
type Nuc = [number, number, string];
function FissionFusionLab() {
  const [mode, setMode] = useState<"fission" | "fusion">("fission");
  const RX: Record<"fission" | "fusion", { left: Nuc[]; right: Nuc[]; note: string }> = {
    fission: {
      left: [[1, 0, "n"], [235, 92, "U"]],
      right: [[144, 56, "Ba"], [89, 36, "Kr"], [1, 0, "n"], [1, 0, "n"], [1, 0, "n"]],
      note: "Fission: a slow neutron is absorbed by a heavy U-235 nucleus, which splits into two smaller nuclei and releases more neutrons. A small loss of mass is released as a large amount of energy.",
    },
    fusion: {
      left: [[2, 1, "H"], [3, 1, "H"]],
      right: [[4, 2, "He"], [1, 0, "n"]],
      note: "Fusion: two light hydrogen nuclei join to form a helium nucleus and a neutron. A small loss of mass is released as energy. This process powers stars.",
    },
  };
  const rx = RX[mode];
  const sum = (arr: Nuc[], i: 0 | 1) => arr.reduce((s, x) => s + x[i], 0);
  const balanced = sum(rx.left, 0) === sum(rx.right, 0) && sum(rx.left, 1) === sum(rx.right, 1);
  const eqn = (list: Nuc[]) => list.map((x, i) => (
    <span key={i}>{i > 0 && <span className="op">+</span>}<Nuclide a={x[0]} z={x[1]} sym={x[2]} /></span>
  ));
  return (
    <div className="lab-shell nuclear">
      <div className="lab-header">
        <div><span className="mini-label">5.1.2 · fission &amp; fusion · Supplement</span><h3>Splitting or joining nuclei</h3></div>
        <div className="rad-select" role="group" aria-label="Choose process">
          <button className={mode === "fission" ? "active" : ""} onClick={() => setMode("fission")}>Fission</button>
          <button className={mode === "fusion" ? "active" : ""} onClick={() => setMode("fusion")}>Fusion</button>
        </div>
      </div>
      <div className="eqn-line" aria-live="polite">{eqn(rx.left)}<span className="op">→</span>{eqn(rx.right)}</div>
      <table className="data-table">
        <thead><tr><th></th><th>Total A left</th><th>Total A right</th><th>Total Z left</th><th>Total Z right</th></tr></thead>
        <tbody><tr><th>Balance</th><td className="num">{sum(rx.left, 0)}</td><td className="num">{sum(rx.right, 0)}</td><td className="num">{sum(rx.left, 1)}</td><td className="num">{sum(rx.right, 1)}</td></tr></tbody>
      </table>
      <p className="field-note">{rx.note}{balanced ? " Nucleon number and proton number are conserved (both sides balance)." : ""}</p>
      <p className="model-caption">Qualitative only: mass and energy changes are described in words, without values, as required by the syllabus.</p>
    </div>
  );
}

/* =====================================================================
   5.2.1 Background sources + corrected count rate
   ===================================================================== */
function BackgroundLab() {
  const data: [string, number, string][] = [
    ["Radon gas (air)", 42, "#cf5d45"], ["Rocks & buildings", 16, "#df8c38"],
    ["Medical (artificial)", 14, "#173d54"], ["Cosmic rays", 10, "#1c8b74"],
    ["Food & drink", 9, "#9a5b1d"], ["Other", 9, "#8b97a8"],
  ];
  const [measured, setMeasured] = useState(52);
  const [background, setBackground] = useState(12);
  const corrected = measured - background;
  const W = 420, rowH = 30, left = 150, H = data.length * rowH + 10;
  return (
    <div className="lab-shell nuclear">
      <div className="lab-header">
        <div><span className="mini-label">5.2.1 · detection</span><h3>Background &amp; corrected count rate</h3></div>
      </div>
      <div className="lab-grid">
        <div>
          <div className="nuclear-stage" role="img" aria-label="Bar chart of typical background radiation sources" style={{ minHeight: 0 }}>
            <svg viewBox={`0 0 ${W} ${H}`}>
              {data.map((d, i) => {
                const y = i * rowH + 6, w = (d[1] / 45) * (W - left - 44);
                return (
                  <g key={d[0]}>
                    <text x={left - 8} y={y + 15} fill="#102a38" fontSize={12} textAnchor="end">{d[0]}</text>
                    <rect x={left} y={y} width={w} height={19} rx={5} fill={d[2]} />
                    <text x={left + w + 7} y={y + 15} fill="#60737c" fontSize={11}>{d[1]}%</text>
                  </g>
                );
              })}
            </svg>
          </div>
          <p className="model-caption">Proportions are typical/approximate for illustration and vary by location.</p>
        </div>
        <div className="side">
          <h4 style={{ margin: 0, font: "700 16px var(--serif)", color: "var(--navy)" }}>Corrected count rate <em style={{ color: "var(--muted)", fontSize: 11 }}>(Supplement)</em></h4>
          <div className="inline-controls">
            <label className="num-field">Measured (counts/s)
              <input type="number" min={0} value={measured} onChange={(e) => setMeasured(+e.target.value)} />
            </label>
            <label className="num-field">Background (counts/s)
              <input type="number" min={0} value={background} onChange={(e) => setBackground(+e.target.value)} />
            </label>
          </div>
          {corrected >= 0 ? (
            <p className="eqn-line" style={{ fontSize: 20 }} aria-live="polite">{measured} − {background} = <b>{corrected} counts/s</b></p>
          ) : (
            <p className="field-note zero" aria-live="polite">Background cannot exceed a real measured count from a source — recheck the readings.</p>
          )}
          <p className="field-note">The corrected count rate is the reading due to the source alone, once the ever-present background is subtracted.</p>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   5.2.2 Penetration / absorber simulator
   ===================================================================== */
function PenetrationLab() {
  const [type, setType] = useState<"a" | "b" | "g">("a");
  const [paper, setPaper] = useState(false);
  const [alu, setAlu] = useState(false);
  const [lead, setLead] = useState(false);
  const W = 440, H = 210, y = H / 2, srcX = 20;
  const slabs = [
    { on: paper, x: 150, w: 8, label: "paper", col: "#c9b48a" },
    { on: alu, x: 250, w: 16, label: "Al", col: "#9aa7b8" },
    { on: lead, x: 350, w: 28, label: "lead", col: "#586274" },
  ];
  const col = type === "a" ? "#cf5d45" : type === "b" ? "#1c8b74" : "#df8c38";
  let stopX = W - 10, attenuated = false, stoppedBy: string | null = null;
  for (const s of slabs) {
    if (!s.on) continue;
    if (type === "a") { stopX = s.x; stoppedBy = s.label; break; }
    if (type === "b") { if (s.label === "paper") continue; stopX = s.x; stoppedBy = s.label; break; }
    if (type === "g") { if (s.label === "lead") { attenuated = true; stopX = s.x + s.w; break; } continue; }
  }
  const name = type === "a" ? "Alpha (α)" : type === "b" ? "Beta (β)" : "Gamma (γ)";
  const msg = stoppedBy ? `${name} is stopped by the ${stoppedBy}.`
    : type === "g" && attenuated ? "Gamma (γ) is only partly absorbed — thick lead reduces its intensity but does not stop it completely."
      : `${name} passes through (no absorber present that can stop it).`;
  const detail = type === "a" ? " α has the lowest penetration: it is heavy, +2 charged and slow, so it ionises strongly and loses energy quickly."
    : type === "b" ? " β passes paper but is stopped by a few mm of aluminium; medium ionising, medium penetration."
      : " γ is an uncharged EM wave, so it ionises least and penetrates most.";
  const leadX = 350 + 28;
  return (
    <div className="lab-shell nuclear">
      <div className="lab-header">
        <div><span className="mini-label">5.2.2 · penetration</span><h3>Which absorber stops each radiation?</h3></div>
        <div className="rad-select" role="group" aria-label="Select radiation type">
          <button className={type === "a" ? "active" : ""} onClick={() => setType("a")}>α alpha</button>
          <button className={type === "b" ? "active" : ""} onClick={() => setType("b")}>β beta</button>
          <button className={type === "g" ? "active" : ""} onClick={() => setType("g")}>γ gamma</button>
        </div>
      </div>
      <div className="lab-grid">
        <div className="nuclear-stage" style={{ minHeight: 0 }} role="img" aria-label="Radiation from a source passing through paper, aluminium and lead absorbers">
          <svg viewBox={`0 0 ${W} ${H}`}>
            <circle cx={srcX} cy={y} r={9} fill="#173d54" />
            <text x={srcX} y={y - 14} fill="#60737c" fontSize={11} textAnchor="middle">source</text>
            <line x1={srcX + 9} y1={y} x2={stopX} y2={y} stroke={col} strokeWidth={4} />
            {stopX >= W - 12 && <polygon points={`${W - 16},${y - 6} ${W - 4},${y} ${W - 16},${y + 6}`} fill={col} />}
            {type === "g" && attenuated && <>
              <line x1={leadX} y1={y} x2={W - 14} y2={y} stroke={col} strokeWidth={1.5} opacity={0.4} />
              <polygon points={`${W - 16},${y - 5} ${W - 6},${y} ${W - 16},${y + 5}`} fill={col} opacity={0.4} />
            </>}
            {slabs.filter((s) => s.on).map((s) => (
              <g key={s.label}>
                <rect x={s.x} y={y - 46} width={s.w} height={92} rx={3} fill={s.col} opacity={0.9} />
                <text x={s.x + s.w / 2} y={y + 62} fill="#60737c" fontSize={11} textAnchor="middle">{s.label}</text>
              </g>
            ))}
          </svg>
        </div>
        <div className="side">
          <div className="chip-row" role="group" aria-label="Absorbers in the path">
            <button className={paper ? "active" : ""} aria-pressed={paper} onClick={() => setPaper((v) => !v)}>Paper</button>
            <button className={alu ? "active" : ""} aria-pressed={alu} onClick={() => setAlu((v) => !v)}>Aluminium</button>
            <button className={lead ? "active" : ""} aria-pressed={lead} onClick={() => setLead((v) => !v)}>Lead (thick)</button>
          </div>
          <p className="field-note" aria-live="polite">{msg}{detail}</p>
        </div>
      </div>
    </div>
  );
}

/* =====================================================================
   5.2.2 Deflection in fields
   ===================================================================== */
function DeflectionLab() {
  const [field, setField] = useState<"electric" | "magnetic">("electric");
  const [show, setShow] = useState<"all" | "a" | "b" | "g">("all");
  const W = 440, H = 240, cx0 = 30, y0 = H / 2;
  const aDown = field === "electric";
  const ray = (kind: "a" | "b" | "g") => {
    const col = kind === "a" ? "#cf5d45" : kind === "b" ? "#1c8b74" : "#df8c38";
    const dy = kind === "a" ? (aDown ? 1 : -1) * 46 : kind === "b" ? (aDown ? -1 : 1) * 92 : 0;
    const label = kind === "a" ? "α (+2)" : kind === "b" ? "β (−1)" : "γ (0)";
    const enter = 120, exit = 360, steps = 8;
    let path = `M${cx0},${y0} L${enter},${y0}`;
    for (let i = 1; i <= steps; i++) { const t = i / steps; path += ` L${enter + (exit - enter) * t},${y0 + dy * t * t}`; }
    const ex = exit + 50, ey = y0 + dy + dy * 0.35;
    path += ` L${ex},${ey}`;
    return <g key={kind}>
      <path d={path} fill="none" stroke={col} strokeWidth={2.5} />
      <text x={ex - 6} y={ey - 6} fill={col} fontSize={12} textAnchor="end">{label}</text>
    </g>;
  };
  const dirA = field === "electric" ? "towards the − plate" : "one way (upwards here)";
  const dirB = field === "electric" ? "towards the + plate" : "the opposite way (downwards here)";
  return (
    <div className="lab-shell nuclear">
      <div className="lab-header">
        <div><span className="mini-label">5.2.2 · deflection · Supplement</span><h3>How do fields bend each ray?</h3></div>
        <div className="rad-select" role="group" aria-label="Field type">
          <button className={field === "electric" ? "active" : ""} onClick={() => setField("electric")}>Electric</button>
          <button className={field === "magnetic" ? "active" : ""} onClick={() => setField("magnetic")}>Magnetic</button>
        </div>
      </div>
      <div className="lab-grid">
        <div className="nuclear-stage" role="img" aria-label="Alpha, beta and gamma radiation entering a field and deflecting">
          <svg viewBox={`0 0 ${W} ${H}`}>
            {field === "electric" ? <>
              <rect x={120} y={30} width={240} height={8} fill="#cf5d45" /><text x={128} y={26} fill="#cf5d45" fontSize={12}>+ plate</text>
              <rect x={120} y={202} width={240} height={8} fill="#173d54" /><text x={128} y={228} fill="#173d54" fontSize={12}>− plate</text>
            </> : <>
              {Array.from({ length: 7 }, (_, gi) => Array.from({ length: 5 }, (_, gj) => (
                <text key={`${gi}-${gj}`} x={140 + gi * 34} y={50 + gj * 34} fill="#8b97a8" fontSize={12} textAnchor="middle">×</text>
              )))}
              <text x={150} y={24} fill="#60737c" fontSize={12}>B field into screen (×)</text>
            </>}
            {(show === "all" || show === "a") && ray("a")}
            {(show === "all" || show === "b") && ray("b")}
            {(show === "all" || show === "g") && ray("g")}
            <circle cx={cx0} cy={y0} r={6} fill="#173d54" /><text x={cx0} y={y0 + 22} fill="#60737c" fontSize={11} textAnchor="middle">source</text>
          </svg>
        </div>
        <div className="side">
          <label className="num-field">Show
            <select value={show} onChange={(e) => setShow(e.target.value as "all" | "a" | "b" | "g")}>
              <option value="all">All three</option>
              <option value="a">α only</option>
              <option value="b">β only</option>
              <option value="g">γ only</option>
            </select>
          </label>
          <p className="field-note" aria-live="polite">In the {field} field: α (+2) bends {dirA} but only slightly because it is heavy; β⁻ (−1) bends {dirB} and further because it is much lighter; γ (uncharged) is not deflected at all.</p>
        </div>
      </div>
      <p className="model-caption">Magnetic field is directed into the screen; the electric field points from the + plate (top) to the − plate (bottom).</p>
    </div>
  );
}

/* =====================================================================
   5.2.3 Decay-equation builder
   ===================================================================== */
function DecayLab() {
  const parents: [string, Nuc][] = [
    ["Uranium-238", [238, 92, "U"]], ["Carbon-14", [14, 6, "C"]], ["Radium-226", [226, 88, "Ra"]],
    ["Cobalt-60", [60, 27, "Co"]], ["Strontium-90", [90, 38, "Sr"]],
  ];
  const [pi, setPi] = useState(1);
  const [kind, setKind] = useState<"alpha" | "beta" | "gamma">("beta");
  const [pA, pZ, pSym] = parents[pi][1];

  let eqn: ReactNode = null, explain = "", warn = "";
  if (kind === "alpha") {
    const a2 = pA - 4, z2 = pZ - 2;
    if (z2 < 1) { warn = "This light nucleus cannot be modelled as an α-emitter here (daughter Z < 1)."; }
    else {
      eqn = <><Nuclide a={pA} z={pZ} sym={pSym} /><span className="op">→</span><Nuclide a={a2} z={z2} sym={SYM[z2]} /><span className="op">+</span><Nuclide a={4} z={2} sym="He" /></>;
      explain = `α-decay: the nucleus loses 2 protons and 2 neutrons (a helium nucleus). A drops by 4 and Z drops by 2, so it becomes a different element — ${elemName(z2)}. Both A and Z balance across the equation.`;
    }
  } else if (kind === "beta") {
    const z3 = pZ + 1;
    eqn = <><Nuclide a={pA} z={pZ} sym={pSym} /><span className="op">→</span><Nuclide a={pA} z={z3} sym={SYM[z3]} /><span className="op">+</span><Nuclide a={0} z={-1} sym="e" /></>;
    explain = `β⁻-decay: a neutron changes into a proton and an electron (neutron → proton + electron). The electron is emitted. A stays the same, Z rises by 1, so the element changes to ${elemName(z3)}. This reduces the number of excess neutrons, increasing stability.`;
  } else {
    eqn = <><Nuclide a={pA} z={pZ} sym={`${pSym}*`} /><span className="op">→</span><Nuclide a={pA} z={pZ} sym={pSym} /><span className="op">+</span>γ</>;
    explain = `γ-emission: the nucleus loses energy only (as a high-energy photon). A and Z are unchanged, so it is still ${elemName(pZ)} — the element does not change.`;
  }

  return (
    <div className="lab-shell nuclear">
      <div className="lab-header">
        <div><span className="mini-label">5.2.3 · decay equations · Supplement</span><h3>How does decay change the nucleus?</h3></div>
        <div className="rad-select" role="group" aria-label="Decay type">
          <button className={kind === "alpha" ? "active" : ""} onClick={() => setKind("alpha")}>α</button>
          <button className={kind === "beta" ? "active" : ""} onClick={() => setKind("beta")}>β⁻</button>
          <button className={kind === "gamma" ? "active" : ""} onClick={() => setKind("gamma")}>γ</button>
        </div>
      </div>
      <div className="inline-controls">
        <label className="num-field">Parent nuclide
          <select value={pi} onChange={(e) => setPi(+e.target.value)}>
            {parents.map((p, i) => <option key={p[0]} value={i}>{p[0]}</option>)}
          </select>
        </label>
      </div>
      {warn ? <p className="field-note zero" aria-live="polite">{warn}</p> : <>
        <div className="eqn-line" aria-live="polite">{eqn}</div>
        <p className="field-note">{explain}</p>
      </>}
      <p className="lab-note">During α-decay or β-decay the nucleus becomes a different element. γ-emission changes only the energy, not A or Z.</p>
    </div>
  );
}

/* =====================================================================
   5.2.4 Half-life curve + calculator
   ===================================================================== */
const RAD_COMPARE = {
  a: { name: "Alpha (α)", nature: "Helium nucleus (2 protons + 2 neutrons)", charge: "+2", mass: "4", ion: "Strong", pen: "Stopped by paper / skin", defl: "Small (opposite to β)" },
  b: { name: "Beta (β⁻)", nature: "Fast electron from the nucleus", charge: "−1", mass: "≈ 1/1840 (negligible)", ion: "Moderate", pen: "Stopped by a few mm of aluminium", defl: "Large (opposite to α)" },
  g: { name: "Gamma (γ)", nature: "High-energy electromagnetic wave", charge: "0", mass: "0", ion: "Weak", pen: "Only reduced by thick lead / concrete", defl: "None" },
} as const;

function RadiationCompareLab() {
  const [sel, setSel] = useState<"a" | "b" | "g">("a");
  const cols = ["a", "b", "g"] as const;
  const rows: [string, keyof typeof RAD_COMPARE["a"]][] = [
    ["Nature", "nature"], ["Relative charge", "charge"], ["Relative mass", "mass"],
    ["Ionising effect", "ion"], ["Penetration", "pen"], ["Deflection in a field", "defl"],
  ];
  const hi = (c: string) => (c === sel ? { background: "#f8e8d5", color: "var(--ink)", fontWeight: 700 } : undefined);
  return (
    <div className="lab-shell nuclear">
      <div className="lab-header">
        <div><span className="mini-label">5.2.2 · comparing radiations</span><h3>α, β and γ at a glance</h3></div>
        <div className="rad-select">
          <button className={sel === "a" ? "active" : ""} onClick={() => setSel("a")}>α alpha</button>
          <button className={sel === "b" ? "active" : ""} onClick={() => setSel("b")}>β beta</button>
          <button className={sel === "g" ? "active" : ""} onClick={() => setSel("g")}>γ gamma</button>
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr><th aria-hidden="true"></th>{cols.map((c) => <th key={c} style={hi(c)}>{RAD_COMPARE[c].name}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map(([label, key]) => (
            <tr key={key}><th>{label}</th>{cols.map((c) => <td key={c} style={hi(c)}>{RAD_COMPARE[c][key]}</td>)}</tr>
          ))}
        </tbody>
      </table>
      <p className="field-note" aria-live="polite">{
        sel === "a" ? "Alpha is the most strongly ionising because of its +2 charge and large mass, so it loses energy quickly over a short range and is stopped first." :
        sel === "b" ? "Beta is lighter and faster than alpha, so it ionises less but penetrates further — through paper, but stopped by a few millimetres of aluminium." :
        "Gamma has no charge or mass, so it ionises weakly but penetrates the most: thick lead or concrete only reduces its intensity, never fully stops it."
      }</p>
    </div>
  );
}

function RandomDecayLab() {
  const N = 100;
  const [decayed, setDecayed] = useState<boolean[]>(() => Array(N).fill(false));
  const [step, setStep] = useState(0);
  const remaining = decayed.reduce((a, d) => a + (d ? 0 : 1), 0);
  const expected = Math.round(N * Math.pow(0.5, step));
  const advance = () => {
    if (remaining === 0) return;
    setDecayed(decayed.map((d) => (d ? true : Math.random() < 0.5)));
    setStep(step + 1);
  };
  const reset = () => { setDecayed(Array(N).fill(false)); setStep(0); };
  return (
    <div className="lab-shell nuclear">
      <div className="lab-header">
        <div><span className="mini-label">5.2.2 · 5.2.4 · random decay</span><h3>Why does a random process give a fixed half-life?</h3></div>
        <div className="chip-row">
          <button onClick={advance} disabled={remaining === 0}>Advance one interval</button>
          <button onClick={reset}>Reset</button>
        </div>
      </div>
      <div className="lab-grid">
        <div className="nuclear-stage">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 6, width: "100%", maxWidth: 300, margin: "0 auto" }} aria-hidden="true">
            {decayed.map((d, i) => (
              <span key={i} style={{ aspectRatio: "1", borderRadius: "50%", background: d ? "rgba(16,42,56,.12)" : "var(--teal)", transition: "background .25s" }} />
            ))}
          </div>
          <p className="model-caption">{remaining} of {N} nuclei still undecayed — teal = not yet decayed</p>
        </div>
        <div className="side">
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Intervals elapsed (n)</th><td className="num">{step}</td></tr>
              <tr><th>Nuclei remaining</th><td className="num">{remaining}</td></tr>
              <tr><th>Expected N₀ × (½)ⁿ</th><td className="num">{expected}</td></tr>
            </tbody>
          </table>
          <p className="eqn-line" style={{ fontSize: 15, lineHeight: 1.6 }}>Each interval, every remaining nucleus has a <b>50%</b> chance to decay.</p>
        </div>
      </div>
      <p className="field-note">You cannot predict which nucleus decays next, or exactly how many go each interval — decay is spontaneous and random. Yet across many nuclei, close to half decay every interval, so the count follows a smooth halving curve. That is why a random process still has a fixed, reliable half-life.</p>
    </div>
  );
}

function HalfLifeLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [T, setT] = useState(6);
  const [time, setTime] = useState(0);
  const [useBg, setUseBg] = useState(false);
  const A0 = 400, bg = 20;
  const W = 640, H = 420;

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    const padL = 54, padB = 42, padT = 30, padR = 14;
    const x0 = padL, y0 = H - padB, gw = W - padL - padR, gh = H - padB - padT;
    const tmax = 48, ymax = A0 + (useBg ? bg : 0);
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = "#c4d2cd"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x0, padT); ctx.lineTo(x0, y0); ctx.lineTo(W - padR, y0); ctx.stroke();
    ctx.fillStyle = "#60737c"; ctx.font = "11px sans-serif";
    ctx.fillText("count rate /s", 6, 14);
    ctx.fillText("time (hours)", W - 78, y0 + 30);
    for (let g = 0; g <= 4; g++) {
      const val = ymax * g / 4, yy = y0 - gh * g / 4;
      ctx.strokeStyle = "#dfe7e3"; ctx.beginPath(); ctx.moveTo(x0, yy); ctx.lineTo(W - padR, yy); ctx.stroke();
      ctx.fillStyle = "#60737c"; ctx.fillText(String(Math.round(val)), 6, yy + 4);
    }
    for (let gx = 0; gx <= tmax; gx += 12) { const xx = x0 + gw * gx / tmax; ctx.fillStyle = "#60737c"; ctx.fillText(String(gx), xx - 6, y0 + 16); }
    if (useBg) {
      const yb = y0 - gh * bg / ymax; ctx.strokeStyle = "#df8c38"; ctx.setLineDash([5, 4]);
      ctx.beginPath(); ctx.moveTo(x0, yb); ctx.lineTo(W - padR, yb); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = "#a85f17"; ctx.fillText("background", x0 + 6, yb - 4);
    }
    ctx.strokeStyle = "#173d54"; ctx.lineWidth = 2.4; ctx.beginPath();
    for (let i = 0; i <= gw; i++) {
      const tt = tmax * i / gw, N = A0 * Math.pow(0.5, tt / T) + (useBg ? bg : 0);
      const px = x0 + i, py = y0 - gh * N / ymax; if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
    const Nnow = A0 * Math.pow(0.5, time / T) + (useBg ? bg : 0);
    const mx = x0 + gw * time / tmax, my = y0 - gh * Nnow / ymax;
    ctx.strokeStyle = "#1c8b74"; ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(mx, y0); ctx.lineTo(mx, my); ctx.lineTo(x0, my); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#1c8b74"; ctx.beginPath(); ctx.arc(mx, my, 4, 0, 7); ctx.fill();
  }, [T, time, useBg]);

  const nHalf = time / T, frac = Math.pow(0.5, nHalf), Nnow = A0 * frac + (useBg ? bg : 0);
  const [hcA0, setHcA0] = useState(480);
  const [hcT, setHcT] = useState(15);
  const [hcTime, setHcTime] = useState(45);
  const hcN = hcTime / hcT, hcRem = hcA0 * Math.pow(0.5, hcN);

  return (
    <div className="lab-shell nuclear">
      <div className="lab-header">
        <div><span className="mini-label">5.2.4 · half-life</span><h3>How does count rate fall with time?</h3></div>
      </div>
      <div className="lab-grid">
        <div className="nuclear-stage tall"><canvas ref={canvasRef} width={W} height={H} aria-label="Radioactive decay curve of count rate against time" /></div>
        <div className="side">
          <label className="num-field" style={{ width: "100%" }}>Half-life (hours) <strong style={{ float: "right", color: "var(--navy)" }}>{T}</strong>
            <input type="range" min={1} max={12} value={T} onChange={(e) => setT(+e.target.value)} />
          </label>
          <label className="num-field" style={{ width: "100%" }}>Time elapsed (hours) <strong style={{ float: "right", color: "var(--navy)" }}>{time}</strong>
            <input type="range" min={0} max={48} value={time} onChange={(e) => setTime(+e.target.value)} />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--navy)", fontWeight: 700 }}>
            <input type="checkbox" checked={useBg} onChange={(e) => setUseBg(e.target.checked)} /> Include background (Supplement)
          </label>
          <table className="data-table" aria-live="polite">
            <tbody>
              <tr><th>Half-lives elapsed</th><td className="num">{Math.round(nHalf * 100) / 100}</td></tr>
              <tr><th>Fraction remaining</th><td className="num">{frac.toFixed(3)}</td></tr>
              <tr><th>Count rate now</th><td className="num">{Math.round(Nnow)} /s</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      <p className="field-note">Each half-life the source count rate halves. {useBg ? "With background included the total reading levels off near the background rate, not zero — subtract background before measuring half-life." : "Started at 400 /s; the curve approaches zero but never quite reaches it."}</p>

      <h4 style={{ margin: "18px 0 6px", font: "700 16px var(--serif)", color: "var(--navy)" }}>Half-life calculator</h4>
      <div className="inline-controls">
        <label className="num-field">Initial rate (/s)<input type="number" min={1} value={hcA0} onChange={(e) => setHcA0(+e.target.value)} /></label>
        <label className="num-field">Half-life (min)<input type="number" min={1} value={hcT} onChange={(e) => setHcT(+e.target.value)} /></label>
        <label className="num-field">Time (min)<input type="number" min={0} value={hcTime} onChange={(e) => setHcTime(+e.target.value)} /></label>
      </div>
      <p className="eqn-line" style={{ fontSize: 20 }} aria-live="polite">After {hcTime} min = {Math.round(hcN * 100) / 100} half-lives → {hcA0} × (½)<sup>{Math.round(hcN * 100) / 100}</sup> = <b>{Math.round(hcRem * 10) / 10} /s</b></p>
    </div>
  );
}

/* =====================================================================
   5.2.4 Application matcher
   ===================================================================== */
const appRows = [
  { q: "Household fire (smoke) alarm", ans: "a", why: "Alpha ionises the air in the chamber so a current flows; smoke absorbs the α and the alarm triggers. A long half-life (americium-241) keeps it working for years." },
  { q: "Measuring/controlling the thickness of foil or paper", ans: "b", why: "Beta is partly absorbed, so the amount passing through depends sensitively on thickness. A long half-life gives a steady source." },
  { q: "Sterilising surgical equipment", ans: "g", why: "Gamma penetrates sealed packaging to kill bacteria inside without opening it." },
  { q: "Irradiating food to kill bacteria", ans: "g", why: "Gamma penetrates packaged food to kill bacteria, extending shelf life." },
  { q: "Treating deep cancer tumours", ans: "g", why: "Gamma penetrates the body to reach a deep tumour and can be aimed at the cancer cells." },
] as const;
const RAD_LABEL: Record<string, string> = { a: "Alpha", b: "Beta", g: "Gamma" };
function ApplicationLab() {
  const [choices, setChoices] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);
  const correct = appRows.filter((r, i) => choices[i] === r.ans).length;
  return (
    <div className="lab-shell nuclear">
      <div className="lab-header">
        <div><span className="mini-label">5.2.4 · applications · Supplement</span><h3>Match the radiation to the use</h3></div>
      </div>
      <div className="match-list">
        {appRows.map((r, i) => (
          <div className="match-row" key={r.q}>
            <div>
              <p>{i + 1}. {r.q}</p>
              {checked && <p className="match-why">{choices[i] === r.ans ? "✓ Correct. " : `Best answer: ${RAD_LABEL[r.ans]}. `}{r.why}</p>}
            </div>
            <div className="chip-row" role="group" aria-label={`Radiation for ${r.q}`}>
              {(["a", "b", "g"] as const).map((k) => (
                <button key={k} className={choices[i] === k ? "active" : ""} aria-pressed={choices[i] === k} onClick={() => setChoices((o) => ({ ...o, [i]: k }))}>{RAD_LABEL[k]}</button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="inline-controls" style={{ marginTop: 14 }}>
        <button className="action-button" style={{ borderRadius: 999, padding: "10px 18px" }} onClick={() => setChecked(true)}>Check answers</button>
        <button className="reset-button" style={{ margin: 0 }} onClick={() => { setChoices({}); setChecked(false); }}>Reset</button>
      </div>
      {checked && <p className="field-note" aria-live="polite">Score: {correct} / {appRows.length}. The choice depends on penetration/absorption and on a suitable half-life.</p>}
    </div>
  );
}

/* =====================================================================
   5.2.5 Safety dose model
   ===================================================================== */
function SafetyLab() {
  const [time, setTime] = useState(10);
  const [distV, setDistV] = useState(10);
  const [shield, setShield] = useState(0);
  const dist = distV / 10;
  const dose = time * (1 / (dist * dist)) * Math.pow(0.5, shield / 1);
  const W = 440, H = 220, srcX = 40, y = H / 2;
  const wx = srcX + 40 + (distV / 40) * (W - 140);
  const shX = srcX + 30 + (wx - srcX - 30) * 0.5, shW = 6 + shield * 3;
  return (
    <div className="lab-shell nuclear">
      <div className="lab-header">
        <div><span className="mini-label">5.2.5 · safety · Supplement</span><h3>Which change reduces dose most?</h3></div>
        <div className="big-reading"><span>Relative dose</span><strong>{dose >= 100 ? Math.round(dose) : Math.round(dose * 10) / 10}</strong></div>
      </div>
      <div className="lab-grid">
        <div className="nuclear-stage" role="img" aria-label="A worker at a distance from a radioactive source with optional shielding">
          <svg viewBox={`0 0 ${W} ${H}`}>
            <circle cx={srcX} cy={y} r={12} fill="#cf5d45" /><text x={srcX} y={y - 20} fill="#60737c" fontSize={11} textAnchor="middle">source</text>
            {shield > 0 && <><rect x={shX - shW / 2} y={y - 40} width={shW} height={80} rx={3} fill="#586274" /><text x={shX} y={y + 56} fill="#60737c" fontSize={11} textAnchor="middle">lead {shield}cm</text></>}
            <circle cx={wx} cy={y - 8} r={8} fill="#1c8b74" /><rect x={wx - 6} y={y} width={12} height={24} rx={4} fill="#1c8b74" />
            <text x={wx} y={y + 40} fill="#60737c" fontSize={11} textAnchor="middle">{dist.toFixed(1)} m</text>
          </svg>
        </div>
        <div className="side">
          <label className="num-field" style={{ width: "100%" }}>Time near source (min) <strong style={{ float: "right", color: "var(--navy)" }}>{time}</strong>
            <input type="range" min={1} max={60} value={time} onChange={(e) => setTime(+e.target.value)} /></label>
          <label className="num-field" style={{ width: "100%" }}>Distance (m) <strong style={{ float: "right", color: "var(--navy)" }}>{dist.toFixed(1)}</strong>
            <input type="range" min={1} max={40} value={distV} onChange={(e) => setDistV(+e.target.value)} /></label>
          <label className="num-field" style={{ width: "100%" }}>Shielding (lead cm) <strong style={{ float: "right", color: "var(--navy)" }}>{shield}</strong>
            <input type="range" min={0} max={10} value={shield} onChange={(e) => setShield(+e.target.value)} /></label>
          <p className="field-note" aria-live="polite">Distance has the strongest effect because dose falls with the square of distance (double the distance → about one-quarter of the dose). Halving the time halves the dose. Each ~1 cm of lead roughly halves the dose that gets through.</p>
        </div>
      </div>
      <p className="model-caption">Relative, qualitative model to compare the effect of each factor — not an absolute dose value.</p>
    </div>
  );
}

/* ---------- shared micro-check ---------- */
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

/* ---------- checkpoint quiz data ---------- */
type QuizQuestion = { question: string; options: string[]; answer: number; why: string };
const quizQuestions: QuizQuestion[] = [
  { question: "Where is almost all the mass of an atom?", options: ["Spread evenly through the atom", "In the orbiting electrons", "In the tiny central nucleus", "In the empty space around the nucleus"], answer: 2, why: "α-scattering showed mass is concentrated in a tiny, dense nucleus, not spread out and not in the light electrons." },
  { question: "An atom loses two electrons. It becomes:", options: ["A negative ion, −2", "A positive ion, +2", "A different element", "A neutron"], answer: 1, why: "Losing negative electrons leaves more protons than electrons, giving charge +2. The proton number is unchanged, so it is the same element." },
  { question: "For the nuclide ⁴⁰₁₉K, the number of neutrons is:", options: ["19", "40", "21", "59"], answer: 2, why: "Neutrons = A − Z = 40 − 19 = 21. (19 is Z, 40 is A.)" },
  { question: "Two atoms are isotopes of the same element. They must share:", options: ["The number of neutrons", "The nucleon number A", "The proton number Z", "The same mass"], answer: 2, why: "Same proton number Z means the same element; isotopes differ in neutron number and therefore in A and mass." },
  { question: "Which radiation is the MOST ionising but LEAST penetrating?", options: ["Alpha", "Beta", "Gamma", "All equal"], answer: 0, why: "α is heavy and +2 charged: most ionising, stopped by paper. γ is least ionising and most penetrating." },
  { question: "During β⁻ decay, inside the nucleus:", options: ["A proton becomes a neutron", "A neutron becomes a proton and an electron", "An electron is captured", "A helium nucleus leaves"], answer: 1, why: "neutron → proton + electron. The electron is emitted, so Z rises by 1 while A is unchanged." },
  { question: "Radioactive decay is best described as:", options: ["Predictable and steady", "Spontaneous and random", "Caused by heating", "A chemical reaction"], answer: 1, why: "Decay is spontaneous and random in direction and timing; it is a nuclear change unaffected by heating or chemistry." },
  { question: "A source has a half-life of 5 hours. After 15 hours the count rate is:", options: ["1/3 of the start", "1/6 of the start", "1/8 of the start", "1/15 of the start"], answer: 2, why: "15 h = 3 half-lives → (½)³ = 1/8. Count rate halves each half-life, it does not divide by the hours." },
  { question: "Why is gamma used to sterilise sealed medical equipment?", options: ["It is the most ionising", "It penetrates the packaging to kill bacteria inside", "It has the shortest half-life", "It is stopped by paper"], answer: 1, why: "γ passes through sealed packaging without opening it, killing bacteria inside." },
  { question: "Which change reduces a worker's radiation dose the MOST?", options: ["Standing twice as far away", "Spending twice as long near it", "Removing all shielding", "Warming the source"], answer: 0, why: "Dose falls with the square of distance, so doubling the distance gives about one-quarter of the dose." },
];

const examQuestions = [
  { tag: "Pattern 01 · structure", marks: 4, question: "An atom is written as ²³₁₁Na. (a) State the number of protons, neutrons and electrons in the neutral atom. (b) The atom loses one electron; state the charge of the ion formed.", scheme: ["protons = 11 [1]", "neutrons = 23 − 11 = 12 [1]", "electrons = 11 in the neutral atom [1]", "ion charge = +1 (lost one −1 electron) [1]"] },
  { tag: "Pattern 02 · explain", marks: 4, question: "In α-particle scattering, most α-particles pass straight through a thin foil, a few are deflected and very few bounce back. Explain what each observation shows about the atom.", scheme: ["most pass straight → atom is mostly empty space [1]", "a few deflected → concentrated positive charge repels them [1]", "very few bounce back → nucleus is very small [1]", "…and very dense / holds most of the mass [1]"] },
  { tag: "Pattern 03 · describe", marks: 4, question: "Compare α, β and γ radiation by penetrating ability, giving the absorber that stops each.", scheme: ["α least penetrating, stopped by paper/skin [1]", "β medium, stopped by a few mm of aluminium [1]", "γ most penetrating, only reduced by thick lead/concrete [1]", "γ is not fully stopped, only attenuated [1]"] },
  { tag: "Pattern 04 · calculate", marks: 3, question: "A detector reads 68 counts/s next to a source. With the source removed the background is 14 counts/s. (a) Calculate the corrected count rate. (b) State the unit.", scheme: ["corrected = measured − background [1]", "= 68 − 14 = 54 [1]", "counts/s (counts per second) [1]"] },
  { tag: "Pattern 05 · complete", marks: 4, question: "Carbon-14 (¹⁴₆C) decays by β⁻ emission. (a) Write the decay equation, naming the daughter. (b) Explain what happens inside the nucleus.", scheme: ["¹⁴₆C → ¹⁴₇N + ⁰₋₁e, correct A and Z [1]", "daughter named as nitrogen [1]", "Z increases by 1 [1]", "a neutron changes into a proton + electron; electron emitted [1]"] },
  { tag: "Pattern 06 · describe", marks: 3, question: "Explain the difference between nuclear fission and nuclear fusion, and state what happens to mass and energy in each.", scheme: ["fission = a heavy nucleus splits into smaller nuclei [1]", "fusion = light nuclei join into a heavier nucleus [1]", "in both, a small loss of mass is released as (a large amount of) energy [1]"] },
  { tag: "Pattern 07 · calculate", marks: 5, question: "An isotope has a half-life of 8 days. A sample starts at a corrected count rate of 800 counts/min. (a) Find the count rate after 24 days. (b) A hospital tracer must leave the body quickly — explain whether a very long half-life is suitable.", scheme: ["24 days = 3 half-lives [1]", "800 → 400 → 200 → 100 [1]", "= 100 counts/min [1]", "a long half-life stays active too long, extra dose [1]", "so a short half-life is more suitable for a tracer [1]"] },
  { tag: "Pattern 08 · explain", marks: 4, question: "A worker must handle a γ-source. (a) State two harmful effects of ionising radiation on the body. (b) Describe three ways the worker can reduce their dose.", scheme: ["any two: cell death / mutation / cancer [2]", "reduce time near the source [1]", "increase distance from the source [1]", "use shielding, e.g. lead [1] (max 3 for part b)"] },
];

/* =====================================================================
   Page
   ===================================================================== */
export default function NuclearPhysicsPage() {
  const progress = useScrollProgress();
  const [menuOpen, setMenuOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const score = useMemo(() => quizQuestions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0), [answers]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try { const saved = localStorage.getItem("igcse-nuclear-progress"); if (saved) setAnswers(JSON.parse(saved)); } catch { /* ignore */ }
    });
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    try { localStorage.setItem("igcse-nuclear-progress", JSON.stringify(answers)); } catch { /* ignore */ }
  }, [answers]);

  const resetCheckpoint = () => {
    setAnswers({});
    try { localStorage.removeItem("igcse-nuclear-progress"); } catch { /* ignore */ }
  };

  return (
    <main id="top">
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <header className="topbar">
        <a href="#top" className="brand"><i>Φ</i><span>Field Notes<small>IGCSE Physics · Chapter 5</small></span></a>
        <nav aria-label="Lesson sections">
          {sections.slice(0, 5).map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          <a href="../">↑ Chapter 4</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>Contents</button>
      </header>
      {menuOpen && (
        <div className="mobile-menu">
          {sections.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a href="../" onClick={() => setMenuOpen(false)}>← Chapter 4 lesson</a>
        </div>
      )}

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Cambridge IGCSE Physics 0625 · 5 Nuclear physics</span>
          <h1>Inside the <em>nucleus</em>.</h1>
          <p>From the scattering experiment that revealed the nucleus to the random ticks of radioactive decay — explore the atom, radiation and half-life with models where every control changes real physics.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#overview">Start the lesson <span>↓</span></a>
            <a className="advanced-labs-button" href="../">Chapter 4 <span>↗</span></a>
            <span className="time-note"><b>45–70 min</b> interactive lesson</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbital"><i /><i /><i /></div>
          <div className="orbital ring-two"><i /><i /><i /></div>
          <div style={{ position: "relative", zIndex: 3, width: 96, height: 96, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--navy)", boxShadow: "0 18px 50px rgba(16,42,56,.22)" }}>
            <b style={{ font: "700 34px var(--serif)", color: "var(--mint-2)" }}>+</b>
          </div>
          <p>The atom is mostly empty space.</p>
        </div>
      </section>

      <section className="lesson-section intro-section" id="overview">
        <div className="section-heading">
          <span className="section-number">01</span>
          <div>
            <span className="eyebrow">Route map</span>
            <h2>Two ideas, six moves, one nucleus.</h2>
            <p>The 2026–2028 syllabus runs from the model of the atom to the radiation unstable nuclei emit, how fast they decay, and how we use and contain them.</p>
          </div>
        </div>
        <div className="syllabus-grid">
          {[
            ["5.1.1", "The nuclear model", "Dense positive nucleus, orbiting electrons, ions — and the α-scattering evidence for it"],
            ["5.1.2", "The nucleus", "Protons and neutrons, proton (Z) and nucleon (A) number, nuclide notation, isotopes, fission and fusion"],
            ["5.2.1", "Detecting radiation", "Background radiation and its sources, count rate and corrected count rate"],
            ["5.2.2", "Radiation types", "α, β and γ: their nature, ionising effect, penetration and deflection in fields"],
            ["5.2.3", "Radioactive decay", "Spontaneous, random change of unstable nuclei written as balanced decay equations"],
            ["5.2.4–5", "Half-life, uses & safety", "Half-life and its calculations, choosing an isotope for a job, dose and safe handling"],
          ].map(([n, title, copy]) => (
            <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
        <div className="core-supplement">
          <div><b>CORE</b><span>Build the physical picture and the standard count-rate and half-life calculations.</span></div>
          <div><b>SUPPLEMENT</b><span>Extend to scattering evidence, fission and fusion, field deflection, decay equations and dose reduction.</span></div>
        </div>
      </section>

      {/* 5.1.1–5.1.1S */}
      <section className="lesson-section" id="atom">
        <div className="section-heading">
          <span className="section-number">02</span>
          <div>
            <span className="eyebrow">5.1.1 · the nuclear model of the atom</span>
            <h2>A dense nucleus, in mostly empty space.</h2>
            <p>An atom has a tiny, positively charged nucleus containing almost all the mass, with negative electrons in orbit around it. Gaining or losing electrons forms ions.</p>
          </div>
        </div>
        <AtomBuilderLab />
        <ScatteringLab />
        <div className="micro-checks">
          <QuickCheck statement="Electrons are found inside the nucleus." answer={false} explanation="Electrons orbit around the nucleus; the nucleus contains protons and neutrons." />
          <QuickCheck statement="A neutral atom that gains an electron becomes a negative ion." answer={true} explanation="Extra negative electrons outnumber the protons, giving a net negative charge." />
        </div>
      </section>

      {/* 5.1.2 */}
      <section className="lesson-section" id="nucleus">
        <div className="section-heading">
          <span className="section-number">03</span>
          <div>
            <span className="eyebrow">5.1.2 · the nucleus</span>
            <h2>Protons and neutrons, counted by Z and A.</h2>
            <p>The nucleus is made of protons (+1) and neutrons (0); electrons are −1. Proton number Z and nucleon number A fix the composition, charge and mass.</p>
          </div>
        </div>
        <div className="concept-grid">
          <article><span className="concept-symbol">Z</span><h3>Proton number</h3><p>Number of protons. It defines the element and equals the relative nuclear charge (+Z).</p></article>
          <article><span className="concept-symbol">A</span><h3>Nucleon number</h3><p>Protons + neutrons. It equals the relative nuclear mass. Neutrons = A − Z.</p></article>
          <article><span className="concept-symbol">ᴬ_ZX</span><h3>Nuclide notation</h3><p>Nucleon number on top, proton number below, chemical symbol X.</p></article>
        </div>
        <NuclideLab />
        <IsotopeLab />
        <FissionFusionLab />
        <div className="micro-checks">
          <QuickCheck statement="Isotopes of an element have the same number of protons." answer={true} explanation="Same proton number Z means the same element; only the neutron number differs." />
          <QuickCheck statement="In fusion, a heavy nucleus splits into two lighter nuclei." answer={false} explanation="That is fission. Fusion is light nuclei joining to form a heavier nucleus." />
        </div>
      </section>

      {/* 5.2.1–5.2.2 */}
      <section className="lesson-section" id="radioactivity">
        <div className="section-heading">
          <span className="section-number">04</span>
          <div>
            <span className="eyebrow">5.2.1–5.2.2 · radioactivity</span>
            <h2>Spontaneous, random, and three kinds of emission.</h2>
            <p>Background radiation is always present. Emission from a nucleus is spontaneous and random in direction, as α, β or γ — differing in nature, ionising effect and penetration.</p>
          </div>
        </div>
        <BackgroundLab />
        <PenetrationLab />
        <DeflectionLab />
        <RadiationCompareLab />
        <div className="micro-checks">
          <QuickCheck statement="Gamma radiation is completely stopped by a thin sheet of paper." answer={false} explanation="Paper stops alpha. Gamma is the most penetrating and is only reduced by thick lead or concrete." />
          <QuickCheck statement="You can predict exactly which nucleus will decay next." answer={false} explanation="Radioactive decay is random; you cannot predict which nucleus decays or when." />
        </div>
      </section>

      {/* 5.2.3–5.2.4 */}
      <section className="lesson-section dark-section" id="decay">
        <div className="section-heading">
          <span className="section-number">05</span>
          <div>
            <span className="eyebrow">5.2.3–5.2.4 · decay &amp; half-life</span>
            <h2>Each decay changes the nucleus by a fixed rule.</h2>
            <p>α and β decay change the element; γ changes only energy. The half-life is the time for half the nuclei in a sample to decay.</p>
          </div>
        </div>
        <div className="formula-grid">
          <article><span>Alpha decay</span><b>A−4, Z−2</b><p>emits a helium nucleus ⁴₂He; becomes a new element.</p></article>
          <article><span>Beta⁻ decay</span><b>A same, Z+1</b><p>neutron → proton + electron; electron emitted.</p></article>
          <article><span>Gamma emission</span><b>A, Z same</b><p>energy only; the element does not change.</p></article>
          <article><span>Half-life</span><b>×½ each T</b><p>count rate halves every half-life.</p></article>
        </div>
        <DecayLab />
        <RandomDecayLab />
        <HalfLifeLab />
        <ApplicationLab />
      </section>

      {/* 5.2.5 */}
      <section className="lesson-section" id="safety">
        <div className="section-heading">
          <span className="section-number">06</span>
          <div>
            <span className="eyebrow">5.2.5 · uses &amp; safety</span>
            <h2>Useful, but ionising — so handle with care.</h2>
            <p>Ionising radiation can cause cell death, mutations and cancer. Reduce dose by cutting time, increasing distance and adding shielding; store sources safely.</p>
          </div>
        </div>
        <div className="safety-grid">
          <article><b>Cell death</b><p>High doses kill living cells directly.</p></article>
          <article><b>Mutation</b><p>Radiation can damage DNA and cause mutations.</p></article>
          <article><b>Cancer</b><p>Damaged cells may become cancerous.</p></article>
          <article><b>Safe storage</b><p>Handle with tongs; keep in labelled lead-lined containers, away from the body.</p></article>
        </div>
        <SafetyLab />
        <div className="micro-checks">
          <QuickCheck statement="Moving twice as far from a point source reduces the dose to about one quarter." answer={true} explanation="Dose from a point source falls with the square of the distance, so ×2 distance gives ×1/4 dose." />
          <QuickCheck statement="Warming a radioactive source speeds up its decay." answer={false} explanation="Decay rate is not affected by temperature; it is a nuclear process." />
        </div>
      </section>

      {/* Exam practice */}
      <section className="lesson-section practice-section" id="practice">
        <div className="section-heading">
          <span className="section-number">07</span>
          <div>
            <span className="eyebrow">Exam practice · nuclear physics</span>
            <h2>Answer, then reveal the mark points.</h2>
            <p>Original questions written to match common assessment patterns. Plan an answer before revealing the scheme.</p>
          </div>
        </div>
        <div className="exam-list">
          {examQuestions.map((item, index) => (
            <article className="exam-card" key={item.tag}>
              <div className="exam-meta"><span>{item.tag}</span><b>[{item.marks} marks]</b></div>
              <p>{item.question}</p>
              <textarea aria-label={`Answer for question ${index + 1}`} placeholder="Plan your answer here…" />
              <button onClick={() => setRevealed((old) => ({ ...old, [index]: !old[index] }))}>{revealed[index] ? "Hide mark points" : "Reveal mark points"}</button>
              {revealed[index] && <ol>{item.scheme.map((point) => <li key={point}>{point}</li>)}</ol>}
            </article>
          ))}
        </div>
        <div className="exam-strategy">
          <span>CALCULATE</span><b>Show working and always give the unit.</b>
          <span>DESCRIBE</span><b>State the observable pattern or change.</b>
          <span>EXPLAIN</span><b>Give cause, principle and consequence.</b>
        </div>
      </section>

      {/* Mind map */}
      <section className="lesson-section" id="mindmap">
        <div className="section-heading">
          <span className="section-number">08</span>
          <div>
            <span className="eyebrow">Retrieval map</span>
            <h2>Rebuild each branch from memory.</h2>
            <p>Cover the page and try to reconstruct the six branches, then check.</p>
          </div>
        </div>
        <div className="mindmap">
          <div className="mind-centre"><span>CHAPTER 5</span><b>Nuclear physics</b></div>
          <article className="branch b1"><span>Atom &amp; nucleus</span><p>+ nucleus, − electrons · ions gain/lose e⁻ · p +1, n 0, e −1 · Z, A, N = A−Z · notation ᴬ_ZX</p></article>
          <article className="branch b2"><span>α-scattering</span><p>most pass → empty space · few deflect → concentrated + charge · few bounce back → tiny dense nucleus</p></article>
          <article className="branch b3"><span>Isotopes · fission/fusion</span><p>same Z, different A · fission splits heavy nucleus · fusion joins light nuclei · mass → energy</p></article>
          <article className="branch b4"><span>Radiation α β γ</span><p>α He nucleus +2, paper · β electron −1, few mm Al · γ EM wave 0, thick lead · spontaneous &amp; random</p></article>
          <article className="branch b5"><span>Decay &amp; half-life</span><p>α: A−4,Z−2 · β: A same, Z+1 (n→p+e) · γ: energy only · half-life = time for half to decay</p></article>
          <article className="branch b6"><span>Uses &amp; safety</span><p>smoke alarm α · thickness β · sterilise/food/cancer γ · dose ↓ time, distance, shielding</p></article>
        </div>
      </section>

      {/* Checkpoint */}
      <section className="lesson-section quiz-section" id="checkpoint">
        <div className="section-heading">
          <span className="section-number">09</span>
          <div>
            <span className="eyebrow">Final checkpoint</span>
            <h2>Ten questions. Instant feedback.</h2>
            <p>Your answers are saved in this browser so you can return later.</p>
          </div>
        </div>
        <div className="score-card">
          <div><span>Checkpoint score</span><b>{score}<small>/{quizQuestions.length}</small></b></div>
          <div className="score-track"><i style={{ width: `${(score / quizQuestions.length) * 100}%` }} /></div>
          <span>Misconception-focused — read the feedback on every answer.</span>
        </div>
        <div className="quiz-list">
          {quizQuestions.map((question, index) => {
            const answered = answers[index] !== undefined;
            return (
              <article key={question.question}>
                <span>Q{index + 1}</span>
                <h3>{question.question}</h3>
                <div className="quiz-options">
                  {question.options.map((option, optionIndex) => {
                    const selected = answers[index] === optionIndex;
                    const state = selected ? (optionIndex === question.answer ? "correct" : "wrong")
                      : answered && optionIndex === question.answer ? "correct ghost" : "";
                    return <button className={state} key={option} onClick={() => setAnswers((old) => ({ ...old, [index]: optionIndex }))}>{option}</button>;
                  })}
                </div>
                {answered && <p className="quiz-why">{question.why}</p>}
              </article>
            );
          })}
        </div>
        <button className="reset-button" onClick={resetCheckpoint}>Reset checkpoint</button>
      </section>

      <footer>
        <div><i>Φ</i><b>Field Notes</b><span>Chapter 5 · Nuclear physics · Cambridge IGCSE Physics 0625 (2026–2028)</span></div>
        <p>Independent educational resource, not endorsed by Cambridge International Education. Interactive models are qualitative teaching aids. <a href="../">Return to the Chapter 4 lesson</a></p>
      </footer>
    </main>
  );
}
