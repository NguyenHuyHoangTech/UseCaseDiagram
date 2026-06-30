import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, ShieldAlert, ShieldCheck, User, Users } from 'lucide-react';

const DecisionTreeWidget = ({ lesson, onSolved }) => {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    setSelectedIdx(null);
    setChecked(false);
    setIsCorrect(false);
  }, [lesson]);

  const handleOptionSelect = (idx) => {
    if (checked && isCorrect) return;
    
    setSelectedIdx(idx);
    const correct = lesson.options[idx].correct;
    setChecked(true);
    setIsCorrect(correct);

    if (correct) {
      onSolved(true);
      // Reward +5 Stars, +2 Zaps
      const currentStars = parseInt(localStorage.getItem('user-stars') || '850', 10);
      const currentZaps = parseInt(localStorage.getItem('user-zaps') || '12', 10);
      localStorage.setItem('user-stars', (currentStars + 5).toString());
      localStorage.setItem('user-zaps', (currentZaps + 2).toString());
      window.dispatchEvent(new Event('stats-updated'));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
      
      {/* Scenario Briefing Card */}
      <div style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        padding: '24px',
        borderRadius: '20px',
        border: '1px solid #dee2e6',
        boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
      }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--brand-hover)', marginBottom: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <ShieldAlert size={18} />
          Role-Based Access Control Design Scenario (CRUD)
        </h4>
        <p style={{ margin: 0, fontSize: '0.98rem', color: '#495057', lineHeight: 1.6 }}>
          {lesson.scenario}
        </p>
      </div>

      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 -8px' }}>
        {lesson.question}
      </h3>

      {/* Side-by-side Choice Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {lesson.options.map((option, idx) => {
          const isSelected = selectedIdx === idx;
          const isCorrectAnswer = checked && option.correct;
          const isSelectedAndWrong = checked && isSelected && !option.correct;
          
          let cardBorder = '1px solid #efeef6';
          let cardBg = 'white';
          let cardShadow = '0 6px 18px rgba(0,0,0,0.02)';

          if (isSelected) {
            cardBorder = '1px solid var(--brand-color)';
            cardShadow = '0 0 0 3px rgba(18, 184, 134, 0.15), 0 10px 20px rgba(0,0,0,0.05)';
          }

          if (checked) {
            if (option.correct) {
              cardBorder = '2px solid #40c057';
              cardBg = '#f0fdf4';
            } else if (isSelectedAndWrong) {
              cardBorder = '2px solid #fa5252';
              cardBg = '#fff5f5';
            }
          }

          return (
            <motion.div
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              whileHover={!(checked && isCorrect) ? { scale: 1.02, y: -2, boxShadow: '0 12px 24px rgba(0,0,0,0.06)' } : {}}
              whileTap={!(checked && isCorrect) ? { scale: 0.98 } : {}}
              style={{
                padding: '24px',
                background: cardBg,
                border: cardBorder,
                borderRadius: '20px',
                boxShadow: cardShadow,
                cursor: checked && isCorrect ? 'default' : 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                transition: 'all 0.2s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Option Badge */}
              <div style={{
                alignSelf: 'flex-start',
                padding: '4px 12px',
                borderRadius: '8px',
                background: isCorrectAnswer ? '#40c057' : isSelectedAndWrong ? '#fa5252' : '#f1f3f5',
                color: isCorrectAnswer || isSelectedAndWrong ? 'white' : '#495057',
                fontSize: '0.78rem',
                fontWeight: 800,
                textTransform: 'uppercase'
              }}>
                Option {idx + 1}
              </div>

              {/* Option Diagram Preview */}
              <div style={{
                height: '180px',
                background: '#f8f9fa',
                borderRadius: '14px',
                border: '1px solid #e9ecef',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '12px',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {option.image ? (
                  /* Render full-size diagram image if provided (Lesson 12) */
                  <>
                    <img
                      src={option.image}
                      alt="Choice Diagram"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        borderRadius: '8px',
                        zIndex: 2
                      }}
                    />
                    
                    {/* Security Indicator Overlay (Only show after selection checked) */}
                    {checked && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: option.correct ? '#ebfbee' : '#fff5f5',
                        border: option.correct ? '1px solid #b2f2bb' : '1px solid #ffc9c9',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 3,
                        animation: !option.correct ? 'pulse 1.5s infinite' : 'none'
                      }}>
                        {option.correct ? (
                          <ShieldCheck size={16} color="#40c057" />
                        ) : (
                          <ShieldAlert size={16} color="#fa5252" />
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  /* Fallback to CSS/SVG miniature UML diagrams (Lesson 11) */
                  lesson.id === 'lesson-11' && (
                    idx === 0 ? (
                      /* Mock Diagram for Option 1 */
                      <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', zIndex: 2 }}>
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', background: 'white', padding: '6px 10px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                            <User size={12} color="#1c7ed6" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>Customer</span>
                          </div>
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', background: 'white', padding: '6px 10px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                            <Users size={12} color="#495057" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>Admin</span>
                          </div>
                        </div>

                        {/* SVG Connector Lines */}
                        <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, pointerEvents: 'none' }}>
                          <line x1="100" y1="45" x2="160" y2="70" stroke="#ced4da" strokeWidth="1.5" />
                          <line x1="100" y1="95" x2="160" y2="70" stroke="#ced4da" strokeWidth="1.5" />
                        </svg>

                        <div style={{
                          zIndex: 2,
                          background: 'white',
                          border: '1.5px solid #495057',
                          padding: '12px',
                          borderRadius: '50px',
                          textAlign: 'center',
                          boxShadow: '0 4px 8px rgba(0,0,0,0.02)'
                        }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#495057' }}>Manage Information</span>
                        </div>

                        {/* Security Leak Indicator (Only show after selection checked) */}
                        {checked && (
                          <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: '#fff5f5',
                            border: '1px solid #ffc9c9',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            animation: 'pulse 1.5s infinite'
                          }}>
                            <ShieldAlert size={16} color="#fa5252" />
                          </div>
                        )}
                      </>
                    ) : (
                      /* Mock Diagram for Option 2 */
                      <>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', zIndex: 2 }}>
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', background: 'white', padding: '6px 10px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                            <User size={12} color="#1c7ed6" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>Customer</span>
                          </div>
                          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', background: 'white', padding: '6px 10px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                            <Users size={12} color="#495057" />
                            <span style={{ fontSize: '0.7rem', fontWeight: 700 }}>Admin</span>
                          </div>
                        </div>

                        {/* SVG Connector Lines */}
                        <svg style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, pointerEvents: 'none' }}>
                          {/* Khách hàng -> Xem */}
                          <line x1="100" y1="40" x2="160" y2="40" stroke="#ced4da" strokeWidth="1.5" />
                          {/* Admin -> Xem */}
                          <line x1="100" y1="100" x2="160" y2="40" stroke="#ced4da" strokeWidth="1.5" />
                          {/* Admin -> Sửa/Xóa */}
                          <line x1="100" y1="100" x2="160" y2="100" stroke="#ced4da" strokeWidth="1.5" />
                        </svg>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', zIndex: 2 }}>
                          <div style={{
                            background: 'white',
                            border: '1.5px solid #495057',
                            padding: '6px 12px',
                            borderRadius: '50px',
                            textAlign: 'center'
                          }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#495057' }}>View Information</span>
                          </div>
                          <div style={{
                            background: 'white',
                            border: '1.5px solid #495057',
                            padding: '6px 12px',
                            borderRadius: '50px',
                            textAlign: 'center'
                          }}>
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#495057' }}>Edit/Delete Information</span>
                          </div>
                        </div>

                        {/* Secure Shield Indicator (Only show after selection checked) */}
                        {checked && (
                          <div style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                            background: '#ebfbee',
                            border: '1px solid #b2f2bb',
                            borderRadius: '50%',
                            width: '28px',
                            height: '28px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}>
                            <ShieldCheck size={16} color="#40c057" />
                          </div>
                        )}
                      </>
                    )
                  )
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Explanation Banner */}
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            style={{
              padding: '24px',
              borderRadius: '20px',
              background: isCorrect ? '#f0fdf4' : '#fff5f5',
              border: isCorrect ? '2px solid #b2f2bb' : '2px solid #ffc9c9',
              marginTop: '10px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              {isCorrect ? (
                <CheckCircle color="#2b8a3e" size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
              ) : (
                <AlertCircle color="#c92a2a" size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
              )}
              
              <div>
                <h4 style={{ 
                  fontWeight: 800, 
                  fontSize: '1.1rem', 
                  color: isCorrect ? '#2b8a3e' : '#c92a2a',
                  marginBottom: '8px'
                }}>
                  {isCorrect ? 'Excellent! A perfectly optimized solution. 🛡️ (+5 Stars, +2 Zaps)' : 'Danger! This design has a serious flaw!'}
                </h4>
                
                <p style={{ color: '#495057', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {lesson.options[selectedIdx].feedback}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embed Keyframes for diagram pulsing in CSS */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(250, 82, 82, 0.4); }
          70% { transform: scale(1.1); box-shadow: 0 0 0 8px rgba(250, 82, 82, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(250, 82, 82, 0); }
        }
      `}</style>
    </div>
  );
};

export default DecisionTreeWidget;
