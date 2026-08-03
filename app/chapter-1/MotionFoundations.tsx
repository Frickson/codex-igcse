export default function MotionFoundations() {
  return (
    <div className="foundation-block motion-foundations">
      <div className="foundation-intro">
        <span className="mini-label">Build the language before the graphs</span>
        <h3>Motion describes how position and velocity change with time.</h3>
        <p>Start with the quantity being measured. Then choose the equation. Only after that should the graph become a shortcut for seeing the same motion.</p>
      </div>

      <div className="motion-definition-grid">
        <article>
          <span>SCALAR</span><h3>Speed</h3>
          <p>Distance travelled per unit time. It tells us how fast, but not which direction.</p>
          <b>speed = distance ÷ time</b>
          <small>unit: m/s</small>
        </article>
        <article>
          <span>VECTOR</span><h3>Velocity</h3>
          <p>Speed in a given direction. A change of direction means velocity changes even if speed stays constant.</p>
          <b>velocity = displacement ÷ time</b>
          <small>unit: m/s with direction</small>
        </article>
        <article>
          <span>RATE OF CHANGE</span><h3>Acceleration</h3>
          <p>Change in velocity per unit time. Positive acceleration increases velocity in the chosen positive direction.</p>
          <b>a = Δv ÷ Δt</b>
          <small>unit: m/s²</small>
        </article>
        <article>
          <span>NEGATIVE ACCELERATION</span><h3>Deceleration</h3>
          <p>Velocity decreases with time. In calculations it is acceleration with a negative sign.</p>
          <b>slowing from 20 to 5 m/s → Δv is negative</b>
          <small>always state the chosen direction</small>
        </article>
      </div>

      <div className="formula-focus">
        <div><span>Average speed</span><b>total distance travelled</b><i>÷</i><b>total time taken</b></div>
        <p>Do not average two speeds unless the time spent at each speed is the same. Use the complete journey totals.</p>
      </div>

      <div className="graph-concept-grid">
        <article>
          <span className="mini-label">Distance–time graph</span>
          <h3>The gradient tells you the speed.</h3>
          <ul>
            <li><strong>Horizontal:</strong> distance unchanged → at rest</li>
            <li><strong>Straight slope:</strong> constant speed</li>
            <li><strong>Steeper line:</strong> greater speed</li>
            <li><strong>Curve getting steeper:</strong> accelerating</li>
          </ul>
          <p className="graph-rule">speed = Δdistance ÷ Δtime</p>
        </article>
        <article>
          <span className="mini-label">Speed–time graph</span>
          <h3>Gradient gives acceleration; area gives distance.</h3>
          <ul>
            <li><strong>Horizontal above zero:</strong> constant speed</li>
            <li><strong>Upward slope:</strong> positive acceleration</li>
            <li><strong>Downward slope:</strong> deceleration</li>
            <li><strong>Changing slope:</strong> changing acceleration</li>
          </ul>
          <p className="graph-rule">a = Δv ÷ Δt · distance = area under graph</p>
        </article>
      </div>
      <p className="concept-takeaway"><b>Read the axes first.</b> A steep line does not always mean the same thing: on a distance–time graph it means high speed; on a speed–time graph it means high acceleration.</p>
    </div>
  );
}
