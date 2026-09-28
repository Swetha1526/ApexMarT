import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, ArrowRight } from 'lucide-react';
import CheckoutSteps from '../components/CheckoutSteps';
import { saveShippingAddress } from '../actions/cartActions';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const userDetails = useSelector((state) => state.userDetails);
  const { user } = userDetails;

  const [address, setAddress] = useState(shippingAddress.address || user?.address || '');
  const [city, setCity] = useState(shippingAddress.city || user?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || user?.postal_code || '');
  const [country, setCountry] = useState(shippingAddress.country || user?.country || 'India');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/placeorder');
  };

  return (
    <div className="container" style={{ maxWidth: '640px', paddingTop: '20px' }}>
      <CheckoutSteps step1 step2 />

      <div className="card" style={{ padding: '36px', borderRadius: 'var(--radius-xl)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'var(--primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
            }}
          >
            <MapPin size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Shipping Information</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
              Where should we deliver your order?
            </p>
          </div>
        </div>

        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label className="form-label">Full Street Address</label>
            <input
              type="text"
              className="form-control"
              placeholder="House/Flat No., Apartment, Street, Landmark"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label className="form-label">City</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Postal / PIN Code</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. 560038"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Country</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. India"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            style={{ marginTop: '16px', gap: '8px' }}
          >
            <span>Proceed to Order Review</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingScreen;
