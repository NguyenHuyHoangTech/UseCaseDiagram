import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Zap, CheckCircle2 } from 'lucide-react';

const LessonCompleteModal = ({ show, starsGained = 10, zapsGained = 1, onContinue }) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      <div style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)'
      }}>
        <motion.div 
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          style={{
            background: 'white',
            borderRadius: '24px',
            padding: '40px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            style={{ 
              width: '80px', height: '80px', 
              background: '#d3f9d8', 
              borderRadius: '50%', 
              margin: '0 auto 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}
          >
            <CheckCircle2 size={48} color="#2b8a3e" />
          </motion.div>
          
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#2b2254', marginBottom: '8px' }}>
            Bài học hoàn tất!
          </h2>
          <p style={{ color: '#495057', marginBottom: '32px' }}>
            Bạn đã hoàn thành xuất sắc bài học. Dưới đây là phần thưởng của bạn:
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '32px' }}>
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              <div style={{ width: '60px', height: '60px', background: '#fff9db', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Star size={32} color="#fcc419" fill="#fcc419" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#e67700' }}>+{starsGained}</span>
            </motion.div>
            
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              <div style={{ width: '60px', height: '60px', background: '#fff9db', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap size={32} color="#f59f00" fill="#f59f00" />
              </div>
              <span style={{ fontWeight: 700, fontSize: '1.2rem', color: '#f59f00' }}>+{zapsGained}</span>
            </motion.div>
          </div>
          
          <button 
            onClick={onContinue}
            style={{
              width: '100%',
              padding: '16px',
              background: 'var(--brand-color)',
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(18, 184, 134, 0.3)'
            }}
          >
            Tiếp tục hành trình
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LessonCompleteModal;
