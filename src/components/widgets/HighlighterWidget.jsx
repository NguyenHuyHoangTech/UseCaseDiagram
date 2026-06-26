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
    { id: 'actor', label: 'Actor', color: '#3b82f6', bg: '#eff6ff', border: 'rgba(59, 130, 246, 0.4)', icon: <User size={18} /> },
    { id: 'usecase', label: 'Use Case', color: '#22c55e', bg: '#f0fdf4', border: 'rgba(34, 197, 94, 0.4)', icon: <Settings size={18} /> },
    { id: 'noise', label: 'Lọc Nhiễu', color: '#f97316', bg: '#fff7ed', border: 'rgba(249, 115, 22, 0.4)', icon: <EyeOff size={18} /> }
  ];

  const getHighlightStyle = (type, isInteractable) => {
    switch (type) {
      case 'actor':
        return { 
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(59, 130, 246, 0.06) 100%)', 
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderBottom: '3px solid #3b82f6', 
          borderRadius: '8px', 
          cursor: 'pointer',
          padding: '4px 10px',
          margin: '0 4px',
          color: '#1d4ed8',
          fontWeight: 700,
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.08)'
        };
      case 'usecase':
        return { 
          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.12) 0%, rgba(34, 197, 94, 0.06) 100%)', 
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderBottom: '3px solid #22c55e', 
          borderRadius: '8px', 
          cursor: 'pointer',
          padding: '4px 10px',
          margin: '0 4px',
          color: '#15803d',
          fontWeight: 700,
          boxShadow: '0 4px 12px rgba(34, 197, 94, 0.08)'
        };
      case 'noise':
        return { 
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.12) 0%, rgba(249, 115, 22, 0.06) 100%)', 
          border: '1px solid rgba(249, 115, 22, 0.3)',
          borderBottom: '3px solid #f97316', 
          borderRadius: '8px', 
          cursor: 'pointer',
          padding: '4px 10px',
          margin: '0 4px',
          color: '#c2410c',
          fontWeight: 700,
          boxShadow: '0 4px 12px rgba(249, 115, 22, 0.08)'
        };
      default:
        return isInteractable ? {
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
          borderBottom: '3px dashed #cbd5e1',
          borderRadius: '8px',
          cursor: 'pointer',
          padding: '4px 10px',
          margin: '0 4px',
          color: '#1e293b',
          boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
        } : {
          cursor: 'default',
          padding: '4px 0',
          color: '#64748b',
          fontWeight: 500
        };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
      
      {/* Interactive Toolbar Brush Selectors */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>🖌️</span> Chọn cọ tô màu phân tích:
        </span>
        
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {modes.map(mode => {
            const isActive = currentMode === mode.id;
            const activeBg = mode.id === 'actor' ? '#eff6ff' : mode.id === 'usecase' ? '#f0fdf4' : '#fff7ed';
            const activeColor = mode.id === 'actor' ? '#3b82f6' : mode.id === 'usecase' ? '#22c55e' : '#f97316';
            return (
              <button
                key={mode.id}
                onClick={() => setCurrentMode(mode.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '14px 24px',
                  borderRadius: '16px',
                  border: isActive ? `2px solid ${activeColor}` : '2px solid #e2e8f0',
                  background: isActive ? activeBg : 'white',
                  color: isActive ? activeColor : '#475569',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  boxShadow: isActive ? `0 10px 25px ${activeColor}20, 0 2px 5px ${activeColor}10` : '0 2px 4px rgba(0,0,0,0.02)',
                  transform: isActive ? 'scale(1.03) translateY(-1px)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = activeColor;
                    e.currentTarget.style.color = activeColor;
                    e.currentTarget.style.background = activeBg + '40';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.background = 'white';
                  }
                }}
              >
                {React.cloneElement(mode.icon, { style: { color: isActive ? activeColor : '#94a3b8', transition: 'color 0.2s' } })}
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>
 
      {/* Main Text Selection Canvas */}
      <div style={{
        padding: '40px',
        borderRadius: '24px',
        background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0',
        boxShadow: '0 20px 40px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,0.8)',
        lineHeight: 2.8,
        fontSize: '1.25rem',
        color: '#334155',
        userSelect: 'none',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative subtle top gradient bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #3b82f6 0%, #22c55e 50%, #f97316 100%)',
          opacity: 0.8
        }} />

        {lesson.segments.map((segment, idx) => {
          const highlightType = highlights[idx];
          const isInteractable = !!segment.type;
          
          // Determine hover border color based on currently selected brush mode
          const hoverBorderColor = currentMode === 'actor' ? '#3b82f6' : currentMode === 'usecase' ? '#22c55e' : '#f97316';

          return (
            <motion.span
              key={idx}
              onClick={() => handleSegmentClick(idx, segment)}
              whileHover={isInteractable ? { 
                scale: 1.06, 
                y: -2,
                background: '#ffffff', 
                borderColor: hoverBorderColor,
                borderBottom: `3px solid ${hoverBorderColor}`,
                boxShadow: `0 6px 15px ${hoverBorderColor}18`
              } : {}}
              whileTap={isInteractable ? { scale: 0.96 } : {}}
              style={{
                display: 'inline-block',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                ...getHighlightStyle(highlightType, isInteractable)
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
            Làm lại
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
            Kiểm tra kết quả
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
                    ? 'Xuất sắc! Bạn đã trích xuất từ khóa cực kỳ chính xác! 🌟 (+5 Stars, +2 Zaps)' 
                    : 'Phân tích chưa hoàn toàn chính xác rồi!'}
                </h4>
                
                <p style={{ color: '#495057', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {isCorrect ? (
                    <>
                      Bạn đã gạch chân đúng các yếu tố cốt lõi:
                      <ul style={{ paddingLeft: '20px', margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <li>• <strong>Actor:</strong> <code>Kế toán trưởng</code> - Ai dùng?</li>
                        <li>• <strong>Use Case:</strong> <code>xuất báo cáo tài chính</code> - Làm gì?</li>
                        <li>• <strong>Lọc Nhiễu:</strong> Các thông tin như <code>bằng tài khoản công ty</code> (bảo mật), <code>dưới dạng file PDF</code> (định dạng đầu ra), <code>Arial font</code> (giao diện), và <code>Oracle database</code> (công nghệ) - Chi tiết công việc cần bỏ qua.</li>
                      </ul>
                      <strong>Bài học rút ra:</strong> Biểu đồ Use Case chỉ mô tả <strong>Hệ thống làm ĐƯỢC gì (What)</strong> từ góc nhìn nghiệp vụ của người dùng. Hãy lọc bỏ hoàn toàn các chi tiết công việc cụ thể vì chúng thuộc về khâu lập trình (How)!
                    </>
                  ) : (
                    'Gợi ý: Hãy xem lại các vùng màu cam (Lọc Nhiễu). Nhớ rằng font chữ (Arial), định dạng file (PDF), loại database (Oracle) hay phương thức đăng nhập đều là chi tiết công việc lập trình (How) chứ không phải chức năng nghiệp vụ (What). Hãy tô màu lại và kiểm tra!'
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
