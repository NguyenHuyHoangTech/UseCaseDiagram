import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

const tokensData = [
  { id: 'u1', text: 'Swipe access card', target: 'pkg1' },
  { id: 'u2', text: 'Scan license plate', target: 'pkg1' },
  { id: 'u3', text: 'Calculate parking fee', target: 'pkg2', trapPkg: 'pkg1', trapMsg: 'Business boundary error: The "Calculate parking fee" function involves cash flow, it must be in [Financial Management]. The entrance gate only cares about opening the barrier, let accounting handle the money!' },
  { id: 'u4', text: 'QR Code Payment', target: 'pkg2', trapPkg: 'pkg1', trapMsg: 'QR payment also involves cash flow, it is not managed by the gate barrier!' },
  { id: 'u5', text: 'View revenue report', target: 'pkg2' },
  { id: 'u6', text: 'Add new resident card', target: 'pkg3' },
];

const packages = [
  { id: 'pkg1', name: 'Access Control', color: '#e7f5ff', border: '#339af0' },
  { id: 'pkg2', name: 'Financial Management', color: '#fff3bf', border: '#fcc419' },
  { id: 'pkg3', name: 'Resident Management', color: '#f4fce3', border: '#94d82d' }
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
      showFeedback('error', `The function "${token.text}" does not belong to this subsystem!`);
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
      showFeedback('error', 'Please categorize all functions into Subsystems.');
      return;
    }

    showFeedback('success', 'Great! You have successfully applied divide and conquer.');
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
        19.1 "Divide and Conquer" Skill (Package Diagram)
      </h3>
      <p style={{ marginBottom: '16px', color: 'var(--text-muted)' }}>
        The building needs a complex parking management system. Help me group the distributed functions below into the correct 3 core Subsystems (Packages). Beware of confusing business boundaries!
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
              {placedTokens[pkg.id].length === 0 && <span style={{ color: '#868e96', fontStyle: 'italic', fontSize: '0.85rem' }}>Drop here...</span>}
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
          {allPlaced && <span style={{ color: '#868e96', fontStyle: 'italic', padding: '8px' }}>Empty inventory</span>}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
        {!success ? (
          <button onClick={handleCheck} disabled={!allPlaced} style={{ padding: '12px 32px', borderRadius: '100px', background: allPlaced ? 'var(--text-main)' : '#dee2e6', color: 'white', fontWeight: 600, border: 'none', cursor: allPlaced ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}>
            Decompose System
          </button>
        ) : (
          <button onClick={onComplete} style={{ padding: '12px 32px', borderRadius: '100px', background: 'var(--brand-color)', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Zoom into Access Control Subsystem <ArrowRight size={20} />
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default Step1Packages;
