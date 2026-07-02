import React, { useState } from "react";
import { buildVisualState, connectionKey, extraConnections, missingConnections } from "./interactionUtils";

export default function ConnectActorToUseCase({ step, onResult }) {
  const { data } = step;
  const [selectedActor, setSelectedActor] = useState(null);
  const [connections, setConnections] = useState([]);

  const toggleConnection = (useCaseId) => {
    if (!selectedActor) return;
    const next = { actorId: selectedActor, useCaseId };
    setConnections((current) => {
      const exists = current.some((item) => item.actorId === next.actorId && item.useCaseId === next.useCaseId);
      return exists ? current.filter((item) => !(item.actorId === next.actorId && item.useCaseId === next.useCaseId)) : [...current, next];
    });
  };

  const run = () => {
    const missing = missingConnections(connections, data.correctConnections);
    const extra = extraConnections(connections, data.correctConnections);
    if (missing.length === 0 && extra.length === 0) {
      onResult({
        tone: "success",
        title: "Correct Association",
        message: "The actor is correctly associated with the goal they trigger.",
        simulation: data.successSimulation,
        visualEffect: data.successVisualEffect,
        visualState: buildVisualState(data.successVisualEffect || "successPath", {
          message: data.successSimulation,
        }),
      });
      return;
    }

    const firstExtraFeedback = extra
      .map((item) => data.feedbackByConnection?.[connectionKey(item.actorId, item.useCaseId)])
      .find((item) => item && typeof item === "object");

    onResult({
      tone: "error",
      title: "Red connection line",
      message: "Run stopped at incorrect or missing association.",
      simulation: firstExtraFeedback?.simulation || "The scenario cannot run smoothly because the actor does not go to the correct use case.",
      visualEffect: firstExtraFeedback?.visualEffect,
      visualState: buildVisualState(firstExtraFeedback?.visualEffect || "wrongActor", {
        message: firstExtraFeedback?.simulation,
      }),
      details: [
        ...extra.map((item) => {
          const feedback = data.feedbackByConnection?.[connectionKey(item.actorId, item.useCaseId)];
          return typeof feedback === "object" ? feedback.feedback : feedback || `Extra: ${labelActor(data, item.actorId)} -> ${labelUseCase(data, item.useCaseId)}`;
        }),
        ...missing.map((item) => `Missing: ${labelActor(data, item.actorId)} -> ${labelUseCase(data, item.useCaseId)}`),
      ],
    });
  };

  return (
    <div className="interaction-stack">
      <div className="connect-canvas">
        <section className="node-column">
          <h3>Actors</h3>
          {data.actors.map((actor) => (
            <button
              className={`actor-node ${selectedActor === actor.id ? "selected" : ""}`}
              key={actor.id}
              onClick={() => setSelectedActor(actor.id)}
            >
              <span className="actor-kind">{actor.kind || "role"}</span>
              {actor.label}
            </button>
          ))}
        </section>
        <section className="connection-list">
          <h3>Connections</h3>
          {connections.length === 0 ? <p>Select an actor then click a use case to connect.</p> : connections.map((item) => (
            <div className="connection-pill" key={connectionKey(item.actorId, item.useCaseId)}>
              {labelActor(data, item.actorId)} {"->"} {labelUseCase(data, item.useCaseId)}
            </div>
          ))}
        </section>
        <section className="node-column">
          <h3>Use Cases</h3>
          {data.useCases.map((useCase) => (
            <button className="usecase-node" key={useCase.id} onClick={() => toggleConnection(useCase.id)}>
              {useCase.label}
            </button>
          ))}
        </section>
      </div>
      <button className="run-button" onClick={run}>Run</button>
    </div>
  );
}

function labelActor(data, id) {
  return data.actors.find((actor) => actor.id === id)?.label || id;
}

function labelUseCase(data, id) {
  return data.useCases.find((useCase) => useCase.id === id)?.label || id;
}
