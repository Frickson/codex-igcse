"use client";

import { useState } from "react";

type Scene = "straight" | "turn" | "reverse";

const scenes: Record<Scene, { title: string; observation: string; velocity: string }> = {
  straight: { title: "Straight ahead", observation: "Same speed, same direction", velocity: "Velocity stays constant" },
  turn: { title: "Turn a corner", observation: "Speed can stay at 10 m/s", velocity: "Velocity changes because direction changes" },
  reverse: { title: "Reverse direction", observation: "The speedometer can still show 10 m/s", velocity: "Velocity points the opposite way" },
};

export default function MotionFoundations() {
  const [scene, setScene] = useState<Scene>("straight");
  const active = scenes[scene];

  return (
    <div className="foundation-block academy-foundations motion-academy">
      <div className="academy-opening">
        <div>
          <span className="mini-label">Real life → concept</span>
          <h3>A speedometer tells only <em>half</em> the story.</h3>
          <p>It tells <mark>how fast</mark>. To describe motion fully, we may also need <mark>which direction</mark> and <mark>how the velocity changes</mark>.</p>
        </div>
        <div className="speedometer" aria-hidden="true"><i /><b>10</b><small>m/s</small></div>
      </div>

      <div className="think-first">
        <span>THINK FIRST</span><p>A car turns a corner at a steady 10 m/s. Its speed is unchanged. Has its velocity changed?</p><small>Choose a scene, watch the direction arrow, then explain why.</small>
      </div>

      <div className="motion-scene-explorer">
        <div className="scene-tabs" role="tablist" aria-label="Motion scenario">
          {(Object.keys(scenes) as Scene[]).map((key) => <button key={key} role="tab" aria-selected={scene === key} className={scene === key ? "active" : ""} onClick={() => setScene(key)}>{scenes[key].title}</button>)}
        </div>
        <div className={`motion-scene ${scene}`} aria-live="polite">
          <div className="road" aria-hidden="true"><i className="car">➤</i><span className="velocity-arrow">velocity</span></div>
          <div className="scene-result"><span>{active.observation}</span><strong>{active.velocity}</strong></div>
        </div>
      </div>

      <div className="speed-velocity-compare">
        <article><span>SCALAR</span><h3>Speed</h3><p><strong>Distance</strong> travelled per unit time.</p><div>speed = <b>distance</b> ÷ time</div></article>
        <article><span>VECTOR</span><h3>Velocity</h3><p><strong>Displacement</strong> per unit time.</p><div>velocity = <b>displacement</b> ÷ time</div></article>
      </div>

      <div className="rate-story">
        <div className="rate-visual" aria-hidden="true"><span>5</span><i>→</i><span>20</span><small>m/s</small></div>
        <div><span className="mini-label">Velocity changes by 15 m/s in 3 s</span><h3>Acceleration asks: “how quickly did velocity change?”</h3><p className="hero-formula">a = Δv ÷ Δt = (20 − 5) ÷ 3 = <strong>5 m/s²</strong></p></div>
      </div>

      <div className="accel-contrast">
        <article><i>↗</i><div><span>ACCELERATION</span><b>velocity increases in the chosen positive direction</b></div></article>
        <article><i>↘</i><div><span>DECELERATION</span><b>speed decreases; acceleration is opposite to motion</b></div></article>
      </div>

      <div className="academy-callout trap"><span>EXAM TRAP</span><p>Negative acceleration does <strong>not always</strong> mean slowing down. It states a direction. An object moving in the negative direction can speed up with negative acceleration.</p></div>

      <div className="formula-focus">
        <div><span>Average speed</span><b>total distance</b><i>÷</i><b>total time</b></div>
        <p><strong>Never blindly average two speeds.</strong> Use totals unless the time spent at each speed is equal.</p>
      </div>

      <div className="graph-concept-grid visual-rules">
        <article>
          <div className="mini-graph distance" aria-hidden="true"><i /><b>gradient</b></div>
          <span className="mini-label">Distance–time</span><h3>Gradient = speed</h3>
          <ul><li><strong>Flat</strong> → at rest</li><li><strong>Straight slope</strong> → constant speed</li><li><strong>Steeper</strong> → faster</li><li><strong>Curve steepens</strong> → accelerating</li></ul>
        </article>
        <article>
          <div className="mini-graph speed" aria-hidden="true"><i /><b>area</b></div>
          <span className="mini-label">Speed–time</span><h3>Gradient = acceleration</h3>
          <ul><li><strong>Flat above zero</strong> → constant speed</li><li><strong>Slope up/down</strong> → accelerate/decelerate</li><li><strong>Area underneath</strong> → distance travelled</li></ul>
        </article>
      </div>
      <div className="academy-callout focus"><span>CAMBRIDGE EXAM FOCUS</span><p><strong>Read the axes before the shape.</strong> “Steeper” means faster on a distance–time graph, but greater acceleration on a speed–time graph.</p></div>
    </div>
  );
}
