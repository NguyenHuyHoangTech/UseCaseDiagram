import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, CheckCircle, AlertCircle, RefreshCw, GripVertical } from 'lucide-react';

const ReorderWidget = ({ lesson, onSolved }) => {
  const [items, setItems] = useState([]);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Initialize and shuffle the items
  const initWidget = () => {
    // We want to make sure the shuffled order is not already correct
    let shuffled;
    let isAlreadyCorrect = true;
    
    while (isAlreadyCorrect) {
      shuffled = [...lesson.steps].map((text, index) => ({
        originalIndex: index,
        text
      })).sort(() => Math.random() - 0.5);
      
      isAlreadyCorrect = shuffled.every((item, idx) => item.originalIndex === idx);
    }
    
    setItems(shuffled);
    setChecked(false);
    setIsCorrect(false);
  };

  useEffect(() => {
    initWidget();
  }, [lesson]);

  // Swap items at index i and j
  const swapItems = (i, j) => {
    if (checked && isCorrect) return;
    if (i < 0 || i >= items.length || j < 0 || j >= items.length) return;
    
    const newItems = [...items];
    const temp = newItems[i];
    newItems[i] = newItems[j];
    newItems[j] = temp;
    
    setItems(newItems);
    setChecked(false);
  };

  // Drag and drop handlers for list items
  const handleDragStart = (idx) => {
    if (checked && isCorrect) return;
    setDraggedIndex(idx);
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === idx) return;
    
    // Swap on the fly for interactive feel
    const newItems = [...items];
    const draggedItem = newItems[draggedIndex];
    newItems.splice(draggedIndex, 1);
    newItems.splice(idx, 0, draggedItem);
    
    setItems(newItems);
    setDraggedIndex(idx);
    setChecked(false);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Validate current order
  const handleCheck = () => {
    const correct = items.every((item, idx) => item.originalIndex === idx);
    
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
    } else {
      setShakeTrigger(true);
      setTimeout(() => setShakeTrigger(false), 500);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
      {/* Reorder list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
          Sắp xếp thứ tự các bước từ đầu đến cuối:
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {items.map((item, idx) => {
            const isWrong = checked && item.originalIndex !== idx;
            const isRight = checked && item.originalIndex === idx;
            
            return (
              <motion.div
                key={item.text}
                layout
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={handleDragEnd}
                animate={isWrong && shakeTrigger ? { x: [-10, 10, -10, 10, 0] } : {}}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  background: 'white',
                  borderRadius: '16px',
                  border: checked 
                    ? (isWrong ? '2px solid #fa5252' : '2px solid #40c057')
                    : '1px solid #e9ecef',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  cursor: checked && isCorrect ? 'default' : 'grab',
                  userSelect: 'none',
                  position: 'relative'
                }}
              >
                {/* Drag Handle Icon */}
                {!(checked && isCorrect) && (
                  <div style={{ color: '#adb5bd', marginRight: '16px', display: 'flex', alignItems: 'center' }}>
                    <GripVertical size={20} />
                  </div>
                )}

                {/* Step Badge */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: checked 
                    ? (isWrong ? '#fa5252' : '#40c057')
                    : 'var(--brand-color)',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  marginRight: '20px',
                  flexShrink: 0
                }}>
                  {idx + 1}
                </div>

                {/* Content */}
                <p style={{ 
                  flex: 1, 
                  fontSize: '0.95rem', 
                  fontWeight: 600, 
                  color: isWrong ? '#fa5252' : 'var(--text-main)',
                  paddingRight: '20px'
                }}>
                  {/* Remove the original number prefix if it has one (e.g. "1. ") to display cleanly */}
                  {item.text.replace(/^\d+\.\s*/, '')}
                </p>

                {/* Arrow Controls (for Click Reordering) */}
                {!(checked && isCorrect) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button 
                      onClick={() => swapItems(idx, idx - 1)}
                      disabled={idx === 0}
                      style={{
                        padding: '2px',
                        color: idx === 0 ? '#dee2e6' : '#868e96',
                        cursor: idx === 0 ? 'not-allowed' : 'pointer',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => idx !== 0 && (e.currentTarget.style.background = '#f1f3f5')}
                      onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <ChevronUp size={20} />
                    </button>
                    <button 
                      onClick={() => swapItems(idx, idx + 1)}
                      disabled={idx === items.length - 1}
                      style={{
                        padding: '2px',
                        color: idx === items.length - 1 ? '#dee2e6' : '#868e96',
                        cursor: idx === items.length - 1 ? 'not-allowed' : 'pointer',
                        borderRadius: '4px',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => idx !== items.length - 1 && (e.currentTarget.style.background = '#f1f3f5')}
                      onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <ChevronDown size={20} />
                    </button>
                  </div>
                )}
              </motion.div>
            );
          })}
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
          Xáo trộn lại
        </button>

        <button 
          onClick={handleCheck}
          disabled={checked && isCorrect}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 32px',
            borderRadius: '100px',
            background: 'var(--brand-color)',
            color: 'white',
            fontWeight: 700,
            boxShadow: '0 4px 12px rgba(18, 184, 134, 0.3)',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            if (!(checked && isCorrect)) {
              e.currentTarget.style.background = 'var(--brand-hover)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseOut={(e) => {
            if (!(checked && isCorrect)) {
              e.currentTarget.style.background = 'var(--brand-color)';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          Kiểm tra thứ tự
        </button>
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
                  {isCorrect ? 'Xuất sắc! Thứ tự Happy Path chuẩn xác. 🏧 (+5 Stars, +2 Zaps)' : 'Thứ tự chưa đúng rồi! Hãy suy nghĩ về kịch bản hội thoại.'}
                </h4>
                
                <p style={{ color: '#495057', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {isCorrect ? (
                    <>
                      Đây là kịch bản hội thoại chuẩn của <strong>Luồng sự kiện chính (Happy Path)</strong> cho Use Case Rút tiền ATM. <br/>
                      Mỗi bước đều tuân theo nguyên tắc <strong>Tương tác hai chiều (Actor - Hệ thống)</strong>:
                      <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <li>1. Actor bắt đầu hành động gửi thông tin (Nhập thẻ & PIN).</li>
                        <li>2. Hệ thống xử lý, phản hồi kết quả và mở ra danh sách dịch vụ.</li>
                        <li>3. Actor chọn hành động tiếp theo (Rút tiền & Nhập số tiền).</li>
                        <li>4. Hệ thống hoàn tất giao dịch (Trừ tiền, trả thẻ, nhả tiền mặt).</li>
                      </ul>
                    </>
                  ) : (
                    'Gợi ý: Luồng đi luôn tuân theo kịch bản: Actor gửi yêu cầu -> Hệ thống phản hồi -> Actor tương tác tiếp -> Hệ thống hoàn tất giao dịch. Hãy thử hoán đổi vị trí các bước bị sai và kiểm tra lại!'
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

export default ReorderWidget;
