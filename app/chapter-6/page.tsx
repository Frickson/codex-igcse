"use client";

import { useEffect, useMemo, useState } from "react";
import ChapterNav from "../ChapterNav";
import AcademyMoment from "../AcademyMoment";
import DayNightLab from "./labs/DayNightLab";
import SeasonsLab from "./labs/SeasonsLab";
import MoonPhasesLab from "./labs/MoonPhasesLab";
import OrbitalSpeedLab from "./labs/OrbitalSpeedLab";
import SolarSystemLab from "./labs/SolarSystemLab";
import OrbitGravityLab from "./labs/OrbitGravityLab";
import LightTravelLab from "./labs/LightTravelLab";
import PlanetaryDataLab from "./labs/PlanetaryDataLab";
import SunStarLab from "./labs/SunStarLab";
import LightYearLab from "./labs/LightYearLab";
import StarLifecycleLab from "./labs/StarLifecycleLab";
import RedshiftLab from "./labs/RedshiftLab";
import CMBRLab from "./labs/CMBRLab";
import HubbleLab from "./labs/HubbleLab";

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
  ["earth", "Earth & Moon"],
  ["solar", "Solar System"],
  ["stars", "Stars"],
  ["universe", "Universe"],
  ["practice", "Exam practice"],
  ["mindmap", "Mind map"],
  ["checkpoint", "Checkpoint"],
];

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

/* ---------- checkpoint / exam ---------- */
type QuizQuestion = { question: string; options: string[]; answer: number; why: string };
const quizQuestions: QuizQuestion[] = [
  {
    question: "Day and night are caused mainly by",
    options: ["Earth orbiting the Sun once a day", "Earth rotating on its axis", "The Moon blocking the Sun", "The Sun orbiting Earth"],
    answer: 1,
    why: "Earth rotates roughly once every 24 hours, so a given place moves into and out of sunlight.",
  },
  {
    question: "Seasons happen mainly because",
    options: ["Earth is much closer to the Sun in summer", "Earth's axis is tilted as it orbits the Sun", "The Moon's phases change", "The Sun's fusion rate changes each year"],
    answer: 1,
    why: "Tilt changes which hemisphere leans toward the Sun over the year — not primarily distance.",
  },
  {
    question: "Which list is the correct order from the Sun?",
    options: ["Venus, Mercury, Earth, Mars…", "Mercury, Venus, Earth, Mars…", "Mercury, Earth, Venus, Mars…", "Mars, Earth, Venus, Mercury…"],
    answer: 1,
    why: "Mercury, Venus, Earth, Mars, then the gas giants.",
  },
  {
    question: "Average orbital speed is",
    options: ["v = 2πr / T", "v = r / T", "v = 2πT / r", "v = T / 2πr"],
    answer: 0,
    why: "Distance in one orbit is about the circumference 2πr; divide by period T.",
  },
  {
    question: "A light-year measures",
    options: ["Time", "Speed", "Distance", "Temperature"],
    answer: 2,
    why: "It is the distance light travels in one year (~9.5×10¹⁵ m).",
  },
  {
    question: "After the stable period, a Sun-like star typically becomes a",
    options: ["Black hole directly", "Red giant then white dwarf", "Neutron star only", "Protostar again"],
    answer: 1,
    why: "Low/medium-mass path: red giant → planetary nebula + white dwarf.",
  },
  {
    question: "Redshift of distant galaxies is evidence that",
    options: ["Galaxies are getting bluer", "The Universe is expanding", "Stars are all cooling", "The Milky Way is the only galaxy"],
    answer: 1,
    why: "Longer observed wavelengths from recession support expansion / Big Bang.",
  },
  {
    question: "CMBR is observed",
    options: ["Only near the Sun", "Only in the galactic centre", "From all directions in space", "Only after supernovae"],
    answer: 2,
    why: "Supplement: microwave background fills the sky — stretched early radiation.",
  },
  {
    question: "Hubble's constant is",
    options: ["H₀ = v × d", "H₀ = v / d", "H₀ = d / v²", "H₀ = 2πr / T"],
    answer: 1,
    why: "H₀ = recessional speed divided by distance.",
  },
  {
    question: "An estimate of the age of the Universe is",
    options: ["H₀", "1 / H₀", "v × d", "2πr"],
    answer: 1,
    why: "Winding expansion back gives a timescale of order 1/H₀.",
  },
];

