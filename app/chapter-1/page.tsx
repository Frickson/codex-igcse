"use client";

import { useEffect, useMemo, useState } from "react";
import ChapterNav from "../ChapterNav";
import MeasurementLab from "./labs/MeasurementLab";
import VectorLab from "./labs/VectorLab";
import MotionGraphLab from "./labs/MotionGraphLab";
import FreeFallLab from "./labs/FreeFallLab";
import MassWeightLab from "./labs/MassWeightLab";
import DensityLab from "./labs/DensityLab";
import HookeLab from "./labs/HookeLab";
import NewtonsSecondLab from "./labs/NewtonsSecondLab";
import CircularMotionLab from "./labs/CircularMotionLab";
import MomentsLab from "./labs/MomentsLab";
import StabilityLab from "./labs/StabilityLab";
import MomentumLab from "./labs/MomentumLab";

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
  ["measurement", "Measurement"],
  ["motion", "Motion"],
  ["matter", "Mass & density"],
  ["forces", "Forces"],
  ["momentum", "Momentum"],
  ["energy", "Energy"],
  ["pressure", "Pressure"],
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

/* ---------- checkpoint quiz data (filled in a later build phase) ---------- */
type QuizQuestion = { question: string; options: string[]; answer: number; why: string };
const quizQuestions: QuizQuestion[] = [];

type ExamQuestion = { tag: string; marks: number; question: string; scheme: string[] };
const examQuestions: ExamQuestion[] = [];

/* =====================================================================
   Page
   ===================================================================== */
