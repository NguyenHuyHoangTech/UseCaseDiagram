import React from "react";
import { CheckCircle2, Info, Sparkles, XCircle } from "lucide-react";

const iconByTone = {
  idle: Info,
  success: CheckCircle2,
  error: XCircle,
  mixed: Info,
};

export default function FeedbackPanel({ result }) {
  const Icon = iconByTone[result?.tone || "idle"];
  const effectLabel = result?.visualEffect ? visualEffectLabels[result.visualEffect] || result.visualEffect : null;

  return (
    <aside className={`lesson-feedback ${result?.tone || "idle"}`}>
      <div className="feedback-title">
        <Icon size={20} />
        <span>{result?.title || "Feedback"}</span>
      </div>
      <p>{result?.message || "Thao tác trên canvas rồi bấm Run để xem hệ thống phản ứng."}</p>
      {result?.simulation && (
        <div className="simulation-box">
          <strong>Simulation</strong>
          {effectLabel && (
            <span className="visual-effect-chip">
              <Sparkles size={14} />
              {effectLabel}
            </span>
          )}
          <span>{result.simulation}</span>
        </div>
      )}
      {Boolean(result?.details?.length) && (
        <ul className="feedback-list">
          {result.details.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </aside>
  );
}

const visualEffectLabels = {
  shake: "Dừng tại node",
  bounceBack: "Dừng tại node",
  crack: "Công nghệ lỗi thời",
  stopAtNode: "An bị kẹt",
  flowchartWarning: "Sơ đồ phình thành flowchart",
  successPath: "Hành trình chạy trọn vẹn",
  ticketSuccess: "Nhận vé điện tử",
  backendRoom: "Bị kéo vào phòng backend",
  databaseRoom: "Bị kéo vào database",
  outdatedTechnology: "Công nghệ lỗi thời",
  uiChanged: "UI thay đổi",
  lockedSeat: "Ghế bị khóa",
  wrongActor: "Sai góc nhìn Actor",
  renameMachine: "Cần đổi tên Use Case",
};
