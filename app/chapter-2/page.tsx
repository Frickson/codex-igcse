"use client";

import { useEffect, useMemo, useState } from "react";
import ChapterNav from "../ChapterNav";

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

/* QuickCheck micro-checks are added with section content in later phases. */

/* ---------- checkpoint / exam data (filled in later build phases) ---------- */
type QuizQuestion = { question: string; options: string[]; answer: number; why: string };
const quizQuestions: QuizQuestion[] = [];

type ExamQuestion = { tag: string; marks: number; question: string; scheme: string[] };
const examQuestions: ExamQuestion[] = [];

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
          <a href="../" onClick={() => setMenuOpen(false)}>Chapter 4 lesson →</a>
        </div>
      )}

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Cambridge IGCSE Physics 0625 · 2 Thermal physics</span>
          <h1>Heat the particles, then <em>watch</em> energy move.</h1>
          <p>From solid–liquid–gas diagrams to pans, radiators and Earth&apos;s radiation balance — build the thermal toolkit with models where every slider changes real particle behaviour, expansion, specific heat and energy transfer.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#overview">Start the lesson <span>↓</span></a>
            <a className="advanced-labs-button" href="../chapters/">All chapters <span>↗</span></a>
            <span className="time-note"><b>55–80 min</b> interactive lesson</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbital"><i /><i /><i /></div>
          <div style={{ position: "relative", zIndex: 3, width: 96, height: 96, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--navy)", boxShadow: "0 18px 50px rgba(16,42,56,.22)" }}>
            <b style={{ font: "700 22px var(--serif)", color: "var(--mint-2)" }}>ΔE=mcΔθ</b>
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

      {/* 2.1.1–2.1.2 — labs wired in Phase 2 */}
      <section className="lesson-section" id="particles">
        <div className="section-heading">
          <span className="section-number">02</span>
          <div>
            <span className="eyebrow">2.1 · kinetic particle model</span>
            <h2>Same particles, different arrangement and motion.</h2>
            <p>Solids, liquids and gases differ in how tightly particles pack and how freely they move. Temperature tracks particle kinetic energy — down to absolute zero.</p>
          </div>
        </div>
        <p className="lab-note">Interactive labs for states of matter, temperature and Brownian motion land in the next build phase.</p>
      </section>

      {/* 2.1.3 — labs wired in Phase 2 */}
      <section className="lesson-section" id="gases">
        <div className="section-heading">
          <span className="section-number">03</span>
          <div>
            <span className="eyebrow">2.1.3 · gases &amp; the absolute scale</span>
            <h2>Collisions set the pressure.</h2>
            <p>Warm a fixed-volume gas and particles hit the walls harder and more often. Squeeze the volume at fixed temperature and the same mass collides more frequently — pressure rises.</p>
          </div>
        </div>
        <p className="lab-note">Gas-pressure and absolute-scale labs land in the next build phase.</p>
      </section>

      {/* 2.2 — labs wired in Phase 3 */}
      <section className="lesson-section" id="properties">
        <div className="section-heading">
          <span className="section-number">04</span>
          <div>
            <span className="eyebrow">2.2 · thermal properties &amp; temperature</span>
            <h2>Heat in: expand, warm up, or change state.</h2>
            <p>Energy can stretch particle spacing (expansion), raise average kinetic energy (temperature), or break attractions during melting and boiling without a temperature rise.</p>
          </div>
        </div>
        <p className="lab-note">Expansion, specific-heat and phase-change labs land in a later build phase.</p>
      </section>

      {/* 2.3 — labs wired in Phase 4 */}
      <section className="lesson-section" id="transfer">
        <div className="section-heading">
          <span className="section-number">05</span>
          <div>
            <span className="eyebrow">2.3 · transfer of thermal energy</span>
            <h2>Conduction, convection, radiation — three routes out.</h2>
            <p>Energy leaves hot objects through particle vibration and free electrons, density-driven fluid currents, and infrared radiation that needs no medium.</p>
          </div>
        </div>
        <p className="lab-note">Conduction, convection and radiation labs land in a later build phase.</p>
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
