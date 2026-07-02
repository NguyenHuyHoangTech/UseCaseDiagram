import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, ArrowRight, Eraser, MoveRight, RotateCcw } from 'lucide-react';

const nodes = [
  { id: 'u1', text: 'Borrow Book', x: 200, y: 200 },
  { id: 'u2', text: 'Check Card', x: 200, y: 350 },
  { id: 'u3', text: 'Pay Late Fee', x: 200, y: 50 }
];

const Step3IncludeExtend = ({ onComplete }) => {
  const [edges, setEdges] = useState([]);
  const [tool, setTool] = useState('include');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleReset = () => {
    setEdges([]);
    setTool('include');
    setSelectedNodeId(null);
    setFeedback(null);
    setSuccess(false);
  };

  const handleNodeClick = (nodeId) => {
    if (tool === 'eraser') return;
    
    if (!selectedNodeId) {
      setSelectedNodeId(nodeId);
    } else {
      if (selectedNodeId !== nodeId) {
        const exists = edges.find(e => (e.from === selectedNodeId && e.to === nodeId) || (e.from === nodeId && e.to === selectedNodeId));
        if (!exists) {
          setEdges([...edges, { id: Date.now().toString(), from: selectedNodeId, to: nodeId, type: tool }]);
        }
      }
      setSelectedNodeId(null);
    }
  };

  const handleEdgeClick = (edgeId) => {
    if (tool === 'eraser') {
      setEdges(edges.filter(e => e.id !== edgeId));
    }
  };

  const handleCheck = () => {
    if (edges.length < 2) {
      showFeedback('error', 'You need to draw at least 2 arrows connecting these 3 functions.');
      return;
    }

    const edgeCheckCard = edges.find(e => (e.from === 'u1' && e.to === 'u2') || (e.from === 'u2' && e.to === 'u1'));
    if (!edgeCheckCard) {
      showFeedback('error', 'Missing relationship between Borrow Book and Check Card.');
      return;
    }
    
    if (edgeCheckCard.type === 'extend') {
      showFeedback('error', 'Logic Error: Checking the card is MANDATORY to prevent book theft. Since it is mandatory, you must use <<include>>.');
      return;
    }
    if (edgeCheckCard.from === 'u2') {
      showFeedback('error', 'Direction Error: The <<include>> arrow must point FROM the base function (Borrow Book) TO the included function (Check Card).');
      return;
    }

    const edgeFine = edges.find(e => (e.from === 'u1' && e.to === 'u3') || (e.from === 'u3' && e.to === 'u1'));
    if (!edgeFine) {
      showFeedback('error', 'Missing relationship between Borrow Book and Pay Late Fee.');
      return;
    }

    if (edgeFine.type === 'include') {
      showFeedback('error', 'Logic Error: If you use <<include>>, it means everyone who borrows a book will be FINED! Paying a fine only happens conditionally, so it should be <<extend>>.');
      return;
    }
    if (edgeFine.from === 'u1') {
      showFeedback('error', 'Direction Error: The <<extend>> arrow must point BACK TO the base function. Meaning from Pay Late Fee pointing BACK TO Borrow Book.');
      return;
    }

    showFeedback('success', 'Exactly! You clearly understand the nature of Include and Extend.');
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
            18.3 Branching Matrix (Include vs Extend)
          </h3>
          <p style={{ color: 'var(--text-muted)' }}>
            Use the toolbar to connect Borrow Book with the other 2 functions. Pay attention to the arrow type and direction!
          </p>
        </div>
        <button onClick={handleReset} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #ced4da', background: 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center', color: '#495057', fontWeight: 600 }}>
          <RotateCcw size={16}/> Retry
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
        <button onClick={() => { setTool('include'); setSelectedNodeId(null); }} style={{ padding: '8px 16px', borderRadius: '8px', border: tool === 'include' ? '2px solid var(--brand-color)' : '1px solid #ced4da', background: tool === 'include' ? '#e6fcf5' : 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <MoveRight size={16}/> &lt;&lt;include&gt;&gt; Arrow
        </button>
        <button onClick={() => { setTool('extend'); setSelectedNodeId(null); }} style={{ padding: '8px 16px', borderRadius: '8px', border: tool === 'extend' ? '2px solid var(--brand-color)' : '1px solid #ced4da', background: tool === 'extend' ? '#e6fcf5' : 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <MoveRight size={16}/> &lt;&lt;extend&gt;&gt; Arrow
        </button>
        <button onClick={() => { setTool('eraser'); setSelectedNodeId(null); }} style={{ padding: '8px 16px', borderRadius: '8px', border: tool === 'eraser' ? '2px solid #fa5252' : '1px solid #ced4da', background: tool === 'eraser' ? '#ffe3e3' : 'white', cursor: 'pointer', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Eraser size={16} color={tool === 'eraser' ? '#fa5252' : 'black'}/> Erase line
        </button>
      </div>

      <div style={{ position: 'relative', width: '100%', height: '600px', background: '#f8f9fa', borderRadius: '16px', border: '2px solid #adb5bd', overflow: 'hidden', backgroundImage: 'radial-gradient(#dee2e6 2px, transparent 2px)', backgroundSize: '30px 30px' }}>
        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#495057" />
            </marker>
          </defs>
          {edges.map(e => {
            const fromNode = nodes.find(n => n.id === e.from);
            const toNode = nodes.find(n => n.id === e.to);
            if (!fromNode || !toNode) return null;
            
            const midX = (fromNode.x + toNode.x) / 2 + 75;
            const midY = (fromNode.y + toNode.y) / 2 + 25;

            return (
              <g key={e.id} onClick={() => handleEdgeClick(e.id)} style={{ cursor: tool === 'eraser' ? 'crosshair' : 'default' }}>
                <line 
                  x1={fromNode.x + 75} y1={fromNode.y + 25} 
                  x2={toNode.x + 75} y2={toNode.y + 25}
                  stroke={tool === 'eraser' ? '#fa5252' : '#495057'} 
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  markerEnd="url(#arrow)"
                />
                <text x={midX} y={midY - 10} textAnchor="middle" fill="#495057" fontSize="14" fontWeight="600" style={{ pointerEvents: 'none' }}>
                  &lt;&lt;{e.type}&gt;&gt;
                </text>
              </g>
            )
          })}
        </svg>

        {nodes.map(n => (
          <div 
            key={n.id}
            onClick={() => handleNodeClick(n.id)}
            style={{
              position: 'absolute',
              left: n.x, top: n.y,
              width: '150px', height: '80px',
              background: '#fff3bf',
              border: `2px solid ${selectedNodeId === n.id ? '#12b886' : '#fcc419'}`,
              borderRadius: '50%',
              display: 'flex', justifyContent: 'center', alignItems: 'center',
              cursor: (tool === 'include' || tool === 'extend') ? 'crosshair' : 'default',
              fontSize: '0.9rem', fontWeight: 600, color: '#495057', textAlign: 'center', padding: '0 10px',
              boxShadow: selectedNodeId === n.id ? '0 0 0 4px rgba(18,184,134,0.2)' : '0 4px 6px rgba(0,0,0,0.05)'
            }}
          >
            {n.text}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px' }}>
        {!success ? (
          <button onClick={handleCheck} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--text-main)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Submit diagram
          </button>
        ) : (
          <button onClick={onComplete} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--brand-color)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Next round <ArrowRight size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Step3IncludeExtend;
