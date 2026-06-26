import React, { useState } from "react";
import { connectionKey } from "./interactionUtils";

export default function BuildUseCaseName({ step, onResult }) {
  const { data } = step;
  const [verbId, setVerbId] = useState(null);
  const [nounId, setNounId] = useState(null);
  const [accepted, setAccepted] = useState([]);

  const addPair = () => {
    if (!verbId || !nounId) return;
    const key = connectionKey(verbId, nounId);
    setAccepted((current) => current.includes(key) ? current : [...current, key]);
  };

  const run = () => {
    if (!verbId || !nounId) {
      onResult({ tone: "error", title: "Thiếu mảnh ghép", message: "Chọn một động từ và một danh từ nghiệp vụ." });
      return;
    }

    const selectedKey = connectionKey(verbId, nounId);
    const validKeys = data.acceptedPairs.map((pair) => connectionKey(pair.actorId, pair.useCaseId));
    const validAccepted = accepted.filter((key) => validKeys.includes(key));
    const requiredCount = data.requiredCount || 1;
    const currentIsValid = validKeys.includes(selectedKey);
    const enough = data.requiredCount ? validAccepted.length >= requiredCount : currentIsValid;

    onResult({
      tone: enough ? "success" : "error",
      title: enough ? "Tên Use Case dùng được" : "Tên chưa ổn",
      message: data.feedbackByPair?.[selectedKey] || (currentIsValid ? `Đúng. Hãy tạo đủ ${requiredCount} tên tốt.` : "Cặp này còn dính UI, code, database hoặc quá rộng."),
      simulation: enough ? data.successSimulation : "Oval này khiến người đọc không biết actor muốn đạt mục tiêu nghiệp vụ nào.",
      details: data.requiredCount ? [`Đã tạo ${validAccepted.length}/${requiredCount} tên tốt.`] : [buildLabel(data, verbId, nounId)],
    });
  };

  return (
    <div className="interaction-stack">
      <div className="name-builder">
        <section>
          <h3>Động từ</h3>
          {data.verbs.map((verb) => (
            <button className={`choice-block ${verbId === verb.id ? "selected" : ""}`} key={verb.id} onClick={() => setVerbId(verb.id)}>
              {verb.label}
            </button>
          ))}
        </section>
        <div className="name-preview">
          <span>{verbId ? data.verbs.find((item) => item.id === verbId)?.label : "____"}</span>
          <strong>+</strong>
          <span>{nounId ? data.nouns.find((item) => item.id === nounId)?.label : "____"}</span>
          {data.requiredCount && <button className="small-button" onClick={addPair}>Add name</button>}
        </div>
        <section>
          <h3>Danh từ nghiệp vụ</h3>
          {data.nouns.map((noun) => (
            <button className={`choice-block ${nounId === noun.id ? "selected" : ""}`} key={noun.id} onClick={() => setNounId(noun.id)}>
              {noun.label}
            </button>
          ))}
        </section>
      </div>
      {accepted.length > 0 && (
        <div className="built-list">
          {accepted.map((key) => {
            const [verb, noun] = key.split("->");
            return <span key={key}>{buildLabel(data, verb, noun)}</span>;
          })}
        </div>
      )}
      <button className="run-button" onClick={run}>Run</button>
    </div>
  );
}

function buildLabel(data, verbId, nounId) {
  return `${data.verbs.find((item) => item.id === verbId)?.label || verbId} ${data.nouns.find((item) => item.id === nounId)?.label || nounId}`;
}

