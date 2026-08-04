"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ChapterNav from "../ChapterNav";
import AcademyMoment from "../AcademyMoment";
import WaveAnatomyLab from "./labs/WaveAnatomyLab";
import DiffractionLab from "./labs/DiffractionLab";
import ReflectionLab from "./labs/ReflectionLab";
import RefractionLab from "./labs/RefractionLab";
import LensLab from "./labs/LensLab";
import DispersionLab from "./labs/DispersionLab";
import SpectrumLab from "./labs/SpectrumLab";
import SoundLab from "./labs/SoundLab";
import SoundMediumLab from "./labs/SoundMediumLab";

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

/* ---------- assessment data (original, exam-style) ---------- */
type QuizQuestion = { question: string; options: string[]; answer: number; why: string };
const quizQuestions: QuizQuestion[] = [
  { question: "A wave has frequency 50 Hz and wavelength 6 m. What is its speed?", options: ["8.3 m/s", "56 m/s", "300 m/s", "0.12 m/s"], answer: 2, why: "v = fλ = 50 × 6 = 300 m/s." },
  { question: "Which of these is a longitudinal wave?", options: ["Light", "A wave on a rope", "Sound in air", "A water-surface ripple"], answer: 2, why: "In sound the particles vibrate along the direction of travel, forming compressions and rarefactions — that is longitudinal. The others are transverse." },
  { question: "In a plane mirror, the image is:", options: ["Real and inverted", "Virtual and the same size", "Real and magnified", "Virtual and smaller"], answer: 1, why: "A plane mirror forms a virtual, upright image the same size as the object, as far behind the mirror as the object is in front." },
  { question: "Light passes from air into glass. It bends:", options: ["Away from the normal", "Toward the normal", "Along the boundary", "Not at all"], answer: 1, why: "Entering the denser glass the light slows and bends toward the normal, so the angle of refraction is smaller than the angle of incidence." },
  { question: "A glass has refractive index 1.5. Its critical angle is closest to:", options: ["30°", "42°", "49°", "60°"], answer: 1, why: "sin c = 1/n = 1/1.5 = 0.667, so c = sin⁻¹(0.667) ≈ 42°." },
  { question: "An object is placed inside the focal length of a converging lens. The image is:", options: ["Real, inverted, diminished", "Real, inverted, magnified", "Virtual, upright, magnified", "No image forms"], answer: 2, why: "Inside F the refracted rays diverge; traced back they give a virtual, upright, enlarged image — the magnifying-glass case." },
  { question: "Which colour is refracted most as white light passes through a prism?", options: ["Red", "Green", "Yellow", "Violet"], answer: 3, why: "Violet has the highest refractive index in glass, so it slows most and is deviated most; red the least." },
  { question: "Which electromagnetic waves have the highest frequency?", options: ["Radio", "Infrared", "Ultraviolet", "Gamma"], answer: 3, why: "Gamma rays sit at the high-frequency, short-wavelength end of the spectrum." },
  { question: "Compared with light, all electromagnetic waves in a vacuum have the same:", options: ["Frequency", "Wavelength", "Speed", "Amplitude"], answer: 2, why: "Every EM wave travels at 3.0×10⁸ m/s in a vacuum; they differ in frequency and wavelength." },
  { question: "Sound cannot travel through a vacuum because:", options: ["It travels too fast", "There are no particles to carry the vibration", "A vacuum absorbs sound", "Its frequency is too low"], answer: 1, why: "Sound is a mechanical wave needing a medium; a vacuum has no particles to pass the compressions and rarefactions along." },
];

