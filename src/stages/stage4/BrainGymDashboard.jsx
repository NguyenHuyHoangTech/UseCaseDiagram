import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, ShieldCheck, Flame, Star, Zap, CheckCircle, RefreshCw, Sparkles, HelpCircle } from 'lucide-react';
import { injectSpacedRepetitionQuestion } from '../../core/utils/spacedRepetition';

const BrainGymDashboard = ({ onSolved }) => {
  // Collect all three Spaced Repetition questions
  const reviewQuestions = [
    injectSpacedRepetitionQuestion('lesson-13'),
    injectSpacedRepetitionQuestion('lesson-15'),
    injectSpacedRepetitionQuestion('lesson-17')
  ].filter(Boolean);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isGymCompleted, setIsGymCompleted] = useState(false);
  
  // Load user profile stats
  const [streak, setStreak] = useState(3); // Mock active streak
  const [totalStars, setTotalStars] = useState(850);
  const [totalZaps, setTotalZaps] = useState(12);

  useEffect(() => {
    // Load from localStorage
    const savedStars = localStorage.getItem('user-stars');
    const savedZaps = localStorage.getItem('user-zaps');
    if (savedStars) setTotalStars(parseInt(savedStars, 10));
    if (savedZaps) setTotalZaps(parseInt(savedZaps, 10));
  }, []);

  const handleOptionClick = (idx) => {
    if (checked) return;
    setSelectedIdx(idx);
    const correct = reviewQuestions[currentIdx].options[idx].correct;
    setIsCorrect(correct);
    setChecked(true);

    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedIdx(null);
    setChecked(false);
    setIsCorrect(false);

    if (currentIdx < reviewQuestions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsGymCompleted(true);
      onSolved(true); // Unlocks Lesson Page navigation

      // Reward +10 Stars, +5 Zaps on full gym completion!
      const finalStars = totalStars + 10;
      const finalZaps = totalZaps + 5;
      setTotalStars(finalStars);
      setTotalZaps(finalZaps);
      localStorage.setItem('user-stars', finalStars.toString());
      localStorage.setItem('user-zaps', finalZaps.toString());
      window.dispatchEvent(new Event('stats-updated'));
    }
  };

  const handleResetGym = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setChecked(false);
    setIsCorrect(false);
    setScore(0);
    setIsGymCompleted(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', width: '100%' }}>
      
      {/* Profile Header Stats Panel */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '16px',
        background: 'linear-gradient(135deg, #f3f0ff 0%, #e8f7ff 100%)',
        padding: '24px',
        borderRadius: '24px',
        border: '1px solid #dbe4ff',
        boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
      }}>
        {/* Streak */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#ffe8cc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Flame size={24} color="#f76707" fill="#f76707" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Study Streak</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f76707' }}>{streak} Days</div>
          </div>
        </div>

        {/* Stars */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#fff9db', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Star size={24} color="#fcc419" fill="#fcc419" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Stars</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#e67700' }}>{totalStars} ⭐</div>
          </div>
        </div>

        {/* Zaps */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#e8f7ff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Zap size={24} color="#339af0" fill="#339af0" />
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Energy</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1c7ed6' }}>{totalZaps} Zaps</div>
          </div>
        </div>
      </div>

      {/* Main Review Hub Workspace */}
      <div className="glass-panel" style={{
        background: 'white',
        border: '1px solid #e9ecef',
        borderRadius: '24px',
        padding: '36px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
        minHeight: '380px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}>
        <AnimatePresence mode="wait">
          {!isGymCompleted ? (
            <motion.div
              key={currentIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              {/* Question Tracker Progress Indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--brand-hover)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  ⚡ Rapid Fire Review ({currentIdx + 1}/{reviewQuestions.length})
                </span>
                <div style={{ width: '100px', height: '6px', background: '#e9ecef', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${((currentIdx + 1) / reviewQuestions.length) * 100}%`, height: '100%', background: 'var(--brand-color)', transition: 'width 0.3s' }} />
                </div>
              </div>

              {/* Question Text */}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#2b2254', marginBottom: '28px', lineHeight: 1.5 }}>
                {reviewQuestions[currentIdx].question}
              </h3>

              {/* Options Stack */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                {reviewQuestions[currentIdx].options.map((option, idx) => {
                  const isSelected = selectedIdx === idx;
                  const isCorrectAnswer = checked && option.correct;
                  const isSelectedAndWrong = checked && isSelected && !option.correct;
                  
                  let btnBg = 'white';
                  let btnBorder = '2px solid #efeef6';
                  let btnColor = '#495057';

                  if (checked) {
                    if (isCorrectAnswer) {
                      btnBg = '#ebfbee';
                      btnBorder = '2px solid #40c057';
                      btnColor = '#2b8a3e';
                    } else if (isSelectedAndWrong) {
                      btnBg = '#fff5f5';
                      btnBorder = '2px solid #fa5252';
                      btnColor = '#c92a2a';
                    } else {
                      btnBg = '#f8f9fa';
                      btnBorder = '2px solid #e9ecef';
                      btnColor = '#adb5bd';
                    }
                  }

                  return (
                    <motion.button
                      key={idx}
                      disabled={checked}
                      onClick={() => handleOptionClick(idx)}
                      whileHover={!checked ? { scale: 1.02, y: -2, borderColor: 'var(--brand-color)' } : {}}
                      whileTap={!checked ? { scale: 0.98 } : {}}
                      style={{
                        padding: '20px',
                        background: btnBg,
                        border: btnBorder,
                        borderRadius: '16px',
                        color: btnColor,
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        cursor: checked ? 'default' : 'pointer',
                        transition: 'all 0.2s ease',
                        fontFamily: 'monospace',
                        textAlign: 'center'
                      }}
                    >
                      {option.text}
                    </motion.button>
                  );
                })}
              </div>

              {/* Explanation & Next Trigger */}
              <AnimatePresence>
                {checked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div style={{
                      background: isCorrect ? '#f0fdf4' : '#fff5f5',
                      borderRadius: '16px',
                      padding: '20px',
                      borderLeft: isCorrect ? '4px solid #40c057' : '4px solid #fa5252',
                      marginBottom: '24px'
                    }}>
                      <h5 style={{ fontWeight: 800, color: isCorrect ? '#2b8a3e' : '#c92a2a', fontSize: '0.95rem', marginBottom: '6px' }}>
                        {isCorrect ? 'Correct! Good knowledge reinforcement.' : 'Incorrect! Please check the explanation below.'}
                      </h5>
                      <p style={{ fontSize: '0.9rem', color: '#495057', lineHeight: 1.5 }}>
                        {reviewQuestions[currentIdx].explanation}
                      </p>
                    </div>

                    <button
                      onClick={handleNext}
                      style={{
                        alignSelf: 'flex-end',
                        padding: '12px 32px',
                        background: 'var(--brand-color)',
                        color: 'white',
                        fontWeight: 700,
                        borderRadius: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        float: 'right'
                      }}
                    >
                      {currentIdx === reviewQuestions.length - 1 ? 'Finish Review' : 'Next Question'}
                      <Sparkles size={16} />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            /* Mastery Completed View */
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                padding: '20px 0'
              }}
            >
              <div style={{
                width: '90px',
                height: '90px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7048e8 0%, #845ef7 100%)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 8px 24px rgba(112, 72, 232, 0.3)',
                marginBottom: '24px'
              }}>
                <Award size={48} color="white" />
              </div>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2b2254', marginBottom: '12px' }}>
                Congratulations! You have completed the Brain Gym! 🏆
              </h2>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '500px', marginBottom: '24px', lineHeight: 1.6 }}>
                You have successfully completed the spaced repetition exercise series reinforcing <strong>&lt;&lt;include&gt;&gt;</strong> and <strong>&lt;&lt;extend&gt;&gt;</strong> relationships. <br/>
                Your performance: <strong>{score}/{reviewQuestions.length} ({Math.round((score/reviewQuestions.length)*100)}%)</strong>.
              </p>

              <div style={{
                background: '#ebfbee',
                border: '1px solid #b2f2bb',
                padding: '16px 28px',
                borderRadius: '16px',
                color: '#2b8a3e',
                fontWeight: 700,
                fontSize: '1.05rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '32px'
              }}>
                <CheckCircle size={20} />
                Received Mastery reward: +10 Stars & +5 Zaps!
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <button
                  onClick={handleResetGym}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '100px',
                    background: '#e9ecef',
                    color: '#495057',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={16} />
                  Practice Again
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BrainGymDashboard;