type ExamQuestion = { tag: string; marks: number; question: string; scheme: string[] };
const examQuestions: ExamQuestion[] = [
  {
    tag: "Q1 · calculate",
    marks: 3,
    question: "A moon orbits a planet with average radius 4.0 × 10⁸ m and period 2.0 × 10⁶ s. Calculate its average orbital speed.",
    scheme: [
      "v = 2πr / T (1)",
      "v = 2π × 4.0×10⁸ / 2.0×10⁶ (1)",
      "v = 1.3 × 10³ m/s (2 s.f. / consistent rounding) (1)",
    ],
  },
  {
    tag: "Q2 · explain",
    marks: 3,
    question: "Explain why it is summer in the Northern Hemisphere when it is winter in the Southern Hemisphere.",
    scheme: [
      "Earth's axis is tilted (1)",
      "During northern summer the Northern Hemisphere leans toward the Sun (1)",
      "The Southern Hemisphere then leans away / receives less direct sunlight / shorter days (1)",
    ],
  },
  {
    tag: "Q3 · describe",
    marks: 3,
    question: "Describe the differences between the four planets nearest the Sun and the four furthest, and link one difference to the accretion model.",
    scheme: [
      "Inner: rocky / smaller; outer: gaseous / larger (1)",
      "Any second clear contrast (density, moons, rings, etc.) (1)",
      "Nearer the Sun only rock/metal condensed / outer ices and gases could build giants (1)",
    ],
  },
  {
    tag: "Q4 · calculate",
    marks: 2,
    question: "Light travels at 3.0 × 10⁸ m/s. How long does light take to travel 1.5 × 10¹¹ m from the Sun to Earth?",
    scheme: [
      "t = d/c = 1.5×10¹¹ / 3.0×10⁸ (1)",
      "t = 500 s (≈ 8.3 min) (1)",
    ],
  },
  {
    tag: "Q5 · explain",
    marks: 3,
    question: "Explain what keeps Earth in orbit around the Sun.",
    scheme: [
      "The Sun's gravitational attraction / gravity (1)",
      "Sun holds most of the Solar System's mass (1)",
      "Gravity provides the inward (centripetal) force for the orbit (1)",
    ],
  },
  {
    tag: "Q6 · describe",
    marks: 4,
    question: "Outline the life cycle of a star much more massive than the Sun, from nebula to remnant.",
    scheme: [
      "Nebula → protostar → stable massive star (1)",
      "Red supergiant (1)",
      "Supernova (1)",
      "Neutron star or black hole (1)",
    ],
  },
  {
    tag: "Q7 · explain",
    marks: 3,
    question: "Explain how redshift of light from distant galaxies supports the Big Bang theory.",
    scheme: [
      "Observed wavelength longer / spectral lines shifted to red (1)",
      "Suggests galaxies are receding / space expanding (1)",
      "Winding expansion back → matter once closer / hot dense beginning (1)",
    ],
  },
  {
    tag: "Q8 · calculate",
    marks: 3,
    question: "A galaxy recedes at 6.6 × 10⁵ m/s and is 3.0 × 10²³ m away. Calculate H₀ = v/d and estimate the age of the Universe as 1/H₀.",
    scheme: [
      "H₀ = v/d = 6.6×10⁵ / 3.0×10²³ = 2.2×10⁻¹⁸ s⁻¹ (1)",
      "Age = 1/H₀ = 4.5×10¹⁷ s (1)",
      "≈ 1.4×10¹⁰ years (order-of-magnitude OK) (1)",
    ],
  },
  {
    tag: "Q9 · describe",
    marks: 2,
    question: "State what CMBR is and where it is detected.",
    scheme: [
      "Cosmic microwave background radiation / leftover early-Universe radiation now in microwave band (1)",
      "Detected from all directions / everywhere in space around us (1)",
    ],
  },
  {
    tag: "Q10 · explain",
    marks: 3,
    question: "In an elliptical orbit, a planet moves faster when closer to the Sun. Explain in terms of energy.",
    scheme: [
      "Closer → lower gravitational potential energy (1)",
      "Total energy conserved (1)",
      "So kinetic energy / speed is greater near the Sun (1)",
    ],
  },
];

