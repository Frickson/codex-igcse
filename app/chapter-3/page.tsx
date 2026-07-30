"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ChapterNav from "../ChapterNav";
import WaveAnatomyLab from "./labs/WaveAnatomyLab";
import DiffractionLab from "./labs/DiffractionLab";
import ReflectionLab from "./labs/ReflectionLab";
import RefractionLab from "./labs/RefractionLab";

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
  ["properties", "Wave properties"],
  ["reflection", "Reflection"],
  ["refraction", "Refraction"],
  ["lenses", "Lenses"],
  ["dispersion", "Dispersion"],
  ["spectrum", "EM spectrum"],
  ["sound", "Sound"],
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

/* ---------- assessment data (filled in a later build phase) ---------- */
type QuizQuestion = { question: string; options: string[]; answer: number; why: string };
const quizQuestions: QuizQuestion[] = [];

type ExamQuestion = { tag: string; marks: number; question: string; scheme: string[] };
const examQuestions: ExamQuestion[] = [];

/* =====================================================================
   Page
   ===================================================================== */
export default function WavesPage() {
  const progress = useScrollProgress();
  const [menuOpen, setMenuOpen] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const score = useMemo(() => quizQuestions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0), [answers]);

  // Defer reading saved answers to after hydration (avoids an SSR/client
  // mismatch). `hydrated` guards the write effect so it does not overwrite the
  // saved value with the empty initial state before the read has run.
  const hydrated = useRef(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try { const saved = localStorage.getItem("igcse-waves-progress"); if (saved) setAnswers(JSON.parse(saved)); } catch { /* ignore */ }
      hydrated.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, []);
  useEffect(() => {
    if (!hydrated.current) return;
    try { localStorage.setItem("igcse-waves-progress", JSON.stringify(answers)); } catch { /* ignore */ }
  }, [answers]);

  const resetCheckpoint = () => {
    setAnswers({});
    try { localStorage.removeItem("igcse-waves-progress"); } catch { /* ignore */ }
  };

  return (
    <main id="top">
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <header className="topbar">
        <a href="#top" className="brand"><i>Φ</i><span>Field Notes<small>IGCSE Physics · Chapter 3</small></span></a>
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
        </div>
      )}

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Cambridge IGCSE Physics 0625 · 3 Waves</span>
          <h1>One equation, every <em>wave</em>.</h1>
          <p>From ripples on water to X-rays and sound, every wave carries energy and obeys v = fλ. Bend it, bounce it, focus it and split it into colour with models where each control changes real wave physics.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#overview">Start the lesson <span>↓</span></a>
            <span className="time-note"><b>70–100 min</b> interactive lesson</span>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbital"><i /><i /><i /></div>
          <div style={{ position: "relative", zIndex: 3, width: 96, height: 96, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--navy)", boxShadow: "0 18px 50px rgba(16,42,56,.22)" }}>
            <b style={{ font: "700 26px var(--serif)", color: "var(--mint-2)" }}>v=fλ</b>
          </div>
          <p>Speed, frequency, wavelength.</p>
        </div>
      </section>

      <section className="lesson-section intro-section" id="overview">
        <div className="section-heading">
          <span className="section-number">01</span>
          <div>
            <span className="eyebrow">Route map</span>
            <h2>Four ideas, one wave toolkit.</h2>
            <p>The 2026–2028 syllabus runs from the shared properties of all waves, through the behaviour of light — reflection, refraction, lenses and colour — to the electromagnetic spectrum and sound.</p>
          </div>
        </div>
        <div className="syllabus-grid">
          {[
            ["3.1", "General wave properties", "Wavefronts, wavelength, frequency, amplitude and speed; v = fλ; transverse vs longitudinal; reflection, refraction and diffraction"],
            ["3.2.1", "Reflection of light", "The law of reflection and the image formed in a plane mirror"],
            ["3.2.2", "Refraction & TIR", "Bending at a boundary, n = sin i / sin r, refractive index, critical angle and total internal reflection"],
            ["3.2.3", "Thin converging lens", "Principal focus and focal length; real and virtual images; ray diagrams and magnification"],
            ["3.2.4", "Dispersion", "Splitting white light into a spectrum with a prism"],
            ["3.3", "Electromagnetic spectrum", "The seven regions in order, their common speed in vacuum, and their uses and dangers"],
            ["3.4", "Sound", "A longitudinal wave that needs a medium; pitch, loudness, the audible range and the speed of sound"],
          ].map(([n, title, copy]) => (
            <article key={n}><span>{n}</span><h3>{title}</h3><p>{copy}</p></article>
          ))}
        </div>
        <div className="core-supplement">
          <div><b>CORE</b><span>Build the wave model and the standard reflection, refraction, spectrum and sound ideas with v = fλ.</span></div>
          <div><b>SUPPLEMENT</b><span>Extend to diffraction detail, n = 1/sin c, virtual images and magnification, colour-dependent refraction, digital signalling and ultrasound.</span></div>
        </div>
      </section>

      {/* 3.1 */}
      <section className="lesson-section" id="properties">
        <div className="section-heading">
          <span className="section-number">02</span>
          <div>
            <span className="eyebrow">3.1 · general properties of waves</span>
            <h2>Every wave carries energy — and obeys v = fλ.</h2>
            <p>A wave transfers energy without transferring matter. Describe it with wavelength, frequency, amplitude and speed, then classify it as transverse or longitudinal by the direction of its vibration.</p>
          </div>
        </div>
        <WaveAnatomyLab />
        <DiffractionLab />
        <div className="micro-checks">
          <QuickCheck statement="In a wave, the medium travels along with the wave." answer={false} explanation="A wave transfers energy, not matter. The particles of the medium vibrate about fixed positions; they do not travel with the wave." />
          <QuickCheck statement="Sound is a longitudinal wave." answer={true} explanation="In sound the air particles vibrate back and forth along the same direction the wave travels, forming compressions and rarefactions — that is longitudinal." />
        </div>
      </section>

      {/* 3.2.1 */}
      <section className="lesson-section" id="reflection">
        <div className="section-heading">
          <span className="section-number">03</span>
          <div>
            <span className="eyebrow">3.2.1 · reflection of light</span>
            <h2>Angle in equals angle out.</h2>
            <p>Light reflects from a plane mirror so that the angle of incidence equals the angle of reflection, both measured from the normal. The image is upright, the same size, and as far behind the mirror as the object is in front.</p>
          </div>
        </div>
        <ReflectionLab />
        <div className="micro-checks">
          <QuickCheck statement="The angle of reflection is measured from the mirror surface." answer={false} explanation="Both the angle of incidence and the angle of reflection are measured from the normal — the line at 90° to the mirror — not from the surface." />
          <QuickCheck statement="The image in a plane mirror is the same size as the object." answer={true} explanation="A plane-mirror image is upright, virtual, laterally inverted and exactly the same size as the object, as far behind the mirror as the object is in front." />
        </div>
      </section>

      {/* 3.2.2 */}
      <section className="lesson-section" id="refraction">
        <div className="section-heading">
          <span className="section-number">04</span>
          <div>
            <span className="eyebrow">3.2.2 · refraction &amp; total internal reflection</span>
            <h2>Change speed, change direction.</h2>
            <p>Light slows entering a denser medium and bends toward the normal, following n = sin i / sin r. Past the critical angle it cannot escape at all — total internal reflection, the principle behind optical fibres.</p>
          </div>
        </div>
        <RefractionLab />
        <div className="micro-checks">
          <QuickCheck statement="Light bends toward the normal when it enters a denser medium." answer={true} explanation="Entering a denser medium (e.g. air → glass) light slows down and bends toward the normal, so the angle of refraction is smaller than the angle of incidence." />
          <QuickCheck statement="Total internal reflection can happen when light passes from air into glass." answer={false} explanation="TIR only occurs going from a denser to a less dense medium (glass → air) at angles beyond the critical angle. Going air → glass, light always refracts into the glass." />
        </div>
      </section>

      {/* 3.2.3 */}
      <section className="lesson-section" id="lenses">
        <div className="section-heading">
          <span className="section-number">05</span>
          <div>
            <span className="eyebrow">3.2.3 · thin converging lens</span>
            <h2>Focusing light to form an image.</h2>
            <p>A converging lens bends parallel rays to a principal focus. Where the object sits relative to the focal length decides whether the image is real or virtual, enlarged or diminished, upright or inverted.</p>
          </div>
        </div>
        {/* Phase 3: LensLab */}
      </section>

      {/* 3.2.4 */}
      <section className="lesson-section" id="dispersion">
        <div className="section-heading">
          <span className="section-number">06</span>
          <div>
            <span className="eyebrow">3.2.4 · dispersion of light</span>
            <h2>White light is a mixture of colours.</h2>
            <p>A prism refracts each colour by a different amount — violet most, red least — because each travels at a slightly different speed in glass. The result is the visible spectrum.</p>
          </div>
        </div>
        {/* Phase 3: DispersionLab */}
      </section>

      {/* 3.3 */}
      <section className="lesson-section dark-section" id="spectrum">
        <div className="section-heading">
          <span className="section-number">07</span>
          <div>
            <span className="eyebrow">3.3 · electromagnetic spectrum</span>
            <h2>One family, from radio to gamma.</h2>
            <p>All electromagnetic waves are transverse and travel at 3.0×10⁸ m/s in a vacuum. They differ only in frequency and wavelength — which sets each region&apos;s uses and its dangers.</p>
          </div>
        </div>
        {/* Phase 4: SpectrumLab */}
      </section>

      {/* 3.4 */}
      <section className="lesson-section" id="sound">
        <div className="section-heading">
          <span className="section-number">08</span>
          <div>
            <span className="eyebrow">3.4 · sound</span>
            <h2>Vibrations that need a medium.</h2>
            <p>Sound is a longitudinal wave of compressions and rarefactions that cannot travel through a vacuum. Its frequency sets the pitch, its amplitude the loudness, and it travels fastest in solids.</p>
          </div>
        </div>
        {/* Phase 4: SoundLab, SoundMediumLab */}
      </section>

      {/* Exam practice */}
      <section className="lesson-section practice-section" id="practice">
        <div className="section-heading">
          <span className="section-number">09</span>
          <div>
            <span className="eyebrow">Exam practice · waves</span>
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
            <p>Cover the page and try to reconstruct the six branches, then check.</p>
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

      <ChapterNav current={3} prefix="../" />

      <footer>
        <div><i>Φ</i><b>Field Notes</b><span>Chapter 3 · Waves · Cambridge IGCSE Physics 0625 (2026–2028)</span></div>
        <p>Independent educational resource, not endorsed by Cambridge International Education. Interactive models are qualitative teaching aids. <a href="../chapters/">Browse all chapters</a></p>
      </footer>
    </main>
  );
}
