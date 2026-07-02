import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MessageCircle, Plus, CheckCircle, ArrowRight } from 'lucide-react';

const Step5Twist = ({ onComplete }) => {
  const [showChat, setShowChat] = useState(false);
  const [addedUseCase, setAddedUseCase] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Fire confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);
      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    // Show chat after fireworks
    setTimeout(() => setShowChat(true), 3500);

    return () => clearInterval(interval);
  }, []);

  const handleAddUseCase = () => {
    setAddedUseCase(true);
    setActiveQuiz(true);
  };

  const handleQuizAnswer = (type) => {
    if (type === 'extend') {
      setActiveQuiz(false);
      setCompleted(true);
      confetti({ particleCount: 150, spread: 180, origin: { y: 0.6 } });
    } else {
      alert('Incorrect! Is printing a receipt MANDATORY when withdrawing cash?');
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--brand-color)' }}>
        17.5 Requirement Changes Management
      </h3>
      
      {!showChat && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Initial preliminary analysis complete!</h2>
        </div>
      )}

      <AnimatePresence>
        {showChat && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ background: '#f8f9fa', padding: '24px', borderRadius: '16px', border: '1px solid #dee2e6', marginBottom: '24px', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-16px', left: '24px', background: 'white', padding: '4px 12px', borderRadius: '100px', border: '1px solid #dee2e6', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, color: '#495057' }}>
              <MessageCircle size={16} /> Additional requirement from Customer
            </div>
            <p style={{ fontStyle: 'italic', color: '#1d2026', fontSize: '1.1rem', marginTop: '10px' }}>
              "By the way, I want to add a feature: If the customer withdraws cash, they have the option to Print receipt. Please update the diagram for me!"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {showChat && !addedUseCase && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', justifyContent: 'center' }}>
          <button onClick={handleAddUseCase} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--brand-color)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} /> Add "Print Receipt" Use Case
          </button>
        </motion.div>
      )}

      {/* Sơ đồ cập nhật */}
      {addedUseCase && (
        <div style={{ border: '3px solid var(--text-main)', borderRadius: '8px', padding: '32px', position: 'relative', marginTop: '20px' }}>
            <div style={{ background: 'var(--text-main)', color: 'white', padding: '4px 12px', borderRadius: '0 0 8px 8px', position: 'absolute', top: 0, left: '20px', fontWeight: 600 }}>
              ATM System
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', marginTop: '30px' }}>
              <div style={{ background: '#fcc419', padding: '8px 24px', borderRadius: '100px', fontWeight: 600 }}>Withdraw Cash</div>
              
              {!completed ? (
                <div style={{ width: '100px', borderBottom: '2px dashed #adb5bd', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.8rem', color: '#adb5bd' }}>?</div>
                </div>
              ) : (
                <div style={{ width: '120px', borderBottom: '2px dashed var(--brand-color)', position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '-5px', top: '-6px', width: 0, height: 0, borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: '10px solid var(--brand-color)' }}></div>
                  <div style={{ position: 'absolute', top: '-25px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.85rem', color: 'var(--brand-color)', fontWeight: 600 }}>&lt;&lt;extend&gt;&gt;</div>
                </div>
              )}

              <div style={{ background: '#fcc419', padding: '8px 24px', borderRadius: '100px', fontWeight: 600 }}>Print Receipt</div>
            </div>
        </div>
      )}

      <AnimatePresence>
        {activeQuiz && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} style={{ background: 'white', padding: '32px', borderRadius: '16px', maxWidth: '400px', width: '100%' }}>
              <h4 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>What is the relationship?</h4>
              <p style={{ marginBottom: '24px', color: 'var(--text-muted)' }}>"Optionally print receipt" when withdrawing cash belongs to which relationship type?</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button onClick={() => handleQuizAnswer('include')} style={{ padding: '12px', background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}>
                  <strong>&lt;&lt;include&gt;&gt;</strong>
                </button>
                <button onClick={() => handleQuizAnswer('extend')} style={{ padding: '12px', background: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px', cursor: 'pointer', textAlign: 'left' }}>
                  <strong>&lt;&lt;extend&gt;&gt;</strong>, pointing back to Withdraw Cash
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {completed && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
          <button onClick={onComplete} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--brand-color)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Complete Case Study <ArrowRight size={20} />
          </button>
        </motion.div>
      )}

    </motion.div>
  );
};

export default Step5Twist;
