import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Shield, Truck, RefreshCw, CreditCard } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        {/* Value Proposition Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
            paddingBottom: '36px',
            marginBottom: '36px',
            borderBottom: '1px solid #1e293b',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(79, 70, 229, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#818cf8',
              }}
            >
              <Truck size={22} />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>Free & Fast Delivery</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Orders above ₹1,000</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#34d399',
              }}
            >
              <Shield size={22} />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>100% Secure Checkout</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Encrypted payments</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fbbf24',
              }}
            >
              <RefreshCw size={22} />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>Easy 30-Day Returns</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Hassle-free guarantee</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#22d3ee',
              }}
            >
              <CreditCard size={22} />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 600, fontSize: '0.95rem' }}>Multiple Payment Modes</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>UPI, Cards, Net Banking</div>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="footer-grid">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, var(--primary) 0%, #3730a3 100%)',
                  color: 'white',
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingBag size={18} />
              </div>
              <span style={{ color: 'white', fontWeight: 800, fontSize: '1.25rem' }}>
                Apex<span style={{ color: '#818cf8' }}>Mart</span>
              </span>
            </div>
            <p style={{ fontSize: '0.885rem', lineHeight: '1.6', color: '#94a3b8', maxWidth: '320px' }}>
              Full-Stack Academic Major Project built with Django REST Framework, MySQL, React, and Redux.
            </p>
          </div>

          <div>
            <h4 className="footer-heading">Shop Categories</h4>
            <ul className="footer-links">
              <li><Link to="/products?category=Electronics">Electronics & Gadgets</Link></li>
              <li><Link to="/products?category=Fashion">Fashion & Apparel</Link></li>
              <li><Link to="/products?category=Books">Books & Literature</Link></li>
              <li><Link to="/products?category=Accessories">Accessories</Link></li>
              <li><Link to="/products?category=Home">Home & Living</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Account & Orders</h4>
            <ul className="footer-links">
              <li><Link to="/profile">My Account</Link></li>
              <li><Link to="/profile">Order History</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-heading">Tech Stack</h4>
            <ul className="footer-links">
              <li><span style={{ color: '#c7d2fe' }}>Backend:</span> Django & DRF</li>
              <li><span style={{ color: '#c7d2fe' }}>Database:</span> MySQL</li>
              <li><span style={{ color: '#c7d2fe' }}>Frontend:</span> React & Redux</li>
              <li><span style={{ color: '#c7d2fe' }}>Auth:</span> JWT Tokens</li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div>
            © {new Date().getFullYear()} ApexMart E-Commerce Platform. Major Project Demonstration.
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
