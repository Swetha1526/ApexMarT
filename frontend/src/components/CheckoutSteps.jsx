import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const CheckoutSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="checkout-steps">
      <div className={`step-item ${step1 ? 'active' : ''}`}>
        <div className="step-number">{step1 ? <Check size={14} /> : '1'}</div>
        {step1 ? <Link to="/login">Sign In</Link> : <span>Sign In</span>}
      </div>

      <div className="step-divider" />

      <div className={`step-item ${step2 ? 'active' : ''}`}>
        <div className="step-number">{step2 ? (step3 ? <Check size={14} /> : '2') : '2'}</div>
        {step2 ? <Link to="/shipping">Shipping</Link> : <span>Shipping</span>}
      </div>

      <div className="step-divider" />

      <div className={`step-item ${step3 ? 'active' : ''}`}>
        <div className="step-number">3</div>
        {step3 ? <Link to="/placeorder">Review & Order</Link> : <span>Review & Order</span>}
      </div>
    </div>
  );
};

export default CheckoutSteps;
