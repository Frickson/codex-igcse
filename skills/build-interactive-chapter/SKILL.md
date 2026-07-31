---
name: build-interactive-chapter
description: Build or extend syllabus-aligned interactive teaching chapters for ANY subject (Math, Chemistry, Biology, Economics, Geography, …) as responsive, tested web pages. Use when turning syllabus objectives into explanations, honest interactive simulations or manipulatives, retrieval practice and exam-style questions, then publishing the chapter. This is the subject-neutral template — for Cambridge IGCSE Physics specifically, prefer build-igcse-interactive-chapter; use this for every other subject or exam board.
---

# Build an Interactive Teaching Chapter (subject-neutral template)

Create a teaching chapter that connects concise explanations, direct manipulation, retrieval practice and exam-style reasoning. Treat **subject correctness** and **syllabus coverage** as acceptance criteria, not editorial polish. This skill is deliberately subject-agnostic: the workflow, phasing, honesty discipline, QA and publishing are the same for every subject; only the *domain truths* change, and you capture those up front in a subject profile.

## 0. Fill the subject profile first

Everything downstream depends on this. Before writing any content, complete a short profile and keep it with the chapter (e.g. at the top of `docs/chapter-N-syllabus-map.md`):

- **Subject & level** (e.g. IGCSE Mathematics, IGCSE Chemistry).
- **Exam board, syllabus code, examination years.**
- **Scope** — which objectives, and any tiering (Core/Supplement, Foundation/Higher, etc.).
- **Command-word vocabulary** — the board's own verbs and what each demands (e.g. *calculate, show that, prove, sketch, describe, explain, compare*). Assessment must use these precisely.
- **Notation & language conventions** — units, symbols, terminology to use consistently (e.g. `f(x)`, significant figures, IUPAC names, correct SI units).
- **Honesty rules** — the domain truths a model must never violate (see below and `references/subject-profiles.md`).
- **Interaction archetypes** for this subject — which forms carry the concepts (function/graph explorer, geometric construction, equation balancer, reaction/particle model, labelled diagram, data/statistics tool, drag-and-drop builder, step-by-step solver).

Read [subject-profiles.md](references/subject-profiles.md) for worked profiles (command words + honesty rules + interaction archetypes) for Math, Chemistry and Biology, with Physics as a reference example.

## 1. Establish the source of truth

1. Confirm the syllabus code, examination years, chapter and tier scope from the profile.
2. Browse the current official syllabus before writing content.
3. Build a checklist mapping every relevant syllabus objective to a page section or activity.
4. Mark any requested content outside the syllabus rather than silently presenting it as required.
5. Use original exam-style questions based on recurring assessment patterns. Do not reproduce copyrighted past-paper questions.

## 2. Inspect the existing project and set up the build

