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
  title: "Sẵn sàng chạy thử",
  message: "Chọn hoặc kéo block, sau đó bấm Run.",
};

export const defaultCinemaCheckpoints = [
  { id: "movie", label: "Chọn phim", icon: "🎬", status: "idle" },
  { id: "showtime", label: "Chọn suất chiếu", icon: "🕒", status: "idle" },
  { id: "seat", label: "Chọn ghế", icon: "🪑", status: "idle" },
  { id: "payment", label: "Thanh toán vé", icon: "💳", status: "idle" },
  { id: "ticket", label: "Nhận vé", icon: "🎟️", status: "idle" },
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
      title: "Hành trình của Actor",
      message: "Chọn block rồi bấm Run để thấy hệ thống phản ứng trên canvas.",
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
      { id: "click", label: "Bấm nút", icon: "☝️", status: "warning" },
      { id: "query", label: "Kiểm tra", icon: "🔎", status: "warning" },
      { id: "lock", label: "Khóa tạm", icon: "⏱️", status: "warning" },
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
      { label: "Ví nội bộ", status: "error" },
    ];
  }

  if (effect === "uiChanged") {
    return [
      { label: "Nút bấm", status: "success" },
      { label: "Giọng nói", status: "error" },
      { label: "Gợi ý tự động", status: "error" },
    ];
  }

  return undefined;
}
