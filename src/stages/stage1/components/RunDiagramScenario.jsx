import React, { useState } from "react";
import { buildVisualState, connectionKey, defaultCinemaCheckpoints, extraConnections, missingConnections } from "./interactionUtils";
import UseCaseRunSimulation from "./UseCaseRunSimulation";

export default function RunDiagramScenario({ step, onResult }) {
  const { data } = step;
  if (data.mode === "useCaseRunSimulation") {
    return <UseCaseRunSimulation step={step} onResult={onResult} />;
  }

  return <LegacyRunDiagramScenario step={step} onResult={onResult} />;
}

function LegacyRunDiagramScenario({ step, onResult }) {
  const { data } = step;
  const [actors, setActors] = useState([]);
  const [useCases, setUseCases] = useState([]);
  const [selectedActor, setSelectedActor] = useState(null);
  const [connections, setConnections] = useState([]);
  const [badItems, setBadItems] = useState([]);

  const toggle = (value, setter) => setter((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);

  const toggleConnection = (useCaseId) => {
    if (!selectedActor) return;
    const next = { actorId: selectedActor, useCaseId };
    setConnections((current) => {
      const exists = current.some((item) => item.actorId === next.actorId && item.useCaseId === next.useCaseId);
      return exists ? current.filter((item) => connectionKey(item.actorId, item.useCaseId) !== connectionKey(next.actorId, next.useCaseId)) : [...current, next];
    });
  };

  const toggleUseCase = (useCaseId) => {
    if (selectedActor && actors.includes(selectedActor)) {
      setUseCases((current) => current.includes(useCaseId) ? current : [...current, useCaseId]);
      toggleConnection(useCaseId);
      return;
    }

    toggle(useCaseId, setUseCases);
  };

  const run = () => {
    if (badItems.length > 0) {
      const firstBadItem = data.distractors?.find((item) => badItems.includes(item.id));
      onResult({
        tone: "error",
        title: "Diagram contains technical details",
        message: firstBadItem?.feedback || "Database, controller or UI detail do not belong to Use Case Diagram.",
        simulation: firstBadItem?.simulation || "Check stopped at diagram building step.",
        visualEffect: firstBadItem?.visualEffect,
        visualState: buildVisualState(firstBadItem?.visualEffect, {
          block: firstBadItem,
          message: firstBadItem?.simulation,
        }),
        details: badItems.map((id) => data.distractors?.find((item) => item.id === id)?.label || id),
      });
      return;
    }

    for (const scenario of data.scenarios) {
      const missingActors = scenario.requiredActors.filter((id) => !actors.includes(id));
      const missingUseCases = scenario.requiredUseCases.filter((id) => !useCases.includes(id));
      const missing = missingConnections(connections, scenario.requiredConnections);
      if (missingActors.length || missingUseCases.length || missing.length) {
        onResult({
          tone: "error",
          title: `Scenario stopped: ${scenario.title}`,
          message: typeof scenario.feedback === "object" ? scenario.feedback.feedback : scenario.feedback,
          simulation: typeof scenario.feedback === "object" ? scenario.feedback.simulation : `Expected path: ${scenario.path.join(" -> ")}`,
          visualEffect: typeof scenario.feedback === "object" ? scenario.feedback.visualEffect : undefined,
          visualState: buildVisualState(typeof scenario.feedback === "object" ? scenario.feedback.visualEffect : "stopAtNode", {
            message: typeof scenario.feedback === "object" ? scenario.feedback.simulation : scenario.feedback,
            checkpoints: checkpointStateForScenario(scenario, missingActors, missingUseCases, missing),
          }),
          details: [
            ...missingActors.map((id) => `Missing Actor: ${labelActor(data, id)}`),
            ...missingUseCases.map((id) => `Missing Use Case: ${labelUseCase(data, id)}`),
            ...missing.map((item) => `Missing connection: ${labelActor(data, item.actorId)} -> ${labelUseCase(data, item.useCaseId)}`),
          ].slice(0, 3),
        });
        return;
      }
    }

    const extra = extraConnections(connections, data.correctConnections);
    if (extra.length > 0) {
      onResult({
        tone: "mixed",
        title: "Suspicious connection present",
        message: "Main scenarios run fine, but the diagram has extra associations.",
        simulation: "Extra connections might mislead readers about permissions or triggers.",
        visualState: buildVisualState("wrongActor", {
          message: "An extra connection is pulling the Actor to an inappropriate goal.",
        }),
        details: extra.slice(0, 3).map((item) => `${labelActor(data, item.actorId)} -> ${labelUseCase(data, item.useCaseId)}`),
      });
      return;
    }

    onResult({
      tone: "success",
      title: "Diagram verification successful",
      message: "Boundary, actor, use case and connection are sufficient to verify scenarios.",
      simulation: data.successSimulation,
      visualEffect: data.successVisualEffect,
      visualState: buildVisualState(data.successVisualEffect || "ticketSuccess", {
        message: data.successSimulation,
      }),
      details: data.scenarios.map((scenario) => scenario.path.join(" -> ")),
    });
  };

  return (
    <div className="interaction-stack">
      <div className="diagram-builder">
        <section className="palette-panel">
          <h3>Actors outside boundary</h3>
          {data.actors.map((actor) => (
            <button className={`choice-block ${actors.includes(actor.id) ? "selected" : ""}`} key={actor.id} onClick={() => toggle(actor.id, setActors)}>
              {actor.label}
            </button>
          ))}
          {Boolean(data.distractors?.length) && (
            <>
              <h3>Should not include</h3>
              {data.distractors.map((item) => (
                <button className={`choice-block danger-choice ${badItems.includes(item.id) ? "selected" : ""}`} key={item.id} onClick={() => toggle(item.id, setBadItems)}>
                  {item.label}
                </button>
              ))}
            </>
          )}
        </section>
        <section className="diagram-boundary">
          <h3>{data.systemLabel}</h3>
          <div className="usecase-grid">
            {data.useCases.map((useCase) => (
              <button className={`usecase-node ${useCases.includes(useCase.id) ? "selected" : ""}`} key={useCase.id} onClick={() => toggleUseCase(useCase.id)}>
                {useCase.label}
              </button>
            ))}
          </div>
        </section>
        <section className="palette-panel">
          <h3>Connect Actor</h3>
          {data.actors.filter((actor) => actors.includes(actor.id)).map((actor) => (
            <button className={`actor-node ${selectedActor === actor.id ? "selected" : ""}`} key={actor.id} onClick={() => setSelectedActor(current => current === actor.id ? null : actor.id)}>
              {actor.label}
            </button>
          ))}
          <p className="hint-text">Select an actor, then click a selected use case to connect or disconnect.</p>
          {connections.map((item) => (
            <div className="connection-pill" key={connectionKey(item.actorId, item.useCaseId)}>
              {labelActor(data, item.actorId)} {"->"} {labelUseCase(data, item.useCaseId)}
            </div>
          ))}
        </section>
      </div>
      <button className="run-button" onClick={run}>Check Diagram</button>
    </div>
  );
}

function labelActor(data, id) {
  return data.actors.find((actor) => actor.id === id)?.label || id;
}

function labelUseCase(data, id) {
  return data.useCases.find((useCase) => useCase.id === id)?.label || id;
}

function checkpointStateForScenario(scenario, missingActors, missingUseCases, missingConnectionsList) {
  const missingLabels = new Set([
    ...missingUseCases,
    ...missingConnectionsList.map((item) => item.useCaseId),
  ]);

  let stopped = false;
  return defaultCinemaCheckpoints.map((checkpoint, index) => {
    const useCaseId = scenario.requiredUseCases[index];
    const isMissing = missingLabels.has(useCaseId) || (index === 0 && missingActors.length > 0);

    if (stopped) return { ...checkpoint, status: "idle" };
    if (isMissing) {
      stopped = true;
      return { ...checkpoint, status: "error" };
    }

    return { ...checkpoint, status: "success" };
  });
}
