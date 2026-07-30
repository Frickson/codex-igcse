import { CHAPTERS } from "./chapters";

// `prefix` is the relative path from the current page to the site root:
// the home page ("/") passes "", a chapter at "/chapter-5/" passes "../".
export default function ChapterNav({ current, prefix }: { current: number; prefix: string }) {
  const ordered = [...CHAPTERS].sort((a, b) => a.n - b.n);
  const i = ordered.findIndex((c) => c.n === current);
  const prev = i > 0 ? ordered[i - 1] : null;
  const next = i >= 0 && i < ordered.length - 1 ? ordered[i + 1] : null;
  const href = (path: string) => prefix + (path ? path + "/" : "");
  return (
    <nav className="chapter-nav" aria-label="Chapter navigation">
      {prev ? (
        <a className="cn-side prev" href={href(prev.path)}>
          <small>← Previous</small><b>Chapter {prev.n} · {prev.title}</b>
        </a>
      ) : <span className="cn-side ghost" aria-hidden="true" />}
      <a className="cn-dir" href={href("chapters")}>All chapters</a>
      {next ? (
        <a className="cn-side next" href={href(next.path)}>
          <small>Next →</small><b>Chapter {next.n} · {next.title}</b>
        </a>
      ) : <span className="cn-side ghost" aria-hidden="true" />}
    </nav>
  );
}
