import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const blanksData = [
  { id: 'b1', label: 'Extension Point', correctAnswer: 'c1' },
  { id: 'b2', label: 'Exception Flow', correctAnswer: 'c2' }
];

const choicesData = [
  { id: 'c1', text: 'At Step 2, if the system detects the card is marked with overdue borrowing ➔ Trigger Pay Late Fee Use Case.' },
  { id: 'c2', text: 'At Step 1, if the card is locked or expired ➔ Notify rejection of borrowing and end the Use Case.' },
  { id: 'c3', text: 'At Step 1, if the librarian is absent ➔ Customer takes the book and leaves.' } // trap
];

const Step4MadLibs = ({ onComplete }) => {
  const [answers, setAnswers] = useState({ b1: null, b2: null });
  const [feedback, setFeedback] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDragStart = (e, choice) => {
    e.dataTransfer.setData('choice', JSON.stringify(choice));
  };

  const handleDrop = (e, blankId) => {
    e.preventDefault();
    const choiceStr = e.dataTransfer.getData('choice');
    if (!choiceStr) return;
    const choice = JSON.parse(choiceStr);

    setAnswers(prev => ({ ...prev, [blankId]: choice }));
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleCheck = () => {
    if (!answers.b1 || !answers.b2) {
      showFeedback('error', 'You must fill in both blanks.');
      return;
    }
    
    if (answers.b1.id !== blanksData[0].correctAnswer || answers.b2.id !== blanksData[1].correctAnswer) {
      showFeedback('error', 'Incorrect match! Remember: An Exception will cause the Use Case to fail/end. An Extension Point is a branching point to another Use Case (like Paying a fine).');
      return;
    }

    showFeedback('success', 'Absolutely correct!');
    setSuccess(true);
    confetti({ particleCount: 150, spread: 180, origin: { y: 0.6 } });
  };

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 5000);
  };

  const isUsed = (choiceId) => Object.values(answers).some(ans => ans && ans.id === choiceId);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--brand-color)' }}>
        18.4 Write Specification - Exception Traps (Specification)
      </h3>
      <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
        Drag the scenario blocks below into the blanks to complete the "Borrow Book" Use Case Specification.
      </p>

      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', background: feedback.type === 'error' ? '#ffe3e3' : '#d3f9d8', color: feedback.type === 'error' ? '#e03131' : '#2b8a3e', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
            {feedback.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />} {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #dee2e6', marginBottom: '24px' }}>
        <h4 style={{ borderBottom: '2px solid #f1f3f5', paddingBottom: '12px', marginBottom: '20px' }}>Use Case Specification: Borrow Book</h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem' }}>
          <div><strong>Actor:</strong> Reader</div>
          <div><strong>Precondition:</strong> Reader has logged into the system.</div>
          <div>
            <strong>Basic Flow:</strong>
            <ol style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li>The system implicitly automatically <em>&lt;&lt;include&gt;&gt;</em> Check card status.</li>
              <li>Reader selects the book to borrow.</li>
              <li>The system records the book borrowing transaction.</li>
            </ol>
          </div>

          {blanksData.map(blank => (
            <div key={blank.id} style={{ marginTop: '10px' }}>
              <div style={{ fontWeight: 600, color: '#495057', marginBottom: '8px' }}>{blank.label}</div>
              <div 
                onDrop={(e) => handleDrop(e, blank.id)} 
                onDragOver={handleDragOver}
                style={{ 
                  background: answers[blank.id] ? '#e7f5ff' : '#f8f9fa', 
                  border: answers[blank.id] ? '2px solid #339af0' : '2px dashed #adb5bd', 
                  minHeight: '48px', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '12px 16px',
                  color: answers[blank.id] ? '#1864ab' : '#adb5bd',
                  fontWeight: answers[blank.id] ? 500 : 400
                }}
              >
                {answers[blank.id] ? answers[blank.id].text : 'Drag and drop scenario here...'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
        {choicesData.map(choice => (
          <motion.div
            key={choice.id}
            draggable={!isUsed(choice.id)}
            onDragStart={(e) => handleDragStart(e, choice)}
            style={{
              padding: '16px 20px',
              background: '#fff',
              border: '2px solid #ced4da',
              borderRadius: '8px',
              cursor: isUsed(choice.id) ? 'default' : 'grab',
              fontWeight: 500,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              opacity: isUsed(choice.id) ? 0.3 : 1
            }}
          >
            {choice.text}
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
        {!success ? (
          <button onClick={handleCheck} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--text-main)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Approve Specification
          </button>
        ) : (
          <button onClick={onComplete} style={{ padding: '12px 32px', borderRadius: '100px', background: '#12b886', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Excellent! See results <ArrowRight size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Step4MadLibs;