type ExamQuestion = { tag: string; marks: number; question: string; scheme: string[] };
const examQuestions: ExamQuestion[] = [
  { tag: "3.1 · Core", marks: 3, question: "A student watches waves on a pond. In 10 s, 8 complete waves pass a fixed post, and the distance between adjacent crests is 0.5 m. Calculate (a) the frequency and (b) the speed of the waves.", scheme: ["(a) frequency f = number of waves ÷ time = 8 ÷ 10 = 0.8 Hz (1)", "(b) v = fλ with λ = 0.5 m (1)", "v = 0.8 × 0.5 = 0.4 m/s, with unit (1)"] },
  { tag: "3.1 · Supplement", marks: 3, question: "Explain, in terms of gap size and wavelength, why sound can be heard clearly around the edge of an open doorway but a clear image is not formed by light passing through the same doorway.", scheme: ["Diffraction (spreading) is greatest when the gap is comparable to the wavelength (1)", "Sound wavelengths (~m) are comparable to the doorway width, so sound diffracts/spreads a lot and is heard around the edge (1)", "Light wavelengths (~10⁻⁷ m) are far smaller than the doorway, so light barely diffracts and travels almost straight (1)"] },
  { tag: "3.2.1 · Core", marks: 3, question: "A ray of light strikes a plane mirror at an angle of incidence of 35°. State the angle of reflection and describe two properties of the image formed of a small object placed in front of the mirror.", scheme: ["Angle of reflection = 35° (equal to the angle of incidence) (1)", "Image is virtual and upright / same size as the object (1)", "Image is as far behind the mirror as the object is in front / laterally inverted (1)"] },
  { tag: "3.2.2 · Core", marks: 3, question: "A ray of light travels from air into a glass block with an angle of incidence of 40°. The angle of refraction is 25°. Calculate the refractive index of the glass and state what happens to the speed of the light as it enters the glass.", scheme: ["n = sin i / sin r = sin 40° / sin 25° (1)", "n = 0.643 / 0.423 = 1.52 (1)", "The light slows down on entering the (denser) glass (1)"] },
  { tag: "3.2.2 · Supplement", marks: 4, question: "The refractive index of a glass fibre is 1.5. (a) Calculate the critical angle. (b) Explain how total internal reflection allows the fibre to carry a light signal along a curved path.", scheme: ["(a) sin c = 1/n = 1/1.5 = 0.667 (1)", "c = sin⁻¹(0.667) = 42° (1)", "(b) Light hits the fibre wall at an angle greater than the critical angle (1)", "so it is totally internally reflected (no light escapes) and stays inside the fibre, reflecting repeatedly along its length (1)"] },
  { tag: "3.2.3 · Supplement", marks: 4, question: "An object 2.0 cm tall is placed 30 cm from a converging lens of focal length 10 cm. Using 1/v − 1/u with the given lens, the image forms 15 cm from the lens. (a) State the magnification. (b) Describe the image fully.", scheme: ["(a) m = v/u = 15/30 = 0.5 (1)", "image height = 0.5 × 2.0 = 1.0 cm (1)", "(b) Real and inverted (1)", "diminished (smaller than the object) and on the opposite side of the lens (1)"] },
  { tag: "3.2.4 · Core", marks: 3, question: "White light is passed through a glass prism and a spectrum is seen on a screen. (a) Name the effect. (b) State which colour is deviated most and which least. (c) Explain why the colours are separated.", scheme: ["(a) Dispersion (1)", "(b) Violet is deviated most, red least (1)", "(c) Each colour has a different speed/refractive index in glass, so each is refracted by a different amount (1)"] },
  { tag: "3.3 · Core", marks: 4, question: "(a) State the speed of electromagnetic waves in a vacuum. (b) A radio wave has frequency 100 MHz. Calculate its wavelength. (c) State one use and one danger of ultraviolet radiation.", scheme: ["(a) 3.0×10⁸ m/s (1)", "(b) λ = c/f = 3.0×10⁸ ÷ 1.0×10⁸ = 3.0 m (1)", "(c) Use: sterilising / security marking / fluorescent lamps (1)", "Danger: skin cancer / eye damage (1)"] },
  { tag: "3.3 · Core", marks: 3, question: "List the seven regions of the electromagnetic spectrum in order of increasing frequency, and state which region is used for thermal imaging.", scheme: ["Radio, microwave, infrared, visible, ultraviolet, X-ray, gamma — correct order (2; 1 mark if one pair swapped)", "Infrared is used for thermal imaging (1)"] },
  { tag: "3.4 · Core", marks: 4, question: "A student stands 660 m from a cliff, claps once, and hears the echo 4.0 s later. (a) Calculate the speed of sound in air. (b) Explain why the same clap heard through a long steel rail would arrive sooner.", scheme: ["(a) Sound travels to the cliff and back: distance = 2 × 660 = 1320 m (1)", "speed = distance ÷ time = 1320 ÷ 4.0 = 330 m/s (1)", "(b) Particles are closer together in a solid than in a gas (1)", "so sound travels faster in steel than in air and arrives sooner (1)"] },
];

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
        <AcademyMoment question="If a water wave moves across a pond, do the water particles travel all the way to the bank?" from="Particles vibrate locally" change="The disturbance passes from particle to particle" to="Energy travels; matter does not" steps={["Identify the vibration direction.", "Compare it with the wave-travel direction.", "Use v = fλ to connect the measurable quantities."]} label="COMMON MISTAKE" note="Do not draw particles travelling with the wave. They oscillate about fixed positions while energy is transferred." />
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
        <AcademyMoment tone="blue" question="Why does a ray bend at a glass boundary but not when it enters along the normal?" from="Light reaches a boundary" change="Its speed changes in the new medium" to="Direction changes unless i = 0°" steps={["Draw the normal first.", "Compare the optical density of the media.", "Toward the normal means slower; away means faster."]} label="ANDREW'S TIP" note="Never memorise left or right. Judge the bend relative to the normal and the change in speed." />
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
        <AcademyMoment tone="amber" question="Why can the same converging lens make a real image in one setup and a virtual image in another?" from="Move the object relative to F" change="Emerging rays converge or diverge" to="Image type and size change" steps={["Use the parallel ray through F.", "Use the central ray undeviated.", "Where real rays meet gives a real image; traced-back rays give a virtual image."]} label="CAMBRIDGE EXAM FOCUS" note="Image properties come from ray geometry. State real/virtual, upright/inverted and enlarged/same size/diminished." />
        <LensLab />
        <div className="micro-checks">
          <QuickCheck statement="An object placed inside the focal length of a converging lens gives a real image." answer={false} explanation="Inside the focal length the refracted rays diverge, so no real image forms. Tracing them back gives a virtual, upright, enlarged image — the magnifying-glass case." />
          <QuickCheck statement="At exactly twice the focal length, a converging lens forms an image the same size as the object." answer={true} explanation="With the object at 2F the image forms at 2F on the other side, real, inverted and the same size (m = 1)." />
        </div>
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
        <DispersionLab />
        <div className="micro-checks">
          <QuickCheck statement="Red light is refracted more than violet light in a glass prism." answer={false} explanation="It is the other way round: violet has the higher refractive index in glass, so it is refracted and deviated the most; red the least." />
        </div>
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
        <AcademyMoment tone="coral" question="Do gamma rays travel faster than radio waves because they have more energy?" from="All EM waves in vacuum" change="Frequency and wavelength trade off" to="Same speed c = 3.0 × 10⁸ m/s" steps={["All are transverse electromagnetic waves.", "Use c = fλ.", "Higher frequency means shorter wavelength, not higher vacuum speed."]} label="COMMON MISTAKE" note="The regions differ in frequency, wavelength, uses and hazards—but not their speed in a vacuum." />
        <SpectrumLab />
        <div className="micro-checks">
          <QuickCheck statement="Gamma rays travel faster than radio waves in a vacuum." answer={false} explanation="All electromagnetic waves travel at the same speed in a vacuum, 3.0×10⁸ m/s. They differ in frequency and wavelength, not speed." />
          <QuickCheck statement="Ultraviolet radiation can cause skin cancer." answer={true} explanation="UV carries enough energy to damage cells; over-exposure can cause skin cancer and eye damage — which is why sunscreen and UV goggles matter." />
        </div>
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
        <AcademyMoment tone="blue" question="Can sound from an explosion reach an astronaut through empty space?" from="A vibrating source" change="Nearby particles form compressions and rarefactions" to="No particles means no sound transmission" steps={["Sound is a mechanical wave.", "Its vibration is parallel to travel direction.", "A solid, liquid or gas must pass the disturbance on."]} label="REAL LIFE CONNECTION" note="Space-film explosions are dramatic storytelling. In a vacuum, an outside observer would not hear them directly." />
        <SoundLab />
        <SoundMediumLab />
        <div className="micro-checks">
          <QuickCheck statement="Making a sound louder raises its pitch." answer={false} explanation="Loudness depends on amplitude and pitch depends on frequency — they are independent. A louder sound has a bigger amplitude but the same pitch unless the frequency changes." />
          <QuickCheck statement="Sound travels faster in water than in air." answer={true} explanation="Particles are closer together in liquids than gases, so sound travels faster in water (~1500 m/s) than in air (~340 m/s), and faster still in solids." />
        </div>
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
        <div className="mindmap">
          <div className="mind-centre"><span>CHAPTER 3</span><b>Waves</b></div>
          <article className="branch b1"><span>Wave properties</span><p>transfers energy, not matter · λ, f, amplitude, speed · v = fλ · transverse ⟂ vs longitudinal ∥ · reflect · refract · diffract (spread most when gap ≈ λ)</p></article>
          <article className="branch b2"><span>Reflection</span><p>angle i = angle r (from the normal) · plane-mirror image: virtual, upright, same size, as far behind as object in front, laterally inverted</p></article>
          <article className="branch b3"><span>Refraction &amp; TIR</span><p>speed change → bends · into denser → toward normal · n = sin i / sin r · n = 1/sin c · past c → total internal reflection (optical fibres)</p></article>
          <article className="branch b4"><span>Lenses &amp; dispersion</span><p>converging lens → principal focus F · beyond F: real, inverted · inside F: virtual, upright, magnified · m = v/u · prism splits white light; violet bends most, red least</p></article>
          <article className="branch b5"><span>EM spectrum</span><p>radio · microwave · infrared · visible · UV · X-ray · gamma · all transverse, all 3.0×10⁸ m/s in vacuum · c = fλ · higher f = shorter λ = more energy/danger</p></article>
          <article className="branch b6"><span>Sound</span><p>longitudinal, needs a medium (none in vacuum) · f = pitch, amplitude = loudness · audible ≈ 20 Hz–20 kHz · fastest in solids, slowest in gases · ultrasound &gt; 20 kHz</p></article>
        </div>
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
