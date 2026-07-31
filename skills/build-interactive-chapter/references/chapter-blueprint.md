# Interactive chapter blueprint (subject-neutral)

Use this blueprint when planning a new chapter or a substantial expansion, for any subject. Pair it with the subject profile (see [subject-profiles.md](subject-profiles.md)).

## Coverage map

Create a working table with:

| Objective | Tier (Core/Supp, F/H, …) | Explanation | Interaction | Retrieval | Exam practice |
|---|---|---|---|---|---|

Do not start implementation until every in-scope objective has a destination.

## Recommended page structure

1. Chapter route map and estimated lesson time
2. Concise concept sections in syllabus order
3. One dominant interaction per major relationship or procedure
4. Short misconception checks near the relevant concept
5. Formula / rule / notation summary where applicable
6. Original exam-style practice using the board's command words
7. Mind map or retrieval map
8. Final checkpoint

Split advanced or heavy activities onto a separate route when they would make the main lesson unwieldy. Add a prominent main-page link to every separate activity page.

The hero call-to-action row should carry only a single primary "Start the lesson" button plus the lesson-time note — do not add an "All chapters" (or similar) redirect button beside it. Cross-chapter navigation already lives in the top nav bar and the prev/next `ChapterNav` at the foot of the page, so a hero redirect is redundant.

## Interaction acceptance criteria

For every interactive model, record:

- learning question;
- state variables;
- user action;
- visible consequence;
- domain rule connecting action and consequence;
- zero state;
- invalid or out-of-model state;
- reset behavior;
- touch and keyboard alternative;
- responsive layout risk.

Reject decorative motion that does not help answer the learning question.

## Builder pattern

For drag-and-drop builders (apparatus, circuits, equations, sentence/diagram assembly, sets):

- support drag and tap-to-place;
- make placed items individually removable;
- include one Remove all or Reset action;
- prevent accidental duplication when an item is moved;
- permit plausible wrong arrangements when diagnostic feedback is useful;
- explain the expected combination only after an attempt or when the user asks;
- show whether the arrangement is valid/complete before claiming a result.

## Model / simulator pattern

For any model that computes an outcome from inputs (graphs, reactions, populations, fields, forces, statistics):

- use direct manipulation for the quantity the student conceptually controls;
- calculate the outcome from the actual rule/geometry, never from proximity or a label;
- hide or replace indicators where the outcome is undefined (asymptote, no reaction, no defined direction);
- distinguish a value from its rate of change;
- constrain or clearly label regions outside the taught model;
- keep symbols, signs, units and notation consistent;
- ensure indicators cannot overlap draggable objects at their extreme positions.

## Correctness and language checks

- Use the subject's standard notation and terminology consistently (units, symbols, IUPAC/technical names).
- State the assumptions and any reference used to define direction, sign or baseline.
- Distinguish related-but-different quantities the syllabus separates.
- State simplifications (ideal components, ignored effects, forward bias, small-angle, etc.).
- Include units / correct form with numerical answers; respect significant figures where the subject requires.

## Visual QA checklist

- Inspect empty, partial, correct and incorrect states.
- Move every draggable object to all extremes.
- Verify labels do not cross lines, symbols or controls.
- Verify focus indicators and keyboard movement.
- Check desktop, tablet and narrow mobile widths.
- Check that text remains readable when controls wrap.
- Confirm separate routes and return links work under the GitHub Pages base path.

## Completion evidence

Keep these results for the handoff:

- official syllabus URL and edition;
- subject profile (command words + honesty rules);
- coverage map status;
- lint/type/build/test results;
- browser interaction states tested;
- PR URL and merge result;
- Pages deployment run and live URL.
