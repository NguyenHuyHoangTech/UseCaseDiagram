import React, { useState } from "react";
import { buildVisualState } from "./interactionUtils";

export default function SelectBlockAndRun({ step, onResult }) {
  const { data } = step;
  const [selectedId, setSelectedId] = useState(null);

  const run = () => {
    if (!selectedId) {
      onResult({ tone: "error", title: "Chưa chọn block", message: "Hãy đặt một tên vào oval rồi chạy thử." });
      return;
    }

    const item = data.blocks.find((block) => block.id === selectedId);
    const feedback = data.feedbackByBlock[selectedId];
    const isCorrect = selectedId === data.correctId;
    onResult({
      tone: isCorrect ? "success" : "error",
      title: isCorrect ? "Luồng chạy thành công" : "Luồng bị hỏng",
      message: feedback?.feedback || (isCorrect ? "Chọn đúng." : "Chưa đúng."),
      simulation: feedback?.simulation || data.successSimulation,
      visualEffect: feedback?.visualEffect,
      visualState: buildVisualState(feedback?.visualEffect || (isCorrect ? data.successVisualEffect : undefined), {
        block: item,
        message: feedback?.simulation || data.successSimulation,
        ...feedback?.visualPayload,
      }),
      details: item ? [`Bạn chọn: ${item.label}`] : [],
    });
  };

  return (
    <div className="interaction-stack">
      <div className="oval-target">
        <span>{selectedId ? data.blocks.find((block) => block.id === selectedId)?.label : data.targetLabel || "( ? )"}</span>
      </div>
      <div className="block-grid">
        {data.blocks.map((block) => (
          <button
            className={`choice-block ${selectedId === block.id ? "selected" : ""}`}
            key={block.id}
            onClick={() => setSelectedId(block.id)}
          >
            {block.label}
          </button>
        ))}
      </div>
      <button className="run-button" onClick={run}>Run</button>
    </div>
  );
}
