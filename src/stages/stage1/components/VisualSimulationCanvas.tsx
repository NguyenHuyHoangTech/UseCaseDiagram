import React from "react";
import { AlertTriangle, CheckCircle2, Database, Server, Ticket, UserRound, XCircle } from "lucide-react";

const statusIcon = {
  success: CheckCircle2,
  error: XCircle,
  warning: AlertTriangle,
  idle: UserRound,
};

const copyByEffect = {
  idle: {
    title: "Hành trình của Actor",
    message: "Chọn block rồi bấm Run để thấy hệ thống phản ứng trên canvas.",
  },
  successPath: {
    title: "Actor đi trọn hành trình",
    message: "Actor đã hoàn thành hành trình đặt vé và nhận được vé điện tử.",
  },
  ticketSuccess: {
    title: "Vé điện tử đã xuất hiện",
    message: "Khách hàng nhận được vé điện tử. Đây là giá trị cuối cùng mà Actor quan tâm.",
  },
  stopAtNode: {
    title: "Actor bị kẹt giữa đường",
    message: "Hành trình dừng lại vì block được chọn chưa đưa Actor tới mục tiêu đủ rõ.",
  },
  backendRoom: {
    title: "Actor bị kéo vào phòng kỹ thuật",
    message: "Actor không cần quan tâm chi tiết kỹ thuật này. Actor chỉ muốn hoàn thành mục tiêu đặt vé.",
  },
  databaseRoom: {
    title: "Actor đứng trước database",
    message: "Database giúp hệ thống vận hành, nhưng không phải điều Actor muốn đạt được.",
  },
  outdatedTechnology: {
    title: "Tên Use Case bị gắn với công nghệ",
    message: "Khi công nghệ thay đổi, block này nhanh chóng lỗi thời.",
  },
  uiChanged: {
    title: "UI thay đổi",
    message: "Nếu tên Use Case phụ thuộc vào nút hoặc màn hình, nó sẽ lỗi thời khi giao diện đổi.",
  },
  flowchartWarning: {
    title: "Sơ đồ đang phình thành flowchart",
    message: "Use Case Diagram nên mô tả mục tiêu, không mô tả từng click hoặc từng xử lý nhỏ.",
  },
  lockedSeat: {
    title: "Ghế bị khóa tạm thời",
    message: "Đây là cơ chế hỗ trợ. An chưa đạt mục tiêu chỉ vì ghế bị khóa tạm thời.",
  },
  wrongActor: {
    title: "Sai góc nhìn Actor",
    message: "Association này làm Actor đi tới mục tiêu không thuộc vai trò của họ.",
  },
};

export default function VisualSimulationCanvas({ state }) {
  const effect = state?.effect || "idle";
  const copy = copyByEffect[effect] || copyByEffect.idle;
  const title = state?.title || copy.title;
  const message = state?.message || copy.message;

  return (
    <section className={`visual-sim visual-sim-${effect}`} aria-live="polite">
      <div className="visual-sim-header">
        <div>
          <span className="lesson-kicker">Visual Simulation</span>
          <h3>{title}</h3>
        </div>
        <div className="visual-actor">
          <span>Actor</span>
          <UserRound size={22} />
        </div>
      </div>

      {state?.selectedBlock && (
        <div className="visual-selected-block">
          Block đang chạy thử: <strong>{state.selectedBlock}</strong>
        </div>
      )}

      {renderScene(effect, state)}

      <p className="visual-message">{message}</p>
    </section>
  );
}

function renderScene(effect, state) {
  if (effect === "backendRoom" || effect === "databaseRoom") {
    return (
      <div className="backend-room">
        <div className="server-rack">
          <Server size={32} />
          <span>API</span>
          <code>POST /tickets</code>
        </div>
        <div className="server-rack database">
          <Database size={32} />
          <span>Database</span>
          <code>SELECT * FROM Movie</code>
        </div>
        <div className="actor-card confused">Actor ?</div>
      </div>
    );
  }

  if (effect === "outdatedTechnology" || effect === "uiChanged") {
    return (
      <div className="visual-timeline">
        {(state?.timeline || []).map((item) => {
          const Icon = statusIcon[item.status] || statusIcon.idle;
          return (
            <div className={`timeline-step ${item.status}`} key={item.label}>
              <Icon size={18} />
              <span>{item.label}</span>
            </div>
          );
        })}
        <div className="broken-block">{state?.selectedBlock || "Block cụ thể"} bị lỗi thời</div>
      </div>
    );
  }

  if (effect === "lockedSeat") {
    return (
      <div className="seat-lock-scene">
        <div className="seat-grid">
          {Array.from({ length: 9 }).map((_, index) => (
            <span className={index === 4 ? "seat locked" : "seat"} key={index}>Ghế</span>
          ))}
        </div>
        <div className="seat-timer">05:00</div>
      </div>
    );
  }

  if (effect === "ticketSuccess") {
    return (
      <div className="ticket-scene">
        <div className="ticket-card">
          <Ticket size={34} />
          <strong>Cinema Ticket</strong>
          <span>Phim • Suất chiếu • Ghế</span>
          <code>QR-TICKET-2026</code>
        </div>
      </div>
    );
  }

  return <CheckpointPath checkpoints={state?.checkpoints || []} compact={effect === "flowchartWarning"} />;
}

function CheckpointPath({ checkpoints, compact }) {
  return (
    <div className={`checkpoint-path ${compact ? "compact" : ""}`}>
      {checkpoints.map((checkpoint, index) => {
        const Icon = statusIcon[checkpoint.status] || statusIcon.idle;
        return (
          <React.Fragment key={checkpoint.id}>
            <div className={`checkpoint ${checkpoint.status}`}>
              <span className="checkpoint-icon">{checkpoint.icon}</span>
              <Icon size={16} />
              <strong>{checkpoint.label}</strong>
            </div>
            {index < checkpoints.length - 1 && <span className="checkpoint-line" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
