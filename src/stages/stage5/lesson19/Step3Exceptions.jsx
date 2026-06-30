import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const Step3Exceptions = ({ onComplete }) => {
  const [q1, setQ1] = useState(null);
  const [q2, setQ2] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleCheck = () => {
    if (!q1 || !q2) {
      showFeedback('error', 'Please choose a handling direction for all branching situations.');
      return;
    }
    
    if (q1 === 'A') {
      showFeedback('error', 'Situation 1: If you chase customers away just because the card is broken, they will be very angry and cause a traffic jam. Please switch to the manual exception handling process!');
      return;
    }
    
    if (q2 === 'A') {
      showFeedback('error', 'Situation 2: If you open the Barrier when the license plate does not match, you are helping a car thief escape! You must lock the Barrier and call security.');
      return;
    }

    showFeedback('success', 'Great! "Being a BA is not about designing a perfect rosy system, but drawing all the fallback paths for the system when something goes wrong." You have mastered this spirit!');
    setSuccess(true);
    
    const duration = 3 * 1000;
    const end = Date.now() + duration;
    const interval = setInterval(() => {
      if (Date.now() > end) return clearInterval(interval);
      confetti({ particleCount: 50, spread: 360, origin: { x: Math.random(), y: Math.random() - 0.2 } });
    }, 250);
  };

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 6000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--brand-color)' }}>
        19.3 The Branching Nightmare (Write Use Case Specification)
      </h3>
      <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
        Things can go wrong at the parking station. Face the incidents and choose the handling direction (Exception Flow) for the [Swipe card to exit] Specification.
      </p>

      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', background: feedback.type === 'error' ? '#ffe3e3' : '#d3f9d8', color: feedback.type === 'error' ? '#e03131' : '#2b8a3e', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, lineHeight: 1.5 }}>
            {feedback.type === 'error' ? <AlertTriangle size={24} style={{ flexShrink: 0 }} /> : <CheckCircle size={24} style={{ flexShrink: 0 }} />} {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #dee2e6', marginBottom: '24px' }}>
        <h4 style={{ borderBottom: '2px solid #f1f3f5', paddingBottom: '12px', marginBottom: '20px' }}>Use Case Specification: Swipe card to exit</h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem' }}>
          <div>
            <strong>Basic Flow (Happy Path):</strong>
            <ol style={{ paddingLeft: '20px', marginTop: '8px', color: '#495057' }}>
              <li>(1) Guest swipes card.</li>
              <li>(2) System reads card code from RFID chip.</li>
              <li>(3) AI Camera scans the actual vehicle license plate.</li>
              <li>(4) System compares card code with license plate when entering.</li>
              <li>(5) <em>&lt;&lt;extend&gt;&gt;</em> Calculate fee & Pay (if it is a guest).</li>
              <li>(6) Open Barrier for the vehicle to exit.</li>
            </ol>
          </div>

          <div style={{ marginTop: '16px', padding: '16px', background: '#fff5f5', border: '1px solid #ffc9c9', borderRadius: '8px' }}>
            <strong style={{ color: '#e03131' }}>Exception Flows:</strong>
            
            {/* Situation 1 */}
            <div style={{ marginTop: '16px' }}>
              <div style={{ fontWeight: 600, marginBottom: '8px' }}>Situation 1: At Step 2, the card is broken, the machine cannot read the RFID chip. The system will:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', border: q1 === 'A' ? '2px solid #fa5252' : '1px solid #ced4da', background: q1 === 'A' ? '#ffe3e3' : 'white' }}>
                  <input type="radio" name="q1" value="A" checked={q1 === 'A'} onChange={() => setQ1('A')} style={{ display: 'none' }} />
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #adb5bd', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    {q1 === 'A' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fa5252' }} />}
                  </span>
                  [A] Cancel transaction, sound alarm to chase guest back to find another card.
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', border: q1 === 'B' ? '2px solid #339af0' : '1px solid #ced4da', background: q1 === 'B' ? '#e7f5ff' : 'white' }}>
                  <input type="radio" name="q1" value="B" checked={q1 === 'B'} onChange={() => setQ1('B')} style={{ display: 'none' }} />
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #adb5bd', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    {q1 === 'B' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#339af0' }} />}
                  </span>
                  [B] Switch to Use Case flow [Handle lost/broken card] performed manually by Security Guard.
                </label>
              </div>
            </div>

            {/* Situation 2 */}
            <div style={{ marginTop: '24px' }}>
              <div style={{ fontWeight: 600, marginBottom: '8px' }}>Situation 2: At Step 4, the exit license plate DOES NOT MATCH the entry license plate saved in the card. The system will:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', border: q2 === 'A' ? '2px solid #fa5252' : '1px solid #ced4da', background: q2 === 'A' ? '#ffe3e3' : 'white' }}>
                  <input type="radio" name="q2" value="A" checked={q2 === 'A'} onChange={() => setQ2('A')} style={{ display: 'none' }} />
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #adb5bd', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    {q2 === 'A' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fa5252' }} />}
                  </span>
                  [A] Still open Barrier for vehicle to pass, simultaneously trigger alarm to warn security.
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px 12px', borderRadius: '8px', border: q2 === 'B' ? '2px solid #339af0' : '1px solid #ced4da', background: q2 === 'B' ? '#e7f5ff' : 'white' }}>
                  <input type="radio" name="q2" value="B" checked={q2 === 'B'} onChange={() => setQ2('B')} style={{ display: 'none' }} />
                  <span style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid #adb5bd', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
                    {q2 === 'B' && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#339af0' }} />}
                  </span>
                  [B] Tightly lock Barrier, issue warning on Security Guard's screen for manual vehicle document verification.
                </label>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
        {!success ? (
          <button onClick={handleCheck} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--text-main)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Submit Specification
          </button>
        ) : (
          <button onClick={onComplete} style={{ padding: '12px 32px', borderRadius: '100px', background: '#12b886', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Officially beat the final Boss! <ArrowRight size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Step3Exceptions;
