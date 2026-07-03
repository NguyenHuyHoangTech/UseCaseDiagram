import React, { useState } from "react";

export default function InsightStep({ step, onResult }) {
  const { data } = step;
  const [values, setValues] = useState(data.answers.map(() => ""));

  const run = () => {
    const mistakes = data.answers
      .map((answer, index) => ({ answer, index, value: values[index].trim().toLowerCase() }))
      .filter((item) => item.value !== item.answer.toLowerCase());

    if (mistakes.length === 0) {
      onResult({
        tone: "success",
        title: "Insight đã khớp",
        message: data.mantra ? `${data.finalInsight} ${data.mantra}` : data.finalInsight,
        simulation: "Bạn vừa tự rút ra quy tắc, không cần đọc lý thuyết trước.",
        visualEffect: "successPath",
      });
      return;
    }

    onResult({
      tone: "error",
      title: "Câu chốt chưa đúng",
      message: "Điền lại các khoảng trống theo quy tắc vừa thử nghiệm.",
      simulation: "Nếu insight sai, các bước sau sẽ dễ nhầm goal với kỹ thuật.",
      details: mistakes.map((item) => `Ô ${item.index + 1} chưa khớp.`),
    });
  };

  const parts = data.text.split("______");

  return (
    <div className="interaction-stack">
      <div className="insight-card">
        {parts.map((part, index) => (
          <React.Fragment key={`${part}-${index}`}>
            <span>{part}</span>
            {index < data.answers.length && (
              <input
                value={values[index]}
                onChange={(event) => {
                  const next = [...values];
                  next[index] = event.target.value;
                  setValues(next);
                }}
                aria-label={`Insight blank ${index + 1}`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className="answer-bank">
        {data.answers.map((answer, index) => (
          <button
            className="choice-block"
            key={`${answer}-${index}`}
            onClick={() => {
              const next = [...values];
              const emptyIndex = next.findIndex((value) => !value);
              next[emptyIndex === -1 ? index : emptyIndex] = answer;
              setValues(next);
            }}
          >
            {answer}
          </button>
        ))}
      </div>
      <button className="run-button" onClick={run}>Run</button>
    </div>
  );
}
