import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

const MultipleChoiceWidget = ({ lesson, onSolved }) => {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);

  useEffect(() => {
    setSelectedIdx(null);
    setChecked(false);
    setIsCorrect(false);
  }, [lesson]);

  const handleOptionSelect = (idx) => {
    if (checked && isCorrect) return;
    setSelectedIdx(idx);
    setChecked(false);
  };

  const handleCheck = () => {
    if (selectedIdx === null) return;

    const correct = lesson.options[selectedIdx].correct;
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

  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
      {/* Question Header */}
      <div style={{
        background: '#f8f9fa',
        padding: '24px',
        borderRadius: '20px',
        border: '1px solid #e9ecef'
      }}>
        <h3 style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--text-main)',
          lineHeight: 1.5,
          display: 'flex',
          gap: '12px'
        }}>
          <HelpCircle size={24} color="var(--brand-color)" style={{ flexShrink: 0, marginTop: '2px' }} />
          {lesson.question}
        </h3>
      </div>

      {/* Options List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {lesson.options.map((option, idx) => {
          const isSelected = selectedIdx === idx;
          const isSelectedAndWrong = checked && isSelected && !option.correct;
          const isCorrectAnswer = checked && option.correct;
          const isUnselectedAndMuted = checked && !isSelected && !option.correct;

          let cardBorder = '1px solid #e9ecef';
          let cardBg = 'white';
          let cardShadow = '0 4px 12px rgba(0,0,0,0.02)';

          if (isSelected) {
            cardBorder = '1px solid var(--brand-color)';
            cardShadow = '0 0 0 3px rgba(18, 184, 134, 0.15), 0 8px 16px rgba(0,0,0,0.05)';
          }

          if (isCorrectAnswer) {
            cardBorder = '2px solid #40c057';
            cardBg = '#f0fdf4';
            cardShadow = '0 4px 12px rgba(64, 192, 87, 0.1)';
          } else if (isSelectedAndWrong) {
            cardBorder = '2px solid #fa5252';
            cardBg = '#fff5f5';
            cardShadow = '0 4px 12px rgba(250, 82, 82, 0.1)';
          } else if (isUnselectedAndMuted) {
            cardBg = '#f8f9fa';
            cardBorder = '1px solid #e9ecef';
            cardShadow = 'none';
          }

          return (
            <motion.div
              key={idx}
              onClick={() => handleOptionSelect(idx)}
              whileHover={!(checked && isCorrect) ? { scale: 1.01, y: -1 } : {}}
              whileTap={!(checked && isCorrect) ? { scale: 0.99 } : {}}
              animate={isSelectedAndWrong && shakeTrigger ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '18px 24px',
                background: cardBg,
                border: cardBorder,
                borderRadius: '16px',
                boxShadow: cardShadow,
                cursor: checked && isCorrect ? 'default' : 'pointer',
                transition: 'all 0.2s ease',
                opacity: isUnselectedAndMuted ? 0.65 : 1
              }}
            >
              {/* Option Letter Badge */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: isCorrectAnswer
                  ? '#40c057'
                  : isSelectedAndWrong
                    ? '#fa5252'
                    : isSelected
                      ? 'var(--brand-color)'
                      : '#f1f3f5',
                color: isSelected || isCorrectAnswer || isSelectedAndWrong ? 'white' : '#495057',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontWeight: 700,
                fontSize: '0.95rem',
                marginRight: '20px',
                flexShrink: 0
              }}>
                {letters[idx]}
              </div>

              {/* Option Text */}
              <p style={{
                flex: 1,
                fontSize: '0.98rem',
                fontWeight: 600,
                color: isSelectedAndWrong
                  ? '#c92a2a'
                  : isCorrectAnswer
                    ? '#2b8a3e'
                    : 'var(--text-main)',
                lineHeight: 1.5
              }}>
                {option.text}
              </p>

              {/* Selector Circle */}
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                border: isSelected || isCorrectAnswer || isSelectedAndWrong
                  ? 'none'
                  : '2px solid #ced4da',
                background: isCorrectAnswer
                  ? '#40c057'
                  : isSelectedAndWrong
                    ? '#fa5252'
                    : isSelected
                      ? 'var(--brand-color)'
                      : 'transparent',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexShrink: 0
              }}>
                {(isSelected || isCorrectAnswer || isSelectedAndWrong) && (
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white' }} />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Action Buttons */}
      {selectedIdx !== null && !(checked && isCorrect) && (
        <button
          onClick={handleCheck}
          style={{
            alignSelf: 'flex-end',
            padding: '14px 40px',
            borderRadius: '100px',
            background: 'var(--brand-color)',
            color: 'white',
            fontWeight: 700,
            fontSize: '1rem',
            boxShadow: '0 4px 14px rgba(18, 184, 134, 0.3)',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'var(--brand-hover)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'var(--brand-color)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Gửi câu trả lời
        </button>
      )}

      {/* Explanation Card */}
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
                  {isCorrect ? 'Tuyệt vời! Câu trả lời hoàn toàn chính xác. 💡 (+5 Stars, +2 Zaps)' : 'Rất tiếc, câu trả lời chưa đúng rồi!'}
                </h4>

                <p style={{ color: '#495057', fontSize: '0.95rem', lineHeight: 1.6 }}>
                  {isCorrect ? (
                    <>
                      Nếu người dùng nhập sai mã OTP vượt quá số lần tối đa (3 lần), giao dịch <strong>bị hủy hoàn toàn</strong> và tài khoản/tính năng nhận OTP bị khóa tạm thời. Đây là kịch bản của một <strong>Luồng ngoại lệ (Exception Flow)</strong> vì nó <strong>không đạt được mục tiêu chính</strong> của Use Case (Thanh toán hóa đơn thất bại). <br /><br />
                      <strong>Phân biệt nhanh:</strong>
                      <ul style={{ paddingLeft: '20px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <li>• <strong>Happy Path:</strong> Thanh toán thành công ngay lần đầu.</li>
                        <li>• <strong>Alternative Flow (Luồng thay thế):</strong> Nhập sai OTP lần 1, nhưng nhập lại đúng ở lần 2 vì thế Vẫn thanh toán thành công (đạt được mục tiêu).</li>
                        <li>• <strong>Exception Flow (Luồng ngoại lệ):</strong> Nhập sai quá 3 lần vì thế Bị khóa, giao dịch bị hủy bỏ hoàn toàn (thất bại mục tiêu).</li>
                      </ul>
                    </>
                  ) : (
                    'Gợi ý: Hãy suy nghĩ xem kết quả của kịch bản này có giúp Actor đạt được mục tiêu "Thanh toán hóa đơn" hay không? Nếu nó làm đứt gãy luồng và hủy giao dịch, nó phải là loại luồng nào? Hãy chọn lại!'
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

export default MultipleChoiceWidget;
