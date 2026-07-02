export const connectionKey = (actorId, useCaseId) => `${actorId}->${useCaseId}`;

export function sameConnection(left, right) {
  return left.actorId === right.actorId && left.useCaseId === right.useCaseId;
}

export function missingConnections(selected, required) {
  return required.filter((requiredConnection) => !selected.some((item) => sameConnection(item, requiredConnection)));
}

export function extraConnections(selected, required) {
  return selected.filter((item) => !required.some((requiredConnection) => sameConnection(item, requiredConnection)));
}

export function moveBlock(placements, blockId, zoneId) {
  return { ...placements, [blockId]: zoneId };
}

export const idleResult = {
  tone: "idle",
  title: "Ready to check",
  message: "Choose an answer, then press Check.",
};

export const defaultCinemaCheckpoints = [
  { id: "movie", label: "Select movie", icon: "🎬", status: "idle" },
  { id: "showtime", label: "Select showtime", icon: "🕒", status: "idle" },
  { id: "seat", label: "Select seat", icon: "🪑", status: "idle" },
  { id: "payment", label: "Pay ticket", icon: "💳", status: "idle" },
  { id: "ticket", label: "Receive ticket", icon: "🎟️", status: "idle" },
];

export function buildVisualState(effect, options = {}) {
  const normalizedEffect = normalizeVisualEffect(effect);
  const selectedBlock = options.selectedBlock || options.block?.label;

  const state = {
    effect: normalizedEffect,
    title: options.title,
    message: options.message,
    selectedBlock,
    currentNode: options.currentNode,
    checkpoints: options.checkpoints || checkpointsForEffect(normalizedEffect),
    timeline: options.timeline || timelineForEffect(normalizedEffect),
  };

  if (normalizedEffect === "idle") {
    return {
      ...state,
      title: "Actor's Journey",
      message: "Select a block and click Check to see the system response.",
    };
  }

  return state;
}

function normalizeVisualEffect(effect) {
  const aliases = {
    crack: "outdatedTechnology",
    renameMachine: "outdatedTechnology",
    bounceBack: "stopAtNode",
    shake: "stopAtNode",
  };

  return aliases[effect] || effect || "idle";
}

function checkpointsForEffect(effect) {
  if (effect === "successPath" || effect === "ticketSuccess") {
    return defaultCinemaCheckpoints.map((checkpoint) => ({ ...checkpoint, status: "success" }));
  }

  if (effect === "stopAtNode") {
    return defaultCinemaCheckpoints.map((checkpoint, index) => ({
      ...checkpoint,
      status: index < 2 ? "success" : index === 2 ? "error" : "idle",
    }));
  }

  if (effect === "flowchartWarning") {
    return [
      ...defaultCinemaCheckpoints.map((checkpoint) => ({ ...checkpoint, status: "warning" })),
      { id: "click", label: "Click button", icon: "☝️", status: "warning" },
      { id: "query", label: "Check", icon: "🔎", status: "warning" },
      { id: "lock", label: "Temp lock", icon: "⏱️", status: "warning" },
    ];
  }

  if (effect === "lockedSeat") {
    return defaultCinemaCheckpoints.map((checkpoint, index) => ({
      ...checkpoint,
      status: index < 2 ? "success" : checkpoint.id === "seat" ? "warning" : "idle",
    }));
  }

  return defaultCinemaCheckpoints;
}

function timelineForEffect(effect) {
  if (effect === "outdatedTechnology") {
    return [
      { label: "VNPay", status: "success" },
      { label: "Momo", status: "error" },
      { label: "Internal wallet", status: "error" },
    ];
  }

  if (effect === "uiChanged") {
    return [
      { label: "Button click", status: "success" },
      { label: "Voice control", status: "error" },
      { label: "Auto suggestion", status: "error" },
    ];
  }

  return undefined;
}
