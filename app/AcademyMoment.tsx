type AcademyMomentProps = {
  question: string;
  from: string;
  change: string;
  to: string;
  steps: [string, string, string];
  label?: "ANDREW'S TIP" | "COMMON MISTAKE" | "CAMBRIDGE EXAM FOCUS" | "REAL LIFE CONNECTION";
  note: string;
  tone?: "teal" | "amber" | "blue" | "coral";
};

export default function AcademyMoment({ question, from, change, to, steps, label = "CAMBRIDGE EXAM FOCUS", note, tone = "teal" }: AcademyMomentProps) {
  return (
    <div className={`academy-moment ${tone}`}>
      <div className="academy-think">
        <span>THINK FIRST</span>
        <p>{question}</p>
        <small>Predict before you continue.</small>
      </div>
      <div className="academy-cause" aria-label={`${from}, then ${change}, therefore ${to}`}>
        <div><small>START</small><b>{from}</b></div><i>→</i>
        <div><small>WHAT CHANGES?</small><b>{change}</b></div><i>→</i>
        <div><small>RESULT</small><b>{to}</b></div>
      </div>
      <ol className="academy-reasoning">
        {steps.map((step, index) => <li key={step}><span>{index + 1}</span>{step}</li>)}
      </ol>
      <div className={`academy-signature ${label.toLowerCase().replaceAll(" ", "-").replaceAll("'", "")}`}>
        <span>{label}</span><p>{note}</p>
      </div>
    </div>
  );
}
