import { CHAPTERS } from "./chapters";

const href = (path: string) => `${path}/`;

export default function HomePage() {
  const ordered = [...CHAPTERS].sort((a, b) => a.n - b.n);

  return (
    <main className="home" id="top">
      <header className="topbar">
        <a href="#top" className="brand">
          <i>Φ</i>
          <span>Field Notes<small>IGCSE Physics</small></span>
        </a>
        <nav aria-label="Site">
          <a href="chapters/">All chapters</a>
          <a href="chapter-1/">Start Chapter 1</a>
        </nav>
      </header>

      <section className="hero home-hero">
        <div className="hero-copy">
          <span className="eyebrow">Cambridge IGCSE Physics 0625 · 2026–2028</span>
          <h1>Field Notes</h1>
          <p>Interactive lessons for every syllabus topic — manipulate real models, then reason the way an examiner marks.</p>
          <div className="hero-actions">
            <a href="chapter-1/" className="primary-button">Start with Chapter 1 <span>→</span></a>
            <a href="chapters/" className="advanced-labs-button">Browse all chapters <span>↗</span></a>
          </div>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbital ring-one"><i /><i /><i /></div>
          <div className="orbital ring-two"><i /><i /></div>
          <div className="field-core"><span>0625</span><b>Φ</b><span>6</span></div>
          <p>six topics · one syllabus</p>
        </div>
      </section>

      <section className="directory-grid home-chapters" aria-label="Chapters">
        {ordered.map((chapter) => (
          <a key={chapter.n} className="directory-card" href={href(chapter.path)}>
            <span className="dc-num">Chapter {chapter.n}</span>
            <h2>{chapter.title}</h2>
            <p>{chapter.blurb}</p>
            <span className="dc-go">Open lesson →</span>
          </a>
        ))}
      </section>

      <footer>
        <div><i>Φ</i><b>Field Notes</b><span>Interactive teaching material for Cambridge IGCSE Physics 0625</span></div>
        <p>Aligned to Topics 1–6 of the 2026–2028 syllabus. Independent educational resource; not endorsed by Cambridge International Education.</p>
      </footer>
    </main>
  );
}
