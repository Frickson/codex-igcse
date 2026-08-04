"use client";

import { useEffect, useMemo, useState } from "react";
import ChapterNav from "../ChapterNav";
import AcademyMoment from "../AcademyMoment";
import StatesOfMatterLab from "./labs/StatesOfMatterLab";
import ParticleTempLab from "./labs/ParticleTempLab";
import BrownianLab from "./labs/BrownianLab";
import GasPressureLab from "./labs/GasPressureLab";
import ExpansionLab from "./labs/ExpansionLab";
import SpecificHeatLab from "./labs/SpecificHeatLab";
import PhaseChangeLab from "./labs/PhaseChangeLab";
import EvaporationLab from "./labs/EvaporationLab";
import ConductionLab from "./labs/ConductionLab";
import ConvectionLab from "./labs/ConvectionLab";
import RadiationLab from "./labs/RadiationLab";

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
  ["particles", "Particles"],
  ["gases", "Gases"],
  ["properties", "Thermal properties"],
  ["transfer", "Energy transfer"],
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

/* ---------- checkpoint / exam data ---------- */
type QuizQuestion = { question: string; options: string[]; answer: number; why: string };
const quizQuestions: QuizQuestion[] = [
  {
    question: "Which state has particles farthest apart on average?",
    options: ["Solid", "Liquid", "Gas", "All the same"],
    answer: 2,
    why: "Gas particles move freely with much larger average separation than solids or liquids.",
  },
  {
    question: "Absolute zero on the Celsius scale is",
    options: ["0 °C", "−100 °C", "−273 °C", "273 °C"],
    answer: 2,
    why: "Absolute zero is −273 °C (0 K), where particles have least kinetic energy.",
  },
  {
    question: "Brownian motion of a smoke particle is best explained by",
    options: ["The particle vibrating by itself", "Random collisions with fast fluid molecules", "Gravity pulling unevenly", "Magnetic forces in air"],
    answer: 1,
    why: "Invisible molecules hit the larger microscopic particle from changing directions.",
  },
  {
    question: "A fixed mass of gas is heated at constant volume. Pressure",
    options: ["Falls", "Stays the same", "Rises", "Becomes zero"],
    answer: 2,
    why: "Faster particles collide with the walls more often and harder, so pressure rises.",
  },
  {
    question: "Convert 27 °C to kelvin.",
    options: ["27 K", "246 K", "300 K", "373 K"],
    answer: 2,
    why: "T(K) = θ(°C) + 273 → 27 + 273 = 300 K.",
  },
  {
    question: "For the same temperature rise at constant pressure, which expands most?",
    options: ["Solid", "Liquid", "Gas", "They expand equally"],
    answer: 2,
    why: "Gases expand most; solids least — particle attractions and spacing differ.",
  },
  {
    question: "Energy to raise 2 kg of water (c = 4200 J/kg °C) by 5 °C is",
    options: ["840 J", "4200 J", "42 000 J", "84 000 J"],
    answer: 2,
    why: "ΔE = m c Δθ = 2 × 4200 × 5 = 42 000 J.",
  },
  {
    question: "While pure ice melts at 0 °C, its temperature",
    options: ["Rises steadily", "Falls", "Stays at 0 °C", "Jumps to 100 °C"],
    answer: 2,
    why: "Energy goes into changing state, not into raising average KE, so temperature is constant.",
  },
  {
    question: "The best emitter of infrared among these surfaces is",
    options: ["Shiny silver", "Dull white", "Dull black", "Clear glass"],
    answer: 2,
    why: "Dull black surfaces are the best emitters (and absorbers) of infrared radiation.",
  },
  {
    question: "Convection in a fluid happens because heating changes",
    options: ["Colour only", "Density", "Chemical formula", "Magnetic field"],
    answer: 1,
    why: "Warm fluid is less dense and rises; cooler denser fluid sinks — a convection current.",
  },
];

