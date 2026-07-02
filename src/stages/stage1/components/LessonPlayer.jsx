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

const friendlyTypeNames = {
  SELECT_BLOCK_AND_RUN: "Select the Correct Block",
  SORT_BLOCKS: "Sort the Blocks",
  DRAG_TO_BOUNDARY: "Drag to Boundary",
  CONNECT_ACTOR_TO_USECASE: "Connect Actor",
  BUILD_USECASE_NAME: "Build Use Case Name",
  RUN_DIAGRAM_SCENARIO: "Verify Diagram",
  INSIGHT: "Insight",
};

export default function LessonPlayer({ lesson, onBack, onNextLesson, hasNextLesson }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [result, setResult] = useState(idleResult);
  const [visualState, setVisualState] = useState(buildVisualState("idle"));
  const [completedSteps, setCompletedSteps] = useState([]);
  const [resetKey, setResetKey] = useState(0);
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
    setResetKey((prev) => prev + 1);
  };

  const isLastStep = stepIndex === lesson.steps.length - 1;
  const lessonDone = completedSteps.length === lesson.steps.length;

  return (
    <main className="lesson-page-shell single-card-shell">
      <section className="lesson-topbar">
        <button className="icon-text-button" onClick={onBack}>
          <ArrowLeft size={18} />
          Journey
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

      {/* Single Centered Card Layout */}
      <div className="lesson-card-wrapper">
        <div className="lesson-card-body">
          <div className="lesson-card-step-header">
            <span className="lesson-kicker">{friendlyTypeNames[step.type] || step.type.replaceAll("_", " ")}</span>
            <span className="step-label">Step {stepIndex + 1} of {lesson.steps.length}</span>
          </div>

          <h2 className="step-card-title">{step.title}</h2>
          
          {step.story && <p className="step-story-text">{step.story}</p>}
          {step.instruction && <div className="instruction-box-clean">{step.instruction}</div>}

          {/* Interaction Component */}
          <div className="step-interaction-container">
            <Interaction key={`${step.id}-${resetKey}`} step={step} onResult={updateResult} />
          </div>

          {/* Inline Feedback Panel */}
          <div className="inline-feedback-container">
            <FeedbackPanel result={result} />
          </div>
        </div>

        {/* Step actions navigation */}
        <section className="lesson-actions-clean">
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
      </div>

      {lessonDone && (
        <section className="lesson-recap">
          <strong>Recap</strong>
          <span>{lesson.title} completed. You have run through all scenarios and derived the main rule yourself.</span>
        </section>
      )}
    </main>
  );
}
