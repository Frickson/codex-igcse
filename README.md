# Field Notes — Electricity & Magnetism

An interactive English teaching resource for Cambridge IGCSE Physics 0625, Chapter 4.

## What is included

- syllabus map for the current sections 4.1–4.5
- animated magnetic field and electromagnet model
- electrostatics and electric-field mapping laboratories
- ammeter/voltmeter placement and live I–V graph activities
- interactive series/parallel circuit builder
- circuit-component and potential-divider design activities
- motor, generator, and transformer activities
- separate advanced generator-waveform and motor-force laboratory page
- electrical safety explanations and checks
- original exam-style questions based on recurring assessment patterns
- retrieval mind map and saved six-question checkpoint

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
