import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

const tokensData = [
  { id: 'u1', text: 'Quẹt thẻ ra vào', target: 'pkg1' },
  { id: 'u2', text: 'Quét biển số', target: 'pkg1' },
  { id: 'u3', text: 'Tính phí gửi xe', target: 'pkg2', trapPkg: 'pkg1', trapMsg: 'Sai ranh giới nghiệp vụ: Chức năng "Tính phí gửi xe" liên quan đến dòng tiền, nó phải nằm ở [Quản lý Tài chính]. Cổng ra vào chỉ quan tâm đến việc mở barrier, việc tính tiền hãy giao cho kế toán lo!' },
  { id: 'u4', text: 'Thanh toán QR Code', target: 'pkg2', trapPkg: 'pkg1', trapMsg: 'Thanh toán QR cũng liên quan đến dòng tiền, nó không thuộc quyền quản lý của barrier cổng!' },
  { id: 'u5', text: 'Xem báo cáo doanh thu', target: 'pkg2' },
  { id: 'u6', text: 'Thêm thẻ cư dân mới', target: 'pkg3' },
];

const packages = [
  { id: 'pkg1', name: 'Kiểm soát Ra/Vào', color: '#e7f5ff', border: '#339af0' },
  { id: 'pkg2', name: 'Quản lý Tài chính', color: '#fff3bf', border: '#fcc419' },
  { id: 'pkg3', name: 'Quản lý Cư dân', color: '#f4fce3', border: '#94d82d' }
];

const Step1Packages = ({ onComplete }) => {
  const [placedTokens, setPlacedTokens] = useState({ pkg1: [], pkg2: [], pkg3: [] });
  const [feedback, setFeedback] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleDragStart = (e, token) => {
    e.dataTransfer.setData('token', JSON.stringify(token));
  };

  const handleDrop = (e, pkgId) => {
    e.preventDefault();
    const tokenStr = e.dataTransfer.getData('token');
    if (!tokenStr) return;
    const token = JSON.parse(tokenStr);

    if (token.trapPkg === pkgId) {
      showFeedback('error', token.trapMsg);
      return;
    }

    if (token.target !== pkgId) {
      showFeedback('error', `Chức năng "${token.text}" không thuộc phân hệ này!`);
      return;
    }

    setPlacedTokens(prev => {
      const newPlaced = {
        pkg1: prev.pkg1.filter(t => t.id !== token.id),
        pkg2: prev.pkg2.filter(t => t.id !== token.id),
        pkg3: prev.pkg3.filter(t => t.id !== token.id)
      };
      newPlaced[pkgId].push(token);
      return newPlaced;
    });
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleCheck = () => {
    let placedCount = placedTokens.pkg1.length + placedTokens.pkg2.length + placedTokens.pkg3.length;
    if (placedCount < tokensData.length) {
      showFeedback('error', 'Vui lòng phân loại tất cả các chức năng vào các Phân hệ.');
      return;
    }

    showFeedback('success', 'Tuyệt vời! Bạn đã chia để trị thành công.');
    setSuccess(true);
  };

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 6000);
  };

  const isPlaced = (tokenId) => {
    return placedTokens.pkg1.find(t => t.id === tokenId) || 
           placedTokens.pkg2.find(t => t.id === tokenId) ||
           placedTokens.pkg3.find(t => t.id === tokenId);
  };

  const allPlaced = placedTokens.pkg1.length + placedTokens.pkg2.length + placedTokens.pkg3.length === tokensData.length;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--brand-color)' }}>
        19.1 Kỹ năng "Chia để trị" (Package Diagram)
      </h3>
      <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
        Tòa nhà cần một hệ thống quản lý bãi xe phức tạp. Hãy giúp tôi nhóm các chức năng phân tán bên dưới vào đúng 3 Phân hệ (Package) lõi. Coi chừng nhầm lẫn ranh giới nghiệp vụ!
      </p>
      
      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', background: feedback.type === 'error' ? '#ffe3e3' : '#d3f9d8', color: feedback.type === 'error' ? '#e03131' : '#2b8a3e', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
            {feedback.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />} {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {packages.map(pkg => (
          <div 
            key={pkg.id}
            onDrop={(e) => handleDrop(e, pkg.id)} 
            onDragOver={handleDragOver} 
            style={{ flex: '1 1 200px', background: pkg.color, border: `2px dashed ${pkg.border}`, borderRadius: '16px', padding: '16px', minHeight: '150px' }}
          >
            <h4 style={{ color: '#495057', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Package size={20} /> {pkg.name}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {placedTokens[pkg.id].map(t => (
                <div key={t.id} style={{ background: 'white', color: '#495057', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, border: '1px solid #ced4da', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  {t.text}
                </div>
              ))}
              {placedTokens[pkg.id].length === 0 && <span style={{ color: '#868e96', fontStyle: 'italic', fontSize: '0.85rem' }}>Thả vào đây...</span>}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: 'white', padding: '24px', borderRadius: '16px', border: '1px solid #dee2e6' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {tokensData.map(token => {
            if (isPlaced(token.id)) return null;
            return (
              <motion.div
                key={token.id} draggable onDragStart={(e) => handleDragStart(e, token)}
                style={{ background: '#f8f9fa', color: '#1d2026', padding: '8px 16px', borderRadius: '100px', fontWeight: 600, cursor: 'grab', border: '2px solid #adb5bd' }}
              >
                {token.text}
              </motion.div>
            )
          })}
          {allPlaced && <span style={{ color: '#868e96', fontStyle: 'italic', padding: '8px' }}>Kho rỗng</span>}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
        {!success ? (
          <button onClick={handleCheck} disabled={!allPlaced} style={{ padding: '12px 32px', borderRadius: '100px', background: allPlaced ? 'var(--text-main)' : '#dee2e6', color: 'white', fontWeight: 600, border: 'none', cursor: allPlaced ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
            Phân rã Hệ thống
          </button>
        ) : (
          <button onClick={onComplete} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--brand-color)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Zoom vào Phân hệ Ra/Vào <ArrowRight size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Step1Packages;