type ExamQuestion = { tag: string; marks: number; question: string; scheme: string[] };
const examQuestions: ExamQuestion[] = [
  {
    tag: "Q1 · describe",
    marks: 3,
    question: "Describe the arrangement and motion of particles in a solid and in a gas.",
    scheme: [
      "Solid: regular/lattice arrangement; particles vibrate about fixed positions (1)",
      "Gas: random/irregular; particles far apart (1)",
      "Gas: free motion in all directions / frequent collisions (1)",
    ],
  },
  {
    tag: "Q2 · explain",
    marks: 3,
    question: "Explain, in terms of particles, why the pressure of a fixed mass of gas increases when its volume is reduced at constant temperature.",
    scheme: [
      "Same number of particles in a smaller volume / particles closer on average (1)",
      "Collisions with the walls more frequent (1)",
      "Pressure is force per unit area from these collisions, so pressure rises (1)",
    ],
  },
  {
    tag: "Q3 · calculate",
    marks: 3,
    question: "A sealed syringe holds gas at 100 kPa and 40 cm³. At constant temperature the volume becomes 25 cm³. Calculate the new pressure. (pV = constant)",
    scheme: [
      "p₁V₁ = p₂V₂ (1)",
      "p₂ = (100 × 40) / 25 (1)",
      "p₂ = 160 kPa (1)",
    ],
  },
  {
    tag: "Q4 · calculate",
    marks: 3,
    question: "How much energy is needed to raise the temperature of 0.40 kg of aluminium (c = 900 J/kg °C) from 20 °C to 70 °C?",
    scheme: [
      "Δθ = 50 °C (1)",
      "ΔE = m c Δθ = 0.40 × 900 × 50 (1)",
      "ΔE = 18 000 J (1)",
    ],
  },
  {
    tag: "Q5 · explain",
    marks: 3,
    question: "A pan of water is heated on a stove. Explain why the water temperature stays at 100 °C while it boils.",
    scheme: [
      "Boiling occurs at a fixed temperature (at standard pressure) (1)",
      "Energy supplied goes into changing liquid → gas / overcoming attractions (1)",
      "Average kinetic energy of particles (hence temperature) does not rise during the change of state (1)",
    ],
  },
  {
    tag: "Q6 · describe",
    marks: 3,
    question: "State three factors that increase the rate of evaporation of a puddle, and link one of them to particle behaviour.",
    scheme: [
      "Higher temperature / larger surface area / air movement (draught) — any three (2)",
      "e.g. higher T → more particles have enough energy to escape the surface (1)",
    ],
  },
  {
    tag: "Q7 · explain",
    marks: 3,
    question: "Explain why copper is a better thermal conductor than wood.",
    scheme: [
      "Copper has free/delocalised electrons that transfer energy quickly (1)",
      "Both also transfer energy by lattice/particle vibrations (1)",
      "Wood lacks free electrons / energy transfer by vibration only is slower (1)",
    ],
  },
  {
    tag: "Q8 · explain",
    marks: 3,
    question: "Explain how a convection current forms above a radiator in a room.",
    scheme: [
      "Air near the radiator is heated and expands / becomes less dense (1)",
      "Warm air rises (1)",
      "Cooler denser air sinks to replace it, forming a circulation (1)",
    ],
  },
  {
    tag: "Q9 · describe",
    marks: 2,
    question: "Compare dull black and shiny silver surfaces as emitters and absorbers of infrared radiation.",
    scheme: [
      "Dull black: good emitter and good absorber (1)",
      "Shiny silver: poor emitter and poor absorber / good reflector (1)",
    ],
  },
  {
    tag: "Q10 · explain",
    marks: 4,
    question: "A wood fire heats a room. Explain how conduction, convection and radiation each play a part.",
    scheme: [
      "Conduction: heat through the grate/metal parts or into logs (1)",
      "Radiation: infrared from the flames/embers warms people and walls directly (1)",
      "Convection: warm air rises and circulates around the room (1)",
      "More than one method is significant — credit clear linking of each (1)",
    ],
  },
];

/* =====================================================================
   Page
   ===================================================================== */
