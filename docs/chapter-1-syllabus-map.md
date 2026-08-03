# Chapter 1 · Motion, forces & energy — syllabus coverage map

Cambridge IGCSE Physics **0625**, syllabus for examination in **2026–2028**, Topic **1 (Motion, forces and energy)**.
Official syllabus: https://www.cambridgeinternational.org/Images/697209-2026-2028-syllabus.pdf

Core = all candidates. **Supplement** = extended candidates only, built on top of Core.

Route (page sections): `overview → measurement → motion → matter → forces → momentum → energy → pressure → practice → mindmap → checkpoint`.
Checkpoint answers persist under `localStorage` key **`igcse-motion-progress`**.

## Coverage table

| Objective | Core/Supp | Explanation on page | Interaction | Retrieval |
|---|---|---|---|---|
| **1.1** Measure length, volume and time with suitable instruments and correct reading technique | Core | §measurement · MeasurementFoundations (ruler/tape/calipers, measuring cylinder/displacement, clock/stopwatch; zero and parallax checks) | MeasurementLab | QuickCheck, checkpoint |
| 1.1 Determine average small distances / short times by measuring multiples; distinguish random uncertainty from systematic error | Core | §measurement · MeasurementFoundations error panel | MeasurementLab (pendulum and paper stack; total and per-item uncertainty) | QuickCheck, checkpoint |
| 1.1 Scalar = magnitude only; vector = magnitude + direction; required syllabus examples | **Supp** | §measurement · MeasurementFoundations comparison | VectorLab | QuickCheck, exam |
| 1.1 Resultant of perpendicular forces/velocities by calculation or graphically | **Supp** | §measurement · VectorLab three-step method | VectorLab (drag components, Pythagoras, TOA/SOH/CAH, directions from east and north) | QuickCheck, exam |
| **1.2** Define speed and velocity; `v = s/t`; average speed from whole-journey totals | Core | §motion · MotionFoundations | MotionGraphLab | checkpoint |
| 1.2 Define acceleration `a = Δv/Δt`; deceleration is negative acceleration | **Supp** | §motion · MotionFoundations | MotionGraphLab | checkpoint |
| 1.2 Distance–time & speed–time graphs: describe/interpret, area = distance, gradient = speed/accel | Core / **Supp** (calc accel from gradient, distance from area incl. non-uniform qualitative) | §motion | MotionGraphLab (build a journey, read gradient & area) | exam |
| 1.2 Free fall: `g ≈ 9.8 m/s²` near Earth; air resistance & terminal velocity | Core / **Supp** (terminal velocity explanation) | §motion | FreeFallLab (with/without air resistance) | QuickCheck |
| **1.3** Mass, inertia; weight `W = mg`; gravitational field strength `g = W/m`; measure with balances | Core | §matter | MassWeightLab (change planet g, compare mass vs weight) | checkpoint |
| **1.4** Density `ρ = m/V`; measure density of solids/liquids; float/sink prediction | Core | §matter | DensityLab (measure regular/irregular solid & liquid; float test) | QuickCheck, exam |
| **1.5.1** Force changes size, shape, motion; resultant force | Core | §forces | ForceEffectsLab / ResultantLab | checkpoint |
| **1.5.2** Elastic deformation; Hooke's law; spring constant; limit of proportionality | Core / **Supp** (`F = kx`, spring constant) | §forces | HookeLab (load a spring, extension graph, limit) | exam |
| **1.5.3** Resultant force & acceleration; `F = ma`; friction | Core / **Supp** (`F = ma` calcs) | §forces | NewtonsSecondLab (vary F, m → a) | checkpoint |
| **1.5.4** Friction & air resistance oppose motion; drag increases with speed | Core / **Supp** | §forces (+ §motion terminal velocity) | FreeFallLab | QuickCheck |
| **1.5.5** Circular motion: constant speed, changing velocity; force toward centre; effect of speed/radius/mass | **Supp** | §forces | CircularMotionLab (vary speed/radius/mass → required force) | exam |
| **1.5.6** Moments; `moment = F × d`; principle of moments; balance beam | Core / **Supp** (multiple moments) | §forces | MomentsLab (balance a beam) | checkpoint |
| **1.5.7** Centre of gravity; stability; toppling | Core | §forces | StabilityLab (drag load, tip the block) | QuickCheck |
| **1.6.1** Momentum `p = mv`; impulse `Ft = Δ(mv)`; conservation in collisions | **Supp** | §momentum | MomentumLab (1-D collision, conservation) | exam |
| 1.6.1 Resultant force = rate of change of momentum | **Supp** | §momentum | MomentumLab | checkpoint |
| **1.7.1** Energy stores (kinetic, gravitational, chemical, elastic, nuclear, internal/thermal, electrostatic); transfers | Core | §energy | EnergyStoresLab | checkpoint |
| 1.7.1 Principle of conservation of energy; flow diagrams | Core / **Supp** | §energy | EnergyStoresLab | QuickCheck |
| 1.7.1 `KE = ½mv²`; `ΔGPE = mgΔh` | Core / **Supp** (KE, GPE calcs) | §energy | EnergyCalcLab | exam |
| **1.7.2** Work `W = Fd = ΔE`; work = energy transferred | Core | §energy | EnergyCalcLab | checkpoint |
| **1.7.3** Energy resources (fossil, nuclear, biofuel, wind, hydro, tidal, solar, geothermal); generating electricity; efficiency of the process; renewable vs non-renewable; Sun as source; boil-water principle | Core / **Supp** (radioactive decay in geothermal/nuclear detail) | §energy | ResourcesLab (compare sources) | exam |
| **1.7.4** Efficiency `= useful/total (×100%)` for energy and power | Core / **Supp** (power form) | §energy | EnergyCalcLab (Sankey-style) | checkpoint |
| 1.7 Power `P = ΔE/t = W/t` | Core / **Supp** | §energy | EnergyCalcLab | exam |
| **1.8** Pressure `p = F/A`; units Pa | Core | §pressure | PressureLab | checkpoint |
| 1.8 Liquid pressure `p = ρgh`; increases with depth/density | Core / **Supp** (`p = ρgh` calc) | §pressure | LiquidPressureLab (vary depth/density) | exam |

## Not in scope (flag if requested)
- Detailed projectile motion / 2-D kinematics equations (e.g. `v² = u² + 2as`) — not required at IGCSE.
- Vector addition of non-perpendicular vectors by calculation.
- Rotational dynamics beyond the principle of moments.
- Pressure in gases / kinetic theory (belongs to Topic 2, Thermal physics).

## Assessment artifacts
- **QuickCheck** micro-checks (true/false) placed beside the relevant concept.
- **10 exam-style questions** (`examQuestions`) with mark-point schemes, spanning calculate/describe/explain command words.
- **Mind map** with one branch per subtopic group.
- **10-question checkpoint** (`quizQuestions`), misconception-focused, saved to `igcse-motion-progress`.
