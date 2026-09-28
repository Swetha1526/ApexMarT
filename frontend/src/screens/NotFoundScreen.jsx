import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

const NotFoundScreen = () => {
  return (
    <div className="container" style={{ maxWidth: '540px', textAlign: 'center', paddingTop: '80px' }}>
      <div className="card" style={{ padding: '48px 32px', borderRadius: 'var(--radius-xl)' }}>
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'var(--primary-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'var(--primary)',
          }}
        >
          <Compass size={40} />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--primary)', lineHeight: 1 }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '12px 0 8px' }}>
          Page Not Found
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '28px' }}>
          Oops! The page or product URL you are looking for doesn't exist or has been relocated.
        </p>
        <Link to="/" className="btn btn-primary btn-lg" style={{ gap: '8px' }}>
          <Home size={18} />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundScreen;
