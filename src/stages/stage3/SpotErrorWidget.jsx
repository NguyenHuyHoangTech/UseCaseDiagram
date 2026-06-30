import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, HelpCircle, Target } from 'lucide-react';

const SpotErrorWidget = ({ lesson, onSolved }) => {
  const containerRef = useRef(null);
  const [clickedCoords, setClickedCoords] = useState(null); // { x, y } in percent
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);

  useEffect(() => {
    setClickedCoords(null);
    setChecked(false);
    setIsCorrect(false);
  }, [lesson]);

  const handleCanvasClick = (e) => {
    if (checked && isCorrect) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    setClickedCoords({ x: clickX, y: clickY });

    // In courseData, target is at x: 50, y: 50 with radius: 50 (representing percentage distance)
    const target = lesson.error_zones[0];
    const targetX = target.coordinates.x;
    const targetY = target.coordinates.y;

    // Calculate Euclidean distance in percentage units
    const distance = Math.sqrt(Math.pow(clickX - targetX, 2) + Math.pow(clickY - targetY, 2));

    // Let's allow a generous 16% radius for hitting the arrow hotspot
    const isHit = distance <= 16;

    setChecked(true);
    setIsCorrect(isHit);

    if (isHit) {
      onSolved(true);
      // Reward +5 Stars, +2 Zaps
      const currentStars = parseInt(localStorage.getItem('user-stars') || '850', 10);
      const currentZaps = parseInt(localStorage.getItem('user-zaps') || '12', 10);
      localStorage.setItem('user-stars', (currentStars + 5).toString());
      localStorage.setItem('user-zaps', (currentZaps + 2).toString());
      window.dispatchEvent(new Event('stats-updated'));
    } else {
      setShakeTrigger(true);
      setTimeout(() => setShakeTrigger(false), 500);
    }
  };

  const target = lesson.error_zones[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
      
      {/* Visual Instruction Badge */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: '#e8f7ff',
        color: '#1c7ed6',
        padding: '12px 20px',
        borderRadius: '16px',
        fontSize: '0.92rem',
        fontWeight: 700,
        border: '1px solid #d0ebff'
      }}>
        <Target size={18} />
        Task: Find the arrow error in the diagram below and click directly on it!
      </div>

      {/* Diagram Hotspot Canvas Container */}
      <motion.div
        ref={containerRef}
        onClick={handleCanvasClick}
        animate={shakeTrigger ? { x: [-8, 8, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
        style={{
          position: 'relative',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '2px solid #e9ecef',
          background: '#ffffff',
          boxShadow: '0 8px 30px rgba(0,0,0,0.03)',
          cursor: checked && isCorrect ? 'default' : 'crosshair',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '24px',
          userSelect: 'none'
        }}
      >
        <img
          src={lesson.image_reference}
          alt="Error Diagram"
          style={{
            maxWidth: '100%',
            height: 'auto',
            maxHeight: '380px',
            borderRadius: '12px',
            pointerEvents: 'none' // Clicks bubble up to the parent container
          }}
        />

        {/* Hotspot indicators */}
        {/* Correct Spot Glowing Circle */}
        {checked && isCorrect && (
          <div style={{
            position: 'absolute',
            left: `${target.coordinates.x}%`,
            top: `${target.coordinates.y}%`,
            width: '60px',
            height: '60px',
            marginLeft: '-30px',
            marginTop: '-30px',
            borderRadius: '50%',
            border: '3px solid #40c057',
            background: 'rgba(64, 192, 87, 0.2)',
            boxShadow: '0 0 15px rgba(64, 192, 87, 0.6)',
            pointerEvents: 'none',
            animation: 'sonar 2s infinite ease-in-out'
          }} />
        )}

        {/* Incorrect Click Red Dot */}
        {checked && !isCorrect && clickedCoords && (
          <motion.div
            initial={{ scale: 0.5, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'absolute',
              left: `${clickedCoords.x}%`,
              top: `${clickedCoords.y}%`,
              width: '24px',
              height: '24px',
              marginLeft: '-12px',
              marginTop: '-12px',
              borderRadius: '50%',
              background: '#fa5252',
              boxShadow: '0 0 8px #fa5252',
              pointerEvents: 'none'
            }}
          />
        )}
      </motion.div>

      {/* Explanation / Hint Panel */}
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
              border: isCorrect ? '2px solid #b2f2bb' : '2px solid #ffc9c9'
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
                  {isCorrect ? 'Excellent! You spotted the design error! 🎯 (+5 Stars, +2 Zaps)' : 'Not quite right!'}
                </h4>
                
                <p style={{ color: '#495057', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {isCorrect ? (
                    <>
                      <strong>Error detected: {target.error_type}</strong> <br/>
                      {target.explanation}
                    </>
                  ) : (
                    'Hint: Look closely at the arrow connecting the Use Cases. A Use Case diagram is not a flowchart. Find if there is any arrow indicating a sequential order between "Login" and "View Balance" and click on it!'
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Embed Sonar keyframes for hotspot pulsation */}
      <style>{`
        @keyframes sonar {
          0% { transform: scale(0.9); opacity: 0.9; box-shadow: 0 0 0 0 rgba(64, 192, 87, 0.4); }
          50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 0 12px rgba(64, 192, 87, 0); }
          100% { transform: scale(0.9); opacity: 0.9; box-shadow: 0 0 0 0 rgba(64, 192, 87, 0); }
        }
      `}</style>
    </div>
  );
};

export default SpotErrorWidget;
