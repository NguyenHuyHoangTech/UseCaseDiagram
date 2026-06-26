import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, ArrowRight, User, RotateCcw } from 'lucide-react';

const initialItems = [
  { id: 'u1', text: 'Rút tiền', type: 'usecase' },
  { id: 'u2', text: 'Xem số dư', type: 'usecase' },
  { id: 'u3', text: 'Kiểm tra mã PIN', type: 'usecase' },
  { id: 'u4', text: 'In biên lai', type: 'usecase' },
  { id: 'a1', text: 'Khách hàng', type: 'actor' },
  { id: 'a2', text: 'Ngân hàng Trung tâm', type: 'actor' }
];

const VALID_CONNECTIONS = [
  { p1: 'a1', p2: 'u1' },
  { p1: 'a1', p2: 'u2' },
  { p1: 'a2', p2: 'u3' }
];

const Step23Canvas = ({ onComplete }) => {
  const [step, setStep] = useState(2); // 2: Drag to boundary, 3: Connect
  const [items, setItems] = useState(initialItems.map(i => ({ ...i, placed: false })));
  const [feedback, setFeedback] = useState(null);
  
  // For step 3:
  const [connections, setConnections] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [lineCoords, setLineCoords] = useState([]);

  const containerRef = useRef(null);
  const itemRefs = useRef({});

  const updateLines = () => {
    if (!containerRef.current || step !== 3) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const newCoords = connections.map(c => {
      const el1 = itemRefs.current[c.sourceId];
      const el2 = itemRefs.current[c.targetId];
      if (!el1 || !el2) return null;
      const r1 = el1.getBoundingClientRect();
      const r2 = el2.getBoundingClientRect();
      return {
        id: c.id,
        x1: r1.left + r1.width/2 - containerRect.left,
        y1: r1.top + r1.height/2 - containerRect.top,
        x2: r2.left + r2.width/2 - containerRect.left,
        y2: r2.top + r2.height/2 - containerRect.top,
      };
    }).filter(Boolean);
    setLineCoords(newCoords);
  };

  useEffect(() => {
    updateLines();
    window.addEventListener('resize', updateLines);
    return () => window.removeEventListener('resize', updateLines);
  }, [connections, step]);

  const handleReset = () => {
    setItems(initialItems.map(i => ({ ...i, placed: false })));
    setConnections([]);
    setSelectedNodeId(null);
    setStep(2);
    setFeedback(null);
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('item', JSON.stringify(item));
  };

  const handleDrop = (e, targetArea) => {
    e.preventDefault();
    const itemStr = e.dataTransfer.getData('item');
    if (!itemStr) return;
    const item = JSON.parse(itemStr);

    if (targetArea === 'inside' && item.type === 'actor') {
      showFeedback('error', `Khoan đã! Chẳng lẽ đội dev định code lại toàn bộ "${item.text}" sao? Nó là tác nhân bên ngoài!`);
    } else if (targetArea === 'outside' && item.type === 'usecase') {
      showFeedback('error', `Sai rồi! "${item.text}" là một chức năng phần mềm, nó phải nằm bên trong Hệ thống.`);
    } else {
      showFeedback('success', `Chuẩn! "${item.text}" đã ở đúng vị trí.`);
      setItems(prev => prev.map(i => i.id === item.id ? { ...i, placed: targetArea } : i));
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleNodeClick = (nodeId) => {
    if (step !== 3) return;

    if (!selectedNodeId) {
      setSelectedNodeId(nodeId);
    } else {
      if (selectedNodeId === nodeId) {
        setSelectedNodeId(null);
        return;
      }

      // Check connection
      const n1 = items.find(i => i.id === selectedNodeId);
      const n2 = items.find(i => i.id === nodeId);
      
      const exists = connections.find(c => (c.sourceId === n1.id && c.targetId === n2.id) || (c.sourceId === n2.id && c.targetId === n1.id));
      if (exists) {
        setSelectedNodeId(null);
        return;
      }

      if (n1.type === 'actor' && n2.type === 'actor') {
        showFeedback('error', 'Sai logic! Các Actor (Người dùng/Hệ thống ngoài) không giao tiếp trực tiếp với nhau trong sơ đồ này.');
        setSelectedNodeId(null);
        return;
      }

      if (n1.type === 'usecase' && n2.type === 'usecase') {
        showFeedback('error', 'Chưa đến lúc nối Use Case với Use Case (Include/Extend)! Ở màn này, hãy tập trung nối Actor với chức năng họ cần dùng.');
        setSelectedNodeId(null);
        return;
      }

      const isMatch = VALID_CONNECTIONS.find(v => (v.p1 === n1.id && v.p2 === n2.id) || (v.p1 === n2.id && v.p2 === n1.id));
      
      if (isMatch) {
        showFeedback('success', 'Nối chính xác!');
        setConnections([...connections, { id: Date.now().toString(), sourceId: n1.id, targetId: n2.id }]);
      } else {
        if ((n1.id === 'a1' && n2.id === 'u3') || (n1.id === 'u3' && n2.id === 'a1')) {
          showFeedback('error', 'Sai! Khách hàng không trực tiếp kiểm tra mã PIN. Hệ thống ATM mới là người ngầm gửi lệnh sang Ngân hàng Trung tâm để kiểm tra!');
        } else if ((n1.id === 'a2' && n2.id === 'u1') || (n1.id === 'u1' && n2.id === 'a2')) {
          showFeedback('error', 'Sai! Ngân hàng Trung tâm không bấm nút rút tiền. Việc đó là của Khách hàng!');
        } else if (n1.id === 'u4' || n2.id === 'u4') {
          showFeedback('error', '"In biên lai" là chức năng tùy chọn đi kèm với Rút tiền. Chúng ta thường chỉ nối Actor với các chức năng chính yếu nhất!');
        } else {
          showFeedback('error', 'Cặp nối này không hợp lý về mặt logic nghiệp vụ.');
        }
      }
      setSelectedNodeId(null);
    }
  };

  const allPlaced = items.every(i => i.placed !== false);
  const allConnected = connections.length === VALID_CONNECTIONS.length;

  const handleProceedToStep3 = () => {
    setStep(3);
    setTimeout(updateLines, 100);
  };

  const renderItem = (item) => {
    if (!item.placed) {
      return (
        <motion.div
          key={item.id} draggable={step === 2 && !item.placed} onDragStart={(e) => handleDragStart(e, item)}
          style={{
            padding: '8px 16px', background: item.type === 'actor' ? '#339af0' : '#fcc419',
            color: item.type === 'actor' ? 'white' : '#495057', borderRadius: '8px',
            fontWeight: 600, cursor: 'grab', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          {item.text}
        </motion.div>
      );
    } else {
      const isSelected = selectedNodeId === item.id;
      if (item.type === 'actor') {
        return (
          <motion.div
            key={item.id}
            ref={el => itemRefs.current[item.id] = el}
            onClick={() => handleNodeClick(item.id)}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              padding: '12px', cursor: step === 3 ? 'crosshair' : 'default',
              borderRadius: '8px',
              boxShadow: isSelected ? '0 0 0 4px rgba(18,184,134,0.3)' : 'none',
              background: isSelected ? 'rgba(230,252,245,0.8)' : 'transparent',
              transition: 'all 0.2s'
            }}
          >
            <User size={50} color="#339af0" strokeWidth={1.5} />
            <span style={{ fontWeight: 600, color: '#339af0', fontSize: '0.9rem', textAlign: 'center' }}>{item.text}</span>
          </motion.div>
        );
      } else {
        return (
          <motion.div
            key={item.id}
            ref={el => itemRefs.current[item.id] = el}
            onClick={() => handleNodeClick(item.id)}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{
              padding: '16px 24px', background: '#fff3bf', border: `2px solid ${isSelected ? '#12b886' : '#fcc419'}`,
              color: '#495057', borderRadius: '50%', fontWeight: 600, cursor: step === 3 ? 'crosshair' : 'default',
              boxShadow: isSelected ? '0 0 0 4px rgba(18,184,134,0.3)' : '0 4px 12px rgba(0,0,0,0.05)', 
              position: 'relative', textAlign: 'center', minWidth: '160px', minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', zIndex: 10
            }}
          >
            {item.text}
          </motion.div>
        );
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--brand-color)' }}>
            {step === 2 ? '17.2 Trò chơi Lãnh thổ (Xác định Ranh giới)' : '17.3 Mạng lưới Chức năng'}
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>
            {step === 2 ? 'Kéo các thẻ vào đúng vị trí: BÊN TRONG hoặc BÊN NGOÀI Hệ thống ATM.' : 'Bấm chọn một Actor và một Use Case tương ứng để nối chúng với nhau.'}
          </p>
        </div>
        <button onClick={handleReset} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ced4da', background: 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', color: '#495057', fontWeight: 600 }}>
          <RotateCcw size={16}/> Làm lại
        </button>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', background: feedback.type === 'error' ? '#ffe3e3' : '#d3f9d8', color: feedback.type === 'error' ? '#e03131' : '#2b8a3e', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, lineHeight: 1.5 }}>
            {feedback.type === 'error' ? <AlertTriangle size={24} style={{ flexShrink: 0 }}/> : <CheckCircle size={24} style={{ flexShrink: 0 }}/>} {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '650px' }}>
        <div 
          ref={containerRef}
          style={{ 
            width: '100%', height: '550px', border: '2px solid #adb5bd', borderRadius: '16px', position: 'relative', overflow: 'hidden',
            backgroundColor: '#f8f9fa',
            backgroundImage: 'radial-gradient(#dee2e6 2px, transparent 2px)',
            backgroundSize: '30px 30px',
            display: 'flex'
          }}
        >
          {step === 3 && (
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 5 }}>
              {lineCoords.map(l => (
                <line key={l.id} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#adb5bd" strokeWidth="3" />
              ))}
            </svg>
          )}

          <div
            onDrop={(e) => handleDrop(e, 'outside')} 
            onDragOver={handleDragOver}
            style={{
              width: '200px', height: '100%', borderRight: '2px dashed #adb5bd', padding: '20px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', paddingTop: '60px',
              position: 'relative'
            }}
          >
            <div style={{ position: 'absolute', top: '16px', left: '0', width: '100%', textAlign: 'center', color: '#868e96', fontWeight: 600, fontSize: '1rem' }}>
              Môi trường
            </div>
            {items.filter(i => step === 2 ? i.placed === 'outside' : (i.type === 'actor' && i.placed === 'outside')).map(renderItem)}
          </div>

          <div style={{ flex: 1, padding: '40px', position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <div 
              onDrop={(e) => handleDrop(e, 'inside')} 
              onDragOver={handleDragOver}
              style={{ 
                width: '100%', background: 'rgba(255, 255, 255, 0.8)', border: '3px solid var(--text-main)', 
                borderRadius: '12px', padding: '40px 20px', display: 'flex', flexDirection: 'column', 
                alignItems: 'center', gap: '24px', position: 'relative' 
              }}
            >
              <div style={{ background: 'var(--text-main)', color: 'white', padding: '6px 20px', borderRadius: '0 0 8px 8px', position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', fontWeight: 600, fontSize: '1.1rem' }}>
                Hệ thống ATM
              </div>
              {items.filter(i => step === 2 ? i.placed === 'inside' : (i.type === 'usecase' && i.placed === 'inside')).map(renderItem)}
            </div>
          </div>
        </div>

        {step === 2 && (
          <div style={{ width: '100%', background: '#e9ecef', borderRadius: '16px', padding: '20px', display: 'flex', gap: '12px', border: '1px solid #ced4da', alignItems: 'center', flexWrap: 'wrap' }}>
            <h4 style={{ color: '#495057', margin: 0, marginRight: '16px' }}>Kho vật liệu:</h4>
            {items.filter(i => !i.placed).map(renderItem)}
            {items.filter(i => !i.placed).length === 0 && <span style={{ color: '#868e96', fontStyle: 'italic' }}>Đã phân loại hết!</span>}
          </div>
        )}
      </div>

      {step === 2 && allPlaced && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
          <button onClick={handleProceedToStep3} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--brand-color)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}>
            Tuyệt vời! Tiếp tục nối dây <ArrowRight size={20} />
          </button>
        </motion.div>
      )}

      {step === 3 && allConnected && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
          <button onClick={onComplete} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--brand-color)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', border: 'none', cursor: 'pointer' }}>
            Hoàn thành sơ đồ! Viết đặc tả <ArrowRight size={20} />
          </button>
        </motion.div>
      )}

    </motion.div>
  );
};

export default Step23Canvas;
