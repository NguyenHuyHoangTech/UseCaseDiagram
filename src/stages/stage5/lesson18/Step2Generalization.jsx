import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, ArrowRight, MousePointer2, Eraser, MoveUpRight, Minus, User, RotateCcw } from 'lucide-react';

const initialNodes = [
  { id: 'n1', text: 'Sinh viên', type: 'actor', x: 100, y: 250 },
  { id: 'n2', text: 'Giảng viên', type: 'actor', x: 300, y: 250 },
  { id: 'n3', text: 'Đăng nhập', type: 'usecase', x: 100, y: 400 },
  { id: 'n4', text: 'Tìm kiếm sách', type: 'usecase', x: 250, y: 400 },
  { id: 'n5', text: 'Mượn sách', type: 'usecase', x: 400, y: 400 },
  { id: 'n6', text: '', type: 'actor_hidden', x: 200, y: 100 }
];

const initialEdges = [
  { id: 'e1', from: 'n1', to: 'n3', type: 'association' },
  { id: 'e2', from: 'n1', to: 'n4', type: 'association' },
  { id: 'e3', from: 'n1', to: 'n5', type: 'association' },
  { id: 'e4', from: 'n2', to: 'n3', type: 'association' },
  { id: 'e5', from: 'n2', to: 'n4', type: 'association' },
  { id: 'e6', from: 'n2', to: 'n5', type: 'association' },
];

