# Subject profiles

A subject profile captures the domain-specific truths the template needs so interactions stay honest and assessment uses the right language. Fill one in before building (store it at the top of `docs/chapter-N-syllabus-map.md`). Below are worked profiles to copy and adapt; Physics is included as the reference the template was distilled from.

Each profile has three parts:

- **Command words** — the board's assessment verbs and what each demands.
- **Honesty rules** — domain truths a model must never violate (the "must" / "must not" pairs a reviewer checks).
- **Interaction archetypes** — the forms that carry this subject's concepts well.

---

## Mathematics

**Command words:** *calculate* (show working, exact or to stated accuracy), *solve* (find all valid values, state when none exist), *show that* / *prove* (complete logical chain, no gaps), *sketch* (correct qualitative shape, intercepts, asymptotes, turning points labelled — not to scale), *work out*, *find*, *express*, *factorise*, *simplify*, *describe the transformation*.

**Honesty rules:**
- A graph must render the true behaviour: show asymptotes and discontinuities as breaks, never a connected line through an undefined point.
- A solver must reject inputs with no real solution (or state the complex/none result) rather than fabricate a root.
- Rounding must be explicit and consistent; never present a rounded value as exact, and respect required significant figures / decimal places.
- A geometric construction must remain valid (angles, congruence, loci) when any vertex or point is dragged.
- Probability and statistics must use the actual distribution/data, not a slider label; probabilities stay in [0, 1] and sum correctly.
- Domain and range must be enforced (e.g. `log` only for positive inputs, `√` behaviour, division by zero blocked).

**Interaction archetypes:** function/graph explorer with draggable parameters; number line / coordinate plane manipulatives; geometric construction that stays true under drag; equation/inequality solver with step reveal; probability tree or sample-space grid; transformation (translate/rotate/reflect/enlarge) visualiser.

---

## Chemistry

**Command words:** *state, describe, explain, calculate* (with units and correct form), *deduce, predict, suggest, balance* (the equation), *identify, compare, define*.

**Honesty rules:**
- Chemical equations must stay balanced — atoms and charge conserved on both sides.
- A reaction must not proceed when the required reactants, conditions or catalysts are absent; show "no reaction" honestly.
- Conservation of mass holds; product amounts follow stoichiometry (mole ratios), not a slider label.
- pH, concentration, rate and equilibrium indicators must follow the real relationship (e.g. rate rises with temperature/concentration/surface area; Le Chatelier shifts in the correct direction).
- Use IUPAC names and correct formulae/state symbols consistently; represent bonding and structure accurately for the level.
- States of matter and particle spacing/motion must match the modelled temperature/phase.

**Interaction archetypes:** equation balancer; particle-model / state-change animator driven by temperature; titration / pH curve; reaction-rate simulator (temperature, concentration, surface area, catalyst); electrolysis or reactivity-series builder; molecular structure viewer.

---

## Biology

**Command words:** *state, describe, explain, calculate, compare, identify, label, suggest, define, outline*.

**Honesty rules:**
- Food-web and energy-flow changes must propagate along real trophic links, and energy decreases up trophic levels.
- Genetics outcomes (Punnett squares, ratios) must match the actual allele combinations and follow the stated inheritance pattern.
- Diffusion, osmosis and active transport must move substances in the correct direction relative to the gradient (and only against it with an energy source).
- Physiological responses must follow the real mechanism (e.g. homeostatic negative feedback corrects toward the set point; enzyme rate peaks at optimum pH/temperature then denatures).
- Diagrams must be labelled with correct structures and functions; do not imply a structure does something it does not.
- Populations respond to the actual limiting factor changed, not to a clicked location.

**Interaction archetypes:** food-web / energy-pyramid manipulator; Punnett-square and inheritance cross tool; membrane transport / concentration-gradient model; enzyme-activity vs temperature/pH explorer; labelled-diagram drag-and-drop; population / ecosystem dynamics simulator.

---

## Physics (reference)

**Command words:** *calculate* (working + units), *describe* (observable pattern), *explain* (cause → principle → consequence), *state, determine, show that, sketch, compare*.

**Honesty rules:**
- A neutral object must not behave as charged.
- An induced e.m.f. depends on changing flux linkage, not simply magnet position.
- A field arrow must disappear where the simplified model has no defined field.
- A broken circuit must not show current.
- A conducting sphere must show zero electrostatic field inside.
- Outputs come from the real formula (e.g. `v = fλ`, Snell's law), with explicit zero/boundary/invalid states.

**Interaction archetypes:** field/force/induction/motion simulator with direct manipulation; wave and ray-optics models; circuit and circuit-symbol builder; graph readouts computed from formulae.

> For Cambridge IGCSE Physics specifically, use the dedicated `build-igcse-interactive-chapter` skill, which carries these rules in full.