export default function MotionForcesEnergyPage() {
  const progress = useScrollProgress();
  const [menuOpen, setMenuOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const score = useMemo(() => quizQuestions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0), [answers]);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try { const saved = localStorage.getItem("igcse-motion-progress"); if (saved) setAnswers(JSON.parse(saved)); } catch { /* ignore */ }
    });
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    try { localStorage.setItem("igcse-motion-progress", JSON.stringify(answers)); } catch { /* ignore */ }
  }, [answers]);

  const resetCheckpoint = () => {
    setAnswers({});
    try { localStorage.removeItem("igcse-motion-progress"); } catch { /* ignore */ }
  };

  return (
    <main id="top">
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <header className="topbar">
        <a href="#top" className="brand"><i>Φ</i><span>Field Notes<small>IGCSE Physics · Chapter 1</small></span></a>
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
          <a href="../" onClick={() => setMenuOpen(false)}>Chapter 4 lesson →</a>
        </div>
      )}

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Cambridge IGCSE Physics 0625 · 1 Motion, forces &amp; energy</span>
          <h1>Measure it, then <em>move</em> it.</h1>
          <p>From a ruler reading to a spacecraft&apos;s momentum — build the whole mechanics toolkit with models where every slider changes real physics: motion graphs, Newton&apos;s laws, moments, energy and pressure.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#overview">Start the lesson <span>↓</span></a>
            <a className="advanced-labs-button" href="../chapters/">All chapters <span>↗</span></a>
            <span className="time-note"><b>70–100 min</b> interactive lesson</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbital"><i /><i /><i /></div>
          <div style={{ position: "relative", zIndex: 3, width: 96, height: 96, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--navy)", boxShadow: "0 18px 50px rgba(16,42,56,.22)" }}>
            <b style={{ font: "700 30px var(--serif)", color: "var(--mint-2)" }}>F=ma</b>
          </div>
          <p>Forces change motion.</p>
        </div>
      </section>

      <section className="lesson-section intro-section" id="overview">
        <div className="section-heading">
          <span className="section-number">01</span>
          <div>
            <span className="eyebrow">Route map</span>
            <h2>Eight ideas, one mechanics toolkit.</h2>
            <p>The 2026–2028 syllabus runs from measurement and motion, through the forces that change motion, to the energy and pressure those interactions transfer.</p>
          </div>
        </div>
        <div className="syllabus-grid">
          {[
            ["1.1", "Measurement & vectors", "Length, volume and time; averaging repeats; scalars vs vectors and combining perpendicular vectors"],
            ["1.2", "Motion & free fall", "Speed, velocity, acceleration; distance–time and speed–time graphs; free fall and terminal velocity"],
            ["1.3–1.4", "Mass, weight & density", "Mass and inertia, weight W = mg, gravitational field strength, and density ρ = m/V"],
            ["1.5", "Forces", "Effects of forces, Hooke's law, F = ma, friction, circular motion, moments and stability"],
            ["1.6", "Momentum", "Momentum p = mv, impulse and conservation of momentum in collisions"],
            ["1.7", "Energy, work & power", "Energy stores and transfers, KE and GPE, work, power, efficiency and energy resources"],
            ["1.8", "Pressure", "Pressure p = F/A and pressure in a liquid p = ρgh"],
          ].map(([n, title, copy]) => (
            <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
        <div className="core-supplement">
          <div><b>CORE</b><span>Build the physical picture and the standard motion, force, energy and pressure calculations.</span></div>
          <div><b>SUPPLEMENT</b><span>Extend to perpendicular vectors, graph gradients and areas, F = ma, circular motion, momentum and p = ρgh.</span></div>
        </div>
      </section>

      {/* 1.1 */}
      <section className="lesson-section" id="measurement">
        <div className="section-heading">
          <span className="section-number">02</span>
          <div>
            <span className="eyebrow">1.1 · physical quantities &amp; measurement</span>
            <h2>Good numbers start with good measurement.</h2>
            <p>Measure length, volume and time with the right instrument, and average repeats to reduce error. Then separate scalars (size only) from vectors (size and direction).</p>
          </div>
        </div>
        <MeasurementLab />
        <VectorLab />
        <div className="micro-checks">
          <QuickCheck statement="Distance is a vector quantity." answer={false} explanation="Distance has size only, so it is a scalar. Displacement (distance in a stated direction) is the vector." />
          <QuickCheck statement="Timing 20 swings and dividing by 20 gives a more reliable period than timing one swing." answer={true} explanation="The reaction-time error is fixed on the total, so sharing it over 20 swings makes the error per swing much smaller." />
        </div>
      </section>

      {/* 1.2 */}
      <section className="lesson-section" id="motion">
        <div className="section-heading">
          <span className="section-number">03</span>
          <div>
            <span className="eyebrow">1.2 · motion</span>
            <h2>Speed, velocity, acceleration — read from graphs.</h2>
            <p>Speed is distance per time; velocity adds direction; acceleration is the rate of change of velocity. Distance–time and speed–time graphs make each one visible as a gradient or an area.</p>
          </div>
        </div>
        <MotionGraphLab />
        <FreeFallLab />
        <div className="micro-checks">
          <QuickCheck statement="A steeper line on a speed–time graph means a larger acceleration." answer={true} explanation="Acceleration is the gradient of a speed–time graph, so a steeper line is a greater rate of change of velocity." />
          <QuickCheck statement="At terminal velocity a falling object is still accelerating." answer={false} explanation="At terminal velocity the drag balances the weight, so the resultant force and the acceleration are both zero — the speed stays constant." />
        </div>
      </section>

      {/* 1.3–1.4 */}
      <section className="lesson-section" id="matter">
        <div className="section-heading">
          <span className="section-number">04</span>
          <div>
            <span className="eyebrow">1.3–1.4 · mass, weight &amp; density</span>
            <h2>Mass stays; weight depends on gravity.</h2>
            <p>Mass measures the amount of matter and its inertia; weight is the gravitational force W = mg. Density ρ = m/V decides whether an object floats or sinks.</p>
          </div>
        </div>
        <MassWeightLab />
        <DensityLab />
        <div className="micro-checks">
          <QuickCheck statement="An astronaut's mass is smaller on the Moon than on Earth." answer={false} explanation="Mass is the same everywhere; only the weight is smaller on the Moon because g is smaller (about 1.6 N/kg)." />
          <QuickCheck statement="An object floats when its density is less than the density of the fluid." answer={true} explanation="If the object is less dense than the fluid it displaces enough fluid to support its weight, so it floats." />
        </div>
      </section>

      {/* 1.5 */}
      <section className="lesson-section" id="forces">
        <div className="section-heading">
          <span className="section-number">05</span>
          <div>
            <span className="eyebrow">1.5 · forces</span>
            <h2>Forces change shape, speed and direction.</h2>
            <p>A resultant force changes motion (F = ma); balanced forces do not. Springs obey Hooke&apos;s law up to a limit, forces turn objects about a pivot (moments), and the centre of gravity governs stability.</p>
          </div>
        </div>
        <NewtonsSecondLab />
        <HookeLab />
        <MomentsLab />
        <StabilityLab />
        <CircularMotionLab />
        <div className="micro-checks">
          <QuickCheck statement="If the forces on an object are balanced, it must be stationary." answer={false} explanation="Balanced forces mean zero resultant, so no acceleration — the object stays at rest OR keeps moving at constant velocity." />
          <QuickCheck statement="Doubling the distance of a force from a pivot doubles its moment." answer={true} explanation="Moment = force × perpendicular distance, so at twice the distance the same force gives twice the turning effect." />
        </div>
      </section>

      {/* 1.6 */}
      <section className="lesson-section dark-section" id="momentum">
        <div className="section-heading">
          <span className="section-number">06</span>
          <div>
            <span className="eyebrow">1.6 · momentum · Supplement</span>
            <h2>Mass in motion, and what conserves it.</h2>
            <p>Momentum p = mv measures mass in motion. In a collision with no external force, total momentum is conserved — the basis for analysing impacts and recoil.</p>
          </div>
        </div>
        <MomentumLab />
        <div className="micro-checks">
          <QuickCheck statement="In a collision with no external force, total momentum stays the same." answer={true} explanation="Momentum is conserved: the momentum lost by one object equals that gained by the other." />
          <QuickCheck statement="A light object and a heavy object can never have the same momentum." answer={false} explanation="Momentum is mv — a light object moving fast can have the same momentum as a heavy object moving slowly." />
        </div>
      </section>

      {/* 1.7 */}
      <section className="lesson-section" id="energy">
        <div className="section-heading">
          <span className="section-number">07</span>
          <div>
            <span className="eyebrow">1.7 · energy, work &amp; power</span>
            <h2>Energy is transferred, never destroyed.</h2>
            <p>Energy moves between stores — kinetic, gravitational, elastic and more — but the total is conserved. Work is energy transferred by a force, power is how fast, and efficiency is how much of it is useful.</p>
          </div>
        </div>
        {/* Phase 4: EnergyStoresLab, EnergyCalcLab, ResourcesLab */}
      </section>

      {/* 1.8 */}
      <section className="lesson-section" id="pressure">
        <div className="section-heading">
          <span className="section-number">08</span>
          <div>
            <span className="eyebrow">1.8 · pressure</span>
            <h2>Force spread over an area.</h2>
            <p>Pressure p = F/A explains why a sharp point cuts and a wide base does not. In a liquid, pressure increases with depth and density as p = ρgh.</p>
          </div>
        </div>
        {/* Phase 4: PressureLab, LiquidPressureLab */}
      </section>

      {/* Exam practice */}
      <section className="lesson-section practice-section" id="practice">
        <div className="section-heading">
          <span className="section-number">09</span>
          <div>
            <span className="eyebrow">Exam practice · motion, forces &amp; energy</span>
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
          <span className="section-number">10</span>
          <div>
            <span className="eyebrow">Retrieval map</span>
            <h2>Rebuild each branch from memory.</h2>
            <p>Cover the page and try to reconstruct the branches, then check.</p>
          </div>
        </div>
        {/* Phase 4: mindmap branches */}
      </section>

      {/* Checkpoint */}
      <section className="lesson-section quiz-section" id="checkpoint">
        <div className="section-heading">
          <span className="section-number">11</span>
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

      <ChapterNav current={1} prefix="../" />

      <footer>
        <div><i>Φ</i><b>Field Notes</b><span>Chapter 1 · Motion, forces &amp; energy · Cambridge IGCSE Physics 0625 (2026–2028)</span></div>
        <p>Independent educational resource, not endorsed by Cambridge International Education. Interactive models are qualitative teaching aids. <a href="../chapters/">Browse all chapters</a></p>
      </footer>
    </main>
  );
}
