import React, { useMemo, useState } from "react";
import { buildVisualState, moveBlock } from "./interactionUtils";

export default function SortBlocks({ step, onResult }) {
  const { data } = step;
  const initial = useMemo(
    () => Object.fromEntries(data.blocks.map((block) => [block.id, "tray"])),
    [data.blocks],
  );
  const [placements, setPlacements] = useState(initial);

  const place = (blockId, zoneId) => setPlacements((current) => moveBlock(current, blockId, zoneId));
  const onDrop = (event, zoneId) => {
    const blockId = event.dataTransfer.getData("text/plain");
    if (blockId) place(blockId, zoneId);
  };

  const run = () => {
    const mistakes = data.blocks.filter((block) => placements[block.id] !== block.correctZoneId);
    if (mistakes.length === 0) {
      onResult({
        tone: "success",
        title: "Correct Classification",
        message: "The blocks are in the correct zones.",
        simulation: data.successSimulation,
        visualEffect: data.successVisualEffect,
        visualState: buildVisualState(data.successVisualEffect || "successPath", {
          message: data.successSimulation,
        }),
        details: data.successDetails || data.blocks
          .filter((block) => block.successFeedback)
          .map((block) => `${block.label}: ${block.successFeedback}`),
      });
      return;
    }

    const firstMistakeWithScene = mistakes.find((block) => block.simulation || block.visualEffect);

    onResult({
      tone: "mixed",
      title: "Some blocks are misplaced",
      message: "The system stopped at incorrect blocks.",
      simulation: firstMistakeWithScene?.simulation || data.mixedSimulation || "Some blocks are making the diagram misinterpret responsibilities or goals.",
      visualEffect: firstMistakeWithScene?.visualEffect || data.mixedVisualEffect,
      visualState: buildVisualState(firstMistakeWithScene?.visualEffect || data.mixedVisualEffect, {
        block: firstMistakeWithScene,
        message: firstMistakeWithScene?.simulation || data.mixedSimulation,
      }),
      details: mistakes.map((block) => `${block.label}: ${block.feedback || `should be in "${data.zones.find((zone) => zone.id === block.correctZoneId)?.label}"`}`),
    });
  };

  const renderBlock = (block) => (
    <button
      draggable
      className={`choice-block ${placements[block.id] !== "tray" ? "placed" : ""}`}
      key={block.id}
      onDragStart={(event) => event.dataTransfer.setData("text/plain", block.id)}
      onClick={() => {
        const currentIndex = data.zones.findIndex((zone) => zone.id === placements[block.id]);
        const nextZone = data.zones[(currentIndex + 1 + data.zones.length) % data.zones.length];
        place(block.id, nextZone.id);
      }}
    >
      {block.label}
    </button>
  );

  return (
    <div className="interaction-stack">
      <div
        className="block-tray"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => onDrop(event, "tray")}
      >
        {data.blocks.filter((block) => placements[block.id] === "tray").map(renderBlock)}
      </div>
      <div className="zone-grid">
        {data.zones.map((zone) => (
          <section
            className="drop-zone"
            key={zone.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => onDrop(event, zone.id)}
          >
            <h3>{zone.label}</h3>
            <div className="zone-items">
              {data.blocks.filter((block) => placements[block.id] === zone.id).map(renderBlock)}
            </div>
          </section>
        ))}
      </div>
      <button className="run-button" onClick={run}>Run</button>
    </div>
  );
}
