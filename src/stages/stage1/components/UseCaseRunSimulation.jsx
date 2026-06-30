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
          <h3>An đặt vé online</h3>
          <p>{data.goalText}</p>
        </div>

        <div className="run-sim-picker">
          <h4>Use Case cần thiết</h4>
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
            {actorConnected ? "Đã nối Actor" : "Nối Actor"}
          </button>
        </div>

        <div className="usecase-diagram-stage">
          <div className={`diagram-actor ${actorConnected ? "connected" : ""}`}>
            <UserRound size={26} />
            <strong>Khách hàng</strong>
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
            Đang chọn: <strong>{selectedLabels.join(" -> ")}</strong>
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
      feedbackBody: "❌ Diagram đang mô tả cách hệ thống hoạt động bên trong, không mô tả mục tiêu của actor.",
      suggestion: "Use Case Diagram nên trả lời: Actor muốn đạt được điều gì?, không phải Code chạy như thế nào?",
      technicalOnly: true,
    });
  }

  if (technical) {
    return buildEvaluation("failed", data, {
      failedAt: technical.id,
      technical,
      feedbackTitle: "Test failed",
      feedbackBody: `❌ An bị kẹt ở đây. ${technical.feedback}`,
      suggestion: technical.suggestion || "Trong Use Case Diagram, hãy dùng tên mục tiêu người dùng thay cho chi tiết triển khai.",
    });
  }

  if (!actorConnected) {
    return buildEvaluation("failed", data, {
      failedAt: "bookTicket",
      feedbackTitle: "Test failed",
      feedbackBody: "❌ An chưa có đường đi từ Actor Khách hàng vào mục tiêu chính.",
      suggestion: "Hãy nối Actor Khách hàng với mục tiêu chính Đặt vé xem phim rồi chạy lại.",
    });
  }

  const firstMissing = data.journeySteps.find((step) => !selected.has(step.id));
  if (firstMissing) {
    const missingRule = data.missingFeedback?.[firstMissing.id];
    return buildEvaluation("failed", data, {
      failedAt: firstMissing.id,
      feedbackTitle: "Test failed",
      feedbackBody: missingRule?.feedbackBody || `❌ Hành trình còn thiếu Use Case ${firstMissing.label}.`,
      suggestion: missingRule?.suggestion || "Một Use Case tốt phải thể hiện kết quả có giá trị với actor.",
    });
  }

  return buildEvaluation("passed", data, {
    feedbackTitle: "Test passed",
    feedbackBody: "✅ An đã nhận được vé!",
    suggestion: "Diagram của bạn tập trung vào mục tiêu người dùng: xem lịch chiếu, đặt vé, chọn ghế, thanh toán và nhận vé. Các thao tác như query database, gọi API hay insert record không nên xuất hiện trong Use Case Diagram vì đó là chi tiết triển khai.",
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
    feedbackTitle: options.feedbackTitle || "Trạng thái: Chưa chạy",
    feedbackBody: options.feedbackBody || "Mục tiêu kiểm thử: An muốn đặt vé xem phim và nhận được vé.",
    suggestion: options.suggestion || "Điều kiện pass: chọn đúng Use Case, không chọn block kỹ thuật, có mục tiêu cuối cùng Nhận vé.",
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
      title: isIdle ? "Trạng thái: Chưa chạy" : evaluation.feedbackTitle,
      message: evaluation.feedbackBody,
      selectedBlock: evaluation.technical?.label || failedStep?.label,
      checkpoints,
    }),
    details: isIdle
      ? [data.idleGoal, data.passCondition]
      : [evaluation.suggestion],
  };
}
