import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle, AlertCircle, RefreshCw, MoveRight } from 'lucide-react';

const DragDropWidget = ({ lesson, onSolved }) => {
  const [pool, setPool] = useState([]);
  const [preConditions, setPreConditions] = useState([]);
  const [postConditions, setPostConditions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);

  // Initialize and shuffle the pool
  const initWidget = () => {
    // Shuffle items
    const shuffled = [...lesson.items].sort(() => Math.random() - 0.5);
    setPool(shuffled);
    setPreConditions([]);
    setPostConditions([]);
    setSelectedItem(null);
    setChecked(false);
    setIsCorrect(false);
  };

  useEffect(() => {
    initWidget();
  }, [lesson]);

  // Drag and drop handlers
  const handleDragStart = (e, item) => {
    if (checked && isCorrect) return;
    e.dataTransfer.setData('text/plain', item.text);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetCategory) => {
    e.preventDefault();
    if (checked && isCorrect) return;
    
    const itemText = e.dataTransfer.getData('text/plain');
    moveItem(itemText, targetCategory);
  };

  // Logic to move item between containers
  const moveItem = (itemText, targetCategory) => {
    // Find the item in pool or opposite container
    let item = lesson.items.find(i => i.text === itemText);
    if (!item) return;

    // Remove from current location
    setPool(prev => prev.filter(i => i.text !== itemText));
    setPreConditions(prev => prev.filter(i => i.text !== itemText));
    setPostConditions(prev => prev.filter(i => i.text !== itemText));

    // Add to target location
    if (targetCategory === 'Pre-condition') {
      setPreConditions(prev => [...prev, item]);
    } else if (targetCategory === 'Post-condition') {
      setPostConditions(prev => [...prev, item]);
    } else {
      setPool(prev => [...prev, item]);
    }
    
    setSelectedItem(null);
    setChecked(false);
  };

  // Click-to-move handlers (mobile support)
  const handleItemClick = (item) => {
    if (checked && isCorrect) return;
    setSelectedItem(selectedItem?.text === item.text ? null : item);
  };

  const handleBucketClick = (category) => {
    if (selectedItem) {
      moveItem(selectedItem.text, category);
    }
  };

  // Check answers
  const handleCheck = () => {
    if (pool.length > 0) return; // Must place all items
    
    // Validate Pre-conditions
    const preCorrect = preConditions.every(item => item.category === 'Pre-condition');
    const postCorrect = postConditions.every(item => item.category === 'Post-condition');
    
    const correct = preCorrect && postCorrect && preConditions.length > 0 && postConditions.length > 0;
    
    setChecked(true);
    setIsCorrect(correct);

    if (correct) {
      onSolved(true);
      // Play reward sound / trigger rewards in localStorage
      const currentStars = parseInt(localStorage.getItem('user-stars') || '850', 10);
      const currentZaps = parseInt(localStorage.getItem('user-zaps') || '12', 10);
      localStorage.setItem('user-stars', (currentStars + 5).toString());
      localStorage.setItem('user-zaps', (currentZaps + 2).toString());
      
      // Dispatch custom event to notify Navbar
      window.dispatchEvent(new Event('stats-updated'));
    } else {
      setShakeTrigger(true);
      setTimeout(() => setShakeTrigger(false), 500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
      {/* Pool of items */}
      <div>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          List of conditions to classify:
          <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>
            (Drag and drop or Click to select and click the box below)
          </span>
        </h3>
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '12px', 
          padding: '20px', 
          background: '#f1f3f5', 
          borderRadius: '16px',
          minHeight: '80px',
          border: '2px dashed #dee2e6',
          alignItems: 'center'
        }}>
          {pool.length === 0 && !checked && (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', width: '100%', textAlign: 'center' }}>
              🎉 All placed! Please click Check Answer below.
            </div>
          )}
          {pool.map(item => {
            const isSelected = selectedItem?.text === item.text;
            return (
              <motion.div
                key={item.text}
                draggable
                onDragStart={(e) => handleDragStart(e, item)}
                onClick={() => handleItemClick(item)}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '12px 18px',
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: isSelected ? '0 0 0 3px var(--brand-color), 0 8px 16px rgba(0,0,0,0.06)' : '0 2px 8px rgba(0,0,0,0.05)',
                  cursor: 'grab',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: 'var(--text-main)',
                  border: isSelected ? '1px solid var(--brand-color)' : '1px solid #e9ecef',
                  userSelect: 'none',
                  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
                }}
              >
                {item.text}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Drop Target Buckets */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Pre-conditions Bucket */}
        <div 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'Pre-condition')}
          onClick={() => handleBucketClick('Pre-condition')}
          style={{
            background: '#ebfbee',
            border: '2px dashed #b2f2bb',
            borderRadius: '20px',
            padding: '24px',
            minHeight: '220px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            cursor: selectedItem ? 'pointer' : 'default',
            boxShadow: selectedItem ? '0 0 0 2px #51cf66' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 800, color: '#2b8a3e', fontSize: '1rem' }}>
              🟢 Pre-condition
            </span>
            <span style={{ fontSize: '0.8rem', color: '#5c7cfa', fontWeight: 600, display: selectedItem ? 'block' : 'none' }}>
              Click to drop here
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {preConditions.map(item => {
              const isWrong = checked && item.category !== 'Pre-condition';
              return (
                <motion.div
                  key={item.text}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onClick={(e) => { e.stopPropagation(); handleItemClick(item); }}
                  animate={isWrong && shakeTrigger ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  style={{
                    padding: '12px 16px',
                    background: 'white',
                    borderRadius: '12px',
                    border: checked 
                      ? (isWrong ? '2px solid #fa5252' : '2px solid #40c057')
                      : '1px solid #e9ecef',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: checked && isCorrect ? 'default' : 'grab',
                    position: 'relative',
                    color: isWrong ? '#fa5252' : 'var(--text-main)'
                  }}
                >
                  {item.text}
                  {checked && (
                    <div style={{ position: 'absolute', right: '12px', top: '12px' }}>
                      {isWrong ? <AlertCircle size={16} color="#fa5252" /> : <CheckCircle size={16} color="#40c057" />}
                    </div>
                  )}
                </motion.div>
              );
            })}
            {preConditions.length === 0 && (
              <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', color: '#8fbc8f', fontSize: '0.85rem', fontStyle: 'italic' }}>
                Drag conditions that happen BEFORE here
              </div>
            )}
          </div>
        </div>

        {/* Post-conditions Bucket */}
        <div 
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, 'Post-condition')}
          onClick={() => handleBucketClick('Post-condition')}
          style={{
            background: '#e8f7ff',
            border: '2px dashed #a5d8ff',
            borderRadius: '20px',
            padding: '24px',
            minHeight: '220px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            cursor: selectedItem ? 'pointer' : 'default',
            boxShadow: selectedItem ? '0 0 0 2px #339af0' : 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: 800, color: '#1c7ed6', fontSize: '1rem' }}>
              🔵 Post-condition
            </span>
            <span style={{ fontSize: '0.8rem', color: '#5c7cfa', fontWeight: 600, display: selectedItem ? 'block' : 'none' }}>
              Click to drop here
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
            {postConditions.map(item => {
              const isWrong = checked && item.category !== 'Post-condition';
              return (
                <motion.div
                  key={item.text}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  onClick={(e) => { e.stopPropagation(); handleItemClick(item); }}
                  animate={isWrong && shakeTrigger ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  style={{
                    padding: '12px 16px',
                    background: 'white',
                    borderRadius: '12px',
                    border: checked 
                      ? (isWrong ? '2px solid #fa5252' : '2px solid #40c057')
                      : '1px solid #e9ecef',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: checked && isCorrect ? 'default' : 'grab',
                    position: 'relative',
                    color: isWrong ? '#fa5252' : 'var(--text-main)'
                  }}
                >
                  {item.text}
                  {checked && (
                    <div style={{ position: 'absolute', right: '12px', top: '12px' }}>
                      {isWrong ? <AlertCircle size={16} color="#fa5252" /> : <CheckCircle size={16} color="#40c057" />}
                    </div>
                  )}
                </motion.div>
              );
            })}
            {postConditions.length === 0 && (
              <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', color: '#7ea8cf', fontSize: '0.85rem', fontStyle: 'italic' }}>
                Drag results achieved AFTER here
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '16px', alignSelf: 'flex-end', marginTop: '10px' }}>
        <button 
          onClick={initWidget}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            borderRadius: '100px',
            background: '#e9ecef',
            color: '#495057',
            fontWeight: 600,
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = '#dee2e6'}
          onMouseOut={(e) => e.currentTarget.style.background = '#e9ecef'}
        >
          <RefreshCw size={18} />
          Retry
        </button>

        <button 
          onClick={handleCheck}
          disabled={pool.length > 0 || (checked && isCorrect)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 32px',
            borderRadius: '100px',
            background: pool.length > 0 ? '#ced4da' : 'var(--brand-color)',
            color: 'white',
            fontWeight: 700,
            cursor: pool.length > 0 ? 'not-allowed' : 'pointer',
            boxShadow: pool.length > 0 ? 'none' : '0 4px 12px rgba(18, 184, 134, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            if (pool.length === 0 && !(checked && isCorrect)) {
              e.currentTarget.style.background = 'var(--brand-hover)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseOut={(e) => {
            if (pool.length === 0 && !(checked && isCorrect)) {
              e.currentTarget.style.background = 'var(--brand-color)';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          Check Answer
        </button>
      </div>

      {/* Educational Explanation Sheet */}
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
                  {isCorrect ? 'Excellent! You sorted perfectly. 🎉 (+5 Stars, +2 Zaps)' : 'Incorrect! Please check the red marked conditions.'}
                </h4>
                
                <p style={{ color: '#495057', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {isCorrect ? (
                    <>
                      <strong>Pre-conditions</strong> are mandatory states that must exist <strong>before</strong> the user performs the login (e.g., User is on the correct login page and the account is already created/activated). <br/>
                      <strong>Post-conditions</strong> are guaranteed results the system must achieve <strong>after</strong> the flow finishes successfully (e.g., The system records the Online status and the working Session is initialized).
                    </>
                  ) : (
                    'Hint: Ask yourself: "Does this condition have to exist beforehand, or does it only appear after the user logs in successfully?". Try moving the incorrect conditions and click Check Answer again!'
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

export default DragDropWidget;
