import React, { useState, useEffect } from 'react';
import { Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [zaps, setZaps] = useState(12);
  const [stars, setStars] = useState(850);
  const [animateZap, setAnimateZap] = useState(false);
  const [animateStar, setAnimateStar] = useState(false);

  // Load stats from localStorage
  const loadStats = () => {
    const savedZaps = localStorage.getItem('user-zaps');
    const savedStars = localStorage.getItem('user-stars');
    
    if (savedZaps !== null) {
      const parsedZaps = parseInt(savedZaps, 10);
      if (parsedZaps !== zaps) {
        setZaps(parsedZaps);
        setAnimateZap(true);
        setTimeout(() => setAnimateZap(false), 800);
      }
    } else {
      localStorage.setItem('user-zaps', '12');
    }

    if (savedStars !== null) {
      const parsedStars = parseInt(savedStars, 10);
      if (parsedStars !== stars) {
        setStars(parsedStars);
        setAnimateStar(true);
        setTimeout(() => setAnimateStar(false), 800);
      }
    } else {
      localStorage.setItem('user-stars', '850');
    }
  };

  useEffect(() => {
    loadStats();

    // Listen for custom events triggered by lesson solves
    const handleStatsUpdate = () => {
      loadStats();
    };

    window.addEventListener('stats-updated', handleStatsUpdate);
    window.addEventListener('storage', handleStatsUpdate);

    return () => {
      window.removeEventListener('stats-updated', handleStatsUpdate);
      window.removeEventListener('storage', handleStatsUpdate);
    };
  }, [zaps, stars]);

  return (
    <nav style={{
      background: '#ffffff',
      padding: '16px 32px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--brand-hover)' }}>📐</span> UseCase Mastery
        </div>
      </Link>
      <div style={{ display: 'flex', gap: '20px', fontWeight: 600 }}>
        {/* Zaps Badge */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '20px',
          background: animateZap ? '#fff9db' : 'transparent',
          transform: animateZap ? 'scale(1.15)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          border: animateZap ? '1px solid #ffe066' : '1px solid transparent'
        }}>
          <Zap 
            size={20} 
            color="#f59f00" 
            fill="#f59f00" 
            style={{ 
              transform: animateZap ? 'rotate(20deg) scale(1.2)' : 'none',
              transition: 'transform 0.2s ease'
            }} 
          />
          <span style={{ color: animateZap ? '#f59f00' : 'inherit' }}>{zaps}</span>
        </div>

        {/* Stars Badge */}
        <div 
          onClick={() => window.dispatchEvent(new Event('toggle-hidden-lessons'))}
          style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px',
          padding: '4px 12px',
          borderRadius: '20px',
          background: animateStar ? '#fff9db' : 'transparent',
          transform: animateStar ? 'scale(1.15)' : 'scale(1)',
          transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          border: animateStar ? '1px solid #ffe066' : '1px solid transparent',
          cursor: 'pointer'
        }}>
          <Star 
            size={20} 
            color="#fcc419" 
            fill="#fcc419"
            style={{ 
              transform: animateStar ? 'scale(1.2) rotate(360deg)' : 'none',
              transition: 'transform 0.5s ease'
            }}
          />
          <span style={{ color: animateStar ? '#e67700' : 'inherit' }}>{stars}</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
