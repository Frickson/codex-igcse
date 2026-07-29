---
name: build-igcse-interactive-chapter
description: Build or extend syllabus-aligned interactive Cambridge IGCSE Physics teaching chapters as responsive web pages. Use when creating a new chapter such as Chapter 5, converting syllabus objectives into explanations and simulations, adding drag-and-drop labs or questions, reviewing physics correctness, matching an existing teaching site, or publishing a tested chapter through GitHub Pages.
---

# Build an IGCSE Interactive Chapter

Create a teaching chapter that connects concise explanations, direct manipulation, retrieval practice and exam-style reasoning. Treat scientific correctness and syllabus coverage as acceptance criteria, not editorial polish.

## 1. Establish the source of truth

1. Identify the syllabus code, examination years, chapter and Core/Supplement scope.
2. Browse the current official Cambridge syllabus before writing content.
3. Build a checklist mapping every relevant syllabus objective to a page section or activity.
4. Mark any requested content outside the syllabus rather than silently presenting it as required.
5. Use original exam-style questions based on recurring assessment patterns. Do not reproduce copyrighted past-paper questions.

## 2. Inspect the existing project

1. Read repository instructions, routes, components, styles, tests and deployment workflow.
2. Reuse the established design system and interaction conventions.
3. Preserve unrelated user changes.
4. Decide whether the chapter belongs on the main page or a separate route based on length and cognitive load.

Read [chapter-blueprint.md](references/chapter-blueprint.md) before planning a new chapter or major chapter expansion.

## 3. Design the learning sequence

For each syllabus objective, connect:

`explain → manipulate → predict → observe → justify → retrieve`

Prefer HTML/CSS/React interactions for concepts students should explore repeatedly. Use video only when continuous real-world motion or apparatus footage adds information an interactive model cannot.

Include only interactions with a clear learning purpose. A control must change a scientifically meaningful variable or state.

## 4. Build scientifically honest interactions

1. Define the physical state model before drawing the interface.
2. Make output depend on the actual cause, not merely on proximity or a button press.
3. Cover invalid, zero and boundary states explicitly.
4. Keep qualitative models clearly labelled; do not imply quantitative accuracy.
5. Let students drag the object they conceptually manipulate when practical.
6. Support pointer, touch and keyboard input.
7. Provide individual removal and a single clear/reset action for builders.
8. Explain what a correct result means physically, not only that it is correct.

Examples of required honesty:

- A neutral object must not behave as charged.
- An induced e.m.f. depends on changing flux linkage, not simply magnet position.
- A field arrow must disappear where the simplified model has no defined field.
- A broken circuit must not show current.
- A conducting sphere must show zero electrostatic field inside.

## 5. Create assessment and retrieval

Include a small set of:

- prediction checks before revealing an outcome;
- misconception-focused true/false or multiple-choice questions;
- original structured exam-style questions with mark-point guidance;
- a chapter mind map or retrieval map;
- a final checkpoint with explanatory feedback.

Use Cambridge command-word expectations: calculate with working and units; describe the observable pattern; explain through cause, principle and consequence.

## 6. Validate in layers

1. Review every explanation and simulator state against the syllabus checklist.
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
