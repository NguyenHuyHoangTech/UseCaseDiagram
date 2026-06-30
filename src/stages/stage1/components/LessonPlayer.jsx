import React, { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, RotateCcw } from "lucide-react";
import FeedbackPanel from "./FeedbackPanel";
import SelectBlockAndRun from "./SelectBlockAndRun";
import SortBlocks from "./SortBlocks";
import DragToBoundary from "./DragToBoundary";
import ConnectActorToUseCase from "./ConnectActorToUseCase";
import BuildUseCaseName from "./BuildUseCaseName";
import RunDiagramScenario from "./RunDiagramScenario";
import InsightStep from "./InsightStep";
import VisualSimulationCanvas from "./VisualSimulationCanvas";
import { buildVisualState, idleResult } from "./interactionUtils";
import "./lesson.css";

const componentByType = {
  SELECT_BLOCK_AND_RUN: SelectBlockAndRun,
  SORT_BLOCKS: SortBlocks,
  DRAG_TO_BOUNDARY: DragToBoundary,
  CONNECT_ACTOR_TO_USECASE: ConnectActorToUseCase,
  BUILD_USECASE_NAME: BuildUseCaseName,
  RUN_DIAGRAM_SCENARIO: RunDiagramScenario,
  INSIGHT: InsightStep,
};

export default function LessonPlayer({ lesson, onBack, onNextLesson, hasNextLesson }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState(idleResult);
  const [visualState, setVisualState] = useState(buildVisualState("idle"));
  const [completedSteps, setCompletedSteps] = useState([]);
  const step = lesson.steps[stepIndex];
  const Interaction = componentByType[step.type];

  const progress = useMemo(() => Math.round(((stepIndex + 1) / lesson.steps.length) * 100), [lesson.steps.length, stepIndex]);

  const updateResult = (nextResult) => {
    setResult(nextResult);
    if (lesson.id === "what-not-how") {
      setVisualState(nextResult.visualState || buildVisualState(nextResult.visualEffect, {
        message: nextResult.simulation,
      }));
    }
    if (nextResult.tone === "success") {
      setCompletedSteps((current) => current.includes(step.id) ? current : [...current, step.id]);
    }
  };

  const goStep = (nextIndex) => {
    setStepIndex(nextIndex);
    setResult(idleResult);
    setVisualState(buildVisualState("idle"));
  };

  const isLastStep = stepIndex === lesson.steps.length - 1;
  const lessonDone = completedSteps.length === lesson.steps.length;

  return (
    <main className="lesson-page-shell">
      <section className="lesson-topbar">
        <button className="icon-text-button" onClick={onBack}>
          <ArrowLeft size={18} />
          Hành trình
        </button>
        <div className="lesson-progress">
          <span>{progress}%</span>
          <div><i style={{ width: `${progress}%` }} /></div>
        </div>
      </section>

      <section className="lesson-header">
        <div>
          <span className="lesson-kicker">Interactive Lesson</span>
          <h1>{lesson.title}</h1>
          <p>{lesson.description}</p>
        </div>
        <div className="step-counter">
          <BookOpen size={18} />
          Step {stepIndex + 1}/{lesson.steps.length}
        </div>
      </section>

      <section className="lesson-workspace">
        <aside className="scenario-panel">
          <span className="lesson-kicker">{step.type.replaceAll("_", " ")}</span>
          <h2>{step.title}</h2>
          {step.story && <p>{step.story}</p>}
          {step.instruction && <div className="instruction-box">{step.instruction}</div>}
          <div className="step-list">
            {lesson.steps.map((item, index) => (
              <button
                className={`${index === stepIndex ? "active" : ""} ${completedSteps.includes(item.id) ? "done" : ""}`}
                key={item.id}
                onClick={() => goStep(index)}
              >
                <span>{index + 1}</span>
                {item.title}
              </button>
            ))}
          </div>
        </aside>

        <section className="canvas-panel">
          {lesson.id === "what-not-how" && step.data?.mode !== "useCaseRunSimulation" && <VisualSimulationCanvas state={visualState} />}
          <Interaction key={step.id} step={step} onResult={updateResult} />
        </section>

        <FeedbackPanel result={result} />
      </section>

      {lessonDone && (
        <section className="lesson-recap">
          <strong>Recap</strong>
          <span>{lesson.title} hoàn thành. Bạn đã chạy thử đủ các tình huống và tự rút ra quy tắc chính.</span>
        </section>
      )}

      <section className="lesson-actions">
        <button className="secondary-button" onClick={() => goStep(stepIndex)}>
          <RotateCcw size={18} />
          Reset step
        </button>
        <div>
          <button className="secondary-button" disabled={stepIndex === 0} onClick={() => goStep(stepIndex - 1)}>
            <ArrowLeft size={18} />
            Back
          </button>
          {isLastStep ? (
            <button className="run-button" onClick={onNextLesson} disabled={!hasNextLesson && !lessonDone}>
              {hasNextLesson ? "Next lesson" : "Finish course"}
              <ArrowRight size={18} />
            </button>
          ) : (
            <button className="run-button" onClick={() => goStep(stepIndex + 1)}>
              Next
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
