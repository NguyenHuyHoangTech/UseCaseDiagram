import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCircle, Hexagon, Trash2, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

const tokensData = [
  { id: 'a1', text: 'Student', type: 'actor' },
  { id: 'a2', text: 'Lecturer', type: 'actor' },
  { id: 'u1', text: 'Login', type: 'usecase' },
  { id: 'u2', text: 'Search Book', type: 'usecase' },
  { id: 'u3', text: 'Borrow Book', type: 'usecase' },
  { id: 't1', text: 'overdue borrowing', type: 'trap', msg: '"Overdue borrowing" is a condition/status, not a function. The actual function here is "Pay late fee".' },
  { id: 'u4', text: 'Pay late fee', type: 'usecase' },
  { id: 'a3', text: 'Librarian', type: 'actor' },
  { id: 'u5', text: 'Add new book', type: 'usecase' },
  { id: 't2', text: 'automatically in background', type: 'trap', msg: '"Automatically in background" only indicates the system\'s nature, not an Actor or Use Case.' },
  { id: 'u6', text: 'Check card status', type: 'usecase' },
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
      showFeedback('error', 'Some cards are not in the right bucket! Please check again.');
    } else {
      showFeedback('success', 'Excellent! You have accurately filtered all requirements.');
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
        18.1 Requirement Extraction Challenge
      </h3>
      <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
        Drag cards into 3 buckets. After dragging all of them, click "Check categorization".
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
          The school library serves two main audiences: {renderToken(tokensData[0])} and {renderToken(tokensData[1])}. To use the service, they both must {renderToken(tokensData[2])} to the system. After that, they can {renderToken(tokensData[3])} and {renderToken(tokensData[4])}. However, if they have previously {renderToken(tokensData[5])}, the system requires them to {renderToken(tokensData[6])} right at the time of making a new transaction. Besides, only the {renderToken(tokensData[7])} staff has the right to {renderToken(tokensData[8])} to the inventory. Every book borrowing transaction requires the system to {renderToken(tokensData[9])} {renderToken(tokensData[10])}.
        </div>

        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Actor */}
          <div onDrop={(e) => handleDrop(e, 'actor')} onDragOver={handleDragOver} style={{ flex: 1, background: '#e7f5ff', border: '2px dashed #339af0', borderRadius: '16px', padding: '16px' }}>
            <h4 style={{ color: '#1864ab', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><UserCircle size={20} /> Actor Bucket</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {placedTokens.actor.map(t => <div key={t.id} draggable onDragStart={(e) => handleDragStart(e, t)} style={{ background: '#339af0', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '0.85rem', cursor: 'grab' }}>{t.text}</div>)}
            </div>
          </div>
          {/* Use Case */}
          <div onDrop={(e) => handleDrop(e, 'usecase')} onDragOver={handleDragOver} style={{ flex: 1, background: '#fff3bf', border: '2px dashed #fcc419', borderRadius: '16px', padding: '16px' }}>
            <h4 style={{ color: '#e67700', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><Hexagon size={20} /> Use Case Bucket</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {placedTokens.usecase.map(t => <div key={t.id} draggable onDragStart={(e) => handleDragStart(e, t)} style={{ background: '#fcc419', color: '#495057', padding: '4px 12px', borderRadius: '100px', fontSize: '0.85rem', cursor: 'grab' }}>{t.text}</div>)}
            </div>
          </div>
          {/* Trash */}
          <div onDrop={(e) => handleDrop(e, 'trash')} onDragOver={handleDragOver} style={{ flex: 1, background: '#f8f9fa', border: '2px dashed #adb5bd', borderRadius: '16px', padding: '16px' }}>
            <h4 style={{ color: '#495057', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><Trash2 size={20} /> Trash Bucket</h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {placedTokens.trash.map(t => <div key={t.id} draggable onDragStart={(e) => handleDragStart(e, t)} style={{ background: '#adb5bd', color: 'white', padding: '4px 12px', borderRadius: '100px', fontSize: '0.85rem', cursor: 'grab' }}>{t.text}</div>)}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
        {!success ? (
          <button onClick={handleCheck} disabled={!allPlaced} style={{ padding: '12px 32px', borderRadius: '100px', background: allPlaced ? 'var(--text-main)' : '#dee2e6', color: 'white', fontWeight: 600, border: 'none', cursor: allPlaced ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
            Check categorization
          </button>
        ) : (
          <button onClick={onComplete} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--brand-color)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Perfect! Continue <ArrowRight size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Step1Extract;
