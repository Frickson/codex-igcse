const scalarExamples = ["distance", "speed", "time", "mass", "energy", "temperature"];
const vectorExamples = ["force", "weight", "velocity", "acceleration", "momentum", "electric field strength", "gravitational field strength"];

export default function MeasurementFoundations() {
  return (
    <div className="foundation-block motion-foundations">
      <div className="foundation-intro">
        <span className="mini-label">Start here · what are we measuring?</span>
        <h3>A measurement is a number with a unit.</h3>
        <p>
          A physical quantity is a measurable property, such as length, volume or time. Its measurement is only useful when the instrument suits the quantity and range. Record the value,
          include its unit, and use a technique that makes the reading as reliable as possible.
        </p>
      </div>

      <div className="measurement-tool-grid">
        <article>
          <span className="tool-symbol" aria-hidden="true">↔</span>
          <div><b>Length</b><small>metre (m)</small></div>
          <ul>
            <li><strong>Ruler / metre rule:</strong> ordinary lengths</li>
            <li><strong>Measuring tape:</strong> long or curved distances</li>
            <li><strong>For greater precision:</strong> calipers or a micrometer</li>
          </ul>
          <p>Start at the zero mark and look perpendicular to the scale.</p>
        </article>
        <article>
          <span className="tool-symbol" aria-hidden="true">▱</span>
          <div><b>Volume</b><small>m³ or cm³</small></div>
          <ul>
            <li><strong>Measuring cylinder:</strong> liquids</li>
            <li><strong>Displacement:</strong> irregular solids</li>
            <li><strong>Formula:</strong> regular solids, e.g. l × w × h</li>
          </ul>
          <p>Read the bottom of the meniscus at eye level for water.</p>
        </article>
        <article>
          <span className="tool-symbol" aria-hidden="true">◷</span>
          <div><b>Time</b><small>second (s)</small></div>
          <ul>
            <li><strong>Clock:</strong> long time intervals</li>
            <li><strong>Digital stopwatch:</strong> short events</li>
            <li><strong>Electronic timer:</strong> less reaction-time influence</li>
          </ul>
          <p>Choose clear start and stop events, then repeat the timing.</p>
        </article>
      </div>

      <div className="measurement-habits" aria-label="Reliable measurement checklist">
        <span>01 <b>Choose</b> the correct instrument and range.</span>
        <span>02 <b>Check zero</b> before measuring.</span>
        <span>03 <b>Read at eye level</b> to avoid parallax.</span>
        <span>04 <b>Repeat</b> and compare readings.</span>
      </div>

      <div className="error-panel">
        <div>
          <span className="mini-label">Why readings differ</span>
          <h3>Every measurement has uncertainty.</h3>
          <p><strong>Random error</strong> makes repeated readings scatter, for example reaction time when starting a stopwatch. Repeating and taking a mean reduces its effect.</p>
          <p><strong>Systematic error</strong> shifts readings in the same direction, for example a zero error. Averaging does <em>not</em> remove it—the instrument or method must be corrected.</p>
        </div>
        <aside>
          <b>For very small values</b>
          <p>Measure many sheets or many oscillations together, then divide by the number. The instrument uncertainty is spread over a larger total, so the percentage uncertainty in one value becomes smaller.</p>
        </aside>
      </div>

      <div className="quantity-compare">
        <article>
          <span>SCALAR</span>
          <h3>Magnitude only</h3>
          <p>A scalar tells us <strong>how much</strong>, with no direction.</p>
          <div className="example-chips">{scalarExamples.map((item) => <small key={item}>{item}</small>)}</div>
        </article>
        <article>
          <span>VECTOR</span>
          <h3>Magnitude and direction</h3>
          <p>A vector is incomplete until we know <strong>how much and which way</strong>.</p>
          <div className="example-chips">{vectorExamples.map((item) => <small key={item}>{item}</small>)}</div>
        </article>
      </div>
      <p className="concept-takeaway"><b>Key contrast:</b> 5 m is a distance (scalar). 5 m east is a displacement (vector). In the same way, speed is scalar while velocity includes direction.</p>
    </div>
  );
}
