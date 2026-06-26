import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, ArrowRight, MousePointer2, MoveUpRight, MoveRight, Minus, Eraser, User, RotateCcw } from 'lucide-react';

const initialItems = [
  { id: 'a1', text: 'Khách vãng lai', type: 'actor' },
  { id: 'a2', text: 'Cư dân', type: 'actor' },
  { id: 'a3', text: 'Bảo vệ', type: 'actor' },
  { id: 'a4', text: 'Camera AI', type: 'actor' },
  { id: 'a5', text: 'VNPay', type: 'actor' },
  { id: 'u1', text: 'Quẹt thẻ ra cổng', type: 'usecase' },
  { id: 'u2', text: 'Kiểm tra biển số', type: 'usecase' },
  { id: 'u3', text: 'Tính phí gửi xe', type: 'usecase' },
  { id: 'u4', text: 'Thanh toán QR', type: 'usecase' },
  { id: 'u5', text: 'Xử lý mất thẻ', type: 'usecase' },
  { id: 'a6', text: 'Người lái xe', type: 'actor_hidden' }
];

const fixedPositions = {
  'a1': { x: 50, y: 150 },
  'a2': { x: 50, y: 300 },
  'a6': { x: 200, y: 225 }, 
  'u1': { x: 400, y: 225 }, 
  'u2': { x: 600, y: 100 }, 
  'u3': { x: 600, y: 225 }, 
  'u4': { x: 800, y: 225 }, 
  'u5': { x: 400, y: 400 }, 
  'a3': { x: 200, y: 400 }, 
  'a4': { x: 800, y: 100 }, 
  'a5': { x: 950, y: 225 }, 
};

