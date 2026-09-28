import React from 'react';

const Loader = ({ text = 'Loading...' }) => {
  return (
    <div className="spinner-container">
      <div className="spinner"></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 500 }}>
        {text}
      </p>
    </div>
  );
};

export default Loader;
