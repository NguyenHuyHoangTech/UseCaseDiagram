import React, { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Circle, Link2, Play, UserRound, XCircle } from "lucide-react";
import { buildVisualState } from "./interactionUtils";

const statusIcon = {
  pending: Circle,
  passed: CheckCircle2,
  missing: XCircle,
  failed: XCircle,
};

export default function UseCaseRunSimulation({ step, onResult }) {
  const { data } = step;
  const [selectedUseCases, setSelectedUseCases] = useState([]);
  const [selectedTechnicalBlocks, setSelectedTechnicalBlocks] = useState([]);
  const [actorConnected, setActorConnected] = useState(false);
  const [runState, setRunState] = useState(() => evaluateUseCaseRun([], [], false, data));
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    const idle = evaluateUseCaseRun([], [], false, data);
    onResult(resultFromEvaluation(idle, data));
  }, [data, onResult]);

  const selectedLabels = useMemo(
    () => selectedUseCases.map((id) => data.useCases.find((item) => item.id === id)?.label).filter(Boolean),
    [data.useCases, selectedUseCases],
  );

  const toggle = (id, setter) => {
    setter((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  const run = () => {
    const next = evaluateUseCaseRun(selectedUseCases, selectedTechnicalBlocks, actorConnected, data);
    setRunState(next);
    onResult(resultFromEvaluation(next, data));
  };

  return (
    <div className="run-sim-shell">
      <section className="run-sim-left">
        <div>
          <span className="lesson-kicker">Goal</span>
          <h3>An books movie tickets online</h3>
          <p>{data.goalText}</p>
        </div>

        <div className="run-sim-picker">
          <h4>Required Use Cases</h4>
          {data.useCases.map((useCase) => (
            <button
              className={`choice-block ${selectedUseCases.includes(useCase.id) ? "selected" : ""}`}
              key={useCase.id}
              onClick={() => toggle(useCase.id, setSelectedUseCases)}
            >
              {useCase.label}
            </button>
          ))}
        </div>

        <div className="run-sim-picker technical">
          <h4>Behind the scenes</h4>
          {data.distractors.map((block) => (
            <button
              className={`choice-block danger-choice ${selectedTechnicalBlocks.includes(block.id) ? "selected" : ""}`}
              key={block.id}
              onClick={() => toggle(block.id, setSelectedTechnicalBlocks)}
            >
              {block.label}
            </button>
          ))}
        </div>
      </section>

      <section className="run-diagram-canvas">
        <div className="run-diagram-toolbar">
          <div>
            <span className="lesson-kicker">Cinema Booking System</span>
            <h3>Run Diagram Simulation</h3>
          </div>
          <button className={`actor-link-button ${actorConnected ? "selected" : ""}`} onClick={() => setActorConnected((value) => !value)}>
            <Link2 size={16} />
            {actorConnected ? "Actor Connected" : "Connect Actor"}
          </button>
        </div>

        <div className="usecase-diagram-stage">
          <div className={`diagram-actor ${actorConnected ? "connected" : ""}`}>
            <UserRound size={26} />
            <strong>Customer</strong>
            <span className={`an-token ${runState.status}`}>An</span>
          </div>

          <div className="diagram-boundary-large">
            <h4>Cinema Booking System</h4>
            <div className="diagram-oval-grid">
              {data.journeySteps.map((stepItem) => {
                const selected = selectedUseCases.includes(stepItem.id);
                const stepStatus = runState.steps.find((item) => item.id === stepItem.id)?.status || "pending";
                return (
                  <div className={`diagram-oval ${selected ? "selected" : ""} ${stepStatus}`} key={stepItem.id}>
                    <span>{stepItem.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="run-path">
          {runState.steps.map((stepItem) => {
            const Icon = statusIcon[stepItem.status] || Circle;
            return (
              <div className={`run-path-step ${stepItem.status}`} key={stepItem.id}>
                <Icon size={16} />
                <span>{stepItem.label}</span>
              </div>
            );
          })}
        </div>

        {selectedLabels.length > 0 && (
          <div className="selected-usecase-line">
            Selected: <strong>{selectedLabels.join(" -> ")}</strong>
          </div>
        )}

        <button className="run-button" onClick={run}>
          <Play size={18} />
          Run Diagram
        </button>
      </section>
    </div>
  );
}

function evaluateUseCaseRun(selectedUseCases, selectedTechnicalBlocks, actorConnected, data) {
  const selected = new Set(selectedUseCases);
  const technical = selectedTechnicalBlocks[0] ? data.distractors.find((item) => item.id === selectedTechnicalBlocks[0]) : null;
  const hasAnyCorrect = data.journeySteps.some((step) => selected.has(step.id));

  if (technical && !hasAnyCorrect) {
    return buildEvaluation("failed", data, {
      failedAt: technical.id,
      technical,
      feedbackTitle: "Test failed",
      feedbackBody: "❌ Diagram is describing how the internal system works, not the actor's goal.",
      suggestion: "A Use Case Diagram should answer: What does the actor want to achieve?, not How does the code run?",
      technicalOnly: true,
    });
  }

  if (technical) {
    return buildEvaluation("failed", data, {
      failedAt: technical.id,
      technical,
      feedbackTitle: "Test failed",
      feedbackBody: `❌ An is stuck here. ${technical.feedback}`,
      suggestion: technical.suggestion || "In Use Case Diagram, use user goal names instead of implementation details.",
    });
  }

  if (!actorConnected) {
    return buildEvaluation("failed", data, {
      failedAt: "bookTicket",
      feedbackTitle: "Test failed",
      feedbackBody: "❌ An does not have a path from Customer Actor to the main goal.",
      suggestion: "Please connect the Customer Actor to the main goal Book movie tickets and run again.",
    });
  }

  const firstMissing = data.journeySteps.find((step) => !selected.has(step.id));
  if (firstMissing) {
    const missingRule = data.missingFeedback?.[firstMissing.id];
    return buildEvaluation("failed", data, {
      failedAt: firstMissing.id,
      feedbackTitle: "Test failed",
      feedbackBody: missingRule?.feedbackBody || `❌ The journey is missing Use Case ${firstMissing.label}.`,
      suggestion: missingRule?.suggestion || "A good Use Case must represent a valuable result to the actor.",
    });
  }

  return buildEvaluation("passed", data, {
    feedbackTitle: "Test passed",
    feedbackBody: "✅ An received the tickets!",
    suggestion: "Your diagram focuses on user goals: view schedule, book tickets, select seats, pay, and receive tickets. Operations like querying database, calling API, or inserting record should not appear in Use Case Diagram because they are implementation details.",
  });
}

function buildEvaluation(status, data, options = {}) {
  const failedAt = options.failedAt;
  let hasFailed = false;
  const steps = options.technical
    ? [
      ...data.journeySteps.map((step) => ({ ...step, status: "pending" })),
      { id: options.technical.id, label: options.technical.label, icon: "Tech", status: "failed" },
    ]
    : data.journeySteps.map((step) => {
    if (status === "idle") return { ...step, status: "pending" };
    if (status === "passed") return { ...step, status: "passed" };
    if (hasFailed) return { ...step, status: "pending" };
    if (step.id === failedAt) {
      hasFailed = true;
      return { ...step, status: options.technical ? "failed" : "missing" };
    }
    return { ...step, status: "passed" };
  });

  return {
    status,
    failedAt,
    reason: options.feedbackBody,
    technical: options.technical,
    technicalOnly: options.technicalOnly,
    steps,
    feedbackTitle: options.feedbackTitle || "Status: Not run",
    feedbackBody: options.feedbackBody || "Test goal: An wants to book movie tickets and receive the tickets.",
    suggestion: options.suggestion || "Pass condition: select correct Use Cases, do not select technical blocks, have the final goal Receive tickets.",
  };
}

function resultFromEvaluation(evaluation, data) {
  const isPassed = evaluation.status === "passed";
  const isIdle = evaluation.status === "idle";
  const failedStep = evaluation.steps.find((step) => step.status === "missing" || step.status === "failed");
  const checkpoints = evaluation.steps.map((step) => ({
    id: step.id,
    label: step.label,
    icon: step.icon,
    status: step.status === "passed" ? "success" : step.status === "pending" ? "idle" : "error",
  }));

  return {
    tone: isIdle ? "idle" : isPassed ? "success" : "error",
    title: evaluation.feedbackTitle,
    message: evaluation.feedbackBody,
    simulation: evaluation.suggestion,
    visualEffect: isIdle ? undefined : isPassed ? "ticketSuccess" : evaluation.technical ? evaluation.technical.visualEffect || "backendRoom" : "stopAtNode",
    visualState: buildVisualState(isIdle ? "idle" : isPassed ? "ticketSuccess" : evaluation.technical ? evaluation.technical.visualEffect || "backendRoom" : "stopAtNode", {
      title: isIdle ? "Status: Not run" : evaluation.feedbackTitle,
      message: evaluation.feedbackBody,
      selectedBlock: evaluation.technical?.label || failedStep?.label,
      checkpoints,
    }),
    details: isIdle
      ? [data.idleGoal, data.passCondition]
      : [evaluation.suggestion],
  };
}