**Canonical home:** these interactive chapters live in the `Frickson/codex-igcse` repository (Next.js + React + TypeScript, Tailwind, static `output: "export"` to GitHub Pages, the "Field Notes" design system). Add every new chapter *into that repo* as a new route (e.g. `app/<subject>-chapter-N/` or the project's established naming) — do not start a standalone project. Copy the **closest existing chapter** as the structural template: its client page component, `useScrollProgress`, `QuickCheck`, `sections` nav array, numbered `lesson-section`s opening with a route-map + tier band, `lab-shell` interactions, exam list, mind map, `localStorage` checkpoint, and its `layout.tsx` metadata pattern. Link the new chapter from the previous chapter's nav, and add a `tests/chapter-N.test.mjs` plus a `docs/chapter-N-syllabus-map.md`.

1. Read repository instructions, routes, components, styles, tests and deployment workflow.
2. Reuse the established design system and interaction conventions; append any chapter-specific CSS as new, chapter-scoped classes rather than editing existing chapters' rules.
3. Preserve unrelated user changes; leave earlier chapters' content untouched and treat them only as templates.
4. Each chapter is its own route; only trivial chapters belong inline on the home page.

**Build large chapters in phases, and commit after each phase** so a timeout or crash can never lose more than one phase of work. A full syllabus topic is too large to write in one pass. Split the work and keep **one** public chapter page whose interactions live in **small, per-component files** (e.g. `app/<subject>-chapter-N/labs/QuadraticLab.tsx`) that the page imports — never a single multi-thousand-line `page.tsx`. A typical phasing:

- **Phase 1 — Scaffold:** subject profile + syllabus map (`docs/chapter-N-syllabus-map.md`), route, `layout.tsx` metadata, chapter-registry entry, navigation, and the `page.tsx` shell (hero, route-map, section headings, nav) with empty interaction slots. Commit.
- **Phases 2–4 — Content:** implement the sections in contiguous groups (roughly 2–4 subtopics per phase), one interaction component file at a time, wiring each into the page. Commit after each group.
- **Validation & publish — split into separately committed phases** so a slow test or QA run that hits an API timeout can never lose committed progress:
  - **Phase 5a — Automated checks:** add `tests/chapter-N.test.mjs`, update the `test` script, run lint/build/test until green. Commit.
  - **Phase 5b — Browser QA:** live visual + interaction testing at desktop and mobile widths (drag, tap, keyboard, reset, wrong/correct answers, overflow at extremes). Fix and re-run until clean, then commit any fixes. Remove any QA-only tooling (e.g. a Playwright devDependency and its lockfile entries) before the final commit.
  - **Phase 5c — Publish:** open the PR, present it, and only after explicit approval merge and verify deployment.

Treat any step that can be slow — installing browsers, running the full browser QA sweep, large builds — as its own phase with its own commit; never bundle slow work behind an already-verified checkpoint, or a timeout mid-run discards work you have already proven good.

Work on a dedicated feature branch throughout.

Read [chapter-blueprint.md](references/chapter-blueprint.md) before planning a new chapter or major chapter expansion.

## 3. Design the learning sequence

For each syllabus objective, connect:

`explain → manipulate → predict → observe → justify → retrieve`

Prefer HTML/CSS/React interactions for concepts students should explore repeatedly. Use video only when continuous real-world footage adds information an interactive model cannot.

Include only interactions with a clear learning purpose. A control must change a meaningful variable or state in the subject's model, not merely trigger an animation.

## 4. Build honest interactions

The honesty discipline is universal; the specific truths come from the subject profile.

1. Define the domain state model before drawing the interface.
2. Make output depend on the actual cause/rule, not merely on proximity or a button press.
3. Cover invalid, zero and boundary states explicitly.
4. Keep qualitative or simplified models clearly labelled; do not imply accuracy the model does not have.
5. Let students drag or directly manipulate the object they conceptually control when practical.
6. Support pointer, touch and keyboard input.
7. Provide individual removal and a single clear/reset action for builders.
8. Explain what a correct result *means* in the subject, not only that it is correct.

Examples of required honesty across subjects (extend from `references/subject-profiles.md`):

- **Math:** a graph must show the true asymptote/discontinuity, not a connected line through it; a "solve" tool must reject inputs with no real solution rather than invent one; a geometric construction must stay valid when a vertex is dragged.
- **Chemistry:** an equation must stay balanced (atoms conserved); a reaction must not proceed when reactants/conditions are absent; concentration/pH must follow the real relationship, not a slider label.
- **Biology:** a food-web change must propagate along real trophic links; a Punnett-square outcome must match the actual allele combinations; a diffusion model must move down a concentration gradient, not toward a clicked point.
- **Physics (reference):** a neutral object must not behave as charged; a broken circuit must show no current; a field arrow must disappear where the simplified model has no defined field.

## 5. Create assessment and retrieval

Include a small set of:

- prediction checks before revealing an outcome;
- misconception-focused true/false or multiple-choice questions;
- original structured exam-style questions with mark-point guidance;
- a chapter mind map or retrieval map;
- a final checkpoint with explanatory feedback.

Use the exam board's command-word expectations from the subject profile precisely — e.g. *calculate* with working and units; *show that* / *prove* with a complete logical chain; *describe* the observable pattern; *explain* through cause, principle and consequence; *sketch* with the correct qualitative shape and key features labelled.

## 6. Validate in layers

1. Review every explanation and interactive state against the syllabus checklist and the subject's honesty rules.
2. Run lint, type checking, production build and tests.
3. Add regression tests for each corrected misconception or interaction boundary.
4. Inspect the rendered page in a browser at desktop and mobile widths.
5. Exercise drag, tap, keyboard, reset, wrong-answer and correct-answer paths.
6. Check for overlap at extreme object positions and after responsive reflow.
7. Re-run the full validation after visual fixes.

Do not report an interaction as verified from source inspection alone.

## 7. Publish safely

When publishing is authorized:

1. Commit on a feature branch.
2. Push and open a focused pull request.
3. Review the complete PR diff and validation evidence.
4. Merge only under the repository's approval and risk rules.
5. Wait for the GitHub Pages workflow.
6. Confirm the live page contains the new chapter content.

Report the PR, deployment result, live URL, syllabus coverage and test results.
