import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bus, LogOut, MapPin, Calendar, Clock } from 'lucide-react';

const Dashboard = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = localStorage.getItem('userEmail');
    if (!savedEmail) {
      navigate('/login');
    } else {
      setEmail(savedEmail);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        color: '#f9fafb',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 2rem',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              background: '#f59e0b',
              borderRadius: '50%',
              width: '2.5rem',
              height: '2.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(245,158,11,0.5)',
            }}
          >
            <Bus size={20} color="#fff" />
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '700' }}>BusGo</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{email}</span>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '0.5rem',
              color: '#f9fafb',
              padding: '0.5rem 1rem',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      {/* Content */}
      <main style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Welcome aboard! 🚌
        </h1>
        <p style={{ color: '#9ca3af', marginBottom: '3rem' }}>
          You are logged in as <strong style={{ color: '#f59e0b' }}>{email}</strong>
        </p>

        {/* Feature Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            { icon: <MapPin size={28} />, title: 'Search Routes', desc: 'Find buses between cities.' },
            { icon: <Calendar size={28} />, title: 'Book Tickets', desc: 'Book seats in minutes.' },
            { icon: <Clock size={28} />, title: 'My Trips', desc: 'View past & upcoming trips.' },
          ].map((card, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '1rem',
                padding: '2rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ color: '#f59e0b', marginBottom: '1rem' }}>{card.icon}</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                {card.title}
              </h3>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
