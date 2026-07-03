import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, Hexagon, AlertTriangle, ArrowRight } from 'lucide-react';

const tokensData = [
  { id: 't1', text: 'Khách hàng', type: 'actor' },
  { id: 't2', text: 'máy ATM', type: 'trap', msg: 'Đừng nhầm lẫn! "Máy ATM" là phần cứng chứa hệ thống, không phải chức năng.' },
  { id: 't3', text: 'Rút tiền', type: 'usecase' },
  { id: 't4', text: 'Xem số dư', type: 'usecase' },
  { id: 't5', text: 'Kiểm tra mã PIN', type: 'usecase' },
  { id: 't6', text: 'Ngân hàng Trung tâm', type: 'actor' },
  { id: 't7', text: 'nhả tiền', type: 'trap', msg: 'Đừng nhầm lẫn! "Nhả tiền" là hành động vật lý của phần cứng, không phải Use Case.' },
  { id: 't8', text: 'In biên lai', type: 'usecase' },
];

const CheckCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const Step1Extract = ({ onComplete }) => {
  const [placedTokens, setPlacedTokens] = useState({ actor: [], usecase: [] });
  const [feedback, setFeedback] = useState(null);

  const handleDragStart = (e, token) => { e.dataTransfer.setData('token', JSON.stringify(token)); };
  const handleDrop = (e, bucketType) => {
    e.preventDefault();
    const tokenStr = e.dataTransfer.getData('token');
    if (!tokenStr) return;
    const token = JSON.parse(tokenStr);

    if (token.type === 'trap') {
      showFeedback('error', token.msg);
    } else if (token.type !== bucketType) {
      showFeedback('error', `Sai rồi! "${token.text}" không phải là ${bucketType === 'actor' ? 'Actor' : 'Use Case'}.`);
    } else {
      showFeedback('success', `Chính xác! "${token.text}" là ${bucketType === 'actor' ? 'Actor' : 'Use Case'}.`);
      setPlacedTokens(prev => {
        if (prev[bucketType].find(t => t.id === token.id)) return prev;
        return { ...prev, [bucketType]: [...prev[bucketType], token] };
      });
    }
  };

  const handleDragOver = (e) => e.preventDefault();
  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 4000);
  };
  const isPlaced = (tokenId) => placedTokens.actor.find(t => t.id === tokenId) || placedTokens.usecase.find(t => t.id === tokenId);
  const isComplete = placedTokens.actor.length === 2 && placedTokens.usecase.length === 4; // Intentionally leaving "In biên lai" for twist? Actually there are 4 usecases: Rút tiền, Xem số dư, Kiểm tra mã PIN, In biên lai.

  const renderToken = (tokenObj) => {
    if (isPlaced(tokenObj.id)) {
      return <span key={tokenObj.id} style={{ opacity: 0.3, textDecoration: 'line-through' }}>{tokenObj.text}</span>;
    }
    return (
      <span key={tokenObj.id} draggable onDragStart={(e) => handleDragStart(e, tokenObj)}
        style={{ display: 'inline-block', background: 'var(--locked-bg)', color: 'var(--text-main)', padding: '2px 8px', borderRadius: '6px', fontWeight: 600, cursor: 'grab', border: '1px solid #ced4da', margin: '0 4px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
        {tokenObj.text}
      </span>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--brand-color)' }}>17.1 Phân tích Yêu cầu: Trích xuất Actor & Use Case</h3>
      <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>Phân tích đoạn mô tả hệ thống bên dưới. Kéo thả các từ khóa được tô xám vào đúng phân loại: Actor (Tác nhân) hoặc Use Case (Ca sử dụng). Hãy cẩn thận với các từ gây nhiễu!</p>
      
      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', background: feedback.type === 'error' ? '#ffe3e3' : '#d3f9d8', color: feedback.type === 'error' ? '#e03131' : '#2b8a3e', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            {feedback.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircleIcon />} {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', gap: '24px', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e9ecef', lineHeight: '2' }}>
          {renderToken(tokensData[0])} đút thẻ vào {renderToken(tokensData[1])} để {renderToken(tokensData[2])} hoặc {renderToken(tokensData[3])}. Mọi giao dịch đều yêu cầu hệ thống phải {renderToken(tokensData[4])} thông qua {renderToken(tokensData[5])}. Nếu thành công, máy sẽ {renderToken(tokensData[6])}. Khách hàng có thể chọn {renderToken(tokensData[7])} hoặc không.
        </div>

        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div onDrop={(e) => handleDrop(e, 'actor')} onDragOver={handleDragOver} style={{ flex: 1, background: '#e7f5ff', border: '2px dashed #339af0', borderRadius: '16px', padding: '20px', minHeight: '120px', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ color: '#1864ab', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><UserCircle size={20} /> Giỏ Actor</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <AnimatePresence>
                {placedTokens.actor.map(t => (
                  <motion.div key={t.id} initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ background: '#339af0', color: 'white', padding: '6px 12px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 600 }}>{t.text}</motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          <div onDrop={(e) => handleDrop(e, 'usecase')} onDragOver={handleDragOver} style={{ flex: 1, background: '#fff3bf', border: '2px dashed #fcc419', borderRadius: '16px', padding: '20px', minHeight: '120px', display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ color: '#e67700', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><Hexagon size={20} /> Giỏ Use Case</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <AnimatePresence>
                {placedTokens.usecase.map(t => (
                  <motion.div key={t.id} initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ background: '#fcc419', color: '#495057', padding: '6px 12px', borderRadius: '100px', fontSize: '0.9rem', fontWeight: 600 }}>{t.text}</motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {isComplete && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
          <button onClick={onComplete} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--brand-color)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(18, 184, 134, 0.3)', cursor: 'pointer', border: 'none', fontSize: '1rem' }}>
            Tiếp tục: Xác định Ranh giới Hệ thống <ArrowRight size={20} />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Step1Extract;
