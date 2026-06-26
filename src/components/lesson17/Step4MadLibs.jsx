import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, ArrowRight, RotateCcw, Link2 } from 'lucide-react';

const storyText = "Mô tả yêu cầu: Khách hàng đút thẻ vào máy ATM để Rút tiền hoặc Xem số dư. Mọi giao dịch đều yêu cầu hệ thống phải Kiểm tra mã PIN thông qua Hệ thống Ngân hàng Trung tâm. Nếu thành công, máy sẽ nhả tiền. Khách hàng có thể chọn in biên lai hoặc không. Cuối cùng hệ thống kết thúc giao dịch.";

const blanksData = [
  { id: 'm1', label: 'Bước 1', type: 'main', correctAnswer: 'c1' },
  { id: 'm2', label: 'Bước 2', type: 'main', correctAnswer: 'c2' },
  { id: 'm3', label: 'Bước 3', type: 'main', correctAnswer: 'c3' },
  { id: 'm4', label: 'Bước 4 (Tùy chọn)', type: 'main', correctAnswer: 'c4' },
  { id: 'm5', label: 'Bước 5 (Cuối)', type: 'main', correctAnswer: 'c6' },
  { id: 'a1', label: 'Ngoại lệ (Lỗi tại Bước 2)', type: 'alt', correctAnswer: 'c5' },
  { id: 'a2', label: 'Luồng thay thế (Bỏ qua Bước 4)', type: 'alt', correctAnswer: 'c9' }
];

const choicesData = [
  { id: 'c1', text: 'Khách đút thẻ và chọn Rút tiền' },
  { id: 'c2', text: 'Hệ thống kiểm tra mã PIN' },
  { id: 'c3', text: 'Máy ATM nhả tiền' },
  { id: 'c4', text: 'Hệ thống in biên lai' },
  { id: 'c5', text: 'Sai PIN 3 lần -> Khóa thẻ' },
  { id: 'c6', text: 'Hệ thống kết thúc giao dịch' },
  { id: 'c9', text: 'Khách chọn KHÔNG in biên lai' },
  { id: 'c7', text: 'Máy ATM tự động reset' }, // trap
  { id: 'c8', text: 'Gọi điện cho bảo vệ' } // trap
];

const VALID_FLOW_CONNECTIONS = [
  { from: 'm2', to: 'a1', label: 'Tại bước 2, nếu sai PIN...' },
  { from: 'm3', to: 'a2', label: 'Tại bước 3, nếu KHÔNG in...' },
  { from: 'a2', to: 'm5', label: 'Bỏ qua bước 4, nối về đích' }
];

