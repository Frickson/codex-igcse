# Interactive chapter blueprint

Use this blueprint when planning a new chapter or a substantial expansion.

## Coverage map

Create a working table with:

| Objective | Core/Supplement | Explanation | Interaction | Retrieval | Exam practice |
|---|---|---|---|---|---|

Do not start implementation until every in-scope objective has a destination.

## Recommended page structure

1. Chapter route map and estimated lesson time
2. Concise concept sections in syllabus order
3. One dominant interaction per major causal relationship
4. Short misconception checks near the relevant concept
5. Formula and unit summary where applicable
6. Original exam-style practice
7. Mind map or retrieval map
8. Final checkpoint

Split advanced practicals onto a separate route when they would make the main lesson unwieldy. Add a prominent main-page link to every separate lab page.

## Interaction acceptance criteria

For every interactive model, record:

- learning question;
- state variables;
- user action;
- visible consequence;
- physical rule connecting action and consequence;
- zero state;
- invalid or out-of-model state;
- reset behavior;
- touch and keyboard alternative;
- responsive layout risk.

Reject decorative motion that does not help answer the learning question.

## Builder pattern

For drag-and-drop circuit or apparatus builders:

- support drag and tap-to-place;
- make placed items individually removable;
- include one Remove all or Reset action;
- prevent accidental duplication when an item is moved;
- permit plausible wrong arrangements when diagnostic feedback is useful;
- explain the expected combination only after an attempt or when the user asks;
- show whether the path is complete before claiming current or operation.

## Simulator pattern

For field, force, induction or motion simulators:

- use direct manipulation for position;
- calculate direction from actual geometry;
- hide or replace arrows where direction is undefined;
- distinguish position from rate of change;
- constrain or label regions outside the syllabus model;
- keep field-line arrowheads and polarity consistent;
- ensure indicators cannot overlap draggable objects at their extreme positions.

## Physics and language checks

- Use `potential difference (p.d.)`, `electromotive force (e.m.f.)` and `conventional current` consistently.
- State the reference used to define a field direction.
- Distinguish energy transfer from current consumption.
- Distinguish a component's resistance change from the resulting circuit current.
- State assumptions such as ideal components, ignored end effects or forward bias.
- Include units with numerical answers.

## Visual QA checklist

- Inspect empty, partial, correct and incorrect states.
- Move every draggable object to all extremes.
- Verify labels do not cross wires, symbols or controls.
- Verify focus indicators and keyboard movement.
- Check desktop, tablet and narrow mobile widths.
- Check that text remains readable when controls wrap.
- Confirm separate routes and return links work under the GitHub Pages base path.

## Completion evidence

Keep these results for the handoff:

- official syllabus URL and edition;
- coverage map status;
- lint/type/build/test results;
- browser interaction states tested;
- PR URL and merge result;
- Pages deployment run and live URL.
