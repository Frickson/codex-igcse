# Field Notes — Cambridge IGCSE Physics

Interactive English teaching chapters for Cambridge IGCSE Physics 0625 (examinations 2026–2028), covering all six syllabus topics.

The site home (`/`) is the Field Notes landing page, `/chapters/` is the chapter directory, and each lesson lives at `/chapter-1/` through `/chapter-6/`.

## Chapters

1. Motion, forces & energy — `/chapter-1/`
2. Thermal physics — `/chapter-2/`
3. Waves — `/chapter-3/`
4. Electricity & magnetism — `/chapter-4/`
5. Nuclear physics — `/chapter-5/`
6. Space physics — `/chapter-6/`

The lesson is aligned to the Cambridge IGCSE Physics 0625 syllabus for examinations in 2026–2028. It is an independent educational resource and is not endorsed by Cambridge International Education.

## Reusable chapter-building skill

The repository includes
[`build-igcse-interactive-chapter`](skills/build-igcse-interactive-chapter/SKILL.md),
a reusable agent skill for planning, building, validating, and publishing future
chapters such as Chapter 5. `AGENTS.md` directs Codex to the skill after a fresh
clone, while `CLAUDE.md` provides the equivalent entry point for Claude.

Example request:

```text
Use $build-igcse-interactive-chapter to create Cambridge IGCSE Physics Chapter 5 as an interactive, tested teaching page.
```

## Local development

```bash
npm install
npm run dev
```

## Static build

```bash
npm run build
```

The exported site is written to `out/`. Pushes to `main` deploy automatically through GitHub Pages.
