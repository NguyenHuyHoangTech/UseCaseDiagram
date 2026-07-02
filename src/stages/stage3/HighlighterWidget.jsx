import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, Sparkles, User, Settings, EyeOff, HelpCircle } from 'lucide-react';

const HighlighterWidget = ({ lesson, onSolved }) => {
  const [currentMode, setCurrentMode] = useState('actor'); // 'actor' | 'usecase' | 'noise'
  const [highlights, setHighlights] = useState({}); // { [index]: 'actor' | 'usecase' | 'noise' }
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    setHighlights({});
    setChecked(false);
    setIsCorrect(false);
    setCurrentMode('actor');
  }, [lesson]);

  const handleSegmentClick = (idx, segment) => {
    if (checked && isCorrect) return;
    
    // Toggle highlight
    setHighlights(prev => {
      const copy = { ...prev };
      if (copy[idx] === currentMode) {
        delete copy[idx]; // Clear highlight if clicked again with the same brush
      } else {
        copy[idx] = currentMode; // Apply current brush
      }
      return copy;
    });
    setChecked(false);
  };

  const handleCheck = () => {
    // Check if user highlights match the correct types in lesson.segments
    let correct = true;
    
    lesson.segments.forEach((segment, idx) => {
      const userHighlight = highlights[idx] || null;
      const correctHighlight = segment.type || null;
      
      if (userHighlight !== correctHighlight) {
        correct = false;
      }
    });

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

  const handleReset = () => {
    setHighlights({});
    setChecked(false);
    setIsCorrect(false);
  };

  // Styling maps
  const modes = [
    { id: 'actor', label: 'Actor', color: '#228be6', bg: '#e7f5ff', icon: <User size={16} /> },
    { id: 'usecase', label: 'Use Case', color: '#40c057', bg: '#ebfbee', icon: <Settings size={16} /> },
    { id: 'noise', label: 'Noise (Technical Detail)', color: '#fd7e14', bg: '#fff4e6', icon: <EyeOff size={16} /> }
  ];

  const getHighlightStyle = (type) => {
    switch (type) {
      case 'actor':
        return { background: 'rgba(34, 139, 230, 0.25)', borderBottom: '3px solid #228be6', borderRadius: '4px 4px 0 0', cursor: 'pointer' };
      case 'usecase':
        return { background: 'rgba(64, 192, 87, 0.25)', borderBottom: '3px solid #40c057', borderRadius: '4px 4px 0 0', cursor: 'pointer' };
      case 'noise':
        return { background: 'rgba(253, 126, 20, 0.25)', borderBottom: '3px solid #fd7e14', borderRadius: '4px 4px 0 0', cursor: 'pointer' };
      default:
        return { cursor: 'pointer' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
      
      {/* Interactive Toolbar Brush Selectors */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          🖌️ Select highlight brush:
        </span>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {modes.map(mode => {
            const isActive = currentMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setCurrentMode(mode.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: isActive ? `2px solid ${mode.color}` : '2px solid #efeef6',
                  background: isActive ? mode.bg : 'white',
                  color: isActive ? mode.color : 'var(--text-main)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  boxShadow: isActive ? `0 4px 12px ${mode.color}15` : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                {mode.icon}
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Text Selection Canvas */}
      <div style={{
        padding: '32px',
        borderRadius: '20px',
        background: '#ffffff',
        border: '2px dashed #dbe2e8',
        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.02)',
        lineHeight: 2.2,
        fontSize: '1.2rem',
        color: 'var(--text-main)',
        userSelect: 'none'
      }}>
        {lesson.segments.map((segment, idx) => {
          const highlightType = highlights[idx];
          return (
            <motion.span
              key={idx}
              onClick={() => handleSegmentClick(idx, segment)}
              whileHover={{ scale: 1.02 }}
              style={{
                display: 'inline-block',
                padding: '0 4px',
                transition: 'all 0.15s ease',
                margin: '0 2px',
                ...getHighlightStyle(highlightType)
              }}
            >
              {segment.text}
            </motion.span>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', alignItems: 'center' }}>
        {Object.keys(highlights).length > 0 && !(checked && isCorrect) && (
          <button
            onClick={handleReset}
            style={{
              padding: '12px 24px',
              borderRadius: '100px',
              border: '2px solid #e9ecef',
              background: 'white',
              color: '#495057',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            Retry
          </button>
        )}
        
        {Object.keys(highlights).length > 0 && !(checked && isCorrect) && (
          <button
            onClick={handleCheck}
            style={{
              padding: '14px 40px',
              borderRadius: '100px',
              background: 'var(--brand-color)',
              color: 'white',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(18, 184, 134, 0.3)',
              transition: 'all 0.2s'
            }}
          >
            Check result
          </button>
        )}
      </div>

      {/* Explanation Banner */}
      <AnimatePresence>
        {checked && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            style={{
              padding: '28px',
              borderRadius: '20px',
              background: isCorrect ? '#f0fdf4' : '#fff5f5',
              border: isCorrect ? '2px solid #b2f2bb' : '2px solid #ffc9c9'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              {isCorrect ? (
                <CheckCircle color="#2b8a3e" size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
              ) : (
                <AlertCircle color="#c92a2a" size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
              )}
              
              <div>
                <h4 style={{ 
                  fontWeight: 800, 
                  fontSize: '1.15rem', 
                  color: isCorrect ? '#2b8a3e' : '#c92a2a',
                  marginBottom: '8px'
                }}>
                  {isCorrect 
                    ? 'Excellent! You extracted the keywords perfectly! 🌟 (+5 Stars, +2 Zaps)' 
                    : 'The analysis is not quite right!'}
                </h4>
                
                <p style={{ color: '#495057', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {isCorrect ? (
                    <>
                      You have correctly highlighted the core elements:
                      <ul style={{ paddingLeft: '20px', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <li>• <strong>Actor (Blue):</strong> <code>Chief Accountant</code> (Who interacts with the system?).</li>
                        <li>• <strong>Use Case (Green):</strong> <code>export financial reports</code> (What is the Actor's business goal?).</li>
                        <li>• <strong>Noise/Technical Details (Orange):</strong> Information like <code>using company account</code> (security detail), <code>as a PDF file</code> (output format), <code>Arial font</code> (UI), and <code>Oracle database</code> (storage technology).</li>
                      </ul>
                      <strong>Lesson learned:</strong> A Use Case diagram only describes <strong>WHAT the system can do</strong> from a user's business perspective. Filter out non-functional requirements, technology, or specific UI details, as they belong to the detailed design phase (HOW)!
                    </>
                  ) : (
                    'Hint: Review the orange (noise) areas. Remember that font (Arial), file format (PDF), database type (Oracle), or login method (company account) are technical implementation details (HOW) and not the system\'s business features (WHAT). Re-highlight and check again!'
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HighlighterWidget;