export default function ThermalPhysicsPage() {
  const progress = useScrollProgress();
  const [menuOpen, setMenuOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const score = useMemo(() => quizQuestions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0), [answers]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try { const saved = localStorage.getItem("igcse-thermal-progress"); if (saved) setAnswers(JSON.parse(saved)); } catch { /* ignore */ }
    });
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    try { localStorage.setItem("igcse-thermal-progress", JSON.stringify(answers)); } catch { /* ignore */ }
  }, [answers]);

  const resetCheckpoint = () => {
    setAnswers({});
    try { localStorage.removeItem("igcse-thermal-progress"); } catch { /* ignore */ }
  };

  return (
    <main id="top">
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <header className="topbar">
        <a href="#top" className="brand"><i>Φ</i><span>Field Notes<small>IGCSE Physics · Chapter 2</small></span></a>
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
          <a href="../" onClick={() => setMenuOpen(false)}>Home →</a>
        </div>
      )}

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Cambridge IGCSE Physics 0625 · 2 Thermal physics</span>
          <h1>Heat the particles,<br />then <em>watch</em> energy move.</h1>
          <p>From solid–liquid–gas diagrams to pans, radiators and Earth&apos;s radiation balance — build the thermal toolkit with models where every slider changes real particle behaviour, expansion, specific heat and energy transfer.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#overview">Start the lesson <span>↓</span></a>
            <span className="time-note"><b>55–80 min</b> interactive lesson</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbital"><i /><i /><i /></div>
          <div className="thermal-hero-badge" aria-hidden="true">
            <b>ΔE = mcΔθ</b>
          </div>
          <p>Particles store and transfer heat.</p>
        </div>
      </section>

      <section className="lesson-section intro-section" id="overview">
        <div className="section-heading">
          <span className="section-number">01</span>
          <div>
            <span className="eyebrow">Route map</span>
            <h2>Three ideas, one thermal toolkit.</h2>
            <p>The 2026–2028 syllabus runs from the kinetic particle model, through thermal properties and temperature, to conduction, convection and radiation.</p>
          </div>
        </div>
        <div className="syllabus-grid">
          {[
            ["2.1.1–2.1.2", "States & particles", "Solid, liquid and gas structure; temperature and absolute zero; Brownian motion as evidence"],
            ["2.1.3", "Gases & absolute scale", "Pressure changes with temperature or volume; convert °C ↔ K; pV = constant"],
            ["2.2.1–2.2.2", "Expansion & heat capacity", "Thermal expansion, internal energy and specific heat capacity c = ΔE/(mΔθ)"],
            ["2.2.3", "Melting, boiling & evaporation", "Phase change at constant temperature; evaporation cools; factors that speed it up"],
            ["2.3.1–2.3.2", "Conduction & convection", "Good vs bad conductors; density-driven convection in fluids"],
            ["2.3.3–2.3.4", "Radiation & consequences", "Infrared emission and absorption; energy balance; everyday applications"],
          ].map(([n, title, copy]) => (
            <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
        <div className="core-supplement">
          <div><b>CORE</b><span>Build the particle picture, qualitative gas behaviour, expansion, phase change and the three transfer methods.</span></div>
          <div><b>SUPPLEMENT</b><span>Extend to pV = constant, specific heat calculations, boiling vs evaporation, free-electron conduction and multi-mode applications.</span></div>
        </div>
      </section>

      {/* 2.1.1–2.1.2 */}
      <section className="lesson-section" id="particles">
        <div className="section-heading">
          <span className="section-number">02</span>
          <div>
            <span className="eyebrow">2.1 · kinetic particle model</span>
            <h2>Same particles, different arrangement and motion.</h2>
            <p>Solids, liquids and gases differ in how tightly particles pack and how freely they move. Temperature tracks particle kinetic energy — down to absolute zero.</p>
          </div>
        </div>
        <AcademyMoment question="When ice melts, do its particles become a different substance?" from="Same particles" change="Energy changes their motion and separation" to="State changes; substance stays the same" steps={["Particles exist in every state.", "Heating raises kinetic energy or overcomes attractions.", "Arrangement and freedom of motion explain properties."]} label="COMMON MISTAKE" note="The particles themselves do not expand, melt or disappear. Their spacing, motion and arrangement change." />
        <StatesOfMatterLab />
        <ParticleTempLab />
        <BrownianLab />
        <div className="micro-checks">
          <QuickCheck statement="Liquids have particles that are much farther apart than in solids." answer={false} explanation="Liquid particles are still close together — similar spacing to a solid — but they can slide past each other, so a liquid flows and takes the container's shape." />
          <QuickCheck statement="Absolute zero is −273 °C, where particles have the least kinetic energy." answer={true} explanation="There is a lowest possible temperature (−273 °C = 0 K). At absolute zero the particles have least kinetic energy." />
          <QuickCheck statement="Brownian motion is evidence that fluid particles (atoms/molecules) are moving and colliding randomly." answer={true} explanation="The visible speck jitters because countless unseen fast molecules hit it from changing directions." />
        </div>
      </section>

      {/* 2.1.3 */}
      <section className="lesson-section" id="gases">
        <div className="section-heading">
          <span className="section-number">03</span>
          <div>
            <span className="eyebrow">2.1.3 · gases &amp; the absolute scale</span>
            <h2>Collisions set the pressure.</h2>
            <p>Warm a fixed-volume gas and particles hit the walls harder and more often. Squeeze the volume at fixed temperature and the same mass collides more frequently — pressure rises.</p>
          </div>
        </div>
        <AcademyMoment tone="coral" question="Why does pressure rise when a sealed gas is heated at fixed volume?" from="Temperature rises" change="Particles move faster" to="Harder, more frequent wall collisions" steps={["Temperature tracks average kinetic energy.", "Faster particles change momentum more rapidly at the wall.", "Greater force per area means greater pressure."]} label="CAMBRIDGE EXAM FOCUS" note="For gas-pressure explanations, always connect temperature → particle speed → collision frequency/force → pressure." />
        <GasPressureLab />
        <div className="micro-checks">
          <QuickCheck statement="Halving the volume of a fixed mass of gas at constant temperature roughly doubles its pressure." answer={true} explanation="Supplement: pV = constant at fixed temperature, so half the volume means twice the pressure — more frequent wall collisions." />
          <QuickCheck statement="20 °C is the same as 20 K on the absolute scale." answer={false} explanation="Convert with T(K) = θ(°C) + 273, so 20 °C = 293 K. Equal numbers in °C and K only coincide near absolute zero in a misleading way — never treat them as the same scale." />
        </div>
      </section>

      {/* 2.2 */}
      <section className="lesson-section" id="properties">
        <div className="section-heading">
          <span className="section-number">04</span>
          <div>
            <span className="eyebrow">2.2 · thermal properties &amp; temperature</span>
            <h2>Heat in: expand, warm up, or change state.</h2>
            <p>Energy can stretch particle spacing (expansion), raise average kinetic energy (temperature), or break attractions during melting and boiling without a temperature rise.</p>
          </div>
        </div>
        <AcademyMoment tone="amber" question="Why can energy enter boiling water without increasing its temperature?" from="At the boiling point" change="Energy overcomes particle attractions" to="State changes at constant temperature" steps={["Temperature depends on average kinetic energy.", "During the plateau, energy increases potential energy instead.", "Particles separate into the gas state."]} label="COMMON MISTAKE" note="A flat heating-curve section does not mean no energy is supplied. It means the energy is changing state, not temperature." />
        <ExpansionLab />
        <SpecificHeatLab />
        <PhaseChangeLab />
        <EvaporationLab />
        <div className="micro-checks">
          <QuickCheck statement="For the same temperature rise at constant pressure, a gas expands more than a solid." answer={true} explanation="Gas particles are weakly bound and far apart, so heating at constant pressure produces the largest expansion; solids expand least." />
          <QuickCheck statement="During boiling, water's temperature keeps rising as you add energy." answer={false} explanation="At the boiling point the temperature stays constant while the energy goes into changing liquid into gas." />
          <QuickCheck statement="Evaporation can cool a liquid even when the surroundings are warmer than the boiling point." answer={true} explanation="Evaporation happens at the surface at any temperature. Escaping energetic particles leave behind a cooler liquid — that is why sweat cools you." />
        </div>
      </section>

      {/* 2.3 */}
      <section className="lesson-section" id="transfer">
        <div className="section-heading">
          <span className="section-number">05</span>
          <div>
            <span className="eyebrow">2.3 · transfer of thermal energy</span>
            <h2>Conduction, convection, radiation — three routes out.</h2>
            <p>Energy leaves hot objects through particle vibration and free electrons, density-driven fluid currents, and infrared radiation that needs no medium.</p>
          </div>
        </div>
        <AcademyMoment tone="blue" question="Which method can transfer thermal energy through empty space?" from="A temperature difference" change="Infrared radiation is emitted" to="Energy crosses without particles" steps={["Conduction needs neighbouring particles or electrons.", "Convection needs moving fluid.", "Radiation is an electromagnetic wave and needs no medium."]} label="ANDREW'S TIP" note="First ask whether matter is present and moving. That quickly separates conduction, convection and radiation." />
        <ConductionLab />
        <ConvectionLab />
        <RadiationLab />
        <div className="micro-checks">
          <QuickCheck statement="Thermal radiation needs air or another medium to travel." answer={false} explanation="Infrared radiation transfers energy without a medium — that is why Sunlight reaches Earth through space." />
          <QuickCheck statement="A dull black surface is both a good emitter and a good absorber of infrared." answer={true} explanation="Dull black ranks highest for emission and absorption; shiny silver is poor at both and reflects well." />
          <QuickCheck statement="A car radiator mainly cools the engine by trapping heat inside the metal fins." answer={false} explanation="Supplement multi-mode idea: hot coolant transfers energy to metal (conduction), air flow removes energy by convection, and hot surfaces also radiate — the design increases area to speed all of these." />
        </div>
      </section>

      {/* Exam practice */}
      <section className="lesson-section practice-section" id="practice">
        <div className="section-heading">
          <span className="section-number">06</span>
          <div>
            <span className="eyebrow">Exam practice · thermal physics</span>
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
          <div className="mind-centre"><span>CHAPTER 2</span><b>Thermal physics</b></div>
          <article className="branch b1"><span>States &amp; particles</span><p>solid fixed · liquid close, slide · gas far, fast · absolute zero −273 °C · Brownian evidence</p></article>
          <article className="branch b2"><span>Gases</span><p>pressure = collisions · ↑T → ↑p (const V) · ↓V → ↑p (const T) · T(K)=θ+273 · pV=const</p></article>
          <article className="branch b3"><span>Expansion &amp; c</span><p>heat → expand · gas ≫ liquid &gt; solid · internal energy ↑ · c = ΔE/(mΔθ)</p></article>
          <article className="branch b4"><span>Phase change</span><p>melt/boil at const T · water 0 °C / 100 °C · evaporation cools · ↑T, area, draught → faster</p></article>
          <article className="branch b5"><span>Conduction &amp; convection</span><p>metals: electrons + vibration · fluids: density currents · good/bad conductors</p></article>
          <article className="branch b6"><span>Radiation</span><p>IR, no medium · black dull emit/absorb best · balance → const T · pans, rooms, Earth</p></article>
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
        {quizQuestions.length > 0 && (
          <>
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
          </>
        )}
      </section>

      <ChapterNav current={2} prefix="../" />

      <footer>
        <div><i>Φ</i><b>Field Notes</b><span>Chapter 2 · Thermal physics · Cambridge IGCSE Physics 0625 (2026–2028)</span></div>
        <p>Independent educational resource, not endorsed by Cambridge International Education. Interactive models are qualitative teaching aids. <a href="../chapters/">Browse all chapters</a></p>
      </footer>
    </main>
  );
}
