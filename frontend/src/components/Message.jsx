import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';

const Message = ({ variant = 'info', children }) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <AlertCircle size={20} color="#dc2626" />;
      case 'success':
        return <CheckCircle2 size={20} color="#059669" />;
      case 'warning':
        return <AlertTriangle size={20} color="#d97706" />;
      default:
        return <Info size={20} color="#2563eb" />;
    }
  };

  return (
    <div className={`alert alert-${variant}`}>
      <div style={{ flexShrink: 0, marginTop: '2px' }}>{getIcon()}</div>
      <div style={{ flex: 1, lineHeight: 1.45 }}>{children}</div>
    </div>
  );
};

export default Message;
