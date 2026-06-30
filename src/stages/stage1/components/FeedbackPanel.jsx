import React from "react";
import { CheckCircle2, Info, Sparkles, XCircle } from "lucide-react";

const iconByTone = {
  idle: Info,
  success: CheckCircle2,
  error: XCircle,
  mixed: Info,
};

export default function FeedbackPanel({ result }) {
  const Icon = iconByTone[result?.tone || "idle"];
  const effectLabel = result?.visualEffect ? visualEffectLabels[result.visualEffect] || result.visualEffect : null;

  return (
    <aside className={`lesson-feedback ${result?.tone || "idle"}`}>
      <div className="feedback-title">
        <Icon size={20} />
        <span>{result?.title || "Feedback"}</span>
      </div>
      <p>{result?.message || "Interact on the canvas and then click Run to see the system react."}</p>
      {result?.simulation && (
        <div className="simulation-box">
          <strong>Simulation</strong>
          {effectLabel && (
            <span className="visual-effect-chip">
              <Sparkles size={14} />
              {effectLabel}
            </span>
          )}
          <span>{result.simulation}</span>
        </div>
      )}
      {Boolean(result?.details?.length) && (
        <ul className="feedback-list">
          {result.details.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </aside>
  );
}

const visualEffectLabels = {
  shake: "Stop at node",
  bounceBack: "Stop at node",
  crack: "Outdated technology",
  stopAtNode: "An is stuck",
  flowchartWarning: "Diagram bloated into a flowchart",
  successPath: "Complete successful journey",
  ticketSuccess: "Receive e-ticket",
  backendRoom: "Pulled into backend room",
  databaseRoom: "Pulled into database",
  outdatedTechnology: "Outdated technology",
  uiChanged: "UI changed",
  lockedSeat: "Seat locked",
  wrongActor: "Wrong Actor perspective",
  renameMachine: "Need to rename Use Case",
};
