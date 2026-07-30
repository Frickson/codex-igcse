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

/* ---------- checkpoint / exam placeholders (filled in later phases) ---------- */
type QuizQuestion = { question: string; options: string[]; answer: number; why: string };
const quizQuestions: QuizQuestion[] = [];

type ExamQuestion = { tag: string; marks: number; question: string; scheme: string[] };
const examQuestions: ExamQuestion[] = [];

function LabPlaceholder({ label, title }: { label: string; title: string }) {
  return (
    <div className="lab-shell space" aria-label={`${title} — coming soon`}>
      <div className="lab-header">
        <div><span className="mini-label">{label}</span><h3>{title}</h3></div>
        <div className="big-reading"><span>Status</span><strong>Soon</strong></div>
      </div>
      <p className="explain">Interactive model will be wired in a later build phase.</p>
    </div>
  );
}

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
            <a className="advanced-labs-button" href="../chapters/">All chapters <span>↗</span></a>
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
        <LabPlaceholder label="6.1.1 · day & night" title="Spin the Earth — when is it day?" />
        <LabPlaceholder label="6.1.1 · seasons" title="Tilt and orbit — why seasons change" />
        <LabPlaceholder label="6.1.1 · Moon phases" title="Walk the Moon around Earth" />
        <LabPlaceholder label="6.1.1 · Supplement · orbital speed" title="Average orbital speed v = 2πr / T" />
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
        <LabPlaceholder label="6.1.2 · Solar System" title="Build the planetary order" />
        <LabPlaceholder label="6.1.2 · gravity & orbits" title="What force keeps a planet in orbit?" />
        <LabPlaceholder label="6.1.2 · light travel" title="How long does sunlight take?" />
        <LabPlaceholder label="6.1.2 · Supplement · planetary data" title="Read the planetary data table" />
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
        <LabPlaceholder label="6.2.1 · the Sun" title="What kind of star is the Sun?" />
        <LabPlaceholder label="6.2.2 · light-years" title="Measure distance in light-years" />
        <LabPlaceholder label="6.2.2 · life cycle" title="Follow a star from nebula to remnant" />
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
        <LabPlaceholder label="6.2.3 · redshift" title="Stretch the wavelength — watch redshift" />
        <LabPlaceholder label="6.2.3 · Supplement · CMBR" title="Why is the sky filled with microwaves?" />
        <LabPlaceholder label="6.2.3 · Supplement · Hubble" title="H₀ = v/d and the age estimate" />
        <div className="micro-checks">
          <QuickCheck statement="Redshift means the observed wavelength of light from a receding galaxy is longer than when it was emitted." answer={true} explanation="Redshift is an increase in observed wavelength for receding sources — distant galaxies appear redshifted compared with light emitted on Earth." />
          <QuickCheck statement="CMBR is only detected near the Milky Way's centre." answer={false} explanation="Supplement: cosmic microwave background radiation is observed at all points in space around us — leftover radiation stretched into the microwave band as the Universe expanded." />
        </div>
      </section>

      {/* Exam practice */}
      <section className="lesson-section" id="practice">
        <div className="section-heading">
          <span className="section-number">06</span>
          <div>
            <span className="eyebrow">Exam practice</span>
            <h2>Original structured questions.</h2>
            <p>Work in command-word mode. Reveal mark points only after you have attempted an answer. Full set arrives in the final build phase.</p>
          </div>
        </div>
        <div className="exam-list">
          {examQuestions.length === 0 ? (
            <article><span>Scaffold</span><h3>Exam questions will be added in the final phase.</h3><p>Expect calculate, describe and explain items covering orbital speed, planetary data, stellar life cycle, redshift and Hubble.</p></article>
          ) : examQuestions.map((item, index) => (
            <article key={item.tag}>
              <span>{item.tag} · {item.marks} marks</span>
              <h3>{item.question}</h3>
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
            <p>Cover the page and try to reconstruct the six branches, then check. Branch detail is completed in the final phase.</p>
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
            <p>Your answers are saved in this browser under <code>igcse-space-progress</code> so you can return later. Questions arrive in the final phase.</p>
          </div>
        </div>
        <div className="score-card">
          <div><span>Checkpoint score</span><b>{score}<small>/{Math.max(quizQuestions.length, 10)}</small></b></div>
          <div className="score-track"><i style={{ width: `${quizQuestions.length ? (score / quizQuestions.length) * 100 : 0}%` }} /></div>
          <span>Misconception-focused — read the feedback on every answer.</span>
        </div>
        <div className="quiz-list">
          {quizQuestions.length === 0 ? (
            <article><span>Scaffold</span><h3>Checkpoint questions will be added in the final phase.</h3><p>Ten original multiple-choice items will cover Earth–Moon geometry, Solar System misconceptions, stellar life cycle and cosmology.</p></article>
          ) : quizQuestions.map((question, index) => {
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
