import React, { useMemo, useState } from "react";
import { buildVisualState, moveBlock } from "./interactionUtils";

export default function DragToBoundary({ step, onResult }) {
  const { data } = step;
  const initial = useMemo(
    () => ({ ...Object.fromEntries(data.blocks.map((block) => [block.id, "tray"])), ...(data.initialPlacements || {}) }),
    [data.blocks, data.initialPlacements],
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
        title: "Reasonable Boundary",
        message: "Actor, Use Case, and technical details are placed correctly.",
        simulation: data.successSimulation,
        visualEffect: data.successVisualEffect,
        visualState: buildVisualState(data.successVisualEffect || "successPath", {
          message: data.successSimulation,
        }),
        details: data.scenario ? [`Scenario: ${data.scenario.join(" -> ")}`] : [],
      });
      return;
    }

    const firstMistakeWithScene = mistakes.find((block) => block.simulation || block.visualEffect);

    onResult({
      tone: "error",
      title: "Boundary has wrong scope",
      message: "Some elements make the system misunderstand its responsibilities.",
      simulation: firstMistakeWithScene?.simulation || "Run stopped before scenario execution because the boundary is not clean.",
      visualEffect: firstMistakeWithScene?.visualEffect,
      visualState: buildVisualState(firstMistakeWithScene?.visualEffect, {
        block: firstMistakeWithScene,
        message: firstMistakeWithScene?.simulation,
      }),
      details: mistakes.map((block) => `${block.label}: ${block.feedback || block.penalty || `should belong to "${data.zones.find((zone) => zone.id === block.correctZoneId)?.label}"`}`),
    });
  };

  const renderBlock = (block) => (
    <button
      draggable
      className="choice-block boundary-block"
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
      <div className="block-tray" onDragOver={(event) => event.preventDefault()} onDrop={(event) => onDrop(event, "tray")}>
        {data.blocks.filter((block) => placements[block.id] === "tray").map(renderBlock)}
      </div>
      <div className="boundary-layout">
        {data.zones.map((zone) => (
          <section
            className={`drop-zone ${zone.id === "inside" ? "system-boundary" : ""}`}
            key={zone.id}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => onDrop(event, zone.id)}
          >
            <h3>{zone.id === "inside" ? data.boundaryLabel : zone.label}</h3>
            <small>{zone.id === "inside" ? zone.label : ""}</small>
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
