import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const blanksData = [
  { id: 'b1', label: 'Điểm mở rộng (Extension Point)', correctAnswer: 'c1' },
  { id: 'b2', label: 'Luồng ngoại lệ (Exception Flow)', correctAnswer: 'c2' }
];

const choicesData = [
  { id: 'c1', text: 'Tại Bước 2, nếu hệ thống phát hiện thẻ đang bị đánh dấu mượn quá hạn ➔ Kích hoạt Use Case Nộp Phạt.' },
  { id: 'c2', text: 'Tại Bước 1, nếu thẻ bị khóa hoặc hết hạn ➔ Thông báo từ chối mượn sách và kết thúc Use Case.' },
  { id: 'c3', text: 'Tại Bước 1, nếu thủ thư đi vắng ➔ Khách hàng tự lấy sách đi về.' } // trap
];

const Step4MadLibs = ({ onComplete }) => {
  const [answers, setAnswers] = useState({ b1: null, b2: null });
  const [feedback, setFeedback] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDragStart = (e, choice) => {
    e.dataTransfer.setData('choice', JSON.stringify(choice));
  };

  const handleDrop = (e, blankId) => {
    e.preventDefault();
    const choiceStr = e.dataTransfer.getData('choice');
    if (!choiceStr) return;
    const choice = JSON.parse(choiceStr);

    setAnswers(prev => ({ ...prev, [blankId]: choice }));
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleCheck = () => {
    if (!answers.b1 || !answers.b2) {
      showFeedback('error', 'Bạn phải điền đầy đủ cả 2 chỗ trống.');
      return;
    }
    
    if (answers.b1.id !== blanksData[0].correctAnswer || answers.b2.id !== blanksData[1].correctAnswer) {
      showFeedback('error', 'Ghép chưa đúng! Hãy nhớ lại: Ngoại lệ (Exception) sẽ làm Use Case thất bại/kết thúc. Còn Điểm mở rộng (Extension Point) là điểm bẻ lái sang một Use Case khác (như Nộp phạt).');
      return;
    }

    showFeedback('success', 'Chính xác hoàn toàn!');
    setSuccess(true);
    confetti({ particleCount: 150, spread: 180, origin: { y: 0.6 } });
  };

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 5000);
  };

  const isUsed = (choiceId) => Object.values(answers).some(ans => ans && ans.id === choiceId);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--brand-color)' }}>
        18.4 Viết Đặc tả - Bẫy Ngoại lệ (Specification)
      </h3>
      <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
        Kéo các khối kịch bản bên dưới thả vào khoảng trống để hoàn thiện Đặc tả Use Case "Mượn sách".
      </p>

      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', background: feedback.type === 'error' ? '#ffe3e3' : '#d3f9d8', color: feedback.type === 'error' ? '#e03131' : '#2b8a3e', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
            {feedback.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />} {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid #dee2e6', marginBottom: '24px' }}>
        <h4 style={{ borderBottom: '2px solid #f1f3f5', paddingBottom: '12px', marginBottom: '20px' }}>Đặc tả Use Case: Mượn sách</h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.95rem' }}>
          <div><strong>Actor:</strong> Bạn đọc</div>
          <div><strong>Tiền điều kiện:</strong> Bạn đọc đã đăng nhập hệ thống.</div>
          <div>
            <strong>Luồng cơ bản (Basic Flow):</strong>
            <ol style={{ paddingLeft: '20px', marginTop: '8px' }}>
              <li>Hệ thống ngầm tự động <em>&lt;&lt;include&gt;&gt;</em> Kiểm tra tình trạng thẻ.</li>
              <li>Bạn đọc chọn sách muốn mượn.</li>
              <li>Hệ thống ghi nhận giao dịch mượn sách.</li>
            </ol>
          </div>

          {blanksData.map(blank => (
            <div key={blank.id} style={{ marginTop: '10px' }}>
              <div style={{ fontWeight: 600, color: '#495057', marginBottom: '8px' }}>{blank.label}</div>
              <div 
                onDrop={(e) => handleDrop(e, blank.id)} 
                onDragOver={handleDragOver}
                style={{ 
                  background: answers[blank.id] ? '#e7f5ff' : '#f8f9fa', 
                  border: answers[blank.id] ? '2px solid #339af0' : '2px dashed #adb5bd', 
                  minHeight: '48px', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '12px 16px',
                  color: answers[blank.id] ? '#1864ab' : '#adb5bd',
                  fontWeight: answers[blank.id] ? 500 : 400
                }}
              >
                {answers[blank.id] ? answers[blank.id].text : 'Kéo thả kịch bản vào đây...'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
        {choicesData.map(choice => (
          <motion.div
            key={choice.id}
            draggable={!isUsed(choice.id)}
            onDragStart={(e) => handleDragStart(e, choice)}
            style={{
              padding: '16px 20px',
              background: '#fff',
              border: '2px solid #ced4da',
              borderRadius: '8px',
              cursor: isUsed(choice.id) ? 'default' : 'grab',
              fontWeight: 500,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              opacity: isUsed(choice.id) ? 0.3 : 1
            }}
          >
            {choice.text}
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
        {!success ? (
          <button onClick={handleCheck} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--text-main)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Ký duyệt Đặc tả
          </button>
        ) : (
          <button onClick={onComplete} style={{ padding: '12px 32px', borderRadius: '100px', background: '#12b886', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Xuất sắc! Xem thành quả <ArrowRight size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Step4MadLibs;