/* =====================================================================
   Page
   ===================================================================== */
export default function SpacePhysicsPage() {
  const progress = useScrollProgress();
  const [menuOpen, setMenuOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const score = useMemo(() => quizQuestions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0), [answers]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try { const saved = localStorage.getItem("igcse-space-progress"); if (saved) setAnswers(JSON.parse(saved)); } catch { /* ignore */ }
    });
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    try { localStorage.setItem("igcse-space-progress", JSON.stringify(answers)); } catch { /* ignore */ }
  }, [answers]);

  const resetCheckpoint = () => {
    setAnswers({});
    try { localStorage.removeItem("igcse-space-progress"); } catch { /* ignore */ }
  };

  return (
    <main id="top">
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <header className="topbar">
        <a href="#top" className="brand"><i>Φ</i><span>Field Notes<small>IGCSE Physics · Chapter 6</small></span></a>
        <nav aria-label="Lesson sections">
          {sections.slice(0, 5).map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
          <a href="../chapters/">All chapters</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen}>Contents</button>
      </header>
      {menuOpen && (
        <div className="mobile-menu">
          {sections.map(([id, label]) => <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a href="../chapters/" onClick={() => setMenuOpen(false)}>All chapters</a>
          <a href="../chapter-5/" onClick={() => setMenuOpen(false)}>Chapter 5 lesson →</a>
        </div>
      )}

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Cambridge IGCSE Physics 0625 · 6 Space physics</span>
          <h1>Orbit the Sun, then <em>read</em> the expanding sky.</h1>
          <p>From day and night on a tilted Earth to stellar life cycles, redshift and the Hubble age estimate — build Topic 6 with models where every control changes a real orbital, stellar or cosmological idea.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#overview">Start the lesson <span>↓</span></a>
            <span className="time-note"><b>60–85 min</b> interactive lesson</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbital"><i /><i /><i /></div>
          <div style={{ position: "relative", zIndex: 3, width: 96, height: 96, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--navy)", boxShadow: "0 18px 50px rgba(16,42,56,.22)" }}>
            <b style={{ font: "700 18px var(--serif)", color: "var(--mint-2)" }}>H₀=v/d</b>
          </div>
          <p>Gravity binds orbits; redshift maps expansion.</p>
        </div>
      </section>

      <section className="lesson-section intro-section" id="overview">
        <div className="section-heading">
          <span className="section-number">01</span>
          <div>
            <span className="eyebrow">Route map</span>
            <h2>Two scales, one gravitational story.</h2>
            <p>The 2026–2028 syllabus runs from Earth&apos;s rotation and seasons, through the Solar System and orbital gravity, to stars, galaxies, redshift and evidence for the Big Bang.</p>
          </div>
        </div>
        <div className="syllabus-grid">
          {[
            ["6.1.1", "Earth & Moon", "Day and night, seasons, Moon phases, and (Supplement) average orbital speed"],
            ["6.1.2", "The Solar System", "Planets, accretion, gravity, light travel time, elliptical orbits and planetary data"],
            ["6.2.1–6.2.2", "Sun & stars", "The Sun as a star, light-years, and the full stellar life cycle"],
            ["6.2.3", "The Universe", "Milky Way scale, redshift, CMBR, Hubble’s constant and the age estimate"],
            ["Practice", "Exam habits", "Calculate with units; describe patterns; explain with cause and consequence"],
            ["Checkpoint", "Retrieve", "Ten misconception-focused questions saved in this browser"],
          ].map(([n, title, copy]) => (
            <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
        <div className="core-supplement">
          <div><b>CORE</b><span>Earth–Moon–Sun geometry, Solar System structure, gravity keeping planets in orbit, stellar life cycle, redshift and expansion evidence.</span></div>
          <div><b>SUPPLEMENT</b><span>Orbital speed formula, elliptical orbits and energy, planetary data analysis, fusion power, CMBR, Hubble constant and Universe age.</span></div>
        </div>
      </section>

      {/* 6.1.1 */}
      <section className="lesson-section" id="earth">
        <div className="section-heading">
          <span className="section-number">02</span>
          <div>
            <span className="eyebrow">6.1.1 · the Earth</span>
            <h2>Spin for day, tilt for seasons, orbit for the Moon&apos;s face.</h2>
            <p>Earth rotates once in about 24 hours on a tilted axis, orbits the Sun in about 365 days, and the Moon takes about a month to orbit Earth — producing day/night, seasons and phases.</p>
          </div>
        </div>
        <AcademyMoment question="If Earth is closer to the Sun in January than July, why is January still winter in the Northern Hemisphere?" from="Earth's axis is tilted" change="Sun angle and daylight duration change during orbit" to="Each hemisphere receives different energy per unit area" steps={["Rotation produces day and night.", "Tilt changes the height of the Sun and day length.", "The orbit changes which hemisphere tilts toward the Sun."]} label="COMMON MISTAKE" note="Seasons are caused by axial tilt, not by Earth being dramatically nearer or farther from the Sun." />
        <DayNightLab />
        <SeasonsLab />
        <MoonPhasesLab />
        <OrbitalSpeedLab />
        <div className="micro-checks">
          <QuickCheck statement="Day and night happen because the Earth orbits the Sun once per day." answer={false} explanation="Day and night come from Earth rotating on its axis roughly once every 24 hours. The year-long orbit around the Sun is what (with the tilt) drives the seasons." />
          <QuickCheck statement="The Moon's phases repeat because the Moon orbits the Earth about once a month." answer={true} explanation="As the Moon orbits, we see different fractions of its sunlit hemisphere — the cycle of phases takes about a month." />
        </div>
      </section>

      {/* 6.1.2 */}
      <section className="lesson-section" id="solar">
        <div className="section-heading">
          <span className="section-number">03</span>
          <div>
            <span className="eyebrow">6.1.2 · the Solar System</span>
            <h2>One star, eight planets, and gravity that falls with distance.</h2>
            <p>Name the planets in order, contrast rocky inner worlds with giant outer ones via accretion, and use the Sun&apos;s gravity to keep objects in orbit.</p>
          </div>
        </div>
        <AcademyMoment tone="blue" question="Why does a planet keep falling toward the Sun without crashing into it?" from="Planet has sideways velocity" change="Gravity continually bends its path inward" to="A curved orbit forms" steps={["Gravity supplies the centripetal force.", "Velocity is tangent to the orbit.", "The planet continuously falls around the Sun."]} label="ANDREW'S TIP" note="An orbit does not mean gravity has disappeared. Gravity is exactly what keeps changing the direction of velocity." />
        <SolarSystemLab />
        <OrbitGravityLab />
        <LightTravelLab />
        <PlanetaryDataLab />
        <div className="micro-checks">
          <QuickCheck statement="The four planets nearest the Sun are gaseous and large." answer={false} explanation="The four nearest are rocky and relatively small; the four furthest are gaseous and large — a pattern the accretion model helps explain." />
          <QuickCheck statement="The force that keeps Earth in orbit around the Sun is the Sun's gravitational attraction." answer={true} explanation="The Sun holds most of the Solar System's mass, so its gravity provides the centripetal force for planetary orbits." />
        </div>
      </section>

      {/* 6.2.1–6.2.2 */}
      <section className="lesson-section" id="stars">
        <div className="section-heading">
          <span className="section-number">04</span>
          <div>
            <span className="eyebrow">6.2.1–6.2.2 · the Sun &amp; stars</span>
            <h2>A medium star that fuses hydrogen — then a life cycle for every mass.</h2>
            <p>The Sun is mostly hydrogen and helium and radiates IR, visible and UV. Distances jump to light-years; massive and less-massive stars take different paths after the fuel runs out.</p>
          </div>
        </div>
        <AcademyMoment tone="amber" question="What single property decides whether a star becomes a white dwarf or eventually a neutron star/black hole?" from="A star forms from a nebula" change="Initial mass controls pressure, fuel use and core collapse" to="Different stellar life-cycle branch" steps={["Gravity compresses the protostar.", "Fusion balances gravity on the main sequence.", "When fuel runs out, mass determines the final stages."]} label="CAMBRIDGE EXAM FOCUS" note="Do not memorise one long life cycle. Split it at stellar mass: Sun-like and massive stars share the early stages, then diverge." />
        <SunStarLab />
        <LightYearLab />
        <StarLifecycleLab />
        <div className="micro-checks">
          <QuickCheck statement="The Sun is a medium-sized star made mostly of hydrogen and helium." answer={true} explanation="That is the Core description: medium size, mostly H and He, radiating mainly in IR, visible and UV." />
          <QuickCheck statement="A light-year is a unit of time equal to one year." answer={false} explanation="A light-year is a distance — how far light travels in one year in vacuum (about 9.5 × 10¹⁵ m)." />
        </div>
      </section>

      {/* 6.2.3 */}
      <section className="lesson-section" id="universe">
        <div className="section-heading">
          <span className="section-number">05</span>
          <div>
            <span className="eyebrow">6.2.3 · the Universe</span>
            <h2>Redshift, CMBR and a Hubble clock for the Big Bang.</h2>
            <p>Distant galaxies look redshifted; that expansion, with CMBR and H₀ = v/d, supports the idea that the Universe began from a hot dense state.</p>
          </div>
        </div>
        <AcademyMoment tone="coral" question="Why does redshift support expansion rather than simply proving galaxies are red?" from="Known spectral lines are emitted" change="The whole pattern shifts to longer wavelength" to="Galaxy is receding; distant galaxies recede faster" steps={["Match the observed and laboratory line patterns.", "Measure the fractional wavelength increase.", "Combine v with distance through H₀ = v/d."]} label="COMMON MISTAKE" note="Redshift is a shift of identifiable spectral lines, not merely a red-looking photograph. It is evidence of recession and cosmic expansion." />
        <RedshiftLab />
        <CMBRLab />
        <HubbleLab />
        <div className="micro-checks">
          <QuickCheck statement="Redshift means the observed wavelength of light from a receding galaxy is longer than when it was emitted." answer={true} explanation="Redshift is an increase in observed wavelength for receding sources — distant galaxies appear redshifted compared with light emitted on Earth." />
          <QuickCheck statement="CMBR is only detected near the Milky Way's centre." answer={false} explanation="Supplement: cosmic microwave background radiation is observed at all points in space around us — leftover radiation stretched into the microwave band as the Universe expanded." />
        </div>
      </section>

      {/* Exam practice */}
      <section className="lesson-section practice-section" id="practice">
        <div className="section-heading">
          <span className="section-number">06</span>
          <div>
            <span className="eyebrow">Exam practice · space physics</span>
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
          <span className="section-number">07</span>
          <div>
            <span className="eyebrow">Retrieval map</span>
            <h2>Rebuild each branch from memory.</h2>
            <p>Cover the page and try to reconstruct the six branches, then check.</p>
          </div>
        </div>
        <div className="mindmap">
          <div className="mind-centre"><span>CHAPTER 6</span><b>Space physics</b></div>
          <article className="branch b1"><span>Earth &amp; Moon</span><p>Rotation → day/night · tilt + orbit → seasons · Moon orbit → phases · v = 2πr/T</p></article>
          <article className="branch b2"><span>Solar System</span><p>Sun + 8 planets · rocky in / gas out · accretion · gravity · light time</p></article>
          <article className="branch b3"><span>Orbits</span><p>Sun&apos;s mass · g falls with distance · elliptical speed &amp; energy</p></article>
          <article className="branch b4"><span>Sun &amp; stars</span><p>Medium star · H/He · fusion · light-years · life cycle</p></article>
          <article className="branch b5"><span>Galaxies</span><p>Milky Way · billions of galaxies · 100 000 ly across</p></article>
          <article className="branch b6"><span>Universe</span><p>Redshift · expansion · Big Bang · CMBR · H₀ = v/d · age ≈ 1/H₀</p></article>
        </div>
      </section>

      {/* Checkpoint */}
      <section className="lesson-section quiz-section" id="checkpoint">
        <div className="section-heading">
          <span className="section-number">08</span>
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

      <ChapterNav current={6} prefix="../" />

      <footer>
        <div><i>Φ</i><b>Field Notes</b><span>Chapter 6 · Space physics · Cambridge IGCSE Physics 0625 (2026–2028)</span></div>
        <p>Independent educational resource, not endorsed by Cambridge International Education. Interactive models are qualitative teaching aids. <a href="../chapter-5/">Return to the Chapter 5 lesson</a></p>
      </footer>
    </main>
  );
}
