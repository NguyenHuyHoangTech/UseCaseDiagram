import React from "react";
import { AlertTriangle, CheckCircle2, Database, Server, Ticket, UserRound, XCircle } from "lucide-react";

const statusIcon = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  idle: UserRound,
};

const copyByEffect = {
  idle: {
    title: "Actor's Journey",
    message: "Select a block and click Check to see the system response.",
  },
  successPath: {
    title: "Actor completes the journey",
    message: "Actor completed the booking journey and received the e-ticket.",
  },
  ticketSuccess: {
    title: "E-ticket generated",
    message: "Customer received the e-ticket. This is the final value the Actor cares about.",
  },
  stopAtNode: {
    title: "Actor got stuck",
    message: "The journey stopped because the selected block did not bring the Actor to a clear goal.",
  },
  backendRoom: {
    title: "Actor dragged into technical details",
    message: "The Actor does not care about this technical detail. The Actor only wants to achieve the ticket booking goal.",
  },
  databaseRoom: {
    title: "Actor stands before the database",
    message: "The database helps the system run, but it is not what the Actor wants to achieve.",
  },
  outdatedTechnology: {
    title: "Use Case name tied to technology",
    message: "When the technology changes, this block quickly becomes outdated.",
  },
  uiChanged: {
    title: "UI changes",
    message: "If a Use Case name depends on a button or screen, it becomes outdated when the interface changes.",
  },
  flowchartWarning: {
    title: "Diagram bloating into a flowchart",
    message: "A Use Case Diagram should describe goals, not every single click or small action.",
  },
  lockedSeat: {
    title: "Seat locked temporarily",
    message: "This is a supporting mechanism. An has not achieved the goal just because the seat is locked temporarily.",
  },
  wrongActor: {
    title: "Incorrect Actor perspective",
    message: "This association leads the Actor to a goal that does not belong to their role.",
  },
};

export default function VisualSimulationCanvas({ state }) {
  const effect = state?.effect || "idle";
  const copy = copyByEffect[effect] || copyByEffect.idle;
  const title = state?.title || copy.title;
  const message = state?.message || copy.message;

  return (
    <section className={`visual-sim visual-sim-${effect}`} aria-live="polite">
      <div className="visual-sim-header">
        <div>
          <span className="lesson-kicker">Visual Simulation</span>
          <h3>{title}</h3>
        </div>
        <div className="visual-actor">
          <span>Actor</span>
          <UserRound size={22} />
        </div>
      </div>

      {state?.selectedBlock && (
        <div className="visual-selected-block">
          Block under test: <strong>{state.selectedBlock}</strong>
        </div>
      )}

      {renderScene(effect, state)}

      <p className="visual-message">{message}</p>
    </section>
  );
}

function renderScene(effect, state) {
  if (effect === "backendRoom" || effect === "databaseRoom") {
    return (
      <div className="backend-room">
        <div className="server-rack">
          <Server size={32} />
          <span>API</span>
          <code>POST /tickets</code>
        </div>
        <div className="server-rack database">
          <Database size={32} />
          <span>Database</span>
          <code>SELECT * FROM Movie</code>
        </div>
        <div className="actor-card confused">Actor ?</div>
      </div>
    );
  }

  if (effect === "outdatedTechnology" || effect === "uiChanged") {
    return (
      <div className="visual-timeline">
        {(state?.timeline || []).map((item) => {
          const Icon = statusIcon[item.status] || statusIcon.idle;
          return (
            <div className={`timeline-step ${item.status}`} key={item.label}>
              <Icon size={18} />
              <span>{item.label}</span>
            </div>
          );
        })}
        <div className="broken-block">{state?.selectedBlock || "Specific block"} is outdated</div>
      </div>
    );
  }

  if (effect === "lockedSeat") {
    return (
      <div className="seat-lock-scene">
        <div className="seat-grid">
          {Array.from({ length: 9 }).map((_, index) => (
            <span className={index === 4 ? "seat locked" : "seat"} key={index}>Seat</span>
          ))}
        </div>
        <div className="seat-timer">05:00</div>
      </div>
    );
  }

  if (effect === "ticketSuccess") {
    return (
      <div className="ticket-scene">
        <div className="ticket-card">
          <Ticket size={34} />
          <strong>Cinema Ticket</strong>
          <span>Movie • Showtime • Seat</span>
          <code>QR-TICKET-2026</code>
        </div>
      </div>
    );
  }

  return <CheckpointPath checkpoints={state?.checkpoints || []} compact={effect === "flowchartWarning"} />;
}

function CheckpointPath({ checkpoints, compact }) {
  return (
    <div className={`checkpoint-path ${compact ? "compact" : ""}`}>
      {checkpoints.map((checkpoint, index) => {
        const Icon = statusIcon[checkpoint.status] || statusIcon.idle;
        return (
          <React.Fragment key={checkpoint.id}>
            <div className={`checkpoint ${checkpoint.status}`}>
              <span className="checkpoint-icon">{checkpoint.icon}</span>
              <Icon size={16} />
              <strong>{checkpoint.label}</strong>
            </div>
            {index < checkpoints.length - 1 && <span className="checkpoint-line" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
