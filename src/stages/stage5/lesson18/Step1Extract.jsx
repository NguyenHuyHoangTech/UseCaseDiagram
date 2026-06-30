import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, Hexagon, Trash2, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

const tokensData = [
  { id: 'a1', text: 'Sinh viên', type: 'actor' },
  { id: 'a2', text: 'Giảng viên', type: 'actor' },
  { id: 'u1', text: 'Đăng nhập', type: 'usecase' },
  { id: 'u2', text: 'Tìm kiếm sách', type: 'usecase' },
  { id: 'u3', text: 'Mượn sách', type: 'usecase' },
  { id: 't1', text: 'mượn quá hạn', type: 'trap', msg: '"Mượn quá hạn" là một điều kiện/trạng thái, không phải là chức năng. Chức năng thực sự ở đây là "Nộp phạt trễ hạn".' },
  { id: 'u4', text: 'Nộp phạt trễ hạn', type: 'usecase' },
  { id: 'a3', text: 'Thủ thư', type: 'actor' },
  { id: 'u5', text: 'Thêm sách mới', type: 'usecase' },
  { id: 't2', text: 'tự động ngầm', type: 'trap', msg: '"Tự động ngầm" chỉ tính chất của hệ thống, không phải Actor hay Use Case.' },
  { id: 'u6', text: 'Kiểm tra tình trạng thẻ', type: 'usecase' },
];

