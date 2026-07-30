# Field Notes — Cambridge IGCSE Physics

Interactive English teaching chapters for Cambridge IGCSE Physics 0625 (examinations 2026–2028), covering all six syllabus topics:

1. Motion, forces & energy — `/chapter-1/`
2. Thermal physics — `/chapter-2/`
3. Waves — `/chapter-3/`
4. Electricity & magnetism — `/chapter-4/`
5. Nuclear physics — `/chapter-5/`
6. Space physics — `/chapter-6/`

The site home (`/`) is a Field Notes landing page; `/chapters/` is the chapter directory. There is no Topic 7 in the official syllabus.

The material is an independent educational resource and is not endorsed by Cambridge International Education.

## Reusable chapter-building skill

The repository includes
[`build-igcse-interactive-chapter`](skills/build-igcse-interactive-chapter/SKILL.md),
a reusable agent skill for planning, building, validating, and publishing chapters.
`AGENTS.md` directs Codex to the skill after a fresh clone, while `CLAUDE.md`
provides the equivalent entry point for Claude.

Example request:

```text
Use $build-igcse-interactive-chapter to create Cambridge IGCSE Physics Chapter 5 as an interactive, tested teaching page.
```

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm test
```

runs the production export and the regression suite.
