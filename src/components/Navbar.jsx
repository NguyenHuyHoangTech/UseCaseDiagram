import React from 'react';
import { Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
        <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
          UseCase Mastery
        </div>
      </Link>
      <div style={{ display: 'flex', gap: '20px', fontWeight: 600 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={20} color="#f59f00" fill="#f59f00" />
          <span>12</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Star size={20} color="#fcc419" fill="#fcc419" />
          <span>850</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