const Step4MadLibs = ({ onComplete }) => {
  const [phase, setPhase] = useState('drag'); // drag, connect
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState(null);
  
  const [connections, setConnections] = useState([]);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [lineCoords, setLineCoords] = useState([]);

  const containerRef = useRef(null);
  const itemRefs = useRef({});

  const updateLines = () => {
    if (!containerRef.current || phase !== 'connect') return;
    const containerRect = containerRef.current.getBoundingClientRect();
    
    const newCoords = connections.map(c => {
      const el1 = itemRefs.current[c.from];
      const el2 = itemRefs.current[c.to];
      if (!el1 || !el2) return null;
      const r1 = el1.getBoundingClientRect();
      const r2 = el2.getBoundingClientRect();
      
      let x1, y1, x2, y2;
      
      if (c.from.startsWith('m') && c.to.startsWith('a')) {
        x1 = r1.left + r1.width; 
        y1 = r1.top + r1.height / 2;
        x2 = r2.left; 
        y2 = r2.top + r2.height / 2;
      } else if (c.from.startsWith('a') && c.to.startsWith('m')) {
        x1 = r1.left; 
        y1 = r1.top + r1.height / 2;
        x2 = r2.left + r2.width; 
        y2 = r2.top + r2.height / 2;
      } else {
        x1 = r1.left + r1.width / 2;
        y1 = r1.top + r1.height / 2;
        x2 = r2.left + r2.width / 2;
        y2 = r2.top + r2.height / 2;
      }

      return {
        id: c.from + '-' + c.to,
        label: c.label,
        x1: x1 - containerRect.left,
        y1: y1 - containerRect.top,
        x2: x2 - containerRect.left,
        y2: y2 - containerRect.top,
      };
    }).filter(Boolean);
    setLineCoords(newCoords);
  };

  useEffect(() => {
    updateLines();
    window.addEventListener('resize', updateLines);
    return () => window.removeEventListener('resize', updateLines);
  }, [connections, phase]);

  const handleReset = () => {
    setPhase('drag');
    setAnswers({});
    setFeedback(null);
    setConnections([]);
    setSelectedBlockId(null);
    setLineCoords([]);
  };

  const handleDragStart = (e, choice) => {
    if (phase !== 'drag') return;
    e.dataTransfer.setData('choice', JSON.stringify(choice));
  };

  const handleDrop = (e, blankId) => {
    if (phase !== 'drag') return;
    e.preventDefault();
    const choiceStr = e.dataTransfer.getData('choice');
    if (!choiceStr) return;
    const choice = JSON.parse(choiceStr);

    const blank = blanksData.find(b => b.id === blankId);
    if (blank.correctAnswer === choice.id) {
      showFeedback('success', 'Xác định chính xác hành động cho bước này!');
      setAnswers(prev => ({ ...prev, [blankId]: choice }));
    } else {
      showFeedback('error', 'Phân tích sai: Hành động này không thuộc về vị trí hiện tại hoặc nằm ở luồng sự kiện khác.');
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleNodeClick = (blankId) => {
    if (phase !== 'connect') return;

    if (!selectedBlockId) {
      setSelectedBlockId(blankId);
    } else {
      if (selectedBlockId === blankId) {
        setSelectedBlockId(null);
        return;
      }

      const isMatch = VALID_FLOW_CONNECTIONS.find(v => 
        (v.from === selectedBlockId && v.to === blankId) || 
        (v.from === blankId && v.to === selectedBlockId)
      );

      if (isMatch) {
        const alreadyConnected = connections.some(c => c.from === isMatch.from && c.to === isMatch.to);
        if (!alreadyConnected) {
          showFeedback('success', 'Xác định đúng luồng rẽ nhánh/hợp lưu!');
          setConnections(prev => [...prev, isMatch]);
        }
      } else {
        if ((selectedBlockId === 'm4' && blankId === 'a2') || (selectedBlockId === 'a2' && blankId === 'm4')) {
          showFeedback('error', 'Sai vị trí rẽ nhánh: Lựa chọn "in hay không in biên lai" xảy ra NGAY TRƯỚC bước 4 (tức là sau khi kết thúc bước 3), chứ không phải rẽ nhánh từ bước 4!');
        } else {
          showFeedback('error', 'Không hợp lệ: Luồng sự kiện không rẽ nhánh hoặc hợp lưu tại vị trí này.');
        }
      }
      setSelectedBlockId(null);
    }
  };

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 4500);
  };

  const isAllPlaced = blanksData.every(b => answers[b.id]);
  const isAllConnected = connections.length === VALID_FLOW_CONNECTIONS.length;
  const isUsed = (choiceId) => Object.values(answers).some(ans => ans && ans.id === choiceId);

  const mainFlowBlanks = blanksData.filter(b => b.type === 'main');
  const altFlowBlanks = blanksData.filter(b => b.type === 'alt');

  const startConnectPhase = () => {
    setPhase('connect');
    setTimeout(updateLines, 300); // Wait for flex layout transition
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--brand-color)' }}>
          {phase === 'drag' ? '17.4 Xây dựng Đặc tả Use Case (Flow of Events)' : '17.4 Xác định Luồng Sự kiện (Main/Alternative Flow)'}
        </h3>
        <button onClick={handleReset} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ced4da', background: 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', color: '#495057', fontWeight: 600 }}>
          <RotateCcw size={16}/> Làm lại
        </button>
      </div>
      
      <p style={{ color: 'var(--text-muted)', marginBottom: '16px', fontSize: '1.1rem' }}>
        {phase === 'drag' 
          ? 'Kéo thả các khối hành động vào đúng thứ tự trong Luồng sự kiện chính và Luồng thay thế/Ngoại lệ.' 
          : <span><strong>Thiết lập mối quan hệ:</strong> Hãy click chọn 2 khối để tạo đường rẽ nhánh hoặc hợp lưu. Số đường cần thiết lập: <strong style={{color: '#e03131'}}>{3 - connections.length} đường</strong>. Gợi ý: (1) Rẽ nhánh ngoại lệ từ Bước 2, (2) Rẽ nhánh tùy chọn từ Bước 3, (3) Hợp lưu kết thúc về Bước 5.</span>}
      </p>

      <div style={{ background: '#e6fcf5', border: '2px solid #20c997', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', color: '#099268', fontWeight: 500, fontStyle: 'italic', lineHeight: 1.6 }}>
        {storyText}
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', background: feedback.type === 'error' ? '#ffe3e3' : '#d3f9d8', color: feedback.type === 'error' ? '#e03131' : '#2b8a3e', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, zIndex: 50, position: 'relative' }}>
            {feedback.type === 'error' ? <AlertTriangle size={20} style={{ flexShrink: 0 }}/> : <CheckCircle size={20} style={{ flexShrink: 0 }}/>} {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
        {/* Left Side: Specification Flow Area */}
        <div 
          ref={containerRef} 
          style={{ 
            flex: phase === 'drag' ? 2 : 1, 
            display: 'flex', 
            flexDirection: 'row', 
            gap: phase === 'drag' ? '24px' : '60px', 
            position: 'relative' 
          }}
        >
          {/* SVG Overlay for Connections (Only active in connect phase) */}
          {phase === 'connect' && (
            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10, overflow: 'visible' }}>
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#fa5252" />
                </marker>
              </defs>
              {lineCoords.map(l => {
                const midX = (l.x1 + l.x2) / 2;
                const midY = (l.y1 + l.y2) / 2;
                return (
                  <g key={l.id}>
                    <line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="#fa5252" strokeWidth="3" strokeDasharray="5,5" markerEnd="url(#arrow)" />
                    <rect x={midX - 80} y={midY - 14} width="160" height="28" fill="#fff5f5" rx="6" stroke="#fa5252" strokeWidth="1.5" />
                    <text x={midX} y={midY + 4} textAnchor="middle" fill="#c92a2a" fontSize="12" fontWeight="700">{l.label}</text>
                  </g>
                );
              })}
            </svg>
          )}

          {/* Main Flow Column */}
          <div style={{ flex: 1, background: 'white', padding: '24px', borderRadius: '16px', border: '2px solid #339af0', zIndex: 5 }}>
            <h4 style={{ color: '#1864ab', borderBottom: '2px solid #d0ebff', paddingBottom: '12px', marginBottom: '20px', textAlign: 'center' }}>Luồng sự kiện chính</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {mainFlowBlanks.map(blank => {
                const isSelected = selectedBlockId === blank.id;
                return (
                  <div key={blank.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontWeight: 700, color: '#1864ab', fontSize: '0.95rem' }}>{blank.label}:</div>
                    <div 
                      ref={el => itemRefs.current[blank.id] = el}
                      onClick={() => handleNodeClick(blank.id)}
                      onDrop={(e) => handleDrop(e, blank.id)} 
                      onDragOver={handleDragOver}
                      style={{ 
                        width: '100%', background: answers[blank.id] ? '#e7f5ff' : '#f8f9fa', 
                        border: answers[blank.id] ? `2px solid ${isSelected ? '#fa5252' : '#339af0'}` : '2px dashed #adb5bd', 
                        minHeight: '64px', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '12px 16px',
                        color: answers[blank.id] ? '#1864ab' : '#adb5bd', fontWeight: answers[blank.id] ? 600 : 400,
                        cursor: phase === 'connect' && answers[blank.id] ? 'crosshair' : 'default',
                        boxShadow: isSelected ? '0 0 0 4px rgba(250,82,82,0.2)' : 'none',
                        transition: 'all 0.2s', fontSize: '0.95rem'
                      }}
                    >
                      {answers[blank.id] ? answers[blank.id].text : 'Thả khối hành động vào đây...'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Alternative Flow Column */}
          <div style={{ flex: 1, background: 'white', padding: '24px', borderRadius: '16px', border: '2px solid #fcc419', zIndex: 5 }}>
            <h4 style={{ color: '#e67700', borderBottom: '2px solid #ffec99', paddingBottom: '12px', marginBottom: '20px', textAlign: 'center' }}>Luồng thay thế / Ngoại lệ</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {altFlowBlanks.map(blank => {
                const isSelected = selectedBlockId === blank.id;
                return (
                  <div key={blank.id} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontWeight: 700, color: '#e67700', fontSize: '0.95rem' }}>{blank.label}:</div>
                    <div 
                      ref={el => itemRefs.current[blank.id] = el}
                      onClick={() => handleNodeClick(blank.id)}
                      onDrop={(e) => handleDrop(e, blank.id)} 
                      onDragOver={handleDragOver}
                      style={{ 
                        width: '100%', background: answers[blank.id] ? '#fff9db' : '#f8f9fa', 
                        border: answers[blank.id] ? `2px solid ${isSelected ? '#fa5252' : '#fcc419'}` : '2px dashed #adb5bd', 
                        minHeight: '64px', borderRadius: '12px', display: 'flex', alignItems: 'center', padding: '12px 16px',
                        color: answers[blank.id] ? '#e67700' : '#adb5bd', fontWeight: answers[blank.id] ? 600 : 400,
                        cursor: phase === 'connect' && answers[blank.id] ? 'crosshair' : 'default',
                        boxShadow: isSelected ? '0 0 0 4px rgba(250,82,82,0.2)' : 'none',
                        transition: 'all 0.2s', fontSize: '0.95rem'
                      }}
                    >
                      {answers[blank.id] ? answers[blank.id].text : 'Thả khối hành động vào đây...'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Inventory Area */}
        {phase === 'drag' && (
          <div style={{ flex: 1, background: '#e9ecef', padding: '24px', borderRadius: '16px', border: '1px solid #ced4da', position: 'sticky', top: '20px' }}>
            <h4 style={{ color: '#495057', marginBottom: '16px', textAlign: 'center' }}>Danh sách Hành động</h4>
            <p style={{ color: '#868e96', fontSize: '0.85rem', marginBottom: '24px', textAlign: 'center' }}>Lựa chọn các bước phù hợp để điền vào đặc tả Use Case.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {choicesData.map(choice => (
                <motion.div
                  key={choice.id}
                  draggable={!isUsed(choice.id)}
                  onDragStart={(e) => handleDragStart(e, choice)}
                  style={{
                    padding: '16px', background: '#fff', border: '2px solid #adb5bd', borderRadius: '12px',
                    cursor: isUsed(choice.id) ? 'default' : 'grab', fontWeight: 600, color: '#495057',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)', opacity: isUsed(choice.id) ? 0.4 : 1,
                    textAlign: 'center'
                  }}
                >
                  {choice.text}
                </motion.div>
              ))}
            </div>

            {isAllPlaced && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: '32px' }}>
                <button onClick={startConnectPhase} style={{ width: '100%', padding: '16px', borderRadius: '12px', background: 'var(--brand-color)', color: 'white', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(18,184,134,0.3)' }}>
                  <Link2 size={20} /> Hoàn thành: Xác định Rẽ nhánh
                </button>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {phase === 'connect' && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
          <button 
            onClick={isAllConnected ? onComplete : undefined} 
            style={{ 
              padding: '16px 40px', borderRadius: '100px', 
              background: isAllConnected ? 'var(--brand-color)' : '#ced4da', 
              color: isAllConnected ? 'white' : '#868e96', 
              fontWeight: 700, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '12px', 
              border: 'none', cursor: isAllConnected ? 'pointer' : 'not-allowed', 
              boxShadow: isAllConnected ? '0 8px 24px rgba(18,184,134,0.4)' : 'none',
              transition: 'all 0.3s'
            }}
          >
            {isAllConnected ? 'Tiếp tục: Xử lý Thay đổi Yêu cầu' : `Cần hoàn thiện luồng sự kiện (${connections.length}/3)`}
            {isAllConnected && <ArrowRight size={24} />}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Step4MadLibs;
