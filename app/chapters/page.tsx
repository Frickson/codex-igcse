import { CHAPTERS } from "../chapters";

// The directory lives at /chapters/ (depth 1), so the site root is "../".
const href = (path: string) => "../" + (path ? path + "/" : "");

export default function ChaptersDirectory() {
  const ordered = [...CHAPTERS].sort((a, b) => a.n - b.n);
  return (
    <main className="directory">
      <header className="topbar">
        <a href="../" className="brand"><i>Φ</i><span>Field Notes<small>IGCSE Physics · Contents</small></span></a>
        <nav aria-label="Chapters">
          {ordered.map((c) => <a key={c.n} href={href(c.path)}>Chapter {c.n}</a>)}
        </nav>
      </header>

      <section className="directory-hero">
        <span className="eyebrow">Cambridge IGCSE Physics 0625 · 2026–2028</span>
        <h1>Field Notes<br /><em>chapter directory</em></h1>
        <p>Interactive, syllabus-aligned lessons. Pick a chapter to begin — each one lets you manipulate real models, then reason like an examiner is marking.</p>
      </section>

      <section className="directory-grid" aria-label="Chapters">
        {ordered.map((c) => (
          <a key={c.n} className="directory-card" href={href(c.path)}>
            <span className="dc-num">Chapter {c.n}</span>
            <h2>{c.title}</h2>
            <p>{c.blurb}</p>
            <span className="dc-go">Open lesson →</span>
          </a>
        ))}
        <div className="directory-card soon" aria-hidden="true">
          <span className="dc-num">Coming soon</span>
          <h2>More chapters</h2>
          <p>Further topics from the 2026–2028 syllabus will appear here as they are built.</p>
        </div>
      </section>

      <footer>
        <div><i>Φ</i><b>Field Notes</b><span>Interactive teaching material for Cambridge IGCSE Physics 0625</span></div>
        <p>Aligned to the 2026–2028 syllabus. Independent educational resource; not endorsed by Cambridge International Education.</p>
      </footer>
    </main>
  );
}
