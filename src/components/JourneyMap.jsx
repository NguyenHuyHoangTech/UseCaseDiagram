import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Lock, ChevronDown, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { courseData } from '../courseData';

const JourneyMap = () => {
  // Keep track of which stages are expanded. 
  // By default, expand all stages so the user can see all lessons.
  const [expandedStages, setExpandedStages] = useState(courseData.map(s => s.id));
  const [showHiddenLessons, setShowHiddenLessons] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleToggle = () => setShowHiddenLessons(prev => !prev);
    window.addEventListener('toggle-hidden-lessons', handleToggle);
    return () => window.removeEventListener('toggle-hidden-lessons', handleToggle);
  }, []);

  const handleStageClick = (stageId) => {
    setExpandedStages(prev => 
      prev.includes(stageId) 
        ? prev.filter(id => id !== stageId)
        : [...prev, stageId]
    );
  };

  const handleLessonClick = (lessonId) => {
    navigate(`/lesson/${lessonId}`);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px 20px 100px'
    }}>
      {courseData.map((stage, index) => {
        const isExpanded = expandedStages.includes(stage.id);
        const isCompleted = stage.id < 1; // Logic placeholder
        const isLocked = stage.id > 5; // Logic placeholder
        const isCurrent = stage.id === 1;

        return (
          <React.Fragment key={stage.id}>
            {/* Stage Node */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              margin: '15px 0',
              width: '100%',
              maxWidth: '450px'
            }}>
              <motion.div 
                whileHover={!isLocked ? { scale: 1.05 } : {}}
                onClick={() => !isLocked && handleStageClick(stage.id)}
                style={{
                  width: isCurrent ? '90px' : '80px',
                  height: isCurrent ? '90px' : '80px',
                  borderRadius: '50%',
                  background: isLocked ? 'var(--locked-bg)' : isCompleted ? 'var(--brand-color)' : 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: isLocked ? 'none' : isCurrent ? '0 0 0 6px rgba(18, 184, 134, 0.15), var(--node-shadow)' : 'var(--node-shadow)',
                  position: 'relative',
                  zIndex: 10,
                  cursor: isLocked ? 'not-allowed' : 'pointer',
                  border: isLocked ? '4px solid var(--locked-bg)' : isCompleted ? '4px solid var(--brand-color)' : '4px solid white',
                  flexShrink: 0
                }}
              >
                {isCurrent && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    width: '12px',
                    height: '12px',
                    background: 'var(--brand-color)',
                    borderRadius: '50%'
                  }} />
                )}
                {isCompleted ? <Check color="white" size={32} /> : 
                 isLocked ? <Lock color="var(--locked-icon)" size={32} /> : 
                 <div style={{ fontSize: '2rem' }}>🔀</div>}
              </motion.div>
              
              <div style={{ paddingLeft: '24px', flex: 1 }}>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  marginBottom: '4px',
                  color: isLocked ? 'var(--locked-icon)' : 'var(--text-main)'
                }}>
                  {stage.title}
                </h3>
                <p style={{ 
                  fontSize: '0.9rem', 
                  color: isLocked ? 'var(--locked-icon)' : 'var(--text-muted)'
                }}>
                  {stage.description}
                </p>
              </div>
            </div>

            {/* Lessons List (Expanded State) */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden', width: '100%', maxWidth: '450px' }}
                >
                  <div style={{ padding: '10px 0 20px 40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {stage.lessons.map((lesson, idx) => {
                      const isHiddenLesson = ['lesson-18', 'lesson-19', 'lesson-20'].includes(lesson.id);
                      if (isHiddenLesson && !showHiddenLessons) return null;

                      return (
                        <motion.div
                          whileHover={{ x: 5 }}
                          key={lesson.id}
                          onClick={() => handleLessonClick(lesson.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '16px',
                            cursor: 'pointer',
                            position: 'relative'
                          }}
                        >
                          {/* Mini vertical connector for lessons */}
                          {idx !== stage.lessons.length - 1 && (
                             <div style={{
                               position: 'absolute',
                               left: '11px',
                               top: '24px',
                               bottom: '-36px',
                               width: '2px',
                               background: 'var(--connector-color)',
                               zIndex: 1
                             }} />
                          )}
                          
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: 'white',
                            border: '2px solid var(--brand-color)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            zIndex: 2
                          }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--brand-color)' }} />
                          </div>
                          
                          <div style={{ flex: 1, background: 'white', padding: '12px 16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #eee' }}>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--brand-hover)', marginBottom: '4px' }}>
                              {lesson.title}
                            </h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                              {lesson.content.substring(0, 60)}...
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Main Connector to next stage */}
            {index < courseData.length - 1 && (
              <div style={{
                width: '4px',
                height: isExpanded ? '30px' : '50px',
                backgroundColor: isCompleted ? 'var(--brand-color)' : 'var(--connector-color)',
                margin: '0 auto',
                borderRadius: '2px',
                transition: 'height 0.3s ease'
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default JourneyMap;