const Step1Extract = ({ onComplete }) => {
  const [placedTokens, setPlacedTokens] = useState({ actor: [], usecase: [], trash: [] });
  const [feedback, setFeedback] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDragStart = (e, token) => {
    e.dataTransfer.setData('token', JSON.stringify(token));
  };

  const handleDrop = (e, bucketType) => {
    e.preventDefault();
    const tokenStr = e.dataTransfer.getData('token');
    if (!tokenStr) return;
    const token = JSON.parse(tokenStr);

    setPlacedTokens(prev => {
      // Remove from all buckets first
      const newPlaced = {
        actor: prev.actor.filter(t => t.id !== token.id),
        usecase: prev.usecase.filter(t => t.id !== token.id),
        trash: prev.trash.filter(t => t.id !== token.id)
      };
      // Add to new bucket
      newPlaced[bucketType].push(token);
      return newPlaced;
    });
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleDropToText = (e) => {
    e.preventDefault();
    const tokenStr = e.dataTransfer.getData('token');
    if (!tokenStr) return;
    const token = JSON.parse(tokenStr);

    setPlacedTokens(prev => {
      return {
        actor: prev.actor.filter(t => t.id !== token.id),
        usecase: prev.usecase.filter(t => t.id !== token.id),
        trash: prev.trash.filter(t => t.id !== token.id)
      };
    });
  };

  const handleCheck = () => {
    // Check for specific traps
    const trapInUseCase = placedTokens.usecase.find(t => t.type === 'trap');
    if (trapInUseCase) {
      showFeedback('error', trapInUseCase.msg);
      return;
    }

    let allCorrect = true;
    for (const token of placedTokens.actor) {
      if (token.type !== 'actor') allCorrect = false;
    }
    for (const token of placedTokens.usecase) {
      if (token.type !== 'usecase') allCorrect = false;
    }
    for (const token of placedTokens.trash) {
      if (token.type !== 'trap') allCorrect = false;
    }

    if (!allCorrect) {
      showFeedback('error', 'Có một số thẻ chưa được đặt đúng giỏ! Hãy kiểm tra lại.');
    } else {
      showFeedback('success', 'Xuất sắc! Bạn đã lọc chính xác toàn bộ yêu cầu.');
      setSuccess(true);
    }
  };

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 5000);
  };

  const isPlaced = (tokenId) => {
    return placedTokens.actor.find(t => t.id === tokenId) || 
           placedTokens.usecase.find(t => t.id === tokenId) ||
           placedTokens.trash.find(t => t.id === tokenId);
  };

  const allPlaced = placedTokens.actor.length + placedTokens.usecase.length + placedTokens.trash.length === tokensData.length;

  const renderToken = (tokenObj) => {
    if (isPlaced(tokenObj.id)) {
      return <span key={tokenObj.id} style={{ opacity: 0.3, textDecoration: 'line-through' }}>{tokenObj.text}</span>;
    }
    return (
      <span
        key={tokenObj.id} draggable onDragStart={(e) => handleDragStart(e, tokenObj)}
        style={{ display: 'inline-block', background: 'var(--locked-bg)', color: 'var(--text-main)', padding: '2px 8px', borderRadius: '6px', fontWeight: 600, cursor: 'grab', border: '1px solid #ced4da', margin: '0 4px' }}
      >
        {tokenObj.text}
      </span>
    );
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--brand-color)' }}>
        18.1 Thử thách Bóc tách Yêu cầu
      </h3>
      <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
        Kéo thẻ vào 3 giỏ. Sau khi kéo hết, hãy bấm "Kiểm tra phân loại".
      </p>
      
      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', background: feedback.type === 'error' ? '#ffe3e3' : '#d3f9d8', color: feedback.type === 'error' ? '#e03131' : '#2b8a3e', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
            {feedback.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />} {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', gap: '24px', flexDirection: 'row', flexWrap: 'wrap' }}>
        <div onDrop={handleDropToText} onDragOver={handleDragOver} style={{ flex: '1 1 300px', background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #e9ecef', lineHeight: '2' }}>
          Thư viện trường học phục vụ hai đối tượng chính là {renderToken(tokensData[0])} và {renderToken(tokensData[1])}. Để sử dụng dịch vụ, họ đều phải {renderToken(tokensData[2])} vào hệ thống. Sau đó, họ có thể {renderToken(tokensData[3])} và {renderToken(tokensData[4])}. Tuy nhiên, nếu trước đó họ {renderToken(tokensData[5])}, hệ thống yêu cầu họ phải {renderToken(tokensData[6])} ngay lúc thực hiện giao dịch mới. Ngoài ra, chỉ có nhân viên {renderToken(tokensData[7])} mới có quyền {renderToken(tokensData[8])} vào kho. Mọi giao dịch mượn sách đều yêu cầu hệ thống {renderToken(tokensData[9])} {renderToken(tokensData[10])}.
        </div>

        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Actor */}
          <div onDrop={(e) => handleDrop(e, 'actor')} onDragOver={handleDragOver} style={{ flex: 1, background: '#e7f5ff', border: '2px dashed #339af0', borderRadius: '16px', padding: '16px' }}>
            <h4 style={{ color: '#1864ab', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><UserCircle size={20} /> Giỏ Actor</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {placedTokens.actor.map(t => <div key={t.id} draggable onDragStart={(e) => handleDragStart(e, t)} style={{ background: '#339af0', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '0.85rem', cursor: 'grab' }}>{t.text}</div>)}
            </div>
          </div>
          {/* Use Case */}
          <div onDrop={(e) => handleDrop(e, 'usecase')} onDragOver={handleDragOver} style={{ flex: 1, background: '#fff3bf', border: '2px dashed #fcc419', borderRadius: '16px', padding: '16px' }}>
            <h4 style={{ color: '#e67700', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><Hexagon size={20} /> Giỏ Use Case</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {placedTokens.usecase.map(t => <div key={t.id} draggable onDragStart={(e) => handleDragStart(e, t)} style={{ background: '#fcc419', color: '#495057', padding: '4px 12px', borderRadius: '100px', fontSize: '0.85rem', cursor: 'grab' }}>{t.text}</div>)}
            </div>
          </div>
          {/* Trash */}
          <div onDrop={(e) => handleDrop(e, 'trash')} onDragOver={handleDragOver} style={{ flex: 1, background: '#f8f9fa', border: '2px dashed #adb5bd', borderRadius: '16px', padding: '16px' }}>
            <h4 style={{ color: '#495057', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><Trash2 size={20} /> Giỏ Thùng rác</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {placedTokens.trash.map(t => <div key={t.id} draggable onDragStart={(e) => handleDragStart(e, t)} style={{ background: '#adb5bd', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '0.85rem', cursor: 'grab' }}>{t.text}</div>)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
        {!success ? (
          <button onClick={handleCheck} disabled={!allPlaced} style={{ padding: '12px 32px', borderRadius: '100px', background: allPlaced ? 'var(--text-main)' : '#dee2e6', color: 'white', fontWeight: 600, border: 'none', cursor: allPlaced ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
            Kiểm tra phân loại
          </button>
        ) : (
          <button onClick={onComplete} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--brand-color)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Hoàn hảo! Tiếp tục <ArrowRight size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Step1Extract;