const Step2Generalization = ({ onComplete }) => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [tool, setTool] = useState('select');
  const [feedback, setFeedback] = useState(null);
  const [success, setSuccess] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const handleReset = () => {
    setNodes(initialNodes);
    setEdges(initialEdges);
    setTool('select');
    setSelectedNodeId(null);
    setFeedback(null);
    setSuccess(false);
  };

  const handleNodeClick = (nodeId) => {
    if (tool === 'select' || tool === 'eraser') return;
    
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

  const updateHiddenName = (val) => {
    setNodes(nodes.map(n => n.id === 'n6' ? { ...n, text: val } : n));
  };

  const handleCheck = () => {
    const hiddenNode = nodes.find(n => n.id === 'n6');
    if (!hiddenNode.text.trim()) {
      showFeedback('error', 'Vui lòng đặt tên cho Actor ẩn danh (VD: Bạn đọc).');
      return;
    }

    const backwardGen = edges.find(e => e.type === 'generalization' && e.from === 'n6');
    if (backwardGen) {
      showFeedback('error', 'Sai hướng Kế thừa: Mũi tên tam giác rỗng phải chĩa từ Đứa con (Sinh viên) lên Cha (Bạn đọc). Bạn đang vẽ ngược!');
      return;
    }

    const svGen = edges.find(e => e.type === 'generalization' && e.from === 'n1' && e.to === 'n6');
    const gvGen = edges.find(e => e.type === 'generalization' && e.from === 'n2' && e.to === 'n6');
    if (!svGen || !gvGen) {
      showFeedback('error', 'Chưa đúng! Cần nối Sinh viên và Giảng viên LÊN Actor Cha bằng mũi tên Kế thừa.');
      return;
    }

    const oldMessy = edges.filter(e => (e.from === 'n1' || e.from === 'n2') && e.type === 'association');
    if (oldMessy.length > 0) {
      showFeedback('error', 'Hãy dùng cục tẩy (Eraser) xóa hết các đường chằng chịt cũ đi nhé!');
      return;
    }

    const b1 = edges.find(e => e.type === 'association' && (e.from === 'n6' && e.to === 'n3') || (e.from === 'n3' && e.to === 'n6'));
    const b2 = edges.find(e => e.type === 'association' && (e.from === 'n6' && e.to === 'n4') || (e.from === 'n4' && e.to === 'n6'));
    const b3 = edges.find(e => e.type === 'association' && (e.from === 'n6' && e.to === 'n5') || (e.from === 'n5' && e.to === 'n6'));

    if (!b1 || !b2 || !b3) {
      showFeedback('error', 'Sau khi tạo Actor Cha, bạn cần nối Actor đó với 3 Use Case dùng chung.');
      return;
    }

    showFeedback('success', 'Tuyệt vời! Sơ đồ giờ đã gọn gàng và chuẩn xác.');
    setSuccess(true);
  };

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 6000);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '8px', color: 'var(--brand-color)' }}>
            18.2 Trò chơi Gia phả (Generalization)
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Bãi chiến trường! Hãy dọn dẹp các đường chằng chịt, đặt tên cho Actor Cha và kế thừa.
          </p>
        </div>
        <button onClick={handleReset} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ced4da', background: 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', color: '#495057', fontWeight: 600 }}>
          <RotateCcw size={16}/> Làm lại
        </button>
      </div>

      <AnimatePresence>
        {feedback && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            style={{ padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', background: feedback.type === 'error' ? '#ffe3e3' : '#d3f9d8', color: feedback.type === 'error' ? '#e03131' : '#2b8a3e', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}>
            {feedback.type === 'error' ? <AlertTriangle size={20} /> : <CheckCircle size={20} />} {feedback.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <button onClick={() => { setTool('select'); setSelectedNodeId(null); }} style={{ padding: '8px 16px', borderRadius: '8px', border: tool === 'select' ? '2px solid var(--brand-color)' : '1px solid #ced4da', background: tool === 'select' ? '#e6fcf5' : 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <MousePointer2 size={16}/> Chọn
        </button>
        <button onClick={() => { setTool('eraser'); setSelectedNodeId(null); }} style={{ padding: '8px 16px', borderRadius: '8px', border: tool === 'eraser' ? '2px solid #fa5252' : '1px solid #ced4da', background: tool === 'eraser' ? '#ffe3e3' : 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Eraser size={16} color={tool === 'eraser' ? '#fa5252' : 'black'}/> Xóa dây
        </button>
        <button onClick={() => { setTool('generalization'); setSelectedNodeId(null); }} style={{ padding: '8px 16px', borderRadius: '8px', border: tool === 'generalization' ? '2px solid var(--brand-color)' : '1px solid #ced4da', background: tool === 'generalization' ? '#e6fcf5' : 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <MoveUpRight size={16}/> Mũi tên Kế thừa
        </button>
        <button onClick={() => { setTool('association'); setSelectedNodeId(null); }} style={{ padding: '8px 16px', borderRadius: '8px', border: tool === 'association' ? '2px solid var(--brand-color)' : '1px solid #ced4da', background: tool === 'association' ? '#e6fcf5' : 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Minus size={16}/> Mũi tên Nối
        </button>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '650px', background: '#f8f9fa', borderRadius: '16px', border: '2px solid #adb5bd', overflow: 'hidden', backgroundImage: 'radial-gradient(#dee2e6 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <defs>
            <marker id="triangle" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="white" stroke="#adb5bd" strokeWidth="1" />
            </marker>
          </defs>
          {edges.map(e => {
            const fromNode = nodes.find(n => n.id === e.from);
            const toNode = nodes.find(n => n.id === e.to);
            if (!fromNode || !toNode) return null;
            
            const isActorFrom = fromNode.type.includes('actor');
            const isActorTo = toNode.type.includes('actor');
            
            const fromX = fromNode.x + (isActorFrom ? 30 : 60);
            const fromY = fromNode.y + (isActorFrom ? 30 : 25);
            const toX = toNode.x + (isActorTo ? 30 : 60);
            const toY = toNode.y + (isActorTo ? 30 : 25);

            return (
              <line 
                key={e.id}
                x1={fromX} y1={fromY} 
                x2={toX} y2={toY}
                stroke={tool === 'eraser' ? '#fa5252' : '#adb5bd'} 
                strokeWidth="2"
                markerEnd={e.type === 'generalization' ? 'url(#triangle)' : ''}
                onClick={() => handleEdgeClick(e.id)}
                style={{ cursor: tool === 'eraser' ? 'crosshair' : 'default' }}
              />
            )
          })}
        </svg>

        {nodes.map(n => {
          if (n.type.includes('actor')) {
            return (
              <div 
                key={n.id} onClick={() => handleNodeClick(n.id)}
                style={{ position: 'absolute', left: n.x, top: n.y, width: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: (tool === 'generalization' || tool === 'association') ? 'crosshair' : 'default', boxShadow: selectedNodeId === n.id ? '0 0 0 4px rgba(18,184,134,0.2)' : 'none', borderRadius: '8px', padding: '4px' }}
              >
                <User size={40} color={n.id === 'n6' ? '#868e96' : '#339af0'} strokeWidth={1.5} />
                {n.type === 'actor_hidden' ? (
                  <input type="text" placeholder="Tên Actor?" value={n.text} onChange={e => updateHiddenName(e.target.value)} onClick={e => e.stopPropagation()} style={{ width: '80px', border: '1px solid #ced4da', borderRadius: '4px', background: 'white', textAlign: 'center', outline: 'none', fontWeight: 600, fontSize: '0.8rem' }} />
                ) : (
                  <span style={{ fontWeight: 600, color: '#339af0', fontSize: '0.8rem', textAlign: 'center' }}>{n.text}</span>
                )}
              </div>
            );
          } else {
            return (
              <div 
                key={n.id} onClick={() => handleNodeClick(n.id)}
                style={{ position: 'absolute', left: n.x, top: n.y, width: '120px', height: '60px', background: '#fff3bf', border: `2px solid ${selectedNodeId === n.id ? '#12b886' : '#fcc419'}`, borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: (tool === 'generalization' || tool === 'association') ? 'crosshair' : 'default', fontSize: '0.85rem', fontWeight: 600, color: '#495057', boxShadow: selectedNodeId === n.id ? '0 0 0 4px rgba(18,184,134,0.2)' : '0 4px 6px rgba(0,0,0,0.05)', textAlign: 'center', padding: '0 10px' }}
              >
                {n.text}
              </div>
            );
          }
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
        {!success ? (
          <button onClick={handleCheck} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--text-main)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Chốt sơ đồ
          </button>
        ) : (
          <button onClick={onComplete} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--brand-color)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Tiếp tục <ArrowRight size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Step2Generalization;
