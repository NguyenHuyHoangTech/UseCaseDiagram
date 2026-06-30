import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, X, ArrowRight, HelpCircle } from 'lucide-react';

const SpacedRepetitionCard = ({ data, onSolved }) => {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleOptionClick = (idx) => {
    if (checked) return;
    
    const correct = data.options[idx].correct;
    setSelectedIdx(idx);
    setChecked(true);
    setIsCorrect(correct);

    // Tell the parent that the spaced repetition is solved (so they can proceed)
    onSolved(true);

    if (correct) {
      // Reward +1 Star, +1 Zap
      const currentStars = parseInt(localStorage.getItem('user-stars') || '850', 10);
      const currentZaps = parseInt(localStorage.getItem('user-zaps') || '12', 10);
      localStorage.setItem('user-stars', (currentStars + 1).toString());
      localStorage.setItem('user-zaps', (currentZaps + 1).toString());
      window.dispatchEvent(new Event('stats-updated'));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 25 }}
      style={{
        marginTop: '32px',
        padding: '32px',
        borderRadius: '24px',
        background: 'linear-gradient(135deg, #ffffff 0%, #faf9ff 100%)',
        border: '2px solid #e5dbff',
        boxShadow: '0 0 20px rgba(143, 120, 255, 0.08), 0 12px 36px rgba(143, 120, 255, 0.12)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Sparkle background decoration */}
      <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1, pointerEvents: 'none' }}>
        <Sparkles size={120} color="#7048e8" />
      </div>

      {/* Header Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        background: 'linear-gradient(90deg, #7048e8 0%, #845ef7 100%)',
        color: 'white',
        padding: '6px 16px',
        borderRadius: '100px',
        fontSize: '0.8rem',
        fontWeight: 800,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        marginBottom: '20px',
        boxShadow: '0 4px 10px rgba(112, 72, 232, 0.2)'
      }}>
        <Sparkles size={14} />
        Brain Boost • Spaced Repetition
      </div>

      {/* Question */}
      <h3 style={{
        fontSize: '1.2rem',
        fontWeight: 800,
        color: '#2b2254',
        marginBottom: '24px',
        lineHeight: 1.5
      }}>
        {data.question}
      </h3>

      {/* Options (Side-by-side or stacked) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {data.options.map((option, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrectAnswer = checked && option.correct;
          const isSelectedAndWrong = checked && isSelected && !option.correct;
          
          let btnBg = 'white';
          let btnBorder = '2px solid #efeef6';
          let btnColor = '#495057';
          let btnShadow = '0 4px 10px rgba(0,0,0,0.02)';

          if (!checked) {
            // Hover styling handled inline or via simple transitions
          } else {
            if (isCorrectAnswer) {
              btnBg = '#ebfbee';
              btnBorder = '2px solid #40c057';
              btnColor = '#2b8a3e';
              btnShadow = '0 4px 10px rgba(64, 192, 87, 0.08)';
            } else if (isSelectedAndWrong) {
              btnBg = '#fff5f5';
              btnBorder = '2px solid #fa5252';
              btnColor = '#c92a2a';
              btnShadow = '0 4px 10px rgba(250, 82, 82, 0.08)';
            } else {
              btnBg = '#f8f9fa';
              btnBorder = '2px solid #e9ecef';
              btnColor = '#adb5bd';
              btnShadow = 'none';
            }
          }

          return (
            <motion.button
              key={idx}
              disabled={checked}
              onClick={() => handleOptionClick(idx)}
              whileHover={!checked ? { scale: 1.03, y: -2, borderColor: '#7048e8', boxShadow: '0 6px 15px rgba(112, 72, 232, 0.1)' } : {}}
              whileTap={!checked ? { scale: 0.98 } : {}}
              style={{
                padding: '18px 20px',
                background: btnBg,
                border: btnBorder,
                borderRadius: '16px',
                color: btnColor,
                fontWeight: 800,
                fontSize: '1.05rem',
                boxShadow: btnShadow,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                cursor: checked ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'monospace', /* Gives the <<include>> a code-like look */
                letterSpacing: '0.5px'
              }}
            >
              {checked && isCorrectAnswer && <Check size={18} />}
              {checked && isSelectedAndWrong && <X size={18} />}
              {option.text}
            </motion.button>
          );
        })}
      </div>

      {/* Explanation Banner */}
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            style={{
              paddingTop: '20px',
              borderTop: '1px solid #e5dbff',
              overflow: 'hidden'
            }}
          >
            <div style={{
              background: isCorrect ? '#f3f0ff' : '#fff5f5',
              borderRadius: '16px',
              padding: '20px',
              borderLeft: isCorrect ? '4px solid #7048e8' : '4px solid #fa5252'
            }}>
              <h4 style={{
                fontWeight: 800,
                color: isCorrect ? '#5f3dc4' : '#c92a2a',
                fontSize: '0.95rem',
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {isCorrect ? '🎉 Excellent! Correct! (+1 Star, +1 Zap)' : '💡 Keep this knowledge in mind!'}
              </h4>
              <p style={{
                fontSize: '0.9rem',
                color: '#495057',
                lineHeight: 1.6
              }}>
                {data.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SpacedRepetitionCard;