const Step2Canvas = ({ onComplete }) => {
  const [phase, setPhase] = useState(1);
  const [items, setItems] = useState(initialItems.map(i => ({ ...i, placed: false })));
  
  const [edges, setEdges] = useState([]);
  const [tool, setTool] = useState('select');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  
  const [feedback, setFeedback] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleReset = () => {
    setPhase(1);
    setItems(initialItems.map(i => ({ ...i, placed: false })));
    setEdges([]);
    setTool('select');
    setSelectedNodeId(null);
    setFeedback(null);
    setSuccess(false);
  };

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('item', JSON.stringify(item));
  };

  const handleDrop = (e, targetArea) => {
    e.preventDefault();
    const itemStr = e.dataTransfer.getData('item');
    if (!itemStr) return;
    const item = JSON.parse(itemStr);

    setItems(prev => prev.map(i => i.id === item.id ? { ...i, placed: targetArea } : i));
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleCheckPhase1 = () => {
    if (items.filter(i => i.id !== 'a6').some(i => i.placed === false)) {
      showFeedback('error', 'Vui lòng bố trí hết tất cả các thẻ vào vị trí trước khi kiểm tra.');
      return;
    }

    const vnpayInside = items.find(i => i.id === 'a5' && i.placed === 'inside');
    const cameraInside = items.find(i => i.id === 'a4' && i.placed === 'inside');
    if (vnpayInside || cameraInside) {
      showFeedback('error', 'Lỗi Ranh giới: Tòa nhà của chúng ta không tự code ra VNPay hay lõi nhận diện Camera AI! Chúng ta gọi API của họ. Hãy kéo các Hệ Thống Bên Ngoài này RA KHỎI chiếc hộp Hệ thống.');
      return;
    }

    const useCaseOutside = items.find(i => i.type === 'usecase' && i.placed === 'outside');
    if (useCaseOutside) {
      showFeedback('error', `Lỗi Ranh giới: Chức năng "${useCaseOutside.text}" phải nằm bên TRONG Hệ thống.`);
      return;
    }

    showFeedback('success', 'Bố trí chuẩn xác! Chuyển sang Giai đoạn nối dây (Phase 2).');
    setPhase(2);
  };

  const handleNodeClick = (nodeId) => {
    if (phase !== 2 || tool === 'select' || tool === 'eraser') return;
    
    if (!selectedNodeId) {
      setSelectedNodeId(nodeId);
    } else {
      if (selectedNodeId !== nodeId) {
        setEdges([...edges, { id: Date.now().toString(), from: selectedNodeId, to: nodeId, type: tool }]);
      }
      setSelectedNodeId(null);
    }
  };

  const handleEdgeClick = (edgeId) => {
    if (tool === 'eraser') {
      setEdges(edges.filter(e => e.id !== edgeId));
    }
  };

  const handleCheckPhase2 = () => {
    const gen1 = edges.find(e => e.type === 'generalization' && e.from === 'a1' && e.to === 'a6');
    const gen2 = edges.find(e => e.type === 'generalization' && e.from === 'a2' && e.to === 'a6');
    if (!gen1 || !gen2) {
      showFeedback('error', 'Bạn chưa gom chung Cư dân và Khách vãng lai thành Actor "Người lái xe" bằng mũi tên Kế thừa!');
      return;
    }

    const qrEdge = edges.find(e => (e.from === 'u3' && e.to === 'u4') || (e.from === 'u4' && e.to === 'u3'));
    if (!qrEdge) {
      showFeedback('error', 'Cần kết nối "Tính phí gửi xe" với "Thanh toán QR".');
      return;
    }
    if (qrEdge.type === 'include') {
      showFeedback('error', 'Lỗi Bắt buộc/Tùy chọn: Nếu bạn dùng Include, khách hàng nào cũng BẮT BUỘC phải quẹt QR VNPay? Thanh toán QR chỉ là một <<extend>> của quá trình tính phí!');
      return;
    }
    if (qrEdge.type === 'extend' && qrEdge.from === 'u3') {
      showFeedback('error', 'Sai Hướng: Mũi tên <<extend>> phải chĩa VỀ chức năng gốc (Từ QR chĩa ngược về Tính phí).');
      return;
    }

    const aiEdge = edges.find(e => e.type === 'association' && ((e.from === 'a4' && e.to === 'u2') || (e.from === 'u2' && e.to === 'a4')));
    if (!aiEdge) {
      showFeedback('error', 'Camera AI cần giao tiếp với chức năng Kiểm tra biển số.');
      return;
    }

    showFeedback('success', 'Kỹ năng vẽ đồ thị của bạn thật sự đẳng cấp! Bản vẽ đã qua kiểm duyệt.');
    setSuccess(true);
  };

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 8000);
  };

  const renderItem = (item, isDraggable) => {
    if (!item.placed && isDraggable) {
      return (
        <div key={item.id} draggable onDragStart={(e) => handleDragStart(e, item)} style={{ padding: '8px 16px', background: item.type === 'actor' ? '#339af0' : '#fcc419', color: item.type === 'actor' ? 'white' : '#495057', borderRadius: '8px', fontWeight: 600, cursor: 'grab' }}>
          {item.text}
        </div>
      );
    } else {
      if (item.type.includes('actor')) {
        return (
          <div key={item.id} draggable={isDraggable} onDragStart={(e) => isDraggable && handleDragStart(e, item)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: isDraggable ? 'grab' : 'default', padding: '4px' }}>
            <User size={36} color={item.id === 'a6' ? '#868e96' : '#339af0'} strokeWidth={1.5} />
            <span style={{ fontWeight: 600, color: '#339af0', fontSize: '0.85rem', textAlign: 'center' }}>{item.text}</span>
          </div>
        );
      } else {
        return (
          <div key={item.id} draggable={isDraggable} onDragStart={(e) => isDraggable && handleDragStart(e, item)} style={{ padding: '12px 20px', background: '#fff3bf', border: '2px solid #fcc419', borderRadius: '50%', cursor: isDraggable ? 'grab' : 'default', fontWeight: 600, color: '#495057', fontSize: '0.85rem', textAlign: 'center', minWidth: '120px', minHeight: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {item.text}
          </div>
        );
      }
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--brand-color)' }}>
            19.2 Đấu trường Logic tại Cổng Ra
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>
            {phase === 1 
              ? 'PHA 1: Kéo thả các thành phần vào BÊN TRONG hoặc BÊN NGOÀI chiếc hộp Ranh giới Hệ thống. Cẩn thận với các "Hệ thống ngoài"!'
              : 'PHA 2: Dùng thanh công cụ nối sơ đồ. Đừng quên gom Khách và Cư dân lại nhé!'}
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
            {feedback.type === 'error' ? <AlertTriangle size={24} style={{ flexShrink: 0 }} /> : <CheckCircle size={24} style={{ flexShrink: 0 }} />} {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {phase === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '650px' }}>
          <div 
            onDrop={(e) => handleDrop(e, 'outside')} onDragOver={handleDragOver}
            style={{ width: '100%', height: '550px', background: '#f8f9fa', border: '2px solid #adb5bd', borderRadius: '16px', position: 'relative', overflow: 'hidden', backgroundImage: 'radial-gradient(#dee2e6 2px, transparent 2px)', backgroundSize: '30px 30px' }}
          >
            <div style={{ position: 'absolute', top: '16px', left: '16px', color: '#868e96', fontWeight: 600, fontSize: '1.1rem' }}>Môi trường bên ngoài</div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', padding: '60px 40px 20px 40px', alignItems: 'flex-start' }}>
              {items.filter(i => i.placed === 'outside' && i.id !== 'a6').map(i => renderItem(i, true))}
            </div>

            <div 
              onDrop={(e) => handleDrop(e, 'inside')} onDragOver={handleDragOver}
              style={{ margin: '0 40px 40px 40px', background: 'rgba(255, 255, 255, 0.8)', border: '3px solid var(--text-main)', borderRadius: '8px', minHeight: '250px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', padding: '40px 20px 20px 20px' }}
            >
              <div style={{ background: 'var(--text-main)', color: 'white', padding: '4px 16px', borderRadius: '0 0 8px 8px', position: 'absolute', top: 0, left: '20px', fontWeight: 600 }}>Hệ thống Kiểm soát Ra/Vào</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'center' }}>
                {items.filter(i => i.placed === 'inside' && i.id !== 'a6').map(i => renderItem(i, true))}
              </div>
            </div>
          </div>

          <div style={{ width: '100%', background: '#e9ecef', borderRadius: '16px', padding: '20px', display: 'flex', gap: '12px', border: '1px solid #ced4da', alignItems: 'center', flexWrap: 'wrap' }}>
            <h4 style={{ color: '#495057', margin: 0, marginRight: '16px' }}>Kho vật liệu:</h4>
            {items.filter(i => !i.placed && i.id !== 'a6').map(i => renderItem(i, true))}
            {items.filter(i => !i.placed && i.id !== 'a6').length === 0 && <span style={{ color: '#868e96', fontStyle: 'italic' }}>Đã dọn sạch!</span>}
          </div>
        </div>
      )}

      {phase === 2 && (
        <>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
            <button onClick={() => { setTool('select'); setSelectedNodeId(null); }} style={{ padding: '8px 12px', borderRadius: '8px', border: tool === 'select' ? '2px solid var(--brand-color)' : '1px solid #ced4da', background: tool === 'select' ? '#e6fcf5' : 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}><MousePointer2 size={16}/> Chọn</button>
            <button onClick={() => { setTool('association'); setSelectedNodeId(null); }} style={{ padding: '8px 12px', borderRadius: '8px', border: tool === 'association' ? '2px solid var(--brand-color)' : '1px solid #ced4da', background: tool === 'association' ? '#e6fcf5' : 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}><Minus size={16}/> Nối (Association)</button>
            <button onClick={() => { setTool('generalization'); setSelectedNodeId(null); }} style={{ padding: '8px 12px', borderRadius: '8px', border: tool === 'generalization' ? '2px solid var(--brand-color)' : '1px solid #ced4da', background: tool === 'generalization' ? '#e6fcf5' : 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}><MoveUpRight size={16}/> Kế thừa (Gen)</button>
            <button onClick={() => { setTool('include'); setSelectedNodeId(null); }} style={{ padding: '8px 12px', borderRadius: '8px', border: tool === 'include' ? '2px solid var(--brand-color)' : '1px solid #ced4da', background: tool === 'include' ? '#e6fcf5' : 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}><MoveRight size={16}/> &lt;&lt;include&gt;&gt;</button>
            <button onClick={() => { setTool('extend'); setSelectedNodeId(null); }} style={{ padding: '8px 12px', borderRadius: '8px', border: tool === 'extend' ? '2px solid var(--brand-color)' : '1px solid #ced4da', background: tool === 'extend' ? '#e6fcf5' : 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}><MoveRight size={16}/> &lt;&lt;extend&gt;&gt;</button>
            <button onClick={() => { setTool('eraser'); setSelectedNodeId(null); }} style={{ padding: '8px 12px', borderRadius: '8px', border: tool === 'eraser' ? '2px solid #fa5252' : '1px solid #ced4da', background: tool === 'eraser' ? '#ffe3e3' : 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}><Eraser size={16} color={tool === 'eraser' ? '#fa5252' : 'black'}/> Xóa dây</button>
          </div>

          <div style={{ position: 'relative', width: '100%', height: '650px', background: '#f8f9fa', borderRadius: '16px', border: '2px solid #adb5bd', overflow: 'hidden', backgroundImage: 'radial-gradient(#dee2e6 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
            {/* System Boundary UI */}
            <div style={{ position: 'absolute', top: '50px', left: '300px', width: '450px', height: '450px', border: '3px solid var(--text-main)', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.6)' }}></div>
            <div style={{ position: 'absolute', top: '50px', left: '320px', background: 'var(--text-main)', color: 'white', padding: '4px 16px', borderRadius: '0 0 8px 8px', fontWeight: 600 }}>Hệ thống Kiểm soát Ra/Vào</div>

            <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
              <defs>
                <marker id="triangle" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="white" stroke="#adb5bd" strokeWidth="1" /></marker>
                <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#495057" /></marker>
              </defs>
              {edges.map(e => {
                const fromNode = items.find(n => n.id === e.from);
                const toNode = items.find(n => n.id === e.to);
                if (!fromNode || !toNode) return null;
                
                const fPos = fixedPositions[e.from];
                const tPos = fixedPositions[e.to];
                
                const isActorFrom = fromNode.type.includes('actor');
                const isActorTo = toNode.type.includes('actor');

                const x1 = fPos.x + (isActorFrom ? 30 : 55);
                const y1 = fPos.y + (isActorFrom ? 30 : 25);
                const x2 = tPos.x + (isActorTo ? 30 : 55);
                const y2 = tPos.y + (isActorTo ? 30 : 25);

                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;

                let stroke = tool === 'eraser' ? '#fa5252' : '#adb5bd';
                let markerEnd = '';
                let dash = '';
                if (e.type === 'generalization') markerEnd = 'url(#triangle)';
                if (e.type === 'include' || e.type === 'extend') { stroke = '#495057'; markerEnd = 'url(#arrow)'; dash = '5,5'; }

                return (
                  <g key={e.id} onClick={() => handleEdgeClick(e.id)} style={{ cursor: tool === 'eraser' ? 'crosshair' : 'default' }}>
                    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="2" strokeDasharray={dash} markerEnd={markerEnd} />
                    {(e.type === 'include' || e.type === 'extend') && (
                      <text x={midX} y={midY - 10} textAnchor="middle" fill="#495057" fontSize="12" fontWeight="600" style={{ pointerEvents: 'none' }}>&lt;&lt;{e.type}&gt;&gt;</text>
                    )}
                  </g>
                )
              })}
            </svg>

            {items.map(n => {
              const pos = fixedPositions[n.id];
              if (!pos) return null;
              
              if (n.type.includes('actor')) {
                return (
                  <div 
                    key={n.id} onClick={() => handleNodeClick(n.id)}
                    style={{
                      position: 'absolute', left: pos.x, top: pos.y, width: '60px',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                      cursor: tool !== 'select' ? 'crosshair' : 'default',
                      boxShadow: selectedNodeId === n.id ? '0 0 0 4px rgba(18,184,134,0.2)' : 'none',
                      borderRadius: '8px', padding: '4px', background: n.id === 'a6' ? 'rgba(255,255,255,0.8)' : 'transparent'
                    }}
                  >
                    <User size={40} color={n.id === 'a6' ? '#868e96' : '#339af0'} strokeWidth={1.5} />
                    <span style={{ fontWeight: 600, color: n.id === 'a6' ? '#868e96' : '#339af0', fontSize: '0.8rem', textAlign: 'center' }}>{n.text}</span>
                  </div>
                );
              } else {
                return (
                  <div 
                    key={n.id} onClick={() => handleNodeClick(n.id)}
                    style={{
                      position: 'absolute', left: pos.x, top: pos.y, width: '120px', height: '60px',
                      background: '#fff3bf', border: `2px solid ${selectedNodeId === n.id ? '#12b886' : '#fcc419'}`,
                      borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '0 10px',
                      cursor: tool !== 'select' ? 'crosshair' : 'default',
                      fontSize: '0.8rem', fontWeight: 600, color: '#495057',
                      boxShadow: selectedNodeId === n.id ? '0 0 0 4px rgba(18,184,134,0.2)' : '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    {n.text}
                  </div>
                );
              }
            })}
          </div>
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
        {phase === 1 ? (
          <button onClick={handleCheckPhase1} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--text-main)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Nộp bản vẽ Ranh giới
          </button>
        ) : !success ? (
          <button onClick={handleCheckPhase2} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--text-main)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Đưa sơ đồ vào máy quét
          </button>
        ) : (
          <button onClick={onComplete} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--brand-color)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Tuyệt đỉnh! Sang chướng ngại vật cuối <ArrowRight size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Step2Canvas;
