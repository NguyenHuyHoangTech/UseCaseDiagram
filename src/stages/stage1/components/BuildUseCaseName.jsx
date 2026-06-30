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
      onResult({ tone: "error", title: "Missing piece", message: "Select a verb and a business noun." });
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
      title: enough ? "Usable Use Case name" : "Name not quite right",
      message: data.feedbackByPair?.[selectedKey] || (currentIsValid ? `Correct. Please create enough ${requiredCount} good names.` : "This pair is still tied to UI, code, database, or is too broad."),
      simulation: enough ? data.successSimulation : "This oval makes the reader not know what business goal the actor wants to achieve.",
      details: data.requiredCount ? [`Created ${validAccepted.length}/${requiredCount} good names.`] : [buildLabel(data, verbId, nounId)],
    });
  };

  return (
    <div className="interaction-stack">
      <div className="name-builder">
        <section>
          <h3>Verb</h3>
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
          <h3>Business Noun</h3>
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

